import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { kolomEdit, validasiKolom } from '@/lib/psb/edit-admin';
import { catatLog, hitungPerubahan } from '@/lib/psb/log';
import { getSupabaseAdmin } from '@/lib/supabase/server';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Admin memperbaiki data pendaftar (mis. atas permintaan wali). Hanya kolom di kolomEdit(). */
export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { registrationId?: unknown; data?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { registrationId, data } = body;
  if (typeof registrationId !== 'string' || !UUID_PATTERN.test(registrationId)) {
    return NextResponse.json({ error: 'registrationId tidak valid' }, { status: 400 });
  }
  if (!data || typeof data !== 'object') {
    return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: reg, error: fetchError } = await supabase
    .from('pendaftaran_santri')
    .select('*')
    .eq('id', registrationId)
    .maybeSingle();

  if (fetchError) {
    console.error('[edit-pendaftaran] Fetch error:', fetchError);
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 });
  }
  if (!reg) {
    return NextResponse.json({ error: 'Pendaftaran tidak ditemukan' }, { status: 404 });
  }

  const input = data as Record<string, unknown>;
  const update: Record<string, unknown> = {};
  for (const k of kolomEdit(reg)) {
    if (!(k.column in input)) continue;
    const result = validasiKolom(k, input[k.column]);
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: 400 });
    update[k.column] = result.value;
  }

  const anakKe = update.anak_ke ?? input.anak_ke;
  const total = update.total_saudara ?? input.total_saudara;
  if (typeof anakKe === 'number' && typeof total === 'number' && anakKe > total) {
    return NextResponse.json({ error: 'Anak ke- tidak boleh lebih besar dari jumlah saudara.' }, { status: 400 });
  }
  const perubahan = hitungPerubahan(reg, update);
  if (perubahan.length === 0) {
    return NextResponse.json({ error: 'Tidak ada perubahan' }, { status: 400 });
  }

  update.updated_at = new Date().toISOString();
  const { error } = await supabase.from('pendaftaran_santri').update(update).eq('id', registrationId);
  if (error) {
    console.error('[edit-pendaftaran] Update error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan perubahan' }, { status: 500 });
  }

  await catatLog({ registrationId, aksi: 'data_diedit', oleh: 'admin', detail: { perubahan } });

  return NextResponse.json({ success: true });
}
