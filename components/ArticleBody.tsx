import type { Article } from '@/data/articles';
import { formatArticleDate } from '@/lib/articles';

/**
 * Isi artikel (kategori, tanggal, judul, gambar, konten, tag).
 * Dipakai halaman publik /artikel/[slug] dan pratinjau admin, supaya
 * pratinjau selalu sama persis dengan tampilan yang dilihat pengunjung.
 */
export default function ArticleBody({ article }: { article: Article }) {
  return (
    <>
      {/* Category & Date */}
      <div className="flex items-center gap-4 mb-6">
        <span className="bg-yellow-400 text-blue-900 px-4 py-1 rounded-full text-sm font-bold">
          {article.category}
        </span>
        <time dateTime={article.publishedAt} className="text-gray-500">
          {formatArticleDate(article.publishedAt)}
        </time>
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

      {/* Tags */}
      {article.tags.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tag artikel">
          {article.tags.map((tag) => (
            <li
              key={tag}
              className="bg-blue-50 text-blue-800 text-sm px-3 py-1 rounded-full"
            >
              #{tag}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
