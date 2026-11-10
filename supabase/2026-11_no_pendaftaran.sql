-- Nomor pendaftaran yang mudah diingat wali: PSB27-001, PSB27-002, ...
-- (27 = tahun ajaran 2027/2028). ID uuid tetap dipakai di dalam sistem.
-- Pendaftar lama diberi nomor urut sesuai tanggal daftar. Aman dijalankan ulang.
--
-- Tahun ajaran berikutnya: ganti awalan default, lalu mulai ulang urutan:
--   alter table public.pendaftaran_santri alter column no_pendaftaran
--     set default 'PSB28-' || lpad(nextval('public.pendaftaran_no_seq')::text, 3, '0');
--   alter sequence public.pendaftaran_no_seq restart with 1;

create sequence if not exists public.pendaftaran_no_seq;

alter table public.pendaftaran_santri add column if not exists no_pendaftaran text;

-- Isi nomor untuk pendaftar yang sudah ada (urut tanggal daftar)
do $$
declare r record;
begin
  for r in
    select id from public.pendaftaran_santri where no_pendaftaran is null order by created_at
  loop
    update public.pendaftaran_santri
      set no_pendaftaran = 'PSB27-' || lpad(nextval('public.pendaftaran_no_seq')::text, 3, '0')
      where id = r.id;
  end loop;
end $$;

alter table public.pendaftaran_santri
  alter column no_pendaftaran set default 'PSB27-' || lpad(nextval('public.pendaftaran_no_seq')::text, 3, '0');

create unique index if not exists pendaftaran_santri_no_pendaftaran_key
  on public.pendaftaran_santri (no_pendaftaran);

grant usage, select on sequence public.pendaftaran_no_seq to service_role;
