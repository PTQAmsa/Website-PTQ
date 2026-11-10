-- Tutup unggahan langsung ke bucket dokumen-santri memakai anon key.
-- Sejak November 2026 halaman lengkapi data meminta izin unggah sekali pakai
-- ke server (/api/lengkapi-pendaftaran/upload), yang hanya diberikan kepada
-- pemegang link lengkapi yang sah. Policy anon lama tidak dibutuhkan lagi.
--
-- Jalankan SETELAH versi website dengan izin unggah sudah online. Bila
-- dijalankan lebih dulu, wali tidak bisa mengunggah dokumen di versi lama.

drop policy if exists "Anon can upload dokumen santri" on storage.objects;

-- Cek: tidak boleh ada policy tersisa untuk anon di storage.objects
select policyname, cmd, roles
from pg_policies
where schemaname = 'storage' and tablename = 'objects';
