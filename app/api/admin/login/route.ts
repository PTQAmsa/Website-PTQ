import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
  isAdminPasswordConfigured,
  isAdminPasswordValid,
  safeAdminRedirectPath,
} from '@/lib/admin-auth';
import { createRateLimiter, getClientIP } from '@/lib/utils/rate-limit';

// Maksimal 10 percobaan login per IP dalam 15 menit
const isRateLimited = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

function redirectTo(req: NextRequest, path: string, error?: string) {
  const url = new URL(path, req.url);
  if (error) url.searchParams.set('error', error);
  // 303: browser mengikuti redirect dengan GET setelah POST form
  return NextResponse.redirect(url, 303);
}

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const next = safeAdminRedirectPath(form?.get('next'));
  const password = form?.get('password');

  if (!isAdminPasswordConfigured()) {
    return redirectTo(req, next, 'config');
  }

  // Cek limit sebelum memeriksa password, supaya brute-force tetap tertahan
  if (isRateLimited(getClientIP(req))) {
    return redirectTo(req, next, 'limit');
  }

  if (typeof password !== 'string' || !isAdminPasswordValid(password)) {
    return redirectTo(req, next, 'invalid');
  }

  const res = redirectTo(req, next);
  res.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), adminSessionCookieOptions);
  return res;
}
