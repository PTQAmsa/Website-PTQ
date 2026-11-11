-- Tutup unggahan langsung ke bucket dokumen-santri memakai anon key.
-- Sejak November 2026 halaman lengkapi data meminta izin unggah sekali pakai
-- ke server (/api/lengkapi-pendaftaran/upload), yang hanya diberikan kepada
-- pemegang link lengkapi yang sah. Policy untuk publik tidak dibutuhkan lagi:
-- server (service_role) tidak terpengaruh policy.
--
-- Jalankan SETELAH versi website dengan izin unggah sudah online. Bila
-- dijalankan lebih dulu, wali tidak bisa mengunggah dokumen di versi lama.
-- Aman dijalankan ulang.

-- Hapus SEMUA policy di storage.objects yang menyebut bucket dokumen-santri,
-- termasuk yang dulu dibuat manual dengan nama lain
do $$
declare p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and (coalesce(qual, '') like '%dokumen-santri%' or coalesce(with_check, '') like '%dokumen-santri%')
  loop
    execute format('drop policy if exists %I on storage.objects', p.policyname);
  end loop;
end $$;

-- Sisa policy lama untuk bucket 'dokumen-pendaftaran' yang sudah tidak ada
drop policy if exists "Allow public upload" on storage.objects;

-- Cek: daftar policy yang tersisa di storage.objects. Seharusnya tidak ada
-- lagi yang menyebut dokumen-santri atau berlaku untuk anon/public.
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'storage' and tablename = 'objects';
