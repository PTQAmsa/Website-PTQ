# Setup GitHub Actions Cron - Supabase Keep-Alive

## 📋 Overview

Menggunakan **GitHub Actions** sebagai cron job untuk ping database Supabase setiap 6 hari. Solusi ini **100% gratis** dan tidak memerlukan registrasi service tambahan.

**Keuntungan:**
- ✅ Gratis (sudah include dengan GitHub)
- ✅ Reliable (infrastructure GitHub)
- ✅ Terintegrasi dengan repository
- ✅ Logs mudah diakses
- ✅ Bisa manual trigger untuk testing

---

## 🚀 Setup (3 Langkah Mudah)

### **Step 1: Add GitHub Secret (CRON_SECRET)**

GitHub Actions memerlukan `CRON_SECRET` untuk authenticate ke API endpoint.

1. **Buka GitHub Repository:**
   ```
   https://github.com/PTQAmsa/Website-PTQ
   ```

2. **Go to Settings:**
   - Click tab **Settings** (di menu atas repository)

3. **Navigate to Secrets:**
   - Di sidebar kiri, expand **Secrets and variables**
   - Click **Actions**

4. **Add New Secret:**
   - Click tombol **"New repository secret"** (hijau, pojok kanan atas)

5. **Fill Secret Details:**
   - **Name:** `CRON_SECRET`
   - **Secret:** `ptqamsa_cron_secret_2026_keep_alive_database`

6. **Save:**
   - Click **"Add secret"**

**✅ Done!** Secret sudah tersimpan dan bisa digunakan GitHub Actions.

---

### **Step 2: Push Workflow File ke GitHub**

Workflow file sudah dibuat di `.github/workflows/supabase-keep-alive.yml`.

**Commit & Push:**

```bash
git add .github/workflows/supabase-keep-alive.yml
git commit -m "ci: add GitHub Actions workflow for Supabase keep-alive"
git push origin feature/payment-system
```

**✅ Done!** Workflow sudah ada di GitHub.

---

### **Step 3: Enable GitHub Actions (Jika Belum)**

Jika GitHub Actions belum enabled di repository:

1. **Go to Actions tab** di repository

2. **Click "I understand my workflows, go ahead and enable them"**

3. **Refresh page**

**✅ Done!** GitHub Actions sekarang aktif.

---

## 🧪 Testing Workflow

### **Manual Trigger (Test Sekarang)**

Setelah push workflow file:

1. **Go to Actions tab:**
   ```
   https://github.com/PTQAmsa/Website-PTQ/actions
   ```

2. **Click workflow "Supabase Keep-Alive"** di sidebar kiri

3. **Click "Run workflow" dropdown** (pojok kanan)

4. **Select branch:** `feature/payment-system`

5. **Click tombol "Run workflow"** (hijau)

6. **Refresh page** setelah beberapa detik

7. **Click pada workflow run** yang baru muncul

8. **Click job "Ping Supabase Database"**

9. **Lihat logs:**
   - Should show: "✅ Keep-alive ping successful!"
   - HTTP Status: 200
   - Response body dengan `"success": true`

---

## 📊 Monitoring

### **View Workflow Runs**

1. **Go to Actions tab:**
   ```
   https://github.com/PTQAmsa/Website-PTQ/actions
   ```

2. **Click workflow "Supabase Keep-Alive"**

3. **Lihat list of runs:**
   - ✅ Green checkmark = Success
   - ❌ Red X = Failed
   - 🟡 Yellow dot = Running

### **View Logs**

1. Click pada workflow run
2. Click job "Ping Supabase Database"
3. Expand steps untuk melihat detail logs:
   - "Ping Keep-Alive Endpoint"
   - HTTP status & response

### **Email Notifications**

GitHub akan send email notification jika workflow fails (default behavior).

---

## 📅 Schedule

**Current Schedule:**
```yaml
schedule:
  - cron: '0 0 */6 * *'
```

**Explanation:**
- `0` = Minute 0
- `0` = Hour 0 (midnight)
- `*/6` = Every 6 days
- `*` = Every month
- `*` = Every day of week

**Timezone:** UTC (00:00 UTC = 07:00 WIB)

**Next Runs:**
- Day 6 dari sekarang: 00:00 UTC
- Day 12: 00:00 UTC
- Day 18: 00:00 UTC
- Continue every 6 days...

---

## 🔧 Troubleshooting

### **Error: "secrets.CRON_SECRET is not set"**

**Penyebab:** GitHub Secret belum ditambahkan.

**Solusi:**
1. Go to Settings → Secrets and variables → Actions
2. Add secret `CRON_SECRET` dengan value yang benar
3. Re-run workflow

### **Error: "401 Unauthorized"**

**Penyebab:** CRON_SECRET salah.

**Solusi:**
1. Verify CRON_SECRET value di GitHub Secrets
2. Should be: `ptqamsa_cron_secret_2026_keep_alive_database`
3. Update jika salah
4. Re-run workflow

### **Error: "500 Internal Server Error"**

**Penyebab:** API endpoint error atau Supabase down.

**Solusi:**
1. Check Vercel deployment status
2. Check Supabase status: https://status.supabase.com
3. Test endpoint manual:
   ```bash
   curl -X GET https://website-fzapex5ss-ptqamsas-projects.vercel.app/api/cron/keep-alive \
     -H "Authorization: Bearer ptqamsa_cron_secret_2026_keep_alive_database"
   ```

### **Workflow Tidak Jalan Otomatis**

**Penyebab:** GitHub Actions cron bisa delay 5-15 menit.

**Solusi:**
- Wait up to 15 minutes after scheduled time
- Check Actions tab untuk execution
- Manual trigger jika perlu

---

## ⚙️ Alternative Schedules

Edit `.github/workflows/supabase-keep-alive.yml` untuk ubah schedule:

**Every 5 Days (Lebih Aman):**
```yaml
- cron: '0 0 */5 * *'
```

**Every 3 Days (Paling Aman):**
```yaml
- cron: '0 0 */3 * *'
```

**Weekly (Every 7 Days - Risky!):**
```yaml
- cron: '0 0 */7 * *'
```
⚠️ Tidak recommended - terlalu dekat dengan 7 hari auto-pause!

**Custom Time (e.g., 3 AM WIB = 20:00 UTC previous day):**
```yaml
- cron: '0 20 */6 * *'
```

---

## 📋 Workflow File Explanation

```yaml
name: Supabase Keep-Alive
# Nama workflow yang tampil di GitHub Actions

on:
  schedule:
    - cron: '0 0 */6 * *'
  # Trigger otomatis setiap 6 hari
  
  workflow_dispatch:
  # Allow manual trigger dari GitHub UI

jobs:
  ping-database:
    runs-on: ubuntu-latest
    # Jalan di Ubuntu virtual machine
    
    steps:
      - name: Ping Keep-Alive Endpoint
        run: |
          # Curl command untuk ping endpoint
          # dengan Authorization header dari GitHub Secret
```

---

## ✅ Advantages vs External Cron Services

| Feature | GitHub Actions | Cron-Job.org | EasyCron |
|---------|---------------|--------------|----------|
| **Cost** | ✅ Free | ✅ Free | ⚠️ Limited free |
| **Reliability** | ✅ High | ✅ High | ⚠️ Medium |
| **Setup** | ✅ Easy | ⚠️ Need signup | ⚠️ Need signup |
| **Logs** | ✅ Integrated | ✅ Dashboard | ✅ Dashboard |
| **Email Alerts** | ✅ Auto | ✅ Configurable | ✅ Configurable |
| **No Registration** | ✅ Yes | ❌ No | ❌ No |

---

## 🎯 Expected Behavior

### **Success Response:**
```
🔄 Pinging Supabase database to prevent auto-pause...
📡 HTTP Status: 200
📦 Response Body:
{
  "success": true,
  "message": "Database keep-alive ping successful",
  "timestamp": "2026-05-25T00:00:00.000Z",
  "recordsChecked": 1
}
✅ Keep-alive ping successful!
```

### **Failure Response:**
```
🔄 Pinging Supabase database to prevent auto-pause...
📡 HTTP Status: 500
📦 Response Body:
{
  "success": false,
  "error": "Error message here"
}
❌ Keep-alive ping failed with status 500
```

---

## 🔗 Quick Links

- **GitHub Repository:** https://github.com/PTQAmsa/Website-PTQ
- **Actions Tab:** https://github.com/PTQAmsa/Website-PTQ/actions
- **Settings (Secrets):** https://github.com/PTQAmsa/Website-PTQ/settings/secrets/actions
- **API Endpoint:** https://website-fzapex5ss-ptqamsas-projects.vercel.app/api/cron/keep-alive

---

## 📝 Checklist

Setup completed jika:

- [ ] GitHub Secret `CRON_SECRET` ditambahkan
- [ ] Workflow file di-push ke repository
- [ ] GitHub Actions enabled
- [ ] Manual test run: SUCCESS ✅
- [ ] Workflow terjadwal untuk jalan otomatis
- [ ] Email notifications aktif (default)

---

## 💡 Tips

1. **Set Calendar Reminder:**
   - Cek Actions tab setiap minggu
   - Pastikan workflow jalan setiap 6 hari

2. **Monitor Email:**
   - GitHub send email notification jika workflow fails
   - Check inbox untuk alerts

3. **Manual Trigger:**
   - Bisa manual trigger anytime dari Actions tab
   - Good for testing atau force ping

4. **Backup Plan:**
   - Jika GitHub Actions down (sangat jarang), Supabase akan pause setelah 7 hari
   - Manual unpause di Supabase Dashboard
   - Data tetap aman (90 hari grace period)

---

**Last Updated:** 25 Mei 2026

**Status:** ✅ Ready to Setup - Easiest Solution!
