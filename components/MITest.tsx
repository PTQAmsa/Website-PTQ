'use client';

import { useState } from 'react';
import Image from 'next/image';
import miQuestions from '../data/miQuestions';
import MIResultModal from './MIResultModal';

const SCALE = [
  { value: 1, label: "Tidak Sesuai" },
  { value: 2, label: "Kurang Sesuai" },
  { value: 3, label: "Sesuai" },
  { value: 4, label: "Sangat Sesuai" },
];

export default function MITest() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const answered = Object.keys(answers).length;
  const total = miQuestions.length;
  const progress = Math.round((answered / total) * 100);

  const handleAnswer = (id: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setError('');
  };

  const handleSubmit = () => {
    if (answered < total) {
      setError('Harap jawab semua pertanyaan sebelum melihat hasil.');
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      {/* Banner */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <Image
          src="/banner-tes-MI.webp"
          alt="Tes Bakat Multiple Intelligence PTQ Amsa001"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-blue-900/50 flex flex-col items-center justify-center text-white text-center px-4">
          <span className="bg-yellow-400 text-blue-900 text-m font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Gratis · Hanya 2 Menit
          </span>
          <br />
          <h1 className="text-3xl md:text-6xl font-bold mb-3 drop-shadow-md">
            Mau tahu potensi bakat<br />putra-putri bapak/ibu?
          </h1>
          {/*<p className="bg-blue-800 text-white text-xl max-w-xl px-4 py-2 rounded-full inline-block">
           Coba mini tes Multiple Intelligence disini gratis!
          </p>*/}
        </div>
      </div>

      {/* Progress Bar - sticky */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm shadow-sm px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{answered} dari {total} pertanyaan dijawab</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Test Card */}
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Deskripsi */}
        <p className="text-gray-600 text-sm leading-relaxed mb-8 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
          Ini adalah contoh tes Potensi Minat dan Bakat yang bisa kamu coba. Sebelum bergabung, setiap calon santri akan mengisi tes Potensi Minat dan Bakat versi lengkap. Hasil tes ini kami gunakan untuk memahami gaya belajar dan bakat unik setiap santri, sehingga kami dapat memberikan pendampingan yang tepat dan personal selama mereka nyantri di pesantren. Tes akan dilakukan berkala setahun sekali.
        </p>

        <div className="space-y-6">
          {miQuestions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <p className="text-blue-900 font-semibold mb-1 text-xs uppercase tracking-wide text-yellow-500">
                Pertanyaan {idx + 1} · {q.type}
              </p>
              <p className="text-gray-800 text-base mb-5 leading-relaxed">{q.text}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SCALE.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => handleAnswer(q.id, s.value)}
                    className={`py-3 px-2 rounded-xl text-sm font-semibold border-2 transition-all duration-150 ${
                      answers[q.id] === s.value
                        ? 'bg-blue-700 border-blue-700 text-white shadow-md scale-105'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-700'
                    }`}
                  >
                    <span className="block text-lg mb-1">{s.value}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="mt-6 text-center text-red-500 font-medium">{error}</p>
        )}

        {/* Deskripsi ilmiah */}
        <p className="italic mt-8 text-sm text-gray-400 leading-relaxed text-center max-w-xl mx-auto">
          Tes ini disusun berbasis teori Multiple Intelligences (1986) dari Howard Gardner, psikolog perkembangan lulusan Harvard. Landasan ilmiah ini kami gunakan untuk membantu Anda memahami keunikan bakat Ananda secara lebih objektif, akurat, dan terukur.
        </p>

        {/* Submit */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            className="bg-yellow-400 text-blue-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Lihat Hasil Tes →
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <MIResultModal
          answers={answers}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
