# Pre-Presentation Checklist - Payment System Pendaftaran

## 📋 Checklist Sebelum Presentasi ke Majelis Kyai & Dewan Guru

### ✅ 1. Form Pendaftaran

- [x] **Email wajib diisi** - Field email sudah required
- [x] **Validasi email** - Format email divalidasi otomatis
- [x] **Validasi NIK** - 16 digit, hanya angka
- [x] **Validasi NISN** - 10 digit, hanya angka
- [x] **Validasi WhatsApp** - Format nomor valid
- [x] **Validasi usia** - 10-20 tahun
- [x] **Upload files** - Max 4MB per file, format PDF/JPG/PNG/WEBP
- [x] **Pas foto 3x4** - Required field
- [x] **Surat sehat** - Optional field
- [x] **Progress indicator** - 3 steps dengan progress bar
- [x] **Error handling** - Error messages yang jelas

**Test:**
```bash
# Buka form pendaftaran
http://localhost:3000/pendaftaran-santri-baru

# Test cases:
1. Coba submit tanpa email → harus error
2. Coba email format salah → harus error
3. Coba NIK kurang dari 16 digit → harus error
4. Coba upload file > 4MB → harus error
5. Coba upload file format salah → harus error
6. Submit form lengkap → harus berhasil
```

---

### ✅ 2. Payment Integration (Midtrans)

- [x] **Midtrans Sandbox** - Configured dan tested
- [x] **Payment link generation** - Auto-generate dari admin
- [x] **Callback endpoint** - `/api/midtrans-callback` ready
- [x] **Signature verification** - Security check implemented
- [x] **Order ID matching** - Handle Midtrans suffix
- [x] **Status mapping** - settlement/capture → paid
- [x] **Idempotency** - Handle duplicate notifications
- [x] **Payment logs** - All transactions logged
- [x] **Email notification** - Confirmation email sent
- [x] **Redirect after payment** - Success page

**Test:**
```bash
# 1. Test callback endpoint
npm run test:callback PSB-xxx

# 2. Test payment status check
npm run check:payment PSB-xxx

# 3. Test real payment (sandbox)
# - Generate payment link dari admin
# - Bayar dengan kartu test: 4811 1111 1111 1114
# - Cek status berubah ke "Lunas"
```

**⚠️ PENTING - Setup Midtrans Dashboard:**
```
1. Login ke: https://dashboard.sandbox.midtrans.com/
2. Settings → Configuration
3. Set Payment Notification URL:
   - Development: https://your-ngrok-url.ngrok.io/api/midtrans-callback
   - Production: https://your-domain.com/api/midtrans-callback
4. Save
```

---

### ✅ 3. Admin Dashboard

- [x] **Password protection** - Simple password auth
- [x] **List pendaftaran** - Table dengan sorting
- [x] **Detail pendaftaran** - Full data santri
- [x] **Pas foto 3x4** - Displayed di detail page
- [x] **Payment status** - Badge dengan warna
- [x] **Generate payment link** - Button untuk create link
- [x] **Update status manual** - Admin bisa update status
- [x] **Payment logs** - Timeline riwayat pembayaran
- [x] **Copy payment link** - Quick copy button
- [x] **Verification indicator** - Show "via Midtrans" atau "via Admin"

**Test:**
```bash
# Buka admin dashboard
http://localhost:3000/admin/pendaftaran?pw=admin12345

# Test cases:
1. Login dengan password salah → harus ditolak
2. Login dengan password benar → harus masuk
3. Lihat list pendaftaran → harus tampil semua
4. Klik detail → harus tampil pas foto 3x4
5. Generate payment link → harus berhasil
6. Copy payment link → harus tersalin
7. Update status manual → harus berhasil
8. Lihat payment logs → harus tampil timeline
```

---

### ✅ 4. Database Schema

- [x] **pendaftaran_santri table** - All fields ready
- [x] **payment_logs table** - Audit trail ready
- [x] **RLS policies** - Security enabled
- [x] **Indexes** - Performance optimized
- [x] **Foreign keys** - Data integrity

**Verify:**
```sql
-- Cek struktur tabel
SELECT * FROM pendaftaran_santri LIMIT 1;
SELECT * FROM payment_logs LIMIT 1;

-- Cek RLS policies
SELECT * FROM pg_policies 
WHERE tablename IN ('pendaftaran_santri', 'payment_logs');

-- Cek data
SELECT COUNT(*) FROM pendaftaran_santri;
SELECT COUNT(*) FROM payment_logs;
```

---

### ✅ 5. Email Notifications

- [x] **Google Apps Script** - Email service configured
- [x] **Payment link email** - Template ready
- [x] **Payment confirmation** - Template ready
- [x] **Error handling** - Non-blocking, logged

**Test:**
```bash
# Test akan otomatis saat:
1. Admin generate payment link → email terkirim
2. User bayar → confirmation email terkirim

# Cek email di inbox orang tua
```

---

### ✅ 6. Security

- [x] **Environment variables** - Sensitive data di .env.local
- [x] **Admin password** - Protected routes
- [x] **Midtrans signature** - Verified on callback
- [x] **RLS policies** - Database security
- [x] **File upload validation** - Size & type checked
- [x] **Input sanitization** - XSS prevention
- [x] **HTTPS ready** - For production

**Verify:**
```bash
# Cek .env.local ada dan lengkap
cat .env.local

# Harus ada:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - ADMIN_PASSWORD
# - MIDTRANS_SERVER_KEY
# - MIDTRANS_CLIENT_KEY
# - APPS_SCRIPT_URL
```

---

### ✅ 7. Error Handling & Logging

- [x] **Console logs** - All operations logged
- [x] **Error messages** - User-friendly messages
- [x] **Payment logs** - Database audit trail
- [x] **Midtrans logs** - Check dashboard for errors

**Monitor:**
```bash
# Terminal logs saat:
1. User submit form → log "Registration created"
2. Admin generate link → log "Payment link generated"
3. Midtrans callback → log "Received notification"
4. Status update → log "Processed order_id"

# Cek Midtrans Dashboard:
Transactions → Select transaction → Notification History
```

---

### ✅ 8. Documentation

- [x] **PAYMENT_STATUS_FIX.md** - Root cause & solution
- [x] **MIDTRANS_SETUP.md** - Setup guide
- [x] **TEST_CALLBACK.md** - Testing guide
- [x] **QUICK_START.md** - Quick reference
- [x] **CHANGELOG.md** - All changes documented
- [x] **WHATSAPP_EMAIL_STRATEGY.md** - Future planning
- [x] **ADMIN_FAVICON.md** - Admin branding
- [x] **PRE_PRESENTATION_CHECKLIST.md** - This file

---

## 🧪 Testing Scenarios

### Scenario 1: Happy Path (End-to-End)

```
1. User buka form pendaftaran
2. User isi semua data dengan benar
3. User upload semua file (termasuk pas foto 3x4)
4. User submit form
5. Redirect ke halaman sukses
6. Admin login ke dashboard
7. Admin lihat pendaftaran baru (status: Pending)
8. Admin klik detail → pas foto 3x4 tampil
9. Admin generate payment link
10. Email terkirim ke orang tua
11. Orang tua buka link payment
12. Orang tua bayar dengan kartu test
13. Midtrans kirim callback
14. Status otomatis berubah ke "Lunas"
15. Email konfirmasi terkirim
16. Admin cek payment logs → ada entry "payment_received"

✅ Expected: Semua step berhasil tanpa error
```

### Scenario 2: Email Validation

```
1. User buka form pendaftaran
2. User isi data tapi skip email
3. User coba next step
4. Error: "Mohon lengkapi semua data"
5. User isi email dengan format salah (contoh: "test@")
6. User coba next step
7. Error: "Format email orang tua tidak valid"
8. User isi email dengan benar
9. User bisa lanjut

✅ Expected: Email validation bekerja
```

### Scenario 3: Payment Callback

```
1. Admin generate payment link
2. Copy order_id dari database
3. Run: npm run test:callback PSB-xxx
4. Cek terminal → log "Received notification"
5. Cek database → status berubah ke "paid"
6. Cek payment_logs → ada entry baru

✅ Expected: Callback berhasil update status
```

### Scenario 4: Manual Status Update

```
1. Admin login ke dashboard
2. Admin buka detail pendaftaran
3. Admin pilih status "Lunas"
4. Admin klik "Konfirmasi Update"
5. Success message tampil
6. Refresh page → status sudah "Lunas"
7. Cek payment_logs → ada entry "status_updated" by "admin"

✅ Expected: Manual update berhasil
```

---

## 🚀 Pre-Presentation Setup

### 1. Development Environment

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.local.example .env.local
# Edit .env.local dengan credentials yang benar

# 3. Run development server
npm run dev

# 4. Setup ngrok (untuk demo)
ngrok http 3000

# 5. Update Midtrans Dashboard dengan ngrok URL
# Settings → Configuration → Payment Notification URL
```

### 2. Demo Data Preparation

```sql
-- Buat beberapa sample data untuk demo
-- 1. Pendaftaran dengan status "Pending"
-- 2. Pendaftaran dengan status "Lunas" (via Midtrans)
-- 3. Pendaftaran dengan status "Lunas" (via Admin)
-- 4. Pendaftaran dengan payment logs lengkap
```

### 3. Demo Flow

```
1. Tunjukkan form pendaftaran
   - Highlight: Email wajib diisi
   - Highlight: Validasi NIK/NISN
   - Highlight: Upload pas foto 3x4

2. Tunjukkan admin dashboard
   - Login dengan password
   - List pendaftaran
   - Detail dengan pas foto 3x4
   - Generate payment link
   - Payment logs timeline

3. Tunjukkan payment flow
   - Buka payment link
   - Pilih metode pembayaran
   - Bayar dengan kartu test
   - Status otomatis berubah
   - Email konfirmasi

4. Tunjukkan monitoring
   - Terminal logs
   - Database payment_logs
   - Midtrans dashboard
```

---

## 📊 Key Metrics untuk Presentasi

### Fitur yang Sudah Berjalan:
- ✅ Form pendaftaran online (3 steps)
- ✅ Upload dokumen (max 4MB per file)
- ✅ Email wajib untuk notifikasi
- ✅ Admin dashboard dengan password
- ✅ Pas foto 3x4 di dashboard
- ✅ Generate payment link otomatis
- ✅ Integrasi Midtrans (sandbox)
- ✅ Auto-update status pembayaran
- ✅ Email notification otomatis
- ✅ Payment logs & audit trail
- ✅ Manual status update (backup)

### Keamanan:
- ✅ Password protection untuk admin
- ✅ Signature verification dari Midtrans
- ✅ Row Level Security di database
- ✅ File upload validation
- ✅ Input sanitization

### User Experience:
- ✅ Progress indicator (3 steps)
- ✅ Error messages yang jelas
- ✅ Success page setelah submit
- ✅ Email confirmation
- ✅ Responsive design (mobile-friendly)

---

## ⚠️ Known Limitations

### Yang Perlu Dijelaskan:

1. **Ngrok URL berubah setiap restart**
   - Untuk development, perlu update Midtrans Dashboard setiap restart ngrok
   - Untuk production, gunakan domain permanent

2. **Sandbox Environment**
   - Saat ini masih menggunakan Midtrans Sandbox
   - Untuk production, perlu switch ke Midtrans Production

3. **Simple Admin Auth**
   - Saat ini menggunakan simple password di URL
   - Untuk production, bisa upgrade ke proper authentication

4. **Email via Google Apps Script**
   - Saat ini menggunakan Google Apps Script
   - Untuk production, bisa upgrade ke dedicated email service

---

## 🎯 Next Steps (Setelah Approval)

### Phase 1: Production Setup
1. Setup domain production
2. Deploy ke hosting (Vercel/Netlify)
3. Switch Midtrans ke Production
4. Setup email domain (payment@pesantrentaddaburquran.com)
5. Setup WhatsApp Business untuk notifikasi

### Phase 2: Enhanced Features
1. User authentication & login
2. Parent dashboard
3. SPP payment system
4. Wakaf payment system
5. Payment history & receipts

### Phase 3: Advanced Features
1. WhatsApp notification automation
2. Payment reminder system
3. Reporting & analytics
4. Export data to Excel
5. Integration dengan sistem akademik

---

## 📞 Support & Contact

**Developer:**
- Kiro AI Assistant

**Documentation:**
- `/docs` folder - All documentation
- `README.md` - Project overview

**Testing Scripts:**
- `npm run test:callback` - Test callback endpoint
- `npm run check:payment` - Check payment status from Midtrans

---

## ✅ Final Checklist

Sebelum presentasi, pastikan:

- [ ] Development server running (`npm run dev`)
- [ ] Ngrok running dan URL updated di Midtrans Dashboard
- [ ] Sample data sudah ada di database
- [ ] Admin password diketahui (default: `admin12345`)
- [ ] Email test sudah diterima
- [ ] Payment test berhasil (sandbox)
- [ ] Pas foto 3x4 tampil di admin dashboard
- [ ] Terminal logs bersih dan readable
- [ ] Browser tabs sudah disiapkan untuk demo
- [ ] Backup plan jika ada technical issue

---

**Status: ✅ READY FOR PRESENTATION**

**Last Updated:** 2026-05-19  
**Version:** 1.0.0  
**Environment:** Development (Sandbox)
