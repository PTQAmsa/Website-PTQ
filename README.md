# Landing Page Pesantren Tadabbur Al-Qur'an Amsa001

Landing page modern untuk pesantren yang dibangun dengan Next.js 15 dan Tailwind CSS.

## Fitur

- ✨ Desain modern dan responsif
- 🎨 Tailwind CSS untuk styling
- ⚡ Next.js 15 dengan App Router
- 📱 Mobile-friendly
- 🎯 SEO optimized

## Struktur Halaman

1. **Hero Section** - Banner utama dengan CTA
2. **About Section** - Informasi tentang pesantren
3. **Programs Section** - Program unggulan pesantren
4. **Facilities Section** - Fasilitas yang tersedia
5. **Contact Section** - Informasi kontak dan pendaftaran
6. **Footer** - Informasi tambahan dan social media

## Cara Menjalankan

```bash
# Masuk ke folder project
cd pesantren-landing

# Install dependencies (jika belum)
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Cara Build untuk Production

```bash
npm run build
npm start
```

## Kustomisasi

Anda dapat mengubah konten di file-file berikut:

- `components/Hero.tsx` - Banner utama
- `components/About.tsx` - Informasi pesantren
- `components/Programs.tsx` - Program unggulan
- `components/Facilities.tsx` - Fasilitas
- `components/Contact.tsx` - Kontak dan jam operasional
- `components/Footer.tsx` - Footer

## Teknologi

- [Next.js 15](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Setup Supabase Pendaftaran Santri

1. Isi env di `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

2. Jalankan SQL setup di Supabase SQL Editor:
   - file: `supabase/registration_setup.sql`

3. Pastikan bucket `dokumen-santri` sudah public, lalu test submit form dari halaman pendaftaran.
