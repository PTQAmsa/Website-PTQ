# Panduan Mengelola Artikel

## Struktur Folder

```
pesantren-landing/
├── data/
│   └── articles.ts          # File data artikel (edit di sini)
├── public/
│   └── artikel/             # Folder untuk foto artikel
│       ├── artikel-1.jpg
│       ├── artikel-2.jpg
│       └── ...
└── app/
    └── artikel/
        ├── page.tsx         # Halaman daftar artikel
        └── [slug]/
            └── page.tsx     # Halaman detail artikel
```

## Cara Menambah Artikel Baru

### 1. Upload Foto Artikel
- Masukkan foto artikel ke folder: `public/artikel/`
- Format nama file: `artikel-1.jpg`, `artikel-2.jpg`, dst
- Ukuran rekomendasi: 1200 x 675px (rasio 16:9)
- Format: JPG atau PNG

### 2. Edit File Data Artikel
Buka file: `data/articles.ts`

Tambahkan artikel baru ke dalam array `articles`:

```typescript
{
  id: '4',                                    // ID unik (angka berurutan)
  title: 'Judul Artikel Anda',               // Judul artikel
  slug: 'judul-artikel-anda',                // URL slug (huruf kecil, pakai dash)
  excerpt: 'Ringkasan singkat artikel...',   // Ringkasan 2-3 kalimat
  content: `
    <p>Paragraf pertama artikel.</p>
    
    <h3>Sub Judul</h3>
    <p>Konten di bawah sub judul.</p>
    
    <ul>
      <li>Poin pertama</li>
      <li>Poin kedua</li>
    </ul>
  `,
  image: '/artikel/artikel-4.jpg',           // Path foto artikel
  author: 'Admin PTQ Amsa',                  // Nama penulis
  date: '28 Februari 2026',                  // Tanggal publikasi
  category: 'Kegiatan'                       // Kategori artikel
}
```

### 3. Format Konten Artikel

Gunakan HTML tags untuk format konten:

- **Paragraf**: `<p>Teks paragraf</p>`
- **Sub Judul**: `<h3>Sub Judul</h3>`
- **Bold**: `<strong>teks tebal</strong>`
- **Italic**: `<em>teks miring</em>`
- **List**:
  ```html
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
  ```
- **Numbered List**:
  ```html
  <ol>
    <li>Item 1</li>
    <li>Item 2</li>
  </ol>
  ```
- **Link**: `<a href="https://example.com">Teks Link</a>`
- **Quote**: `<blockquote>Kutipan teks</blockquote>`

### 4. Kategori Artikel

Kategori yang tersedia:
- Kegiatan
- Pendidikan
- Tahfidz
- Tadabbur
- Ekstrakurikuler
- Kehidupan Santri
- Parenting
- Berita

## Contoh Artikel Lengkap

```typescript
{
  id: '5',
  title: 'Kegiatan Daurah Ramadhan 1448 H',
  slug: 'kegiatan-daurah-ramadhan-1448',
  excerpt: 'Pesantren Tadabbur Al-Qur\'an Amsa001 mengadakan kegiatan Daurah Ramadhan yang diikuti oleh seluruh santri. Kegiatan ini bertujuan untuk meningkatkan pemahaman Al-Qur\'an.',
  content: `
    <p>Alhamdulillah, Pesantren Tadabbur Al-Qur'an Amsa001 Gadog telah menyelenggarakan kegiatan Daurah Ramadhan 1448 H yang berlangsung selama bulan Ramadhan. Kegiatan ini diikuti oleh seluruh santri putra dan putri dengan antusias yang tinggi.</p>
    
    <h3>Tujuan Kegiatan</h3>
    <p>Daurah Ramadhan ini bertujuan untuk:</p>
    <ul>
      <li>Meningkatkan pemahaman santri terhadap Al-Qur'an</li>
      <li>Memperdalam ilmu tajwid dan tahsin</li>
      <li>Membangun karakter Islami yang kuat</li>
      <li>Mempererat ukhuwah Islamiyah antar santri</li>
    </ul>
    
    <h3>Rangkaian Acara</h3>
    <p>Kegiatan Daurah Ramadhan meliputi berbagai program menarik seperti kajian tafsir, tadabbur Al-Qur'an, tahsin, dan berbagai lomba Islami. Para santri juga mendapatkan kesempatan untuk berinteraksi langsung dengan para ustadz dan kyai.</p>
    
    <p>Semoga kegiatan ini dapat memberikan manfaat yang besar bagi para santri dalam meningkatkan kualitas spiritual dan intelektual mereka.</p>
  `,
  image: '/artikel/daurah-ramadhan.jpg',
  author: 'Ustadz Ahmad Fauzi',
  date: '15 Maret 2026',
  category: 'Kegiatan'
}
```

## Tips Menulis Artikel

1. **Judul**: Buat judul yang menarik dan informatif (maksimal 60 karakter)
2. **Excerpt**: Tulis ringkasan yang membuat pembaca penasaran (2-3 kalimat)
3. **Konten**: 
   - Gunakan paragraf pendek (3-4 kalimat)
   - Tambahkan sub judul untuk memecah konten panjang
   - Gunakan list untuk poin-poin penting
   - Minimal 300 kata untuk artikel yang baik
4. **Foto**: Gunakan foto berkualitas tinggi dan relevan dengan artikel
5. **Slug**: Buat slug yang SEO-friendly (huruf kecil, pakai dash, tanpa spasi)

## Menghapus Artikel

Untuk menghapus artikel, hapus object artikel dari array di file `data/articles.ts`

## Mengedit Artikel

Cari artikel berdasarkan ID atau slug di file `data/articles.ts`, lalu edit field yang diinginkan.
