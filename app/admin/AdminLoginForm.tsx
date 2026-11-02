const ERROR_MESSAGES: Record<string, string> = {
  invalid: 'Password salah. Silakan coba lagi.',
  limit: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.',
  config: 'ADMIN_PASSWORD belum diatur di server. Hubungi pengelola website.',
};

interface Props {
  next: string;
  error?: string;
}

export default function AdminLoginForm({ next, error }: Props) {
  const errorMessage = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">Masukkan password untuk melanjutkan.</p>
        {errorMessage && (
          <p className="mb-4 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        )}
        <form method="POST" action="/api/admin/login">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
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
