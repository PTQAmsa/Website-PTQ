import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import RegistrationForm from '@/components/RegistrationForm';

export default function PendaftaranSantriBaru() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <BackToTop />

      {/* Hero Banner Section */}
      <section className="relative pt-24 pb-11 md:pt-32 md:pb-10 bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
            Pendaftaran Santri Baru
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-yellow-400 font-semibold mb-4">
            Tahun Ajaran 2026-2027 M / 1447-1448 H
          </p>
          <p className="text-base md:text-lg text-blue-100 max-w-3xl mx-auto">
            Bergabunglah bersama kami di Pesantren Tadabbur Al-Qur&apos;an Amsa001 Gadog
            <br className="hidden md:block" />
            Membentuk generasi Qur&apos;ani yang berakhlak mulia
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-9 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* 1. Persyaratan Pendaftaran */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Persyaratan Pendaftaran</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Dokumen yang Diperlukan:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">&#10003;</span>
                    <span className="text-gray-700">Fotocopy Kartu Keluarga (KK)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">&#10003;</span>
                    <span className="text-gray-700">Fotocopy Akta Kelahiran</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">&#10003;</span>
                    <span className="text-gray-700">Fotocopy Ijazah/SKHUN terakhir</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">&#10003;</span>
                    <span className="text-gray-700">Pas foto 3x4</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">&#10003;</span>
                    <span className="text-gray-700">Surat keterangan sehat dari dokter (opsional)</span>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Syarat Pendaftaran:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">&#10003;</span>
                    <span className="text-gray-700">Muslim/muslimah, berusia 12 - 15 tahun</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">&#10003;</span>
                    <span className="text-gray-700">Berijazah SD/MI atau SMP/MTs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">&#10003;</span>
                    <span className="text-gray-700">Mampu membaca Al-Qur&apos;an dengan baik dan benar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">&#10003;</span>
                    <span className="text-gray-700">Latar belakang pribadi, keluarga dan sosial yang baik</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">&#10003;</span>
                    <span className="text-gray-700">Memiliki motivasi dan semangat untuk menuntut ilmu, menghafal Al-Qur&apos;an, dan belajar</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 2. Formulir Pendaftaran */}
          <div id="form-pendaftaran" className="mb-16 scroll-mt-28">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Formulir Pendaftaran Online</h2>
            <RegistrationForm />
          </div>

          {/* 3. Alur Pendaftaran */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Alur Pendaftaran</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
                <h3 className="font-semibold text-blue-900 mb-2">Daftar Online</h3>
                <p className="text-gray-600 text-sm">Isi formulir pendaftaran online</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
                <h3 className="font-semibold text-blue-900 mb-2">Verifikasi</h3>
                <p className="text-gray-600 text-sm">Tim kami akan memverifikasi data Anda</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
                <h3 className="font-semibold text-blue-900 mb-2">Tes Masuk</h3>
                <p className="text-gray-600 text-sm">Tes baca Al-Qur&apos;an, Pengetahuan Umum dan Wawancara</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
                <h3 className="font-semibold text-blue-900 mb-2">Diterima</h3>
                <p className="text-gray-600 text-sm">Pengumuman dan daftar ulang</p>
              </div>
            </div>
          </div>

          {/* 4. Butuh Bantuan */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Butuh Bantuan?</h2>
            <p className="text-xl mb-6">Hubungi kami untuk informasi lebih lanjut</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <a
                href="https://wa.me/6285692253516"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition"
              >
                WhatsApp: +62 856-9225-3516
              </a>
              <a
                href="mailto:info@ptqamsa.id"
                className="bg-white text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Email: info@ptqamsa.id
              </a>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}