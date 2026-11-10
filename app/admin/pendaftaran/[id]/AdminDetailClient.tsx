'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BIAYA_PENDAFTARAN, PEMBAYARAN_ONLINE_AKTIF, formatRupiah, hitungUsia } from '@/lib/config/psb';
import {
  JENIS_KELAMIN,
  JENIS_PENDAFTARAN,
  LULUSAN,
  STATUS_PENDAFTARAN,
  labelHubunganKontak,
  labelOpsi,
  linkWhatsApp,
  statusInfo,
  type StatusPendaftaran,
} from '@/lib/psb/pilihan';
import type {
  RegistrationRecord,
  RegistrationDocument,
  PaymentLog,
  PaymentStatus,
} from '@/lib/types/registration';
import { getRegistrantContact } from '@/lib/utils/registration';
import { DataBadge } from '../AdminDashboardClient';
import EditDataForm from './EditDataForm';
import type { LogPendaftaran } from '@/lib/psb/log';

interface Props {
  registration: RegistrationRecord;
  paymentLogs: PaymentLog[];
  documents: RegistrationDocument[];
  linkLengkapi: string | null;
  riwayat: LogPendaftaran[];
  riwayatTersedia: boolean;
}

const AKSI_LABELS: Record<string, string> = {
  pendaftaran_dibuat: 'Mendaftar lewat formulir awal',
  data_dilengkapi: 'Melengkapi data & dokumen',
  data_diedit: 'Mengedit data',
  tahapan_diubah: 'Mengubah tahapan',
  link_dibuat: 'Membuat link lengkapi data',
  link_dibuka_kembali: 'Membuka kembali form untuk perbaikan',
};

const OLEH_LABELS: Record<string, string> = { admin: 'Admin', wali: 'Wali', sistem: 'Sistem' };

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

function formatTanggalLahir(iso: string | null | undefined) {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-').map(Number);
  const tanggal = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const usia = hitungUsia(iso);
  return usia === null ? tanggal : `${tanggal} (${usia} th saat masuk)`;
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-800">{value || '-'}</dd>
    </div>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:col-span-2 border-t border-gray-100 pt-4 mt-2">
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{children}</p>
    </div>
  );
}

export default function AdminDetailClient({
  registration: reg,
  paymentLogs,
  documents,
  linkLengkapi,
  riwayat,
  riwayatTersedia,
}: Props) {
  const router = useRouter();
  const pasFotoUrl = documents.find((d) => d.key === 'url_pas_foto')?.url;
  const contact = getRegistrantContact(reg);
  const isWali = reg.hubungan_wali !== 'orang-tua-kandung';

  // ── Tahapan & link pelengkapan data ──
  const currentStatus = statusInfo(reg.status_pendaftaran).value;
  const [tahapan, setTahapan] = useState<StatusPendaftaran>(currentStatus);
  const [savingTahapan, setSavingTahapan] = useState(false);
  const [creatingLink, setCreatingLink] = useState(false);
  const [prosesResult, setProsesResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  async function callAdminApi(url: string, method: 'POST' | 'PATCH', body: unknown) {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status === 401) {
      window.location.reload(); // sesi habis → tampilkan form login
      return null;
    }
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) throw new Error(json.error ?? 'Terjadi kesalahan');
    return json;
  }

  async function handleSaveTahapan() {
    setSavingTahapan(true);
    setProsesResult(null);
    try {
      if (!(await callAdminApi('/api/admin/status-pendaftaran', 'PATCH', { registrationId: reg.id, status: tahapan }))) return;
      setProsesResult({ ok: true, message: `Tahapan diubah ke "${statusInfo(tahapan).label}".` });
      router.refresh();
    } catch (err) {
      setProsesResult({ ok: false, message: err instanceof Error ? err.message : 'Terjadi kesalahan' });
    } finally {
      setSavingTahapan(false);
    }
  }

  async function handleCreateLink() {
    if (
      linkLengkapi &&
      !window.confirm(
        reg.data_lengkap_at
          ? `Buka kembali form untuk ${reg.nama_lengkap}? Wali bisa memperbaiki data lewat link baru. Link lama tidak berlaku lagi.`
          : `Buat link baru untuk ${reg.nama_lengkap}? Link lama tidak berlaku lagi.`
      )
    ) {
      return;
    }
    setCreatingLink(true);
    setProsesResult(null);
    try {
      if (!(await callAdminApi('/api/admin/link-lengkapi', 'POST', { registrationId: reg.id }))) return;
      setProsesResult({ ok: true, message: 'Link berhasil dibuat. Kirimkan ke wali lewat tombol WhatsApp.' });
      router.refresh();
    } catch (err) {
      setProsesResult({ ok: false, message: err instanceof Error ? err.message : 'Terjadi kesalahan' });
    } finally {
      setCreatingLink(false);
    }
  }

  async function handleCopyLink() {
    if (!linkLengkapi) return;
    await navigator.clipboard.writeText(linkLengkapi);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  const sapaan = contact.nama ? `Bapak/Ibu ${contact.nama}` : 'Bapak/Ibu';
  const pesanLink = linkLengkapi
    ? `Assalamu'alaikum ${sapaan}. Terima kasih telah mendaftarkan ${reg.nama_lengkap} di PTQ Amsa001.\n\n` +
      `Langkah selanjutnya, mohon lengkapi data dan unggah dokumen pendaftaran melalui link berikut:\n${linkLengkapi}\n\n` +
      `Dokumen yang disiapkan: Kartu Keluarga, Akta Kelahiran, Ijazah/SKL, KTP orang tua/wali, dan pas foto 3x4.\n\n` +
      `Link ini khusus untuk ananda, mohon tidak dibagikan. Jazakumullahu khairan.`
    : '';

  // ── Pembayaran (hanya bila PEMBAYARAN_ONLINE_AKTIF) ──
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>(reg.payment_status);
  const [updating, setUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Tentukan sumber verifikasi pembayaran dari payment_logs
  const verifiedBy = reg.payment_status === 'paid'
    ? paymentLogs.find(l => l.action === 'payment_received' && l.performed_by === 'system')
      ? 'Midtrans'
      : paymentLogs.find(l => l.action === 'status_updated' && l.performed_by === 'admin')
        ? 'Admin'
        : null
    : null;

  async function handleUpdateStatus() {
    setUpdating(true);
    setUpdateResult(null);
    try {
      const res = await fetch('/api/admin/update-payment-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: reg.id, status: selectedStatus }),
      });
      if (res.status === 401) {
        window.location.reload(); // sesi habis → tampilkan form login
        return;
      }
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'Gagal memperbarui status');
      }
      setUpdateResult({ ok: true, message: `Status berhasil diperbarui ke "${STATUS_LABELS[selectedStatus]}"` });
      router.refresh(); // muat ulang badge status & riwayat pembayaran
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
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{reg.nama_lengkap}</h1>
            <p className="text-sm text-gray-500 mt-0.5">ID: {reg.id}</p>
          </div>
          <Link
            href="/admin/pendaftaran"
            className="shrink-0 text-sm text-emerald-600 hover:underline"
          >
            ← Kembali ke Daftar
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Proses pendaftaran */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Proses Pendaftaran</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Tahapan</p>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={tahapan}
                  onChange={(e) => setTahapan(e.target.value as StatusPendaftaran)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {STATUS_PENDAFTARAN.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSaveTahapan}
                  disabled={savingTahapan || tahapan === currentStatus}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {savingTahapan ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Baru → Sudah Dihubungi → Ikut Tes → Diterima / Tidak Diterima</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Kontak Orang Tua / Wali</p>
              <p className="text-sm text-gray-800">
                {contact.nama ?? '-'} <span className="text-gray-500">({labelHubunganKontak(reg)})</span>
              </p>
              {contact.whatsapp ? (
                <a
                  href={linkWhatsApp(contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  💬 Chat WhatsApp {contact.whatsapp}
                </a>
              ) : null}
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Link Lengkapi Data & Dokumen</p>
              <DataBadge reg={reg} />
              {reg.data_lengkap_at ? (
                <span className="text-xs text-gray-400">dikirim {formatDate(reg.data_lengkap_at)}</span>
              ) : null}
            </div>

            {linkLengkapi ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <code className="flex-1 min-w-0 break-all rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-700">
                    {linkLengkapi}
                  </code>
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {linkCopied ? '✓ Disalin' : 'Salin'}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {contact.whatsapp && !reg.data_lengkap_at ? (
                    <a
                      href={linkWhatsApp(contact.whatsapp, pesanLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      💬 Kirim Link via WhatsApp
                    </a>
                  ) : null}
                  <button
                    onClick={handleCreateLink}
                    disabled={creatingLink}
                    className="text-sm text-gray-500 underline hover:text-emerald-700 disabled:opacity-50"
                  >
                    {creatingLink ? 'Membuat...' : reg.data_lengkap_at ? 'Buka kembali untuk perbaikan' : 'Buat link baru'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-3">
                  Setelah menghubungi wali, buat link pribadi agar wali bisa melengkapi data dan mengunggah dokumen.
                </p>
                <button
                  onClick={handleCreateLink}
                  disabled={creatingLink}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {creatingLink ? 'Membuat...' : 'Buat Link Lengkapi Data'}
                </button>
              </>
            )}
          </div>

          {prosesResult && (
            <p className={`mt-4 text-sm font-medium ${prosesResult.ok ? 'text-green-600' : 'text-red-600'}`}>
              {prosesResult.message}
            </p>
          )}
        </div>

        {/* Data pendaftaran */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-semibold text-gray-700">{editing ? 'Edit Data Pendaftaran' : 'Data Pendaftaran'}</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
              >
                ✏️ Edit Data
              </button>
            ) : null}
          </div>

          {editing ? (
            <EditDataForm reg={reg} onClose={() => setEditing(false)} />
          ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Pas Foto 3x4 */}
            {pasFotoUrl && (
              <div className="flex-shrink-0">
                <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                  <img
                    src={pasFotoUrl}
                    alt={`Pas Foto ${reg.nama_lengkap}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">Pas Foto 3x4</p>
              </div>
            )}

            <dl className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Formulir Awal</p>
              </div>
              <Field label="Nama Lengkap" value={reg.nama_lengkap} />
              <Field label="Jenis Kelamin" value={labelOpsi(JENIS_KELAMIN, reg.jenis_kelamin)} />
              <Field label="Tanggal Lahir" value={formatTanggalLahir(reg.tanggal_lahir)} />
              <Field label="Jenis Pendaftaran" value={labelOpsi(JENIS_PENDAFTARAN, reg.jenis_pendaftaran)} />
              <Field label="Lulusan" value={labelOpsi(LULUSAN, reg.lulusan)} />
              <Field label="Asal Sekolah" value={reg.asal_sekolah} />
              <Field label="Kota / Kabupaten" value={reg.kota} />
              <Field label="Tahu PTQ Amsa dari" value={reg.sumber_info} />
              <Field label="Nama Orang Tua / Wali" value={contact.nama} />
              <Field label="Hubungan" value={labelHubunganKontak(reg)} />
              <Field label="No. WhatsApp" value={contact.whatsapp} />
              <Field label="Email" value={contact.email} />
              <Field label="Tanggal Daftar" value={formatDate(reg.created_at)} />

              <Group>Data Lengkap {reg.data_lengkap_at ? '' : '— belum diisi wali'}</Group>
              <Field label="Nama Panggilan" value={reg.nama_panggilan} />
              <Field label="Tempat Lahir" value={reg.tempat_lahir} />
              <Field label="NIK" value={reg.nik} />
              <Field label="NISN" value={reg.nisn} />
              <Field
                label="Anak Ke"
                value={reg.anak_ke && reg.total_saudara ? `Anak ke-${reg.anak_ke} dari ${reg.total_saudara} bersaudara` : null}
              />
              <Field label="Status Anak" value={reg.status_anak} />
              <Field label="No. WhatsApp Santri" value={reg.no_whatsapp_santri} />

              <Group>Orang Tua / Wali</Group>
              {isWali ? (
                <>
                  <Field label="Pekerjaan Wali" value={reg.pekerjaan_wali} />
                  <Field label="Nama Ayah Kandung" value={reg.nama_ayah_kandung} />
                  <Field label="Nama Ibu Kandung" value={reg.nama_ibu_kandung} />
                </>
              ) : (
                <>
                  <Field label="Nama Ayah" value={reg.nama_ayah} />
                  <Field label="Nama Ibu" value={reg.nama_ibu} />
                  <Field label="Pekerjaan Ayah" value={reg.pekerjaan_ayah} />
                  <Field label="Pekerjaan Ibu" value={reg.pekerjaan_ibu} />
                </>
              )}
              <Field label="Penghasilan per Bulan" value={reg.penghasilan_ortu} />

              <Group>Sekolah & Alamat</Group>
              <Field label="Alamat Sekolah Asal" value={reg.alamat_sekolah} />
              <Field label="Provinsi" value={reg.provinsi} />
              <div className="sm:col-span-2">
                <Field label="Alamat Lengkap" value={reg.alamat_domisili} />
              </div>
              <Field label="Terakhir Diperbarui" value={formatDate(reg.updated_at)} />
            </dl>
          </div>
          )}
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-1">Dokumen Pendaftaran</h2>
          <p className="text-xs text-gray-400 mb-4">Link dokumen berlaku 1 jam. Muat ulang halaman bila sudah kadaluarsa.</p>
          {documents.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada dokumen. Dokumen diunggah wali lewat link lengkapi data.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {documents.map((doc) => (
                <li key={doc.key}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                  >
                    <span>{doc.label}</span>
                    <span className="text-xs text-emerald-600">Buka ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Riwayat perubahan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-1">Riwayat Perubahan</h2>
          <p className="text-xs text-gray-400 mb-4">Semua perubahan data oleh wali dan admin tercatat di sini.</p>
          {!riwayatTersedia ? (
            <p className="text-sm text-amber-700">Riwayat belum aktif. Jalankan SQL supabase/2026-11_log_pendaftaran.sql di Supabase.</p>
          ) : riwayat.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada riwayat.</p>
          ) : (
            <ol className="relative border-l border-gray-200 space-y-5 ml-2">
              {riwayat.map((log) => (
                <li key={log.id} className="ml-4">
                  <div
                    className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white ${
                      log.oleh === 'admin' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`}
                  />
                  <p className="text-sm font-medium text-gray-800">
                    <span
                      className={`mr-2 rounded px-1.5 py-0.5 text-xs font-semibold ${
                        log.oleh === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {OLEH_LABELS[log.oleh] ?? log.oleh}
                    </span>
                    {AKSI_LABELS[log.aksi] ?? log.aksi}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(log.created_at)}</p>
                  {log.detail?.catatan ? <p className="text-xs text-gray-500 mt-1">{log.detail.catatan}</p> : null}
                  {log.detail?.perubahan?.length ? (
                    <ul className="mt-1.5 space-y-0.5 text-xs text-gray-600">
                      {log.detail.perubahan.map((p, i) => (
                        <li key={i}>
                          <span className="font-medium">{p.kolom}:</span>{' '}
                          <span className="text-gray-400 line-through">{p.dari ?? '(kosong)'}</span>
                          {' → '}
                          <span className="text-gray-800">{p.ke ?? '(kosong)'}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </div>

        {PEMBAYARAN_ONLINE_AKTIF && (
        <>
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
                {verifiedBy && (
                  <span className="ml-2 text-xs text-gray-400">
                    via {verifiedBy}
                  </span>
                )}
              </dd>
            </div>
            <Field label="Order ID" value={reg.order_id} />
            <Field label="Jumlah" value={formatRupiah(reg.payment_amount ?? BIAYA_PENDAFTARAN)} />
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
            <p className="text-xs text-gray-400 mt-2">Status saat ini sudah &ldquo;{STATUS_LABELS[reg.payment_status]}&rdquo;.</p>
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
        </>
        )}
      </div>
    </div>
  );
}
