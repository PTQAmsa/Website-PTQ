import { NextRequest, NextResponse } from 'next/server';
import { catatLog } from '@/lib/psb/log';
import {
  BIAYA_PENDAFTARAN,
  LABEL_AWAL_TAHUN_AJARAN,
  USIA_MAX,
  USIA_MIN,
  hitungUsia,
} from '@/lib/config/psb';
import {
  HUBUNGAN_KONTAK,
  JENIS_KELAMIN,
  JENIS_PENDAFTARAN,
  LULUSAN,
  POLA_EMAIL,
  POLA_WHATSAPP,
  SUMBER_INFO,
  SUMBER_INFO_LAINNYA,
  isOpsi,
} from '@/lib/psb/pilihan';
import { sendAdminRegistrationNotification, sendWaliRegistrationConfirmation } from '@/lib/services/email';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { generateOrderId } from '@/lib/utils/order-id';
import { createRateLimiter, getClientIP } from '@/lib/utils/rate-limit';

/**
 * Pendaftaran tahap 1 (form singkat). Data lengkap & dokumen menyusul lewat
 * /api/lengkapi-pendaftaran setelah admin mengirim link pribadi ke wali.
 */

// 5 requests per 10 minutes per IP
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

function bad(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

/** Ambil teks dari body JSON: trim + batasi panjang; '' bila bukan string. */
function text(body: Record<string, unknown>, key: string, maxLength = 150): string {
  const value = body[key];
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function POST(req: NextRequest) {
  if (isRateLimited(getClientIP(req))) {
    return bad('Terlalu banyak permintaan. Coba lagi dalam beberapa menit.', 429);
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== 'object') throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return bad('Format request tidak valid.');
  }

  // Bot pengisi semua kolom → pura-pura berhasil, jangan simpan
  if (text(body, 'website')) {
    return NextResponse.json({ success: true, registrationId: crypto.randomUUID(), studentName: '' });
  }

  const f = {
    jenisPendaftaran: text(body, 'jenisPendaftaran'),
    lulusan: text(body, 'lulusan'),
    namaLengkap: text(body, 'namaLengkap', 100),
    jenisKelamin: text(body, 'jenisKelamin'),
    tanggalLahir: text(body, 'tanggalLahir', 10),
    asalSekolah: text(body, 'asalSekolah'),
    namaKontak: text(body, 'namaKontak', 100),
    hubunganKontak: text(body, 'hubunganKontak'),
    hubunganLainnya: text(body, 'hubunganLainnya', 100),
    noWhatsapp: text(body, 'noWhatsapp', 15),
    email: text(body, 'email', 100).toLowerCase(),
    kota: text(body, 'kota', 100),
    sumberInfo: text(body, 'sumberInfo'),
    sumberInfoLainnya: text(body, 'sumberInfoLainnya'),
  };

  if (!isOpsi(JENIS_PENDAFTARAN, f.jenisPendaftaran)) return bad('Pilih jenis pendaftaran.');
  if (!isOpsi(LULUSAN, f.lulusan)) return bad('Pilih lulusan calon santri.');
  if (f.namaLengkap.length < 2) return bad('Nama lengkap minimal 2 karakter.');
  if (!isOpsi(JENIS_KELAMIN, f.jenisKelamin)) return bad('Pilih jenis kelamin.');
  if (!f.asalSekolah) return bad('Asal sekolah wajib diisi.');
  if (f.namaKontak.length < 2) return bad('Nama orang tua/wali wajib diisi.');
  if (!isOpsi(HUBUNGAN_KONTAK, f.hubunganKontak)) return bad('Pilih hubungan dengan calon santri.');
  if (f.hubunganKontak === 'lainnya' && !f.hubunganLainnya) return bad('Sebutkan hubungan dengan calon santri.');
  if (!POLA_WHATSAPP.test(f.noWhatsapp)) return bad('Nomor WhatsApp tidak valid.');
  if (f.email && !POLA_EMAIL.test(f.email)) return bad('Format email tidak valid.');
  if (!f.kota) return bad('Kota/kabupaten wajib diisi.');
  if (!isOpsi(SUMBER_INFO, f.sumberInfo)) return bad('Pilih dari mana Anda tahu PTQ Amsa.');
  if (f.sumberInfo === SUMBER_INFO_LAINNYA && !f.sumberInfoLainnya) return bad('Sebutkan dari mana Anda tahu PTQ Amsa.');

  const usia = hitungUsia(f.tanggalLahir);
  if (usia === null) return bad('Tanggal lahir tidak valid.');
  if (usia < USIA_MIN || usia > USIA_MAX) {
    return bad(`Usia calon santri harus ${USIA_MIN}–${USIA_MAX} tahun pada awal tahun ajaran (${LABEL_AWAL_TAHUN_AJARAN}).`);
  }

  const registrationId = crypto.randomUUID();
  const orderId = generateOrderId();
  const email = f.email || null;

  const insertData: Record<string, unknown> = {
    id: registrationId,
    jenis_pendaftaran: f.jenisPendaftaran,
    lulusan: f.lulusan,
    nama_lengkap: f.namaLengkap,
    jenis_kelamin: f.jenisKelamin,
    tanggal_lahir: f.tanggalLahir,
    asal_sekolah: f.asalSekolah,
    kota: f.kota,
    sumber_info:
      f.sumberInfo === SUMBER_INFO_LAINNYA ? `${SUMBER_INFO_LAINNYA}: ${f.sumberInfoLainnya}` : f.sumberInfo,
    status_pendaftaran: 'baru',
    payment_status: 'pending',
    payment_amount: BIAYA_PENDAFTARAN,
    order_id: orderId,
  };

  // Kontak utama dipetakan ke kolom orang tua kandung atau wali
  if (f.hubunganKontak === 'ayah-kandung' || f.hubunganKontak === 'ibu-kandung') {
    const isIbu = f.hubunganKontak === 'ibu-kandung';
    Object.assign(insertData, {
      hubungan_wali: 'orang-tua-kandung',
      relasi_whatsapp: isIbu ? 'Ibu' : 'Ayah',
      [isIbu ? 'nama_ibu' : 'nama_ayah']: f.namaKontak,
      no_whatsapp_ortu: f.noWhatsapp,
      email_ortu: email,
    });
  } else {
    Object.assign(insertData, {
      hubungan_wali: f.hubunganKontak,
      hubungan_dengan_santri: f.hubunganKontak === 'lainnya' ? f.hubunganLainnya : null,
      nama_wali: f.namaKontak,
      no_whatsapp_wali: f.noWhatsapp,
      email_wali: email,
    });
  }

  const { error: insertError } = await getSupabaseAdmin().from('pendaftaran_santri').insert([insertData]);

  if (insertError) {
    // Detail error database hanya untuk log server, jangan dikirim ke publik
    console.error('[submit-registration] Insert error:', insertError);
    return bad('Gagal menyimpan data pendaftaran. Silakan coba lagi atau hubungi admin via WhatsApp.', 500);
  }

  await catatLog({ registrationId, aksi: 'pendaftaran_dibuat', oleh: 'wali', detail: { catatan: 'Formulir awal dikirim lewat website.' } });

  await sendAdminRegistrationNotification({
    id: registrationId,
    nama_lengkap: f.namaLengkap,
    no_whatsapp_ortu: f.noWhatsapp,
    email_ortu: email,
    order_id: orderId,
    created_at: new Date().toISOString(),
  }).catch((err) => console.error('[submit-registration] Admin notification failed:', err));

  if (email) {
    await sendWaliRegistrationConfirmation({
      to: email,
      nama_wali: f.namaKontak,
      nama_santri: f.namaLengkap,
      registration_id: registrationId,
    }).catch((err) => console.error('[submit-registration] Wali confirmation failed:', err));
  }

  return NextResponse.json({
    success: true,
    registrationId,
    studentName: f.namaLengkap,
  });
}
