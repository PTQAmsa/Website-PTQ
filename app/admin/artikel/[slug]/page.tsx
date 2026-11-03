import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminLoginForm from '../../AdminLoginForm';
import ArticleBody from '@/components/ArticleBody';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { daysUntilPublish, formatArticleDate, getArticleBySlug, isPublished } from '@/lib/articles';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}

/** Pratinjau artikel, termasuk yang belum terbit. Tidak diindeks (lihat admin/layout.tsx). */
export default async function AdminArtikelPreview({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { error: loginError } = await searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLoginForm next={`/admin/artikel/${slug}`} error={loginError} />;
  }

  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const published = isPublished(article);
  const days = daysUntilPublish(article);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner pratinjau */}
      <div
        className={`sticky top-0 z-10 border-b px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-sm ${
          published
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}
      >
        <p>
          <strong>Pratinjau admin.</strong>{' '}
          {published
            ? `Artikel ini sudah terbit sejak ${formatArticleDate(article.publishedAt)}.`
            : `Terjadwal terbit ${formatArticleDate(article.publishedAt)} (${
                days === 1 ? 'besok' : `${days} hari lagi`
              }). Belum terlihat oleh pengunjung.`}
        </p>
        <div className="flex items-center gap-4">
          {published && (
            <a
              href={`/artikel/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Lihat di website
            </a>
          )}
          <Link href="/admin/artikel" className="underline hover:no-underline">
            Kembali ke daftar
          </Link>
        </div>
      </div>

      <article className="pt-10 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleBody article={article} />
        </div>
      </article>
    </main>
  );
}
