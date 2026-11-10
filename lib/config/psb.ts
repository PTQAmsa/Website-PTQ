/**
 * Konfigurasi PSB (Penerimaan Santri Baru) yang dipakai lintas server.
 * Ubah nominal di sini saja — Midtrans, callback, email, admin, dan
 * integrasi keuangan semuanya membaca konstanta ini.
 */
export const BIAYA_PENDAFTARAN = 200_000;

/**
 * Pembayaran online lewat Midtrans. Dimatikan selama perizinan Midtrans
 * belum selesai: pendaftaran selesai setelah formulir terkirim, admin tidak
 * bisa membuat link bayar, dan bagian pembayaran disembunyikan dari admin.
 * Ubah ke true setelah akun Midtrans production disetujui.
 */
export const PEMBAYARAN_ONLINE_AKTIF = false;

/**
 * Batas usia calon santri, dihitung pada awal tahun ajaran — bukan saat
 * mendaftar. Syarat tertulis di website juga 11–15 tahun
 * (dulu 12–15, dilonggarkan Nov 2026).
 */
export const USIA_MIN = 11;
export const USIA_MAX = 15;
export const AWAL_TAHUN_AJARAN = '2027-07-01';
export const LABEL_AWAL_TAHUN_AJARAN = 'Juli 2027';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Usia dalam tahun penuh pada `padaTanggal`; null bila tanggal tidak valid. */
export function hitungUsia(tanggalLahir: string, padaTanggal: string = AWAL_TAHUN_AJARAN): number | null {
  const lahir = ISO_DATE.exec(tanggalLahir);
  const acuan = ISO_DATE.exec(padaTanggal);
  if (!lahir || !acuan) return null;

  const [ly, lm, ld] = lahir.slice(1).map(Number);
  const [ay, am, ad] = acuan.slice(1).map(Number);
  const cek = new Date(Date.UTC(ly, lm - 1, ld));
  if (cek.getUTCMonth() !== lm - 1 || cek.getUTCDate() !== ld) return null; // mis. 30 Februari

  return ay - ly - (am < lm || (am === lm && ad < ld) ? 1 : 0);
}

/** Tujuan semua tombol "Daftar" di website. */
export const URL_FORMULIR_PENDAFTARAN = '/pendaftaran-santri-baru#formulir';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
