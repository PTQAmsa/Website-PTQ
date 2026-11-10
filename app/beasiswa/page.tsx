import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { URL_FORMULIR_PENDAFTARAN } from '@/lib/config/psb';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Beasiswa Yatim & Dhuafa | PTQ Amsa001",
  description: "Program beasiswa PTQ Amsa001 untuk santri yatim dan dhuafa: keringanan SPP 50% dan bebas biaya wakaf. Keringanan lain dapat dikonsultasikan.",
  alternates: { canonical: '/beasiswa' },
};

export default function Beasiswa() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <BackToTop />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
            Program Beasiswa
          </h1>
          <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
            Program Khusus Yatim &amp; Dhuafa
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Intro */}
          <div className="text-center mb-12">
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Pesantren Tadabbur Al-Qur'an Amsa001 Gadog berkomitmen membuka kesempatan menuntut ilmu dan menghafal Al-Qur'an bagi anak yatim dan dhuafa.
            </p>
          </div>

          {/* Program Yatim & Dhuafa */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-8 hover:shadow-xl transition">
              <div className="bg-yellow-500 text-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-900 mb-3 text-center">Program Khusus Yatim &amp; Dhuafa</h2>
              <p className="text-gray-700 text-center mb-4">
                Untuk calon santri yatim atau dari keluarga dhuafa
              </p>
              <div className="bg-blue-600 text-white font-bold text-center py-2 rounded-lg">
                Potongan SPP 50% + Bebas Wakaf
              </div>
              <p className="text-gray-600 text-sm text-center mt-4">
                Persyaratan dan dokumen pendukung dapat ditanyakan langsung kepada admin.
              </p>
            </div>
          </div>

          {/* Keringanan lainnya */}
          <div className="bg-yellow-50 rounded-lg p-8 mb-12 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Keringanan Lainnya</h2>
            <p className="text-gray-700 leading-relaxed">
              Selain program di atas, keringanan biaya lainnya dapat didiskusikan langsung dengan Kyai saat
              berkunjung ke pesantren. Silakan hubungi admin untuk menjadwalkan kunjungan.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ingin Tahu Lebih Lanjut?</h2>
            <p className="text-xl mb-6">Konsultasikan kebutuhan Anda dengan admin atau jadwalkan kunjungan ke pesantren</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <a
                href={URL_FORMULIR_PENDAFTARAN}
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transition"
              >
                Daftar Santri Baru
              </a>
              <a
                href="https://wa.me/6285692253516"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition"
              >
                Konsultasi &amp; Jadwalkan Kunjungan
              </a>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
