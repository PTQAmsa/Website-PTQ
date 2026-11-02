import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client khusus server (API route, server component, cron).
 *
 * Memakai SUPABASE_SERVICE_ROLE_KEY yang mem-bypass RLS, sehingga tabel
 * pendaftaran_santri & payment_logs bisa dikunci total dari role `anon`.
 * Key ini TIDAK boleh diberi prefix NEXT_PUBLIC_ dan tidak boleh dipakai di
 * komponen client — `import 'server-only'` membuat build gagal bila terjadi.
 *
 * Masa transisi: bila service role key belum di-set, client jatuh ke anon key
 * agar situs tetap jalan, tetapi data pendaftar masih terbuka untuk publik.
 * Dashboard admin menampilkan peringatan selama kondisi ini.
 */

let cachedClient: SupabaseClient | null = null;
let warnedAboutFallback = false;

export type ServiceRoleKeyStatus = 'ok' | 'missing' | 'not-service-role';

/**
 * Deteksi salah tempel: anon key / publishable key yang dipasang sebagai
 * SUPABASE_SERVICE_ROLE_KEY akan tetap "jalan" sebelum database dikunci,
 * lalu membuat admin rusak setelah security_hardening.sql dijalankan.
 */
export function getServiceRoleKeyStatus(): ServiceRoleKeyStatus {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return 'missing';
  if (key.startsWith('sb_publishable_')) return 'not-service-role';

  // Legacy key berupa JWT — role di payload harus "service_role"
  const [, payload] = key.split('.');
  if (payload && key.startsWith('eyJ')) {
    try {
      const { role } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
      return role === 'service_role' ? 'ok' : 'not-service-role';
    } catch {
      return 'not-service-role';
    }
  }
  return 'ok'; // mis. secret key baru "sb_secret_..."
}

export function isServiceRoleConfigured(): boolean {
  return getServiceRoleKeyStatus() === 'ok';
}

export function getSupabaseAdmin(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key = serviceRoleKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) throw new Error('Supabase env vars missing');

  if (!isServiceRoleConfigured() && !warnedAboutFallback) {
    warnedAboutFallback = true;
    console.warn(
      serviceRoleKey
        ? '[supabase] SUPABASE_SERVICE_ROLE_KEY berisi anon/publishable key, bukan service_role. ' +
            'Ganti nilainya. Lihat docs/SECURITY_HARDENING.md'
        : '[supabase] SUPABASE_SERVICE_ROLE_KEY belum di-set — memakai anon key. ' +
            'Data pendaftar belum terlindungi. Lihat docs/SECURITY_HARDENING.md'
    );
  }

  cachedClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}
