import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

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
            Kesempatan Emas untuk Menuntut Ilmu
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Intro */}
          <div className="text-center mb-12">
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Pesantren Tadabbur Al-Qur'an Amsa001 Gadog berkomitmen untuk memberikan kesempatan kepada calon santri berprestasi dari keluarga kurang mampu melalui program beasiswa.
            </p>
          </div>

          {/* Jenis Beasiswa */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Jenis Beasiswa</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 hover:shadow-xl transition">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-3 text-center">Beasiswa Prestasi</h3>
                <p className="text-gray-700 text-center mb-4">
                  Untuk calon santri yang memiliki prestasi akademik atau non-akademik
                </p>
                <div className="bg-yellow-400 text-blue-900 font-bold text-center py-2 rounded-lg">
                  Potongan 25-50%
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-8 hover:shadow-xl transition">
                <div className="bg-yellow-500 text-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-3 text-center">Beasiswa Ekonomi</h3>
                <p className="text-gray-700 text-center mb-4">
                  Untuk calon santri dari keluarga kurang mampu
                </p>
                <div className="bg-blue-600 text-white font-bold text-center py-2 rounded-lg">
                  Potongan 50-100%
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 hover:shadow-xl transition">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-3 text-center">Beasiswa Hafidz</h3>
                <p className="text-gray-700 text-center mb-4">
                  Untuk calon santri yang sudah memiliki hafalan Al-Qur'an
                </p>
                <div className="bg-yellow-400 text-blue-900 font-bold text-center py-2 rounded-lg">
                  Potongan 30-75%
                </div>
              </div>
            </div>
          </div>

          {/* Persyaratan */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Persyaratan Beasiswa</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Beasiswa Prestasi & Hafidz:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span className="text-gray-700">Sertifikat prestasi/piagam penghargaan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span className="text-gray-700">Surat rekomendasi dari sekolah/lembaga</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span className="text-gray-700">Untuk hafidz: sertifikat hafalan dari lembaga terpercaya</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span className="text-gray-700">Mengikuti tes seleksi beasiswa</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Beasiswa Ekonomi:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span className="text-gray-700">Surat keterangan tidak mampu dari kelurahan/desa</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span className="text-gray-700">Fotocopy Kartu Keluarga Sejahtera (KKS) jika ada</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span className="text-gray-700">Surat pernyataan kesanggupan dari orang tua</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span className="text-gray-700">Survey ke rumah calon santri</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ketentuan */}
          <div className="bg-yellow-50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Ketentuan Beasiswa</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 text-2xl">★</span>
                <p className="text-gray-700">Beasiswa berlaku selama santri aktif dan memenuhi syarat yang ditentukan</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 text-2xl">★</span>
                <p className="text-gray-700">Penerima beasiswa wajib menjaga prestasi dan kedisiplinan</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 text-2xl">★</span>
                <p className="text-gray-700">Evaluasi beasiswa dilakukan setiap semester</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 text-2xl">★</span>
                <p className="text-gray-700">Beasiswa dapat dicabut jika santri melanggar peraturan pesantren</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Raih Kesempatan Emas Ini!</h2>
            <p className="text-xl mb-6">Daftarkan diri Anda sekarang dan wujudkan impian menghafal Al-Qur'an</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScJMfCAipPLibI5bb8VKpoikXMDcR16VjzouwRDzMWkM2CqNQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transition"
              >
                Daftar Beasiswa Sekarang
              </a>
              <a
                href="https://wa.me/6281329361375"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition"
              >
                Konsultasi via WhatsApp
              </a>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
