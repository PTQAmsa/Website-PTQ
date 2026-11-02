import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, adminSessionCookieOptions } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/pendaftaran', req.url), 303);
  res.cookies.set(ADMIN_SESSION_COOKIE, '', { ...adminSessionCookieOptions, maxAge: 0 });
  return res;
}
