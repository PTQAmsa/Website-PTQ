import { createHash } from 'crypto';
import type {
  PaymentLinkParams,
  PaymentLinkResponse,
  PaymentStatusResponse,
} from '@/lib/types/registration';

const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const BASE_URL = IS_PRODUCTION
  ? 'https://api.midtrans.com'
  : 'https://api.sandbox.midtrans.com';

function getServerKey(): string {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) {
    throw new Error('MIDTRANS_SERVER_KEY is not configured');
  }
  return key;
}

function getBasicAuthHeader(): string {
  const serverKey = getServerKey();
  // Midtrans Basic Auth: base64(serverKey + ":")
  const encoded = Buffer.from(`${serverKey}:`).toString('base64');
  return `Basic ${encoded}`;
}

/**
 * Creates a Midtrans payment link for a registration.
 * Calls POST /v1/payment-links on Midtrans API.
 */
export async function createPaymentLink(
  params: PaymentLinkParams
): Promise<PaymentLinkResponse> {
  const url = `${BASE_URL}/v1/payment-links`;

  const body = {
    transaction_details: {
      order_id: params.order_id,
      gross_amount: params.gross_amount,
    },
    customer_details: params.customer_details,
    item_details: params.item_details,
    usage_limit: 1,
    expiry: {
      duration: 24,
      unit: 'hours',
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBasicAuthHeader(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Midtrans API error (${response.status}): ${errorText}`
    );
  }

  const data = (await response.json()) as { payment_url: string; order_id: string };

  return {
    payment_url: data.payment_url,
    order_id: data.order_id,
  };
}

/**
 * Checks the payment status of an order via Midtrans API.
 * Calls GET /v2/{orderId}/status
 */
export async function checkPaymentStatus(
  orderId: string
): Promise<PaymentStatusResponse> {
  const url = `${BASE_URL}/v2/${encodeURIComponent(orderId)}/status`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: getBasicAuthHeader(),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Midtrans status check error (${response.status}): ${errorText}`
    );
  }

  return response.json() as Promise<PaymentStatusResponse>;
}

/**
 * Verifies the Midtrans callback signature.
 *
 * Midtrans signature formula:
 *   SHA-512(order_id + status_code + gross_amount + server_key)
 *
 * Returns true if the computed hash matches the incoming signature.
 */
export function verifyCallbackSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  incomingHash: string
): boolean {
  const serverKey = getServerKey();
  const raw = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const computed = createHash('sha512').update(raw).digest('hex');
  return computed === incomingHash;
}
