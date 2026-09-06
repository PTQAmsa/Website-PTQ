export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  category: string;
  questions: FaqItem[];
}

const faqData: FaqCategory[] = [
  {
    category: "Kurikulum & Pembelajaran",
    questions: [
      {
        q: "Kurikulum apa yang digunakan?",
        a: "Kami menggunakan kombinasi Kurikulum Mu'adalah seperti Gontor, (bahasa Arab-Inggris dan diakui Kemenag) dengan sistem pembelajaran berbasis project dan juga pelajaran umum (Matematika, Biologi, Fisika, Geografi, dll).",
      },
      {
        q: "Berapa target hafalan santri per tahun?",
        a: "Target hafalan adalah 1 juz per tahun. Kami fokus pada kualitas hafalan dan pemahaman makna, bukan kuantitas semata.",
      },
      {
        q: "Bagaimana sistem setoran dan muraja'ah?",
        a: "Santri melakukan setoran harian (tasmi') kepada ustadz/ah pembimbing dan ada jadwal muraja'ah terstruktur kepada musyrif/ah untuk memastikan hafalan tetap terjaga dan tidak lepas.",
      },
      {
        q: "Apakah ada pembelajaran teknologi/digital?",
        a: "Ya. Di waktu-waktu tertentu santri menggunakan komputer atau tablet untuk riset pembelajaran umum, agama, dan materi pembelajaran lainnya dibawah pengawasan langsung para guru.",
      },
      {
        q: "Apakah santri dibekali skill tambahan di luar agama?",
        a: "Ya. PTQ Amsa memberikan bekal skill tambahan seperti bahasa Arab dan Inggris, keterampilan digital/teknologi, kaligrafi, public speaking, beladiri, dan berbagai ekstrakurikuler lainnya untuk mempersiapkan santri menjadi generasi yang kompetitif dan berkarakter.",
      },
    ],
  },
  {
    category: "Ijazah & Lanjutan Pendidikan",
    questions: [
      {
        q: "Apakah ijazah PTQ Amsa diakui negara?",
        a: "Ya. PTQ Amsa menggunakan Kurikulum Mu'adalah yang setara dengan SMP/SMA dan diakui oleh Kementerian Agama. Lulusan kami bisa melanjutkan ke perguruan tinggi manapun di dalam dan luar negeri. Umum maupun keagamaan.",
      },
    ],
  },
  {
    category: "Fasilitas",
    questions: [
      {
        q: "Fasilitas apa saja yang tersedia?",
        a: "Asrama putra & putri, makan 3x sehari, laundry, lab komputer, perpustakaan digital, kolam renang, lapangan futsal/voli/basket, lapangan badminton, gym, perpustakaan, air ph+ 24 jam, serta gazebo khusus putra & putri untuk penjengukan.",
      },
      {
        q: "Bagaimana kondisi asrama santri?",
        a: "Asrama nyaman dengan kapasitas ideal per kamar, lemari pribadi 1 orang 1, kasur, bantal & selimut, kamar mandi bersih terawat, jemuran, dan pengawasan 24 jam oleh musyrif/musyrifah.",
      },
    ],
  },
  {
    category: "Peraturan, Pengawasan & Keamanan",
    questions: [
      {
        q: "Apakah santri boleh bawa HP/gadget?",
        a: "Tidak boleh. Aturan tegas untuk santri PTQ Amsa yang menerapkan no-electronics policy agar santri fokus pada pembelajaran dan menghindari distraksi digital & dunia maya.",
      },
      {
        q: "Bagaimana pengawasan santri 24 jam?",
        a: "Santri diawasi 24 jam oleh asatidz dan asatidzah yang juga tinggal bermukim di dalam pesantren.",
      },
      {
        q: "Kapan santri boleh dijenguk?",
        a: "Santri boleh dijenguk minimal 2 minggu sekali.",
      },
    ],
  },
  {
    category: "Ekstrakurikuler & Prestasi",
    questions: [
      {
        q: "Ekstrakurikuler apa saja yang ada?",
        a: "Pramuka, hadrah, beladiri, futsal, basket, voli, badminton, panahan, khitobah (public speaking) dan science study club.",
      },
      {
        q: "Apa saja prestasi santri PTQ Amsa?",
        a: "Santri kami pernah mewakili Indonesia di ajang pramuka World Moslem Student Jamboree (WMSJ), juara podium beladiri tingkat nasional, dan berbagai prestasi akademik lainnya.",
      },
    ],
  },
  {
    category: "Biaya & Beasiswa",
    questions: [
      {
        q: "Berapa biaya masuk dan SPP bulanan?",
        a: "BIAYA_PENDAFTARAN",
      },
      {
        q: "Apakah ada program beasiswa?",
        a: "Ya. PTQ Amsa memiliki program khusus untuk anak yatim/dhuafa (potongan SPP 50% + bebas wakaf) dan juga program beasiswa tahfidz. Silakan konsultasi dengan admin untuk detail persyaratan.",
      },
    ],
  },
  {
    category: "Pendaftaran",
    questions: [
      {
        q: "Kapan jadwal pendaftaran dibuka?",
        a: "PTQ Amsa membagi pendaftaran menjadi 3 gelombang per tahun: Gelombang 1 Desember–Februari, Gelombang 2 Maret–April, dan Gelombang 3 Mei–Juni.",
      },
      {
        q: "Bagaimana cara mendaftar?",
        a: "Daftar bisa melalui online (bisa klik disini) ataupun datang langsung ke pesantren (offline). Bisa hubungi admin via WhatsApp untuk jadwalkan waktu survei lokasi.",
      },
      {
        q: "Apa saja tes masuk pesantren PTQ Amsa?",
        a: "Sebelum masuk santri akan dites bacaan Al-Qur'an, tes fiqih dasar (wudhu, sholat dll), pengetahuan dasar agama Islam, tes akademik dan tes Multiple Intelligence (MI).",
      },
      {
        q: "Apakah wajib survei lokasi sebelum mendaftar?",
        a: "Tidak wajib, tapi sangat direkomendasikan agar walisantri dan calon santri bisa melihat langsung kondisi pesantren dan memastikan kesesuaian dengan harapan keluarga.",
      },
    ],
  },
  {
    category: "Syarat Pendaftaran",
    questions: [
      {
        q: "Apa saja syarat pendaftaran?",
        a: "SYARAT_PENDAFTARAN",
      },
    ],
  },
  {
    category: "Dokumen yang Diperlukan",
    questions: [
      {
        q: "Dokumen apa saja yang perlu disiapkan?",
        a: "DOKUMEN_DIPERLUKAN",
      },
    ],
  },
  {
    category: "Lokasi & Akses",
    questions: [
      {
        q: "Di mana lokasi PTQ Amsa dan akses jalannya?",
        a: "LOKASI_AKSES",
      },
    ],
  },
  {
    category: "Komunikasi & Kunjungan",
    questions: [
      {
        q: "Bagaimana walisantri berkomunikasi dengan santri?",
        a: "Walisantri bisa berkomunikasi via telepon pesantren pada jadwal yang sudah ditentukan oleh dewan guru. Atau bisa juga berkomunikasi langsung saat kunjungan di hari penjengukan.",
      },
      {
        q: "Apakah ada grup WhatsApp walisantri?",
        a: "Ya. Kami memiliki grup WhatsApp walisantri untuk mengakomodir komunikasi antara guru, walisantri dan majlis kyai. Untuk update kegiatan dan informasi penting.",
      },
      {
        q: "Apakah bisa berkunjung untuk survey?",
        a: "Ya. Kami membuka kunjungan untuk calon walisantri setiap hari pada jam kerja. Silakan hubungi admin terlebih dahulu untuk konfirmasi jadwal kunjungan.",
      },
    ],
  },
  {
    category: "Persyaratan Umum",
    questions: [
      {
        q: "Apakah ada usia minimal untuk masuk?",
        a: "Usia minimal adalah 12 tahun (setara kelas 6 SD atau baru lulus SD) untuk lulusan SMP.",
      },
      {
        q: "Apakah ada batasan asal daerah?",
        a: "Tidak ada. PTQ Amsa menerima santri dari seluruh Indonesia, bahkan dari luar negeri sekalipun.",
      },
      {
        q: "Bagaimana jika anak homesick?",
        a: "PTQ Amsa memiliki metode adaptasi khusus untuk santri baru dengan pendampingan intensif dari musyrif/musyrifah dan kakak kelas. Walisantri bisa konsultasi dengan musyrif/ah terkait jika ada kendala.",
      },
      {
        q: "Apa itu tes Multiple Intelligence dan mengapa PTQ Amsa menggunakannya?",
        a: "MI_TEST",
      },
    ],
  },
];

export default faqData;
