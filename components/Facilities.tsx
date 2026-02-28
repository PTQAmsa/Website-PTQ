export default function Facilities() {
  // Baris 1: 10 foto (scroll kanan ke kiri)
  const row1Images = [
    '/galeri/galeri-1.jpg',
    '/galeri/galeri-2.jpg',
    '/galeri/galeri-3.jpg',
    '/galeri/galeri-4.jpg',
    '/galeri/galeri-5.jpg',
    '/galeri/galeri-6.jpg',
    '/galeri/galeri-7.jpg',
    '/galeri/galeri-8.jpg',
    '/galeri/galeri-9.JPG',
    '/galeri/galeri-10.jpg'
  ];

  // Baris 2: 10 foto (scroll kiri ke kanan)
  const row2Images = [
    '/galeri/galeri-11.jpg',
    '/galeri/galeri-12.jpg',
    '/galeri/galeri-13.jpg',
    '/galeri/galeri-14.jpg',
    '/galeri/galeri-15.jpeg',
    '/galeri/galeri-16.jpeg',
    '/galeri/galeri-17.png',
    '/galeri/galeri-18.JPG',
    '/galeri/galeri-19.jpeg',
    '/galeri/galeri-20.jpg'
  ];

  return (
    <section id="facilities" className="py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-4xl font-bold text-center mb-4 text-blue-800">
          Galeri Kegiatan
        </h2>
        <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
      </div>

      {/* Row 1 - Scroll Right to Left */}
      <div className="relative mb-8">
        <div className="flex gap-6 animate-scroll-left-seamless">
          {/* Duplicate images twice for seamless loop */}
          {[...row1Images, ...row1Images].map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 h-52 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            >
              <img
                src={image}
                alt={`Galeri ${(index % row1Images.length) + 1}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Scroll Left to Right */}
      <div className="relative">
        <div className="flex gap-6 animate-scroll-right-seamless">
          {/* Duplicate images twice for seamless loop */}
          {[...row2Images, ...row2Images].map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 h-52 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            >
              <img
                src={image}
                alt={`Galeri ${(index % row2Images.length) + 11}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-gray-600 mt-12 italic">
        Berbagai kegiatan pembelajaran dan ekstrakurikuler yang mengembangkan potensi santri
      </p>
    </section>
  );
}
