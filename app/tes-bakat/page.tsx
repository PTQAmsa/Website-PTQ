import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import MITest from '../../components/MITest';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: 'Tes Bakat Multiple Intelligence Gratis | PTQ Amsa001',
  description: 'Temukan kecerdasan dominan anakmu melalui Tes Multiple Intelligence PTQ Amsa001. Gratis dan hanya butuh 2 menit!',
  alternates: { canonical: '/tes-bakat' },
};

export default function TesBakatPage() {
  return (
    <>
      <Navbar />
      <BreadcrumbJsonLd items={[{ name: 'Tes Bakat', path: '/tes-bakat' }]} />
      <main className="min-h-screen bg-gray-50">
        <MITest />
      </main>
      <Footer />
    </>
  );
}
