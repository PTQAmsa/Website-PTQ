import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import MITest from '../../components/MITest';

export const metadata: Metadata = {
  title: 'Tes Bakat Multiple Intelligence',
  description: 'Temukan kecerdasan dominan anakmu melalui Tes Multiple Intelligence PTQ Amsa001. Gratis dan hanya butuh 2 menit!',
};

export default function TesBakatPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <MITest />
      </main>
      <Footer />
    </>
  );
}
