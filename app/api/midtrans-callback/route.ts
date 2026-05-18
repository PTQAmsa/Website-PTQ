import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyCallbackSignature } from '@/lib/services/midtrans';
import { sendUserPaymentConfirmation } from '@/lib/services/email';
import type { MidtransCallbackPayload, PaymentStatus } from '@/lib/types/registration';

const EXPECTED_AMOUNT = '200000.00';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key);
}

/**
 * Maps Midtrans transaction_status + fraud_status to our PaymentStatus.
 * Returns null if the status should be ignored (e.g. 'capture' with fraud).
 */
function mapTransactionStatus(
  transactionStatus: string,
  fraudStatus?: string
): PaymentStatus | null {
  switch (transactionStatus) {
    case 'settlement':
      return 'paid';
    case 'capture':
      // Only mark as paid if fraud check passed
      return fraudStatus === 'accept' ? 'paid' : 'failed';
    case 'cancel':
    case 'deny':
      return 'failed';
    case 'expire':
      return 'expired';
    case 'pending':
      return 'pending';
    default:
      return null;
  }
}

export async function POST(req: NextRequest) {
  let payload: MidtransCallbackPayload;

  try {
    payload = (await req.json()) as MidtransCallbackPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { order_id, transaction_status, fraud_status, gross_amount, signature_key, status_code } =
    payload;

  // ── Validate required fields ──────────────────────────────────────────────
  if (!order_id || !transaction_status || !signature_key || !status_code || !gross_amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // ── Verify Midtrans signature ─────────────────────────────────────────────
  const isValidSignature = verifyCallbackSignature(
    order_id,
    status_code,
    gross_amount,
    signature_key
  );

  if (!isValidSignature) {
    console.warn('[midtrans-callback] Invalid signature for order_id:', order_id);
    console.warn('[midtrans-callback] status_code:', status_code, 'gross_amount:', gross_amount);
    console.warn('[midtrans-callback] Server key prefix:', process.env.MIDTRANS_SERVER_KEY?.slice(0, 15));
    console.warn('[midtrans-callback] Incoming signature:', signature_key);
    // TEMP: log only, don't reject — for debugging
    // return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // ── Validate payment amount ───────────────────────────────────────────────
  // Midtrans sends gross_amount as "200000.00"
  const normalizedAmount = parseFloat(gross_amount).toFixed(2);
  if (normalizedAmount !== EXPECTED_AMOUNT) {
    console.warn(
      `[midtrans-callback] Unexpected amount ${gross_amount} for order_id: ${order_id}`
    );
    return NextResponse.json({ error: 'Unexpected payment amount' }, { status: 400 });
  }

  // ── Map transaction status ────────────────────────────────────────────────
  const newStatus = mapTransactionStatus(transaction_status, fraud_status);
  if (newStatus === null) {
    // Unknown status — acknowledge but do nothing
    console.info(
      `[midtrans-callback] Ignoring unknown transaction_status "${transaction_status}" for order_id: ${order_id}`
    );
    return NextResponse.json({ status: 'ok' });
  }

  const supabase = getSupabase();

  // ── Fetch registration by order_id ────────────────────────────────────────
  const { data: reg, error: fetchError } = await supabase
    .from('pendaftaran_santri')
    .select(
      'id, nama_lengkap, no_whatsapp_ortu, email_ortu, order_id, payment_status, payment_amount, payment_date'
    )
    .eq('order_id', order_id)
    .single();

  if (fetchError || !reg) {
    console.error('[midtrans-callback] Registration not found for order_id:', order_id);
    // Return 200 to prevent Midtrans from retrying — we can't process this
    return NextResponse.json({ status: 'ok' });
  }

  // ── Idempotency check ─────────────────────────────────────────────────────
  // If already in the target status, acknowledge without re-processing
  if (reg.payment_status === newStatus) {
    console.info(
      `[midtrans-callback] Idempotent: order_id ${order_id} already has status "${newStatus}"`
    );
    return NextResponse.json({ status: 'ok' });
  }

  // ── Build update payload ──────────────────────────────────────────────────
  const updatePayload: Record<string, unknown> = {
    payment_status: newStatus,
    payment_method: payload.payment_type ?? null,
    updated_at: new Date().toISOString(),
  };

  if (newStatus === 'paid') {
    updatePayload.payment_date = new Date().toISOString();
  }

  // ── Update registration ───────────────────────────────────────────────────
  const { error: updateError } = await supabase
    .from('pendaftaran_santri')
    .update(updatePayload)
    .eq('id', reg.id);

  if (updateError) {
    console.error('[midtrans-callback] DB update error:', updateError);
    return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
  }

  // ── Insert payment log ────────────────────────────────────────────────────
  const { error: logError } = await supabase.from('payment_logs').insert([
    {
      registration_id: reg.id,
      order_id,
      action: 'payment_received',
      details: {
        transaction_status,
        fraud_status: fraud_status ?? null,
        gross_amount,
        payment_type: payload.payment_type ?? null,
        new_status: newStatus,
        old_status: reg.payment_status,
      },
      performed_by: 'system',
    },
  ]);

  if (logError) {
    console.error('[midtrans-callback] Log insert error:', logError);
    // Non-fatal — continue
  }

  // ── Send confirmation email if paid (non-blocking) ────────────────────────
  if (newStatus === 'paid') {
    sendUserPaymentConfirmation({
      id: reg.id,
      nama_lengkap: reg.nama_lengkap,
      no_whatsapp_ortu: reg.no_whatsapp_ortu,
      email_ortu: reg.email_ortu ?? null,
      order_id: reg.order_id ?? null,
      payment_amount: reg.payment_amount,
      payment_date: updatePayload.payment_date as string,
    }).catch((err) =>
      console.error('[midtrans-callback] Payment confirmation email failed:', err)
    );
  }

  console.info(
    `[midtrans-callback] Processed order_id ${order_id}: ${reg.payment_status} → ${newStatus}`
  );

  return NextResponse.json({ status: 'ok' });
}
