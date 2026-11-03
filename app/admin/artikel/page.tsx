import Link from 'next/link';
import AdminLoginForm from '../AdminLoginForm';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { daysUntilPublish, formatArticleDate, getAllArticles, isPublished } from '@/lib/articles';

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

/**
 * Daftar semua artikel (terbit & terjadwal) — hanya untuk dilihat.
 * Artikel ditambah/diedit lewat data/articles.ts.
 */
export default async function AdminArtikelPage({ searchParams }: PageProps) {
  const { error: loginError } = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLoginForm next="/admin/artikel" error={loginError} />;
  }

  const now = new Date();
  const articles = getAllArticles();
  const scheduledCount = articles.filter((a) => !isPublished(a, now)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Dashboard Admin — Artikel</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Total: {articles.length} artikel · {articles.length - scheduledCount} terbit · {scheduledCount} terjadwal
          </p>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/admin/pendaftaran" className="text-sm text-gray-500 hover:text-emerald-700 transition-colors">
            Pendaftaran
          </Link>
          <form method="POST" action="/api/admin/logout">
            <button type="submit" className="text-sm text-gray-500 hover:text-red-600 transition-colors">
              Keluar
            </button>
          </form>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        <p className="text-sm text-gray-500 mb-5">
          Halaman ini hanya untuk melihat. Artikel terjadwal tampil otomatis di website mulai pukul 00:00 WIB
          pada tanggal terbitnya.
        </p>

        <ul className="space-y-3">
          {articles.map((article) => {
            const published = isPublished(article, now);
            const days = daysUntilPublish(article, now);

            return (
              <li
                key={article.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-4"
              >
                <img
                  src={article.image}
                  alt=""
                  className="w-full sm:w-40 aspect-video object-cover rounded-lg bg-gray-100 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {published ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2 py-0.5 rounded-full">
                        Terbit
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-2 py-0.5 rounded-full">
                        Terjadwal · {days === 1 ? 'besok' : `${days} hari lagi`}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{formatArticleDate(article.publishedAt)}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">{article.category}</span>
                  </div>

                  <h2 className="font-semibold text-gray-800 leading-snug">{article.title}</h2>
                  <p className="text-xs text-gray-400 mt-0.5 break-all">/artikel/{article.slug}</p>

                  <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Tag artikel">
                    {article.tags.map((tag) => (
                      <li key={tag} className="bg-blue-50 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        #{tag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex sm:flex-col gap-2 sm:items-end shrink-0">
                  <Link
                    href={`/admin/artikel/${article.slug}`}
                    className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors text-center"
                  >
                    Pratinjau
                  </Link>
                  {published && (
                    <a
                      href={`/artikel/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg transition-colors text-center"
                    >
                      Lihat di website
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
