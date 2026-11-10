import type { RegistrationRecord } from '@/lib/types/registration';

type ContactFields = Pick<
  RegistrationRecord,
  | 'no_whatsapp_ortu'
  | 'email_ortu'
  | 'no_whatsapp_wali'
  | 'email_wali'
  | 'hubungan_wali'
  | 'relasi_whatsapp'
  | 'nama_ayah'
  | 'nama_ibu'
  | 'nama_wali'
>;

/**
 * Kontak penanggung jawab pendaftar.
 * Pendaftar "orang tua kandung" mengisi kolom *_ortu, pendaftar lewat wali
 * mengisi kolom *_wali — selalu baca lewat helper ini, jangan langsung *_ortu.
 */
export function getRegistrantContact(reg: Partial<ContactFields>): {
  nama: string | null;
  whatsapp: string | null;
  email: string | null;
} {
  const isWali = reg.hubungan_wali !== undefined && reg.hubungan_wali !== 'orang-tua-kandung';
  const nama = isWali
    ? reg.nama_wali
    : reg.relasi_whatsapp?.toLowerCase() === 'ibu'
      ? reg.nama_ibu
      : reg.nama_ayah;
  return {
    nama: nama || null,
    whatsapp: reg.no_whatsapp_ortu || reg.no_whatsapp_wali || null,
    email: reg.email_ortu || reg.email_wali || null,
  };
}
