import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Block jika ada halaman admin
    },
    sitemap: 'https://ptqamsa.id/sitemap.xml',
  };
}
