import 'server-only';
import { randomBytes } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import type { RegistrationRecord } from '@/lib/types/registration';

/**
 * Link pribadi pelengkapan data (tahap 2): /pendaftaran-santri-baru/lengkapi/<token>.
 * Token acak 32 karakter = "kunci" pendaftar; siapa pun yang memegang link
 * bisa mengisi data, jadi admin hanya mengirimnya ke WhatsApp wali. Membuat
 * link baru otomatis mematikan link lama.
 */

const POLA_TOKEN = /^[A-Za-z0-9_-]{32}$/;

export function buatTokenLengkapi(): string {
  return randomBytes(24).toString('base64url'); // 32 karakter
}

export function urlLengkapi(token: string, origin?: string): string {
  const base = origin ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ptqamsa.id';
  return `${base.replace(/\/$/, '')}/pendaftaran-santri-baru/lengkapi/${token}`;
}

/** Kolom yang boleh dilihat wali di halaman lengkapi (tanpa data pembayaran/admin). */
export const KOLOM_LENGKAPI = [
  'id',
  'jenis_pendaftaran',
  'lulusan',
  'nama_lengkap',
  'jenis_kelamin',
  'tanggal_lahir',
  'asal_sekolah',
  'kota',
  'hubungan_wali',
  'relasi_whatsapp',
  'hubungan_dengan_santri',
  'nama_ayah',
  'nama_ibu',
  'no_whatsapp_ortu',
  'email_ortu',
  'nama_wali',
  'no_whatsapp_wali',
  'email_wali',
  'nama_panggilan',
  'nik',
  'nisn',
  'tempat_lahir',
  'no_whatsapp_santri',
  'anak_ke',
  'total_saudara',
  'status_anak',
  'pekerjaan_ayah',
  'pekerjaan_ibu',
  'pekerjaan_wali',
  'nama_ayah_kandung',
  'nama_ibu_kandung',
  'penghasilan_ortu',
  'alamat_sekolah',
  'alamat_domisili',
  'provinsi',
  'url_kk',
  'url_akta',
  'url_ijazah',
  'url_ktp_ortu',
  'url_pas_foto',
  'url_surat_sehat',
  'data_lengkap_at',
] as const;

export type PendaftarLengkapi = Pick<RegistrationRecord, (typeof KOLOM_LENGKAPI)[number]>;

export async function cariPendaftarDariToken(token: string): Promise<PendaftarLengkapi | null> {
  if (!POLA_TOKEN.test(token)) return null;
  const { data, error } = await getSupabaseAdmin()
    .from('pendaftaran_santri')
    .select(KOLOM_LENGKAPI.join(', '))
    .eq('token_lengkapi', token)
    .maybeSingle();
  if (error) {
    console.error('[lengkapi] Gagal mencari token:', error.message);
    return null;
  }
  return (data as unknown as PendaftarLengkapi | null) ?? null;
}
