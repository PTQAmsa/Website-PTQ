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
const REQUIRED_TEXT_FIELDS = [
  'namaLengkap',
  'namaPanggilan',
  'nik',
  'nisn',
  'tempatLahir',
  'tanggalLahir',
  'jenisKelamin',
  'namaAyah',
  'namaIbu',
  'pekerjaanAyah',
  'pekerjaanIbu',
  'noWhatsappOrtu',
  'relasiWhatsapp',
  'penghasilanOrtu',
  'asalSekolah',
  'alamatSekolah',
  'alamatDomisili',
  'provinsi',
  'kota',
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
  for (const field of REQUIRED_TEXT_FIELDS) {
    const value = formData.get(field);
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return NextResponse.json(
        { success: false, error: `Field "${field}" wajib diisi.` },
        { status: 400 }
      );
    }
    fields[field] = value.trim();
  }

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

  // Nomor WhatsApp harus format valid untuk Midtrans
  if (!/^\+?[0-9]{9,15}$/.test(fields.noWhatsappOrtu)) {
    return NextResponse.json(
      { success: false, error: 'Nomor WhatsApp tidak valid. Gunakan format angka 9-15 digit.' },
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

  // Optional email_ortu — validate format if provided
  const emailOrtu = formData.get('emailOrtu');
  const emailOrtuValue =
    emailOrtu && typeof emailOrtu === 'string' && emailOrtu.trim() !== ''
      ? emailOrtu.trim().toLowerCase()
      : null;

  if (emailOrtuValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrtuValue)) {
    return NextResponse.json(
      { success: false, error: 'Format email orang tua tidak valid.' },
      { status: 400 }
    );
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
    const { error: insertError } = await supabase.from('pendaftaran_santri').insert([
      {
        id: registrationId,
        nama_lengkap: fields.namaLengkap,
        nama_panggilan: fields.namaPanggilan,
        nik: fields.nik,
        nisn: fields.nisn,
        tempat_lahir: fields.tempatLahir,
        tanggal_lahir: fields.tanggalLahir,
        jenis_kelamin: fields.jenisKelamin,
        nama_ayah: fields.namaAyah,
        nama_ibu: fields.namaIbu,
        pekerjaan_ayah: fields.pekerjaanAyah,
        pekerjaan_ibu: fields.pekerjaanIbu,
        no_whatsapp_ortu: fields.noWhatsappOrtu,
        relasi_whatsapp: fields.relasiWhatsapp,
        penghasilan_ortu: fields.penghasilanOrtu,
        asal_sekolah: fields.asalSekolah,
        alamat_sekolah: fields.alamatSekolah,
        alamat_domisili: fields.alamatDomisili,
        provinsi: fields.provinsi,
        kota: fields.kota,
        url_kk: uploadedUrls.kkFile,
        url_akta: uploadedUrls.aktaFile,
        url_ijazah: uploadedUrls.ijazahFile,
        url_ktp_ortu: uploadedUrls.ktpOrtuFile,
        url_pas_foto: uploadedUrls.pasFotoFile,
        url_surat_sehat: urlSuratSehat,
        email_ortu: emailOrtuValue,
        payment_status: 'pending',
        payment_amount: 200000,
        order_id: orderId,
      },
    ]);

    if (insertError) {
      // Rollback uploaded files
      await supabase.storage.from('dokumen-santri').remove(uploadedPaths);
      throw new Error(`Gagal menyimpan data pendaftaran: ${insertError.message}`);
    }

    // ── Send admin notification (await untuk pastikan terkirim) ─────────────
    await sendAdminRegistrationNotification({
      id: registrationId,
      nama_lengkap: fields.namaLengkap,
      no_whatsapp_ortu: fields.noWhatsappOrtu,
      email_ortu: emailOrtuValue,
      order_id: orderId,
      created_at: new Date().toISOString(),
    }).catch((err) => console.error('[submit-registration] Admin notification failed:', err));

    return NextResponse.json({
      success: true,
      registrationId,
      orderId,
      studentName: fields.namaLengkap,
      parentPhone: fields.noWhatsappOrtu,
      parentEmail: emailOrtuValue ?? undefined,
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
