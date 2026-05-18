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
    registration_id: data.id,
    order_id: data.order_id ?? '-',
    tanggal_daftar: new Date(data.created_at).toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
    }),
    admin_dashboard_url: adminDashboardUrl,
    pesan: `Pendaftaran baru telah masuk dari ${data.nama_lengkap}. Silakan buka dashboard admin untuk membuat link pembayaran dan mengirimkannya ke orang tua.`,
  });
}

/**
 * Sends a payment confirmation to the parent/user after successful payment.
 * Triggered by the Midtrans callback webhook when status = 'paid'.
 */
export async function sendUserPaymentConfirmation(
  data: Pick<
    RegistrationRecord,
    | 'id'
    | 'nama_lengkap'
    | 'no_whatsapp_ortu'
    | 'email_ortu'
    | 'order_id'
    | 'payment_amount'
    | 'payment_date'
  >
): Promise<void> {
  // Only send to user email if provided; admin tidak perlu terima konfirmasi pembayaran
  const recipients: string[] = [];
  if (data.email_ortu) {
    recipients.push(data.email_ortu);
  }

  // Kalau tidak ada email orang tua, tidak perlu kirim email
  if (recipients.length === 0) {
    console.info(`[email] No email_ortu for registration ${data.id}, skipping payment confirmation`);
    return;
  }

  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(data.payment_amount);

  const paymentDate = data.payment_date
    ? new Date(data.payment_date).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
      })
    : new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  await sendEmail({
    type: 'user_payment_confirmation',
    to: recipients.join(','),
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
  data: Pick<
    RegistrationRecord,
    'id' | 'nama_lengkap' | 'no_whatsapp_ortu' | 'email_ortu' | 'order_id'
  >,
  paymentLink: string
): Promise<void> {
  if (!data.email_ortu) {
    // No email provided — admin must send via WhatsApp manually
    console.info(
      `[email] No email_ortu for registration ${data.id}, skipping payment link email`
    );
    return;
  }

  await sendEmail({
    type: 'payment_link_notification',
    to: data.email_ortu,
    subject: `[Link Pembayaran] Pendaftaran ${data.nama_lengkap}`,
    nama_santri: data.nama_lengkap,
    registration_id: data.id,
    order_id: data.order_id ?? '-',
    payment_link: paymentLink,
    jumlah_bayar: 'Rp 200.000',
    pesan: `Berikut adalah link pembayaran biaya pendaftaran santri baru untuk ${data.nama_lengkap}. Silakan selesaikan pembayaran sebesar Rp 200.000 melalui link berikut.`,
  });
}
