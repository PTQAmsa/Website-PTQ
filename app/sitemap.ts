import type { MetadataRoute } from 'next';
import { getPublishedArticles } from '@/lib/articles';
import { SITE_URL } from '@/lib/site';

// Dirender per permintaan: cache ISR sitemap di Vercel tidak ikut diperbarui saat
// artikel terjadwal terbit (Nov 2026 sitemap tertahan di 5 artikel). Biayanya kecil.
export const dynamic = 'force-dynamic';

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

const PAGES: { path: string; changeFrequency: ChangeFrequency; priority: number }[] = [
  { path: '', changeFrequency: 'monthly', priority: 1 },
  { path: '/pendaftaran-santri-baru', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/artikel', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/tentang-pesantren', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/majelis-kyai', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/visi-misi', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/beasiswa', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/tes-bakat', changeFrequency: 'yearly', priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPublishedArticles();
  const latestArticleDate = articles[0]?.updatedAt ?? articles[0]?.publishedAt;

  return [
    ...PAGES.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      ...(path === '/artikel' && latestArticleDate
        ? { lastModified: latestArticleDate }
        : {}),
      changeFrequency,
      priority,
    })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/artikel/${article.slug}`,
      lastModified: article.updatedAt ?? article.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
