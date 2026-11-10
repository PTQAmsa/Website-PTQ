import { BIAYA_PENDAFTARAN, PEMBAYARAN_ONLINE_AKTIF, formatRupiah } from '@/lib/config/psb';
import type { RegistrationRecord } from '@/lib/types/registration';

// Google Apps Script URL — same service used by Tes Multiple Intelligence
const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_URL ??
  'https://script.google.com/macros/s/AKfycbxxyHqqvETFrPuEDZvRmQvmkhNhLd2DXoyT-pNlK--VXq1BDMMQh6jM2uA2P5hxR5TDlA/exec';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? '';

/**
 * Sends a POST request to the Google Apps Script email relay.
 * Failures are logged but never thrown — email must not break the main flow.
 */
async function sendEmail(payload: Record<string, unknown>): Promise<void> {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(
        `[email] Apps Script responded with ${response.status}: ${await response.text()}`
      );
    }
  } catch (err) {
    console.error('[email] Failed to send email notification:', err);
  }
}

/**
 * Notifies the admin when a new registration is submitted.
 * Sent immediately after the registration record is saved to Supabase.
 */
export async function sendAdminRegistrationNotification(
  data: Pick<
    RegistrationRecord,
    | 'id'
    | 'nama_lengkap'
    | 'no_whatsapp_ortu'
    | 'email_ortu'
    | 'order_id'
    | 'created_at'
    | 'no_pendaftaran'
  >
): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const adminDashboardUrl = `${siteUrl}/admin/pendaftaran/${data.id}`;

  await sendEmail({
    type: 'admin_registration_notification',
    to: ADMIN_EMAIL,
    subject: `[Pendaftaran Baru] ${data.nama_lengkap}`,
    nama_santri: data.nama_lengkap,
    no_whatsapp_ortu: data.no_whatsapp_ortu,
    email_ortu: data.email_ortu ?? '-',
    registration_id: data.no_pendaftaran ?? data.id,
    order_id: data.order_id ?? '-',
    tanggal_daftar: new Date(data.created_at).toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
    }),
    admin_dashboard_url: adminDashboardUrl,
    pesan: PEMBAYARAN_ONLINE_AKTIF
      ? `Pendaftaran baru telah masuk dari ${data.nama_lengkap}. Silakan buka dashboard admin untuk membuat link pembayaran dan mengirimkannya ke orang tua.`
      : `Pendaftaran baru telah masuk dari ${data.nama_lengkap}. Silakan hubungi orang tua/wali melalui WhatsApp, lalu kirimkan link pelengkapan data & dokumen dari dashboard admin.`,
  });
}

/**
 * Sends a payment confirmation to the parent/user after successful payment.
 * Triggered by the Midtrans callback webhook when status = 'paid'.
 */
export async function sendUserPaymentConfirmation(
  data: Pick<RegistrationRecord, 'id' | 'nama_lengkap' | 'order_id' | 'payment_amount' | 'payment_date'> & {
    // Email orang tua ATAU wali (lihat getRegistrantContact)
    email: string | null;
  }
): Promise<void> {
  // Admin tidak perlu terima konfirmasi pembayaran; kalau tidak ada email, lewati
  if (!data.email) {
    console.info(`[email] No parent/guardian email for registration ${data.id}, skipping payment confirmation`);
    return;
  }

  const formattedAmount = formatRupiah(data.payment_amount ?? BIAYA_PENDAFTARAN);

  const paymentDate = data.payment_date
    ? new Date(data.payment_date).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
      })
    : new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  await sendEmail({
    type: 'user_payment_confirmation',
    to: data.email,
    subject: `[Pembayaran Berhasil] Pendaftaran ${data.nama_lengkap}`,
    nama_santri: data.nama_lengkap,
    registration_id: data.id,
    order_id: data.order_id ?? '-',
    jumlah_bayar: formattedAmount,
    tanggal_bayar: paymentDate,
    pesan: `Pembayaran biaya pendaftaran sebesar ${formattedAmount} untuk ${data.nama_lengkap} telah berhasil diterima dan terverifikasi. Kami akan segera menghubungi Anda untuk informasi selanjutnya mengenai proses pendaftaran.`,
  });
}

/**
 * Sends the payment link to the parent after admin generates it.
 */
export async function sendPaymentLinkToParent(
  data: Pick<RegistrationRecord, 'id' | 'nama_lengkap' | 'order_id'> & {
    // Email orang tua ATAU wali (lihat getRegistrantContact)
    email: string | null;
  },
  paymentLink: string
): Promise<void> {
  if (!data.email) {
    // No email provided — admin must send via WhatsApp manually
    console.info(
      `[email] No parent/guardian email for registration ${data.id}, skipping payment link email`
    );
    return;
  }

  const formattedAmount = formatRupiah(BIAYA_PENDAFTARAN);

  await sendEmail({
    type: 'payment_link_notification',
    to: data.email,
    subject: `[Link Pembayaran] Pendaftaran ${data.nama_lengkap}`,
    nama_santri: data.nama_lengkap,
    registration_id: data.id,
    order_id: data.order_id ?? '-',
    payment_link: paymentLink,
    jumlah_bayar: formattedAmount,
    pesan: `Berikut adalah link pembayaran biaya pendaftaran santri baru untuk ${data.nama_lengkap}. Silakan selesaikan pembayaran sebesar ${formattedAmount} melalui link berikut.`,
  });
}

/**
 * Memberi tahu admin bahwa wali sudah melengkapi data & dokumen (tahap 2).
 * Butuh handler "admin_data_lengkap_notification" di Apps Script.
 */
export async function sendAdminDataLengkapNotification(data: {
  id: string;
  no_pendaftaran?: string | null;
  nama_lengkap: string;
  whatsapp: string | null;
  email: string | null;
}): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';

  await sendEmail({
    type: 'admin_data_lengkap_notification',
    to: ADMIN_EMAIL,
    nama_santri: data.nama_lengkap,
    no_whatsapp: data.whatsapp ?? '-',
    email_wali: data.email ?? '-',
    registration_id: data.no_pendaftaran ?? data.id,
    tanggal: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    admin_dashboard_url: `${siteUrl}/admin/pendaftaran/${data.id}`,
  });
}

/**
 * Konfirmasi ke orang tua/wali bahwa formulir singkat sudah diterima.
 * Hanya terkirim bila wali mengisi email. Butuh handler
 * "wali_registration_confirmation" di Apps Script.
 */
export async function sendWaliRegistrationConfirmation(data: {
  to: string;
  nama_wali: string;
  nama_santri: string;
  registration_id: string;
}): Promise<void> {
  await sendEmail({
    type: 'wali_registration_confirmation',
    to: data.to,
    nama_wali: data.nama_wali,
    nama_santri: data.nama_santri,
    registration_id: data.registration_id,
    tanggal_daftar: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
  });
}
