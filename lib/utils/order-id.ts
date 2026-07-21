/**
 * Generates a unique, URL-safe order ID for Midtrans payment tracking.
 *
 * Format: PSB-<timestamp>-<random6>
 * Example: PSB-1714500000000-a3f9k2
 *
 * The timestamp + random suffix ensures uniqueness even for concurrent submissions.
 */
export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PSB-${timestamp}-${random}`;
}
