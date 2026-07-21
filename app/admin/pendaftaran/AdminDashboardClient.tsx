'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { RegistrationRecord, PaymentStatus } from '@/lib/types/registration';

interface Props {
  registrations: RegistrationRecord[];
  adminPassword: string;
}

type FilterStatus = 'semua' | PaymentStatus;

const STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Lunas',
  failed: 'Gagal',
  expired: 'Kadaluarsa',
};

const STATUS_BADGE: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-600',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
}

export default function AdminDashboardClient({ registrations, adminPassword }: Props) {
  const [filter, setFilter] = useState<FilterStatus>('semua');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [paymentLinks, setPaymentLinks] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const filtered =
    filter === 'semua' ? registrations : registrations.filter((r) => r.payment_status === filter);

  async function handleGenerateLink(reg: RegistrationRecord) {
    setLoadingId(reg.id);
    setErrors((prev) => ({ ...prev, [reg.id]: '' }));
    try {
      const res = await fetch('/api/admin/generate-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({ registrationId: reg.id }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'Gagal membuat link pembayaran');
      }
      setPaymentLinks((prev) => ({ ...prev, [reg.id]: json.paymentLink }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [reg.id]: err instanceof Error ? err.message : 'Terjadi kesalahan',
      }));
    } finally {
      setLoadingId(null);
    }
  }

  async function handleCopy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const filterButtons: { label: string; value: FilterStatus }[] = [
    { label: 'Semua', value: 'semua' },
    { label: 'Pending', value: 'pending' },
    { label: 'Lunas', value: 'paid' },
    { label: 'Gagal', value: 'failed' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard Admin — Pendaftaran Santri</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Total: {registrations.length} pendaftar
        </p>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === btn.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-10">No</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Nama</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">WhatsApp</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tanggal Daftar</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      Tidak ada data.
                    </td>
                  </tr>
                )}
                {filtered.map((reg, idx) => {
                  const generatedLink = paymentLinks[reg.id] ?? reg.payment_link;
                  const showBuatLink =
                    reg.payment_status === 'pending' && !generatedLink;
                  const isLoading = loadingId === reg.id;

                  return (
                    <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{reg.nama_lengkap}</td>
                      <td className="px-4 py-3 text-gray-600">{reg.no_whatsapp_ortu}</td>
                      <td className="px-4 py-3 text-gray-600">{reg.email_ortu ?? '-'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[reg.payment_status]}`}
                        >
                          {STATUS_LABELS[reg.payment_status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {formatDate(reg.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          {/* Generate link button */}
                          {showBuatLink && (
                            <button
                              onClick={() => handleGenerateLink(reg)}
                              disabled={isLoading}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              {isLoading ? (
                                <>
                                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                  </svg>
                                  Membuat...
                                </>
                              ) : (
                                'Buat Link'
                              )}
                            </button>
                          )}

                          {/* Show payment link */}
                          {generatedLink && (
                            <div className="flex items-center gap-1.5">
                              <a
                                href={generatedLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-emerald-600 hover:underline truncate max-w-[140px]"
                                title={generatedLink}
                              >
                                Link Bayar
                              </a>
                              <button
                                onClick={() => handleCopy(generatedLink, reg.id)}
                                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                title="Salin link"
                              >
                                {copied === reg.id ? (
                                  <span className="text-green-600">✓</span>
                                ) : (
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          )}

                          {/* Error message */}
                          {errors[reg.id] && (
                            <p className="text-xs text-red-500">{errors[reg.id]}</p>
                          )}

                          {/* Detail link */}
                          <Link
                            href={`/admin/pendaftaran/${reg.id}?pw=${encodeURIComponent(adminPassword)}`}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Detail →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
