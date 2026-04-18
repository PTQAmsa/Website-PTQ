import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import VideoSection from '@/components/VideoSection';
import About from '@/components/About';
import Programs from '@/components/Programs';
// import Testimonials from '@/components/Testimonials';
import PSBBanner from '@/components/PSBBanner';
import Facilities from '@/components/Facilities';
import FAQPreview from '@/components/FAQPreview';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <VideoSection />
      <About />
      <Programs />
      {/* <Testimonials /> */}
      <PSBBanner />
      <Facilities />
      <FAQPreview />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  );
}
