import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PSBBanner from '@/components/PSBBanner';
import AlurPendaftaran from '@/components/AlurPendaftaran';
import About from '@/components/About';
import Programs from '@/components/Programs';
// import Testimonials from '@/components/Testimonials';
import Facilities from '@/components/Facilities';
import VideoSection from '@/components/VideoSection';
import FAQPreview from '@/components/FAQPreview';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <PSBBanner />
      <AlurPendaftaran />
      <About />
      <Programs />
      {/* <Testimonials /> */}
      <Facilities />
      <VideoSection />
      <FAQPreview />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  );
}
