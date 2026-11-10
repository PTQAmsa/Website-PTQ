/**
 * Pilihan jawaban & status pendaftaran santri baru.
 * Dipakai bersama oleh form (browser), API (server), dan dashboard admin —
 * ubah di sini saja supaya validasi server selalu sama dengan form.
 */

export type Opsi = { value: string; label: string };

export const JENIS_PENDAFTARAN: Opsi[] = [
  { value: 'baru', label: 'Santri Baru' },
  { value: 'pindahan', label: 'Pindahan' },
];

export const LULUSAN: Opsi[] = [
  { value: 'SD/MI', label: 'SD / MI' },
  { value: 'SMP/MTs', label: 'SMP / MTs' },
];

export const JENIS_KELAMIN: Opsi[] = [
  { value: 'L', label: 'Laki-laki' },
  { value: 'P', label: 'Perempuan' },
];

/**
 * Hubungan orang yang mendaftarkan (kontak utama) dengan calon santri.
 * "ayah-kandung"/"ibu-kandung" disimpan sebagai hubungan_wali =
 * "orang-tua-kandung" + relasi_whatsapp; selain itu disimpan apa adanya
 * di hubungan_wali (nilai lama form panjang tetap kompatibel).
 */
export const HUBUNGAN_KONTAK: Opsi[] = [
  { value: 'ayah-kandung', label: 'Ayah Kandung' },
  { value: 'ibu-kandung', label: 'Ibu Kandung' },
  { value: 'ayah-tiri', label: 'Ayah Tiri' },
  { value: 'ibu-tiri', label: 'Ibu Tiri' },
  { value: 'orang-tua-angkat', label: 'Orang Tua Angkat' },
  { value: 'kakek-nenek', label: 'Kakek / Nenek' },
  { value: 'paman-bibi', label: 'Paman / Bibi' },
  { value: 'kakak-saudara', label: 'Kakak / Saudara' },
  { value: 'lainnya', label: 'Lainnya' },
];

export const SUMBER_INFO_LAINNYA = 'Lainnya';

export const SUMBER_INFO: Opsi[] = [
  'Media Sosial (Instagram, YouTube, Facebook)',
  'Google / Website',
  'Grup / Pesan WhatsApp',
  'Teman / Keluarga',
  'Brosur / Spanduk',
  'Kajian / Acara Pesantren',
  SUMBER_INFO_LAINNYA,
].map((v) => ({ value: v, label: v }));

export const PENGHASILAN: Opsi[] = [
  '< Rp 3.000.000',
  'Rp 3.000.000 - Rp 5.000.000',
  'Rp 5.000.000 - Rp 7.000.000',
  'Rp 7.000.000 - Rp 9.000.000',
  'Rp 9.000.000 - Rp 11.000.000',
  '> Rp 11.000.000',
].map((v) => ({ value: v, label: v }));

export const STATUS_ANAK: Opsi[] = [
  { value: 'Kandung', label: 'Anak Kandung' },
  { value: 'Angkat', label: 'Anak Angkat' },
  { value: 'Tiri', label: 'Anak Tiri' },
  { value: 'Asuh', label: 'Anak Asuh' },
];

// ── Status pendaftaran (diatur admin) ────────────────────────────────────────

export type StatusPendaftaran = 'baru' | 'dihubungi' | 'tes' | 'diterima' | 'tidak_diterima';

export const STATUS_PENDAFTARAN: { value: StatusPendaftaran; label: string; badge: string }[] = [
  { value: 'baru', label: 'Baru', badge: 'bg-blue-100 text-blue-800' },
  { value: 'dihubungi', label: 'Sudah Dihubungi', badge: 'bg-yellow-100 text-yellow-800' },
  { value: 'tes', label: 'Ikut Tes', badge: 'bg-purple-100 text-purple-800' },
  { value: 'diterima', label: 'Diterima', badge: 'bg-green-100 text-green-800' },
  { value: 'tidak_diterima', label: 'Tidak Diterima', badge: 'bg-gray-200 text-gray-700' },
];

export function isStatusPendaftaran(value: unknown): value is StatusPendaftaran {
  return STATUS_PENDAFTARAN.some((s) => s.value === value);
}

export function statusInfo(value: string | null | undefined) {
  return STATUS_PENDAFTARAN.find((s) => s.value === value) ?? STATUS_PENDAFTARAN[0];
}

// ── Helper ───────────────────────────────────────────────────────────────────

export function isOpsi(list: Opsi[], value: unknown): value is string {
  return typeof value === 'string' && list.some((o) => o.value === value);
}

export function labelOpsi(list: Opsi[], value: string | null | undefined): string {
  if (!value) return '-';
  return list.find((o) => o.value === value)?.label ?? value;
}

/** Label hubungan kontak utama dari kolom tersimpan. */
export function labelHubunganKontak(reg: {
  hubungan_wali?: string | null;
  relasi_whatsapp?: string | null;
  hubungan_dengan_santri?: string | null;
}): string {
  if (reg.hubungan_wali === 'orang-tua-kandung') {
    return reg.relasi_whatsapp?.toLowerCase() === 'ibu' ? 'Ibu Kandung' : 'Ayah Kandung';
  }
  const label = labelOpsi(HUBUNGAN_KONTAK, reg.hubungan_wali);
  return reg.hubungan_wali === 'lainnya' && reg.hubungan_dengan_santri
    ? `Lainnya — ${reg.hubungan_dengan_santri}`
    : label;
}

export const POLA_WHATSAPP = /^\+?[0-9]{9,15}$/;
export const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Nomor WA untuk wa.me: hanya angka, awalan 0 → 62. */
export function nomorWaInternasional(nomor: string): string {
  const digits = nomor.replace(/\D/g, '');
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
}

export function linkWhatsApp(nomor: string, pesan?: string): string {
  const base = `https://wa.me/${nomorWaInternasional(nomor)}`;
  return pesan ? `${base}?text=${encodeURIComponent(pesan)}` : base;
}
