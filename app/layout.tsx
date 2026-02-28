import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pesantren Tadabbur Al-Qur'an Amsa001 Gadog - PSB 2026",
  description: "Pesantren Tadabbur Al-Qur'an Amsa001 Gadog - Penerimaan Santri Baru SMP-SMA Sederajat Putra-Putri. Program Tahfidz, Daurah, dan Sistem Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={plusJakartaSans.className}>{children}</body>
    </html>
  );
}
