import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import WhatsAppFloat from '../components/WhatsAppFloat';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

// Deskripsi beranda di hasil Google (±155 karakter)
const DESKRIPSI =
  "Pesantren putra-putri di Gadog, Bogor, untuk lulusan SD dan SMP. Santri menghafal sekaligus memahami Al-Qur'an, dengan ijazah Mu'adalah yang diakui Kemenag.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ptqamsa.id"),
  title: "PTQ Amsa001 | Pesantren Tadabbur Al-Qur'an Terbaik di Bogor",
  description: DESKRIPSI,
  keywords: ["pesantren bogor", "tahfidz quran bogor", "ptq amsa001", "tadabbur alquran", "pondok pesantren bogor", "pesantren terbaik bogor"],
  authors: [{ name: "PTQ Amsa001" }],
  openGraph: {
    title: "PTQ Amsa001 - Pesantren Tadabbur Al-Qur'an",
    description: DESKRIPSI,
    // Tanpa url di sini: halaman lain tidak ikut mengaku sebagai beranda saat dibagikan
    siteName: "PTQ Amsa001",
    images: [
      {
        url: "https://www.ptqamsa.id/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Santri dan ustadz PTQ Amsa001 Gadog",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PTQ Amsa001 - Pesantren Tadabbur Al-Qur'an",
    description: DESKRIPSI,
    images: ["https://www.ptqamsa.id/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Pesantren Tadabbur Al-Qur'an Amsa001",
              "alternateName": "PTQ Amsa001",
              "url": "https://www.ptqamsa.id",
              "logo": "https://www.ptqamsa.id/Logo-color.png",
              "image": "https://www.ptqamsa.id/hero-bg-1.jpg",
              "description": "Pesantren tahfidz dan tadabbur Al-Qur'an putra-putri di Gadog, Megamendung, Bogor, dengan kurikulum Mu'adalah setara SMP–SMA",
              "telephone": "+62-856-9225-3516",
              "email": "pesantrentaddaburquran@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jl. Cikopo Selatan, Gg. Yulias, Kampung Sukabirus, Desa Gadog",
                "addressLocality": "Megamendung, Kabupaten Bogor",
                "addressRegion": "Jawa Barat",
                "postalCode": "16770",
                "addressCountry": "ID"
              },
              // Sama dengan titik peta Google Maps di bagian Kontak
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -6.6629298,
                "longitude": 106.8781296
              },
              "hasMap": "https://maps.app.goo.gl/1H7EXzVznGXvpLG7A",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Admissions",
                "telephone": "+62-856-9225-3516",
                "email": "pesantrentaddaburquran@gmail.com",
                "availableLanguage": ["Indonesian", "Arabic", "English"]
              },
              "sameAs": [
                "https://www.instagram.com/ptqamsa001",
                "https://www.youtube.com/@pesantrentadabburalquranamsa",
                "https://www.facebook.com/profile.php?id=61595199511907"
              ],
              "foundingDate": "2001",
              "founder": {
                "@type": "Person",
                "name": "KH. Drs. Aminullah Tsamud"
              }
            })
          }}
        />
        
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "PTQ Amsa001",
              "url": "https://www.ptqamsa.id"
            })
          }}
        />
      </head>
      <body className={plusJakartaSans.className}>
        {children}
        <WhatsAppFloat />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
