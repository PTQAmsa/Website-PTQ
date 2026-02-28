'use client';

import { useState, useEffect } from 'react';

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    '/hero-bg-1.jpg',
    '/hero-bg-2.jpeg',
    '/hero-bg-3.jpeg',
    '/hero-bg-4.jpg'
  ];

  useEffect(() => {
    // Durasi berbeda untuk gambar pertama (5 detik) dan lainnya (4 detik)
    const duration = currentImage === 0 ? 5000 : 4000;
    
    const timer = setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentImage, images.length]);

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800">
      {/* Background Images with Slideshow */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${image}')` }}
          ></div>
        ))}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-900/80"></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02LTYgMi42OS02IDYgMi42OSA2IDYgNnptMC00YzEuMSAwIDItLjkgMi0ycy0uOS0yLTItMi0yIC45LTIgMiAuOSAyIDIgMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-7xl mb-4 opacity-95 font-bold drop-shadow-md">
          Penerimaan Santri Baru</h1>
        <h1 className="text-3xl md:text-5xl mb-8 opacity-95 font-semibold drop-shadow-md">
          (Putra - Putri)
        </h1>
        <p className="text-xl md:text-3xl mb-2 text-yellow-400 drop-shadow-lg">
          SMP-SMA Sederajat
        </p>
        <p className="text-xl md:text-3xl mb-8 opacity-90 max-w-3xl mx-auto drop-shadow-md font-semibold">
          Tahun Ajaran 2026-2027 M / 1447-1448 H
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#about" className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition shadow-lg">
            Tentang Kami
          </a>
          <a href="#contact" className="border-2 border-yellow-400 text-yellow-400 px-8 py-3 rounded-full font-bold hover:bg-yellow-400 hover:text-blue-900 transition">
            Hubungi Kami
          </a>
        </div>
      </div>
      
      {/* Indicator dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentImage
                ? 'bg-yellow-400 w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
