'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-shrink-0">
            <Link href="/">
              <Image
                src={isScrolled ? "/Logo-color.png" : "/Logo.png"}
                alt="PTQ Amsa001"
                width={160}
                height={56}
                className="h-14 w-auto transition-all duration-300"
                priority
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3 lg:gap-5">
            <Link href="/" className={`font-medium transition-colors hover:text-yellow-400 hover:font-bold ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>
              Beranda
            </Link>

            {/* Dropdown Pendaftaran */}
            <div className="relative group">
              <button className={`font-medium transition-colors hover:text-yellow-400 hover:font-bold ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}>
                Pendaftaran <svg className="inline-block w-2.5 h-2.5 ml-1" fill="currentColor" viewBox="0 0 10 6"><path d="M0 0l5 6 5-6z"/></svg>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <a href="/pendaftaran-santri-baru" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                  Pendaftaran Santri Baru
                </a>
              </div>
            </div>

            {/* Dropdown Tentang PTQ Amsa */}
            <div className="relative group">
              <button className={`font-medium transition-colors hover:text-yellow-400 hover:font-bold ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}>
                Tentang PTQ Amsa <svg className="inline-block w-2.5 h-2.5 ml-1" fill="currentColor" viewBox="0 0 10 6"><path d="M0 0l5 6 5-6z"/></svg>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <a href="/tentang-pesantren" target="_blank" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg">
                  Tentang Pesantren
                </a>
                <a href="/majelis-kyai" target="_blank" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg">
                  Majelis Kyai
                </a>
              </div>
            </div>

            <Link href="/#facilities" className={`font-medium transition-colors hover:text-yellow-400 hover:font-bold ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>
              Galeri
            </Link>
            <a href="/artikel" target="_blank" className={`font-medium transition-colors hover:text-yellow-400 hover:font-bold ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>
              Artikel
            </a>
            <a href="#contact" onClick={handleContactClick} className={`font-medium transition-colors hover:text-yellow-400 hover:font-bold ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>
              Kontak
            </a>
            <a href="/tes-bakat" className={`font-medium transition-colors hover:text-yellow-400 hover:font-bold ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>
              Tes MI
            </a>
            <a href="/faq" className={`font-medium transition-colors hover:text-yellow-400 hover:font-bold ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>
              FAQ
            </a>
            <a
              href="https://forms.gle/L7GqaZdfDdZ2cxBK6"
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-2 px-5 py-2 rounded-full font-semibold transition whitespace-nowrap flex-shrink-0 ${
                isScrolled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-yellow-400 text-blue-900 hover:bg-yellow-300'
              }`}
            >
              Daftar Online
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-yellow-500 hover:font-bold font-medium">
              Beranda
            </Link>

            {/* Mobile Dropdown Pendaftaran */}
            <div>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'pendaftaran' ? null : 'pendaftaran')}
                className="w-full text-left py-2 text-gray-700 hover:text-yellow-500 hover:font-bold font-medium flex justify-between items-center"
              >
                Pendaftaran
                <svg className={`w-3 h-3 transition-transform ${openDropdown === 'pendaftaran' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 10 6"><path d="M0 0l5 6 5-6z"/></svg>
              </button>
              {openDropdown === 'pendaftaran' && (
                <div className="pl-4 space-y-2 mt-2">
                  <a href="/pendaftaran-santri-baru" className="block py-2 text-gray-600 hover:text-blue-600">
                    Pendaftaran Santri Baru
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Dropdown Tentang */}
            <div>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'tentang' ? null : 'tentang')}
                className="w-full text-left py-2 text-gray-700 hover:text-yellow-500 hover:font-bold font-medium flex justify-between items-center"
              >
                Tentang PTQ Amsa
                <svg className={`w-3 h-3 transition-transform ${openDropdown === 'tentang' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 10 6"><path d="M0 0l5 6 5-6z"/></svg>
              </button>
              {openDropdown === 'tentang' && (
                <div className="pl-4 space-y-2 mt-2">
                  <a href="/tentang-pesantren" target="_blank" className="block py-2 text-gray-600 hover:text-blue-600">
                    Tentang Pesantren
                  </a>
                  <a href="/majelis-kyai" target="_blank" className="block py-2 text-gray-600 hover:text-blue-600">
                    Majelis Kyai
                  </a>
                </div>
              )}
            </div>

            <Link href="/#facilities" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-yellow-500 hover:font-bold font-medium">
              Galeri
            </Link>
            <a href="/artikel" target="_blank" className="block py-2 text-gray-700 hover:text-yellow-500 hover:font-bold font-medium">
              Artikel
            </a>
            <a href="#contact" onClick={handleContactClick} className="block py-2 text-gray-700 hover:text-yellow-500 hover:font-bold font-medium">
              Kontak
            </a>
            <a href="/tes-bakat" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-yellow-500 hover:font-bold font-medium">
              Tes MI
            </a>
            <a href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-yellow-500 hover:font-bold font-medium">
              FAQ
            </a>
            <a
              href="https://forms.gle/L7GqaZdfDdZ2cxBK6"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700"
            >
              Daftar Online
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}