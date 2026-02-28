'use client';

import { useState, useEffect } from 'react';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/">
              <img 
                src={isScrolled ? "/Logo-color.png" : "/Logo.png"}
                alt="PTQ Amsa001" 
                className="h-15 md:h-14 w-auto transition-all duration-300"
              />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className={`font-medium transition-colors hover:text-yellow-400 hover:font-bold ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>
              Beranda
            </a>

            {/* Dropdown Pendaftaran */}
            <div className="relative group">
              <button className={`font-medium transition-colors hover:text-yellow-400 hover:font-bold ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}>
                Pendaftaran ▾
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <a href="/pendaftaran-santri-baru" target="_blank" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg">
                  Pendaftaran Santri Baru
                </a>
                <a href="/beasiswa" target="_blank" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg">
                  Beasiswa
                </a>
              </div>
            </div>

            {/* Dropdown Tentang PTQ Amsa */}
            <div className="relative group">
              <button className={`font-medium transition-colors hover:text-yellow-400 hover:font-bold ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}>
                Tentang PTQ Amsa ▾
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <a href="/tentang-pesantren" target="_blank" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg">
                  Tentang Pesantren
                </a>
                <a href="/visi-misi" target="_blank" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  Visi & Misi
                </a>
                <a href="/majelis-kyai" target="_blank" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg">
                  Majelis Kyai
                </a>
              </div>
            </div>

            <a href="/#facilities" className={`font-medium transition-colors hover:text-yellow-400 hover:font-bold ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>
              Galeri
            </a>
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
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScJMfCAipPLibI5bb8VKpoikXMDcR16VjzouwRDzMWkM2CqNQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-2 rounded-full font-semibold transition ${
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
            <a href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-yellow-500 hover:font-bold font-medium">
              Beranda
            </a>
            
            {/* Mobile Dropdown Pendaftaran */}
            <div>
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'pendaftaran' ? null : 'pendaftaran')}
                className="w-full text-left py-2 text-gray-700 hover:text-yellow-500 hover:font-bold font-medium flex justify-between items-center"
              >
                Pendaftaran
                <span>{openDropdown === 'pendaftaran' ? '▴' : '▾'}</span>
              </button>
              {openDropdown === 'pendaftaran' && (
                <div className="pl-4 space-y-2 mt-2">
                  <a href="/pendaftaran-santri-baru" target="_blank" className="block py-2 text-gray-600 hover:text-blue-600">
                    Pendaftaran Santri Baru
                  </a>
                  <a href="/beasiswa" target="_blank" className="block py-2 text-gray-600 hover:text-blue-600">
                    Beasiswa
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
                <span>{openDropdown === 'tentang' ? '▴' : '▾'}</span>
              </button>
              {openDropdown === 'tentang' && (
                <div className="pl-4 space-y-2 mt-2">
                  <a href="/tentang-pesantren" target="_blank" className="block py-2 text-gray-600 hover:text-blue-600">
                    Tentang Pesantren
                  </a>
                  <a href="/visi-misi" target="_blank" className="block py-2 text-gray-600 hover:text-blue-600">
                    Visi & Misi
                  </a>
                  <a href="/majelis-kyai" target="_blank" className="block py-2 text-gray-600 hover:text-blue-600">
                    Majelis Kyai
                  </a>
                </div>
              )}
            </div>

            <a href="/#facilities" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-yellow-500 hover:font-bold font-medium">
              Galeri
            </a>
            <a href="/artikel" target="_blank" className="block py-2 text-gray-700 hover:text-yellow-500 hover:font-bold font-medium">
              Artikel
            </a>
            <a href="#contact" onClick={handleContactClick} className="block py-2 text-gray-700 hover:text-yellow-500 hover:font-bold font-medium">
              Kontak
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScJMfCAipPLibI5bb8VKpoikXMDcR16VjzouwRDzMWkM2CqNQ/viewform"
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
