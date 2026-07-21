# Fix: Payment Status Tidak Otomatis Berubah ke "Lunas"

## 🔍 Masalah

Status pembayaran tidak otomatis berubah ke "Lunas" (paid) setelah user melakukan pembayaran melalui Midtrans.

## 🎯 Root Cause

Ada 2 masalah utama:

1. **Notification URL tidak dikonfigurasi di Midtrans Dashboard**
   - Midtrans tidak tahu kemana harus mengirim callback notification
   - Tanpa notification, aplikasi tidak akan tahu kapan pembayaran berhasil

2. **Payment link tidak include callback configuration** (sudah diperbaiki)
   - Sebelumnya, saat membuat payment link, kita tidak mengirim `callbacks` parameter
   - Sekarang sudah ditambahkan `callbacks.finish` untuk redirect user setelah pembayaran

## ✅ Solusi

### 1. Update Kode (Sudah Selesai)

#### a. Tambahkan callbacks ke payment link (`lib/services/midtrans.ts`)

```typescript
const body = {
  // ... existing fields
  callbacks: {
    finish: `${siteUrl}/pendaftaran-santri-baru/sukses?order_id=${params.order_id}`,
  },
};
```

#### b. Tambahkan logging untuk debugging (`app/api/midtrans-callback/route.ts`)

- Log saat menerima notification
- Log saat mencari registration
- Log hasil update status

### 2. Konfigurasi Midtrans Dashboard (HARUS DILAKUKAN)

#### Untuk Sandbox (Testing):

1. Login ke [Midtrans Sandbox Dashboard](https://dashboard.sandbox.midtrans.com/)
2. Pilih environment **Sandbox**
3. Pergi ke **Settings** → **Configuration**
4. Di bagian **Payment Notification URL**, masukkan:
   
   **Untuk development lokal dengan ngrok:**
   ```
   https://abc123.ngrok.io/api/midtrans-callback
   ```
   
   **Untuk production:**
   ```
   https://your-domain.com/api/midtrans-callback
   ```

5. **Simpan** konfigurasi

#### Setup Ngrok untuk Development:

```bash
# Install ngrok (jika belum)
# Download dari: https://ngrok.com/download

# Jalankan aplikasi
npm run dev

# Di terminal lain, jalankan ngrok
ngrok http 3000

# Copy URL yang diberikan (contoh: https://abc123.ngrok.io)
# Update di:
# 1. .env.local → NEXT_PUBLIC_SITE_URL
# 2. Midtrans Dashboard → Payment Notification URL
```

**⚠️ PENTING:** Ngrok free tier memberikan URL yang berbeda setiap restart. Anda harus update Midtrans Dashboard setiap kali restart ngrok.

### 3. Testing

#### a. Test dengan Script Otomatis

```bash
# 1. Cek status pembayaran dari Midtrans
npm run check:payment PSB-1779109027046-Z115YL

# 2. Test callback endpoint secara manual
npm run test:callback PSB-1779109027046-Z115YL
```

#### b. Test dengan Pembayaran Real (Sandbox)

1. Generate payment link dari admin dashboard
2. Buka payment link
3. Lakukan pembayaran test dengan kartu kredit test:
   - Card Number: `4811 1111 1111 1114`
   - CVV: `123`
   - Exp Date: `01/30`
   - OTP: `112233`

4. Setelah pembayaran berhasil, cek:
   - Log di terminal aplikasi
   - Database `pendaftaran_santri` (status harus `paid`)
   - Database `payment_logs` (harus ada entry baru)

#### c. Monitoring Logs

**Di terminal aplikasi:**
```
[midtrans-callback] Received notification: { order_id: 'PSB-...', transaction_status: 'settlement', ... }
[midtrans-callback] Looking for registration with order_id: PSB-...
[midtrans-callback] Found exact match: uuid-...
[midtrans-callback] Processed order_id PSB-...: pending → paid
```

**Di database:**
```sql
-- Cek payment logs
SELECT * FROM payment_logs 
WHERE action = 'payment_received' 
ORDER BY created_at DESC 
LIMIT 10;

-- Cek status pendaftaran
SELECT id, nama_lengkap, order_id, payment_status, payment_date
FROM pendaftaran_santri
WHERE payment_status = 'paid'
ORDER BY payment_date DESC;
```

## 📊 Flow Diagram

```
User melakukan pembayaran di Midtrans
         ↓
Midtrans memproses pembayaran
         ↓
Midtrans mengirim HTTP POST ke:
  → https://your-domain.com/api/midtrans-callback
         ↓
Aplikasi menerima callback
         ↓
Aplikasi memverifikasi signature ✓
         ↓
Aplikasi mencari registration by order_id ✓
         ↓
Aplikasi update status ke "paid" ✓
         ↓
Aplikasi insert log ke payment_logs ✓
         ↓
Aplikasi mengirim email konfirmasi ✓
         ↓
User redirect ke halaman sukses ✓
```

## 🔧 Troubleshooting

### Callback tidak diterima

**Cek 1: Midtrans Dashboard Logs**
- Pergi ke **Transactions** → pilih transaksi → lihat **Notification History**
- Jika ada error, akan terlihat di sini

**Cek 2: URL accessible dari internet**
```bash
# Test dari luar
curl -X POST https://your-domain.com/api/midtrans-callback

# Harus return error (karena tidak ada signature), tapi tidak 404
```

**Cek 3: Ngrok masih running** (untuk development)
```bash
# Cek ngrok status
curl http://localhost:4040/api/tunnels

# Atau buka di browser
http://localhost:4040
```

**Cek 4: Signature verification**
- Pastikan `MIDTRANS_SERVER_KEY` di `.env.local` sama dengan di Midtrans Dashboard
- Cek log untuk error "Invalid signature"

### Status tidak berubah meskipun callback diterima

**Cek 1: Log di terminal**
```
[midtrans-callback] Received notification: ...
[midtrans-callback] Looking for registration with order_id: ...
[midtrans-callback] Found exact match: ...
[midtrans-callback] Processed order_id ...: pending → paid
```

**Cek 2: Database connection**
```sql
-- Test query
SELECT COUNT(*) FROM pendaftaran_santri;
```

**Cek 3: RLS Policies**
```sql
-- Cek policies
SELECT * FROM pg_policies 
WHERE tablename = 'pendaftaran_santri';

-- Harus ada policy untuk UPDATE dengan role 'anon'
```

### Email tidak terkirim

- Email dikirim secara non-blocking (tidak mempengaruhi update status)
- Cek log untuk error message dari email service
- Pastikan `APPS_SCRIPT_URL` dan `ADMIN_EMAIL` dikonfigurasi di `.env.local`

## 📝 Checklist

Sebelum deploy ke production, pastikan:

- [ ] Midtrans Dashboard sudah dikonfigurasi dengan notification URL yang benar
- [ ] `.env.local` sudah diupdate dengan `NEXT_PUBLIC_SITE_URL` yang benar
- [ ] Test callback endpoint dengan script `npm run test:callback`
- [ ] Test pembayaran real di sandbox environment
- [ ] Monitoring logs untuk memastikan callback diterima
- [ ] Cek database untuk memastikan status berubah
- [ ] Test email notification terkirim

## 🚀 Deployment ke Production

1. **Update environment variables di hosting platform** (Vercel/Netlify/dll):
   ```
   NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
   MIDTRANS_IS_PRODUCTION=true
   MIDTRANS_SERVER_KEY=Mid-server-PRODUCTION-KEY
   MIDTRANS_CLIENT_KEY=Mid-client-PRODUCTION-KEY
   ```

2. **Update Midtrans Production Dashboard**:
   - Login ke [Midtrans Production Dashboard](https://dashboard.midtrans.com/)
   - Set Payment Notification URL: `https://your-production-domain.com/api/midtrans-callback`

3. **Test di production**:
   - Generate payment link
   - Lakukan pembayaran test (gunakan kartu test di production sandbox)
   - Monitor logs dan database

## 📚 Dokumentasi Terkait

- [MIDTRANS_SETUP.md](./MIDTRANS_SETUP.md) - Setup lengkap Midtrans
- [TEST_CALLBACK.md](./TEST_CALLBACK.md) - Cara test callback secara manual
- [Midtrans Documentation](https://docs.midtrans.com/) - Official docs

## 🎉 Hasil

Setelah fix ini:
- ✅ Status otomatis berubah ke "paid" setelah pembayaran berhasil
- ✅ Payment logs tercatat dengan lengkap
- ✅ Email konfirmasi terkirim otomatis
- ✅ User redirect ke halaman sukses
- ✅ Admin bisa monitoring pembayaran real-time
