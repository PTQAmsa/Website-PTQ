import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export default function MajelisKyai() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <BackToTop />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
            Majelis Kyai
          </h1>
          <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
            Para Pengasuh dan Pembimbing Pesantren
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Majelis Kyai */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Majelis Kyai</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Para pemimpin dan pengasuh yang membimbing perjalanan spiritual dan pendidikan santri di Pesantren Tadabbur Al-Qur'an Amsa001 Gadog
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Kyai 1 - Pengasuh & Pendiri */}
              <div className="bg-gradient-to-br from-blue-50 to-yellow-50 rounded-lg p-8 shadow-lg hover:shadow-xl transition">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-blue-600 shadow-lg">
                    <img 
                      src="/kyai/kyai-aminullah.jpg" 
                      alt="KH. Drs. Aminullah Tsamud"
                      className="w-full h-full object-cover scale-125"
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-2">
                    KH. Drs. Aminullah Tsamud
                  </h3>
                  <div className="inline-block bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    Pengasuh & Pendiri
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Pendiri dan pengasuh utama pesantren yang memiliki visi kuat dalam membentuk generasi Qur'ani yang berakhlak mulia dan berwawasan luas.
                  </p>
                </div>
              </div>

              {/* Kyai 2 - Kepala Sekolah */}
              <div className="bg-gradient-to-br from-blue-50 to-yellow-50 rounded-lg p-8 shadow-lg hover:shadow-xl transition">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-blue-600 shadow-lg">
                    <img 
                      src="/kyai/kyai-zubaidi.jpg" 
                      alt="Kyai Drs. Zubaidi, MM."
                      className="w-full h-full object-cover scale-125"
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-2">
                    Kyai Drs. Zubaidi, MM.
                  </h3>
                  <div className="inline-block bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    Kepala Sekolah
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Memimpin sistem pendidikan formal di pesantren dengan menggabungkan kurikulum nasional dan nilai-nilai keislaman secara seimbang.
                  </p>
                </div>
              </div>

              {/* Kyai 3 - Direktur Pesantren */}
              <div className="bg-gradient-to-br from-blue-50 to-yellow-50 rounded-lg p-8 shadow-lg hover:shadow-xl transition">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-blue-600 shadow-lg">
                    <img 
                      src="/kyai/kyai-ahmadie.jpg" 
                      alt="KH. Drs. Ahmadie Thaha, M.Si."
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-2">
                    KH. Drs. Ahmadie Thaha, M.Si.
                  </h3>
                  <div className="inline-block bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    Direktur Pesantren
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Mengelola operasional dan pengembangan pesantren secara menyeluruh untuk mencapai visi dan misi yang telah ditetapkan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Komitmen */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Komitmen Kami</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-400 text-blue-900 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <p className="leading-relaxed">
                  Membimbing santri dengan penuh kasih sayang dan kesabaran
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-yellow-400 text-blue-900 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <p className="leading-relaxed">
                  Menjadi teladan dalam berakhlak dan beribadah
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-yellow-400 text-blue-900 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <p className="leading-relaxed">
                  Mengembangkan metode pembelajaran yang efektif
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-yellow-400 text-blue-900 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <p className="leading-relaxed">
                  Memperhatikan perkembangan setiap santri secara individual
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
