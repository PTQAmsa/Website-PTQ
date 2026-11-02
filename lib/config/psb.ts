/**
 * Konfigurasi PSB (Penerimaan Santri Baru) yang dipakai lintas server.
 * Ubah nominal di sini saja — Midtrans, callback, email, admin, dan
 * integrasi keuangan semuanya membaca konstanta ini.
 */
export const BIAYA_PENDAFTARAN = 200_000;

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
