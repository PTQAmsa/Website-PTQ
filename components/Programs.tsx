export default function Programs() {
  const programs = [
    {
      title: 'Sistem Project',
      description: 'Sistem pembelajaran dibuat menyenangkan, gabungan dari tatap muka yang membuat santri berkolaborasi dengan kelompoknya',
      icon: '🎯'
    },
    {
      title: 'Daurah',
      description: 'Santri belajar satu ilmu tertentu dengan satu guru khusus. Daurah yang akan dilaksanakan adalah daurah tahsin Al-Qur\'an, bahasa Arab,dan bahasa Inggris',
      icon: '📚'
    },
    {
      title: 'Tahfidz Al-Qur\'an',
      description: 'Dimulai dengan lancar membaca Al-Qur\'an bin nadhr, fasih, dan sesuai dengan kaidah tajwid. Baru dilanjutkan dengan hafalan Al-Qur\'an',
      icon: '📖'
    }
  ];

  const ekstrakurikuler = [
    { 
      name: 'Pramuka', 
      image1: '/ekskul/Pramuka/pramuka-1.jpg',
      image2: '/ekskul/Pramuka/pramuka-2.JPG'
    },
    { 
      name: 'Muhadharah (Pidato 3 Bahasa)', 
      image1: '/ekskul/Muhadharah/muhadharah-1.jpg',
      image2: '/ekskul/Muhadharah/muhadharah-2.jpg'
    },
    { 
      name: 'Futsal', 
      image1: '/ekskul/Futsal/futsal-1.jpeg',
      image2: '/ekskul/Futsal/futsal-2.jpeg'
    },
    { 
      name: 'Basket', 
      image1: '/ekskul/Basket/Basket-1.jpg',
      image2: '/ekskul/Basket/Basket-2.jpg'
    },
    { 
      name: 'Panahan', 
      image1: '/ekskul/Panahan/Panahan-1.jpg',
      image2: '/ekskul/Panahan/Panahan-2.jpg'
    },
    { 
      name: 'Hadrah', 
      image1: '/ekskul/Hadrah/hadrah-1.png',
      image2: '/ekskul/Hadrah/hadrah-2.jpg'
    },
    { 
      name: 'Bela Diri', 
      image1: '/ekskul/Bela Diri/beladiri-1.jpg',
      image2: '/ekskul/Bela Diri/beladiri-2.png'
    },
    { 
      name: 'Study Club', 
      image1: '/ekskul/Study Club/studyclub-1.jpg',
      image2: '/ekskul/Study Club/studyclub-2.jpg'
    },
    { 
      name: 'Badminton', 
      image1: '/ekskul/Badminton/badminton-1.jpg',
      image2: '/ekskul/Badminton/badminton-2.jpeg'
    },
    { 
      name: 'Gym', 
      image1: '/ekskul/Gym/gym-1.jpg',
      image2: '/ekskul/Gym/gym-2.jpg'
    }
  ];

  return (
    <section id="programs" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-blue-800">
          Program Pendidikan
        </h2>
        <div className="w-24 h-1 bg-yellow-400 mx-auto mb-12"></div>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {programs.map((program, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition border-t-4 border-blue-600">
              <div className="text-5xl mb-4">{program.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-blue-800">{program.title}</h3>
              <p className="text-gray-600 leading-relaxed">{program.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-700 text-white p-10 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Ekstrakurikuler
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {ekstrakurikuler.map((ekskul, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Image Container */}
                <div className="relative aspect-square">
                  {/* Image 1 - Default */}
                  <img
                    src={ekskul.image1}
                    alt={`${ekskul.name} 1`}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                  />
                  {/* Image 2 - On Hover */}
                  <img
                    src={ekskul.image2}
                    alt={`${ekskul.name} 2`}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent"></div>
                </div>
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <div className="text-sm font-bold text-white drop-shadow-lg">{ekskul.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
