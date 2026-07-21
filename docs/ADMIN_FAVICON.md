# Admin Favicon Configuration

## 📝 Overview

Halaman admin menggunakan favicon khusus yang berbeda dari halaman publik untuk membedakan tab browser.

## 🎨 Favicon Files

- **Public Pages**: `app/icon.ico` (default Next.js icon)
- **Admin Pages**: `app/admin/icon.webp` (custom admin icon)

## 📂 File Location

```
app/
├── icon.ico                    # Icon untuk halaman publik
└── admin/
    ├── icon.webp              # Icon untuk halaman admin
    └── layout.tsx             # Admin layout
```

## ⚙️ Configuration

Next.js 13+ menggunakan **file-based metadata API** untuk icons. Cukup letakkan file `icon.webp` di folder route dan Next.js akan otomatis menggunakannya.

### File Structure

```
app/
├── admin/
│   ├── icon.webp          ← Icon khusus untuk /admin/*
│   └── layout.tsx
└── icon.ico               ← Icon default untuk halaman lain
```

### Layout Configuration

`app/admin/layout.tsx` tidak perlu konfigurasi icon secara manual:

```typescript
export const metadata: Metadata = {
  title: 'Admin Dashboard — PTQ Amsa001',
  description: 'Dashboard admin pendaftaran santri baru PTQ Amsa001',
  robots: {
    index: false,
    follow: false,
  },
  // Tidak perlu icons config - Next.js otomatis gunakan icon.webp
};
```

## 🔍 How It Works

1. **File-Based Metadata**: Next.js otomatis detect file `icon.webp` di folder `app/admin/`
2. **Route-Specific**: Icon hanya berlaku untuk route `/admin/*`
3. **Automatic Priority**: File di folder lebih spesifik akan override file di parent folder

## 📋 Admin Pages

Halaman yang menggunakan icon admin:
- `/admin/pendaftaran` - Dashboard list pendaftaran
- `/admin/pendaftaran/[id]` - Detail pendaftaran

## 🎯 Benefits

- **Easy Identification**: User bisa dengan mudah membedakan tab admin dari tab publik
- **Professional Look**: Memberikan kesan profesional dengan branding yang konsisten
- **Zero Config**: Tidak perlu konfigurasi manual di metadata
- **Automatic**: Next.js otomatis handle icon berdasarkan file location

## 🔄 Updating Icon

Untuk mengganti icon admin:

1. **Replace File**: Ganti file `app/admin/icon.webp` dengan file baru
2. **Keep Filename**: Harus tetap bernama `icon.webp` (atau `icon.ico`, `icon.png`, `icon.svg`)
3. **Restart Dev Server**: Restart `npm run dev` untuk melihat perubahan
4. **Clear Cache**: Clear browser cache jika perlu

### Recommended Format

- **Format**: WebP (modern, efficient) atau ICO (universal support)
- **Size**: 32x32px atau 64x64px
- **Supported**: `.ico`, `.png`, `.svg`, `.webp`

## 🧪 Testing

Untuk memverifikasi icon:

1. **Restart dev server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Clear browser cache**: Hard refresh dengan `Ctrl + Shift + R`

3. **Buka halaman admin**:
   ```
   http://localhost:3000/admin/pendaftaran?pw=admin12345
   ```

4. **Cek tab browser** - harus menampilkan icon admin

5. **Bandingkan dengan halaman publik**:
   ```
   http://localhost:3000
   ```
   Tab ini harus menampilkan icon default (berbeda dari admin)

## 🐛 Troubleshooting

### Icon tidak berubah

1. **Restart dev server** - File-based metadata perlu server restart
2. **Clear browser cache** - Browser cache icon aggressively
3. **Hard refresh** - `Ctrl + Shift + R` (Windows) atau `Cmd + Shift + R` (Mac)
4. **Check file exists**: Pastikan `app/admin/icon.webp` ada
5. **Check file format**: Pastikan file valid WebP format

### Masih muncul icon Vercel

- Pastikan file `app/admin/icon.webp` ada dan valid
- Restart dev server
- Clear browser cache completely
- Coba gunakan incognito/private window

## 📝 Notes

- Icon admin hanya berlaku untuk route `/admin/*`
- Halaman publik tetap menggunakan `app/icon.ico`
- Browser cache icon sangat agresif - selalu clear cache saat testing
- Format WebP didukung oleh semua browser modern
- File-based metadata adalah cara recommended di Next.js 13+

## 🔗 Related Files

- `app/admin/icon.webp` - Admin icon file (file-based metadata)
- `app/admin/layout.tsx` - Admin layout
- `app/icon.ico` - Public icon file
- `app/layout.tsx` - Root layout (public pages)

## 📚 References

- [Next.js Metadata Files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)
- [Next.js File-based Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

---

**Last Updated:** 2026-05-19  
**Status:** ✅ Configured with File-based Metadata

