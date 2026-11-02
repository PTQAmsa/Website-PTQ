import type { ServiceRoleKeyStatus } from '@/lib/supabase/server';

/**
 * Tampil selama SUPABASE_SERVICE_ROLE_KEY belum benar di server.
 * Selama itu website masih memakai anon key dan data pendaftar belum terlindungi.
 */
export default function ServiceRoleWarning({ status }: { status: ServiceRoleKeyStatus }) {
  if (status === 'ok') return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-sm text-amber-900">
      <strong>Peringatan keamanan:</strong>{' '}
      {status === 'not-service-role' ? (
        <>
          nilai <code>SUPABASE_SERVICE_ROLE_KEY</code> ternyata anon/publishable key, bukan
          service_role. Ganti dengan <em>service_role</em> atau <em>secret key</em> dari Supabase,
          lalu redeploy. <strong>Jangan jalankan security_hardening.sql dulu.</strong>
        </>
      ) : (
        <>
          <code>SUPABASE_SERVICE_ROLE_KEY</code> belum diatur di server, sehingga data pendaftar
          belum terlindungi sepenuhnya.
        </>
      )}{' '}
      Lihat <code>docs/SECURITY_HARDENING.md</code>.
    </div>
  );
}
