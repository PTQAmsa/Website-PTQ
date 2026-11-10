import { SITE_URL } from '@/lib/site';

type Crumb = { name: string; path: string };

/**
 * Jejak halaman (breadcrumb) untuk Google. Di hasil pencarian alamat halaman
 * tampil sebagai "ptqamsa.id › Artikel › ..." alih-alih URL mentah.
 * "Beranda" otomatis ditambahkan di depan.
 */
export default function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Beranda', path: '' }, ...items].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" supaya judul artikel tidak bisa menutup tag <script>
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}
