import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { BIAYA_PENDAFTARAN } from '@/lib/config/psb';
import { verifyCallbackSignature } from '@/lib/services/midtrans';
import { sendUserPaymentConfirmation } from '@/lib/services/email';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { getRegistrantContact } from '@/lib/utils/registration';
import type { MidtransCallbackPayload, PaymentStatus } from '@/lib/types/registration';

// Midtrans sends gross_amount as "200000.00"
const EXPECTED_AMOUNT = BIAYA_PENDAFTARAN.toFixed(2);

const REGISTRATION_COLUMNS =
  'id, nama_lengkap, no_whatsapp_ortu, email_ortu, no_whatsapp_wali, email_wali, order_id, payment_status, payment_amount, payment_date';

/**
 * Cari pendaftaran berdasarkan order_id dari Midtrans.
 *
 * Midtrans appends a timestamp suffix to our order_id when creating payment links
 * e.g. our order_id: PSB-1779109027046-Z115YL
 *      Midtrans sends: PSB-1779109027046-Z115YL-1779109125639
 * So we try exact match first, then prefix match. Bila admin sudah membuat link
 * baru, order_id lama hanya tercatat di payment_logs — dicari di sana terakhir.
 */
async function findRegistrationByOrderId(supabase: SupabaseClient, orderId: string) {
  const baseOrderId = orderId.split('-').slice(0, -1).join('-');
  const candidates = [...new Set([orderId, baseOrderId].filter(Boolean))];

  for (const candidate of candidates) {
    const { data } = await supabase
      .from('pendaftaran_santri')
      .select(REGISTRATION_COLUMNS)
      .eq('order_id', candidate)
      .maybeSingle();
    if (data) return data;
  }

  const { data: log } = await supabase
    .from('payment_logs')
    .select('registration_id')
    .in('order_id', candidates)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!log?.registration_id) return null;

  const { data } = await supabase
    .from('pendaftaran_santri')
    .select(REGISTRATION_COLUMNS)
    .eq('id', log.registration_id)
    .maybeSingle();
  return data;
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
    console.error('[midtrans-callback] Invalid JSON payload');
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { order_id, transaction_status, fraud_status, gross_amount, signature_key, status_code } =
    payload;

  console.log('[midtrans-callback] Received notification:', {
    order_id,
    transaction_status,
    fraud_status,
    gross_amount,
    status_code,
  });

  // ── Validate required fields ──────────────────────────────────────────────
  if (!order_id || !transaction_status || !signature_key || !status_code || !gross_amount) {
    console.error('[midtrans-callback] Missing required fields:', payload);
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
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // ── Validate payment amount ───────────────────────────────────────────────
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

  const supabase = getSupabaseAdmin();

  // ── Fetch registration by order_id ────────────────────────────────────────
  const reg = await findRegistrationByOrderId(supabase, order_id);

  if (!reg) {
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

  // ── Lunas bersifat final ──────────────────────────────────────────────────
  // Satu link bisa menghasilkan beberapa transaksi (mis. VA BCA dibuat tapi
  // tidak dibayar, lalu bayar lewat QRIS). Notifikasi "expire"/"cancel" dari
  // transaksi yang ditinggalkan tidak boleh menimpa status lunas.
  if (reg.payment_status === 'paid') {
    console.warn(
      `[midtrans-callback] Ignoring "${transaction_status}" for order_id ${order_id}: registration ${reg.id} is already paid`
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
      email: getRegistrantContact(reg).email,
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
