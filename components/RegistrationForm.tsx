"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LABEL_AWAL_TAHUN_AJARAN, USIA_MAX, USIA_MIN, hitungUsia } from "@/lib/config/psb";
import {
  HUBUNGAN_KONTAK,
  JENIS_KELAMIN,
  JENIS_PENDAFTARAN,
  LULUSAN,
  POLA_EMAIL,
  POLA_WHATSAPP,
  SUMBER_INFO,
  SUMBER_INFO_LAINNYA,
} from "@/lib/psb/pilihan";
import { Input, RadioCards, Row, SectionTitle, Select } from "@/components/psb/FormFields";
import { PrivasiLink } from "@/components/psb/Privasi";

/**
 * Pendaftaran tahap 1: form singkat tanpa dokumen. Data lengkap & dokumen
 * diisi wali lewat link pribadi yang dikirim admin (lihat /lengkapi/[token]).
 */

type FormState = {
  jenisPendaftaran: string;
  lulusan: string;
  namaLengkap: string;
  jenisKelamin: string;
  tanggalLahir: string;
  asalSekolah: string;
  namaKontak: string;
  hubunganKontak: string;
  hubunganLainnya: string;
  noWhatsapp: string;
  email: string;
  kota: string;
  sumberInfo: string;
  sumberInfoLainnya: string;
  website: string; // honeypot anti-spam, harus kosong
};

const INITIAL: FormState = {
  jenisPendaftaran: "",
  lulusan: "",
  namaLengkap: "",
  jenisKelamin: "",
  tanggalLahir: "",
  asalSekolah: "",
  namaKontak: "",
  hubunganKontak: "",
  hubunganLainnya: "",
  noWhatsapp: "",
  email: "",
  kota: "",
  sumberInfo: "",
  sumberInfoLainnya: "",
  website: "",
};

export default function RegistrationForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [setujuPrivasi, setSetujuPrivasi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Nomor WhatsApp — hanya angka dan +, maks. 15 karakter
  const handleWhatsappChange = (event: ChangeEvent<HTMLInputElement>) => {
    const cleaned = event.target.value.replace(/[^\d+]/g, "").slice(0, 15);
    setForm((prev) => ({ ...prev, noWhatsapp: cleaned }));
  };

  const fail = (message: string) => {
    setErrorMessage(message);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validate = (): string | null => {
    if (form.namaLengkap.trim().length < 2) return "Nama lengkap minimal 2 karakter.";
    const usia = hitungUsia(form.tanggalLahir);
    if (usia === null) return "Tanggal lahir tidak valid.";
    if (usia < USIA_MIN || usia > USIA_MAX) {
      return `Usia calon santri harus ${USIA_MIN}–${USIA_MAX} tahun pada awal tahun ajaran (${LABEL_AWAL_TAHUN_AJARAN}). Usia ananda saat itu: ${usia} tahun. Silakan hubungi admin via WhatsApp bila ada pertimbangan khusus.`;
    }
    if (!POLA_WHATSAPP.test(form.noWhatsapp)) return "Nomor WhatsApp tidak valid. Gunakan angka, contoh: 08123456789";
    if (form.email.trim() && !POLA_EMAIL.test(form.email.trim())) return "Format email tidak valid.";
    if (!setujuPrivasi) return "Mohon centang persetujuan pemberitahuan privasi.";
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const problem = validate();
    if (problem) return fail(problem);

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, setujuPrivasi }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        registrationId?: string;
        studentName?: string;
        error?: string;
      };
      if (!result.success) {
        throw new Error(result.error ?? "Terjadi kesalahan saat mengirim pendaftaran.");
      }
      router.push(
        `/pendaftaran-santri-baru/sukses?id=${result.registrationId}&name=${encodeURIComponent(result.studentName ?? "")}`
      );
    } catch (err) {
      fail(err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim pendaftaran.");
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={topRef} className="mx-auto w-full max-w-3xl scroll-mt-24">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md sm:p-8">
        {errorMessage ? (
          <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-col gap-4">
          <SectionTitle>Data Calon Santri</SectionTitle>
          <Row>
            <RadioCards label="Jenis Pendaftaran" name="jenisPendaftaran" value={form.jenisPendaftaran} onChange={handleChange} options={JENIS_PENDAFTARAN} />
            <RadioCards label="Lulusan" name="lulusan" value={form.lulusan} onChange={handleChange} options={LULUSAN} />
          </Row>
          <Input label="Nama Lengkap Calon Santri" name="namaLengkap" value={form.namaLengkap} onChange={handleChange} maxLength={100} placeholder="Sesuai akta kelahiran" />
          <Row>
            <RadioCards label="Jenis Kelamin" name="jenisKelamin" value={form.jenisKelamin} onChange={handleChange} options={JENIS_KELAMIN} />
            <Input label="Tanggal Lahir" name="tanggalLahir" type="date" value={form.tanggalLahir} onChange={handleChange} />
          </Row>
          <Input label="Asal Sekolah" name="asalSekolah" value={form.asalSekolah} onChange={handleChange} maxLength={150} placeholder="Contoh: SDN 1 Ciawi" />

          <SectionTitle note="Admin akan menghubungi nomor WhatsApp ini untuk tahap selanjutnya.">Orang Tua / Wali</SectionTitle>
          <Row>
            <Input label="Nama Orang Tua / Wali" name="namaKontak" value={form.namaKontak} onChange={handleChange} maxLength={100} />
            <Select label="Hubungan dengan Calon Santri" name="hubunganKontak" value={form.hubunganKontak} onChange={handleChange} options={HUBUNGAN_KONTAK} placeholder="Pilih hubungan" />
          </Row>
          {form.hubunganKontak === "lainnya" ? (
            <Input label="Sebutkan Hubungan" name="hubunganLainnya" value={form.hubunganLainnya} onChange={handleChange} maxLength={100} placeholder="Contoh: Pengasuh panti" />
          ) : null}
          <Row>
            <Input
              label="Nomor WhatsApp"
              name="noWhatsapp"
              type="tel"
              inputMode="tel"
              value={form.noWhatsapp}
              onChange={handleWhatsappChange}
              maxLength={15}
              placeholder="Contoh: 08123456789"
            />
            <Input label="Email" name="email" type="email" inputMode="email" value={form.email} onChange={handleChange} maxLength={100} placeholder="contoh@email.com" optional />
          </Row>
          <Input label="Kota / Kabupaten Tempat Tinggal" name="kota" value={form.kota} onChange={handleChange} maxLength={100} placeholder="Contoh: Kab. Bogor" />

          <SectionTitle>Informasi</SectionTitle>
          <Select label="Tahu PTQ Amsa dari mana?" name="sumberInfo" value={form.sumberInfo} onChange={handleChange} options={SUMBER_INFO} placeholder="Pilih salah satu" />
          {form.sumberInfo === SUMBER_INFO_LAINNYA ? (
            <Input label="Sebutkan" name="sumberInfoLainnya" value={form.sumberInfoLainnya} onChange={handleChange} maxLength={150} placeholder="Tahu dari mana?" />
          ) : null}

          {/* Honeypot: tidak terlihat manusia, biasanya diisi bot */}
          <input type="text" name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        </div>

        {/* Hanya kotak centang yang bisa diklik (teks bukan <label>) supaya persetujuan disengaja */}
        <div className="mt-6 flex items-start gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            required
            checked={setujuPrivasi}
            onChange={(e) => setSetujuPrivasi(e.target.checked)}
            aria-label="Saya setuju dengan Pemberitahuan Privasi"
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-emerald-600"
          />
          <p>
            Saya setuju data yang saya isi digunakan untuk proses penerimaan santri sesuai <PrivasiLink />.
            <span className="ml-0.5 text-red-500">*</span>
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
        </button>
      </form>
    </div>
  );
}
