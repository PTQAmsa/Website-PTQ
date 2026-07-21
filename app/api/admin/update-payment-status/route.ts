import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { PaymentStatus } from '@/lib/types/registration';

const VALID_STATUSES: PaymentStatus[] = ['pending', 'paid', 'failed', 'expired'];

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key);
}

function verifyAdminAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7);
  const adminPassword = process.env.ADMIN_PASSWORD ?? '';
  return token === adminPassword;
}

export async function PATCH(req: NextRequest) {
  // Auth check
  if (!verifyAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { registrationId?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { registrationId, status } = body;

  if (!registrationId || typeof registrationId !== 'string') {
    return NextResponse.json({ error: 'registrationId is required' }, { status: 400 });
  }

  if (!status || !VALID_STATUSES.includes(status as PaymentStatus)) {
    return NextResponse.json(
      { error: `status harus salah satu dari: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    );
  }

  const newStatus = status as PaymentStatus;
  const supabase = getSupabase();

  // Fetch current registration
  const { data: reg, error: fetchError } = await supabase
    .from('pendaftaran_santri')
    .select('id, order_id, payment_status')
    .eq('id', registrationId)
    .single();

  if (fetchError || !reg) {
    return NextResponse.json({ error: 'Pendaftaran tidak ditemukan' }, { status: 404 });
  }

  const oldStatus = reg.payment_status as PaymentStatus;

  // Build update payload
  const updatePayload: Record<string, unknown> = {
    payment_status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (newStatus === 'paid') {
    updatePayload.payment_date = new Date().toISOString();
  }

  // Update registration
  const { error: updateError } = await supabase
    .from('pendaftaran_santri')
    .update(updatePayload)
    .eq('id', registrationId);

  if (updateError) {
    console.error('[update-payment-status] DB update error:', updateError);
    return NextResponse.json({ error: 'Gagal memperbarui status pembayaran' }, { status: 500 });
  }

  // Insert payment log
  const { error: logError } = await supabase.from('payment_logs').insert([
    {
      registration_id: registrationId,
      order_id: reg.order_id ?? null,
      action: 'status_updated',
      details: { old_status: oldStatus, new_status: newStatus },
      performed_by: 'admin',
    },
  ]);

  if (logError) {
    console.error('[update-payment-status] Log insert error:', logError);
    // Non-fatal
  }

  return NextResponse.json({ success: true });
}
