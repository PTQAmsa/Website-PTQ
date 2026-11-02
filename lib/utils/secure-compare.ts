import { createHash, timingSafeEqual } from 'crypto';

/**
 * Bandingkan dua string rahasia (password, token, signature) dalam waktu
 * konstan agar tidak bisa ditebak lewat timing attack.
 * Kedua sisi di-hash dulu supaya panjangnya selalu sama.
 */
export function safeEqual(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

/**
 * Cek header `Authorization: Bearer <secret>`.
 * Selalu false bila secret belum dikonfigurasi (fail closed).
 */
export function hasValidBearerToken(authHeader: string | null, secret: string | undefined): boolean {
  if (!secret || !authHeader) return false;
  return safeEqual(authHeader, `Bearer ${secret}`);
}
