import {
  JENIS_KELAMIN,
  JENIS_PENDAFTARAN,
  LULUSAN,
  PENGHASILAN,
  POLA_EMAIL,
  POLA_WHATSAPP,
  STATUS_ANAK,
  isOpsi,
  type Opsi,
} from '@/lib/psb/pilihan';

/**
 * Kolom yang boleh diubah admin dari halaman detail pendaftar (misalnya wali
 * minta ganti data). Dipakai bersama oleh form edit (browser) dan API
 * /api/admin/edit-pendaftaran supaya hanya kolom ini yang bisa ditulis.
 * Jenis kontak (orang tua kandung ↔ wali) dan dokumen tidak diubah di sini.
 */

export type KolomEdit = {
  column: string;
  label: string;
  grup: string;
  kind: 'text' | 'textarea' | 'date' | 'number' | 'select';
  options?: Opsi[];
  wajib?: boolean;
  max?: number;
  pola?: 'wa' | 'email' | 'nik' | 'nisn';
};

type ModeKontak = { hubungan_wali: string; relasi_whatsapp?: string | null };

export function kolomEdit(reg: ModeKontak): KolomEdit[] {
  const isWali = reg.hubungan_wali !== 'orang-tua-kandung';
  const kontakIbu = reg.relasi_whatsapp?.toLowerCase() === 'ibu';
  const awal = 'Formulir Awal';
  const ortu = 'Orang Tua / Wali';
  const lengkap = 'Data Lengkap';
  const alamat = 'Sekolah & Alamat';

  const kontak: KolomEdit[] = isWali
    ? [
        { column: 'nama_wali', label: 'Nama Wali', grup: ortu, kind: 'text', wajib: true, max: 100 },
        { column: 'hubungan_dengan_santri', label: 'Hubungan dengan Santri', grup: ortu, kind: 'text', max: 100 },
        { column: 'no_whatsapp_wali', label: 'No. WhatsApp', grup: ortu, kind: 'text', wajib: true, max: 15, pola: 'wa' },
        { column: 'email_wali', label: 'Email', grup: ortu, kind: 'text', max: 100, pola: 'email' },
        { column: 'pekerjaan_wali', label: 'Pekerjaan Wali', grup: ortu, kind: 'text', max: 100 },
        { column: 'nama_ayah_kandung', label: 'Nama Ayah Kandung', grup: ortu, kind: 'text', max: 100 },
        { column: 'nama_ibu_kandung', label: 'Nama Ibu Kandung', grup: ortu, kind: 'text', max: 100 },
      ]
    : [
        { column: 'nama_ayah', label: 'Nama Ayah', grup: ortu, kind: 'text', wajib: !kontakIbu, max: 100 },
        { column: 'nama_ibu', label: 'Nama Ibu', grup: ortu, kind: 'text', wajib: kontakIbu, max: 100 },
        { column: 'no_whatsapp_ortu', label: 'No. WhatsApp', grup: ortu, kind: 'text', wajib: true, max: 15, pola: 'wa' },
        { column: 'email_ortu', label: 'Email', grup: ortu, kind: 'text', max: 100, pola: 'email' },
        { column: 'pekerjaan_ayah', label: 'Pekerjaan Ayah', grup: ortu, kind: 'text', max: 100 },
        { column: 'pekerjaan_ibu', label: 'Pekerjaan Ibu', grup: ortu, kind: 'text', max: 100 },
      ];

  return [
    { column: 'nama_lengkap', label: 'Nama Lengkap', grup: awal, kind: 'text', wajib: true, max: 100 },
    { column: 'jenis_kelamin', label: 'Jenis Kelamin', grup: awal, kind: 'select', options: JENIS_KELAMIN, wajib: true },
    { column: 'tanggal_lahir', label: 'Tanggal Lahir', grup: awal, kind: 'date', wajib: true },
    { column: 'jenis_pendaftaran', label: 'Jenis Pendaftaran', grup: awal, kind: 'select', options: JENIS_PENDAFTARAN, wajib: true },
    { column: 'lulusan', label: 'Lulusan', grup: awal, kind: 'select', options: LULUSAN, wajib: true },
    { column: 'asal_sekolah', label: 'Asal Sekolah', grup: awal, kind: 'text', wajib: true, max: 150 },
    { column: 'kota', label: 'Kota / Kabupaten', grup: awal, kind: 'text', wajib: true, max: 100 },
    { column: 'sumber_info', label: 'Tahu PTQ Amsa dari', grup: awal, kind: 'text', max: 160 },
    ...kontak,
    { column: 'penghasilan_ortu', label: 'Penghasilan per Bulan', grup: ortu, kind: 'select', options: PENGHASILAN },
    { column: 'nama_panggilan', label: 'Nama Panggilan', grup: lengkap, kind: 'text', max: 50 },
    { column: 'tempat_lahir', label: 'Tempat Lahir', grup: lengkap, kind: 'text', max: 100 },
    { column: 'nik', label: 'NIK', grup: lengkap, kind: 'text', max: 16, pola: 'nik' },
    { column: 'nisn', label: 'NISN', grup: lengkap, kind: 'text', max: 10, pola: 'nisn' },
    { column: 'anak_ke', label: 'Anak Ke', grup: lengkap, kind: 'number' },
    { column: 'total_saudara', label: 'Jumlah Saudara', grup: lengkap, kind: 'number' },
    { column: 'status_anak', label: 'Status Anak', grup: lengkap, kind: 'select', options: STATUS_ANAK },
    { column: 'no_whatsapp_santri', label: 'No. WhatsApp Santri', grup: lengkap, kind: 'text', max: 15, pola: 'wa' },
    { column: 'alamat_sekolah', label: 'Alamat Sekolah Asal', grup: alamat, kind: 'text', max: 200 },
    { column: 'provinsi', label: 'Provinsi', grup: alamat, kind: 'text', max: 100 },
    { column: 'alamat_domisili', label: 'Alamat Lengkap', grup: alamat, kind: 'textarea', max: 500 },
  ];
}

/** Nilai kosong → null. Mengembalikan pesan error bila tidak valid. */
export function validasiKolom(k: KolomEdit, raw: unknown): { value: string | number | null } | { error: string } {
  const text = raw === null || raw === undefined ? '' : String(raw).trim();
  if (!text) return k.wajib ? { error: `${k.label} wajib diisi.` } : { value: null };
  if (k.max && text.length > k.max) return { error: `${k.label} maksimal ${k.max} karakter.` };

  switch (k.kind) {
    case 'select':
      return isOpsi(k.options ?? [], text) ? { value: text } : { error: `Pilihan ${k.label} tidak valid.` };
    case 'date':
      return /^\d{4}-\d{2}-\d{2}$/.test(text) && !Number.isNaN(Date.parse(text))
        ? { value: text }
        : { error: `${k.label} tidak valid.` };
    case 'number': {
      const n = Number(text);
      return Number.isInteger(n) && n >= 1 && n <= 30 ? { value: n } : { error: `${k.label} harus angka 1–30.` };
    }
  }

  if (k.pola === 'wa' && !POLA_WHATSAPP.test(text)) return { error: `${k.label} tidak valid.` };
  if (k.pola === 'email' && !POLA_EMAIL.test(text)) return { error: `${k.label} tidak valid.` };
  if (k.pola === 'nik' && !/^\d{16}$/.test(text)) return { error: 'NIK harus 16 digit angka.' };
  if (k.pola === 'nisn' && !/^\d{10}$/.test(text)) return { error: 'NISN harus 10 digit angka.' };
  return { value: text };
}
