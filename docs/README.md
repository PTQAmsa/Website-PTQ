# Documentation - Payment System

## 📚 Daftar Dokumentasi

### 🚀 Quick Start
- **[QUICK_START.md](./QUICK_START.md)** - Setup cepat dalam 5 menit
  - Install dependencies
  - Setup ngrok
  - Konfigurasi Midtrans
  - Testing

### 🔧 Setup & Configuration
- **[MIDTRANS_SETUP.md](./MIDTRANS_SETUP.md)** - Setup lengkap Midtrans
  - Konfigurasi Sandbox & Production
  - Setup notification URL
  - Environment variables
  - Testing guide
  - Troubleshooting

### 🐛 Bug Fix
- **[PAYMENT_STATUS_FIX.md](./PAYMENT_STATUS_FIX.md)** - Fix payment status auto-update
  - Root cause analysis
  - Solusi lengkap
  - Flow diagram
  - Deployment checklist

### 🧪 Testing
- **[TEST_CALLBACK.md](./TEST_CALLBACK.md)** - Testing callback endpoint
  - Manual testing dengan cURL
  - Testing dengan Postman
  - Generate signature manual
  - Test different status
  - Verifikasi hasil

### 📝 Changelog
- **[CHANGELOG.md](./CHANGELOG.md)** - History perubahan
  - Code changes
  - New files
  - Before/after comparison
  - Impact analysis

## 🎯 Mulai dari Mana?

### Jika Anda Baru Setup:
1. Baca [QUICK_START.md](./QUICK_START.md) untuk setup cepat
2. Baca [MIDTRANS_SETUP.md](./MIDTRANS_SETUP.md) untuk detail lengkap

### Jika Payment Status Tidak Update:
1. Baca [PAYMENT_STATUS_FIX.md](./PAYMENT_STATUS_FIX.md) untuk solusi
2. Gunakan testing scripts untuk debugging

### Jika Ingin Test Callback:
1. Baca [TEST_CALLBACK.md](./TEST_CALLBACK.md)
2. Gunakan npm scripts:
   ```bash
   npm run test:callback PSB-xxx
   npm run check:payment PSB-xxx
   ```

## 🛠️ Testing Scripts

### Test Callback Endpoint
```bash
npm run test:callback <order_id>
```
Mengirim test notification ke callback endpoint untuk memastikan status update berfungsi.

**Example:**
```bash
npm run test:callback PSB-1779109027046-Z115YL
```

### Check Payment Status
```bash
npm run check:payment <order_id>
```
Mengecek status pembayaran langsung dari Midtrans API.

**Example:**
```bash
npm run check:payment PSB-1779109027046-Z115YL
```

## 📊 Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT FLOW                              │
└─────────────────────────────────────────────────────────────┘

1. Admin generate payment link
   ↓
2. User buka payment link
   ↓
3. User melakukan pembayaran
   ↓
4. Midtrans proses pembayaran
   ↓
5. Midtrans kirim notification ke:
   → https://your-domain.com/api/midtrans-callback
   ↓
6. Aplikasi terima callback
   ↓
7. Aplikasi verifikasi signature ✓
   ↓
8. Aplikasi cari registration by order_id ✓
   ↓
9. Aplikasi update status ke "paid" ✓
   ↓
10. Aplikasi insert log ke payment_logs ✓
    ↓
11. Aplikasi kirim email konfirmasi ✓
    ↓
12. User redirect ke halaman sukses ✓
```

## 🔍 Troubleshooting

### Callback Tidak Diterima

**Cek:**
1. Midtrans Dashboard → Transactions → Notification History
2. Ngrok masih running (untuk development)
3. URL accessible dari internet
4. Signature verification

**Solusi:**
- Lihat [MIDTRANS_SETUP.md](./MIDTRANS_SETUP.md#troubleshooting)
- Lihat [PAYMENT_STATUS_FIX.md](./PAYMENT_STATUS_FIX.md#troubleshooting)

### Status Tidak Berubah

**Cek:**
1. Log di terminal aplikasi
2. Database connection
3. RLS policies

**Solusi:**
- Gunakan `npm run test:callback` untuk test
- Cek log untuk error messages
- Lihat troubleshooting guide di dokumentasi

## 📞 Support

Jika masih ada masalah setelah mengikuti dokumentasi:

1. **Cek log di terminal** - semua error akan terlihat di sini
2. **Cek Midtrans Dashboard** - lihat notification history
3. **Cek database** - lihat payment_logs untuk detail
4. **Gunakan testing scripts** - untuk isolate masalah

## 🎓 Learning Resources

- [Midtrans Documentation](https://docs.midtrans.com/)
- [Midtrans HTTP Notification](https://docs.midtrans.com/en/after-payment/http-notification)
- [Ngrok Documentation](https://ngrok.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## ✅ Checklist Setup

- [ ] Install dependencies: `npm install`
- [ ] Setup ngrok: `ngrok http 3000`
- [ ] Update `.env.local` dengan ngrok URL
- [ ] Konfigurasi Midtrans Dashboard dengan notification URL
- [ ] Test callback: `npm run test:callback PSB-xxx`
- [ ] Test pembayaran real di sandbox
- [ ] Verifikasi status berubah di database
- [ ] Verifikasi payment logs tercatat
- [ ] Verifikasi email terkirim

## 🚀 Production Deployment

Sebelum deploy ke production:

- [ ] Update environment variables di hosting platform
- [ ] Update Midtrans Production Dashboard dengan production URL
- [ ] Test di production dengan pembayaran test
- [ ] Monitor logs untuk memastikan callback diterima
- [ ] Setup monitoring/alerting untuk payment failures

---

**Last Updated:** 2026-05-19  
**Version:** 1.0.0  
**Status:** ✅ Complete
