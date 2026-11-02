-- Setup fitur pendaftaran santri baru
-- Jalankan di Supabase SQL Editor
--
-- ⚠️ ARSIP (versi awal, April 2026). Skema produksi sudah jauh berkembang:
-- kolom pembayaran (payment_status, order_id, payment_link, ...), kolom wali,
-- url_pas_foto/url_surat_sehat, dan tabel payment_logs TIDAK ada di file ini.
-- Jangan jalankan ulang di production. Untuk skema terbaru, dump dari
-- Supabase (Database → Backups / `supabase db dump --schema-only`).
-- Aturan akses terbaru: supabase/security_hardening.sql

create extension if not exists pgcrypto;

create table if not exists public.pendaftaran_santri (
  id uuid primary key default gen_random_uuid(),
  nama_lengkap text not null,
  nama_panggilan text not null,
  nik text not null,
  nisn text not null,
  tempat_lahir text not null,
  tanggal_lahir date not null,
  jenis_kelamin text not null,
  nama_ayah text not null,
  nama_ibu text not null,
  pekerjaan_ayah text not null,
  pekerjaan_ibu text not null,
  no_whatsapp_ortu text not null,
  relasi_whatsapp text not null,
  penghasilan_ortu text not null,
  asal_sekolah text not null,
  alamat_sekolah text not null,
  alamat_domisili text not null,
  provinsi text not null,
  kota text not null,
  url_kk text not null,
  url_akta text not null,
  url_ijazah text not null,
  url_ktp_ortu text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- Tanpa policy untuk anon: insert dilakukan server (service role) lewat
-- /api/submit-registration.
alter table public.pendaftaran_santri enable row level security;

-- Bucket private: admin membuka dokumen lewat signed URL dari server.
insert into storage.buckets (id, name, public)
values ('dokumen-santri', 'dokumen-santri', false)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Anon can upload dokumen santri" on storage.objects;
create policy "Anon can upload dokumen santri"
  on storage.objects
  for insert
  to anon
  with check (
    bucket_id = 'dokumen-santri'
    and name like 'pendaftaran/%'
  );

-- Sengaja TIDAK ada policy SELECT publik: policy itu membuat siapa pun bisa
-- mendaftar & mengunduh KK/akta/KTP semua pendaftar.
drop policy if exists "Public can view dokumen santri" on storage.objects;
