import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PTQ Amsa001 | Pesantren Tadabbur Al-Qur'an Terbaik di Bogor",
  description: "Mencetak generasi Qur'ani di Bogor. Program tahfidz dan tadabbur Al-Qur'an intensif di Pesantren Amsa001.",
  keywords: ["pesantren bogor", "tahfidz quran bogor", "ptq amsa001", "tadabbur alquran", "pondok pesantren bogor", "pesantren terbaik bogor"],
  authors: [{ name: "PTQ Amsa001" }],
  openGraph: {
    title: "PTQ Amsa001 - Pesantren Tadabbur Al-Qur'an",
    description: "Pusat pembelajaran Al-Qur'an di Bogor.",
    url: "https://ptqamsa.id",
    siteName: "PTQ Amsa001",
    images: [
      {
        url: "https://ptqamsa.id/Logo-color.png",
        width: 1200,
        height: 630,
        alt: "PTQ Amsa001 Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PTQ Amsa001 - Pesantren Tadabbur Al-Qur'an",
    description: "Pusat pembelajaran Al-Qur'an di Bogor.",
    images: ["https://ptqamsa.id/Logo-color.png"],
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
              "url": "https://ptqamsa.id",
              "logo": "https://ptqamsa.id/Logo-color.png",
              "image": "https://ptqamsa.id/hero-bg-1.jpg",
              "description": "Pesantren tahfidz dan tadabbur Al-Qur'an di Bogor yang mencetak generasi Qur'ani dengan program intensif",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Gadog",
                "addressLocality": "Bogor",
                "addressRegion": "Jawa Barat",
                "postalCode": "16710",
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
                "https://www.youtube.com/@ptqamsa001"
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
              "url": "https://ptqamsa.id",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://ptqamsa.id/artikel?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Beranda",
                  "item": "https://ptqamsa.id"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Pendaftaran",
                  "item": "https://ptqamsa.id/pendaftaran-santri-baru"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Artikel",
                  "item": "https://ptqamsa.id/artikel"
                }
              ]
            })
          }}
        />
      </head>
      <body className={plusJakartaSans.className}>{children}</body>
    </html>
  );
}
