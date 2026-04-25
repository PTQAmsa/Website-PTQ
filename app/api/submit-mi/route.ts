import { NextRequest, NextResponse } from 'next/server';

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxyHqqvETFrPuEDZvRmQvmkhNhLd2DXoyT-pNlK--VXq1BDMMQh6jM2uA2P5hxR5TDlA/exec";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLogs = new Map<string, number[]>();

type SubmitMIPayload = {
  nama: string;
  whatsapp: string;
  email: string;
  top1?: string;
  top2?: string;
  top3?: string;
  skorDetail: string;
};

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return req.headers.get('x-real-ip') ?? 'unknown';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = requestLogs.get(key) ?? [];
  const activeTimestamps = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (activeTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLogs.set(key, activeTimestamps);
    return true;
  }

  activeTimestamps.push(now);
  requestLogs.set(key, activeTimestamps);
  return false;
}

function parsePayload(raw: unknown): SubmitMIPayload | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const payload = raw as Record<string, unknown>;
  const nama = typeof payload.nama === 'string' ? payload.nama.trim() : '';
  const whatsapp = typeof payload.whatsapp === 'string' ? payload.whatsapp.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const top1 = typeof payload.top1 === 'string' ? payload.top1.trim() : undefined;
  const top2 = typeof payload.top2 === 'string' ? payload.top2.trim() : undefined;
  const top3 = typeof payload.top3 === 'string' ? payload.top3.trim() : undefined;
  const skorDetail = typeof payload.skorDetail === 'string' ? payload.skorDetail.trim() : '';

  const isValidNama = nama.length >= 2 && nama.length <= 100;
  const isValidWhatsapp = /^\+?[0-9]{10,15}$/.test(whatsapp);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidSkorDetail = skorDetail.length >= 3 && skorDetail.length <= 500;
  const isValidTop = (value?: string) => !value || value.length <= 50;

  if (!isValidNama || !isValidWhatsapp || !isValidEmail || !isValidSkorDetail) {
    return null;
  }

  if (!isValidTop(top1) || !isValidTop(top2) || !isValidTop(top3)) {
    return null;
  }

  return {
    nama,
    whatsapp,
    email,
    top1,
    top2,
    top3,
    skorDetail,
  };
}

export async function POST(req: NextRequest) {
  const clientIP = getClientIP(req);
  if (isRateLimited(clientIP)) {
    return NextResponse.json(
      { status: 'error', message: 'Terlalu banyak request. Coba lagi beberapa menit.' },
      { status: 429 }
    );
  }

  try {
    const rawBody: unknown = await req.json();
    const body = parsePayload(rawBody);

    if (!body) {
      return NextResponse.json(
        { status: 'error', message: 'Payload tidak valid.' },
        { status: 400 }
      );
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const responseText = await response.text();
    let upstreamData: unknown = null;

    try {
      upstreamData = responseText ? JSON.parse(responseText) : null;
    } catch {
      upstreamData = { raw: responseText };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Gagal mengirim data ke layanan eksternal.',
          upstreamStatus: response.status,
          upstreamData,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      upstreamData ?? { status: 'success', message: 'Data berhasil dikirim.' }
    );
  } catch (err) {
    return NextResponse.json({ status: 'error', message: String(err) }, { status: 500 });
  }
}
