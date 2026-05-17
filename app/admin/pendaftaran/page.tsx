import { createClient } from '@supabase/supabase-js';
import AdminDashboardClient from './AdminDashboardClient';
import type { RegistrationRecord } from '@/lib/types/registration';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key);
}

interface PageProps {
  searchParams: Promise<{ pw?: string }>;
}

export default async function AdminPendaftaranPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const adminPassword = process.env.ADMIN_PASSWORD ?? '';

  // Password check
  if (!params.pw || params.pw !== adminPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mb-6">Masukkan password untuk melanjutkan.</p>
          <form method="GET" action="/admin/pendaftaran">
            <label htmlFor="pw" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="pw"
              name="pw"
              type="password"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
              placeholder="Masukkan password admin"
            />
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-sm transition-colors"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Fetch registrations
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('pendaftaran_santri')
    .select(
      'id, nama_lengkap, no_whatsapp_ortu, email_ortu, payment_status, payment_link, order_id, created_at'
    )
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-red-600 font-medium">Gagal memuat data pendaftaran.</p>
          <p className="text-sm text-gray-500 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboardClient
      registrations={(data ?? []) as RegistrationRecord[]}
      adminPassword={adminPassword}
    />
  );
}
