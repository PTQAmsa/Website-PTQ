import type { NextRequest } from 'next/server';

export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Rate limiter sederhana di memori. Berlaku per instance serverless,
 * jadi sifatnya "best effort" — cukup untuk menahan spam/brute-force ringan.
 */
export function createRateLimiter({ windowMs, max }: { windowMs: number; max: number }) {
  const requestLogs = new Map<string, number[]>();

  return function isRateLimited(key: string): boolean {
    const now = Date.now();

    // Bersihkan entri kadaluarsa agar Map tidak tumbuh tanpa batas
    if (requestLogs.size > 5000) {
      for (const [k, timestamps] of requestLogs) {
        if (timestamps.every((t) => now - t >= windowMs)) requestLogs.delete(k);
      }
    }

    const active = (requestLogs.get(key) ?? []).filter((t) => now - t < windowMs);
    if (active.length >= max) {
      requestLogs.set(key, active);
      return true;
    }
    active.push(now);
    requestLogs.set(key, active);
    return false;
  };
}
