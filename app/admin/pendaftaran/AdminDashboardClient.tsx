'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PEMBAYARAN_ONLINE_AKTIF } from '@/lib/config/psb';
import {
  JENIS_PENDAFTARAN,
  LULUSAN,
  STATUS_PENDAFTARAN,
  labelMetodeBayar,
  labelOpsi,
  linkWhatsApp,
  statusInfo,
  type StatusPendaftaran,
} from '@/lib/psb/pilihan';
import type { RegistrationRecord, PaymentStatus } from '@/lib/types/registration';
import { getRegistrantContact } from '@/lib/utils/registration';

interface Props {
  registrations: RegistrationRecord[];
}

type FilterStatus = 'semua' | StatusPendaftaran;

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Lunas',
  failed: 'Gagal',
  expired: 'Kadaluarsa',
};

const PAYMENT_BADGE: Record<PaymentStatus, string> = {
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

/** Posisi pengisian data tahap 2. */
export function DataBadge({ reg }: { reg: Pick<RegistrationRecord, 'data_lengkap_at' | 'token_lengkapi'> }) {
  if (reg.data_lengkap_at) {
    return <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">✓ Lengkap</span>;
  }
  if (reg.token_lengkapi) {
    return <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">Menunggu wali</span>;
  }
  return <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">Link belum dibuat</span>;
}

export default function AdminDashboardClient({ registrations }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterStatus>('semua');
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [paymentLinks, setPaymentLinks] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const keyword = search.trim().toLowerCase();
  const filtered = registrations.filter(
    (r) =>
      (filter === 'semua' || statusInfo(r.status_pendaftaran).value === filter) &&
      (!keyword ||
        r.nama_lengkap.toLowerCase().includes(keyword) ||
        (r.no_pendaftaran ?? '').toLowerCase().includes(keyword))
  );

  const countByStatus = (status: StatusPendaftaran) =>
    registrations.filter((r) => statusInfo(r.status_pendaftaran).value === status).length;

  async function handleGenerateLink(reg: RegistrationRecord, isRegenerate = false) {
    if (
      isRegenerate &&
      !window.confirm(
        `Buat link pembayaran baru untuk ${reg.nama_lengkap}? Link lama tidak akan dipakai lagi.`
      )
    ) {
      return;
    }
    setLoadingId(reg.id);
    setErrors((prev) => ({ ...prev, [reg.id]: '' }));
    try {
      const res = await fetch('/api/admin/generate-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: reg.id }),
      });
      if (res.status === 401) {
        window.location.reload(); // sesi habis → tampilkan form login
        return;
      }
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'Gagal membuat link pembayaran');
      }
      setPaymentLinks((prev) => ({ ...prev, [reg.id]: json.paymentLink }));
      router.refresh(); // status bisa berubah (mis. kadaluarsa → pending)
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

  const filterButtons: { label: string; value: FilterStatus; count: number }[] = [
    { label: 'Semua', value: 'semua', count: registrations.length },
    ...STATUS_PENDAFTARAN.map((s) => ({ label: s.label, value: s.value, count: countByStatus(s.value) })),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Dashboard Admin — Pendaftaran Santri</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Total: {registrations.length} pendaftar
          </p>
        </div>
        <div className="flex items-center gap-5">
          {/* Unduh semua pendaftar sebagai file Excel */}
          <a
            href="/api/admin/export-pendaftaran"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            ⬇️ Unduh Excel
          </a>
          <Link href="/admin/artikel" className="text-sm text-gray-500 hover:text-emerald-700 transition-colors">
            Artikel
          </Link>
          <form method="POST" action="/api/admin/logout">
            <button type="submit" className="text-sm text-gray-500 hover:text-red-600 transition-colors">
              Keluar
            </button>
          </form>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
        {/* Filter tahapan + cari nama */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
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
              {btn.label} <span className="opacity-70">({btn.count})</span>
            </button>
          ))}
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama / no. pendaftaran…"
            className="ml-auto w-full sm:w-56 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-10">No</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Calon Santri</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Orang Tua / Wali</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tahapan</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Data Lengkap</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Pembayaran</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tanggal Daftar</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">
                      Tidak ada data.
                    </td>
                  </tr>
                )}
                {filtered.map((reg, idx) => {
                  const generatedLink = paymentLinks[reg.id] ?? reg.payment_link;
                  const canGenerateLink = PEMBAYARAN_ONLINE_AKTIF && reg.payment_status !== 'paid';
                  const showBuatLink = canGenerateLink && !generatedLink;
                  const showPaymentLink = PEMBAYARAN_ONLINE_AKTIF && generatedLink;
                  const isLoading = loadingId === reg.id;
                  const contact = getRegistrantContact(reg);
                  const status = statusInfo(reg.status_pendaftaran);

                  return (
                    <tr key={reg.id} className="hover:bg-gray-50 transition-colors align-top">
                      <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/pendaftaran/${reg.id}`} className="font-medium text-gray-800 hover:text-emerald-700">
                          {reg.nama_lengkap}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {[
                            reg.no_pendaftaran,
                            reg.jenis_pendaftaran && labelOpsi(JENIS_PENDAFTARAN, reg.jenis_pendaftaran),
                            reg.lulusan && `Lulusan ${labelOpsi(LULUSAN, reg.lulusan)}`,
                            reg.kota,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <p>{contact.nama ?? '-'}</p>
                        {contact.whatsapp ? (
                          <a
                            href={linkWhatsApp(contact.whatsapp)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline"
                            title="Buka chat WhatsApp"
                          >
                            💬 {contact.whatsapp}
                          </a>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.badge}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <DataBadge reg={reg} />
                      </td>
                      <td className="px-4 py-3">
                        {PEMBAYARAN_ONLINE_AKTIF || reg.payment_status === 'paid' ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PAYMENT_BADGE[reg.payment_status]}`}
                          >
                            {PAYMENT_LABELS[reg.payment_status]}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Belum bayar
                          </span>
                        )}
                        {reg.payment_status === 'paid' && reg.payment_method ? (
                          <p className="mt-1 text-xs text-gray-500">{labelMetodeBayar(reg.payment_method)}</p>
                        ) : null}
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
                              {isLoading ? 'Membuat...' : 'Buat Link Bayar'}
                            </button>
                          )}

                          {/* Show payment link */}
                          {showPaymentLink && (
                            <div className="flex flex-wrap items-center gap-1.5">
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
                                {copied === reg.id ? <span className="text-green-600">✓</span> : 'Salin'}
                              </button>
                              {/* Link Midtrans berlaku 24 jam — izinkan membuat ulang selama belum lunas */}
                              {canGenerateLink && (
                                <button
                                  onClick={() => handleGenerateLink(reg, true)}
                                  disabled={isLoading}
                                  className="text-xs text-gray-500 hover:text-emerald-700 underline disabled:opacity-50"
                                  title="Buat link pembayaran baru (link lama kadaluarsa setelah 24 jam)"
                                >
                                  {isLoading ? 'Membuat...' : 'Buat ulang'}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Error message */}
                          {errors[reg.id] && (
                            <p className="text-xs text-red-500">{errors[reg.id]}</p>
                          )}

                          <Link
                            href={`/admin/pendaftaran/${reg.id}`}
                            className="inline-flex justify-center rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
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
