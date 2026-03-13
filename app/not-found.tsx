import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-emerald-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-600 mt-4 mb-8">
          Maaf, halaman yang Anda cari tidak tersedia.
        </p>
        <Link
          href="/"
          className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
