import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Link from 'next/link';
import Image from 'next/image';
import { formatArticleDate, getPublishedArticles } from '@/lib/articles';
import { SITE_URL } from '@/lib/site';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';

// Artikel terjadwal muncul tanpa deploy ulang (lihat lib/articles.ts)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Artikel & Berita | PTQ Amsa001',
  description:
    'Artikel seputar tahfidz dan tadabbur Al-Qur\'an, kehidupan santri, dan tips orang tua dari Pesantren Tadabbur Al-Qur\'an Amsa001 Bogor.',
  alternates: { canonical: `${SITE_URL}/artikel` },
};

export default function Artikel() {
  const articles = getPublishedArticles();

  return (
    <main className="min-h-screen">
      <Navbar />
      <BreadcrumbJsonLd items={[{ name: 'Artikel', path: '/artikel' }]} />
      <BackToTop />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
            Artikel & Berita
          </h1>
          <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
            Informasi, tips, dan inspirasi seputar dunia pesantren dan pendidikan Islam
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {articles.map((article) => (
              <Link 
                key={article.id}
                href={`/artikel/${article.slug}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-yellow-400 text-blue-900 text-xs font-semibold px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                    <time dateTime={article.publishedAt} className="text-gray-500 text-sm">{formatArticleDate(article.publishedAt)}</time>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-600 transition">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="text-blue-600 font-semibold hover:text-blue-800 transition flex items-center gap-2">
                    Baca Selengkapnya
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Ikuti kabar terbaru */}
          <div className="mt-12 bg-yellow-50 rounded-lg p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Dapatkan Kabar Terbaru</h2>
              <p className="text-gray-700 mb-6">
                Artikel baru terbit setiap pekan. Ikuti kegiatan santri sehari-hari di media sosial kami.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <a
                  href="https://www.instagram.com/ptqamsa001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                >
                  Instagram @ptqamsa001
                </a>
                <a
                  href="https://www.youtube.com/@pesantrentadabburalquranamsa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-900 border-2 border-blue-300 px-8 py-3 rounded-full font-semibold hover:border-blue-600 transition"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
