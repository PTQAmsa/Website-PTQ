# 🚀 Cara Mengakses Aplikasi

## ✅ Server Sudah Running!

Development server sudah berjalan di:
- **Local**: http://localhost:3000
- **Network**: http://192.168.0.100:3000

---

## 📱 Cara Akses Halaman-Halaman

### 1. Halaman Utama (Homepage)
```
http://localhost:3000
```
Ini adalah landing page pesantren dengan semua informasi.

---

### 2. Form Pendaftaran Santri Baru
```
http://localhost:3000/pendaftaran-santri-baru
```
Halaman untuk orang tua mendaftarkan santri baru.

**Yang baru:**
- ✅ Email sekarang **WAJIB** diisi
- ✅ Validasi email otomatis

---

### 3. Admin Dashboard (YANG ANDA CARI!)
```
http://localhost:3000/admin/pendaftaran?pw=admin12345
```

**Password default:** `admin12345`

**Cara akses:**
1. Buka browser (Chrome/Firefox/Edge)
2. Copy-paste URL di atas
3. Tekan Enter
4. Anda akan langsung masuk ke dashboard admin

**Atau jika diminta password:**
- Masukkan: `admin12345`
- Klik "Masuk"

---

### 4. Detail Pendaftaran (dengan Pas Foto 3x4)
```
http://localhost:3000/admin/pendaftaran/[id]?pw=admin12345
```

**Cara akses:**
1. Buka admin dashboard dulu
2. Klik salah satu nama santri di list
3. Anda akan melihat detail lengkap
4. **Pas foto 3x4 akan tampil di kiri atas** (yang baru!)

---

## 🖥️ Quick Access Links

Buka di browser Anda:

### Untuk Testing:
- **Homepage**: http://localhost:3000
- **Form Pendaftaran**: http://localhost:3000/pendaftaran-santri-baru
- **Admin Dashboard**: http://localhost:3000/admin/pendaftaran?pw=admin12345

### Halaman Lain:
- **FAQ**: http://localhost:3000/faq
- **Artikel**: http://localhost:3000/artikel
- **Visi Misi**: http://localhost:3000/visi-misi
- **Tentang Pesantren**: http://localhost:3000/tentang-pesantren
- **Tes Bakat (MI)**: http://localhost:3000/tes-bakat
- **Beasiswa**: http://localhost:3000/beasiswa
- **Majelis Kyai**: http://localhost:3000/majelis-kyai

---

## 🔍 Cara Lihat Perubahan Terbaru

### 1. Email Wajib Diisi
**Test di:** http://localhost:3000/pendaftaran-santri-baru

1. Isi form sampai Step 2 (Data Orang Tua)
2. **Coba skip email** → klik "Lanjut"
3. Akan muncul error: "Mohon lengkapi semua data"
4. **Isi email dengan format salah** (contoh: "test@")
5. Akan muncul error: "Format email orang tua tidak valid"
6. **Isi email dengan benar** (contoh: "test@gmail.com")
7. Baru bisa lanjut ke Step 3

### 2. Pas Foto 3x4 di Admin Dashboard
**Test di:** http://localhost:3000/admin/pendaftaran?pw=admin12345

1. Login ke admin dashboard
2. Klik salah satu nama santri yang sudah ada pas fotonya
3. **Pas foto 3x4 akan tampil di kiri atas** (ukuran 3x4, dengan border)
4. Di sebelah kanan pas foto ada semua data santri

---

## 🛑 Cara Stop Server

Jika ingin stop development server:

**Di terminal/command prompt:**
- Tekan `Ctrl + C`
- Atau tutup terminal

**Untuk start lagi:**
```bash
npm run dev
```

---

## 📱 Akses dari HP/Device Lain

Jika ingin akses dari HP atau komputer lain di jaringan yang sama:

```
http://192.168.0.100:3000
```

**Catatan:** 
- Pastikan HP/device lain terhubung ke WiFi yang sama
- IP address bisa berbeda tergantung jaringan Anda

---

## 🔐 Password Admin

**Default password:** `admin12345`

**Cara ganti password:**
1. Buka file `.env.local`
2. Cari baris: `ADMIN_PASSWORD=admin12345`
3. Ganti dengan password baru
4. Save file
5. Restart server (`Ctrl+C` lalu `npm run dev`)

---

## ❓ Troubleshooting

### Server tidak jalan?
```bash
# Stop dulu jika ada yang running
Ctrl + C

# Install dependencies lagi
npm install

# Start server
npm run dev
```

### Port 3000 sudah dipakai?
Error: "Port 3000 is already in use"

**Solusi:**
```bash
# Cari process yang pakai port 3000
netstat -ano | findstr :3000

# Kill process (ganti PID dengan nomor yang muncul)
taskkill /PID [nomor_pid] /F

# Start server lagi
npm run dev
```

### Halaman tidak muncul?
1. Pastikan server running (cek terminal ada tulisan "Ready")
2. Cek URL sudah benar (http://localhost:3000)
3. Coba refresh browser (F5)
4. Coba clear cache browser (Ctrl + Shift + R)

### Admin dashboard tidak bisa diakses?
1. Pastikan URL lengkap dengan password: `?pw=admin12345`
2. Cek password di `.env.local` (default: `admin12345`)
3. Coba copy-paste URL lengkap dari dokumen ini

---

## 📋 Checklist Sebelum Demo/Presentasi

- [ ] Server running (`npm run dev`)
- [ ] Buka http://localhost:3000 → homepage tampil
- [ ] Buka form pendaftaran → form tampil
- [ ] Buka admin dashboard → dashboard tampil
- [ ] Klik detail santri → pas foto 3x4 tampil
- [ ] Test email validation → error muncul jika tidak diisi
- [ ] Browser tabs sudah disiapkan untuk demo

---

## 🎯 Quick Demo Flow

### Persiapan (5 menit sebelum presentasi):
1. Start server: `npm run dev`
2. Buka 3 tabs di browser:
   - Tab 1: Homepage (http://localhost:3000)
   - Tab 2: Form Pendaftaran (http://localhost:3000/pendaftaran-santri-baru)
   - Tab 3: Admin Dashboard (http://localhost:3000/admin/pendaftaran?pw=admin12345)
3. Pastikan semua halaman loading dengan baik

### Saat Presentasi:
1. **Tab 1**: Tunjukkan homepage
2. **Tab 2**: Tunjukkan form pendaftaran (highlight email wajib)
3. **Tab 3**: Tunjukkan admin dashboard (highlight pas foto 3x4)

---

## 💡 Tips

1. **Gunakan Chrome/Firefox** untuk demo (lebih stabil)
2. **Zoom browser** jika perlu (Ctrl + Plus/Minus)
3. **Full screen mode** untuk presentasi (F11)
4. **Siapkan backup** jika ada technical issue:
   - Screenshot halaman-halaman penting
   - Video recording demo
5. **Test semua link** sebelum presentasi

---

## 📞 Need Help?

Jika ada masalah:
1. Cek terminal untuk error messages
2. Cek browser console (F12) untuk errors
3. Restart server (Ctrl+C lalu npm run dev)
4. Clear browser cache (Ctrl+Shift+R)

---

**Status: ✅ SERVER RUNNING**

**Ready untuk demo/presentasi!** 🚀

Semoga lancar! Barakallahu fiikum! 🤲
