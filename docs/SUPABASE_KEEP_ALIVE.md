# Supabase Keep-Alive

Supabase Free Plan mem-pause project yang **kurang aktivitas database selama
7 hari**. Menurut [dokumentasi Supabase](https://supabase.com/docs/guides/platform/free-project-pausing),
yang biasanya cukup adalah *"a few user requests to the database each day"* —
**beberapa request setiap hari**, bukan satu ping per minggu.

Sejak form PSB disembunyikan (Agustus 2026) hampir tidak ada aktivitas database
alami, jadi keep-alive harus bekerja sendiri.

## Kenapa sebelumnya tetap ter-pause tiap minggu

| Penyebab | Keterangan |
|---|---|
| Frekuensi terlalu jarang | Vercel Cron hanya ping 1x per 6 hari (`0 0 */6 * *`). Di bawah ambang "beberapa request per hari". |
| Workflow GitHub tidak pernah aktif | `.github/workflows/supabase-keep-alive.yml` belum pernah di-commit (GitHub API: 0 workflow). |
| URL workflow mati | Menunjuk ke preview `website-ptq-git-feature-payment-system-…vercel.app` → **404 DEPLOYMENT_NOT_FOUND**. |
| URL di dokumentasi lama mati | `website-fzapex5ss-…vercel.app` → **410 GONE**. Bila pernah didaftarkan di cron-job.org, job itu selalu gagal — hapus atau ganti URL-nya. |

## Cara kerja sekarang

Endpoint: `GET https://www.ptqamsa.id/api/cron/keep-alive`
(header `Authorization: Bearer <CRON_SECRET>`). Endpoint melakukan query nyata
ke tabel `pendaftaran_santri` dan `payment_logs`.

> Pakai domain **www**. `https://ptqamsa.id` me-redirect (308) ke www, dan
> request yang di-redirect tidak membawa header Authorization.

| Pemanggil | Jadwal | Fungsi |
|---|---|---|
| **Vercel Cron** (`vercel.json`) | 3x sehari: 08:00, 16:00, 00:00 WIB | Ping utama. Paket Hobby boleh banyak cron job asal masing-masing ≤ 1x/hari, waktunya bisa meleset dalam jam tersebut. |
| **GitHub Actions** (`.github/workflows/supabase-keep-alive.yml`) | 2x sehari: 11:23 & 19:23 WIB | Cadangan + **alarm**: GitHub mengirim email ke pemilik repo bila ping gagal. |

Total ±5 request per hari dari dua sistem terpisah. Bila satu sistem
bermasalah, sistem lain tetap menjaga database aktif.

## Setup (sekali saja)

1. **Buat `CRON_SECRET` baru.** Nilai lama pernah tertulis di dokumentasi repo
   publik ini, jadi wajib diganti:
   ```bash
   openssl rand -base64 32
   ```
2. **Vercel** → Settings → Environment Variables → ganti `CRON_SECRET`
   (Production). Vercel Cron otomatis mengirim nilai ini sebagai header.
3. **GitHub** → repo `PTQAmsa/Website-PTQ` → Settings → Secrets and variables →
   Actions → **New repository secret** `CRON_SECRET` (nilai sama persis).
4. **Push ke `main`.** Workflow hanya terjadwal bila file-nya ada di branch default.
5. **Uji GitHub Actions**: tab Actions → *Supabase Keep-Alive* → **Run workflow**.
   Harus hijau dengan `HTTP Status: 200`.
6. **Uji Vercel Cron**: Vercel → Settings → **Cron Jobs**. Pastikan 3 job
   tercantum dan cron jobs **tidak** dalam keadaan *Disabled*. Klik **Run**
   pada salah satunya, lalu **View Logs**: harus ada `[keep-alive] Ping successful`.

Opsional: untuk mengganti URL tanpa mengubah kode, buat *Repository variable*
`KEEP_ALIVE_URL` di GitHub (Settings → Secrets and variables → Actions → Variables).

## Pemantauan

- **Email dari GitHub** berjudul *Run failed: Supabase Keep-Alive* adalah
  tanda bahaya. Cek apakah project Supabase sudah ter-pause.
- Vercel → Logs, filter `requestPath:/api/cron/keep-alive`.
- GitHub otomatis mematikan jadwal workflow di repo publik setelah 60 hari
  tanpa aktivitas. Workflow ini mengaktifkan ulang dirinya sendiri lewat API
  setiap kali berjalan. Bila tetap dimatikan, GitHub mengirim email
  peringatan; aktifkan lagi dari tab Actions.

## Bila project sudah terlanjur ter-pause

Keep-alive **tidak bisa** membangunkan project yang sudah pause. Buka Supabase
Dashboard → project → **Restore project** (tunggu beberapa menit), lalu
jalankan workflow GitHub secara manual untuk memastikan semuanya hijau.

## Uji manual

```bash
curl -i https://www.ptqamsa.id/api/cron/keep-alive \
  -H "Authorization: Bearer <CRON_SECRET>"
```

Respons sukses:
```json
{ "success": true, "message": "Database keep-alive ping successful", "timestamp": "…", "durationMs": 850 }
```

| Status | Arti |
|---|---|
| 401 | `CRON_SECRET` tidak cocok / belum di-set di Vercel |
| 500 | Query gagal — biasanya project Supabase ter-pause atau env Supabase salah |
| 308 | Memakai `ptqamsa.id` tanpa www |

## Catatan untuk SIKA PTQ

Aplikasi keuangan (SIKA PTQ) juga direncanakan memakai Supabase Free Plan
(project terpisah), sehingga bisa ter-pause saat libur panjang. Bila sudah
online, tambahkan endpoint keep-alive serupa di sana atau pertimbangkan paket
berbayar. Lihat `docs/INTEGRASI_KEUANGAN.md`.
