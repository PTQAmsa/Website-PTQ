-- ============================================================================
-- PENGUNCIAN DATA PENDAFTAR — PTQ Amsa001
-- ============================================================================
-- JANGAN dijalankan sebelum langkah 1–3 di docs/SECURITY_HARDENING.md selesai
-- (SUPABASE_SERVICE_ROLE_KEY sudah di Vercel & versi website terbaru sudah
-- ter-deploy). Kalau dijalankan lebih dulu, dashboard admin & form pendaftaran
-- akan berhenti berfungsi sampai key tersebut dipasang.
--
-- Cara pakai: Supabase Dashboard → SQL Editor → tempel seluruh isi file → Run.
-- Aman dijalankan berulang kali.
-- ============================================================================

begin;

-- ── 1. Tabel pendaftar & log pembayaran: hanya server (service role) ─────────
alter table public.pendaftaran_santri enable row level security;
alter table public.payment_logs enable row level security;

-- Hapus SEMUA policy lama di kedua tabel, termasuk yang dulu dibuat manual
-- lewat dashboard (mis. "Enable read for anon") yang membuka data ke publik.
do $$
declare
  p record;
begin
  for p in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('pendaftaran_santri', 'payment_logs')
  loop
    execute format('drop policy if exists %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

-- Role publik (anon key ada di JavaScript browser) tidak boleh menyentuh tabel ini
revoke all on table public.pendaftaran_santri from anon, authenticated;
revoke all on table public.payment_logs from anon, authenticated;

-- Server memakai service role (bypass RLS) — pastikan haknya eksplisit
grant select, insert, update, delete on table public.pendaftaran_santri to service_role;
grant select, insert, update, delete on table public.payment_logs to service_role;

-- ── 2. Bucket dokumen (KK, akta, ijazah, KTP): private ───────────────────────
-- Admin melihat dokumen lewat signed URL berumur 1 jam yang dibuat server.
update storage.buckets
set public = false,
    file_size_limit = 3145728, -- 3 MB, sama dengan batas di form pendaftaran
    allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
where id = 'dokumen-santri';

-- Hapus policy yang mengizinkan publik membaca/mendaftar/mengubah/menghapus
-- file di bucket ini (mis. "Public can view dokumen santri").
do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and cmd in ('SELECT', 'UPDATE', 'DELETE', 'ALL')
      and (coalesce(qual, '') ilike '%dokumen-santri%'
           or coalesce(with_check, '') ilike '%dokumen-santri%')
  loop
    execute format('drop policy if exists %I on storage.objects', p.policyname);
  end loop;
end $$;

-- Upload dari browser calon santri tetap diizinkan: hanya INSERT, hanya folder pendaftaran/
drop policy if exists "Anon can upload dokumen santri" on storage.objects;
create policy "Anon can upload dokumen santri"
  on storage.objects
  for insert
  to anon
  with check (
    bucket_id = 'dokumen-santri'
    and name like 'pendaftaran/%'
  );

commit;

-- ── 3. Cek hasil ─────────────────────────────────────────────────────────────
-- Harus kosong (tidak ada policy tersisa di tabel pendaftar):
select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename in ('pendaftaran_santri', 'payment_logs');

-- Harus hanya "Anon can upload dokumen santri" (INSERT):
select policyname, cmd, roles
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
  and (coalesce(qual, '') ilike '%dokumen-santri%' or coalesce(with_check, '') ilike '%dokumen-santri%');

-- Harus public = false:
select id, public, file_size_limit, allowed_mime_types from storage.buckets where id = 'dokumen-santri';
