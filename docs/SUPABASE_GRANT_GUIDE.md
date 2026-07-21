# Supabase GRANT Guide - Post October 30, 2026

## 📋 Overview

Mulai **30 Oktober 2026**, table baru di schema "public" memerlukan GRANT explicit untuk bisa diakses via Data API (PostgREST, GraphQL, supabase-js).

**PENTING:** Table yang sudah ada (`pendaftaran_santri`, `payment_logs`) **TIDAK terpengaruh** dan tetap berfungsi normal.

---

## ✅ Table yang Sudah Ada (Tidak Perlu Action)

Table berikut sudah punya GRANT yang proper dan akan tetap berfungsi setelah 30 Oktober 2026:

1. **pendaftaran_santri** - ✅ GRANT sudah ada
2. **payment_logs** - ✅ GRANT sudah ada

**Tidak perlu diubah atau dimigrasi.**

---

## 🆕 Template untuk Table Baru (Setelah 30 Oktober 2026)

Jika Anda membuat table baru setelah 30 Oktober 2026, gunakan template ini:

### **1. Create Table dengan GRANT**

```sql
-- Step 1: Create table
CREATE TABLE public.nama_table_baru (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- tambahkan columns sesuai kebutuhan
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: GRANT untuk Data API access (WAJIB!)
GRANT ALL ON public.nama_table_baru TO anon;
GRANT ALL ON public.nama_table_baru TO authenticated;
GRANT ALL ON public.nama_table_baru TO service_role;

-- Step 3: Enable RLS (recommended untuk security)
ALTER TABLE public.nama_table_baru ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies (sesuaikan dengan kebutuhan)
-- Contoh: Allow public insert
CREATE POLICY "Enable insert for anon" 
  ON public.nama_table_baru
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Contoh: Allow public read
CREATE POLICY "Enable read for anon" 
  ON public.nama_table_baru
  FOR SELECT 
  TO anon 
  USING (true);
```

### **2. Penjelasan GRANT Roles**

- **anon**: Public access (tidak login) - untuk form pendaftaran
- **authenticated**: Logged-in users - untuk user yang sudah login
- **service_role**: Backend/admin access - untuk admin dashboard

### **3. Contoh Kasus: Table SPP Bulanan**

```sql
-- Create table untuk SPP bulanan
CREATE TABLE public.spp_bulanan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES public.pendaftaran_santri(id),
  bulan INTEGER NOT NULL,
  tahun INTEGER NOT NULL,
  jumlah INTEGER DEFAULT 500000,
  status TEXT DEFAULT 'pending',
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GRANT (WAJIB setelah 30 Oktober 2026)
GRANT ALL ON public.spp_bulanan TO anon;
GRANT ALL ON public.spp_bulanan TO authenticated;
GRANT ALL ON public.spp_bulanan TO service_role;

-- Enable RLS
ALTER TABLE public.spp_bulanan ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Hanya admin yang bisa insert
CREATE POLICY "Admin can insert" 
  ON public.spp_bulanan
  FOR INSERT 
  TO service_role 
  WITH CHECK (true);

-- RLS Policy: Public bisa read
CREATE POLICY "Public can read" 
  ON public.spp_bulanan
  FOR SELECT 
  TO anon 
  USING (true);
```

---

## 🔍 Cara Cek GRANT Table

Untuk cek apakah table sudah punya GRANT:

```sql
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants
WHERE table_schema = 'public' 
  AND table_name = 'nama_table_anda'
ORDER BY grantee, privilege_type;
```

**Expected result:** Harus ada grants untuk `anon`, `authenticated`, dan `service_role`.

---

## ⚠️ Troubleshooting

### **Error: "permission denied for table"**

**Penyebab:** Table dibuat setelah 30 Oktober 2026 tanpa GRANT.

**Solusi:** Tambahkan GRANT manual:

```sql
GRANT ALL ON public.nama_table TO anon;
GRANT ALL ON public.nama_table TO authenticated;
GRANT ALL ON public.nama_table TO service_role;
```

### **Error: "new row violates row-level security policy"**

**Penyebab:** RLS enabled tapi tidak ada policy yang allow operation.

**Solusi:** Tambahkan RLS policy yang sesuai (lihat template di atas).

---

## 📚 Resources

- [Supabase Changelog](https://supabase.com/changelog)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL GRANT Documentation](https://www.postgresql.org/docs/current/sql-grant.html)

---

## 📞 Need Help?

Jika ada masalah dengan GRANT atau RLS:
1. Cek Supabase Dashboard → Security Advisor
2. Test query di SQL Editor
3. Cek error logs di browser console (F12)

---

**Last Updated:** 25 Mei 2026

**Status:** Dokumentasi untuk persiapan perubahan 30 Oktober 2026
