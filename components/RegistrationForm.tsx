"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { supabase } from "@/supabaseClient";

type Step = 1 | 2 | 3;
type RequiredFileKey = "kkFile" | "aktaFile" | "ijazahFile" | "ktpOrtuFile";

type FormDataState = {
  namaLengkap: string;
  namaPanggilan: string;
  nik: string;
  nisn: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  namaAyah: string;
  namaIbu: string;
  pekerjaanAyah: string;
  pekerjaanIbu: string;
  noWhatsappOrtu: string;
  relasiWhatsapp: string;
  penghasilanOrtu: string;
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
};

const INITIAL_FORM_DATA: FormDataState = {
  namaLengkap: "",
  namaPanggilan: "",
  nik: "",
  nisn: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  namaAyah: "",
  namaIbu: "",
  pekerjaanAyah: "",
  pekerjaanIbu: "",
  noWhatsappOrtu: "",
  relasiWhatsapp: "",
  penghasilanOrtu: "",
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
};

const STEP_TITLES = ["Data Diri", "Data Orang Tua", "Pendidikan & Berkas"];
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;
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

  const progressPercent = useMemo(() => (step / 3) * 100, [step]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setErrorMessage("Ukuran file maksimal 3MB per berkas.");
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
      ];
      return fields.every((f) => formData[f].trim() !== "");
    }

    if (currentStep === 2) {
      const fields: (keyof FormDataState)[] = [
        "namaAyah", "namaIbu", "pekerjaanAyah", "pekerjaanIbu",
        "noWhatsappOrtu", "relasiWhatsapp", "penghasilanOrtu",
      ];
      return fields.every((f) => formData[f].trim() !== "");
    }

    const fields: (keyof FormDataState)[] = [
      "asalSekolah", "alamatSekolah", "alamatDomisili", "provinsi", "kota",
    ];
    if (!fields.every((f) => formData[f].trim() !== "")) return false;
    return FILE_FIELDS.every(({ key }) => files[key] !== null);
  };

  const handleNextStep = () => {
    setErrorMessage("");
    if (!validateStep(step)) {
      setErrorMessage("Mohon lengkapi semua data pada tahap ini sebelum lanjut.");
      return;
    }
    if (step < 3) setStep((prev) => (prev + 1) as Step);
  };

  const handlePrevStep = () => {
    setErrorMessage("");
    if (step > 1) setStep((prev) => (prev - 1) as Step);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!validateStep(3)) {
      setErrorMessage("Lengkapi semua data dan berkas sebelum mengirim formulir.");
      return;
    }

    setIsSubmitting(true);
    const uploadedFilePaths: string[] = [];

    try {
      const uploadedUrls: Record<RequiredFileKey, string> = {
        kkFile: "", aktaFile: "", ijazahFile: "", ktpOrtuFile: "",
      };

      const registrationId = crypto.randomUUID();

      for (const fileField of FILE_FIELDS) {
        const currentFile = files[fileField.key];
        if (!currentFile) throw new Error(`File ${fileField.label} belum dipilih.`);
        if (!ACCEPTED_FILE_TYPES.includes(currentFile.type))
          throw new Error(`Format ${fileField.label} tidak valid.`);
        if (currentFile.size > MAX_FILE_SIZE_BYTES)
          throw new Error(`Ukuran ${fileField.label} melebihi 3MB.`);

        const extension = currentFile.name.split(".").pop() || "bin";
        const filePath = `pendaftaran/${registrationId}/${fileField.storagePrefix}-${Date.now()}.${safeFileName(extension)}`;

        const { error: uploadError } = await supabase.storage
          .from("dokumen-santri")
          .upload(filePath, currentFile, { upsert: false });

        if (uploadError) throw new Error(`Gagal upload ${fileField.label}: ${uploadError.message}`);
        uploadedFilePaths.push(filePath);

        const { data: publicUrlData } = supabase.storage
          .from("dokumen-santri")
          .getPublicUrl(filePath);

        uploadedUrls[fileField.key] = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("pendaftaran_santri").insert([{
        nama_lengkap: formData.namaLengkap,
        nama_panggilan: formData.namaPanggilan,
        nik: formData.nik,
        nisn: formData.nisn,
        tempat_lahir: formData.tempatLahir,
        tanggal_lahir: formData.tanggalLahir,
        jenis_kelamin: formData.jenisKelamin,
        nama_ayah: formData.namaAyah,
        nama_ibu: formData.namaIbu,
        pekerjaan_ayah: formData.pekerjaanAyah,
        pekerjaan_ibu: formData.pekerjaanIbu,
        no_whatsapp_ortu: formData.noWhatsappOrtu,
        relasi_whatsapp: formData.relasiWhatsapp,
        penghasilan_ortu: formData.penghasilanOrtu,
        asal_sekolah: formData.asalSekolah,
        alamat_sekolah: formData.alamatSekolah,
        alamat_domisili: formData.alamatDomisili,
        provinsi: formData.provinsi,
        kota: formData.kota,
        url_kk: uploadedUrls.kkFile,
        url_akta: uploadedUrls.aktaFile,
        url_ijazah: uploadedUrls.ijazahFile,
        url_ktp_ortu: uploadedUrls.ktpOrtuFile,
      }]);

      if (insertError) throw new Error(`Gagal menyimpan data: ${insertError.message}`);

      alert("Pendaftaran berhasil dikirim. Terima kasih!");
      setFormData(INITIAL_FORM_DATA);
      setFiles(INITIAL_FILES);
      setStep(1);
    } catch (error) {
      if (uploadedFilePaths.length > 0) {
        await supabase.storage.from("dokumen-santri").remove(uploadedFilePaths);
      }
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim pendaftaran.";
      setErrorMessage(message);
      alert(message);
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
            <Input label="NIK" name="nik" value={formData.nik} onChange={handleInputChange} />
            <Input label="NISN" name="nisn" value={formData.nisn} onChange={handleInputChange} />
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
          </div>
        ) : null}

        {/* Step 2: Data Orang Tua */}
        {step === 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nama Ayah" name="namaAyah" value={formData.namaAyah} onChange={handleInputChange} />
            <Input label="Nama Ibu" name="namaIbu" value={formData.namaIbu} onChange={handleInputChange} />
            <Input label="Pekerjaan Ayah" name="pekerjaanAyah" value={formData.pekerjaanAyah} onChange={handleInputChange} />
            <Input label="Pekerjaan Ibu" name="pekerjaanIbu" value={formData.pekerjaanIbu} onChange={handleInputChange} />
            <Input label="Nomor WhatsApp Orang Tua" name="noWhatsappOrtu" value={formData.noWhatsappOrtu} onChange={handleInputChange} />
            <Select
              label="Relasi Pemilik WhatsApp"
              name="relasiWhatsapp"
              value={formData.relasiWhatsapp}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Pilih relasi" },
                { value: "Ayah", label: "Ayah" },
                { value: "Ibu", label: "Ibu" },
                { value: "Wali", label: "Wali" },
              ]}
            />
            <Input label="Penghasilan Orang Tua" name="penghasilanOrtu" value={formData.penghasilanOrtu} onChange={handleInputChange} />
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
              Sebelumnya
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
              Lanjut
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
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
};

function Input({ label, name, value, onChange, type = "text" }: InputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
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
