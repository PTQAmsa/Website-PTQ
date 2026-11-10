import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import WhatsAppFloat from '../components/WhatsAppFloat';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ptqamsa.id"),
  title: "PTQ Amsa001 | Pesantren Tadabbur Al-Qur'an Terbaik di Bogor",
  description: "Mencetak generasi Qur'ani di Bogor. Program tahfidz dan tadabbur Al-Qur'an intensif di Pesantren Amsa001.",
  keywords: ["pesantren bogor", "tahfidz quran bogor", "ptq amsa001", "tadabbur alquran", "pondok pesantren bogor", "pesantren terbaik bogor"],
  authors: [{ name: "PTQ Amsa001" }],
  openGraph: {
    title: "PTQ Amsa001 - Pesantren Tadabbur Al-Qur'an",
    description: "Mencetak generasi Qur'ani.",
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
    description: "Pusat pembelajaran Al-Qur'an di Bogor.",
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
              "description": "Pesantren tahfidz dan tadabbur Al-Qur'an di Bogor yang mencetak generasi Qur'ani dengan program intensif",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Gadog",
                "addressLocality": "Bogor",
                "addressRegion": "Jawa Barat",
                "postalCode": "16770",
                "addressCountry": "ID"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-6.6667",
                "longitude": "106.9500"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Admissions",
                "availableLanguage": ["Indonesian", "Arabic", "English"]
              },
              "sameAs": [
                "https://www.instagram.com/ptqamsa001",
                "https://www.youtube.com/@pesantrentadabburalquranamsa"
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
