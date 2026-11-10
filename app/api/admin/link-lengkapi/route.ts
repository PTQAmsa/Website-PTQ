import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { buatTokenLengkapi, urlLengkapi } from '@/lib/psb/lengkapi';
import { catatLog } from '@/lib/psb/log';
import { getSupabaseAdmin } from '@/lib/supabase/server';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Buat link pelengkapan data (tahap 2) untuk satu pendaftar.
 * Link lama otomatis tidak berlaku. Bila data sudah lengkap, link baru
 * membuka kembali form agar wali bisa memperbaiki data.
 */
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let registrationId: unknown;
  try {
    ({ registrationId } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (typeof registrationId !== 'string' || !UUID_PATTERN.test(registrationId)) {
    return NextResponse.json({ error: 'registrationId tidak valid' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: reg, error: fetchError } = await supabase
    .from('pendaftaran_santri')
    .select('id, status_pendaftaran, token_lengkapi, data_lengkap_at')
    .eq('id', registrationId)
    .maybeSingle();

  if (fetchError || !reg) {
    return NextResponse.json({ error: 'Pendaftaran tidak ditemukan' }, { status: 404 });
  }

  const token = buatTokenLengkapi();
  const now = new Date().toISOString();
  const { error: updateError } = await supabase
    .from('pendaftaran_santri')
    .update({
      token_lengkapi: token,
      token_lengkapi_dibuat_at: now,
      data_lengkap_at: null,
      // Mengirim link = sudah menghubungi wali
      ...(reg.status_pendaftaran === 'baru' ? { status_pendaftaran: 'dihubungi' } : {}),
      updated_at: now,
    })
    .eq('id', registrationId);

  if (updateError) {
    console.error('[link-lengkapi] Update error:', updateError);
    return NextResponse.json({ error: 'Gagal membuat link' }, { status: 500 });
  }

  await catatLog({
    registrationId,
    aksi: reg.data_lengkap_at ? 'link_dibuka_kembali' : 'link_dibuat',
    oleh: 'admin',
    detail: {
      catatan: [
        reg.token_lengkapi ? 'Link lama tidak berlaku lagi.' : null,
        reg.status_pendaftaran === 'baru' ? 'Tahapan otomatis menjadi "Sudah Dihubungi".' : null,
      ]
        .filter(Boolean)
        .join(' ') || undefined,
    },
  });

  return NextResponse.json({ success: true, url: urlLengkapi(token, req.nextUrl.origin) });
}
