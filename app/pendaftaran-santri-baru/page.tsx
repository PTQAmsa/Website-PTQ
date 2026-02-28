import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export default function PendaftaranSantriBaru() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <BackToTop />
      
      {/* Hero Banner Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 overflow-hidden">
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
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
            Pendaftaran Santri Baru
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-yellow-400 font-semibold mb-4">
            Tahun Ajaran 2026-2027 M / 1447-1448 H
          </p>
          
          {/* Description */}
          <p className="text-base md:text-lg text-blue-100 max-w-3xl mx-auto mb-8">
            Bergabunglah bersama kami di Pesantren Tadabbur Al-Qur'an Amsa001 Gadog
            <br className="hidden md:block" />
            Membentuk generasi Qur'ani yang berakhlak mulia
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/6281329361375"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-900 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Tanya via WhatsApp</span>
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScJMfCAipPLibI5bb8VKpoikXMDcR16VjzouwRDzMWkM2CqNQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Daftar Sekarang</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-16">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition">
              <div className="text-3xl mb-3">🕌</div>
              <h3 className="text-white font-semibold text-lg mb-2">Putra & Putri</h3>
              <p className="text-blue-200 text-sm">Tersedia untuk santri putra dan putri</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition">
              <div className="text-3xl mb-3">📖</div>
              <h3 className="text-white font-semibold text-lg mb-2">SMP - SMA</h3>
              <p className="text-blue-200 text-sm">Tingkat SMP dan SMA sederajat</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="text-white font-semibold text-lg mb-2">Beasiswa</h3>
              <p className="text-blue-200 text-sm">Program beasiswa tersedia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Info Pendaftaran */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-8 md:p-12 mb-12 text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Pendaftaran Dibuka!</h2>
            <p className="text-xl text-blue-900 mb-6">
              Segera daftarkan putra-putri Anda untuk menjadi bagian dari keluarga besar PTQ Amsa001
            </p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScJMfCAipPLibI5bb8VKpoikXMDcR16VjzouwRDzMWkM2CqNQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition"
            >
              Daftar Online Sekarang
            </a>
          </div>

          {/* Persyaratan */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Persyaratan Pendaftaran</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Dokumen yang Diperlukan:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">✓</span>
                    <span className="text-gray-700">Fotocopy Kartu Keluarga (KK)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">✓</span>
                    <span className="text-gray-700">Fotocopy Akta Kelahiran</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">✓</span>
                    <span className="text-gray-700">Fotocopy Ijazah/SKHUN terakhir</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">✓</span>
                    <span className="text-gray-700">Pas foto 3x4 (3 lembar)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">✓</span>
                    <span className="text-gray-700">Surat keterangan sehat dari dokter (opsional)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Syarat Pendaftaran:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">✓</span>
                    <span className="text-gray-700">Muslim/muslimah, berusia 12 - 15 tahun</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">✓</span>
                    <span className="text-gray-700">Berijazah SD/MI atau SMP/MTs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">✓</span>
                    <span className="text-gray-700">Mampu membaca Al-Qur'an dengan baik dan benar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">✓</span>
                    <span className="text-gray-700">Latar belakang pribadi, keluarga dan sosial yang baik</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">✓</span>
                    <span className="text-gray-700">Memiliki motivasi dan semangat untuk menuntut ilmu, menghafal Al-Qur'an, dan belajar</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Alur Pendaftaran */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Alur Pendaftaran</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">Daftar Online</h3>
                <p className="text-gray-600 text-sm">Isi formulir pendaftaran online</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">Verifikasi</h3>
                <p className="text-gray-600 text-sm">Tim kami akan memverifikasi data Anda</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">Tes Masuk</h3>
                <p className="text-gray-600 text-sm">Tes baca Al-Qur'an, Pengetahuan Umum dan Wawancara</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  4
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">Diterima</h3>
                <p className="text-gray-600 text-sm">Pengumuman dan daftar ulang</p>
              </div>
            </div>
          </div>

          {/* Kontak */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Butuh Bantuan?</h2>
            <p className="text-xl mb-6">Hubungi kami untuk informasi lebih lanjut</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <a
                href="https://wa.me/6281329361375"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition"
              >
                WhatsApp: +62 813-2936-1375
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
