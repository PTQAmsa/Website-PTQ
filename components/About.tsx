'use client';

import { useState, useEffect } from 'react';

export default function About() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    '/about-1.jpg',
    '/about-2.jpg',
    '/about-3.jpg',
    '/about-4.png',
    '/about-5.jpg',
    '/about-6.jpg',
    '/about-7.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Ganti gambar setiap 5 detik

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="about" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-blue-800">
          Profil Singkat
        </h2>
        <div className="w-24 h-1 bg-yellow-400 mx-auto mb-12"></div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl h-96 overflow-hidden shadow-xl">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentImage ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Pesantren ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              
              {/* Previous Button */}
              <button
                onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Next Button */}
              <button
                onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            {/* Indicator dots */}
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImage
                      ? 'bg-blue-600 w-8'
                      : 'bg-blue-300 hover:bg-blue-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Pesantren ini dibangun untuk menyiapkan kader-kader bangsa yang siap terjun ke masyarakat dengan berbagai tantangan yang harus dihadapi.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Para santri/wati tidak hanya disiapkan dengan penguasaan akhlaqul karimah, ilmu-ilmu agama umum, serta kesehatan fisik & mental. Tapi juga dibekali dengan berbagai keterampilan untuk hidup sukses ditengah era disrupsi global di masa depan.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Selain menghafal Al-Qur'an, santri juga dibiasakan untuk memahami arti ayat-ayat Al-Qur'an yang dibaca serta mentadabburinya.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Mengapa Pilih Kami?</h3>
              <p className="text-gray-700">
                Kami menggali potensi dan bakat kecerdasan setiap santri sedari awal melalui asesmen digital yang terpercaya. Hasil tes ini menjadi dasar kami untuk memberikan pendidikan, pengajaran dan pengasuhan yang terbaik untuk setiap santri.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
