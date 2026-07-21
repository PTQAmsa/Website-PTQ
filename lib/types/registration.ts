// Payment status union type
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired';

// Payment log action types
export type PaymentLogAction =
  | 'link_generated'
  | 'payment_received'
  | 'status_updated'
  | 'notification_sent';

// Full registration record as stored in Supabase
export interface RegistrationRecord {
  id: string;
  nama_lengkap: string;
  nama_panggilan: string;
  nik: string;
  nisn: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  no_whatsapp_santri?: string | null;
  // Status dalam keluarga
  anak_ke?: number | null;
  total_saudara?: number | null;
  status_anak?: string | null;
  // Data orang tua kandung (conditionally filled)
  nama_ayah?: string | null;
  nama_ibu?: string | null;
  pekerjaan_ayah?: string | null;
  pekerjaan_ibu?: string | null;
  no_whatsapp_ortu?: string | null;
  relasi_whatsapp?: string | null;
  email_ortu?: string | null;
  // Data wali (conditionally filled)
  hubungan_wali: string;
  nama_wali?: string | null;
  hubungan_dengan_santri?: string | null;
  pekerjaan_wali?: string | null;
  no_whatsapp_wali?: string | null;
  email_wali?: string | null;
  nama_ayah_kandung?: string | null;
  nama_ibu_kandung?: string | null;
  // Penghasilan (wajib)
  penghasilan_ortu: string;
  // Data pendidikan
  asal_sekolah: string;
  alamat_sekolah: string;
  alamat_domisili: string;
  provinsi: string;
  kota: string;
  // File URLs
  url_kk: string;
  url_akta: string;
  url_ijazah: string;
  url_ktp_ortu: string;
  url_pas_foto: string;
  url_surat_sehat?: string | null;
  created_at: string;
  // Payment fields
  payment_status: PaymentStatus;
  payment_link?: string | null;
  order_id?: string | null;
  payment_date?: string | null;
  payment_amount: number;
  payment_method?: string | null;
  updated_at: string;
}

// Form data submitted by the user (camelCase for frontend)
export interface RegistrationFormData {
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
  emailOrtu?: string;
}

// Result returned by the registration API on success
export interface RegistrationResult {
  success: true;
  registrationId: string;
  orderId: string;
  studentName: string;
  parentPhone: string;
  parentEmail?: string;
}

// Error result returned by the registration API on failure
export interface RegistrationError {
  success: false;
  error: string;
}

// Payment log entry as stored in Supabase
export interface PaymentLog {
  id: string;
  registration_id: string;
  order_id?: string | null;
  action: PaymentLogAction;
  details: Record<string, unknown>;
  performed_by: string;
  created_at: string;
}

// Parameters for Midtrans payment link creation
export interface PaymentLinkParams {
  order_id: string;
  gross_amount: number;
  customer_details: {
    first_name: string;
    last_name?: string;
    email?: string;
    phone: string;
  };
  item_details: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

// Response from Midtrans payment link API
export interface PaymentLinkResponse {
  payment_url: string;
  order_id: string;
}

// Response from Midtrans payment status API
export interface PaymentStatusResponse {
  order_id: string;
  transaction_status: string;
  fraud_status?: string;
  gross_amount: string;
  payment_type?: string;
  transaction_time?: string;
}

// Midtrans callback payload
export interface MidtransCallbackPayload {
  order_id: string;
  transaction_status: string;
  fraud_status?: string;
  gross_amount: string;
  payment_type?: string;
  signature_key: string;
  status_code: string;
  transaction_time?: string;
}

// Valid payment status transitions
export const VALID_PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ['paid', 'failed', 'expired'],
  paid: [], // Terminal state — cannot change
  failed: ['pending'], // Can retry
  expired: ['pending'], // Can regenerate link
};

export function isValidPaymentStatusTransition(
  current: PaymentStatus,
  next: PaymentStatus
): boolean {
  return VALID_PAYMENT_TRANSITIONS[current].includes(next);
}
