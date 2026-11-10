import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { DOCUMENT_BUCKET } from '@/lib/storage/documents';
import { createRateLimiter, getClientIP } from '@/lib/utils/rate-limit';

/**
 * Izin unggah satu dokumen untuk halaman lengkapi data. Browser tidak lagi
 * bisa mengunggah ke bucket dengan anon key; ia harus memegang token link
 * lengkapi yang sah, lalu menerima signed upload URL sekali pakai untuk path
 * di folder pendaftar itu sendiri. Batas ukuran (3 MB) dan jenis file juga
 * dijaga oleh pengaturan bucket.
 */

// 6 dokumen per kirim, beri ruang untuk mencoba ulang
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 30 });

const POLA_TOKEN = /^[A-Za-z0-9_-]{32}$/;
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;

const PREFIX_DOKUMEN: Record<string, string> = {
  kk: 'kk',
  akta: 'akta',
  ijazah: 'ijazah',
  ktpOrtu: 'ktp-ortu',
  pasFoto: 'pas-foto',
  suratSehat: 'surat-sehat',
};

const EKSTENSI: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function bad(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(req: NextRequest) {
  if (isRateLimited(getClientIP(req))) {
    return bad('Terlalu banyak permintaan. Coba lagi dalam beberapa menit.', 429);
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== 'object') throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return bad('Format request tidak valid.');
  }

  const { token, key, type, size } = body;
  if (typeof token !== 'string' || !POLA_TOKEN.test(token)) return bad('Link tidak berlaku.', 404);
  const prefix = typeof key === 'string' ? PREFIX_DOKUMEN[key] : undefined;
  if (!prefix) return bad('Jenis dokumen tidak dikenal.');
  const ext = typeof type === 'string' ? EKSTENSI[type] : undefined;
  if (!ext) return bad('Format file tidak didukung. Gunakan PDF/JPG/PNG/WEBP.');
  if (typeof size !== 'number' || size <= 0 || size > MAX_FILE_SIZE_BYTES) {
    return bad('Ukuran file maksimal 3 MB per berkas.');
  }

  const supabase = getSupabaseAdmin();
  const { data: reg, error: fetchError } = await supabase
    .from('pendaftaran_santri')
    .select('id, data_lengkap_at')
    .eq('token_lengkapi', token)
    .maybeSingle();

  if (fetchError) {
    console.error('[lengkapi-upload] Fetch error:', fetchError);
    return bad('Gagal memuat data pendaftaran. Silakan coba lagi.', 500);
  }
  if (!reg) return bad('Link tidak berlaku. Minta link terbaru kepada admin.', 404);
  if (reg.data_lengkap_at) return bad('Data sudah lengkap. Hubungi admin bila ada yang perlu diperbaiki.', 409);

  const path = `pendaftaran/${reg.id}/${prefix}-${Date.now()}-${randomBytes(4).toString('hex')}.${ext}`;
  const bucket = supabase.storage.from(DOCUMENT_BUCKET);
  const { data, error } = await bucket.createSignedUploadUrl(path);
  if (error || !data) {
    console.error('[lengkapi-upload] Gagal membuat signed upload URL:', error?.message);
    return bad('Gagal menyiapkan unggahan. Silakan coba lagi.', 500);
  }

  return NextResponse.json({
    success: true,
    path: data.path,
    uploadToken: data.token,
    // Disimpan di database seperti sebelumnya; admin membukanya lewat signed URL
    publicUrl: bucket.getPublicUrl(data.path).data.publicUrl,
  });
}
