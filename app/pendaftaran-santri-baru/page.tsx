import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import AlurPendaftaran from '@/components/AlurPendaftaran';
import Image from 'next/image';

export default function PendaftaranSantriBaru() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <BackToTop />

      {/* Hero Banner Section */}
      <section className="relative pt-24 pb-11 md:pt-32 md:pb-10 bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 overflow-hidden">
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

      {/* Banner PSB 2027 */}
      <section className="bg-white px-4 pt-10 pb-2">
        <div className="max-w-7xl mx-auto">
          <Image
            src="/banner-psb-2027.jpg"
            alt="Banner Penerimaan Santri Baru 2026-2027 PTQ Amsa001"
            width={1200}
            height={600}
            className="w-full h-auto rounded-2xl shadow-lg"
            priority
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="py-9 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Persyaratan Pendaftaran */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Persyaratan Pendaftaran</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Dokumen yang Diperlukan:</h3>
                <ul className="space-y-3">
                  {[
                    'Fotocopy Kartu Keluarga (KK)',
                    'Fotocopy Akta Kelahiran',
                    'Fotocopy Ijazah/SKHUN terakhir',
                    'Pas foto 3x4',
                    'Surat keterangan sehat dari dokter (opsional)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-yellow-500 text-xl">&#10003;</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Syarat Pendaftaran:</h3>
                <ul className="space-y-3">
                  {[
                    'Muslim/muslimah, berusia 12 - 15 tahun',
                    'Berijazah SD/MI atau SMP/MTs',
                    'Mampu membaca Al-Qur\'an dengan baik dan benar',
                    'Latar belakang pribadi, keluarga dan sosial yang baik',
                    'Memiliki motivasi dan semangat untuk menuntut ilmu, menghafal Al-Qur\'an, dan belajar',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-yellow-500 text-xl">&#10003;</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tombol Daftar Sekarang — di atas Alur Pendaftaran */}
          <div className="mb-10 text-center">
            <a
              href="https://forms.gle/L7GqaZdfDdZ2cxBK6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-md"
            >
              Daftar Sekarang →
            </a>
          </div>

          {/* Alur Pendaftaran — tanpa CTA button di bawah */}
          <div className="mb-16 -mx-4 sm:-mx-6 lg:-mx-8">
            <AlurPendaftaran hideCTA={true} />
          </div>

          {/* Butuh Bantuan */}
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
