# Quick Start: Fix Payment Status

## 🚀 Langkah Cepat (5 Menit)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Ngrok (Development)
```bash
# Terminal 1: Jalankan aplikasi
npm run dev

# Terminal 2: Jalankan ngrok
ngrok http 3000
```

Copy URL ngrok (contoh: `https://abc123.ngrok.io`)

### 3. Update Environment Variables

Edit `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://abc123.ngrok.io
```

### 4. Konfigurasi Midtrans Dashboard

1. Buka [Midtrans Sandbox Dashboard](https://dashboard.sandbox.midtrans.com/)
2. Login dengan akun Anda
3. Pergi ke **Settings** → **Configuration**
4. Set **Payment Notification URL**:
   ```
   https://abc123.ngrok.io/api/midtrans-callback
   ```
5. **Save**

### 5. Test

```bash
# Cek order_id dari database
# Kemudian test callback:
npm run test:callback PSB-1779109027046-Z115YL
```

Atau test dengan pembayaran real:
1. Generate payment link dari admin dashboard
2. Buka payment link
3. Bayar dengan kartu test: `4811 1111 1111 1114`
4. Cek status di database

## ✅ Verifikasi

Setelah pembayaran, cek:

```sql
-- Status harus berubah ke 'paid'
SELECT id, nama_lengkap, payment_status, payment_date
FROM pendaftaran_santri
WHERE order_id = 'PSB-xxx';

-- Harus ada log baru
SELECT * FROM payment_logs
WHERE order_id = 'PSB-xxx'
ORDER BY created_at DESC;
```

## 📖 Dokumentasi Lengkap

- [PAYMENT_STATUS_FIX.md](./PAYMENT_STATUS_FIX.md) - Penjelasan lengkap masalah dan solusi
- [MIDTRANS_SETUP.md](./MIDTRANS_SETUP.md) - Setup Midtrans dari awal
- [TEST_CALLBACK.md](./TEST_CALLBACK.md) - Testing manual callback

## 🆘 Butuh Bantuan?

Jika masih ada masalah, cek:
1. Log di terminal aplikasi
2. Midtrans Dashboard → Transactions → Notification History
3. Ngrok dashboard: http://localhost:4040

## 🎯 Catatan Penting

- **Ngrok URL berubah setiap restart** - harus update di Midtrans Dashboard
- **Untuk production** - ganti ngrok URL dengan domain production Anda
- **Signature verification** - pastikan `MIDTRANS_SERVER_KEY` sama di `.env.local` dan Midtrans Dashboard
