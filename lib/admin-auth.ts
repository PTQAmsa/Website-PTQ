import 'server-only';
import { createHash, createHmac } from 'crypto';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { safeEqual } from '@/lib/utils/secure-compare';

/**
 * Sesi admin berbasis cookie httpOnly.
 *
 * Password admin tidak lagi dibawa di URL (?pw=) atau dikirim ke browser.
 * Token sesi = "v1.<expiry>.<hmac>", ditandatangani dengan kunci turunan
 * ADMIN_PASSWORD — mengganti password otomatis mengeluarkan semua sesi.
 */

export const ADMIN_SESSION_COOKIE = 'ptq_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 jam

export const adminSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  // lax: link dari email notifikasi tetap membawa sesi, tetapi request
  // POST/PATCH lintas situs (CSRF) tidak membawa cookie.
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
};

function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

export function isAdminPasswordConfigured(): boolean {
  return getAdminPassword() !== null;
}

export function isAdminPasswordValid(input: string): boolean {
  const password = getAdminPassword();
  if (!password || !input) return false;
  return safeEqual(input, password);
}

function sign(payload: string, password: string): string {
  const key = createHash('sha256').update(`ptq-admin-session:${password}`).digest();
  return createHmac('sha256', key).update(payload).digest('base64url');
}

export function createAdminSessionToken(): string {
  const password = getAdminPassword();
  if (!password) throw new Error('ADMIN_PASSWORD belum di-set');
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `v1.${expiresAt}`;
  return `${payload}.${sign(payload, password)}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  const password = getAdminPassword();
  if (!password || !token) return false;

  const [version, expiresAtRaw, signature] = token.split('.');
  if (version !== 'v1' || !expiresAtRaw || !signature) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt * 1000 < Date.now()) return false;

  return safeEqual(signature, sign(`${version}.${expiresAtRaw}`, password));
}

/** Untuk server component (halaman admin). */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

/** Untuk route handler API admin. */
export function isAdminRequest(req: NextRequest): boolean {
  return verifyAdminSessionToken(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

/** Tujuan redirect setelah login — hanya halaman admin internal (cegah open redirect). */
export function safeAdminRedirectPath(next: unknown): string {
  if (typeof next === 'string' && /^\/admin\/[A-Za-z0-9/_-]*$/.test(next)) return next;
  return '/admin/pendaftaran';
}
