import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createPaymentLink } from '@/lib/services/midtrans';
import { sendPaymentLinkToParent } from '@/lib/services/email';

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

export async function POST(req: NextRequest) {
  // Auth check
  if (!verifyAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { registrationId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { registrationId } = body;
  if (!registrationId || typeof registrationId !== 'string') {
    return NextResponse.json({ error: 'registrationId is required' }, { status: 400 });
  }

  const supabase = getSupabase();

  // Fetch registration
  const { data: reg, error: fetchError } = await supabase
    .from('pendaftaran_santri')
    .select('id, nama_lengkap, no_whatsapp_ortu, email_ortu, payment_status, order_id')
    .eq('id', registrationId)
    .single();

  if (fetchError || !reg) {
    return NextResponse.json({ error: 'Pendaftaran tidak ditemukan' }, { status: 404 });
  }

  if (reg.payment_status !== 'pending') {
    return NextResponse.json(
      { error: `Status pembayaran saat ini adalah "${reg.payment_status}", bukan "pending"` },
      { status: 409 }
    );
  }

  if (!reg.order_id) {
    return NextResponse.json({ error: 'order_id tidak ditemukan pada data pendaftaran' }, { status: 400 });
  }

  // Sanitasi nomor telepon — Midtrans hanya terima angka, +, (), spasi, dan -
  const sanitizePhone = (phone: string) => phone.replace(/[^\d+\-()\s]/g, '').trim();

  // Call Midtrans
  let paymentResponse: { payment_url: string; order_id: string };
  try {
    paymentResponse = await createPaymentLink({
      order_id: reg.order_id,
      gross_amount: 200000,
      customer_details: {
        first_name: reg.nama_lengkap,
        phone: sanitizePhone(reg.no_whatsapp_ortu),
        email: reg.email_ortu ?? undefined,
      },
      item_details: [
        {
          id: 'biaya_pendaftaran',
          price: 200000,
          quantity: 1,
          name: 'Biaya Pendaftaran Santri Baru',
        },
      ],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal menghubungi Midtrans';
    console.error('[generate-payment-link] Midtrans error:', err);
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const paymentUrl = paymentResponse.payment_url;

  // Update registration record
  const { error: updateError } = await supabase
    .from('pendaftaran_santri')
    .update({ payment_link: paymentUrl, updated_at: new Date().toISOString() })
    .eq('id', registrationId);

  if (updateError) {
    console.error('[generate-payment-link] DB update error:', updateError);
    return NextResponse.json({ error: 'Gagal menyimpan link pembayaran' }, { status: 500 });
  }

  // Insert payment log
  const { error: logError } = await supabase.from('payment_logs').insert([
    {
      registration_id: registrationId,
      order_id: reg.order_id,
      action: 'link_generated',
      details: { payment_url: paymentUrl },
      performed_by: 'admin',
    },
  ]);

  if (logError) {
    console.error('[generate-payment-link] Log insert error:', logError);
    // Non-fatal — continue
  }

  // Send email to parent (non-blocking)
  sendPaymentLinkToParent(
    {
      id: reg.id,
      nama_lengkap: reg.nama_lengkap,
      no_whatsapp_ortu: reg.no_whatsapp_ortu,
      email_ortu: reg.email_ortu ?? null,
      order_id: reg.order_id,
    },
    paymentUrl
  ).catch((err) => console.error('[generate-payment-link] Email error:', err));

  return NextResponse.json({ success: true, paymentLink: paymentUrl });
}
