# Penguncian Data Pendaftar (Security Hardening)

## Masalah yang ditemukan (29 Oktober 2026)

Website memakai **anon key** Supabase untuk semua operasi, termasuk dashboard
admin. Anon key ikut terkirim ke browser (dipakai form upload dokumen), jadi
siapa pun yang membuka website bisa mengambilnya, lalu langsung memanggil
Supabase tanpa melewati password admin:

| Celah | Bukti (dicek dengan `npm run check:exposure`) |
|---|---|
| Membaca seluruh data pendaftar (NIK, NISN, alamat, nama & WA orang tua) | 46 baris terbaca |
| Membaca log pembayaran | 41 baris terbaca |
| **Mengubah data**, mis. status bayar jadi "lunas" tanpa membayar | UPDATE diterima (HTTP 204) |
| Mendaftar & mengunduh dokumen (KK, akta, ijazah, KTP orang tua) | 46 folder terlihat |

Selain itu password admin dikirim lewat URL (`?pw=...`), sehingga tersimpan di
riwayat browser dan log server.

## Yang sudah diperbaiki di kode

- Semua kode server memakai **service role key** (`lib/supabase/server.ts`) yang
  tidak pernah dikirim ke browser.
- Login admin memakai **cookie sesi httpOnly** (8 jam, ada tombol Keluar,
  dibatasi 10 percobaan / 15 menit). Tidak ada lagi `?pw=` di URL.
- Dokumen dibuka lewat **signed URL** berumur 1 jam, sehingga bucket bisa dibuat private.
- Form pendaftaran menolak URL dokumen dari luar bucket milik pendaftar tersebut.

Kode baru tetap jalan dengan anon key selama service role key belum dipasang
(masa transisi). Selama itu dashboard admin menampilkan **banner kuning**.

## Langkah yang perlu Anda lakukan (urutan penting)

### 1. Ambil service role key
Supabase Dashboard → project website → **Project Settings → API Keys**.
Salin **`service_role`** (tab *Legacy API keys*) atau **Secret key** (`sb_secret_...`).
Key ini setara akses penuh database — jangan dibagikan atau di-commit.

### 2. Pasang di Vercel
Vercel → project → **Settings → Environment Variables** → Add:

- Type: **Secret** (tidak bisa dilihat lagi setelah disimpan — itu yang diinginkan)
- Key: `SUPABASE_SERVICE_ROLE_KEY`
- Value: key dari langkah 1 — **bukan** `anon` / `sb_publishable_...`
- Environments: **Production** (tambahkan **Preview** hanya bila Anda menguji
  admin di deployment preview; preview memakai database yang sama)

Bila yang terpasang ternyata anon/publishable key, dashboard admin menampilkan
banner kuning khusus setelah deploy — ganti nilainya sebelum lanjut ke langkah 4.

Tambahkan juga ke `.env.local` di laptop bila ingin menjalankan admin secara lokal.

### 3. Deploy versi terbaru
Push ke `main` (Vercel otomatis deploy). Lalu buka
`https://www.ptqamsa.id/admin/pendaftaran`, login, dan pastikan
**banner kuning sudah hilang** serta data & dokumen tampil.

### 4. Kunci database
Supabase Dashboard → **SQL Editor** → tempel isi `supabase/security_hardening.sql` → **Run**.

### 5. Verifikasi
```bash
npm run check:exposure
```
Semua baris harus ✅. Buka lagi dashboard admin dan satu halaman detail untuk
memastikan data & dokumen masih tampil (sekarang lewat service role).

### 6. Ganti password & secret yang pernah terekspos
- **`ADMIN_PASSWORD`**: password lama pernah lewat URL (`?pw=`). Ganti di Vercel
  (minimal 12 karakter acak), lalu redeploy. Semua sesi lama otomatis keluar.
- **`CRON_SECRET`**: nilainya pernah tertulis di dokumentasi repo publik.
  Buat baru (`openssl rand -base64 32`) lalu ganti di **Vercel** dan
  **GitHub → Settings → Secrets and variables → Actions** (nilai harus sama).

## Pembaruan paket (2 November 2026)

Next.js dinaikkan dari 16.1.6 ke 16.4.3. Versi lama terkena puluhan celah yang
diumumkan sepanjang 2026, termasuk beberapa RCE kritis (Image Optimization
untuk SVG/AVIF lewat `sharp`, dan fungsi `use cache`). Periksa berkala:

```bash
npm audit --omit=dev
```

Hasilnya harus `found 0 vulnerabilities`. Sisa temuan dari `npm audit` tanpa
`--omit=dev` ada di alat pengembangan (eslint) dan tidak ikut ke website.

PHP2Shell (CVE-2026-109618 / CVE-2026-109619) tidak berlaku untuk website ini
karena tidak memakai PHP, tetapi berlaku untuk SIKA PTQ yang berjalan di
hosting PHP: versi PHP hosting harus minimal 8.3.36 / 8.4.27 / 8.5.12.

## Catatan

- Data 46 pendaftar sempat bisa diakses publik. Log API Supabase paket gratis
  hanya disimpan singkat, jadi tidak bisa dipastikan apakah pernah ada yang
  mengaksesnya. Pertimbangkan kewajiban pemberitahuan menurut UU No. 27/2022
  tentang Pelindungan Data Pribadi bersama pengurus pesantren.
- Upload dokumen dari browser masih memakai anon key (hanya hak INSERT ke
  folder `pendaftaran/`, maksimal 3 MB, tipe PDF/JPG/PNG/WEBP). Peningkatan
  berikutnya: signed upload URL dari server sehingga anon tidak perlu hak
  apa pun di storage.
- Membuat tabel baru? Jangan ikuti pola `GRANT ALL ... TO anon` +
  "Enable read for anon" untuk tabel berisi data pribadi. Akses dari server
  dengan `getSupabaseAdmin()`.
