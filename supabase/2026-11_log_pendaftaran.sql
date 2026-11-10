-- Riwayat perubahan data pendaftar (siapa mengubah apa & kapan).
-- Diisi server: wali mendaftar / melengkapi data, admin mengedit data,
-- mengubah tahapan, atau membuat link. Hanya service_role yang bisa akses.
-- Aman dijalankan ulang.

create table if not exists public.log_pendaftaran (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.pendaftaran_santri(id) on delete cascade,
  aksi text not null,
  oleh text not null check (oleh in ('admin', 'wali', 'sistem')),
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists log_pendaftaran_registration_idx
  on public.log_pendaftaran (registration_id, created_at desc);

alter table public.log_pendaftaran enable row level security;
revoke all on table public.log_pendaftaran from anon, authenticated;
grant select, insert, update, delete on table public.log_pendaftaran to service_role;
