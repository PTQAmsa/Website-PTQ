'use client';

import { useState, useMemo } from 'react';
import faqData from '../data/faqData';
import FAQAccordion from './FAQAccordion';

const DAFTAR_LINK = "https://forms.gle/L7GqaZdfDdZ2cxBK6";

const LOKASI_ANSWER = (
  <>
    Kami berlokasi di{' '}
    <a href="https://maps.app.goo.gl/wRXtbTF7QazFSKWH6" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 font-medium">
      Jl. Cikopo Selatan (Pasirmuncang), Gg. Yulias, Desa Gadog, Kec. Megamendung, Kab. Bogor, Jawa Barat.
    </a>{' '}
    Akses mudah dari Jakarta via keluar tol Puncak Gadog (Vimala Hills) belok kanan ke arah alternatif Taman Safari Cisarua.
  </>
);

const MI_ANSWER = (
  <>
    Tes Multiple Intelligence (MI) adalah tes untuk mengidentifikasi kekuatan dan potensi unik setiap santri di berbagai bidang seperti:
    <ol className="list-decimal list-inside mt-2 mb-2 space-y-1">
      <li>Linguistik</li>
      <li>Logika-Matematika</li>
      <li>Visual-Spasial</li>
      <li>Musik</li>
      <li>Kinestetik</li>
      <li>Interpersonal</li>
      <li>Intrapersonal</li>
      <li>Naturalis</li>
    </ol>
    Kami menggunakan tes ini untuk memahami gaya belajar dan bakat setiap santri sehingga kami bisa memberikan bimbingan yang tepat sasaran dan membantu santri mengembangkan potensi mereka secara optimal. Bukan hanya fokus pada akademik umum saja.
  </>
);

const SYARAT_PENDAFTARAN_ANSWER = (
  <>
    Syarat Pendaftaran:
    <ul className="list-none mt-2 mb-2 space-y-1">
      <li>✓ Muslim/muslimah, berusia 12 - 15 tahun</li>
      <li>✓ Berijazah SD/MI atau SMP/MTs</li>
      <li>✓ Mampu membaca Al-Qur&apos;an dengan baik dan benar</li>
      <li>✓ Latar belakang pribadi, keluarga dan sosial yang baik</li>
      <li>✓ Memiliki motivasi dan semangat untuk menuntut ilmu, menghafal Al-Qur&apos;an, dan belajar</li>
    </ul>
  </>
);

const DOKUMEN_DIPERLUKAN_ANSWER = (
  <>
    Dokumen yang Diperlukan:
    <ul className="list-none mt-2 mb-2 space-y-1">
      <li>✓ Fotocopy Kartu Keluarga (KK)</li>
      <li>✓ Fotocopy Akta Kelahiran</li>
      <li>✓ Fotocopy Ijazah/SKHUN terakhir</li>
      <li>✓ Pas foto 3x4 (3 lembar)</li>
      <li>✓ Surat keterangan sehat dari dokter (opsional)</li>
    </ul>
  </>
);

const BIAYA_PENDAFTARAN_ANSWER = (
  <>
    <p className="font-semibold text-blue-900 mb-2">Pembiayaan Awal:</p>
    <table className="w-full text-sm mb-4">
      <tbody>
        <tr className="border-b border-gray-100">
          <td className="py-1.5">1. Biaya Pendaftaran</td>
          <td className="py-1.5 text-right font-semibold">Rp 200.000,-</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-1.5">2. Lemari, kasur, bantal, selimut dan sprei</td>
          <td className="py-1.5 text-right font-semibold">Rp 1.000.000,-</td>
        </tr>
        <tr>
          <td className="py-1.5">3. Wakaf Pembangunan <span className="text-gray-500 font-normal">(bisa dicicil 2x)</span></td>
          <td className="py-1.5 text-right font-semibold">Rp 5.000.000,-</td>
        </tr>
      </tbody>
    </table>
    <p className="font-semibold text-blue-900 mb-2">Iuran Bulanan:</p>
    <table className="w-full text-sm">
      <tbody>
        <tr className="border-b border-gray-100">
          <td className="py-1.5">1. SPP</td>
          <td className="py-1.5 text-right">Rp 600.000,-</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-1.5">2. Makan</td>
          <td className="py-1.5 text-right">Rp 550.000,-</td>
        </tr>
        <tr className="border-b border-gray-200">
          <td className="py-1.5">3. Laundry</td>
          <td className="py-1.5 text-right">Rp 200.000,-</td>
        </tr>
        <tr className="bg-blue-50 rounded">
          <td className="py-2 font-bold text-blue-900">Total Iuran Bulanan</td>
          <td className="py-2 text-right font-bold text-blue-900">Rp 1.350.000,-</td>
        </tr>
      </tbody>
    </table>
  </>
);

function renderAnswer(q: string, a: string): React.ReactNode {
  if (a === "MI_TEST") return MI_ANSWER;
  if (a === "LOKASI_AKSES") return LOKASI_ANSWER;
  if (a === "SYARAT_PENDAFTARAN") return SYARAT_PENDAFTARAN_ANSWER;
  if (a === "DOKUMEN_DIPERLUKAN") return DOKUMEN_DIPERLUKAN_ANSWER;
  if (a === "BIAYA_PENDAFTARAN") return BIAYA_PENDAFTARAN_ANSWER;
  if (q === "Bagaimana cara mendaftar?") {
    return (
      <>
        Daftar bisa melalui online (bisa{' '}
        <a href={DAFTAR_LINK} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 font-medium">
          klik disini
        </a>
        ) ataupun datang langsung ke pesantren (offline). Bisa hubungi admin via WhatsApp untuk jadwalkan waktu survei lokasi.
      </>
    );
  }
  return a;
}

export default function FAQSearch() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return faqData;
    const lower = query.toLowerCase();
    return faqData
      .map((cat) => ({
        ...cat,
        questions: cat.questions.filter(
          (item) =>
            item.q.toLowerCase().includes(lower) ||
            item.a.toLowerCase().includes(lower)
        ),
      }))
      .filter((cat) => cat.questions.length > 0);
  }, [query]);

  return (
    <>
      {/* Search Bar — di background putih */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-10 pb-2">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari pertanyaan..."
            className="w-full pl-12 pr-10 py-4 rounded-2xl border-3 border-blue-500 bg-white text-gray-800 placeholder-gray-500 text-base shadow-sm focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] focus:scale-[1.02] transition-all duration-300"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              aria-label="Hapus pencarian"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg">Tidak ada pertanyaan yang cocok dengan <span className="font-semibold text-gray-500">&quot;{query}&quot;</span></p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 gap-10">
            {filtered.map((cat) => (
              <div key={cat.category} className="break-inside-avoid mb-10">
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-yellow-400 rounded-full inline-block flex-shrink-0" />
                  {cat.category}
                </h2>
                <div className="flex flex-col gap-3">
                  {cat.questions.map((item) => (
                    <FAQAccordion key={item.q} question={item.q} answer={renderAnswer(item.q, item.a)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
