import Link from 'next/link';
import { headers } from 'next/headers';
import AdminDetailClient from './AdminDetailClient';
import AdminLoginForm from '../../AdminLoginForm';
import ServiceRoleWarning from '../../ServiceRoleWarning';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { urlLengkapi } from '@/lib/psb/lengkapi';
import type { LogPendaftaran } from '@/lib/psb/log';
import { getRegistrationDocuments } from '@/lib/storage/documents';
import { getServiceRoleKeyStatus, getSupabaseAdmin } from '@/lib/supabase/server';
import type { RegistrationRecord, PaymentLog } from '@/lib/types/registration';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function AdminDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { error: loginError } = await searchParams;

  if (!(await isAdminAuthenticated())) {
    const next = UUID_PATTERN.test(id) ? `/admin/pendaftaran/${id}` : '/admin/pendaftaran';
    return <AdminLoginForm next={next} error={loginError} />;
  }

  const supabase = getSupabaseAdmin();

  // Fetch registration
  const { data: reg, error: regError } = UUID_PATTERN.test(id)
    ? await supabase.from('pendaftaran_santri').select('*').eq('id', id).maybeSingle()
    : { data: null, error: null };

  if (regError || !reg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-2xl font-bold text-gray-300 mb-2">404</p>
          <p className="text-gray-600 font-medium">Pendaftaran tidak ditemukan.</p>
          <Link
            href="/admin/pendaftaran"
            className="mt-4 inline-block text-sm text-emerald-600 hover:underline"
          >
            ← Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  const registration = reg as RegistrationRecord;

  // Link dibuat dari host yang sedang dibuka admin (localhost saat uji coba)
  const h = await headers();
  const host = h.get('host');
  const origin = host ? `${h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')}://${host}` : undefined;
  const linkLengkapi = registration.token_lengkapi ? urlLengkapi(registration.token_lengkapi, origin) : null;

  const [{ data: logs }, { data: riwayat, error: riwayatError }, documents] = await Promise.all([
    supabase
      .from('payment_logs')
      .select('*')
      .eq('registration_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('log_pendaftaran')
      .select('*')
      .eq('registration_id', id)
      .order('created_at', { ascending: false }),
    getRegistrationDocuments(registration),
  ]);
  if (riwayatError) console.error('[admin-detail] Riwayat error:', riwayatError.message);

  return (
    <>
      <ServiceRoleWarning status={getServiceRoleKeyStatus()} />
      <AdminDetailClient
        registration={registration}
        paymentLogs={(logs ?? []) as PaymentLog[]}
        documents={documents}
        linkLengkapi={linkLengkapi}
        riwayat={(riwayat ?? []) as LogPendaftaran[]}
        riwayatTersedia={!riwayatError}
      />
    </>
  );
}
