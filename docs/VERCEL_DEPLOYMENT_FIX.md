# Fix: Error Submit Form di Vercel Deployment

## 🔴 Error yang Terjadi

```
Unexpected token 'R', "Request En"... is not valid JSON
```

Error ini muncul saat submit form pendaftaran di:
```
https://website-fzapex5ss-ptqamsas-projects.vercel.app/pendaftaran-santri-baru
```

## 🔍 Root Cause

Error ini terjadi karena **Environment Variables belum di-set di Vercel**. 

API endpoint `/api/submit-registration` membutuhkan:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `APPS_SCRIPT_URL`
- `ADMIN_EMAIL`

Tanpa environment variables ini, API akan crash dan return HTML error page (bukan JSON), sehingga muncul error "Unexpected token".

---

## ✅ Solusi: Set Environment Variables di Vercel

### Step 1: Login ke Vercel Dashboard

1. Buka https://vercel.com
2. Login dengan akun Anda
3. Pilih project: **Website-PTQ** (atau nama project Anda)

### Step 2: Buka Settings → Environment Variables

1. Klik tab **Settings** di menu atas
2. Klik **Environment Variables** di sidebar kiri
3. Klik tombol **Add New**

### Step 3: Tambahkan Environment Variables

Tambahkan satu per satu variable berikut:

#### 1. NEXT_PUBLIC_SUPABASE_URL
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://tbpjxjltwusydeirwxgi.supabase.co
Environment: Production, Preview, Development (pilih semua)
```

#### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRicGp4amx0d3VzeWRlaXJ3eGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NDA3NjEsImV4cCI6MjA5MjMxNjc2MX0.wSntSyZesC6Muu60xub8DyJqDjD05iE9yxS4Os8mvwE
Environment: Production, Preview, Development (pilih semua)
```

#### 3. ADMIN_PASSWORD
```
Key: ADMIN_PASSWORD
Value: admin12345
Environment: Production, Preview, Development (pilih semua)
```

#### 4. ADMIN_EMAIL
```
Key: ADMIN_EMAIL
Value: pesantrentaddaburquran@gmail.com
Environment: Production, Preview, Development (pilih semua)
```

#### 5. APPS_SCRIPT_URL
```
Key: APPS_SCRIPT_URL
Value: https://script.google.com/macros/s/AKfycbz9iR4VjzsTLuzpziDrtyC_Xa0ilhLFgYhnPlVkTZgAtM251U-wBsrAcRrKRvheU6KR9w/exec
Environment: Production, Preview, Development (pilih semua)
```

#### 6. MIDTRANS_SERVER_KEY
```
Key: MIDTRANS_SERVER_KEY
Value: [COPY FROM .env.local FILE]
Environment: Production, Preview, Development (pilih semua)
```

#### 7. MIDTRANS_CLIENT_KEY
```
Key: MIDTRANS_CLIENT_KEY
Value: [COPY FROM .env.local FILE]
Environment: Production, Preview, Development (pilih semua)
```

#### 8. MIDTRANS_IS_PRODUCTION
```
Key: MIDTRANS_IS_PRODUCTION
Value: false
Environment: Production, Preview, Development (pilih semua)
```

#### 9. NEXT_PUBLIC_SITE_URL
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://website-fzapex5ss-ptqamsas-projects.vercel.app
Environment: Preview only (untuk branch feature/payment-system)
```

**⚠️ PENTING:** Untuk production nanti, ganti dengan domain production Anda.

---

### Step 4: Redeploy

Setelah semua environment variables ditambahkan:

1. Klik tab **Deployments**
2. Cari deployment terakhir dari branch `feature/payment-system`
3. Klik tombol **⋯** (three dots) di sebelah kanan
4. Klik **Redeploy**
5. Tunggu deployment selesai (biasanya 1-2 menit)

---

## 🧪 Testing Setelah Redeploy

### 1. Test Form Pendaftaran

```
https://website-fzapex5ss-ptqamsas-projects.vercel.app/pendaftaran-santri-baru
```

**Test cases:**
1. Isi form lengkap dengan email
2. Upload semua file (max 4MB)
3. Submit form
4. Harus redirect ke halaman sukses (bukan error)

### 2. Test Admin Dashboard

```
https://website-fzapex5ss-ptqamsas-projects.vercel.app/admin/pendaftaran?pw=admin12345
```

**Test cases:**
1. Login dengan password `admin12345`
2. Harus tampil list pendaftaran
3. Klik detail → pas foto 3x4 harus tampil

### 3. Test Payment Link Generation

1. Buka admin dashboard
2. Klik detail pendaftaran
3. Generate payment link
4. Harus berhasil (tidak error)

---

## 🔧 Update Midtrans Notification URL

Setelah deployment berhasil, update Midtrans Dashboard:

### 1. Login ke Midtrans Sandbox

https://dashboard.sandbox.midtrans.com/

### 2. Update Payment Notification URL

1. Settings → Configuration
2. Set **Payment Notification URL**:
   ```
   https://website-fzapex5ss-ptqamsas-projects.vercel.app/api/midtrans-callback
   ```
3. Save

---

## 📋 Checklist

Sebelum test, pastikan:

- [ ] Semua 9 environment variables sudah ditambahkan di Vercel
- [ ] Environment dipilih: Production, Preview, Development (semua)
- [ ] Deployment sudah di-redeploy
- [ ] Deployment status: Ready (hijau)
- [ ] Midtrans notification URL sudah diupdate

---

## ❓ Troubleshooting

### Error masih muncul setelah redeploy?

**Cek 1: Environment Variables**
- Buka Vercel → Settings → Environment Variables
- Pastikan semua 9 variables ada
- Pastikan tidak ada typo di key name
- Pastikan value tidak ada spasi di awal/akhir

**Cek 2: Deployment Logs**
- Buka Vercel → Deployments → klik deployment terakhir
- Klik tab **Functions**
- Klik `/api/submit-registration`
- Lihat error logs

**Cek 3: Browser Console**
- Buka form pendaftaran
- Tekan F12 (Developer Tools)
- Klik tab **Console**
- Submit form
- Lihat error message lengkap

### Form submit tapi tidak ada response?

**Kemungkinan:**
- Supabase RLS policies memblokir insert
- File upload gagal (cek size < 4MB)
- Network timeout (file terlalu besar)

**Solusi:**
- Cek Supabase Dashboard → Table Editor → pendaftaran_santri
- Cek apakah data masuk
- Cek Supabase Storage → dokumen-santri → apakah file ter-upload

### Admin dashboard tidak bisa diakses?

**Kemungkinan:**
- `ADMIN_PASSWORD` tidak ter-set di Vercel
- URL salah (harus ada `?pw=admin12345`)

**Solusi:**
- Cek environment variables di Vercel
- Copy-paste URL lengkap dari dokumentasi

---

## 🎯 Expected Result

Setelah fix:

✅ Form pendaftaran bisa di-submit tanpa error
✅ Redirect ke halaman sukses dengan nama santri
✅ Data masuk ke database Supabase
✅ File ter-upload ke Supabase Storage
✅ Admin dashboard bisa diakses
✅ Pas foto 3x4 tampil di detail pendaftaran
✅ Payment link bisa di-generate

---

## 📞 Need Help?

Jika masih ada masalah:

1. Screenshot error message
2. Screenshot Vercel environment variables
3. Screenshot browser console (F12)
4. Share deployment URL

---

**Status:** 🔧 Waiting for Environment Variables Setup

**Next:** Redeploy setelah environment variables di-set
