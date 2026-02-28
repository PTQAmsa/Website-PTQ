'use client';

import { useState, useEffect } from 'react';

const testimonials = [
  // Slide 1
  [
    {
      name: "K.H. Hasan Abdullah Sahal",
      role: "Pimpinan Pondok Modern Darussalam Gontor",
      text: "Keunggulan islam dan umatnya mudah-mudahan bisa dengan pengawalan keluarga besar PTQ Amsa, amin",
      rating: 5
    },
    {
      name: "Prof. Dr. Muhadjir Effendy, M.AP",
      role: "Menko Bidang Pembangunan Manusia Dan Kebudayaan 2019-2024",
      text: "Kampus PTQ Amsa ini sangat kaya dengan inspirasi di Indonesia oleh anak-anak muda yang penuh desikasi. Mudah-mudahan akan mencerdaskan kehidupan bangsa. Aamiin",
      rating: 5
    },
    {
      name: "Prof. KH. Yahya Zainul Ma'arif, Lc., M.A., Ph.D",
      role: "Ulama",
      text: "Pandai pandailah mensyukuri karunia kebaikan yang Allah mudahkan untuk mu. Dengan syukurmu niscaya Allah akan abadikan & tambah nikmatkan karunia kebaikan tersebut",
      rating: 5
    }
  ],
  // Slide 2
  [
    {
      name: "Dr. H. Ahmad Lutfi Fathullah, M.A",
      role: "Ketua Umum Pengurus Besar Nahdlatul Ulama",
      text: "Pesantren Tadabbur Al-Qur'an Amsa001 adalah lembaga pendidikan yang sangat baik dalam membentuk karakter santri yang berakhlakul karimah",
      rating: 5
    },
    {
      name: "Ustadzah Hj. Siti Nurjanah, S.Pd.I",
      role: "Pengasuh Pondok Pesantren Al-Hikmah",
      text: "Metode pembelajaran yang diterapkan sangat efektif dalam membantu santri menghafal dan memahami Al-Qur'an dengan baik",
      rating: 5
    },
    {
      name: "Bapak Ir. Muhammad Ridwan",
      role: "Wali Santri",
      text: "Alhamdulillah, anak saya mengalami perkembangan yang sangat positif sejak mondok di PTQ Amsa001. Akhlak dan hafalannya meningkat pesat",
      rating: 5
    }
  ]
];

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Testimoni
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Apa kata mereka tentang Pesantren Tadabbur Al-Qur'an Amsa001 Gadog
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((slide, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-3 gap-8">
                    {slide.map((testimonial, index) => (
                      <div 
                        key={index}
                        className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                      >
                        {/* Stars */}
                        <div className="flex gap-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <svg 
                              key={i}
                              className="w-5 h-5 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>

                        {/* Testimonial Text */}
                        <p className="text-gray-700 leading-relaxed mb-6 min-h-[120px]">
                          "{testimonial.text}"
                        </p>

                        {/* Author Info */}
                        <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-blue-900 text-sm md:text-base">
                              {testimonial.name}
                            </h4>
                            <p className="text-gray-600 text-xs md:text-sm">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all ${
                  currentSlide === index
                    ? 'w-8 h-3 bg-blue-600'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                } rounded-full`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
