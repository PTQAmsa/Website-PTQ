import { NextRequest, NextResponse } from 'next/server';
import {
  EXPORT_COLUMNS,
  KEUANGAN_CONTRACT_VERSION,
  decodeCursor,
  encodeCursor,
  isIsoTimestamp,
  toPsbApplicantV1,
  type ExportRow,
} from '@/lib/integrations/keuangan/contract';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import type { PaymentStatus } from '@/lib/types/registration';
import { hasValidBearerToken } from '@/lib/utils/secure-compare';

/**
 * GET /api/integrasi/keuangan/v1/pendaftar
 *
 * Endpoint tarik (pull) untuk SIKA PTQ. SIKA memanggilnya berkala atau lewat
 * tombol "Sinkronkan", lalu meng-upsert berdasarkan registration_id.
 *
 * Auth   : Authorization: Bearer <KEUANGAN_SYNC_TOKEN>
 * Query  : cursor          — lanjut dari posisi terakhir (dari next_cursor)
 *          updated_since   — ISO 8601, dipakai bila belum punya cursor
 *          payment_status  — opsional: pending | paid | failed | expired
 *          limit           — 1..500, default 100
 *
 * Selama KEUANGAN_SYNC_TOKEN belum di-set, endpoint ini 404 (fitur nonaktif).
 * Kontrak lengkap: docs/INTEGRASI_KEUANGAN.md
 */

export const dynamic = 'force-dynamic';

const PAYMENT_STATUSES: PaymentStatus[] = ['pending', 'paid', 'failed', 'expired'];
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(req: NextRequest) {
  const syncToken = process.env.KEUANGAN_SYNC_TOKEN;
  if (!syncToken) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (!hasValidBearerToken(req.headers.get('authorization'), syncToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;

  const limitParam = params.get('limit');
  const limit = limitParam ? Number(limitParam) : DEFAULT_LIMIT;
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    return badRequest(`limit harus bilangan bulat 1–${MAX_LIMIT}`);
  }

  let query = getSupabaseAdmin()
    .from('pendaftaran_santri')
    .select(EXPORT_COLUMNS)
    .order('updated_at', { ascending: true })
    .order('id', { ascending: true })
    .limit(limit + 1); // +1 untuk mendeteksi masih ada halaman berikutnya

  const cursorParam = params.get('cursor');
  const updatedSince = params.get('updated_since');

  if (cursorParam) {
    const cursor = decodeCursor(cursorParam);
    if (!cursor) return badRequest('cursor tidak valid');
    // Nilai sudah divalidasi ketat di decodeCursor (ISO timestamp & UUID)
    query = query.or(
      `updated_at.gt."${cursor.updatedAt}",and(updated_at.eq."${cursor.updatedAt}",id.gt.${cursor.id})`
    );
  } else if (updatedSince) {
    if (!isIsoTimestamp(updatedSince)) {
      return badRequest('updated_since harus format ISO 8601, mis. 2026-07-01T00:00:00Z');
    }
    query = query.gte('updated_at', updatedSince);
  }

  const paymentStatus = params.get('payment_status');
  if (paymentStatus) {
    if (!PAYMENT_STATUSES.includes(paymentStatus as PaymentStatus)) {
      return badRequest(`payment_status harus salah satu dari: ${PAYMENT_STATUSES.join(', ')}`);
    }
    query = query.eq('payment_status', paymentStatus);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[integrasi-keuangan] Query error:', error);
    return NextResponse.json({ error: 'Gagal memuat data pendaftar' }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as ExportRow[];
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const lastRow = page[page.length - 1];

  return NextResponse.json(
    {
      version: KEUANGAN_CONTRACT_VERSION,
      data: page.map(toPsbApplicantV1),
      has_more: hasMore,
      // Simpan nilai ini di SIKA dan kirim lagi pada sinkronisasi berikutnya.
      // Halaman kosong → kursor lama dikembalikan agar posisi tidak hilang.
      next_cursor: lastRow ? encodeCursor(lastRow) : cursorParam,
      server_time: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
