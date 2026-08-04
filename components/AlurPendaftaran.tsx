'use client';

import { useState } from 'react';

type Mode = 'online' | 'offline';

const stepsOnline = [
  {
    number: 1,
    title: 'Daftar Online',
    description: (
      <>
        Isi formulir pendaftaran online di{' '}
        <a
          href="https://forms.gle/L7GqaZdfDdZ2cxBK6"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800 font-medium"
        >
          Google Form PTQ Amsa
        </a>
      </>
    ),
  },
  {
    number: 2,
    title: 'Biaya Pendaftaran',
    description: 'Membayar formulir pendaftaran sejumlah Rp 200.000 sebagai bukti pendaftaran',
  },
  {
    number: 3,
    title: 'Verifikasi',
    description: 'Tim kami akan memverifikasi data Anda',
  },
  {
    number: 4,
    title: 'Tes Masuk (Online/Offline)',
    description:
      'Calon santri akan dites: membaca Al-Qur\'an, tes akademik dasar, tes psikologi (Multiple Intelligence), dan sesi wawancara',
  },
  {
    number: 5,
    title: 'Santri Diterima',
    description: 'Selamat! Ananda telah diterima untuk mondok di PTQ Amsa',
  },
];

const stepsOffline = [
  {
    number: 1,
    title: 'Datang ke Pesantren',
    description: (
      <>
        Kami berlokasi di{' '}
        <a
          href="https://maps.app.goo.gl/1H7EXzVznGXvpLG7A"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800 font-medium"
        >
          sini
        </a>
      </>
    ),
  },
  {
    number: 2,
    title: 'Biaya Pendaftaran',
    description: 'Membayar formulir pendaftaran sejumlah Rp 200.000 sebagai bukti pendaftaran',
  },
  {
    number: 3,
    title: 'Verifikasi',
    description: 'Tim kami akan memverifikasi data Anda',
  },
  {
    number: 4,
    title: 'Tes Masuk (Online/Offline)',
    description:
      'Calon santri akan dites: membaca Al-Qur\'an, tes akademik dasar, tes psikologi (Multiple Intelligence), dan sesi wawancara',
  },
  {
    number: 5,
    title: 'Santri Diterima',
    description: 'Selamat! Ananda telah diterima untuk mondok di PTQ Amsa',
  },
];

export default function AlurPendaftaran({ hideCTA = false }: { hideCTA?: boolean }) {
  const [mode, setMode] = useState<Mode>('online');
  const steps = mode === 'online' ? stepsOnline : stepsOffline;

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">Alur Pendaftaran</h2>
        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full bg-white border border-blue-200 shadow-sm p-1">
            <button
              onClick={() => setMode('online')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                mode === 'online'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-blue-700 hover:bg-blue-50'
              }`}
            >
              🌐 Online
            </button>
            <button
              onClick={() => setMode('offline')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                mode === 'offline'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-blue-700 hover:bg-blue-50'
              }`}
            >
              📍 Offline
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop: horizontal connector */}
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-blue-200 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center">
                <div className="bg-yellow-400 text-blue-900 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl font-bold shadow-md">
                  {step.number}
                </div>
                <h3 className="font-semibold text-blue-900 mb-2 text-sm leading-tight">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {!hideCTA && (
        <div className="mt-12 text-center">
          <a
            href="https://forms.gle/L7GqaZdfDdZ2cxBK6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-10 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-md"
          >
            Daftar Sekarang →
          </a>
        </div>
        )}
      </div>
    </section>
  );
}
