// Payment status union type
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired';

// Payment log action types
export type PaymentLogAction =
  | 'link_generated'
  | 'payment_received'
  | 'status_updated'
  | 'notification_sent';

// Full registration record as stored in Supabase.
// Pendaftaran dua tahap: kolom bertanda (tahap 2) baru terisi setelah wali
// membuka link pelengkapan data dari admin.
export interface RegistrationRecord {
  id: string;
  no_pendaftaran?: string | null; // mis. PSB27-001, untuk ditampilkan ke wali
  // ── Tahap 1: form singkat ──
  jenis_pendaftaran?: string | null; // 'baru' | 'pindahan'
  lulusan?: string | null; // 'SD/MI' | 'SMP/MTs'
  nama_lengkap: string;
  jenis_kelamin: string;
  tanggal_lahir: string;
  asal_sekolah: string;
  kota: string;
  sumber_info?: string | null;
  // Kontak utama: orang tua kandung (*_ortu + relasi_whatsapp) atau wali (*_wali)
  hubungan_wali: string;
  relasi_whatsapp?: string | null;
  hubungan_dengan_santri?: string | null;
  nama_ayah?: string | null;
  nama_ibu?: string | null;
  no_whatsapp_ortu?: string | null;
  email_ortu?: string | null;
  nama_wali?: string | null;
  no_whatsapp_wali?: string | null;
  email_wali?: string | null;
  // ── Tahap 2: data lengkap ──
  nama_panggilan?: string | null;
  nik?: string | null;
  nisn?: string | null;
  tempat_lahir?: string | null;
  no_whatsapp_santri?: string | null;
  anak_ke?: number | null;
  total_saudara?: number | null;
  status_anak?: string | null;
  pekerjaan_ayah?: string | null;
  pekerjaan_ibu?: string | null;
  pekerjaan_wali?: string | null;
  nama_ayah_kandung?: string | null;
  nama_ibu_kandung?: string | null;
  penghasilan_ortu?: string | null;
  alamat_sekolah?: string | null;
  alamat_domisili?: string | null;
  provinsi?: string | null;
  url_kk?: string | null;
  url_akta?: string | null;
  url_ijazah?: string | null;
  url_ktp_ortu?: string | null;
  url_pas_foto?: string | null;
  url_surat_sehat?: string | null;
  // ── Proses pendaftaran ──
  status_pendaftaran?: string | null;
  token_lengkapi?: string | null;
  token_lengkapi_dibuat_at?: string | null;
  data_lengkap_at?: string | null;
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

// Dokumen pendaftar yang ditampilkan di dashboard admin (URL sudah ditandatangani)
export interface RegistrationDocument {
  key: string;
  label: string;
  url: string;
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
