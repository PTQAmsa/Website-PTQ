import { NextRequest, NextResponse, after } from 'next/server';
import { createRateLimiter, getClientIP } from '@/lib/utils/rate-limit';

// Apps Script URL — hanya untuk arsip spreadsheet, tidak mengirim email
const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_URL ??
  'https://script.google.com/macros/s/AKfycbxxyHqqvETFrPuEDZvRmQvmkhNhLd2DXoyT-pNlK--VXq1BDMMQh6jM2uA2P5hxR5TDlA/exec';

// 5 request per 10 menit per IP
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

// Email dihapus — hanya nama dan WhatsApp yang diperlukan untuk arsip
type SubmitMIPayload = {
  type: 'mi_result';
  nama: string;
  whatsapp: string;
  top1?: string;
  top2?: string;
  top3?: string;
  skorDetail: string;
};

function parsePayload(raw: unknown): SubmitMIPayload | null {
  if (!raw || typeof raw !== 'object') return null;

  const p = raw as Record<string, unknown>;
  const nama = typeof p.nama === 'string' ? p.nama.trim() : '';
  const whatsapp = typeof p.whatsapp === 'string' ? p.whatsapp.trim() : '';
  const top1 = typeof p.top1 === 'string' ? p.top1.trim() : undefined;
  const top2 = typeof p.top2 === 'string' ? p.top2.trim() : undefined;
  const top3 = typeof p.top3 === 'string' ? p.top3.trim() : undefined;
  const skorDetail = typeof p.skorDetail === 'string' ? p.skorDetail.trim() : '';

  if (nama.length < 2 || nama.length > 100) return null;
  if (!/^\+?[0-9]{10,15}$/.test(whatsapp)) return null;
  if (skorDetail.length < 3 || skorDetail.length > 500) return null;

  const isValidTop = (v?: string) => !v || v.length <= 50;
  if (!isValidTop(top1) || !isValidTop(top2) || !isValidTop(top3)) return null;

  return { type: 'mi_result', nama, whatsapp, top1, top2, top3, skorDetail };
}

export async function POST(req: NextRequest) {
  const clientIP = getClientIP(req);
  if (isRateLimited(clientIP)) {
    return NextResponse.json(
      { status: 'error', message: 'Terlalu banyak request. Coba lagi beberapa menit.' },
      { status: 429 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ status: 'error', message: 'Format request tidak valid.' }, { status: 400 });
  }

  const body = parsePayload(rawBody);
  if (!body) {
    return NextResponse.json({ status: 'error', message: 'Payload tidak valid.' }, { status: 400 });
  }

  // Kirim ke Apps Script untuk arsip spreadsheet setelah respons terkirim.
  // after() menahan fungsi Vercel tetap hidup sampai fetch selesai.
  after(() =>
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
      redirect: 'follow',
    }).catch((err) => console.error('[submit-mi] Apps Script error:', err))
  );

  return NextResponse.json({ status: 'success', message: 'Hasil tes berhasil disimpan.' });
}
