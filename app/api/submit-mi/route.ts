import { NextRequest, NextResponse } from 'next/server';

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxyHqqvETFrPuEDZvRmQvmkhNhLd2DXoyT-pNlK--VXq1BDMMQh6jM2uA2P5hxR5TDlA/exec";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ status: 'error', message: String(err) }, { status: 500 });
  }
}
