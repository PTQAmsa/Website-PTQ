"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Step = 1 | 2 | 3;
type RequiredFileKey = "kkFile" | "aktaFile" | "ijazahFile" | "ktpOrtuFile" | "pasFotoFile";

type FormDataState = {
  namaLengkap: string;
  namaPanggilan: string;
  nik: string;
  nisn: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  noWhatsappSantri: string; // Opsional
  // Status dalam keluarga
  anakKe: string;
  totalSaudara: string;
  statusAnak: string;
  // Data wali/orang tua
  hubunganWali: string;
  namaAyah: string;
  namaIbu: string;
  pekerjaanAyah: string;
  pekerjaanIbu: string;
  noWhatsappOrtu: string;
  relasiWhatsapp: string;
  penghasilanOrtu: string;
  emailOrtu: string;
  // Data tambahan untuk wali non-orang tua kandung
  namaWali: string;
  hubunganDenganSantri: string;
  pekerjaanWali: string;
  noWhatsappWali: string;
  emailWali: string;
  namaAyahKandung: string;
  namaIbuKandung: string;
  // Data pendidikan
  asalSekolah: string;
  alamatSekolah: string;
  alamatDomisili: string;
  provinsi: string;
  kota: string;
};

type FormFilesState = {
  kkFile: File | null;
  aktaFile: File | null;
  ijazahFile: File | null;
  ktpOrtuFile: File | null;
  pasFotoFile: File | null;
  suratSehatFile: File | null;
};

const INITIAL_FORM_DATA: FormDataState = {
  namaLengkap: "",
  namaPanggilan: "",
  nik: "",
  nisn: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  noWhatsappSantri: "",
  // Status dalam keluarga
  anakKe: "",
  totalSaudara: "",
  statusAnak: "",
  // Data wali/orang tua
  hubunganWali: "orang-tua-kandung",
  namaAyah: "",
  namaIbu: "",
  pekerjaanAyah: "",
  pekerjaanIbu: "",
  noWhatsappOrtu: "",
  relasiWhatsapp: "",
  penghasilanOrtu: "",
  emailOrtu: "",
  // Data tambahan untuk wali non-orang tua kandung
  namaWali: "",
  hubunganDenganSantri: "",
  pekerjaanWali: "",
  noWhatsappWali: "",
  emailWali: "",
  namaAyahKandung: "",
  namaIbuKandung: "",
  // Data pendidikan
  asalSekolah: "",
  alamatSekolah: "",
  alamatDomisili: "",
  provinsi: "",
  kota: "",
};

const INITIAL_FILES: FormFilesState = {
  kkFile: null,
  aktaFile: null,
  ijazahFile: null,
  ktpOrtuFile: null,
  pasFotoFile: null,
  suratSehatFile: null,
};

const STEP_TITLES = ["Data Diri", "Data Wali & Orang Tua", "Pendidikan & Berkas"];

// 1. Maksimal 3 MB per file
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;
const MAX_FILE_SIZE_LABEL = "3 MB";

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const ACCEPTED_FILE_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,.webp";

const FILE_FIELDS: {
  key: RequiredFileKey;
  label: string;
  storagePrefix: string;
}[] = [
  { key: "kkFile", label: "Kartu Keluarga (KK)", storagePrefix: "kk" },
  { key: "aktaFile", label: "Akta Kelahiran", storagePrefix: "akta" },
  { key: "ijazahFile", label: "Ijazah", storagePrefix: "ijazah" },
  { key: "ktpOrtuFile", label: "KTP Orang Tua", storagePrefix: "ktp-ortu" },
  { key: "pasFotoFile", label: "Pas Foto 3x4", storagePrefix: "pas-foto" },
];

// 4. Opsi penghasilan orang tua per bulan
const PENGHASILAN_OPTIONS = [
  { value: "", label: "Pilih rentang penghasilan" },
  { value: "< Rp 3.000.000", label: "< Rp 3.000.000" },
  { value: "Rp 3.000.000 - Rp 5.000.000", label: "Rp 3.000.000 - Rp 5.000.000" },
  { value: "Rp 5.000.000 - Rp 7.000.000", label: "Rp 5.000.000 - Rp 7.000.000" },
  { value: "Rp 7.000.000 - Rp 9.000.000", label: "Rp 7.000.000 - Rp 9.000.000" },
  { value: "Rp 9.000.000 - Rp 11.000.000", label: "Rp 9.000.000 - Rp 11.000.000" },
  { value: "> Rp 11.000.000", label: "> Rp 11.000.000" },
];

// Opsi status anak dalam keluarga
const STATUS_ANAK_OPTIONS = [
  { value: "", label: "Pilih status anak" },
  { value: "Kandung", label: "Anak Kandung" },
  { value: "Angkat", label: "Anak Angkat" },
  { value: "Tiri", label: "Anak Tiri" },
  { value: "Asuh", label: "Anak Asuh" },
];

// Opsi hubungan wali dengan santri
const HUBUNGAN_WALI_OPTIONS = [
  { value: "", label: "Pilih hubungan wali" },
  { value: "orang-tua-kandung", label: "Orang Tua Kandung" },
  { value: "ayah-tiri", label: "Ayah Tiri" },
  { value: "ibu-tiri", label: "Ibu Tiri" },
  { value: "orang-tua-angkat", label: "Orang Tua Angkat" },
  { value: "kakek-nenek", label: "Kakek / Nenek" },
  { value: "paman-bibi", label: "Paman / Bibi" },
  { value: "kakak-saudara", label: "Kakak / Saudara" },
  { value: "lainnya", label: "Lainnya" },
];

function safeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export default function RegistrationForm() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM_DATA);
  const [files, setFiles] = useState<FormFilesState>(INITIAL_FILES);

  const router = useRouter();

  const progressPercent = useMemo(() => (step / 3) * 100, [step]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Handler NIK - hanya angka, max 16 digit
  const handleNikChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 16);
    setFormData((prev) => ({ ...prev, nik: digits }));
  };

  // 3. Handler NISN - hanya angka, max 10 digit
  const handleNisnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, nisn: digits }));
  };

  // Handler nomor WhatsApp — hanya angka dan +, max 15 karakter
  const handleWhatsappChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const cleaned = value.replace(/[^\d+]/g, "").slice(0, 15);
    setFormData((prev) => ({ ...prev, [name]: cleaned }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, files: inputFiles } = event.target;
    const file = inputFiles?.[0] ?? null;
    setErrorMessage("");

    if (!file) {
      setFiles((prev) => ({ ...prev, [name]: null }));
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setErrorMessage("Format file tidak didukung. Gunakan PDF/JPG/JPEG/PNG/WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File "${file.name}" terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimal ${MAX_FILE_SIZE_LABEL} per berkas. Kompres atau perkecil file Anda terlebih dahulu.`);
      event.target.value = "";
      return;
    }

    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  const handleOptionalFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, files: inputFiles } = event.target;
    const file = inputFiles?.[0] ?? null;
    setErrorMessage("");

    if (!file) {
      setFiles((prev) => ({ ...prev, [name]: null }));
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setErrorMessage("Format file tidak didukung. Gunakan PDF/JPG/JPEG/PNG/WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File "${file.name}" terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimal ${MAX_FILE_SIZE_LABEL} per berkas. Kompres atau perkecil file Anda terlebih dahulu.`);
      event.target.value = "";
      return;
    }

    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  const validateStep = (currentStep: Step) => {
    if (currentStep === 1) {
      const fields: (keyof FormDataState)[] = [
        "namaLengkap", "namaPanggilan", "nik", "nisn",
        "tempatLahir", "tanggalLahir", "jenisKelamin",
        "anakKe", "totalSaudara", "statusAnak",
      ];
      if (!fields.every((f) => formData[f].trim() !== "")) {
        setErrorMessage("Mohon lengkapi semua data pada tahap ini sebelum lanjut.");
        return false;
      }

      // Nama minimal 2 karakter
      if (formData.namaLengkap.trim().length < 2) {
        setErrorMessage("Nama lengkap minimal 2 karakter.");
        return false;
      }

      // NIK 16 digit
      if (formData.nik.length !== 16) {
        setErrorMessage("NIK harus berjumlah 16 digit.");
        return false;
      }

      // NISN 10 digit
      if (formData.nisn.length !== 10) {
        setErrorMessage("NISN harus berjumlah 10 digit.");
        return false;
      }

      // Validasi tanggal lahir — harus tanggal valid dan usia 10-20 tahun
      const tgl = new Date(formData.tanggalLahir);
      if (isNaN(tgl.getTime())) {
        setErrorMessage("Tanggal lahir tidak valid.");
        return false;
      }
      const today = new Date();
      const usia = today.getFullYear() - tgl.getFullYear() -
        (today < new Date(today.getFullYear(), tgl.getMonth(), tgl.getDate()) ? 1 : 0);
      if (usia < 10 || usia > 20) {
        setErrorMessage("Usia calon santri harus antara 10 hingga 20 tahun.");
        return false;
      }

      // Validasi anak ke-X tidak boleh lebih besar dari total saudara
      const anakKe = parseInt(formData.anakKe);
      const totalSaudara = parseInt(formData.totalSaudara);
      if (anakKe > totalSaudara) {
        setErrorMessage("Anak ke-X tidak boleh lebih besar dari total saudara.");
        return false;
      }
      if (anakKe < 1 || totalSaudara < 1) {
        setErrorMessage("Anak ke dan total saudara minimal 1.");
        return false;
      }

      return true;
    }

    if (currentStep === 2) {
      // Base validation
      if (!formData.hubunganWali.trim()) {
        setErrorMessage("Mohon pilih hubungan wali dengan santri.");
        return false;
      }

      // Conditional validation based on hubunganWali
      if (formData.hubunganWali === "orang-tua-kandung") {
        // Validate original parent fields
        const fields: (keyof FormDataState)[] = [
          "namaAyah", "namaIbu", "pekerjaanAyah", "pekerjaanIbu",
          "noWhatsappOrtu", "relasiWhatsapp", "penghasilanOrtu", "emailOrtu",
        ];
        if (!fields.every((f) => formData[f].trim() !== "")) {
          setErrorMessage("Mohon lengkapi semua data pada tahap ini sebelum lanjut.");
          return false;
        }
        if (!/^\+?[0-9]{9,15}$/.test(formData.noWhatsappOrtu.trim())) {
          setErrorMessage("Nomor WhatsApp tidak valid. Gunakan format angka, contoh: 08123456789");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOrtu)) {
          setErrorMessage("Format email orang tua tidak valid.");
          return false;
        }
      } else {
        // Validate wali fields + WAJIB isi nama orang tua kandung
        const waliFields: (keyof FormDataState)[] = [
          "namaWali", "hubunganDenganSantri", "pekerjaanWali",
          "noWhatsappWali", "emailWali", "penghasilanOrtu",
          "namaAyahKandung", "namaIbuKandung", // WAJIB untuk non orang tua kandung
        ];
        if (!waliFields.every((f) => formData[f].trim() !== "")) {
          setErrorMessage("Mohon lengkapi semua data wali dan nama orang tua kandung sebelum lanjut.");
          return false;
        }
        if (!/^\+?[0-9]{9,15}$/.test(formData.noWhatsappWali.trim())) {
          setErrorMessage("Nomor WhatsApp wali tidak valid. Gunakan format angka, contoh: 08123456789");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailWali)) {
          setErrorMessage("Format email wali tidak valid.");
          return false;
        }
      }
      return true;
    }

    const fields: (keyof FormDataState)[] = [
      "asalSekolah", "alamatSekolah", "alamatDomisili", "provinsi", "kota",
    ];
    if (!fields.every((f) => formData[f].trim() !== "")) {
      setErrorMessage("Mohon lengkapi semua data pada tahap ini sebelum lanjut.");
      return false;
    }
    return FILE_FIELDS.every(({ key }) => files[key] !== null);
  };

  const handleNextStep = () => {
    setErrorMessage("");
    if (!validateStep(step)) {
      return;
    }
    if (step < 3) setStep((prev) => (prev + 1) as Step);
  };

  const handlePrevStep = () => {
    setErrorMessage("");
    if (step > 1) setStep((prev) => (prev - 1) as Step);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!validateStep(3)) {
      setErrorMessage("Lengkapi semua data dan berkas sebelum mengirim formulir.");
      return;
    }

    setIsSubmitting(true);

    try {
      // ── Upload files directly to Supabase from browser ──────────────────
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const registrationId = crypto.randomUUID();

      function safeName(name: string) {
        return name.replace(/[^a-zA-Z0-9._-]/g, "_");
      }

      async function uploadFile(file: File, prefix: string): Promise<string> {
        const ext = safeName(file.name.split(".").pop() ?? "bin");
        const path = `pendaftaran/${registrationId}/${prefix}-${Date.now()}.${ext}`;
        const { error } = await supabase.storage
          .from("dokumen-santri")
          .upload(path, file, { upsert: false });
        if (error) throw new Error(`Gagal upload ${prefix}: ${error.message}`);
        const { data } = supabase.storage.from("dokumen-santri").getPublicUrl(path);
        return data.publicUrl;
      }

      const [urlKk, urlAkta, urlIjazah, urlKtpOrtu, urlPasFoto] = await Promise.all([
        uploadFile(files.kkFile!, "kk"),
        uploadFile(files.aktaFile!, "akta"),
        uploadFile(files.ijazahFile!, "ijazah"),
        uploadFile(files.ktpOrtuFile!, "ktp-ortu"),
        uploadFile(files.pasFotoFile!, "pas-foto"),
      ]);

      let urlSuratSehat: string | null = null;
      if (files.suratSehatFile) {
        urlSuratSehat = await uploadFile(files.suratSehatFile, "surat-sehat");
      }

      // ── Send only text data + file URLs to server ───────────────────────
      const fd = new FormData();
      fd.append("registrationId", registrationId);
      fd.append("namaLengkap", formData.namaLengkap);
      fd.append("namaPanggilan", formData.namaPanggilan);
      fd.append("nik", formData.nik);
      fd.append("nisn", formData.nisn);
      fd.append("tempatLahir", formData.tempatLahir);
      fd.append("tanggalLahir", formData.tanggalLahir);
      fd.append("jenisKelamin", formData.jenisKelamin);
      fd.append("noWhatsappSantri", formData.noWhatsappSantri);
      fd.append("anakKe", formData.anakKe);
      fd.append("totalSaudara", formData.totalSaudara);
      fd.append("statusAnak", formData.statusAnak);
      fd.append("hubunganWali", formData.hubunganWali);
      if (formData.hubunganWali === "orang-tua-kandung") {
        fd.append("namaAyah", formData.namaAyah);
        fd.append("namaIbu", formData.namaIbu);
        fd.append("pekerjaanAyah", formData.pekerjaanAyah);
        fd.append("pekerjaanIbu", formData.pekerjaanIbu);
        fd.append("noWhatsappOrtu", formData.noWhatsappOrtu);
        fd.append("relasiWhatsapp", formData.relasiWhatsapp);
        fd.append("emailOrtu", formData.emailOrtu);
      } else {
        fd.append("namaWali", formData.namaWali);
        fd.append("hubunganDenganSantri", formData.hubunganDenganSantri);
        fd.append("pekerjaanWali", formData.pekerjaanWali);
        fd.append("noWhatsappWali", formData.noWhatsappWali);
        fd.append("emailWali", formData.emailWali);
        fd.append("namaAyahKandung", formData.namaAyahKandung);
        fd.append("namaIbuKandung", formData.namaIbuKandung);
      }
      fd.append("penghasilanOrtu", formData.penghasilanOrtu);
      fd.append("asalSekolah", formData.asalSekolah);
      fd.append("alamatSekolah", formData.alamatSekolah);
      fd.append("alamatDomisili", formData.alamatDomisili);
      fd.append("provinsi", formData.provinsi);
      fd.append("kota", formData.kota);
      // Send URLs instead of files
      fd.append("urlKk", urlKk);
      fd.append("urlAkta", urlAkta);
      fd.append("urlIjazah", urlIjazah);
      fd.append("urlKtpOrtu", urlKtpOrtu);
      fd.append("urlPasFoto", urlPasFoto);
      if (urlSuratSehat) fd.append("urlSuratSehat", urlSuratSehat);

      const response = await fetch("/api/submit-registration", {
        method: "POST",
        body: fd,
      });

      const result = await response.json() as { success: boolean; registrationId?: string; studentName?: string; error?: string };

      if (!result.success) {
        throw new Error(result.error ?? "Terjadi kesalahan saat mengirim pendaftaran.");
      }

      router.push(
        `/pendaftaran-santri-baru/sukses?id=${result.registrationId}&name=${encodeURIComponent(result.studentName ?? "")}`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim pendaftaran.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="sticky top-0 z-20 bg-gray-50/90 backdrop-blur border-b border-gray-200 pb-4 mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-700 mb-2">
          {STEP_TITLES.map((title, index) => {
            const activeStep = index + 1;
            const isActive = activeStep === step;
            const isDone = activeStep < step;
            return (
              <div
                key={title}
                className={`flex-1 text-center ${
                  isActive ? "text-blue-700" : isDone ? "text-emerald-600" : "text-gray-500"
                }`}
              >
                {activeStep}. {title}
              </div>
            );
          })}
        </div>
        <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white shadow-md border border-gray-100 p-6 sm:p-8"
      >
        {errorMessage ? (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {/* Step 1: Data Diri */}
        {step === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nama Lengkap" name="namaLengkap" value={formData.namaLengkap} onChange={handleInputChange} />
            <Input label="Nama Panggilan" name="namaPanggilan" value={formData.namaPanggilan} onChange={handleInputChange} />

            {/* 2. NIK - hanya angka, max 16 digit */}
            <div className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                NIK <span className="text-gray-400 font-normal">(16 digit)</span>
              </span>
              <input
                required
                type="text"
                inputMode="numeric"
                name="nik"
                value={formData.nik}
                onChange={handleNikChange}
                maxLength={16}
                placeholder="Masukkan 16 digit NIK"
                className={`w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.nik.length > 0 && formData.nik.length !== 16
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              <p className={`mt-1 text-xs ${
                formData.nik.length === 16 ? "text-emerald-600" :
                formData.nik.length > 0 ? "text-red-500" : "text-gray-400"
              }`}>
                {formData.nik.length}/16 digit
                {formData.nik.length > 0 && formData.nik.length !== 16 ? " - NIK harus berjumlah 16 digit" : ""}
              </p>
            </div>

            {/* 3. NISN - hanya angka, max 10 digit */}
            <div className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                NISN <span className="text-gray-400 font-normal">(10 digit)</span>
              </span>
              <input
                required
                type="text"
                inputMode="numeric"
                name="nisn"
                value={formData.nisn}
                onChange={handleNisnChange}
                maxLength={10}
                placeholder="Masukkan 10 digit NISN"
                className={`w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.nisn.length > 0 && formData.nisn.length !== 10
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              <p className={`mt-1 text-xs ${
                formData.nisn.length === 10 ? "text-emerald-600" :
                formData.nisn.length > 0 ? "text-red-500" : "text-gray-400"
              }`}>
                {formData.nisn.length}/10 digit
                {formData.nisn.length > 0 && formData.nisn.length !== 10 ? " - NISN harus berjumlah 10 digit" : ""}
              </p>
            </div>

            <Input label="Tempat Lahir" name="tempatLahir" value={formData.tempatLahir} onChange={handleInputChange} />
            <Input label="Tanggal Lahir" name="tanggalLahir" type="date" value={formData.tanggalLahir} onChange={handleInputChange} />
            <Select
              label="Jenis Kelamin"
              name="jenisKelamin"
              value={formData.jenisKelamin}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Pilih jenis kelamin" },
                { value: "L", label: "Laki-laki" },
                { value: "P", label: "Perempuan" },
              ]}
            />

            {/* Nomor WhatsApp Calon Santri - Opsional */}
            <div className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Nomor WhatsApp Calon Santri
                <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Opsional</span>
              </span>
              <input
                type="text"
                inputMode="numeric"
                name="noWhatsappSantri"
                value={formData.noWhatsappSantri}
                onChange={handleWhatsappChange}
                maxLength={15}
                placeholder="Contoh: 08123456789 (jika ada)"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                Isi jika calon santri memiliki nomor WhatsApp sendiri
              </p>
            </div>

            {/* Status dalam Keluarga */}
            <div className="block md:col-span-2">
              <p className="mb-3 text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">Status dalam Keluarga</p>
            </div>

            {/* Anak ke berapa */}
            <div className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Anak ke-
              </span>
              <input
                required
                type="number"
                inputMode="numeric"
                name="anakKe"
                value={formData.anakKe}
                onChange={handleInputChange}
                min="1"
                max="20"
                placeholder="Contoh: 1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Total saudara */}
            <div className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                dari ... Bersaudara
              </span>
              <input
                required
                type="number"
                inputMode="numeric"
                name="totalSaudara"
                value={formData.totalSaudara}
                onChange={handleInputChange}
                min="1"
                max="20"
                placeholder="Contoh: 3"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Anak */}
            <div className="block md:col-span-2">
              <Select
                label="Status Anak"
                name="statusAnak"
                value={formData.statusAnak}
                onChange={handleInputChange}
                options={STATUS_ANAK_OPTIONS}
              />
              <p className="mt-1 text-xs text-gray-400">
                Pilih status anak: Kandung, Angkat, Tiri, atau Asuh
              </p>
            </div>
          </div>
        ) : null}

        {/* Step 2: Data Wali & Orang Tua */}
        {step === 2 ? (
          <div className="space-y-6">
            {/* Hubungan Wali */}
            <div className="block">
              <Select
                label="Hubungan Wali dengan Santri"
                name="hubunganWali"
                value={formData.hubunganWali}
                onChange={handleInputChange}
                options={HUBUNGAN_WALI_OPTIONS}
              />
              <p className="mt-1 text-xs text-gray-400">
                Pilih orang tua kandung jika santri tinggal dengan orang tua kandung
              </p>
            </div>

            {/* Conditional rendering based on hubunganWali */}
            {formData.hubunganWali === "orang-tua-kandung" ? (
              /* Mode: Orang Tua Kandung */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nama Ayah" name="namaAyah" value={formData.namaAyah} onChange={handleInputChange} />
                <Input label="Nama Ibu" name="namaIbu" value={formData.namaIbu} onChange={handleInputChange} />
                <Input label="Pekerjaan Ayah" name="pekerjaanAyah" value={formData.pekerjaanAyah} onChange={handleInputChange} />
                <Input label="Pekerjaan Ibu" name="pekerjaanIbu" value={formData.pekerjaanIbu} onChange={handleInputChange} />
                <Input label="Nomor WhatsApp Orang Tua" name="noWhatsappOrtu" value={formData.noWhatsappOrtu} onChange={handleWhatsappChange} placeholder="Contoh: 08123456789" />
                <Select
                  label="Relasi Pemilik WhatsApp"
                  name="relasiWhatsapp"
                  value={formData.relasiWhatsapp}
                  onChange={handleInputChange}
                  options={[
                    { value: "", label: "Pilih relasi" },
                    { value: "Ayah", label: "Ayah" },
                    { value: "Ibu", label: "Ibu" },
                  ]}
                />
                {/* Email Orang Tua - WAJIB */}
                <div className="block md:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email Orang Tua
                  </span>
                  <input
                    required
                    type="email"
                    name="emailOrtu"
                    value={formData.emailOrtu}
                    onChange={handleInputChange}
                    placeholder="contoh@email.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Pastikan nomor WhatsApp dan email diisi dengan benar. Notifikasi pendaftaran dan pembayaran akan dikirim ke sini.
                  </p>
                </div>
                {/* Penghasilan orang tua per bulan */}
                <div className="block md:col-span-2">
                  <Select
                    label="Penghasilan Orang Tua per-bulan"
                    name="penghasilanOrtu"
                    value={formData.penghasilanOrtu}
                    onChange={handleInputChange}
                    options={PENGHASILAN_OPTIONS}
                  />
                </div>
              </div>
            ) : formData.hubunganWali ? (
              /* Mode: Wali (bukan orang tua kandung) */
              <div className="space-y-4">
                {/* Info Wali */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                  <strong>Informasi Wali/Penanggung Jawab</strong> — Isi data wali yang akan bertanggung jawab atas santri.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Nama Wali Lengkap" name="namaWali" value={formData.namaWali} onChange={handleInputChange} />
                  <Input label="Hubungan dengan Santri" name="hubunganDenganSantri" value={formData.hubunganDenganSantri} onChange={handleInputChange} placeholder="Contoh: Paman, Bibi, Kakek" />
                  <Input label="Pekerjaan Wali" name="pekerjaanWali" value={formData.pekerjaanWali} onChange={handleInputChange} />
                  <Input label="Nomor WhatsApp Wali" name="noWhatsappWali" value={formData.noWhatsappWali} onChange={handleWhatsappChange} placeholder="Contoh: 08123456789" />
                  
                  {/* Email Wali - WAJIB */}
                  <div className="block md:col-span-2">
                    <span className="mb-1.5 block text-sm font-medium text-gray-700">
                      Email Wali
                    </span>
                    <input
                      required
                      type="email"
                      name="emailWali"
                      value={formData.emailWali}
                      onChange={handleInputChange}
                      placeholder="contoh@email.com"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Notifikasi pendaftaran dan pembayaran akan dikirim ke nomor WhatsApp dan email ini.
                    </p>
                  </div>

                  {/* Penghasilan wali per bulan */}
                  <div className="block md:col-span-2">
                    <Select
                      label="Penghasilan Wali per-bulan"
                      name="penghasilanOrtu"
                      value={formData.penghasilanOrtu}
                      onChange={handleInputChange}
                      options={PENGHASILAN_OPTIONS}
                    />
                  </div>
                </div>

                {/* Data Orang Tua Kandung (WAJIB) */}
                <div className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="block">
                      <span className="mb-1.5 block text-sm font-medium text-gray-700">
                        Nama Ayah Kandung
                      </span>
                      <input
                        required
                        type="text"
                        name="namaAyahKandung"
                        value={formData.namaAyahKandung}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap ayah kandung"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="block">
                      <span className="mb-1.5 block text-sm font-medium text-gray-700">
                        Nama Ibu Kandung
                      </span>
                      <input
                        required
                        type="text"
                        name="namaIbuKandung"
                        value={formData.namaIbuKandung}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap ibu kandung"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Step 3: Pendidikan & Berkas */}
        {step === 3 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Asal Sekolah" name="asalSekolah" value={formData.asalSekolah} onChange={handleInputChange} />
              <Input label="Alamat Sekolah" name="alamatSekolah" value={formData.alamatSekolah} onChange={handleInputChange} />
              <Input label="Provinsi" name="provinsi" value={formData.provinsi} onChange={handleInputChange} />
              <Input label="Kota / Kabupaten" name="kota" value={formData.kota} onChange={handleInputChange} />
              <TextArea label="Alamat Domisili" name="alamatDomisili" value={formData.alamatDomisili} onChange={handleInputChange} />
            </div>
            {/* Payment disclaimer */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <strong>Biaya Pendaftaran: Rp 200.000</strong> — Link pembayaran akan dikirimkan oleh admin ke nomor WhatsApp/email Anda dalam 24 jam setelah pendaftaran berhasil.
            </div>
            {/* 1. Info batas ukuran file 2 MB */}
            <p className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2">
              Format yang diterima: PDF, JPG, PNG, WEBP. Maksimal <strong>{MAX_FILE_SIZE_LABEL}</strong> per berkas. Jika file Anda lebih besar, kompres dulu di <a href="https://smallpdf.com" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">smallpdf.com</a> (PDF) atau <a href="https://tinypng.com" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">tinypng.com</a> (gambar).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FILE_FIELDS.map((fileField) => (
                <FileInput
                  key={fileField.key}
                  label={fileField.label}
                  name={fileField.key}
                  onChange={handleFileChange}
                  selectedFileName={files[fileField.key]?.name ?? ""}
                />
              ))}
              {/* Surat Keterangan Sehat - opsional, sejajar dengan Pas Foto 3x4 */}
              <div className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  Surat Keterangan Sehat dari Dokter
                  <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Opsional</span>
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  name="suratSehatFile"
                  onChange={handleOptionalFileChange}
                  className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:font-semibold file:text-gray-600 hover:file:bg-gray-200"
                />
                {files.suratSehatFile ? (
                  <p className="mt-1 text-xs text-gray-500">File terpilih: {files.suratSehatFile.name}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-400">Tidak wajib — boleh dikosongkan</p>
                )}
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3 justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lsaquo; Sebelumnya
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Lanjut &rsaquo;
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? "Mengupload & Mengirim..." : "Kirim Pendaftaran"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
};

function Input({ label, name, value, onChange, type = "text", placeholder }: InputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}

type SelectProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
};

function Select({ label, name, value, onChange, options }: SelectProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      <select
        required
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

type TextAreaProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

function TextArea({ label, name, value, onChange }: TextAreaProps) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      <textarea
        required
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}

type FileInputProps = {
  label: string;
  name: RequiredFileKey;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedFileName: string;
};

function FileInput({ label, name, onChange, selectedFileName }: FileInputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      <input
        required
        type="file"
        accept={ACCEPTED_FILE_EXTENSIONS}
        name={name}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-blue-100 file:px-3 file:py-1.5 file:font-semibold file:text-blue-700 hover:file:bg-blue-200"
      />
      {selectedFileName ? (
        <p className="mt-1 text-xs text-gray-500">File terpilih: {selectedFileName}</p>
      ) : null}
    </label>
  );
}