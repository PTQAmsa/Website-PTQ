import 'server-only';
import { kolomEdit } from '@/lib/psb/edit-admin';
import { getSupabaseAdmin } from '@/lib/supabase/server';

/**
 * Riwayat perubahan data pendaftar (tabel log_pendaftaran), tampil di
 * halaman detail admin. Gagal mencatat tidak boleh menggagalkan aksi
 * utamanya, jadi error hanya di-log ke console.
 */

export type AksiLog =
  | 'pendaftaran_dibuat'
  | 'data_dilengkapi'
  | 'data_diedit'
  | 'tahapan_diubah'
  | 'link_dibuat'
  | 'link_dibuka_kembali';

export type Perubahan = { kolom: string; dari: string | null; ke: string | null };

export type LogPendaftaran = {
  id: string;
  registration_id: string;
  aksi: AksiLog;
  oleh: 'admin' | 'wali' | 'sistem';
  detail: { perubahan?: Perubahan[]; catatan?: string };
  created_at: string;
};

/** Nama kolom database → label yang dibaca admin. */
export const LABEL_KOLOM: Record<string, string> = {
  ...Object.fromEntries(
    [...kolomEdit({ hubungan_wali: 'orang-tua-kandung' }), ...kolomEdit({ hubungan_wali: 'wali' })].map((k) => [k.column, k.label])
  ),
  url_kk: 'Dokumen Kartu Keluarga',
  url_akta: 'Dokumen Akta Kelahiran',
  url_ijazah: 'Dokumen Ijazah / SKL',
  url_ktp_ortu: 'Dokumen KTP Orang Tua / Wali',
  url_pas_foto: 'Pas Foto',
  url_surat_sehat: 'Surat Keterangan Sehat',
};

function teks(value: unknown): string | null {
  return value === null || value === undefined || value === '' ? null : String(value);
}

/** Bandingkan nilai lama & baru per kolom. Kolom dokumen cukup ditandai "diganti". */
export function hitungPerubahan(
  lama: Record<string, unknown>,
  baru: Record<string, unknown>,
  label: Record<string, string> = LABEL_KOLOM
): Perubahan[] {
  const hasil: Perubahan[] = [];
  for (const [kolom, nilai] of Object.entries(baru)) {
    if (!(kolom in label)) continue;
    const dari = teks(lama[kolom]);
    const ke = teks(nilai);
    if (dari === ke) continue;
    if (kolom.startsWith('url_')) {
      hasil.push({ kolom: label[kolom], dari: dari ? 'ada' : null, ke: dari ? 'diganti' : 'diunggah' });
    } else {
      hasil.push({ kolom: label[kolom], dari, ke });
    }
  }
  return hasil;
}

export async function catatLog(entry: {
  registrationId: string;
  aksi: AksiLog;
  oleh: LogPendaftaran['oleh'];
  detail?: LogPendaftaran['detail'];
}) {
  const { error } = await getSupabaseAdmin()
    .from('log_pendaftaran')
    .insert({ registration_id: entry.registrationId, aksi: entry.aksi, oleh: entry.oleh, detail: entry.detail ?? {} });
  if (error) console.error('[log-pendaftaran] Gagal mencatat:', error.message);
}
