import { createClient } from '@supabase/supabase-js';
import AdminDetailClient from './AdminDetailClient';
import type { RegistrationRecord, PaymentLog } from '@/lib/types/registration';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key);
}

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pw?: string }>;
}

export default async function AdminDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { pw } = await searchParams;
  const adminPassword = process.env.ADMIN_PASSWORD ?? '';

  // Password check
  if (!pw || pw !== adminPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mb-6">Masukkan password untuk melanjutkan.</p>
          <form method="GET" action={`/admin/pendaftaran/${id}`}>
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

  const supabase = getSupabase();

  // Fetch registration
  const { data: reg, error: regError } = await supabase
    .from('pendaftaran_santri')
    .select('*')
    .eq('id', id)
    .single();

  if (regError || !reg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-2xl font-bold text-gray-300 mb-2">404</p>
          <p className="text-gray-600 font-medium">Pendaftaran tidak ditemukan.</p>
          <a
            href={`/admin/pendaftaran?pw=${encodeURIComponent(adminPassword)}`}
            className="mt-4 inline-block text-sm text-emerald-600 hover:underline"
          >
            ← Kembali ke Daftar
          </a>
        </div>
      </div>
    );
  }

  // Fetch payment logs
  const { data: logs } = await supabase
    .from('payment_logs')
    .select('*')
    .eq('registration_id', id)
    .order('created_at', { ascending: false });

  return (
    <AdminDetailClient
      registration={reg as RegistrationRecord}
      paymentLogs={(logs ?? []) as PaymentLog[]}
      adminPassword={adminPassword}
    />
  );
}
