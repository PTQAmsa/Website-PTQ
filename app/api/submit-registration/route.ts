import { NextRequest, NextResponse } from 'next/server';
import { BIAYA_PENDAFTARAN } from '@/lib/config/psb';
import { sendAdminRegistrationNotification } from '@/lib/services/email';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { generateOrderId } from '@/lib/utils/order-id';
import { createRateLimiter, getClientIP } from '@/lib/utils/rate-limit';

// ── Rate limiting ────────────────────────────────────────────────────────────
// 5 requests per 10 minutes per IP
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * File diunggah browser langsung ke bucket "dokumen-santri" di folder
 * pendaftaran/<registrationId>/. Tolak URL lain agar data tidak bisa diisi
 * link sembarang (phishing / pelacak) yang nanti dibuka admin.
 */
function isOwnDocumentUrl(value: string, registrationId: string): boolean {
  try {
    const url = new URL(value);
    const supabaseOrigin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').origin;
    return (
      url.origin === supabaseOrigin &&
      url.pathname.startsWith(
        `/storage/v1/object/public/dokumen-santri/pendaftaran/${registrationId}/`
      )
    );
  } catch {
    return false;
  }
}

// ── Required text fields ─────────────────────────────────────────────────────
const BASE_REQUIRED_FIELDS = [
  'namaLengkap', 'namaPanggilan', 'nik', 'nisn', 'tempatLahir',
  'tanggalLahir', 'jenisKelamin', 'anakKe', 'totalSaudara',
  'statusAnak', 'hubunganWali', 'penghasilanOrtu',
  'asalSekolah', 'alamatSekolah', 'alamatDomisili', 'provinsi', 'kota',
] as const;

const ORANG_TUA_KANDUNG_FIELDS = [
  'namaAyah', 'namaIbu', 'pekerjaanAyah', 'pekerjaanIbu',
  'noWhatsappOrtu', 'relasiWhatsapp', 'emailOrtu',
] as const;

const WALI_FIELDS = [
  'namaWali', 'hubunganDenganSantri', 'pekerjaanWali',
  'noWhatsappWali', 'emailWali', 'namaAyahKandung', 'namaIbuKandung',
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

  const hubunganWali = fields.hubunganWali;

  if (hubunganWali === 'orang-tua-kandung') {
    for (const field of ORANG_TUA_KANDUNG_FIELDS) {
      const value = formData.get(field);
      if (!value || typeof value !== 'string' || value.trim() === '') {
        return NextResponse.json(
          { success: false, error: `Field "${field}" wajib diisi.` },
          { status: 400 }
        );
      }
      fields[field] = value.trim();
    }
  } else {
    for (const field of WALI_FIELDS) {
      const value = formData.get(field);
      if (!value || typeof value !== 'string' || value.trim() === '') {
        return NextResponse.json(
          { success: false, error: `Field "${field}" wajib diisi.` },
          { status: 400 }
        );
      }
      fields[field] = value.trim();
    }
  }

  // Optional noWhatsappSantri
  const noWhatsappSantriValue = (() => {
    const v = formData.get('noWhatsappSantri');
    return v && typeof v === 'string' && v.trim() !== '' ? v.trim() : null;
  })();

  // Validations
  if (!/^\d{16}$/.test(fields.nik)) {
    return NextResponse.json({ success: false, error: 'NIK harus berjumlah 16 digit angka.' }, { status: 400 });
  }
  if (!/^\d{10}$/.test(fields.nisn)) {
    return NextResponse.json({ success: false, error: 'NISN harus berjumlah 10 digit angka.' }, { status: 400 });
  }
  if (fields.namaLengkap.length < 2) {
    return NextResponse.json({ success: false, error: 'Nama lengkap minimal 2 karakter.' }, { status: 400 });
  }

  const anakKe = parseInt(fields.anakKe);
  const totalSaudara = parseInt(fields.totalSaudara);
  if (isNaN(anakKe) || isNaN(totalSaudara) || anakKe < 1 || totalSaudara < 1) {
    return NextResponse.json({ success: false, error: 'Anak ke dan total saudara harus angka minimal 1.' }, { status: 400 });
  }
  if (anakKe > totalSaudara) {
    return NextResponse.json({ success: false, error: 'Anak ke tidak boleh lebih besar dari total saudara.' }, { status: 400 });
  }

  let emailValue: string;
  let whatsappValue: string;

  if (hubunganWali === 'orang-tua-kandung') {
    emailValue = fields.emailOrtu.toLowerCase();
    whatsappValue = fields.noWhatsappOrtu;
    if (!/^\+?[0-9]{9,15}$/.test(whatsappValue)) {
      return NextResponse.json({ success: false, error: 'Nomor WhatsApp orang tua tidak valid.' }, { status: 400 });
    }
  } else {
    emailValue = fields.emailWali.toLowerCase();
    whatsappValue = fields.noWhatsappWali;
    if (!/^\+?[0-9]{9,15}$/.test(whatsappValue)) {
      return NextResponse.json({ success: false, error: 'Nomor WhatsApp wali tidak valid.' }, { status: 400 });
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    return NextResponse.json({ success: false, error: 'Format email tidak valid.' }, { status: 400 });
  }

  // ── Use registrationId from client (files already uploaded with this ID) ──
  const registrationId = formData.get('registrationId');
  if (typeof registrationId !== 'string' || !UUID_PATTERN.test(registrationId)) {
    return NextResponse.json(
      { success: false, error: 'ID pendaftaran tidak valid. Muat ulang halaman lalu coba lagi.' },
      { status: 400 }
    );
  }

  // ── Validate file URLs (files uploaded from client browser to Supabase) ───
  const urlKk = formData.get('urlKk');
  const urlAkta = formData.get('urlAkta');
  const urlIjazah = formData.get('urlIjazah');
  const urlKtpOrtu = formData.get('urlKtpOrtu');
  const urlPasFoto = formData.get('urlPasFoto');
  const urlSuratSehat = formData.get('urlSuratSehat');

  for (const [label, url] of [
    ['Kartu Keluarga', urlKk],
    ['Akta Kelahiran', urlAkta],
    ['Ijazah', urlIjazah],
    ['KTP Orang Tua', urlKtpOrtu],
    ['Pas Foto', urlPasFoto],
  ]) {
    if (!url || typeof url !== 'string' || !isOwnDocumentUrl(url, registrationId)) {
      return NextResponse.json(
        { success: false, error: `URL file ${label} tidak valid. Pastikan upload berhasil.` },
        { status: 400 }
      );
    }
  }

  if (urlSuratSehat && (typeof urlSuratSehat !== 'string' || !isOwnDocumentUrl(urlSuratSehat, registrationId))) {
    return NextResponse.json(
      { success: false, error: 'URL file Surat Keterangan Sehat tidak valid. Pastikan upload berhasil.' },
      { status: 400 }
    );
  }

  const orderId = generateOrderId();

  // ── Insert registration record ─────────────────────────────────────────────
  const supabase = getSupabaseAdmin();

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
    anak_ke: anakKe,
    total_saudara: totalSaudara,
    status_anak: fields.statusAnak,
    hubungan_wali: hubunganWali,
    penghasilan_ortu: fields.penghasilanOrtu,
    asal_sekolah: fields.asalSekolah,
    alamat_sekolah: fields.alamatSekolah,
    alamat_domisili: fields.alamatDomisili,
    provinsi: fields.provinsi,
    kota: fields.kota,
    url_kk: urlKk,
    url_akta: urlAkta,
    url_ijazah: urlIjazah,
    url_ktp_ortu: urlKtpOrtu,
    url_pas_foto: urlPasFoto,
    url_surat_sehat: typeof urlSuratSehat === 'string' && urlSuratSehat ? urlSuratSehat : null,
    payment_status: 'pending',
    payment_amount: BIAYA_PENDAFTARAN,
    order_id: orderId,
  };

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
    // Detail error database hanya untuk log server, jangan dikirim ke publik
    console.error('[submit-registration] Insert error:', insertError);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menyimpan data pendaftaran. Silakan coba lagi atau hubungi admin via WhatsApp.',
      },
      { status: 500 }
    );
  }

  // ── Send admin notification ────────────────────────────────────────────────
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
}
