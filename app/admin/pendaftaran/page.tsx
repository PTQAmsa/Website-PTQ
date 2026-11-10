import AdminDashboardClient from './AdminDashboardClient';
import AdminLoginForm from '../AdminLoginForm';
import ServiceRoleWarning from '../ServiceRoleWarning';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getServiceRoleKeyStatus, getSupabaseAdmin } from '@/lib/supabase/server';
import type { RegistrationRecord } from '@/lib/types/registration';

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminPendaftaranPage({ searchParams }: PageProps) {
  const { error: loginError } = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLoginForm next="/admin/pendaftaran" error={loginError} />;
  }

  // Fetch registrations
  const { data, error } = await getSupabaseAdmin()
    .from('pendaftaran_santri')
    .select(
      'id, nama_lengkap, jenis_pendaftaran, lulusan, kota, sumber_info, hubungan_wali, relasi_whatsapp, nama_ayah, nama_ibu, nama_wali, no_whatsapp_ortu, email_ortu, no_whatsapp_wali, email_wali, status_pendaftaran, token_lengkapi, data_lengkap_at, payment_status, payment_link, order_id, created_at'
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin] Gagal memuat pendaftaran:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-red-600 font-medium">Gagal memuat data pendaftaran.</p>
          <p className="text-sm text-gray-500 mt-1">Coba muat ulang halaman beberapa saat lagi.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ServiceRoleWarning status={getServiceRoleKeyStatus()} />
      <AdminDashboardClient registrations={(data ?? []) as RegistrationRecord[]} />
    </>
  );
}
