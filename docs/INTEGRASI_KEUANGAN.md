# Integrasi PSB Website → SIKA PTQ (Keuangan-Santri)

**Status:** Tahap 1 selesai di sisi website (kontrak + endpoint, **nonaktif**
sampai token dipasang). Sisi SIKA belum dikerjakan.

## Gambaran

| | Website PSB (repo ini) | SIKA PTQ ([PTQAmsa/Keuangan-Santri](https://github.com/PTQAmsa/Keuangan-Santri)) |
|---|---|---|
| Stack | Next.js 16, Vercel | Laravel 13, PHP 8.3, hosting cPanel |
| Database | Supabase (project website) | PostgreSQL di Supabase (project terpisah) |
| Peran | Pendaftaran online + bayar formulir Rp 200.000 via Midtrans | Data santri, tagihan, pembayaran, kuitansi, laporan kas |

SIKA sudah punya kategori tagihan **`FORMULIR`** ("Biaya Formulir Pendaftaran",
default Rp 200.000). Biaya itulah yang dibayar calon santri lewat Midtrans di
website, jadi titik sambungnya jelas.

**Tujuan:** pendaftar PSB masuk ke SIKA tanpa input ulang, dan pembayaran
formulir tercatat di pembukuan begitu pendaftar diterima menjadi santri.

## Keputusan arsitektur: SIKA menarik data (pull)

```
Calon santri ──► Website PSB ──► Supabase (website)
                       ▲
                       │  GET /api/integrasi/keuangan/v1/pendaftar
                       │  Authorization: Bearer <token>
                       │
                 SIKA PTQ  (tombol "Sinkronkan" + jadwal cron cPanel)
                       │
                       ▼
          psb_applicants (staging, ditinjau pengurus)
                       │  [Terima sebagai santri]
                       ▼
     students + invoice FORMULIR (lunas) + payment + receipt
```

Alasan memilih pull, bukan website mengirim (push) ke SIKA:

- **Tidak ada data hilang.** SIKA di hosting bersama bisa saja sedang down,
  atau database-nya ter-pause. Dengan pull, SIKA cukup melanjutkan dari kursor
  terakhir. Push dari Vercel butuh antrean dan mekanisme kirim ulang.
- **Website tidak menyimpan URL maupun kredensial SIKA.** Data keuangan
  tidak perlu dibuka ke internet sama sekali.
- **Kendali di tangan bendahara.** Data hanya masuk saat sinkronisasi, dan
  menjadi santri hanya setelah ditinjau.
- **Bukan database bersama.** Menulis langsung ke database SIKA akan melewati
  aturan bisnis Laravel (penomoran invoice, kuitansi, log aktivitas).

## Kontrak API v1 (sudah tersedia di website)

```
GET https://www.ptqamsa.id/api/integrasi/keuangan/v1/pendaftar
Authorization: Bearer <KEUANGAN_SYNC_TOKEN>
```

| Query | Keterangan |
|---|---|
| `cursor` | Lanjut dari posisi terakhir (nilai `next_cursor` sebelumnya). Utamakan ini. |
| `updated_since` | ISO 8601 (mis. `2026-07-01T00:00:00Z`), dipakai bila belum punya cursor |
| `payment_status` | Opsional: `pending` \| `paid` \| `failed` \| `expired` |
| `limit` | 1–500, default 100 |

Contoh respons (data fiktif):

```json
{
  "version": "1",
  "data": [
    {
      "registration_id": "3f0c6c2e-8a51-4c1e-9d0b-2b7f5d1a9e44",
      "registered_at": "2026-07-21T14:52:18.614664+00:00",
      "updated_at": "2026-07-21T14:55:00.522448+00:00",
      "student": {
        "nama_lengkap": "Ahmad Fulan",
        "nama_panggilan": "Ahmad",
        "nisn": "0123456789",
        "jenis_kelamin": "L",
        "santri_group": "putra",
        "tempat_lahir": "Bandung",
        "tanggal_lahir": "2014-03-12",
        "asal_sekolah": "SDN 1 Contoh",
        "kota_asal": "Bandung",
        "provinsi": "Jawa Barat",
        "alamat_lengkap": "Jl. Contoh No. 1"
      },
      "guardian": {
        "nama_wali": "Fulan bin Fulan",
        "hubungan_wali": "Ayah Kandung",
        "hubungan_wali_detail": null,
        "no_whatsapp_wali": "081234567890"
      },
      "registration_fee": {
        "status": "paid",
        "amount": 200000,
        "paid_at": "2026-07-21T14:55:00.522448+00:00",
        "method": "qris",
        "order_id": "PSB-1784645538614-A1B2C3"
      }
    }
  ],
  "has_more": false,
  "next_cursor": "WyIyMDI2LTA3LTIx…",
  "server_time": "2026-10-29T08:00:00.000Z"
}
```

### Aturan kontrak

- **Upsert berdasarkan `registration_id`.** Data yang sama bisa terkirim ulang
  (misalnya status bayar berubah), dan itu normal.
- **Simpan `next_cursor` setiap halaman.** Ulangi selama `has_more = true`. Bila
  tidak ada data baru, kursor lama dikembalikan apa adanya.
- **Nama field `student` & `guardian` mengikuti kolom tabel `students` di SIKA.**
  `hubungan_wali` sudah dipetakan ke enum SIKA:
  - orang tua kandung → "Ayah Kandung" / "Ibu Kandung", sesuai pemilik nomor WhatsApp;
  - wali lain → "Lainnya", dengan `hubungan_wali_detail` (mis. "Paman / Bibi — Paman").
- **Panjang kolom di SIKA** (`nama_wali` 100, `no_whatsapp_wali` 25,
  `kota_asal` 50): validasi atau potong di sisi SIKA.
- **Minimisasi data (UU PDP).** NIK, dokumen, penghasilan, dan pekerjaan orang
  tua **tidak** dikirim. Tambah field hanya bila benar-benar dibutuhkan keuangan.
- **Perubahan tidak kompatibel → buat `/v2`**, jangan ubah v1.
  Implementasi: `lib/integrations/keuangan/contract.ts`.

| Status | Arti |
|---|---|
| 200 | OK |
| 400 | Parameter tidak valid (cursor rusak, format tanggal salah, dll.) |
| 401 | Token salah |
| 404 | Integrasi belum diaktifkan (`KEUANGAN_SYNC_TOKEN` kosong) |
| 500 | Gagal membaca database (mis. Supabase website ter-pause) |

### Mengaktifkan endpoint

1. Buat token: `openssl rand -base64 32`
2. Vercel → Settings → Environment Variables → `KEUANGAN_SYNC_TOKEN` (Production, Sensitive) → redeploy.
3. Uji:
   ```bash
   curl -s "https://www.ptqamsa.id/api/integrasi/keuangan/v1/pendaftar?limit=1" \
     -H "Authorization: Bearer <token>"
   ```
4. Simpan token yang sama di `.env` SIKA (lihat rancangan di bawah).

Token ini membuka akses ke data pribadi pendaftar. Perlakukan seperti
password, dan ganti di kedua sisi bila bocor.

## Rancangan sisi SIKA (belum dikerjakan)

Mengikuti konvensi repo SIKA: dibuat dengan `php artisan make:*`, dites dengan
PHPUnit, dicatat lewat `ActivityLogService`, dan hanya untuk role
`admin,bendahara`.

1. **Konfigurasi.** `config/services.php` → `'psb' => ['url' => env('PSB_API_URL'), 'token' => env('PSB_SYNC_TOKEN')]`.
2. **Migrasi `psb_applicants`** (staging, satu baris per pendaftar):
   - `registration_id` (uuid, unique);
   - kolom data santri & wali sesuai kontrak;
   - `fee_status`, `fee_amount`, `fee_paid_at`, `fee_method`, `fee_order_id`;
   - `payload` (json, salinan mentah);
   - `review_status` (`baru` / `diterima` / `tidak_diterima`), `student_id` (nullable FK `students`);
   - `last_synced_at`.

   Ditambah tabel kecil `integration_cursors` (`name`, `cursor`, `synced_at`).
3. **`App\Services\PsbSyncService`.** Pakai `Http::withToken()->timeout(20)->retry(3, 2000)`,
   ulangi selama `has_more`, upsert per `registration_id`, lalu simpan kursor.
   Sinkronisasi **tidak boleh** menimpa `review_status` / `student_id` yang
   sudah diputuskan pengurus.
4. **Perintah `php artisan psb:sinkron`** + jadwal di `routes/console.php`
   (mis. per jam saat musim PSB). Di cPanel: cron `php artisan schedule:run`.
5. **Halaman "Pendaftar PSB"**: daftar dengan filter status bayar, tombol
   **Sinkronkan sekarang**, dan aksi **Terima sebagai santri**. Form aksi ini
   berisi NIS, kelas, kamar, tahun masuk, dan PIN awal. Hasilnya dalam satu
   transaksi database:
   - `Student` baru (`must_change_pin = true`);
   - `Invoice` kategori `FORMULIR` sebesar `fee_amount`, status `paid`;
   - `Payment` (`payment_method = transfer`, `payment_date = fee_paid_at`,
     catatan "Midtrans {method} {order_id}") + `Receipt` lewat `ReceiptService`;
   - entri log aktivitas.
6. **Tes**:
   - sinkronisasi dengan `Http::fake` (paginasi, idempoten, kursor tersimpan);
   - konversi hanya bisa sekali per pendaftar;
   - tagihan FORMULIR otomatis lunas.

## Keputusan yang perlu ditetapkan pengurus

1. **Pendaftar yang membayar formulir tetapi tidak diterima atau mengundurkan
   diri.** Uangnya dicatat di mana? Pilihannya: Kas Masuk Lainnya dengan
   kategori baru "Formulir PSB", atau semua formulir dicatat saat lunas
   terlepas dari hasil seleksi.
2. **Kapan pendaftar resmi menjadi santri**, dan siapa yang menekan "Terima"
   (admin / bendahara)?
3. **Format NIS.** Diberi otomatis atau diisi manual?
4. **Tagihan awal santri baru** selain formulir (uang pangkal/wakaf, fasilitas,
   SPP bulan pertama): dibuat otomatis saat diterima?
5. **Tanggal pencatatan pembayaran Midtrans**: tanggal bayar atau tanggal dana
   masuk rekening (settlement)? Ke rekening mana?
6. **Status balik ke website** (mis. "diterima", NIS): perlu atau tidak?

## Tahapan

| Tahap | Isi | Status |
|---|---|---|
| 1 | Kontrak v1 + endpoint pull di website (nonaktif default) | ✅ selesai |
| 2 | SIKA: tabel staging, `psb:sinkron`, halaman Pendaftar PSB | menunggu |
| 3 | SIKA: "Terima sebagai santri" + tagihan FORMULIR lunas otomatis | menunggu keputusan no. 1–5 |
| 4 | Opsional: status balik ke website, tagihan awal di portal wali | — |

Catatan: database SIKA juga di Supabase Free Plan dan bisa ter-pause saat sepi
(lihat `docs/SUPABASE_KEEP_ALIVE.md`).
