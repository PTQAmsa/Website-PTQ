"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SuksesContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const rawName = searchParams.get("name");
  const name = rawName ? decodeURIComponent(rawName) : null;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!id) return;
    navigator.clipboard.writeText(id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!id || !name) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-emerald-100 rounded-full p-4">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-blue-900 mb-3">Pendaftaran Anda Telah Diterima</h2>
        <p className="text-gray-600">
          Terima kasih telah mendaftar. Tim kami akan menghubungi Anda melalui WhatsApp atau email
          dalam waktu 24 jam dengan informasi pembayaran lebih lanjut.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-gray-500 text-sm uppercase tracking-wide font-medium mb-1">Pendaftar</p>
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900">{name}</h2>
      </div>

      {/* Registration ID */}
      <div className="mb-6">
        <p className="text-gray-500 text-sm uppercase tracking-wide font-medium mb-2">ID Pendaftaran</p>
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <code className="font-mono text-blue-900 font-semibold text-lg flex-1 break-all">{id}</code>
          <button
            onClick={handleCopy}
            title="Salin ID Pendaftaran"
            className="flex-shrink-0 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Salin</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Payment info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-amber-800 text-sm leading-relaxed">
            <span className="font-semibold">Informasi Pembayaran:</span> Link pembayaran sebesar{" "}
            <span className="font-semibold">Rp 200.000</span> akan dikirimkan oleh admin ke nomor
            WhatsApp/email Anda dalam <span className="font-semibold">24 jam</span>.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div>
        <h3 className="text-base font-semibold text-blue-900 mb-4">Langkah Selanjutnya</h3>
        <ol className="space-y-3">
          {[
            "Simpan ID Pendaftaran Anda sebagai referensi",
            "Tunggu link pembayaran dari admin (maks. 24 jam) via WhatsApp/email",
            "Selesaikan pembayaran biaya pendaftaran Rp 200.000 melalui link tersebut",
            "Setelah pembayaran berhasil, Anda akan menerima konfirmasi",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-gray-700 text-sm leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
