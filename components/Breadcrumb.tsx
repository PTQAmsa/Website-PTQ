import Link from 'next/link';
import BreadcrumbJsonLd from './BreadcrumbJsonLd';

type Crumb = { name: string; path: string };

const WARNA = {
  // Di atas header biru
  dark: { link: 'text-blue-200 hover:text-white', sep: 'text-blue-300', current: 'text-white' },
  // Di atas latar putih
  light: { link: 'text-blue-600 hover:text-blue-800', sep: 'text-gray-400', current: 'text-gray-600' },
};

/**
 * Jejak halaman yang terlihat pengunjung ("Beranda › Artikel › ..."), sekaligus
 * versi untuk Google. "Beranda" otomatis ditambahkan di depan; item terakhir
 * adalah halaman yang sedang dibuka.
 */
export default function Breadcrumb({
  items,
  tone = 'dark',
  align = 'center',
}: {
  items: Crumb[];
  tone?: keyof typeof WARNA;
  align?: 'center' | 'start';
}) {
  const warna = WARNA[tone];
  const semua = [{ name: 'Beranda', path: '/' }, ...items];

  return (
    <>
      <BreadcrumbJsonLd items={items} />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className={`flex min-w-0 items-center gap-1.5 ${align === 'center' ? 'justify-center' : ''}`}>
          {semua.map((item, i) => {
            const terakhir = i === semua.length - 1;
            return (
              <li key={item.path} className={`flex items-center gap-1.5 ${terakhir ? 'min-w-0' : 'shrink-0'}`}>
                {i > 0 && <span aria-hidden="true" className={warna.sep}>›</span>}
                {terakhir ? (
                  <span aria-current="page" className={`truncate ${warna.current}`}>{item.name}</span>
                ) : (
                  <Link href={item.path} className={warna.link}>{item.name}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
