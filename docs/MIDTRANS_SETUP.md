# Konfigurasi Midtrans untuk Auto-Update Payment Status

## Masalah
Status pembayaran tidak otomatis berubah ke "Lunas" setelah pembayaran berhasil di Midtrans.

## Penyebab
Midtrans perlu dikonfigurasi untuk mengirim HTTP notification ke aplikasi kita ketika status pembayaran berubah.

## Solusi

### 1. Konfigurasi di Midtrans Dashboard

Anda harus mengatur **Payment Notification URL** di Midtrans Dashboard:

#### Untuk Sandbox (Testing):
1. Login ke [Midtrans Sandbox Dashboard](https://dashboard.sandbox.midtrans.com/)
2. Pilih environment **Sandbox**
3. Pergi ke **Settings** → **Configuration**
4. Di bagian **Payment Notification URL**, masukkan:
   ```
   https://your-domain.com/api/midtrans-callback
   ```
   
   **Untuk development lokal**, Anda perlu menggunakan tunneling service seperti:
   - [ngrok](https://ngrok.com/): `ngrok http 3000`
   - [localtunnel](https://localtunnel.github.io/www/): `lt --port 3000`
   - [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
   
   Contoh dengan ngrok:
   ```bash
   ngrok http 3000
   ```
   Kemudian gunakan URL yang diberikan ngrok:
   ```
   https://abc123.ngrok.io/api/midtrans-callback
   ```

5. **Simpan** konfigurasi

#### Untuk Production:
1. Login ke [Midtrans Production Dashboard](https://dashboard.midtrans.com/)
2. Pilih environment **Production**
3. Pergi ke **Settings** → **Configuration**
4. Di bagian **Payment Notification URL**, masukkan:
   ```
   https://your-production-domain.com/api/midtrans-callback
   ```
5. **Simpan** konfigurasi

### 2. Update Environment Variables

Pastikan `.env.local` Anda sudah benar:

```env
# Untuk development lokal dengan ngrok
NEXT_PUBLIC_SITE_URL=https://abc123.ngrok.io

# Untuk production
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com

# Midtrans credentials
MIDTRANS_SERVER_KEY=Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=Mid-client-xxxxx
MIDTRANS_IS_PRODUCTION=false  # true untuk production
```

### 3. Cara Kerja Flow

```
User melakukan pembayaran
         ↓
Midtrans memproses pembayaran
         ↓
Midtrans mengirim HTTP POST ke:
  → https://your-domain.com/api/midtrans-callback
         ↓
Aplikasi menerima callback
         ↓
Aplikasi memverifikasi signature
         ↓
Aplikasi update status ke "paid" di database
         ↓
Aplikasi mengirim email konfirmasi ke orang tua
```

## Testing

### 1. Test dengan Ngrok (Development)

```bash
# Terminal 1: Jalankan aplikasi
npm run dev

# Terminal 2: Jalankan ngrok
ngrok http 3000

# Copy URL ngrok (contoh: https://abc123.ngrok.io)
# Update NEXT_PUBLIC_SITE_URL di .env.local
# Update Payment Notification URL di Midtrans Dashboard
```

### 2. Test Pembayaran

1. Generate payment link dari admin dashboard
2. Buka payment link
3. Lakukan pembayaran test dengan kartu kredit test Midtrans:
   - Card Number: `4811 1111 1111 1114`
   - CVV: `123`
   - Exp Date: `01/25` (atau bulan/tahun di masa depan)
   - OTP: `112233`

4. Setelah pembayaran berhasil, cek:
   - Log di terminal aplikasi (harus ada log dari `/api/midtrans-callback`)
   - Database `payment_logs` (harus ada entry baru dengan action `payment_received`)
   - Status di `pendaftaran_santri` (harus berubah ke `paid`)

### 3. Monitoring Logs

Untuk melihat apakah callback diterima, cek logs:

```bash
# Di terminal aplikasi, Anda akan melihat:
[midtrans-callback] Processed order_id PSB-xxx: pending → paid
```

Atau cek database:

```sql
SELECT * FROM payment_logs 
WHERE action = 'payment_received' 
ORDER BY created_at DESC 
LIMIT 10;
```

## Troubleshooting

### Callback tidak diterima

1. **Cek Midtrans Dashboard Logs**:
   - Pergi ke **Transactions** → pilih transaksi → lihat **Notification History**
   - Jika ada error, akan terlihat di sini

2. **Cek URL accessible**:
   - Pastikan notification URL bisa diakses dari internet
   - Test dengan: `curl -X POST https://your-domain.com/api/midtrans-callback`

3. **Cek ngrok masih running** (untuk development):
   - Ngrok URL berubah setiap kali restart
   - Harus update di Midtrans Dashboard setiap kali ngrok restart

4. **Cek signature verification**:
   - Pastikan `MIDTRANS_SERVER_KEY` di `.env.local` sama dengan di Midtrans Dashboard

### Status tidak berubah meskipun callback diterima

1. Cek logs di terminal untuk error messages
2. Cek `payment_logs` table untuk melihat detail error
3. Pastikan database connection berfungsi

## Catatan Penting

- **Ngrok free tier**: URL berubah setiap restart. Untuk development yang lebih stabil, gunakan ngrok paid atau Cloudflare Tunnel
- **Production**: Pastikan domain production sudah SSL/HTTPS enabled
- **Security**: Callback endpoint sudah dilindungi dengan signature verification
- **Idempotency**: Callback endpoint sudah handle duplicate notifications dari Midtrans
