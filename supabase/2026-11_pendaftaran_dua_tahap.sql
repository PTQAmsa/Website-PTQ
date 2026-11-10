-- ============================================================================
-- PENDAFTARAN DUA TAHAP — PTQ Amsa001 (November 2026)
-- ============================================================================
-- Tahap 1 (website): form singkat ±2 menit tanpa dokumen.
-- Tahap 2 (link pribadi dari admin): wali melengkapi data & dokumen.
--
-- Perubahan:
--   1. Kolom yang baru diisi di tahap 2 boleh kosong (drop NOT NULL).
--   2. Kolom baru: jenis_pendaftaran, lulusan, sumber_info,
--      status_pendaftaran, token_lengkapi(+_dibuat_at), data_lengkap_at.
--
-- Cara pakai: Supabase Dashboard → SQL Editor → tempel seluruh isi file → Run.
-- Aman dijalankan berulang kali. Hak akses (RLS/revoke) tidak berubah.
-- ============================================================================

begin;

-- ── 1. Kolom tahap 2 boleh kosong saat pendaftaran awal ──────────────────────
alter table public.pendaftaran_santri
  alter column nama_panggilan   drop not null,
  alter column nik              drop not null,
  alter column nisn             drop not null,
  alter column tempat_lahir     drop not null,
  alter column nama_ayah        drop not null,
  alter column nama_ibu         drop not null,
  alter column pekerjaan_ayah   drop not null,
  alter column pekerjaan_ibu    drop not null,
  alter column no_whatsapp_ortu drop not null,
  alter column relasi_whatsapp  drop not null,
  alter column penghasilan_ortu drop not null,
  alter column alamat_sekolah   drop not null,
  alter column alamat_domisili  drop not null,
  alter column provinsi         drop not null,
  alter column url_kk           drop not null,
  alter column url_akta         drop not null,
  alter column url_ijazah       drop not null,
  alter column url_ktp_ortu     drop not null;

-- ── 2. Kolom baru ────────────────────────────────────────────────────────────
alter table public.pendaftaran_santri
  add column if not exists jenis_pendaftaran        text,
  add column if not exists lulusan                  text,
  add column if not exists sumber_info              text,
  add column if not exists status_pendaftaran       text not null default 'baru',
  add column if not exists token_lengkapi           text,
  add column if not exists token_lengkapi_dibuat_at timestamptz,
  add column if not exists data_lengkap_at          timestamptz;

alter table public.pendaftaran_santri
  drop constraint if exists pendaftaran_santri_status_pendaftaran_check;
alter table public.pendaftaran_santri
  add constraint pendaftaran_santri_status_pendaftaran_check
  check (status_pendaftaran in ('baru', 'dihubungi', 'tes', 'diterima', 'tidak_diterima'));

-- Link pelengkapan data dicari lewat token → unik & cepat
create unique index if not exists pendaftaran_santri_token_lengkapi_key
  on public.pendaftaran_santri (token_lengkapi)
  where token_lengkapi is not null;

commit;

-- ── 3. Cek hasil ─────────────────────────────────────────────────────────────
-- Harus muncul 7 baris kolom baru:
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'pendaftaran_santri'
  and column_name in ('jenis_pendaftaran', 'lulusan', 'sumber_info', 'status_pendaftaran',
                      'token_lengkapi', 'token_lengkapi_dibuat_at', 'data_lengkap_at');
