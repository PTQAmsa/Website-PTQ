'use client';

import { useState } from 'react';
import miQuestions from '../data/miQuestions';

const APPS_SCRIPT_URL = "/api/submit-mi";
const WA_NUMBER = "6285692253516";

const MI_DESCRIPTIONS: Record<string, string> = {
  Linguistik: "Kamu berbakat dalam bahasa, komunikasi, dan ekspresi verbal. Cocok untuk bidang sastra, jurnalistik, atau dakwah.",
  Logika: "Kamu unggul dalam berpikir analitis dan sistematis. Cocok untuk sains, matematika, atau pemrograman.",
  Visual: "Kamu memiliki imajinasi spasial yang kuat. Cocok untuk desain, arsitektur, atau seni rupa.",
  Kinestetik: "Kamu belajar terbaik melalui gerakan dan praktik langsung. Cocok untuk olahraga, kerajinan, atau seni pertunjukan.",
  Musikal: "Kamu peka terhadap nada dan ritme. Cocok untuk seni musik, tilawah Al-Qur'an, atau hadrah.",
  Interpersonal: "Kamu mudah bergaul dan memahami orang lain. Cocok untuk kepemimpinan, konseling, atau pendidikan.",
  Intrapersonal: "Kamu memiliki kesadaran diri yang tinggi. Cocok untuk penelitian, filsafat, atau pengembangan diri.",
  Naturalis: "Kamu peka terhadap alam dan lingkungan. Cocok untuk biologi, pertanian, atau lingkungan hidup.",
  Eksistensial: "Kamu suka merenungkan makna kehidupan. Cocok untuk kajian agama, filsafat, atau psikologi.",
  Kepemimpinan: "Kamu memiliki jiwa pemimpin yang kuat. Cocok untuk organisasi, manajemen, atau kewirausahaan.",
};

interface Props {
  answers: Record<number, number>;
  onClose: () => void;
}

export default function MIResultModal({ answers, onClose }: Props) {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Hitung skor
  const scores = miQuestions.map((q) => ({
    type: q.type,
    score: answers[q.id] || 0,
  })).sort((a, b) => b.score - a.score);

  const top3 = scores.slice(0, 3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !whatsapp.trim() || !email.trim()) {
      setFormError('Semua kolom wajib diisi.');
      return;
    }
    setLoading(true);
    setFormError('');

    const skorDetail = scores.map((s) => `${s.type}: ${s.score}`).join(', ');
    const payload = {
      nama,
      whatsapp,
      email,
      top1: top3[0]?.type,
      top2: top3[1]?.type,
      top3: top3[2]?.type,
      skorDetail,
    };

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (_) {
      // no-cors tidak bisa baca response, anggap sukses
    }

    setLoading(false);
    setStep('result');
  };

  const waMessage = encodeURIComponent(
    `Assalamu'alaikum, saya ${nama} ingin konsultasi hasil Tes Multiple Intelligence saya.\n\nTop 3 Kecerdasan:\n1. ${top3[0]?.type}\n2. ${top3[1]?.type}\n3. ${top3[2]?.type}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-auto">

        {step === 'form' ? (
          <>
            {/* Form Header */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-t-3xl px-8 py-7 text-white text-center">
              <div className="text-3xl mb-2">✨</div>
              <h2 className="text-2xl font-bold mb-1">Hampir Selesai!</h2>
              <p className="text-blue-200 text-sm">Isi data berikut untuk melihat hasil tesmu</p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Isi namamu disini"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">No. WhatsApp</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              {formError && <p className="text-red-500 text-sm">{formError}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 text-blue-900 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition disabled:opacity-60 mt-2"
              >
                {loading ? 'Memproses...' : 'Lihat Hasil Saya →'}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Data kamu aman dan tidak akan disebarkan kepada pihak manapun.
              </p>
            </form>
          </>
        ) : (
          <>
            {/* Result Header */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-t-3xl px-8 py-7 text-white text-center">
              <div className="text-3xl mb-2">✨</div>
              <h2 className="text-2xl font-bold mb-1">Hasil Tes {nama}</h2>
              <p className="text-blue-200 text-sm">Top 3 Kecerdasan Dominanmu</p>
            </div>

            <div className="px-8 py-7">
              {/* Top 3 */}
              <div className="space-y-4 mb-6">
                {top3.map((item, idx) => {
                  const medals = ['🥇', '🥈', '🥉'];
                  const colors = [
                    'border-yellow-400 bg-yellow-50',
                    'border-gray-300 bg-gray-50',
                    'border-orange-300 bg-orange-50',
                  ];
                  return (
                    <div key={item.type} className={`border-2 rounded-2xl p-4 ${colors[idx]}`}>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-2xl">{medals[idx]}</span>
                        <span className="font-bold text-blue-900 text-lg">{item.type}</span>
                        <span className="ml-auto text-sm font-semibold text-gray-500">Skor: {item.score}/4</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed pl-9">
                        {MI_DESCRIPTIONS[item.type]}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* CTA WhatsApp */}
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-400 text-white py-4 rounded-xl font-bold text-base transition hover:scale-105 shadow-md mb-4"
              >
                <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Konsultasikan Hasil dengan Ustadz
              </a>

              <button
                onClick={onClose}
                className="w-full border-2 border-gray-200 text-gray-500 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-sm"
              >
                Tutup
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
