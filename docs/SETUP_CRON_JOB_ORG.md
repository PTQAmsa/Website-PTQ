# Panduan Setup Cron-Job.org - Supabase Keep-Alive

## 📋 Overview

Panduan ini akan membantu Anda setup cron job di **Cron-Job.org** untuk ping database Supabase setiap 6 hari, mencegah auto-pause.

**Estimasi Waktu:** 5-10 menit

---

## 🚀 Step-by-Step Setup

### **Step 1: Register Cron-Job.org**

1. **Buka website:** https://cron-job.org/en/signup/

2. **Isi form registrasi:**
   - Email address: [Email Anda]
   - Password: [Buat password yang aman]
   - Confirm password: [Ulangi password]
   - ☑ Accept terms of service
   - ☑ Accept privacy policy

3. **Click "Sign up"**

4. **Check email Anda** untuk verification link

5. **Click verification link** di email

6. **Login** ke https://cron-job.org dengan email & password Anda

---

### **Step 2: Create Cron Job**

Setelah login, Anda akan masuk ke Dashboard:

1. **Click tombol "Create cronjob"** (biasanya di pojok kanan atas atau tengah halaman)

---

### **Step 3: Configure Cron Job - Basic Settings**

Di halaman "Create cronjob", isi form sebagai berikut:

#### **Title (Judul):**
```
Supabase Keep-Alive - PTQ Amsa
```

#### **Address (URL):**
```
https://website-fzapex5ss-ptqamsas-projects.vercel.app/api/cron/keep-alive
```

**⚠️ PENTING:** Pastikan URL sama persis (copy-paste dari sini)

---

### **Step 4: Configure Schedule**

Masih di halaman yang sama, bagian "Schedule":

1. **Click dropdown** "Every day at..."

2. **Pilih: "Every X days"**

3. **Days:** Isi angka `6`

4. **Time:** Pilih `00:00` (midnight)

**Result:** Cron akan jalan setiap 6 hari pada jam 00:00 (WIB jam 07:00 pagi)

---

### **Step 5: Configure Advanced Settings**

Scroll ke bawah atau click tab **"Advanced"**:

#### **Request method:**
- Pastikan pilihan: **GET** (default)

#### **Authentication:**
- Leave empty (kita pakai custom header)

#### **Request timeout:**
- Leave default: 30 seconds

---

### **Step 6: Add Authorization Header (PENTING!)**

Masih di Advanced settings:

1. **Scroll ke bagian "Headers"**

2. **Click "Add header"** atau "+ Add"

3. **Isi form header:**
   - **Name:** `Authorization`
   - **Value:** `Bearer ptqamsa_cron_secret_2026_keep_alive_database`

**⚠️ CRITICAL:** Copy-paste value di atas dengan EXACT. Jangan ada spasi extra!

**Penjelasan:**
- `Bearer` = Authentication type
- Spasi setelah Bearer
- `ptqamsa_cron_secret_2026_keep_alive_database` = Secret token

---

### **Step 7: Configure Notifications (Recommended)**

Scroll ke bagian **"Notifications"**:

#### **Execution:**
- ☑ **Notify me when execution fails**
- ☑ **Notify me when execution succeeds** (optional - untuk monitor awal)

#### **Email:**
- Pastikan email Anda sudah terisi (default: email registrasi)

**Benefit:** Anda akan dapat email notification jika cron job fail atau success

---

### **Step 8: Save Cron Job**

1. **Review semua settings:**
   - Title: ✅ Supabase Keep-Alive - PTQ Amsa
   - URL: ✅ https://website-fzapex5ss-ptqamsas-projects.vercel.app/api/cron/keep-alive
   - Schedule: ✅ Every 6 days at 00:00
   - Header: ✅ Authorization: Bearer ptqamsa_cron_secret...

2. **Click "Create cronjob"** (tombol hijau di bawah)

3. **Status harus "Enabled"** (toggle hijau)

---

### **Step 9: Test Cron Job (PENTING!)**

Setelah cron job dibuat:

1. **Di dashboard Cron-Job.org**, lihat list cron jobs

2. **Click nama cron job** "Supabase Keep-Alive - PTQ Amsa"

3. **Click tombol "Run now"** atau "Execute now"

4. **Tunggu beberapa detik**

5. **Lihat hasil eksekusi:**
   - **Status:** Should be "Success" atau "200 OK"
   - **Response:** Should show JSON:
     ```json
     {
       "success": true,
       "message": "Database keep-alive ping successful",
       "timestamp": "2026-05-25T...",
       "recordsChecked": 1
     }
     ```

6. **Jika SUCCESS:** ✅ Setup berhasil!

7. **Jika FAILED:** ❌ Lihat troubleshooting di bawah

---

## ✅ Verification Checklist

Setelah setup, pastikan:

- [ ] Cron job status: **Enabled** (hijau)
- [ ] Test execution: **Success** (200 OK)
- [ ] Response JSON: `"success": true`
- [ ] Email notification: Received (jika diaktifkan)
- [ ] Next execution: Terjadwal 6 hari dari sekarang

---

## 📊 Monitoring

### **Cek Execution History**

Di Cron-Job.org Dashboard:

1. Click nama cron job
2. Tab **"History"** atau **"Execution history"**
3. Lihat list eksekusi:
   - Date & Time
   - Status (Success/Failed)
   - Response code (200, 401, 500, etc.)
   - Response body

### **Email Notifications**

Anda akan dapat email:
- ✅ **Success:** "Cronjob 'Supabase Keep-Alive - PTQ Amsa' executed successfully"
- ❌ **Failed:** "Cronjob 'Supabase Keep-Alive - PTQ Amsa' execution failed"

### **Next Execution**

Cek di dashboard:
- **Next run:** Shows exact date & time
- Add to calendar untuk reminder

---

## 🔧 Troubleshooting

### **Error: "401 Unauthorized"**

**Penyebab:** Authorization header salah atau tidak ada.

**Solusi:**
1. Edit cron job
2. Cek header Authorization
3. Pastikan value: `Bearer ptqamsa_cron_secret_2026_keep_alive_database`
4. Pastikan ada spasi setelah "Bearer"
5. Save & test lagi

### **Error: "500 Internal Server Error"**

**Penyebab:** API endpoint error atau Supabase connection failed.

**Solusi:**
1. Cek Vercel deployment status (should be "Ready")
2. Test endpoint manual dengan curl:
   ```bash
   curl -X GET https://website-fzapex5ss-ptqamsas-projects.vercel.app/api/cron/keep-alive \
     -H "Authorization: Bearer ptqamsa_cron_secret_2026_keep_alive_database"
   ```
3. Cek Vercel function logs untuk error details
4. Cek Supabase status: https://status.supabase.com

### **Error: "Timeout"**

**Penyebab:** Request timeout (>30 seconds).

**Solusi:**
1. Cek Supabase connection
2. Increase timeout di Cron-Job.org settings (max 120s)

### **Cron Job Tidak Jalan**

**Penyebab:** Status disabled atau schedule salah.

**Solusi:**
1. Cek status: Should be "Enabled" (toggle hijau)
2. Cek schedule: Should be "Every 6 days"
3. Cek "Next run" date

---

## 📅 Expected Behavior

### **Timeline:**

| Day | Event | Action |
|-----|-------|--------|
| Day 0 | Setup cron job | Manual test: SUCCESS ✅ |
| Day 6 | First auto-execution | Cron-Job.org ping endpoint |
| Day 12 | Second auto-execution | Cron-Job.org ping endpoint |
| Day 18 | Third auto-execution | Cron-Job.org ping endpoint |
| ... | Every 6 days | Continue automatically |

**Result:** Supabase project stays active, no auto-pause! ✅

---

## 🎯 Post-Setup Actions

### **1. Add CRON_SECRET to Vercel**

Jika belum ditambahkan:

1. Buka Vercel Dashboard → Settings → Environment Variables
2. Add new variable:
   - **Key:** `CRON_SECRET`
   - **Value:** `ptqamsa_cron_secret_2026_keep_alive_database`
   - **Environment:** Production, Preview, Development
3. Redeploy jika perlu

### **2. Set Calendar Reminder**

Set reminder untuk cek:
- **Weekly:** Cek execution history di Cron-Job.org
- **Monthly:** Review logs, pastikan semua success

### **3. Monitor Email Notifications**

Jika ada email "execution failed":
- Check execution history
- Check error logs
- Fix issue immediately
- Test manual dengan "Run now"

---

## 📝 Important Notes

1. **Free Tier Limitations:**
   - Cron-Job.org free tier: Unlimited cron jobs ✅
   - No credit card required ✅
   - Reliable service ✅

2. **Timezone:**
   - Cron-Job.org uses UTC timezone
   - 00:00 UTC = 07:00 WIB (UTC+7)

3. **Backup Plan:**
   - Jika Cron-Job.org down (sangat jarang), Supabase akan pause setelah 7 hari
   - Anda masih bisa manual unpause di Supabase Dashboard
   - Data tetap aman (bisa di-restore dalam 90 hari)

4. **Long-term Solution:**
   - Untuk production serius, consider upgrade:
     - **Supabase Pro** ($25/bulan): No auto-pause, 8GB database
     - **Vercel Pro** ($20/bulan): Native cron support
   - Total: $45/bulan untuk platform yang fully managed

---

## 🔗 Resources

- **Cron-Job.org:** https://cron-job.org
- **Cron-Job.org Documentation:** https://cron-job.org/en/documentation/
- **Vercel Deployment URL:** https://website-fzapex5ss-ptqamsas-projects.vercel.app
- **API Endpoint:** https://website-fzapex5ss-ptqamsas-projects.vercel.app/api/cron/keep-alive

---

## ✅ Checklist Summary

Setup completed jika:

- [ ] Registered di Cron-Job.org
- [ ] Created cron job dengan config yang benar
- [ ] Added Authorization header
- [ ] Test execution: SUCCESS (200 OK)
- [ ] Email notifications configured
- [ ] Next execution terjadwal 6 hari dari sekarang
- [ ] Added CRON_SECRET to Vercel Environment Variables

**Congratulations! Supabase auto-pause prevention is now active!** 🎉

---

**Last Updated:** 25 Mei 2026

**Status:** ✅ Ready to Setup
