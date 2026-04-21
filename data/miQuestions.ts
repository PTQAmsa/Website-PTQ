export interface MIQuestion {
  id: number;
  text: string;
  type: string;
}

const miQuestions: MIQuestion[] = [
  { id: 1, type: "Linguistik", text: "Aku senang banget baca buku, nulis cerita/puisi, atau hobi ngobrol dan berdebat seru sama teman." },
  { id: 2, type: "Logika", text: "Aku suka ngulik teka-teki, memecahkan masalah yang bikin mikir keras, atau senang hal-hal yang teratur." },
  { id: 3, type: "Visual", text: "Aku punya imajinasi kuat, suka menggambar/mendesain, atau lebih gampang ngerti pelajaran kalau pakai gambar/bagan." },
  { id: 4, type: "Kinestetik", text: "Aku nggak betah duduk diam. Aku jauh lebih cepat paham kalau belajar sambil praktik langsung atau bergerak aktif." },
  { id: 5, type: "Musikal", text: "Aku sensitif sama nada dan irama. Aku gampang banget hafal lirik nasyid, lagu, atau lantunan suara." },
  { id: 6, type: "Interpersonal", text: "Aku gampang nyari teman baru, suka kerja kelompok, dan senang bantu teman yang kesusahan." },
  { id: 7, type: "Intrapersonal", text: "Aku tahu banget apa yang aku mau. Aku sering merenung atau memikirkan rencana masa depanku sendiri." },
  { id: 8, type: "Naturalis", text: "Aku paling betah kalau lagi di alam terbuka, suka ngerawat tanaman, atau penasaran sama dunia hewan." },
  { id: 9, type: "Eksistensial", text: "Aku sering mikirin hal mendalam, kayak tujuan hidup, kebesaran Allah, atau gimana dunia ini tercipta." },
  { id: 10, type: "Kepemimpinan", text: "Aku punya inisiatif tinggi, sering dipercaya buat pimpin kelompok, dan berani ambil keputusan." },
];

export default miQuestions;
