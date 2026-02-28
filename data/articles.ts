export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
}

export const articles: Article[] = [
  {
    id: '1',
    title: 'Pentingnya Keseimbangan Antara Ilmu Agama dan Teknologi di Era Digital',
    slug: 'keseimbangan-ilmu-agama-dan-teknologi',
    excerpt: 'Di era di mana kecerdasan buatan (AI), algoritma, dan konektivitas global mendominasi setiap lini kehidupan, muncul sebuah tantangan besar: Bagaimana kita tetap berpijak pada nilai-nilai langit sambil melesat dengan teknologi bumi?',
    content: `
      <p>Di era di mana kecerdasan buatan (AI), algoritma, dan konektivitas global mendominasi setiap lini kehidupan, muncul sebuah tantangan besar: <strong>Bagaimana kita tetap berpijak pada nilai-nilai langit sambil melesat dengan teknologi bumi?</strong></p>
      
      <p>Bagi santri dan generasi muda Muslim, teknologi bukanlah musuh yang harus dijauhi, melainkan alat (<em>wasilah</em>) yang harus dikuasai. Namun, tanpa pondasi ilmu agama yang kokoh, teknologi ibarat kapal besar tanpa nakhoda—canggih, namun rawan karam diterjang badai disrupsi moral.</p>
      
      <h3>1. Ilmu Agama sebagai Kompas Etika</h3>
      <p>Teknologi menyediakan kecepatan, tetapi agama menyediakan arah. Di dunia digital yang penuh dengan hoaks, konten negatif, dan algoritma yang memicu adiksi, ilmu agama berfungsi sebagai penyaring (<em>filter</em>). Pemahaman tentang adab dan <em>akhlaqul karimah</em> memastikan bahwa jempol kita di layar smartphone tidak menjadi saksi yang memberatkan di akhirat kelak.</p>
      
      <h3>2. Teknologi sebagai Akselerator Dakwah</h3>
      <p>Jika dahulu dakwah terbatas pada dinding-dinding masjid atau pesantren, kini dakwah bisa menembus batas ruang dan waktu melalui baris-baris kode dan konten kreatif. Menguasai pembuatan website, manajemen basis data, hingga pemanfaatan AI adalah bentuk jihad modern untuk menyebarkan risalah Islam yang <em>rahmatan lil 'alamin</em> ke seluruh penjuru dunia.</p>
      
      <h3>Landasan Dalil (Al-Qur'an & Hadist)</h3>
      <p>Sebagai penguat, berikut adalah dalil-dalil yang mendasari pentingnya menuntut ilmu pengetahuan (termasuk teknologi) dan agama secara beriringan:</p>
      
      <p><strong>Surah Al-Mujadilah Ayat 11:</strong><br>
      <em>"...Allah akan mengangkat (derajat) orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu beberapa derajat..."</em></p>
      
      <p><strong>Catatan:</strong> Ayat ini tidak membatasi "ilmu" hanya pada urusan ritual, tetapi mencakup segala pengetahuan yang membawa manfaat bagi kemanusiaan.</p>
      
      <p><strong>Hadist Riwayat Muslim:</strong><br>
      <em>"Apabila manusia itu meninggal dunia maka terputuslah amalnya kecuali tiga perkara: sedekah jariyah, ilmu yang bermanfaat, dan anak saleh yang mendoakan orang tuanya."</em></p>
      
      <p><strong>Konteks:</strong> Di era digital, membuat sistem atau aplikasi yang membantu orang belajar agama (seperti website pesantren) adalah salah satu bentuk ilmu yang manfaatnya terus mengalir.</p>
      
      <p><strong>Perkataan Ulama (Syekh Muhammad Abduh):</strong><br>
      <em>"Al-Islam mahjubun bil muslimin."</em> (Islam tertutup oleh perilaku orang Islam sendiri).</p>
      
      <p><strong>Pelajaran:</strong> Jika umat Islam tidak menguasai teknologi, maka keindahan Islam akan tertutupi oleh kemajuan bangsa lain. Kita harus unggul secara teknologi agar martabat Islam terjaga.</p>
      
      <h3>Kesimpulan</h3>
      <p>Keseimbangan adalah kunci. Ilmu agama menjaga hati agar tetap rendah hati dan takut kepada Allah, sementara teknologi memberikan tangan yang panjang untuk membantu sesama. Santri masa kini haruslah seorang yang <strong>"Berdzikir seperti Sufi, Berpikir seperti Teknokrat."</strong> (Bez).</p>
    `,
    image: '/artikel/Artikel-1.jpeg',
    author: 'Admin PTQ Amsa',
    date: '11 Januari 2026',
    category: 'Pendidikan'
  },
  {
    id: '2',
    title: 'Tips Menyiapkan Mental Anak Sebelum Masuk Pesantren',
    slug: 'tips-menyiapkan-mental-anak-masuk-pesantren',
    excerpt: 'Memutuskan untuk mengirimkan buah hati ke pesantren adalah langkah besar yang penuh dengan campur aduk perasaan—antara bangga, haru, dan mungkin sedikit cemas. Pesantren bukan sekadar tempat belajar, melainkan kawah candradimuka bagi kemandirian dan spiritualitas anak.',
    content: `
      <p>Memutuskan untuk mengirimkan buah hati ke pesantren adalah langkah besar yang penuh dengan campur aduk perasaan—antara bangga, haru, dan mungkin sedikit cemas. Pesantren bukan sekadar tempat belajar, melainkan <strong>kawah candradimuka</strong> bagi kemandirian dan spiritualitas anak.</p>
      
      <p>Agar transisi ini berjalan lancar, berikut adalah langkah-langkah strategis yang bisa Ayah dan Bunda lakukan di rumah:</p>
      
      <h3>1. Bangun Narasi Positif, Bukan Ancaman</h3>
      <p>Jangan pernah menjadikan pesantren sebagai "tempat hukuman" bagi anak yang sulit diatur. Sebaliknya, ceritakanlah pesantren sebagai tempat yang seru untuk menemukan sahabat sejati, belajar ilmu rahasia langit, dan menjadi sosok yang dikagumi.</p>
      
      <p><strong>Tips:</strong> Fokuslah pada kegiatan ekstrakurikuler atau fasilitas yang disukai anak, seperti lapangan olahraga atau lab komputer.</p>
      
      <h3>2. Latih Kemandirian Secara Bertahap</h3>
      <p>Keterkejutan budaya (<em>culture shock</em>) sering terjadi karena masalah teknis sederhana. Mulailah melatih anak untuk:</p>
      <ul>
        <li>Mencuci pakaian dalamnya sendiri</li>
        <li>Membereskan tempat tidur segera setelah bangun</li>
        <li>Mengelola uang saku mingguan</li>
      </ul>
      
      <h3>3. Komunikasi Terbuka dan Jujur</h3>
      <p>Bicarakan tentang apa yang akan mereka hadapi. Jangan berjanji akan menjenguk setiap hari jika aturannya hanya sebulan sekali. Kejujuran membangun kepercayaan (<em>trust</em>) yang akan menjadi pegangan mereka saat merasa rindu di asrama.</p>
      
      <h3>4. Titipkan pada Sang Pemilik Hati</h3>
      <p>Sebagai orang tua, tugas kita hanyalah mengantarkan. Selebihnya, biarkan Allah yang menjaga. Doa orang tua adalah "senjata" paling ampuh yang menembus dinding-dinding pesantren.</p>
      
      <h3>Landasan Dalil (Al-Qur'an & Hadits)</h3>
      <p>Menyiapkan generasi yang kuat mental dan agamanya adalah perintah langsung dari Allah SWT:</p>
      
      <p><strong>Surah An-Nisa Ayat 9:</strong><br>
      <em>"Dan hendaklah takut (kepada Allah) orang-orang yang sekiranya mereka meninggalkan keturunan yang lemah di belakang mereka yang mereka khawatir terhadap (kesejahteraan)nya..."</em></p>
      
      <p><strong>Konteks:</strong> Pesantren adalah ikhtiar kita agar tidak meninggalkan generasi yang "lemah" secara iman dan mental.</p>
      
      <p><strong>Surah Luqman Ayat 13:</strong><br>
      <em>"Dan (ingatlah) ketika Luqman berkata kepada anaknya, di waktu ia memberi pelajaran kepadanya: 'Hai anakku, janganlah kamu mempersekutukan Allah...'"</em></p>
      
      <p><strong>Pelajaran:</strong> Memberikan pendidikan terbaik (seperti di pesantren) adalah bentuk kasih sayang tertinggi orang tua kepada anak, sebagaimana teladan Nabi Luqman.</p>
      
      <p><strong>Hadits Riwayat Tirmidzi:</strong><br>
      <em>"Tiada suatu pemberian yang lebih utama dari orang tua kepada anaknya selain pendidikan adab yang baik."</em></p>
      
      <h3>Kesimpulan</h3>
      <p>Melepas anak ke pesantren memang berat di awal, namun itu adalah investasi jangka panjang. Dengan mental yang siap, anak tidak akan merasa "dibuang", melainkan merasa <strong>"diutus"</strong> untuk menjadi pejuang ilmu.</p>
      
      <p><em>(Bez)</em></p>
    `,
    image: '/artikel/Artikel-2.jpg',
    author: 'Bez',
    date: '21 Januari 2026',
    category: 'Parenting'
  },
  {
    id: '3',
    title: 'Membedah Hikmah Keseharian Santri dari Tahajud hingga Tidur Malam',
    slug: 'hikmah-keseharian-santri-tahajud-hingga-tidur',
    excerpt: 'Banyak orang luar melihat kehidupan pesantren hanya sebagai rangkaian rutinitas yang kaku dan melelahkan. Namun, bagi mereka yang menjalaninya, setiap detak jam di pesantren adalah pahatan karakter dan perjalanan spiritual yang penuh makna.',
    content: `
      <p>Banyak orang luar melihat kehidupan pesantren hanya sebagai rangkaian rutinitas yang kaku dan melelahkan. Namun, bagi mereka yang menjalaninya, setiap detak jam di pesantren adalah <strong>pahatan karakter</strong> dan perjalanan spiritual yang penuh makna. Rutinitas santri bukanlah penjara, melainkan kawah candradimuka untuk mencetak generasi yang tangguh secara mental dan spiritual.</p>
      
      <p>Mari kita bedah hikmah di balik jadwal padat seorang santri:</p>
      
      <h3>1. Sepertiga Malam: Mengetuk Pintu Langit (Tahajud)</h3>
      <p>Saat dunia terlelap, santri sudah bangun. Hikmah terbesar dari bangun di waktu sepertiga malam terakhir adalah melatih kedisiplinan tingkat tinggi dan membangun kedekatan emosional (<em>taqarrub</em>) yang kuat dengan Allah SWT. Ini adalah waktu di mana doa-doa paling mustajab dipanjatkan.</p>
      
      <h3>2. Pajar dan Dhuha: Menjemput Berkah dan Ilmu (Subuh & Belajar)</h3>
      <p>Setelah shalat Subuh berjamaah, energi santri langsung dialihkan untuk <em>tholabul 'ilmi</em> (menuntut ilmu)—baik menghafal Al-Qur'an, mengaji kitab kuning, maupun belajar ilmu umum. Hikmahnya adalah memanfaatkan waktu fajar yang penuh berkah untuk menanamkan pondasi keilmuan.</p>
      
      <p><strong>Dalil (Hadits Riwayat Tirmidzi):</strong><br>
      <em>"Apabila seorang hamba belajar satu bab dari ilmu, maka itu lebih baik baginya daripada dunia dan seisinya."</em></p>
      
      <h3>3. Siang dan Sore: Keseimbangan dan Produktivitas (Istirahat & Eskul)</h3>
      <p>Pesantren modern tidak melupakan kebutuhan jasmani dan bakat. Setelah makan siang dan istirahat sejenak, santri melanjutkan dengan kegiatan ekstrakurikuler—olahraga, seni, organisasi, atau keterampilan praktis. Hikmahnya adalah melatih <em>time management</em> (manajemen waktu) dan keseimbangan antara 'akal dan jasad'.</p>
      
      <h3>4. Malam Hari: Isya dan Muhasabah (Muhasabah & Istirahat)</h3>
      <p>Hari ditutup dengan shalat Isya berjamaah dan makan malam bersama. Waktu sebelum tidur sering digunakan untuk <em>muhasabah</em> (introspeksi diri), merenungkan apa yang dipelajari hari ini, dan berdoa. Hikmahnya adalah mengajarkan santri untuk selalu bersyukur dan mengakhiri hari dengan hati yang bersih.</p>
      
      <p><strong>Dalil (Surah Ali 'Imran Ayat 191):</strong><br>
      <em>"...(yaitu) orang-orang yang mengingat Allah sambil berdiri, duduk, atau dalam keadaan berbaring..."</em></p>
      
      <h3>Kesimpulan</h3>
      <p>Rutinitas dari tahajud hingga tidur malam adalah sebuah <em>curriculum of life</em> (kurikulum kehidupan). Ia membentuk kepribadian yang tangguh, mandiri, peduli sesama, dan selalu terhubung dengan Sang Pencipta.</p>
      
      <p><em>(Bez)</em></p>
    `,
    image: '/artikel/Artikel-3.jpg',
    author: 'Bez',
    date: '30 Januari 2026',
    category: 'Kehidupan Santri'
  },
  {
    id: '4',
    title: 'Membangun Karakter Mandiri Melalui Budaya Antre dan Gotong Royong di Pesantren',
    slug: 'membangun-karakter-mandiri-budaya-antre-gotong-royong',
    excerpt: 'Di pesantren, pendidikan tidak selalu terjadi di dalam kelas dengan buku yang terbuka. Seringkali, pelajaran hidup yang paling berharga justru didapatkan saat santri berdiri di barisan antrean kamar mandi atau saat memegang sapu lidi di halaman asrama.',
    content: `
      <p>Di pesantren, pendidikan tidak selalu terjadi di dalam kelas dengan buku yang terbuka. Seringkali, pelajaran hidup yang paling berharga justru didapatkan saat santri berdiri di barisan antrean kamar mandi atau saat memegang sapu lidi di halaman asrama. Inilah yang kita sebut sebagai <strong>kurikulum tersembunyi</strong> (<em>hidden curriculum</em>): <strong>Kemandirian dan Kesalehan Sosial</strong>.</p>
      
      <p>Bagaimana dua kebiasaan sederhana ini membentuk mentalitas santri?</p>
      
      <h3>1. Budaya Antre: Melatih Kesabaran dan Menghormati Hak Orang Lain</h3>
      <p>Mengantre adalah latihan paling dasar dalam menghargai keadilan. Di pesantren, tidak ada istilah "jalur orang dalam". Semua sama, dari anak pejabat hingga anak petani, semuanya harus menunggu giliran.</p>
      
      <p><strong>Hikmahnya:</strong> Santri belajar untuk mengendalikan ego, bersabar menghadapi situasi yang tidak nyaman, dan yang terpenting, memahami bahwa setiap orang memiliki hak yang sama yang harus dihormati.</p>
      
      <h3>2. Gotong Royong (Roan): Belajar Bahwa Beban Berat Menjadi Ringan Jika Dipikul Bersama</h3>
      <p>Budaya <em>Roan</em> atau kerja bakti membersihkan pesantren adalah pemandangan rutin. Di sini, santri belajar bahwa kebersihan lingkungan adalah tanggung jawab bersama, bukan hanya tugas petugas kebersihan.</p>
      
      <p><strong>Hikmahnya:</strong> Ini menghilangkan sifat individualisme. Santri belajar untuk peka terhadap lingkungan sekitar dan memahami bahwa kemandirian bukan berarti hidup sendiri, melainkan mampu berkontribusi bagi kelompoknya.</p>
      
      <h3>Landasan Dalil (Al-Qur'an & Hadits)</h3>
      <p>Prinsip tolong-menolong dan menjaga ketertiban umum adalah bagian integral dari iman:</p>
      
      <p><strong>Surah Al-Ma'idah Ayat 2:</strong><br>
      <em>"...Dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa, dan jangan tolong-menolong dalam berbuat dosa dan permusuhan..."</em></p>
      
      <p><strong>Konteks:</strong> Gotong royong di pesantren adalah wujud nyata dari perintah Allah untuk saling membantu dalam kebaikan lingkungan dan kenyamanan ibadah.</p>
      
      <p><strong>Hadits Riwayat Muslim:</strong><br>
      <em>"Iman itu ada tujuh puluh sekian cabang... yang paling rendah adalah menyingkirkan gangguan dari jalanan."</em></p>
      
      <p><strong>Pelajaran:</strong> Membersihkan pesantren (Roan) bukan sekadar menyapu, tapi merupakan cabang iman yang nyata.</p>
      
      <p><strong>Prinsip Adab:</strong> Para ulama sering berpesan: <em>"Al-Adabu Fauqal 'Ilmi"</em> (Adab itu di atas ilmu). Budaya antre adalah salah satu bentuk adab tertinggi dalam berinteraksi dengan sesama manusia.</p>
      
      <h3>Kesimpulan</h3>
      <p>Budaya antre dan gotong royong adalah <strong>laboratorium mental</strong>. Santri yang terbiasa antre akan tumbuh menjadi pemimpin yang adil, dan santri yang terbiasa gotong royong akan menjadi pribadi yang solutif di masyarakat.</p>
      
      <p><em>(Bez)</em></p>
    `,
    image: '/artikel/Artikel-4.jpg',
    author: 'Bez',
    date: '10 Februari 2026',
    category: 'Kehidupan Santri'
  },
  {
    id: '5',
    title: 'Menuntut Ilmu di Pesantren: Investasi Dunia dan Akhirat bagi Buah Hati',
    slug: 'menuntut-ilmu-pesantren-investasi-dunia-akhirat',
    excerpt: 'Setiap orang tua pasti menginginkan yang terbaik bagi masa depan anaknya. Kita bekerja keras siang dan malam demi memastikan mereka mendapatkan pendidikan yang layak. Namun, pernahkah kita merenungkan: Apakah investasi pendidikan yang kita berikan sudah mencakup masa depan mereka di dunia sekaligus di akhirat?',
    content: `
      <p>Setiap orang tua pasti menginginkan yang terbaik bagi masa depan anaknya. Kita bekerja keras siang dan malam demi memastikan mereka mendapatkan pendidikan yang layak. Namun, pernahkah kita merenungkan: <strong>Apakah investasi pendidikan yang kita berikan sudah mencakup masa depan mereka di dunia sekaligus di akhirat?</strong></p>
      
      <p>Pendidikan di pesantren menawarkan sesuatu yang tidak bisa diberikan oleh institusi pendidikan biasa—sebuah <strong>keseimbangan yang paripurna</strong>.</p>
      
      <h3>1. Investasi Dunia: Karakter Tangguh dan Jaringan Luas</h3>
      <p>Di era globalisasi, kecerdasan intelektual saja tidak cukup. Dunia kerja dan usaha masa kini mencari individu dengan integritas, kejujuran, dan ketahanan mental (<em>resilience</em>).</p>
      
      <p><strong>Kemandirian:</strong> Di pesantren, anak dilatih mengelola diri sendiri sejak dini.</p>
      
      <p><strong>Adab:</strong> Santri diajarkan bahwa etika lebih tinggi daripada ilmu. Orang yang beradab akan selalu mendapatkan tempat terhormat di masyarakat dan dunia profesional.</p>
      
      <h3>2. Investasi Akhirat: Tabungan Pahala yang Terus Mengalir</h3>
      <p>Inilah "dividen" atau keuntungan yang tidak akan pernah habis. Memiliki anak yang saleh dan mengerti agama adalah aset terbesar orang tua saat sudah tiada nanti. Setiap ayat yang mereka hafal, setiap shalat yang mereka tegakkan, dan setiap doa yang mereka panjatkan untuk orang tuanya adalah <strong>cahaya di alam barzakh</strong>.</p>
      
      <h3>Landasan Dalil (Al-Qur'an & Hadits)</h3>
      <p>Pentingnya menjaga dan mendidik anak agar selamat di dua alam dijelaskan dengan sangat indah dalam sumber hukum Islam:</p>
      
      <p><strong>Surah At-Tahrim Ayat 6:</strong><br>
      <em>"Wahai orang-orang yang beriman! Peliharalah dirimu dan keluargamu dari api neraka..."</em></p>
      
      <p><strong>Konteks:</strong> Memberikan pendidikan agama yang baik di pesantren adalah wujud nyata dari ketaatan orang tua dalam menjaga anak-anak mereka dari bahaya dunia dan akhirat.</p>
      
      <p><strong>Hadits Riwayat Muslim (Hadits Populer tentang 3 Perkara):</strong><br>
      <em>"Jika seseorang meninggal dunia, maka terputuslah amalannya kecuali tiga perkara: sedekah jariyah, ilmu yang bermanfaat, dan anak shalih yang mendoakan orang tuanya."</em></p>
      
      <p><strong>Pelajaran:</strong> Pesantren adalah tempat terbaik untuk membentuk "anak shalih" yang akan menjadi aset abadi bagi orang tuanya.</p>
      
      <p><strong>Surah At-Tur Ayat 21:</strong><br>
      <em>"Dan orang-orang yang beriman, dan yang anak cucu mereka mengikuti mereka dalam keimanan, Kami hubungkan anak cucu mereka dengan mereka..."</em></p>
      
      <p><strong>Hikmah:</strong> Investasi iman di pesantren memungkinkan keluarga untuk kembali berkumpul bersama di surga kelak.</p>
      
      <h3>Kesimpulan</h3>
      <p>Investasi pada harta bisa habis, investasi pada emas bisa hilang, namun <strong>investasi pada pendidikan agama anak di pesantren adalah satu-satunya modal yang keuntungannya akan kita nikmati hingga di hadapan Allah SWT nanti</strong>.</p>
      
      <p><em>(Bez)</em></p>
    `,
    image: '/artikel/Artikel-5.jpg',
    author: 'Bez',
    date: '20 Februari 2026',
    category: 'Parenting'
  },
];
