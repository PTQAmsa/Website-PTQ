#!/usr/bin/env node

/**
 * Script untuk test Midtrans callback endpoint secara manual
 * 
 * Usage:
 *   node scripts/test-callback.js <order_id>
 * 
 * Example:
 *   node scripts/test-callback.js PSB-1779109027046-Z115YL
 */

const crypto = require('crypto');
const https = require('https');
const http = require('http');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

if (!MIDTRANS_SERVER_KEY) {
  console.error('❌ MIDTRANS_SERVER_KEY tidak ditemukan di .env.local');
  process.exit(1);
}

// Get order_id from command line argument
const orderId = process.argv[2];

if (!orderId) {
  console.error('❌ Order ID tidak diberikan');
  console.log('\nUsage:');
  console.log('  node scripts/test-callback.js <order_id>');
  console.log('\nExample:');
  console.log('  node scripts/test-callback.js PSB-1779109027046-Z115YL');
  process.exit(1);
}

// Generate signature
const statusCode = '200';
const grossAmount = '200000.00';
const raw = `${orderId}${statusCode}${grossAmount}${MIDTRANS_SERVER_KEY}`;
const signature = crypto.createHash('sha512').update(raw).digest('hex');

// Prepare callback payload
const payload = {
  order_id: orderId,
  transaction_status: 'settlement',
  fraud_status: 'accept',
  gross_amount: grossAmount,
  status_code: statusCode,
  signature_key: signature,
  payment_type: 'bank_transfer',
  transaction_time: new Date().toISOString(),
};

console.log('🔧 Testing Midtrans Callback');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Order ID:', orderId);
console.log('Endpoint:', `${SITE_URL}/api/midtrans-callback`);
console.log('Signature:', signature.substring(0, 20) + '...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Parse URL
const url = new URL(`${SITE_URL}/api/midtrans-callback`);
const isHttps = url.protocol === 'https:';
const client = isHttps ? https : http;

// Prepare request options
const options = {
  hostname: url.hostname,
  port: url.port || (isHttps ? 443 : 80),
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Send request
const req = client.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📥 Response Status:', res.statusCode);
    console.log('📥 Response Body:', data);
    
    if (res.statusCode === 200) {
      console.log('\n✅ Callback berhasil dikirim!');
      console.log('\n📋 Langkah selanjutnya:');
      console.log('1. Cek log di terminal aplikasi');
      console.log('2. Cek database untuk memastikan status berubah ke "paid"');
      console.log('3. Cek payment_logs untuk melihat entry baru');
    } else {
      console.log('\n❌ Callback gagal!');
      console.log('Cek error message di atas untuk detail.');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('\n💡 Tips:');
  console.log('- Pastikan aplikasi Next.js sedang berjalan (npm run dev)');
  console.log('- Pastikan NEXT_PUBLIC_SITE_URL di .env.local sudah benar');
  console.log('- Jika menggunakan ngrok, pastikan ngrok masih running');
});

// Send payload
req.write(JSON.stringify(payload, null, 2));
req.end();
