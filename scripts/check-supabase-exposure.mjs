#!/usr/bin/env node

/**
 * Cek apakah data pendaftar masih bisa dibaca publik.
 *
 * Script ini berperan sebagai "orang asing": hanya memakai anon key (yang
 * memang terlihat di JavaScript browser) lalu mencoba membaca tabel dan
 * dokumen. Tidak ada data pribadi yang dicetak — hanya jumlah baris.
 *
 * Usage:
 *   npm run check:exposure
 *
 * Hasil yang diharapkan setelah supabase/security_hardening.sql dijalankan:
 *   semua ✅. Lihat docs/SECURITY_HARDENING.md
 */

import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', quiet: true });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY tidak ditemukan di .env.local');
  process.exit(1);
}

const headers = { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` };

async function countReadableRows(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id`, {
    method: 'HEAD',
    headers: { ...headers, Prefer: 'count=exact' },
  });
  if (!res.ok) return { exposed: false, detail: `ditolak (HTTP ${res.status})` };
  const total = Number((res.headers.get('content-range') || '*/0').split('/')[1]) || 0;
  return total > 0
    ? { exposed: true, detail: `${total} baris bisa dibaca publik` }
    : { exposed: false, detail: '0 baris terlihat' };
}

async function canWriteRows(table) {
  // PATCH dengan filter yang tidak akan pernah cocok — tidak mengubah data apa pun.
  // 401/403 = ditolak (aman). 200/204 = role anon masih punya hak UPDATE.
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?id=eq.00000000-0000-0000-0000-000000000000`,
    {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ updated_at: new Date().toISOString() }),
    }
  );
  return res.ok
    ? { exposed: true, detail: `anon masih punya hak UPDATE (HTTP ${res.status})` }
    : { exposed: false, detail: `ditolak (HTTP ${res.status})` };
}

async function listDocuments() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/dokumen-santri`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: 'pendaftaran', limit: 1000 }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) return { exposed: false, detail: `ditolak (HTTP ${res.status})` };
  const count = Array.isArray(body) ? body.length : 0;
  return count > 0
    ? { exposed: true, detail: `${count} folder dokumen bisa didaftar publik` }
    : { exposed: false, detail: '0 folder terlihat' };
}

{
  console.log(`\n🔎 Cek paparan data publik: ${SUPABASE_URL}\n`);

  const checks = [
    ['Baca tabel pendaftaran_santri', () => countReadableRows('pendaftaran_santri')],
    ['Baca tabel payment_logs', () => countReadableRows('payment_logs')],
    ['Ubah tabel pendaftaran_santri', () => canWriteRows('pendaftaran_santri')],
    ['Daftar file bucket dokumen-santri', () => listDocuments()],
  ];

  let exposedCount = 0;
  for (const [label, run] of checks) {
    try {
      const { exposed, detail } = await run();
      if (exposed) exposedCount++;
      console.log(`${exposed ? '❌' : '✅'} ${label}: ${detail}`);
    } catch (err) {
      console.log(`⚠️  ${label}: gagal dicek (${err.message}) — project Supabase sedang ter-pause?`);
    }
  }

  console.log(
    exposedCount === 0
      ? '\n✅ Data pendaftar tidak bisa diakses publik.\n'
      : `\n❌ ${exposedCount} celah masih terbuka. Ikuti docs/SECURITY_HARDENING.md\n`
  );
  process.exit(exposedCount === 0 ? 0 : 1);
}
