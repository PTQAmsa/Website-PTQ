import { articles, type Article } from '@/data/articles';

/**
 * Artikel terjadwal: artikel baru tampil (halaman, daftar, sitemap) mulai
 * pukul 00:00 WIB pada tanggal `publishedAt`. Halaman artikel di-revalidate
 * tiap jam, jadi artikel muncul paling lambat ±1 jam setelahnya tanpa deploy.
 */

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

function todayInWib(now: Date): string {
  return new Date(now.getTime() + WIB_OFFSET_MS).toISOString().slice(0, 10);
}

export function isPublished(article: Article, now = new Date()): boolean {
  return article.publishedAt <= todayInWib(now);
}

/** Artikel yang sudah terbit, terbaru lebih dulu. */
export function getPublishedArticles(now = new Date()): Article[] {
  return articles
    .filter((article) => isPublished(article, now))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPublishedArticle(slug: string, now = new Date()): Article | undefined {
  const article = articles.find((a) => a.slug === slug);
  return article && isPublished(article, now) ? article : undefined;
}

/** "2026-01-11" → "11 Januari 2026" */
export function formatArticleDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00+07:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
}
