import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateOrderId } from '@/lib/utils/order-id';
import { sendAdminRegistrationNotification } from '@/lib/services/email';

// ── Rate limiting ────────────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLogs = new Map<string, number[]>();

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = requestLogs.get(key) ?? [];
  const active = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (active.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLogs.set(key, active);
    return true;
  }
  active.push(now);
  requestLogs.set(key, active);
  return false;
}

// ── File validation ──────────────────────────────────────────────────────────
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
const ACCEPTED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

// ── Supabase server client ───────────────────────────────────────────────────
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key);
}

// ── Required text fields ─────────────────────────────────────────────────────
// Base required fields (always needed)
const BASE_REQUIRED_FIELDS = [
  'namaLengkap',
  'namaPanggilan',
  'nik',
  'nisn',
  'tempatLahir',
  'tanggalLahir',
  'jenisKelamin',
  'anakKe',
  'totalSaudara',
  'statusAnak',
  'hubunganWali',
  'penghasilanOrtu',
  'asalSekolah',
  'alamatSekolah',
  'alamatDomisili',
  'provinsi',
  'kota',
] as const;

// Conditional fields for orang tua kandung
const ORANG_TUA_KANDUNG_FIELDS = [
  'namaAyah',
  'namaIbu',
  'pekerjaanAyah',
  'pekerjaanIbu',
  'noWhatsappOrtu',
  'relasiWhatsapp',
  'emailOrtu',
] as const;

// Conditional fields for wali (bukan orang tua kandung)
const WALI_FIELDS = [
  'namaWali',
  'hubunganDenganSantri',
  'pekerjaanWali',
  'noWhatsappWali',
  'emailWali',
  'namaAyahKandung',
  'namaIbuKandung',
] as const;

const REQUIRED_FILE_FIELDS = [
  { key: 'kkFile', label: 'Kartu Keluarga', prefix: 'kk' },
  { key: 'aktaFile', label: 'Akta Kelahiran', prefix: 'akta' },
  { key: 'ijazahFile', label: 'Ijazah', prefix: 'ijazah' },
  { key: 'ktpOrtuFile', label: 'KTP Orang Tua', prefix: 'ktp-ortu' },
  { key: 'pasFotoFile', label: 'Pas Foto 3x4', prefix: 'pas-foto' },
] as const;

// ── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = getClientIP(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: 'Terlalu banyak permintaan. Coba lagi dalam beberapa menit.' },
      { status: 429 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Format request tidak valid.' },
      { status: 400 }
    );
  }

  // ── Validate required text fields ──────────────────────────────────────────
  const fields: Record<string, string> = {};
  
  // Validate base required fields
  for (const field of BASE_REQUIRED_FIELDS) {
    const value = formData.get(field);
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return NextResponse.json(
        { success: false, error: `Field "${field}" wajib diisi.` },
        { status: 400 }
      );
    }
    fields[field] = value.trim();
  }

  // Determine which conditional fields to validate based on hubunganWali
  const hubunganWali = fields.hubunganWali;
  
  if (hubunganWali === 'orang-tua-kandung') {
    // Validate orang tua kandung fields
    for (const field of ORANG_TUA_KANDUNG_FIELDS) {
      const value = formData.get(field);
      if (!value || typeof value !== 'string' || value.trim() === '') {
        return NextResponse.json(
          { success: false, error: `Field "${field}" wajib diisi untuk orang tua kandung.` },
          { status: 400 }
        );
      }
      fields[field] = value.trim();
    }
  } else {
    // Validate wali fields
    for (const field of WALI_FIELDS) {
      const value = formData.get(field);
      if (!value || typeof value !== 'string' || value.trim() === '') {
        return NextResponse.json(
          { success: false, error: `Field "${field}" wajib diisi untuk data wali.` },
          { status: 400 }
        );
      }
      fields[field] = value.trim();
    }
  }

  // Optional field: noWhatsappSantri
  const noWhatsappSantri = formData.get('noWhatsappSantri');
  const noWhatsappSantriValue =
    noWhatsappSantri && typeof noWhatsappSantri === 'string' && noWhatsappSantri.trim() !== ''
      ? noWhatsappSantri.trim()
      : null;

  // NIK must be exactly 16 digits
  if (!/^\d{16}$/.test(fields.nik)) {
    return NextResponse.json(
      { success: false, error: 'NIK harus berjumlah 16 digit angka.' },
      { status: 400 }
    );
  }

  // NISN must be exactly 10 digits
  if (!/^\d{10}$/.test(fields.nisn)) {
    return NextResponse.json(
      { success: false, error: 'NISN harus berjumlah 10 digit angka.' },
      { status: 400 }
    );
  }

  // Nama minimal 2 karakter
  if (fields.namaLengkap.length < 2) {
    return NextResponse.json(
      { success: false, error: 'Nama lengkap minimal 2 karakter.' },
      { status: 400 }
    );
  }

  // Validate anak_ke and total_saudara
  const anakKe = parseInt(fields.anakKe);
  const totalSaudara = parseInt(fields.totalSaudara);
  if (isNaN(anakKe) || isNaN(totalSaudara) || anakKe < 1 || totalSaudara < 1) {
    return NextResponse.json(
      { success: false, error: 'Anak ke dan total saudara harus angka minimal 1.' },
      { status: 400 }
    );
  }
  if (anakKe > totalSaudara) {
    return NextResponse.json(
      { success: false, error: 'Anak ke tidak boleh lebih besar dari total saudara.' },
      { status: 400 }
    );
  }

  // Validate WhatsApp number based on hubunganWali
  if (hubunganWali === 'orang-tua-kandung') {
    if (!/^\+?[0-9]{9,15}$/.test(fields.noWhatsappOrtu)) {
      return NextResponse.json(
        { success: false, error: 'Nomor WhatsApp orang tua tidak valid. Gunakan format angka 9-15 digit.' },
        { status: 400 }
      );
    }
  } else {
    if (!/^\+?[0-9]{9,15}$/.test(fields.noWhatsappWali)) {
      return NextResponse.json(
        { success: false, error: 'Nomor WhatsApp wali tidak valid. Gunakan format angka 9-15 digit.' },
        { status: 400 }
      );
    }
  }

  // Validate optional noWhatsappSantri if provided
  if (noWhatsappSantriValue && !/^\+?[0-9]{9,15}$/.test(noWhatsappSantriValue)) {
    return NextResponse.json(
      { success: false, error: 'Nomor WhatsApp santri tidak valid. Gunakan format angka 9-15 digit.' },
      { status: 400 }
    );
  }

  // Tanggal lahir harus format valid
  const tglLahir = new Date(fields.tanggalLahir);
  if (isNaN(tglLahir.getTime())) {
    return NextResponse.json(
      { success: false, error: 'Format tanggal lahir tidak valid.' },
      { status: 400 }
    );
  }

  // Jenis kelamin harus L atau P
  if (!['L', 'P'].includes(fields.jenisKelamin)) {
    return NextResponse.json(
      { success: false, error: 'Jenis kelamin tidak valid.' },
      { status: 400 }
    );
  }

  // Validate email based on hubunganWali
  let emailValue: string | null = null;
  let whatsappValue: string = '';
  
  if (hubunganWali === 'orang-tua-kandung') {
    // Email orang tua is required
    emailValue = fields.emailOrtu.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      return NextResponse.json(
        { success: false, error: 'Format email orang tua tidak valid.' },
        { status: 400 }
      );
    }
    whatsappValue = fields.noWhatsappOrtu;
  } else {
    // Email wali is required
    emailValue = fields.emailWali.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      return NextResponse.json(
        { success: false, error: 'Format email wali tidak valid.' },
        { status: 400 }
      );
    }
    whatsappValue = fields.noWhatsappWali;
  }

  // ── Validate required files ────────────────────────────────────────────────
  const fileMap: Record<string, File> = {};
  for (const { key, label } of REQUIRED_FILE_FIELDS) {
    const file = formData.get(key);
    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { success: false, error: `File "${label}" wajib diunggah.` },
        { status: 400 }
      );
    }
    if (!ACCEPTED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: `Format file "${label}" tidak didukung. Gunakan PDF/JPG/PNG/WEBP.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `Ukuran file "${label}" melebihi 4 MB.` },
        { status: 400 }
      );
    }
    fileMap[key] = file;
  }

  // Optional surat sehat
  const suratSehatFile = formData.get('suratSehatFile');
  const suratSehat =
    suratSehatFile instanceof File && suratSehatFile.size > 0 ? suratSehatFile : null;

  if (suratSehat) {
    if (!ACCEPTED_MIME_TYPES.has(suratSehat.type)) {
      return NextResponse.json(
        { success: false, error: 'Format Surat Keterangan Sehat tidak didukung.' },
        { status: 400 }
      );
    }
    if (suratSehat.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Ukuran Surat Keterangan Sehat melebihi 4 MB.' },
        { status: 400 }
      );
    }
  }

  // ── Upload files to Supabase Storage ──────────────────────────────────────
  const supabase = getSupabase();
  const registrationId = crypto.randomUUID();
  const orderId = generateOrderId();
  const uploadedPaths: string[] = [];

  try {
    const uploadedUrls: Record<string, string> = {};

    for (const { key, label, prefix } of REQUIRED_FILE_FIELDS) {
      const file = fileMap[key];
      const ext = safeFileName(file.name.split('.').pop() ?? 'bin');
      const path = `pendaftaran/${registrationId}/${prefix}-${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from('dokumen-santri')
        .upload(path, file, { upsert: false });

      if (error) {
        throw new Error(`Gagal upload ${label}: ${error.message}`);
      }

      uploadedPaths.push(path);
      const { data: urlData } = supabase.storage
        .from('dokumen-santri')
        .getPublicUrl(path);
      uploadedUrls[key] = urlData.publicUrl;
    }

    // Upload optional surat sehat
    let urlSuratSehat: string | null = null;
    if (suratSehat) {
      const ext = safeFileName(suratSehat.name.split('.').pop() ?? 'bin');
      const path = `pendaftaran/${registrationId}/surat-sehat-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from('dokumen-santri')
        .upload(path, suratSehat, { upsert: false });
      if (error) throw new Error(`Gagal upload Surat Keterangan Sehat: ${error.message}`);
      uploadedPaths.push(path);
      const { data: urlData } = supabase.storage.from('dokumen-santri').getPublicUrl(path);
      urlSuratSehat = urlData.publicUrl;
    }

    // ── Insert registration record ───────────────────────────────────────────
    const insertData: Record<string, unknown> = {
      id: registrationId,
      nama_lengkap: fields.namaLengkap,
      nama_panggilan: fields.namaPanggilan,
      nik: fields.nik,
      nisn: fields.nisn,
      tempat_lahir: fields.tempatLahir,
      tanggal_lahir: fields.tanggalLahir,
      jenis_kelamin: fields.jenisKelamin,
      no_whatsapp_santri: noWhatsappSantriValue,
      // Status dalam keluarga
      anak_ke: anakKe,
      total_saudara: totalSaudara,
      status_anak: fields.statusAnak,
      // Data wali
      hubungan_wali: hubunganWali,
      penghasilan_ortu: fields.penghasilanOrtu,
      // Data pendidikan
      asal_sekolah: fields.asalSekolah,
      alamat_sekolah: fields.alamatSekolah,
      alamat_domisili: fields.alamatDomisili,
      provinsi: fields.provinsi,
      kota: fields.kota,
      // File URLs
      url_kk: uploadedUrls.kkFile,
      url_akta: uploadedUrls.aktaFile,
      url_ijazah: uploadedUrls.ijazahFile,
      url_ktp_ortu: uploadedUrls.ktpOrtuFile,
      url_pas_foto: uploadedUrls.pasFotoFile,
      url_surat_sehat: urlSuratSehat,
      // Payment info
      payment_status: 'pending',
      payment_amount: 200000,
      order_id: orderId,
    };

    // Add conditional fields based on hubunganWali
    if (hubunganWali === 'orang-tua-kandung') {
      insertData.nama_ayah = fields.namaAyah;
      insertData.nama_ibu = fields.namaIbu;
      insertData.pekerjaan_ayah = fields.pekerjaanAyah;
      insertData.pekerjaan_ibu = fields.pekerjaanIbu;
      insertData.no_whatsapp_ortu = fields.noWhatsappOrtu;
      insertData.relasi_whatsapp = fields.relasiWhatsapp;
      insertData.email_ortu = emailValue;
    } else {
      insertData.nama_wali = fields.namaWali;
      insertData.hubungan_dengan_santri = fields.hubunganDenganSantri;
      insertData.pekerjaan_wali = fields.pekerjaanWali;
      insertData.no_whatsapp_wali = fields.noWhatsappWali;
      insertData.email_wali = emailValue;
      insertData.nama_ayah_kandung = fields.namaAyahKandung;
      insertData.nama_ibu_kandung = fields.namaIbuKandung;
    }

    const { error: insertError } = await supabase.from('pendaftaran_santri').insert([insertData]);

    if (insertError) {
      // Rollback uploaded files
      await supabase.storage.from('dokumen-santri').remove(uploadedPaths);
      throw new Error(`Gagal menyimpan data pendaftaran: ${insertError.message}`);
    }

    // ── Send admin notification (await untuk pastikan terkirim) ─────────────
    await sendAdminRegistrationNotification({
      id: registrationId,
      nama_lengkap: fields.namaLengkap,
      no_whatsapp_ortu: whatsappValue,
      email_ortu: emailValue,
      order_id: orderId,
      created_at: new Date().toISOString(),
    }).catch((err) => console.error('[submit-registration] Admin notification failed:', err));

    return NextResponse.json({
      success: true,
      registrationId,
      orderId,
      studentName: fields.namaLengkap,
      parentPhone: whatsappValue,
      parentEmail: emailValue,
    });
  } catch (err) {
    // Rollback any uploaded files on error
    if (uploadedPaths.length > 0) {
      await supabase.storage
        .from('dokumen-santri')
        .remove(uploadedPaths)
        .catch((e) => console.error('[submit-registration] Rollback failed:', e));
    }

    const message =
      err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses pendaftaran.';
    console.error('[submit-registration] Error:', err);

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
