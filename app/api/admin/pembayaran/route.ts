import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { BIAYA_PENDAFTARAN, formatRupiah } from '@/lib/config/psb';
import { catatLog } from '@/lib/psb/log';
import { METODE_BAYAR, isOpsi, labelMetodeBayar } from '@/lib/psb/pilihan';
import { getSupabaseAdmin } from '@/lib/supabase/server';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Admin mencatat pembayaran biaya pendaftaran yang diterima di luar Midtrans:
 * online (transfer) atau offline (tunai di pesantren). Bisa dibatalkan bila
 * salah catat.
 */
export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { registrationId?: unknown; lunas?: unknown; metode?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { registrationId, lunas, metode } = body;
  if (typeof registrationId !== 'string' || !UUID_PATTERN.test(registrationId)) {
    return NextResponse.json({ error: 'registrationId tidak valid' }, { status: 400 });
  }
  if (typeof lunas !== 'boolean') {
    return NextResponse.json({ error: 'Status pembayaran tidak valid' }, { status: 400 });
  }
  if (lunas && !isOpsi(METODE_BAYAR, metode)) {
    return NextResponse.json({ error: 'Pilih metode pembayaran' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: reg, error: fetchError } = await supabase
    .from('pendaftaran_santri')
    .select('id, payment_status, payment_method')
    .eq('id', registrationId)
    .maybeSingle();

  if (fetchError || !reg) {
    return NextResponse.json({ error: 'Pendaftaran tidak ditemukan' }, { status: 404 });
  }

  const now = new Date().toISOString();
  const update = lunas
    ? { payment_status: 'paid', payment_method: metode, payment_date: now, payment_amount: BIAYA_PENDAFTARAN, updated_at: now }
    : { payment_status: 'pending', payment_method: null, payment_date: null, updated_at: now };

  const { error } = await supabase.from('pendaftaran_santri').update(update).eq('id', registrationId);
  if (error) {
    console.error('[pembayaran] Update error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan pembayaran' }, { status: 500 });
  }

  const statusLama = reg.payment_status === 'paid' ? 'Lunas' : 'Belum bayar';
  await catatLog({
    registrationId,
    aksi: 'pembayaran_dicatat',
    oleh: 'admin',
    detail: {
      perubahan: [
        { kolom: 'Pembayaran', dari: statusLama, ke: lunas ? 'Lunas' : 'Belum bayar' },
        { kolom: 'Metode', dari: labelMetodeBayar(reg.payment_method), ke: lunas ? labelMetodeBayar(metode as string) : null },
      ].filter((p) => p.dari !== p.ke),
      catatan: lunas ? `Biaya pendaftaran ${formatRupiah(BIAYA_PENDAFTARAN)}.` : undefined,
    },
  });

  return NextResponse.json({ success: true });
}
