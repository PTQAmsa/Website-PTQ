import { NextRequest, NextResponse } from 'next/server';
import { PENGHASILAN, POLA_WHATSAPP, STATUS_ANAK, isOpsi } from '@/lib/psb/pilihan';
import { catatLog, hitungPerubahan } from '@/lib/psb/log';
import { sendAdminDataLengkapNotification } from '@/lib/services/email';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { isOwnDocumentUrl } from '@/lib/storage/documents';
import { getRegistrantContact } from '@/lib/utils/registration';
import { createRateLimiter, getClientIP } from '@/lib/utils/rate-limit';

/**
 * Pendaftaran tahap 2: wali melengkapi data & dokumen lewat link pribadi
 * (/pendaftaran-santri-baru/lengkapi/<token>). Data tahap 1 tidak bisa
 * diubah di sini — hanya kolom tahap 2 yang ditulis.
 */

const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 10 });

const POLA_TOKEN = /^[A-Za-z0-9_-]{32}$/;

// Kunci di body → kolom database
const DOKUMEN = [
  { key: 'kk', column: 'url_kk', label: 'Kartu Keluarga', wajib: true },
  { key: 'akta', column: 'url_akta', label: 'Akta Kelahiran', wajib: true },
  { key: 'ijazah', column: 'url_ijazah', label: 'Ijazah / SKL', wajib: true },
  { key: 'ktpOrtu', column: 'url_ktp_ortu', label: 'KTP Orang Tua / Wali', wajib: true },
  { key: 'pasFoto', column: 'url_pas_foto', label: 'Pas Foto', wajib: true },
  { key: 'suratSehat', column: 'url_surat_sehat', label: 'Surat Keterangan Sehat', wajib: false },
] as const;

function bad(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

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

  const token = text(body, 'token', 64);
  if (!POLA_TOKEN.test(token)) return bad('Link tidak berlaku.', 404);

  const supabase = getSupabaseAdmin();
  const { data: reg, error: fetchError } = await supabase
    .from('pendaftaran_santri')
    .select('*')
    .eq('token_lengkapi', token)
    .maybeSingle();

  if (fetchError) {
    console.error('[lengkapi-pendaftaran] Fetch error:', fetchError);
    return bad('Gagal memuat data pendaftaran. Silakan coba lagi.', 500);
  }
  if (!reg) return bad('Link tidak berlaku. Minta link terbaru kepada admin.', 404);

  const row = reg as unknown as Record<string, string | null> & { id: string };
  if (row.data_lengkap_at) return bad('Data sudah lengkap. Hubungi admin bila ada yang perlu diperbaiki.', 409);

  const f = {
    namaPanggilan: text(body, 'namaPanggilan', 50),
    tempatLahir: text(body, 'tempatLahir', 100),
    nik: text(body, 'nik', 16),
    nisn: text(body, 'nisn', 10),
    noWhatsappSantri: text(body, 'noWhatsappSantri', 15),
    anakKe: Number(text(body, 'anakKe', 3)),
    totalSaudara: Number(text(body, 'totalSaudara', 3)),
    statusAnak: text(body, 'statusAnak'),
    namaAyah: text(body, 'namaAyah', 100),
    namaIbu: text(body, 'namaIbu', 100),
    pekerjaanAyah: text(body, 'pekerjaanAyah', 100),
    pekerjaanIbu: text(body, 'pekerjaanIbu', 100),
    pekerjaanWali: text(body, 'pekerjaanWali', 100),
    namaAyahKandung: text(body, 'namaAyahKandung', 100),
    namaIbuKandung: text(body, 'namaIbuKandung', 100),
    penghasilan: text(body, 'penghasilan'),
    alamatSekolah: text(body, 'alamatSekolah', 200),
    provinsi: text(body, 'provinsi', 100),
    alamatDomisili: text(body, 'alamatDomisili', 500),
  };

  if (!f.namaPanggilan) return bad('Nama panggilan wajib diisi.');
  if (!f.tempatLahir) return bad('Tempat lahir wajib diisi.');
  if (!/^\d{16}$/.test(f.nik)) return bad('NIK harus 16 digit angka.');
  if (!/^\d{10}$/.test(f.nisn)) return bad('NISN harus 10 digit angka.');
  if (f.noWhatsappSantri && !POLA_WHATSAPP.test(f.noWhatsappSantri)) return bad('Nomor WhatsApp calon santri tidak valid.');
  if (!Number.isInteger(f.anakKe) || !Number.isInteger(f.totalSaudara) || f.anakKe < 1 || f.totalSaudara < 1 || f.totalSaudara > 30) {
    return bad('Anak ke- dan jumlah saudara harus angka minimal 1.');
  }
  if (f.anakKe > f.totalSaudara) return bad('Anak ke- tidak boleh lebih besar dari jumlah saudara.');
  if (!isOpsi(STATUS_ANAK, f.statusAnak)) return bad('Pilih status anak.');
  if (!isOpsi(PENGHASILAN, f.penghasilan)) return bad('Pilih rentang penghasilan.');
  if (!f.alamatSekolah) return bad('Alamat sekolah asal wajib diisi.');
  if (!f.provinsi) return bad('Provinsi wajib diisi.');
  if (!f.alamatDomisili) return bad('Alamat lengkap wajib diisi.');

  const update: Record<string, unknown> = {
    nama_panggilan: f.namaPanggilan,
    tempat_lahir: f.tempatLahir,
    nik: f.nik,
    nisn: f.nisn,
    no_whatsapp_santri: f.noWhatsappSantri || null,
    anak_ke: f.anakKe,
    total_saudara: f.totalSaudara,
    status_anak: f.statusAnak,
    penghasilan_ortu: f.penghasilan,
    alamat_sekolah: f.alamatSekolah,
    provinsi: f.provinsi,
    alamat_domisili: f.alamatDomisili,
  };

  // Data orang tua yang belum diisi di tahap 1 (nama kontak utama tidak disentuh)
  if (row.hubungan_wali === 'orang-tua-kandung') {
    const kontakIbu = row.relasi_whatsapp?.toLowerCase() === 'ibu';
    const namaLain = kontakIbu ? f.namaAyah : f.namaIbu;
    if (!namaLain) return bad(kontakIbu ? 'Nama ayah kandung wajib diisi.' : 'Nama ibu kandung wajib diisi.');
    if (!f.pekerjaanAyah || !f.pekerjaanIbu) return bad('Pekerjaan ayah dan ibu wajib diisi.');
    update[kontakIbu ? 'nama_ayah' : 'nama_ibu'] = namaLain;
    update.pekerjaan_ayah = f.pekerjaanAyah;
    update.pekerjaan_ibu = f.pekerjaanIbu;
  } else {
    if (!f.pekerjaanWali) return bad('Pekerjaan wali wajib diisi.');
    if (!f.namaAyahKandung || !f.namaIbuKandung) return bad('Nama ayah dan ibu kandung wajib diisi.');
    update.pekerjaan_wali = f.pekerjaanWali;
    update.nama_ayah_kandung = f.namaAyahKandung;
    update.nama_ibu_kandung = f.namaIbuKandung;
  }

  // Dokumen: file baru harus dari folder pendaftar ini; yang lama boleh dipertahankan
  const dokumen = (body.dokumen && typeof body.dokumen === 'object' ? body.dokumen : {}) as Record<string, unknown>;
  for (const d of DOKUMEN) {
    const baru = dokumen[d.key];
    if (baru !== undefined) {
      if (!isOwnDocumentUrl(baru, row.id)) return bad(`Berkas ${d.label} tidak valid. Silakan unggah ulang.`);
      update[d.column] = baru;
    } else if (d.wajib && !row[d.column]) {
      return bad(`Mohon unggah berkas ${d.label}.`);
    }
  }

  const now = new Date().toISOString();
  update.data_lengkap_at = now;
  update.updated_at = now;

  const { error: updateError } = await supabase
    .from('pendaftaran_santri')
    .update(update)
    .eq('id', row.id)
    .is('data_lengkap_at', null); // cegah dua kiriman bersamaan saling timpa

  if (updateError) {
    console.error('[lengkapi-pendaftaran] Update error:', updateError);
    return bad('Gagal menyimpan data. Silakan coba lagi atau hubungi admin via WhatsApp.', 500);
  }

  await catatLog({
    registrationId: row.id,
    aksi: 'data_dilengkapi',
    oleh: 'wali',
    detail: { perubahan: hitungPerubahan(row, update) },
  });

  const contact = getRegistrantContact(row as Parameters<typeof getRegistrantContact>[0]);
  await sendAdminDataLengkapNotification({
    id: row.id,
    nama_lengkap: row.nama_lengkap ?? '',
    whatsapp: contact.whatsapp,
    email: contact.email,
  }).catch((err) => console.error('[lengkapi-pendaftaran] Admin notification failed:', err));

  return NextResponse.json({ success: true });
}
