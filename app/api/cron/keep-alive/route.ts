import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { hasValidBearerToken } from '@/lib/utils/secure-compare';

/**
 * Keep-Alive Cron Job
 *
 * Supabase Free Plan mem-pause project yang "kurang aktivitas database
 * selama 7 hari". Dokumentasi Supabase menyebut yang dibutuhkan adalah
 * "a few user requests to the database each day" — bukan 1 ping per minggu.
 * Karena itu endpoint ini dipanggil beberapa kali SETIAP HARI oleh:
 *   1. Vercel Cron (vercel.json) — 3x sehari
 *   2. GitHub Actions (.github/workflows/supabase-keep-alive.yml) — cadangan
 *      sekaligus pengirim email bila ping gagal
 *
 * Detail & cara cek: docs/SUPABASE_KEEP_ALIVE.md
 */

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Vercel Cron otomatis mengirim "Authorization: Bearer <CRON_SECRET>"
  if (!hasValidBearerToken(request.headers.get('authorization'), process.env.CRON_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    const supabase = getSupabaseAdmin();

    // Query nyata ke dua tabel = aktivitas database yang dihitung Supabase
    const [registrations, paymentLogs] = await Promise.all([
      supabase.from('pendaftaran_santri').select('id').limit(1),
      supabase.from('payment_logs').select('id').limit(1),
    ]);

    const error = registrations.error ?? paymentLogs.error;
    if (error) {
      console.error('[keep-alive] Query failed:', error);
      return NextResponse.json(
        { success: false, error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    console.log('[keep-alive] Ping successful', {
      source: request.headers.get('user-agent')?.startsWith('vercel-cron') ? 'vercel-cron' : 'external',
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json({
      success: true,
      message: 'Database keep-alive ping successful',
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - startedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[keep-alive] Error:', error);
    return NextResponse.json(
      { success: false, error: message, timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
