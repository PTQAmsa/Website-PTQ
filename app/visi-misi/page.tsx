import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export default function VisiMisi() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <BackToTop />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
            Visi & Misi
          </h1>
          <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
            Pesantren Tadabbur Al-Qur'an Amsa001 Gadog
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Visi */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 md:p-12 text-white mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">VISI</h2>
              <p className="text-xl md:text-2xl text-center leading-relaxed">
                Mencetak generasi Qur'ani yang berakhlak mulia, berprestasi, dan bermanfaat bagi umat
              </p>
            </div>
          </div>

          {/* Misi */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">MISI</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 text-blue-900 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                    1
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      Menyelenggarakan pendidikan Al-Qur'an dengan metode tahfidz dan tadabbur yang efektif
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 text-blue-900 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                    2
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      Membentuk karakter santri yang berakhlakul karimah sesuai tuntunan Al-Qur'an dan As-Sunnah
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 text-blue-900 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                    3
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      Mengintegrasikan pendidikan formal dengan pendidikan pesantren untuk menghasilkan santri yang unggul
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 text-blue-900 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                    4
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      Mengembangkan potensi santri melalui berbagai program ekstrakurikuler dan kegiatan positif
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 text-blue-900 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                    5
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      Mempersiapkan santri menjadi pemimpin masa depan yang berilmu dan bertakwa
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 text-blue-900 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                    6
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      Menciptakan lingkungan belajar yang kondusif dan Islami untuk perkembangan optimal santri
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nilai-Nilai */}
          <div className="bg-gradient-to-br from-yellow-50 to-blue-50 rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Nilai-Nilai Pesantren</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-900 text-lg">Qur'ani</h3>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-900 text-lg">Akhlak Mulia</h3>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-900 text-lg">Disiplin</h3>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-900 text-lg">Berprestasi</h3>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
