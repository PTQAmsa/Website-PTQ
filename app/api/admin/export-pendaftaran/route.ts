import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { hitungUsia } from '@/lib/config/psb';
import {
  JENIS_KELAMIN,
  JENIS_PENDAFTARAN,
  LULUSAN,
  labelHubunganKontak,
  labelMetodeBayar,
  labelOpsi,
  statusInfo,
} from '@/lib/psb/pilihan';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import type { RegistrationRecord } from '@/lib/types/registration';
import { getRegistrantContact } from '@/lib/utils/registration';
import { buatXlsx } from '@/lib/utils/xlsx';

export const dynamic = 'force-dynamic';

function tanggal(iso: string | null | undefined, withTime = false): string {
  if (!iso) return '';
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    timeZone: 'Asia/Jakarta',
  });
}

/** Unduh semua pendaftar sebagai file Excel (khusus admin). */
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from('pendaftaran_santri')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[export-pendaftaran] Fetch error:', error);
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 });
  }

  const header = [
    'No', 'No. Pendaftaran', 'Tanggal Daftar', 'Tahapan', 'Data Lengkap', 'Pembayaran', 'Metode Bayar',
    'Nama Lengkap', 'Nama Panggilan', 'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir', 'Usia saat Masuk',
    'Jenis Pendaftaran', 'Lulusan', 'Asal Sekolah', 'Alamat Sekolah', 'NIK', 'NISN',
    'Anak Ke', 'Jumlah Saudara', 'Status Anak', 'No. WhatsApp Santri',
    'Nama Kontak', 'Hubungan', 'No. WhatsApp Kontak', 'Email Kontak',
    'Nama Ayah', 'Pekerjaan Ayah', 'Nama Ibu', 'Pekerjaan Ibu',
    'Nama Wali', 'Pekerjaan Wali', 'Nama Ayah Kandung', 'Nama Ibu Kandung', 'Penghasilan',
    'Kota / Kabupaten', 'Provinsi', 'Alamat Lengkap', 'Tahu PTQ Amsa dari', 'ID Sistem',
  ];

  const rows = ((data ?? []) as RegistrationRecord[]).map((r, i) => {
    const contact = getRegistrantContact(r);
    return [
      i + 1,
      r.no_pendaftaran,
      tanggal(r.created_at, true),
      statusInfo(r.status_pendaftaran).label,
      r.data_lengkap_at ? 'Sudah' : 'Belum',
      r.payment_status === 'paid' ? 'Lunas' : 'Belum bayar',
      r.payment_status === 'paid' ? labelMetodeBayar(r.payment_method) : '',
      r.nama_lengkap,
      r.nama_panggilan,
      labelOpsi(JENIS_KELAMIN, r.jenis_kelamin),
      r.tempat_lahir,
      r.tanggal_lahir ? r.tanggal_lahir.split('-').reverse().join('/') : '',
      r.tanggal_lahir ? hitungUsia(r.tanggal_lahir) : '',
      labelOpsi(JENIS_PENDAFTARAN, r.jenis_pendaftaran),
      labelOpsi(LULUSAN, r.lulusan),
      r.asal_sekolah,
      r.alamat_sekolah,
      r.nik,
      r.nisn,
      r.anak_ke,
      r.total_saudara,
      r.status_anak,
      r.no_whatsapp_santri,
      contact.nama,
      labelHubunganKontak(r),
      contact.whatsapp,
      contact.email,
      r.nama_ayah,
      r.pekerjaan_ayah,
      r.nama_ibu,
      r.pekerjaan_ibu,
      r.nama_wali,
      r.pekerjaan_wali,
      r.nama_ayah_kandung,
      r.nama_ibu_kandung,
      r.penghasilan_ortu,
      r.kota,
      r.provinsi,
      r.alamat_domisili,
      r.sumber_info,
      r.id,
    ];
  });

  const hariIni = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }); // YYYY-MM-DD
  const file = buatXlsx('Pendaftar', header, rows);

  return new NextResponse(new Uint8Array(file), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="pendaftar-ptq-amsa-${hariIni}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  });
}
