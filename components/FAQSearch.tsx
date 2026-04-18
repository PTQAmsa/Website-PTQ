'use client';

import { useState, useMemo } from 'react';
import faqData from '../data/faqData';
import FAQAccordion from './FAQAccordion';

const DAFTAR_LINK = "https://docs.google.com/forms/d/e/1FAIpQLScJMfCAipPLibI5bb8VKpoikXMDcR16VjzouwRDzMWkM2CqNQ/viewform";

function renderAnswer(q: string, a: string): React.ReactNode {
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
