import type { RegistrationRecord } from '@/lib/types/registration';

type ContactFields = Pick<
  RegistrationRecord,
  'no_whatsapp_ortu' | 'email_ortu' | 'no_whatsapp_wali' | 'email_wali'
>;

/**
 * Kontak penanggung jawab pendaftar.
 * Pendaftar "orang tua kandung" mengisi kolom *_ortu, pendaftar lewat wali
 * mengisi kolom *_wali — selalu baca lewat helper ini, jangan langsung *_ortu.
 */
export function getRegistrantContact(reg: Partial<ContactFields>): {
  whatsapp: string | null;
  email: string | null;
} {
  return {
    whatsapp: reg.no_whatsapp_ortu || reg.no_whatsapp_wali || null,
    email: reg.email_ortu || reg.email_wali || null,
  };
}
