import { BIAYA_PENDAFTARAN } from '@/lib/config/psb';
import type { PaymentStatus, RegistrationRecord } from '@/lib/types/registration';

/**
 * Kontrak data Website PSB → SIKA PTQ (repo PTQAmsa/Keuangan-Santri), versi 1.
 *
 * Nama field di dalam `student` & `guardian` sengaja disamakan dengan kolom
 * tabel `students` di SIKA supaya pemetaannya di sisi Laravel sesederhana
 * mungkin. Hanya data yang dibutuhkan keuangan yang dikirim (tanpa NIK,
 * dokumen, penghasilan) — prinsip minimisasi data UU PDP.
 *
 * Perubahan yang tidak kompatibel → buat versi baru (v2), jangan ubah v1.
 * Penjelasan lengkap: docs/INTEGRASI_KEUANGAN.md
 */

export const KEUANGAN_CONTRACT_VERSION = '1';

/** Nilai enum `students.hubungan_wali` di SIKA. */
export type SikaHubunganWali =
  | 'Ayah Kandung'
  | 'Ibu Kandung'
  | 'Ayah Angkat'
  | 'Ibu Angkat'
  | 'Wali'
  | 'Lainnya';

export interface PsbApplicantV1 {
  registration_id: string;
  registered_at: string;
  updated_at: string;
  student: {
    nama_lengkap: string;
    nama_panggilan: string;
    nisn: string;
    jenis_kelamin: 'L' | 'P';
    santri_group: 'putra' | 'putri';
    tempat_lahir: string;
    tanggal_lahir: string;
    asal_sekolah: string;
    kota_asal: string;
    provinsi: string;
    alamat_lengkap: string;
  };
  guardian: {
    nama_wali: string;
    hubungan_wali: SikaHubunganWali;
    /** Wajib terisi bila hubungan_wali = "Lainnya" (aturan validasi SIKA). */
    hubungan_wali_detail: string | null;
    no_whatsapp_wali: string;
  };
  /** Biaya formulir pendaftaran → kategori tagihan FORMULIR di SIKA. */
  registration_fee: {
    status: PaymentStatus;
    amount: number;
    paid_at: string | null;
    method: string | null;
    order_id: string | null;
  };
}

export const EXPORT_COLUMNS = [
  'id',
  'created_at',
  'updated_at',
  'nama_lengkap',
  'nama_panggilan',
  'nisn',
  'jenis_kelamin',
  'tempat_lahir',
  'tanggal_lahir',
  'asal_sekolah',
  'alamat_domisili',
  'kota',
  'provinsi',
  'hubungan_wali',
  'nama_ayah',
  'nama_ibu',
  'no_whatsapp_ortu',
  'relasi_whatsapp',
  'nama_wali',
  'hubungan_dengan_santri',
  'no_whatsapp_wali',
  'payment_status',
  'payment_amount',
  'payment_date',
  'payment_method',
  'order_id',
].join(', ');

export type ExportRow = Pick<
  RegistrationRecord,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'nama_lengkap'
  | 'nama_panggilan'
  | 'nisn'
  | 'jenis_kelamin'
  | 'tempat_lahir'
  | 'tanggal_lahir'
  | 'asal_sekolah'
  | 'alamat_domisili'
  | 'kota'
  | 'provinsi'
  | 'hubungan_wali'
  | 'nama_ayah'
  | 'nama_ibu'
  | 'no_whatsapp_ortu'
  | 'relasi_whatsapp'
  | 'nama_wali'
  | 'hubungan_dengan_santri'
  | 'no_whatsapp_wali'
  | 'payment_status'
  | 'payment_amount'
  | 'payment_date'
  | 'payment_method'
  | 'order_id'
>;

// Label pilihan "Hubungan Wali" di form pendaftaran (components/RegistrationForm.tsx)
const HUBUNGAN_WALI_LABELS: Record<string, string> = {
  'ayah-tiri': 'Ayah Tiri',
  'ibu-tiri': 'Ibu Tiri',
  'orang-tua-angkat': 'Orang Tua Angkat',
  'kakek-nenek': 'Kakek / Nenek',
  'paman-bibi': 'Paman / Bibi',
  'kakak-saudara': 'Kakak / Saudara',
  lainnya: 'Lainnya',
};

/**
 * Website menyimpan "orang tua kandung + nomor WA milik Ayah/Ibu" atau
 * "wali + hubungan". SIKA hanya menyimpan satu kontak wali, jadi yang dipakai
 * adalah orang tua pemilik nomor WhatsApp, atau wali itu sendiri.
 * Wali selain orang tua kandung → "Lainnya" + keterangan (Ayah/Ibu Angkat
 * tidak bisa dibedakan dari data form, pengurus bisa menyesuaikan di SIKA).
 */
function mapGuardian(reg: ExportRow): PsbApplicantV1['guardian'] {
  if (reg.hubungan_wali === 'orang-tua-kandung') {
    const isIbu = reg.relasi_whatsapp?.toLowerCase() === 'ibu';
    return {
      nama_wali: (isIbu ? reg.nama_ibu : reg.nama_ayah) || reg.nama_ayah || reg.nama_ibu || '',
      hubungan_wali: isIbu ? 'Ibu Kandung' : 'Ayah Kandung',
      hubungan_wali_detail: null,
      no_whatsapp_wali: reg.no_whatsapp_ortu ?? '',
    };
  }

  const label = HUBUNGAN_WALI_LABELS[reg.hubungan_wali] ?? reg.hubungan_wali;
  const detail = [label, reg.hubungan_dengan_santri].filter(Boolean).join(' — ');
  return {
    nama_wali: reg.nama_wali ?? '',
    hubungan_wali: 'Lainnya',
    hubungan_wali_detail: detail.slice(0, 100) || 'Wali',
    no_whatsapp_wali: reg.no_whatsapp_wali ?? '',
  };
}

export function toPsbApplicantV1(reg: ExportRow): PsbApplicantV1 {
  const isPutri = reg.jenis_kelamin === 'P';
  return {
    registration_id: reg.id,
    registered_at: reg.created_at,
    updated_at: reg.updated_at,
    student: {
      nama_lengkap: reg.nama_lengkap,
      nama_panggilan: reg.nama_panggilan,
      nisn: reg.nisn,
      jenis_kelamin: isPutri ? 'P' : 'L',
      santri_group: isPutri ? 'putri' : 'putra',
      tempat_lahir: reg.tempat_lahir,
      tanggal_lahir: reg.tanggal_lahir,
      asal_sekolah: reg.asal_sekolah,
      kota_asal: reg.kota,
      provinsi: reg.provinsi,
      alamat_lengkap: reg.alamat_domisili,
    },
    guardian: mapGuardian(reg),
    registration_fee: {
      status: reg.payment_status,
      amount: reg.payment_amount ?? BIAYA_PENDAFTARAN,
      paid_at: reg.payment_status === 'paid' ? reg.payment_date ?? null : null,
      method: reg.payment_method ?? null,
      order_id: reg.order_id ?? null,
    },
  };
}

// ── Kursor sinkronisasi ──────────────────────────────────────────────────────
// Keyset (updated_at, id): stabil walau banyak baris punya updated_at sama.

const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}:\d{2})$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface SyncCursor {
  updatedAt: string;
  id: string;
}

export function isIsoTimestamp(value: string): boolean {
  return ISO_TIMESTAMP.test(value) && !Number.isNaN(Date.parse(value));
}

export function encodeCursor(row: { updated_at: string; id: string }): string {
  return Buffer.from(JSON.stringify([row.updated_at, row.id])).toString('base64url');
}

/** Kembalikan null bila kursor rusak/dimanipulasi (nilainya masuk ke filter query). */
export function decodeCursor(cursor: string): SyncCursor | null {
  try {
    const [updatedAt, id] = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    if (typeof updatedAt !== 'string' || !isIsoTimestamp(updatedAt)) return null;
    if (typeof id !== 'string' || !UUID_PATTERN.test(id)) return null;
    return { updatedAt, id };
  } catch {
    return null;
  }
}
