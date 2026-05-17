'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { RegistrationRecord, PaymentLog, PaymentStatus } from '@/lib/types/registration';

interface Props {
  registration: RegistrationRecord;
  paymentLogs: PaymentLog[];
  adminPassword: string;
}

const STATUS_BADGE: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-600',
};

const STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Lunas',
  failed: 'Gagal',
  expired: 'Kadaluarsa',
};

const LOG_ACTION_LABELS: Record<string, string> = {
  link_generated: 'Link Dibuat',
  payment_received: 'Pembayaran Diterima',
  status_updated: 'Status Diperbarui',
  notification_sent: 'Notifikasi Dikirim',
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-800">{value || '-'}</dd>
    </div>
  );
}

export default function AdminDetailClient({ registration: reg, paymentLogs, adminPassword }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>(reg.payment_status);
  const [updating, setUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleUpdateStatus() {
    setUpdating(true);
    setUpdateResult(null);
    try {
      const res = await fetch('/api/admin/update-payment-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({ registrationId: reg.id, status: selectedStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'Gagal memperbarui status');
      }
      setUpdateResult({ ok: true, message: `Status berhasil diperbarui ke "${STATUS_LABELS[selectedStatus]}"` });
    } catch (err) {
      setUpdateResult({
        ok: false,
        message: err instanceof Error ? err.message : 'Terjadi kesalahan',
      });
    } finally {
      setUpdating(false);
    }
  }

  async function handleCopy() {
    if (!reg.payment_link) return;
    await navigator.clipboard.writeText(reg.payment_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{reg.nama_lengkap}</h1>
            <p className="text-sm text-gray-500 mt-0.5">ID: {reg.id}</p>
          </div>
          <Link
            href={`/admin/pendaftaran?pw=${encodeURIComponent(adminPassword)}`}
            className="text-sm text-emerald-600 hover:underline"
          >
            ← Kembali ke Daftar
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Registration details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Data Pendaftaran</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <Field label="Nama Lengkap" value={reg.nama_lengkap} />
            <Field label="Nama Panggilan" value={reg.nama_panggilan} />
            <Field label="NIK" value={reg.nik} />
            <Field label="NISN" value={reg.nisn} />
            <Field label="Tempat Lahir" value={reg.tempat_lahir} />
            <Field label="Tanggal Lahir" value={reg.tanggal_lahir} />
            <Field label="Jenis Kelamin" value={reg.jenis_kelamin} />
            <Field label="Nama Ayah" value={reg.nama_ayah} />
            <Field label="Nama Ibu" value={reg.nama_ibu} />
            <Field label="Pekerjaan Ayah" value={reg.pekerjaan_ayah} />
            <Field label="Pekerjaan Ibu" value={reg.pekerjaan_ibu} />
            <Field label="No. WhatsApp Ortu" value={reg.no_whatsapp_ortu} />
            <Field label="Relasi WhatsApp" value={reg.relasi_whatsapp} />
            <Field label="Email Ortu" value={reg.email_ortu} />
            <Field label="Penghasilan Ortu" value={reg.penghasilan_ortu} />
            <Field label="Asal Sekolah" value={reg.asal_sekolah} />
            <Field label="Alamat Sekolah" value={reg.alamat_sekolah} />
            <Field label="Alamat Domisili" value={reg.alamat_domisili} />
            <Field label="Provinsi" value={reg.provinsi} />
            <Field label="Kota" value={reg.kota} />
            <Field label="Tanggal Daftar" value={formatDate(reg.created_at)} />
            <Field label="Terakhir Diperbarui" value={formatDate(reg.updated_at)} />
          </dl>
        </div>

        {/* Payment info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Informasi Pembayaran</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[reg.payment_status]}`}
                >
                  {STATUS_LABELS[reg.payment_status]}
                </span>
              </dd>
            </div>
            <Field label="Order ID" value={reg.order_id} />
            <Field label="Jumlah" value="Rp 200.000" />
            <Field label="Tanggal Bayar" value={formatDate(reg.payment_date)} />
            <Field label="Metode Bayar" value={reg.payment_method} />
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Link Pembayaran
              </dt>
              {reg.payment_link ? (
                <div className="flex items-center gap-2">
                  <a
                    href={reg.payment_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-600 hover:underline break-all"
                  >
                    {reg.payment_link}
                  </a>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Salin link"
                  >
                    {copied ? (
                      <span className="text-green-600 text-xs font-medium">✓ Disalin</span>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              ) : (
                <dd className="text-sm text-gray-400">Belum dibuat</dd>
              )}
            </div>
          </div>
        </div>

        {/* Update status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Update Status Pembayaran</h2>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as PaymentStatus)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="pending">Pending</option>
              <option value="paid">Lunas</option>
              <option value="failed">Gagal</option>
              <option value="expired">Kadaluarsa</option>
            </select>
            <button
              onClick={handleUpdateStatus}
              disabled={updating || selectedStatus === reg.payment_status}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {updating ? 'Menyimpan...' : 'Konfirmasi Update'}
            </button>
          </div>
          {selectedStatus === reg.payment_status && (
            <p className="text-xs text-gray-400 mt-2">Status saat ini sudah "{STATUS_LABELS[reg.payment_status]}".</p>
          )}
          {updateResult && (
            <p
              className={`mt-3 text-sm font-medium ${
                updateResult.ok ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {updateResult.message}
            </p>
          )}
        </div>

        {/* Payment logs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Riwayat Pembayaran</h2>
          {paymentLogs.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada riwayat.</p>
          ) : (
            <ol className="relative border-l border-gray-200 space-y-4 ml-2">
              {paymentLogs.map((log) => (
                <li key={log.id} className="ml-4">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
                  <p className="text-sm font-medium text-gray-800">
                    {LOG_ACTION_LABELS[log.action] ?? log.action}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(log.created_at)}</p>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <pre className="mt-1 text-xs text-gray-500 bg-gray-50 rounded p-2 overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">Oleh: {log.performed_by}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
