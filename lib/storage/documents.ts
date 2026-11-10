import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import type { RegistrationDocument, RegistrationRecord } from '@/lib/types/registration';

export const DOCUMENT_BUCKET = 'dokumen-santri';
const PUBLIC_PATH_MARKER = `/storage/v1/object/public/${DOCUMENT_BUCKET}/`;
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 jam

const DOCUMENT_FIELDS = [
  { key: 'url_pas_foto', label: 'Pas Foto 3x4' },
  { key: 'url_kk', label: 'Kartu Keluarga' },
  { key: 'url_akta', label: 'Akta Kelahiran' },
  { key: 'url_ijazah', label: 'Ijazah / SKL' },
  { key: 'url_ktp_ortu', label: 'KTP Orang Tua / Wali' },
  { key: 'url_surat_sehat', label: 'Surat Keterangan Sehat' },
] as const;

type DocumentKey = (typeof DOCUMENT_FIELDS)[number]['key'];

/**
 * Ambil path objek storage dari URL publik yang tersimpan di database,
 * mis. ".../object/public/dokumen-santri/pendaftaran/<id>/kk-123.pdf"
 * → "pendaftaran/<id>/kk-123.pdf".
 */
export function getDocumentPath(storedUrl: string | null | undefined): string | null {
  if (!storedUrl) return null;
  try {
    const { pathname } = new URL(storedUrl);
    const index = pathname.indexOf(PUBLIC_PATH_MARKER);
    if (index === -1) return null;
    return decodeURIComponent(pathname.slice(index + PUBLIC_PATH_MARKER.length));
  } catch {
    return null;
  }
}

/**
 * File diunggah browser langsung ke bucket di folder pendaftaran/<registrationId>/.
 * Tolak URL lain agar data tidak bisa diisi link sembarang (phishing /
 * pelacak) yang nanti dibuka admin.
 */
export function isOwnDocumentUrl(value: unknown, registrationId: string): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    const supabaseOrigin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').origin;
    return (
      url.origin === supabaseOrigin &&
      url.pathname.startsWith(`${PUBLIC_PATH_MARKER}pendaftaran/${registrationId}/`) &&
      !url.pathname.includes('..')
    );
  } catch {
    return false;
  }
}

/**
 * URL dokumen untuk admin. Memakai signed URL (berlaku 1 jam) supaya bucket
 * bisa dijadikan private. Bila pembuatan signed URL gagal, jatuh ke URL
 * tersimpan — tetap berfungsi selama bucket masih public.
 */
export async function getRegistrationDocuments(
  reg: Pick<RegistrationRecord, DocumentKey>
): Promise<RegistrationDocument[]> {
  const entries = DOCUMENT_FIELDS.flatMap(({ key, label }) => {
    const storedUrl = reg[key];
    return storedUrl ? [{ key, label, storedUrl, path: getDocumentPath(storedUrl) }] : [];
  });

  const paths = entries.flatMap((e) => (e.path ? [e.path] : []));
  const signedByPath = new Map<string, string>();

  if (paths.length > 0) {
    const { data, error } = await getSupabaseAdmin()
      .storage.from(DOCUMENT_BUCKET)
      .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);

    if (error) {
      console.error('[documents] Gagal membuat signed URL:', error.message);
    }
    for (const item of data ?? []) {
      if (item.path && item.signedUrl && !item.error) signedByPath.set(item.path, item.signedUrl);
    }
  }

  return entries.map(({ key, label, storedUrl, path }) => ({
    key,
    label,
    url: (path && signedByPath.get(path)) || storedUrl,
  }));
}
