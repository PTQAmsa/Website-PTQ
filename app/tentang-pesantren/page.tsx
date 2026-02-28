import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export default function TentangPesantren() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <BackToTop />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
            Tentang Pesantren
          </h1>
          <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
            Pesantren Tadabbur Al-Qur'an Amsa001 Gadog
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Sejarah Pesantren</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Pesantren Tadabbur Al-Qur'an Amsa001 Gadog didirikan dengan visi untuk mencetak generasi Qur'ani yang tidak hanya hafal Al-Qur'an, tetapi juga memahami dan mengamalkan isinya dalam kehidupan sehari-hari.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Berlokasi di kawasan sejuk Gadog, Megamendung, Bogor, pesantren ini menyediakan lingkungan yang kondusif untuk belajar dan menghafal Al-Qur'an.
              </p>
            </div>
            <div>
              <img 
                src="/about-1.jpg" 
                alt="Pesantren" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <img 
                src="/about-2.jpg" 
                alt="Kegiatan Santri" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Metode Pembelajaran</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Kami menerapkan metode pembelajaran yang komprehensif, menggabungkan program tahfidz intensif dengan pendidikan formal setara SMP-SMA.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Sistem project-based learning kami membantu santri mengaplikasikan ilmu yang dipelajari dalam kehidupan nyata.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Keunggulan Pesantren</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Program Tahfidz Intensif</h3>
                <p className="text-gray-700">
                  Metode menghafal yang efektif dengan bimbingan ustadz berpengalaman
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Pendidikan Formal</h3>
                <p className="text-gray-700">
                  Setara SMP-SMA dengan kurikulum yang terintegrasi
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Lingkungan Kondusif</h3>
                <p className="text-gray-700">
                  Lokasi strategis di kawasan sejuk dengan fasilitas lengkap
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
