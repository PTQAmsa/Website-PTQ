import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { catatLog } from '@/lib/psb/log';
import { isStatusPendaftaran, statusInfo } from '@/lib/psb/pilihan';
import { getSupabaseAdmin } from '@/lib/supabase/server';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Ubah tahapan pendaftaran: baru → dihubungi → tes → diterima / tidak_diterima. */
export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { registrationId?: unknown; status?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { registrationId, status } = body;
  if (typeof registrationId !== 'string' || !UUID_PATTERN.test(registrationId)) {
    return NextResponse.json({ error: 'registrationId tidak valid' }, { status: 400 });
  }
  if (!isStatusPendaftaran(status)) {
    return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: lama } = await supabase
    .from('pendaftaran_santri')
    .select('status_pendaftaran')
    .eq('id', registrationId)
    .maybeSingle();

  const { data, error } = await supabase
    .from('pendaftaran_santri')
    .update({ status_pendaftaran: status, updated_at: new Date().toISOString() })
    .eq('id', registrationId)
    .select('id');

  if (error) {
    console.error('[status-pendaftaran] Update error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui status' }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Pendaftaran tidak ditemukan' }, { status: 404 });
  }

  const dari = statusInfo(lama?.status_pendaftaran).label;
  const ke = statusInfo(status).label;
  if (dari !== ke) {
    await catatLog({
      registrationId,
      aksi: 'tahapan_diubah',
      oleh: 'admin',
      detail: { perubahan: [{ kolom: 'Tahapan', dari, ke }] },
    });
  }

  return NextResponse.json({ success: true });
}
