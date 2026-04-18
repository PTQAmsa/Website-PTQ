import React from 'react';
import FAQAccordion from './FAQAccordion';

const previewFAQs: { q: string; a: React.ReactNode }[] = [
  {
    q: "Berapa biaya masuk dan SPP bulanan?",
    a: "Biaya terdiri dari pendaftaran, peralatan kamar, wakaf pembangunan (bisa dicicil), dan SPP bulanan. Untuk detail lengkap, bisa hubungi admin via WhatsApp.",
  },
  {
    q: "Apakah ijazah PTQ Amsa diakui negara?",
    a: "Ya. PTQ Amsa menggunakan kurikulum Mu'adalah yang setara dengan SMP/SMA dan diakui oleh Kementerian Agama. Lulusan kami bisa melanjutkan ke perguruan tinggi manapun di dalam dan luar negeri.",
  },
  {
    q: "Apakah santri boleh bawa HP/gadget?",
    a: "Tidak boleh. Aturan tegas untuk santri PTQ Amsa yang menerapkan no-electronics policy agar santri fokus pada pembelajaran dan menghindari distraksi digital & dunia maya.",
  },
  {
    q: "Kurikulum apa yang digunakan?",
    a: "Kami menggunakan kombinasi kurikulum Mu'adalah seperti Gontor, (bahasa Arab-Inggris dan diakui Kemenag) dengan sistem pembelajaran berbasis project dan juga pelajaran umum (Matematika, Biologi, Fisika, Geografi, dll).",
  },
  {
    q: "Bagaimana cara mendaftar?",
    a: (
      <>
        Daftar bisa melalui online (bisa{' '}
        <a href="https://docs.google.com/forms/d/e/1FAIpQLScJMfCAipPLibI5bb8VKpoikXMDcR16VjzouwRDzMWkM2CqNQ/viewform" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 font-medium">
          klik disini
        </a>
        ) ataupun datang langsung ke pesantren (offline). Bisa hubungi admin via WhatsApp untuk jadwalkan waktu survei lokasi.
      </>
    ),
  },
  {
    q: "Apakah ada program beasiswa?",
    a: "Ya. PTQ Amsa memiliki program khusus untuk anak yatim/dhuafa (potongan SPP 50% + bebas wakaf) dan juga program beasiswa tahfidz. Silakan konsultasi dengan admin untuk detail persyaratan.",
  },
];

export default function FAQPreview() {
  return (
    <section className="py-5 px-4 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
              Pertanyaan yang Sering Ditanyakan
            </h2>
            <div className="w-50 h-1 bg-yellow-400 rounded-full" />
          </div>
          <a
            href="/faq"
            className="self-start sm:self-auto flex-shrink-0 inline-flex items-center gap-2 border-2 border-blue-700 text-blue-700 px-5 py-2.5 rounded-full font-semibold hover:bg-blue-700 hover:text-white transition-all duration-200 text-sm"
          >
            Lihat pertanyaan lain
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* FAQ List — 2 kolom, 3 item per kolom */}
        <div className="grid md:grid-cols-2 gap-3">
          {previewFAQs.map((item) => (
            <FAQAccordion key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
