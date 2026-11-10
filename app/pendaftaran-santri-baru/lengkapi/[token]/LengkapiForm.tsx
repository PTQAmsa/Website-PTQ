"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  JENIS_KELAMIN,
  JENIS_PENDAFTARAN,
  LULUSAN,
  PENGHASILAN,
  STATUS_ANAK,
  labelHubunganKontak,
  labelOpsi,
} from "@/lib/psb/pilihan";
import { Input, ReadOnlyField, Row, SectionTitle, Select, TextArea } from "@/components/psb/FormFields";
import { PrivasiLink } from "@/components/psb/Privasi";
import type { RegistrationRecord } from "@/lib/types/registration";

type DokumenKey = "kk" | "akta" | "ijazah" | "ktpOrtu" | "pasFoto" | "suratSehat";

export type DataAwal = Pick<
  RegistrationRecord,
  | "id"
  | "jenis_pendaftaran"
  | "lulusan"
  | "nama_lengkap"
  | "jenis_kelamin"
  | "tanggal_lahir"
  | "asal_sekolah"
  | "kota"
  | "hubungan_wali"
  | "relasi_whatsapp"
  | "hubungan_dengan_santri"
  | "nama_ayah"
  | "nama_ibu"
  | "no_whatsapp_ortu"
  | "email_ortu"
  | "nama_wali"
  | "no_whatsapp_wali"
  | "email_wali"
  | "nama_panggilan"
  | "nik"
  | "nisn"
  | "tempat_lahir"
  | "no_whatsapp_santri"
  | "anak_ke"
  | "total_saudara"
  | "status_anak"
  | "pekerjaan_ayah"
  | "pekerjaan_ibu"
  | "pekerjaan_wali"
  | "nama_ayah_kandung"
  | "nama_ibu_kandung"
  | "penghasilan_ortu"
  | "alamat_sekolah"
  | "alamat_domisili"
  | "provinsi"
> & { dokumenAda: Record<DokumenKey, boolean> };

const DOKUMEN: { key: DokumenKey; label: string; prefix: string; hint: string; optional?: boolean }[] = [
  { key: "kk", label: "Kartu Keluarga (KK)", prefix: "kk", hint: "Scan/foto yang jelas" },
  { key: "akta", label: "Akta Kelahiran", prefix: "akta", hint: "Scan/foto yang jelas" },
  { key: "ijazah", label: "Ijazah / Surat Keterangan Lulus", prefix: "ijazah", hint: "Ijazah terakhir (SD/MI atau SMP/MTs)" },
  { key: "ktpOrtu", label: "KTP Orang Tua / Wali", prefix: "ktp-ortu", hint: "Scan/foto yang jelas" },
  { key: "pasFoto", label: "Pas Foto 3x4", prefix: "pas-foto", hint: "Foto terbaru, latar belakang terang" },
  { key: "suratSehat", label: "Surat Keterangan Sehat", prefix: "surat-sehat", hint: "Dari dokter", optional: true },
];

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const ACCEPTED_FILE_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,.webp";

function formatTanggal(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export default function LengkapiForm({ token, data }: { token: string; data: DataAwal }) {
  // Mode kontak utama dari tahap 1 menentukan data orang tua yang masih perlu diisi
  const kontakAyah = data.hubungan_wali === "orang-tua-kandung" && data.relasi_whatsapp?.toLowerCase() !== "ibu";
  const kontakIbu = data.hubungan_wali === "orang-tua-kandung" && !kontakAyah;
  const kontakWali = data.hubungan_wali !== "orang-tua-kandung";

  const [form, setForm] = useState({
    namaPanggilan: data.nama_panggilan ?? "",
    tempatLahir: data.tempat_lahir ?? "",
    nik: data.nik ?? "",
    nisn: data.nisn ?? "",
    noWhatsappSantri: data.no_whatsapp_santri ?? "",
    anakKe: data.anak_ke ? String(data.anak_ke) : "",
    totalSaudara: data.total_saudara ? String(data.total_saudara) : "",
    statusAnak: data.status_anak ?? "",
    namaAyah: kontakIbu ? data.nama_ayah ?? "" : "",
    namaIbu: kontakAyah ? data.nama_ibu ?? "" : "",
    pekerjaanAyah: data.pekerjaan_ayah ?? "",
    pekerjaanIbu: data.pekerjaan_ibu ?? "",
    pekerjaanWali: data.pekerjaan_wali ?? "",
    namaAyahKandung: data.nama_ayah_kandung ?? "",
    namaIbuKandung: data.nama_ibu_kandung ?? "",
    penghasilan: data.penghasilan_ortu ?? "",
    alamatSekolah: data.alamat_sekolah ?? "",
    provinsi: data.provinsi ?? "",
    alamatDomisili: data.alamat_domisili ?? "",
  });
  const [files, setFiles] = useState<Partial<Record<DokumenKey, File>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selesai, setSelesai] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDigits = (max: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value.replace(/\D/g, "").slice(0, max) }));
  };

  const handleWhatsappChange = (event: ChangeEvent<HTMLInputElement>) => {
    const cleaned = event.target.value.replace(/[^\d+]/g, "").slice(0, 15);
    setForm((prev) => ({ ...prev, noWhatsappSantri: cleaned }));
  };

  const fail = (message: string) => {
    setErrorMessage(message);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFileChange = (key: DokumenKey) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setErrorMessage("");
    if (!file) {
      setFiles((prev) => ({ ...prev, [key]: undefined }));
      return;
    }
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      event.target.value = "";
      return fail("Format file tidak didukung. Gunakan PDF/JPG/PNG/WEBP.");
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      event.target.value = "";
      return fail(`File "${file.name}" terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimal 3 MB per berkas.`);
    }
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const validate = (): string | null => {
    if (form.nik.length !== 16) return "NIK harus 16 digit.";
    if (form.nisn.length !== 10) return "NISN harus 10 digit.";
    if (form.noWhatsappSantri && !/^\+?[0-9]{9,15}$/.test(form.noWhatsappSantri)) return "Nomor WhatsApp calon santri tidak valid.";
    const anakKe = Number(form.anakKe);
    const total = Number(form.totalSaudara);
    if (!Number.isInteger(anakKe) || !Number.isInteger(total) || anakKe < 1 || total < 1) return "Anak ke- dan jumlah saudara minimal 1.";
    if (anakKe > total) return "Anak ke- tidak boleh lebih besar dari jumlah saudara.";
    const kurang = DOKUMEN.filter((d) => !d.optional && !files[d.key] && !data.dokumenAda[d.key]);
    if (kurang.length > 0) return `Mohon unggah berkas: ${kurang.map((d) => d.label).join(", ")}.`;
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    const problem = validate();
    if (problem) return fail(problem);

    setIsSubmitting(true);
    try {
      // File diunggah langsung dari browser ke Supabase (bypass batas ukuran request Vercel)
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const uploads = await Promise.all(
        DOKUMEN.filter((d) => files[d.key]).map(async (d) => {
          const file = files[d.key]!;
          const ext = (file.name.split(".").pop() ?? "bin").replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "bin";
          const path = `pendaftaran/${data.id}/${d.prefix}-${Date.now()}.${ext}`;
          const { error } = await supabase.storage.from("dokumen-santri").upload(path, file, { upsert: false });
          if (error) throw new Error(`Gagal mengunggah ${d.label}: ${error.message}`);
          return [d.key, supabase.storage.from("dokumen-santri").getPublicUrl(path).data.publicUrl] as const;
        })
      );

      const response = await fetch("/api/lengkapi-pendaftaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...form, dokumen: Object.fromEntries(uploads) }),
      });
      const result = (await response.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (!result.success) throw new Error(result.error ?? "Gagal mengirim data. Silakan coba lagi.");
      setSelesai(true);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      fail(err instanceof Error ? err.message : "Gagal mengirim data. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selesai) {
    return (
      <div ref={topRef} className="mx-auto max-w-xl scroll-mt-24 rounded-2xl bg-white p-8 text-center shadow-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">✓</div>
        <h2 className="mb-3 text-2xl font-bold text-blue-900">Data berhasil dikirim</h2>
        <p className="text-gray-600">
          Jazakumullahu khairan. Data dan dokumen {data.nama_lengkap} sudah kami terima. Admin akan menghubungi Anda melalui
          WhatsApp untuk jadwal tes masuk.
        </p>
      </div>
    );
  }

  const selectPenghasilan = (
    <Select
      label={kontakWali ? "Penghasilan Wali per Bulan" : "Penghasilan Orang Tua per Bulan"}
      name="penghasilan"
      value={form.penghasilan}
      onChange={handleChange}
      options={PENGHASILAN}
      placeholder="Pilih rentang penghasilan"
    />
  );

  const namaKontak = kontakWali ? data.nama_wali : kontakIbu ? data.nama_ibu : data.nama_ayah;

  return (
    <div ref={topRef} className="mx-auto w-full max-w-3xl scroll-mt-24">
      <p className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Kolom bertanda 🔒 sudah Anda isi saat mendaftar dan tidak perlu diisi lagi. Bila ada yang keliru, sampaikan kepada admin
        melalui WhatsApp.
      </p>

      {/* Isian yang sudah diisi tampil abu-abu (hitam lagi saat diklik untuk diubah) */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md sm:p-8 [&_input:not(:focus)]:text-gray-500 [&_select:not(:focus)]:text-gray-500 [&_textarea:not(:focus)]:text-gray-500">
        {errorMessage ? (
          <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-col gap-4">
          <SectionTitle>Data Calon Santri</SectionTitle>
          <Row>
            <ReadOnlyField label="Nama Lengkap" value={data.nama_lengkap} />
            <ReadOnlyField label="Jenis Kelamin" value={labelOpsi(JENIS_KELAMIN, data.jenis_kelamin)} />
          </Row>
          <Row>
            <ReadOnlyField label="Tanggal Lahir" value={data.tanggal_lahir ? formatTanggal(data.tanggal_lahir) : "-"} />
            <ReadOnlyField
              label="Jenis Pendaftaran / Lulusan"
              value={`${labelOpsi(JENIS_PENDAFTARAN, data.jenis_pendaftaran)} · ${labelOpsi(LULUSAN, data.lulusan)}`}
            />
          </Row>
          <Row>
            <Input label="Nama Panggilan" name="namaPanggilan" value={form.namaPanggilan} onChange={handleChange} maxLength={50} />
            <Input label="Tempat Lahir" name="tempatLahir" value={form.tempatLahir} onChange={handleChange} maxLength={100} />
          </Row>
          <Row>
            <Input
              label="NIK Calon Santri"
              name="nik"
              inputMode="numeric"
              value={form.nik}
              onChange={handleDigits(16)}
              maxLength={16}
              placeholder="16 digit, lihat di Kartu Keluarga"
              hint={`${form.nik.length}/16 digit`}
            />
            <Input
              label="NISN"
              name="nisn"
              inputMode="numeric"
              value={form.nisn}
              onChange={handleDigits(10)}
              maxLength={10}
              placeholder="10 digit, tanyakan ke sekolah asal"
              hint={`${form.nisn.length}/10 digit`}
            />
          </Row>
          <Row>
            <Input label="Anak ke-" name="anakKe" type="number" inputMode="numeric" min="1" max="20" value={form.anakKe} onChange={handleChange} placeholder="Contoh: 1" />
            <Input label="Dari ... Bersaudara" name="totalSaudara" type="number" inputMode="numeric" min="1" max="20" value={form.totalSaudara} onChange={handleChange} placeholder="Contoh: 3" />
          </Row>
          <Row>
            <Select label="Status Anak" name="statusAnak" value={form.statusAnak} onChange={handleChange} options={STATUS_ANAK} placeholder="Pilih status anak" />
            <Input
              label="Nomor WhatsApp Calon Santri"
              name="noWhatsappSantri"
              type="tel"
              inputMode="tel"
              value={form.noWhatsappSantri}
              onChange={handleWhatsappChange}
              maxLength={15}
              placeholder="Jika ada"
              optional
            />
          </Row>

          <SectionTitle>Orang Tua / Wali</SectionTitle>
          <Row>
            <ReadOnlyField label={kontakWali ? "Nama Wali" : kontakIbu ? "Nama Ibu" : "Nama Ayah"} value={namaKontak} />
            <ReadOnlyField label="Hubungan dengan Calon Santri" value={labelHubunganKontak(data)} />
          </Row>
          <Row>
            <ReadOnlyField label="Nomor WhatsApp" value={kontakWali ? data.no_whatsapp_wali : data.no_whatsapp_ortu} />
            <ReadOnlyField label="Email" value={kontakWali ? data.email_wali : data.email_ortu} />
          </Row>
          {kontakWali ? (
            <>
              <Row>
                <Input label="Nama Ayah Kandung" name="namaAyahKandung" value={form.namaAyahKandung} onChange={handleChange} maxLength={100} />
                <Input label="Nama Ibu Kandung" name="namaIbuKandung" value={form.namaIbuKandung} onChange={handleChange} maxLength={100} />
              </Row>
              <Row>
                <Input label="Pekerjaan Wali" name="pekerjaanWali" value={form.pekerjaanWali} onChange={handleChange} maxLength={100} />
                {selectPenghasilan}
              </Row>
            </>
          ) : (
            <>
              <Row>
                {kontakIbu ? (
                  <Input label="Nama Ayah Kandung" name="namaAyah" value={form.namaAyah} onChange={handleChange} maxLength={100} />
                ) : (
                  <Input label="Nama Ibu Kandung" name="namaIbu" value={form.namaIbu} onChange={handleChange} maxLength={100} />
                )}
                {selectPenghasilan}
              </Row>
              <Row>
                <Input label="Pekerjaan Ayah" name="pekerjaanAyah" value={form.pekerjaanAyah} onChange={handleChange} maxLength={100} />
                <Input label="Pekerjaan Ibu" name="pekerjaanIbu" value={form.pekerjaanIbu} onChange={handleChange} maxLength={100} />
              </Row>
            </>
          )}

          <SectionTitle>Sekolah & Alamat</SectionTitle>
          <Row>
            <ReadOnlyField label="Asal Sekolah" value={data.asal_sekolah} />
            <ReadOnlyField label="Kota / Kabupaten" value={data.kota} />
          </Row>
          <Row>
            <Input label="Alamat Sekolah Asal" name="alamatSekolah" value={form.alamatSekolah} onChange={handleChange} maxLength={200} />
            <Input label="Provinsi" name="provinsi" value={form.provinsi} onChange={handleChange} maxLength={100} placeholder="Contoh: Jawa Barat" />
          </Row>
          <TextArea
            label="Alamat Lengkap Tempat Tinggal"
            name="alamatDomisili"
            value={form.alamatDomisili}
            onChange={handleChange}
            placeholder="Jalan, RT/RW, desa/kelurahan, kecamatan"
          />

          <SectionTitle note="Format PDF, JPG, PNG, atau WEBP. Maksimal 3 MB per berkas.">Dokumen</SectionTitle>
          {[0, 2, 4].map((start) => (
            <Row key={start}>
              {DOKUMEN.slice(start, start + 2).map((d) => {
                const sudahAda = data.dokumenAda[d.key];
                const wajib = !d.optional && !sudahAda;
                return (
                  <label key={d.key} className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-700">
                      {d.label}
                      {wajib ? (
                        <span className="ml-0.5 text-red-500">*</span>
                      ) : (
                        <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-normal text-gray-500">Opsional</span>
                      )}
                    </span>
                    <input
                      type="file"
                      required={wajib}
                      accept={ACCEPTED_FILE_EXTENSIONS}
                      onChange={handleFileChange(d.key)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-blue-100 file:px-3 file:py-1.5 file:font-semibold file:text-blue-700 hover:file:bg-blue-200"
                    />
                    <span className="mt-1 block text-xs text-gray-400">
                      {sudahAda ? "✓ Sudah diunggah sebelumnya. Pilih file hanya jika ingin mengganti." : d.hint}
                    </span>
                  </label>
                );
              })}
            </Row>
          ))}
        </div>

        <p className="mt-8 text-sm text-gray-600">
          Data dan dokumen yang Anda kirim dilindungi sesuai <PrivasiLink />.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSubmitting ? "Mengunggah & Mengirim..." : "Kirim Data Lengkap"}
        </button>
      </form>
    </div>
  );
}
