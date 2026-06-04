# Supabase Keep-Alive Cron Job

## 📋 Overview

Supabase free tier otomatis pause project setelah **7 hari tidak ada aktivitas**. Untuk mencegah auto-pause, kita menggunakan Vercel Cron Job untuk ping database setiap **6 hari**.

---

## 🔧 Implementasi

### **1. API Endpoint**

**File:** `app/api/cron/keep-alive/route.ts`

Endpoint ini:
- Melakukan query sederhana ke database Supabase
- Menjaga database tetap aktif
- Protected dengan CRON_SECRET untuk security

**URL Endpoint:**
```
GET /api/cron/keep-alive
```

**Headers Required:**
```
Authorization: Bearer [CRON_SECRET]
```

### **2. Vercel Cron Configuration**

**File:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "0 0 */6 * *"
    }
  ]
}
```

**Schedule Explanation:**
- `0 0 */6 * *` = Setiap 6 hari, jam 00:00 UTC
- Format: `minute hour day month dayOfWeek`
- `*/6` = Setiap 6 hari

**Timezone:** UTC (Universal Time Coordinated)

---

## 🔐 Environment Variables

Tambahkan ke `.env.local` dan Vercel Environment Variables:

```bash
CRON_SECRET=ptqamsa_cron_secret_2026_keep_alive_database
```

**Untuk Production (Vercel):**
1. Buka Vercel Dashboard → Settings → Environment Variables
2. Tambahkan variable baru:
   - **Key:** `CRON_SECRET`
   - **Value:** `ptqamsa_cron_secret_2026_keep_alive_database` (atau generate random string)
   - **Environment:** Production, Preview, Development

**Generate Random CRON_SECRET (Recommended untuk production):**
```bash
openssl rand -base64 32
```

---

## 📅 Cron Schedule Examples

### **Current Setup: Setiap 6 Hari**
```
0 0 */6 * *
```
- Runs: Setiap 6 hari, jam 00:00 UTC
- UTC 00:00 = WIB 07:00 (UTC+7)

### **Alternative Schedules:**

**Setiap 5 Hari (lebih aman):**
```
0 0 */5 * *
```

**Setiap 3 Hari (paling aman, tapi lebih sering):**
```
0 0 */3 * *
```

**Setiap Minggu (7 hari - risky!):**
```
0 0 */7 * *
```
⚠️ **Tidak recommended** - Terlalu dekat dengan 7 hari auto-pause!

---

## 🧪 Testing

### **Test Locally (Manual)**

1. **Jalankan dev server:**
   ```bash
   npm run dev
   ```

2. **Call endpoint dengan curl:**
   ```bash
   curl -X GET http://localhost:3000/api/cron/keep-alive \
     -H "Authorization: Bearer ptqamsa_cron_secret_2026_keep_alive_database"
   ```

3. **Expected Response:**
   ```json
   {
     "success": true,
     "message": "Database keep-alive ping successful",
     "timestamp": "2026-05-25T07:30:00.000Z",
     "recordsChecked": 1
   }
   ```

### **Test di Vercel (Production)**

**Setelah deploy, test endpoint:**

```bash
curl -X GET https://your-domain.vercel.app/api/cron/keep-alive \
  -H "Authorization: Bearer ptqamsa_cron_secret_2026_keep_alive_database"
```

**Atau test di browser console:**
```javascript
fetch('/api/cron/keep-alive', {
  headers: {
    'Authorization': 'Bearer ptqamsa_cron_secret_2026_keep_alive_database'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📊 Monitoring

### **Cek Cron Job Logs di Vercel**

1. **Login ke Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **Pilih Project → Deployments**

3. **Klik Deployment → Functions**

4. **Pilih `/api/cron/keep-alive`**

5. **Lihat Logs:**
   - Success logs: "Keep-alive ping successful"
   - Error logs: "Keep-alive query failed"

### **Cron Job Execution History**

Vercel Dashboard menunjukkan:
- Last execution time
- Success/failure status
- Response time
- Error messages (jika ada)

---

## ⚙️ Vercel Cron Limitations

**Free Tier (Hobby):**
- ❌ **Cron jobs TIDAK tersedia** di free tier
- ✅ Perlu upgrade ke **Pro plan** ($20/bulan)

**Pro Tier:**
- ✅ Unlimited cron jobs
- ✅ Execution logs
- ✅ Automatic retries

---

## 🚨 Alternative Solutions (Jika Tidak Pakai Vercel Pro)

Jika Anda tidak upgrade Vercel Pro, gunakan external cron service:

### **1. Cron-Job.org (Free)**

Website: https://cron-job.org

**Setup:**
1. Register account gratis
2. Create new cron job:
   - **URL:** `https://your-domain.vercel.app/api/cron/keep-alive`
   - **Schedule:** Setiap 6 hari
   - **Headers:** `Authorization: Bearer [CRON_SECRET]`
3. Save & activate

**Pros:**
- ✅ Gratis
- ✅ Reliable
- ✅ Email notifications

**Cons:**
- ❌ External dependency
- ❌ Perlu setup manual

### **2. EasyCron (Free Tier)**

Website: https://www.easycron.com

**Setup:**
1. Register account
2. Add new cron job dengan URL endpoint
3. Set schedule: `0 0 */6 * *`
4. Add custom header untuk Authorization

**Free Tier:**
- 1 cron job
- 1 execution per day

⚠️ **Limitasi:** Free tier hanya 1x/hari, tidak bisa setiap 6 hari!

### **3. GitHub Actions (Free)**

**File:** `.github/workflows/keep-alive.yml`

```yaml
name: Supabase Keep-Alive

on:
  schedule:
    # Runs every 6 days at 00:00 UTC
    - cron: '0 0 */6 * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Database
        run: |
          curl -X GET https://your-domain.vercel.app/api/cron/keep-alive \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            --fail
```

**Setup:**
1. Create file di `.github/workflows/keep-alive.yml`
2. Add `CRON_SECRET` to GitHub Secrets
3. Commit & push

**Pros:**
- ✅ Gratis
- ✅ Reliable (GitHub infrastructure)
- ✅ Logs di GitHub Actions

**Cons:**
- ❌ Perlu GitHub repository public atau private
- ❌ Delay eksekusi bisa 5-15 menit

---

## 🛠️ Troubleshooting

### **Error: "Unauthorized"**

**Penyebab:** CRON_SECRET tidak match atau tidak di-set.

**Solusi:**
1. Cek `.env.local` - pastikan CRON_SECRET ada
2. Cek Vercel Environment Variables - pastikan CRON_SECRET sama
3. Redeploy Vercel deployment

### **Error: "Keep-alive query failed"**

**Penyebab:** Supabase connection error atau RLS policy blocking.

**Solusi:**
1. Cek Supabase status: https://status.supabase.com
2. Cek Supabase connection strings di `.env.local`
3. Test query manual di Supabase SQL Editor:
   ```sql
   SELECT id FROM pendaftaran_santri LIMIT 1;
   ```

### **Cron Job Tidak Jalan**

**Penyebab:** 
- Vercel free tier tidak support cron
- Schedule syntax salah
- Deployment failed

**Solusi:**
1. Cek Vercel plan - pastikan Pro tier
2. Cek `vercel.json` syntax
3. Cek deployment logs di Vercel
4. Test manual dengan curl

---

## 📋 Deployment Checklist

Sebelum deploy, pastikan:

- [ ] File `app/api/cron/keep-alive/route.ts` dibuat
- [ ] File `vercel.json` dibuat dengan cron config
- [ ] `CRON_SECRET` ditambahkan ke `.env.local`
- [ ] `CRON_SECRET` ditambahkan ke Vercel Environment Variables
- [ ] Test endpoint locally (curl)
- [ ] Commit & push ke GitHub
- [ ] Deploy ke Vercel
- [ ] Test endpoint di production
- [ ] Cek Vercel Cron Logs setelah 6 hari

---

## 🎯 Expected Behavior

### **Sukses:**
```json
{
  "success": true,
  "message": "Database keep-alive ping successful",
  "timestamp": "2026-05-25T07:30:00.000Z",
  "recordsChecked": 1
}
```

### **Gagal:**
```json
{
  "success": false,
  "error": "Error message here",
  "timestamp": "2026-05-25T07:30:00.000Z"
}
```

---

## 📊 Monitoring Recommendations

1. **Setup Email Notifications** (via Cron-Job.org atau GitHub Actions)
2. **Check Logs Weekly** di Vercel Dashboard
3. **Monitor Supabase Dashboard** untuk activity
4. **Set Calendar Reminder** untuk manual check setiap bulan

---

## 🔗 Resources

- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [Supabase Auto-Pause Policy](https://supabase.com/docs/guides/platform/going-into-prod#auto-pause)
- [Cron Expression Generator](https://crontab.guru/)
- [Cron-Job.org](https://cron-job.org)

---

## ⚠️ Important Notes

1. **Vercel Free Tier tidak support Cron Jobs** - Perlu Pro ($20/bulan) atau gunakan alternative (Cron-Job.org, GitHub Actions)
2. **Schedule 6 hari lebih aman** daripada 7 hari (margin 1 hari)
3. **Monitor logs regularly** untuk pastikan cron job jalan
4. **Backup data regularly** - jangan rely 100% pada keep-alive
5. **Consider upgrade Supabase Pro** ($25/bulan) untuk production reliability

---

**Last Updated:** 25 Mei 2026

**Status:** ✅ Configured & Ready to Deploy
