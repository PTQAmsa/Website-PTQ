'use client';

import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Link from 'next/link';
import { articles } from '@/data/articles';

export default function ArtikelDetail() {
  const params = useParams();
  const article = articles.find(a => a.slug === params.slug);

  if (!article) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Artikel Tidak Ditemukan</h1>
          <Link href="/artikel" className="text-blue-600 hover:text-blue-800">
            Kembali ke Daftar Artikel
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <BackToTop />

      {/* Article Header */}
      <article className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/artikel" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Artikel
            </Link>
          </div>

          {/* Category & Date */}
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-yellow-400 text-blue-900 px-4 py-1 rounded-full text-sm font-bold">
              {article.category}
            </span>
            <span className="text-gray-500">{article.date}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">{article.author}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-8 leading-tight">
            {article.title}
          </h1>

          {/* Featured Image */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src={article.image}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none 
              prose-headings:text-blue-900 prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8
              prose-h3:text-2xl prose-h3:border-l-4 prose-h3:border-yellow-400 prose-h3:pl-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-justify
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-blue-900 prose-strong:font-bold
              prose-em:text-blue-800 prose-em:italic
              prose-ul:my-6 prose-li:mb-2
              prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:pl-4 prose-blockquote:italic
              bg-white rounded-xl p-8 shadow-sm"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Bagikan Artikel</h3>
            <div className="flex gap-4">
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(article.title + ' - ' + window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
