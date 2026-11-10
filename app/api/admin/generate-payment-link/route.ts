import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { BIAYA_PENDAFTARAN, PEMBAYARAN_ONLINE_AKTIF } from '@/lib/config/psb';
import { createPaymentLink } from '@/lib/services/midtrans';
import { sendPaymentLinkToParent } from '@/lib/services/email';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { generateOrderId } from '@/lib/utils/order-id';
import { getRegistrantContact } from '@/lib/utils/registration';

// Sanitasi nomor telepon — Midtrans hanya terima angka, +, (), spasi, dan -
const sanitizePhone = (phone: string) => phone.replace(/[^\d+\-()\s]/g, '').trim();

export async function POST(req: NextRequest) {
  // Auth check
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!PEMBAYARAN_ONLINE_AKTIF) {
    return NextResponse.json(
      { error: 'Pembayaran online belum diaktifkan (lihat lib/config/psb.ts).' },
      { status: 409 }
    );
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

  const supabase = getSupabaseAdmin();

  // Fetch registration
  const { data: reg, error: fetchError } = await supabase
    .from('pendaftaran_santri')
    .select(
      'id, nama_lengkap, no_whatsapp_ortu, email_ortu, no_whatsapp_wali, email_wali, payment_status, payment_link, order_id'
    )
    .eq('id', registrationId)
    .single();

  if (fetchError || !reg) {
    return NextResponse.json({ error: 'Pendaftaran tidak ditemukan' }, { status: 404 });
  }

  if (reg.payment_status === 'paid') {
    return NextResponse.json(
      { error: 'Pembayaran pendaftaran ini sudah lunas' },
      { status: 409 }
    );
  }

  // Pendaftar lewat wali menyimpan kontak di kolom *_wali, bukan *_ortu
  const contact = getRegistrantContact(reg);
  if (!contact.whatsapp) {
    return NextResponse.json(
      { error: 'Nomor WhatsApp orang tua/wali tidak ditemukan pada data pendaftaran' },
      { status: 400 }
    );
  }

  // Setiap link memakai order_id baru: Midtrans menolak order_id yang sudah
  // pernah dipakai, dan link lama kadaluarsa setelah 24 jam. order_id lama
  // tetap tercatat di payment_logs sehingga callback-nya masih bisa dicocokkan.
  const orderId = generateOrderId();

  // Call Midtrans
  let paymentResponse: { payment_url: string; order_id: string };
  try {
    paymentResponse = await createPaymentLink({
      order_id: orderId,
      gross_amount: BIAYA_PENDAFTARAN,
      customer_details: {
        first_name: reg.nama_lengkap,
        phone: sanitizePhone(contact.whatsapp),
        email: contact.email ?? undefined,
      },
      item_details: [
        {
          id: 'biaya_pendaftaran',
          price: BIAYA_PENDAFTARAN,
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
    .update({
      payment_link: paymentUrl,
      order_id: orderId,
      payment_status: 'pending',
      updated_at: new Date().toISOString(),
    })
    .eq('id', registrationId);

  if (updateError) {
    console.error('[generate-payment-link] DB update error:', updateError);
    return NextResponse.json({ error: 'Gagal menyimpan link pembayaran' }, { status: 500 });
  }

  // Insert payment log
  const { error: logError } = await supabase.from('payment_logs').insert([
    {
      registration_id: registrationId,
      order_id: orderId,
      action: 'link_generated',
      details: {
        payment_url: paymentUrl,
        previous_order_id: reg.order_id ?? null,
        previous_status: reg.payment_status,
      },
      performed_by: 'admin',
    },
  ]);

  if (logError) {
    console.error('[generate-payment-link] Log insert error:', logError);
    // Non-fatal — continue
  }

  // Send email to parent/guardian (non-blocking)
  sendPaymentLinkToParent(
    { id: reg.id, nama_lengkap: reg.nama_lengkap, order_id: orderId, email: contact.email },
    paymentUrl
  ).catch((err) => console.error('[generate-payment-link] Email error:', err));

  return NextResponse.json({ success: true, paymentLink: paymentUrl });
}
