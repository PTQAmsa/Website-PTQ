#!/usr/bin/env node

/**
 * Script untuk cek status pembayaran dari Midtrans API
 * 
 * Usage:
 *   node scripts/check-payment-status.js <order_id>
 * 
 * Example:
 *   node scripts/check-payment-status.js PSB-1779109027046-Z115YL
 */

const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const BASE_URL = IS_PRODUCTION
  ? 'api.midtrans.com'
  : 'api.sandbox.midtrans.com';

if (!MIDTRANS_SERVER_KEY) {
  console.error('❌ MIDTRANS_SERVER_KEY tidak ditemukan di .env.local');
  process.exit(1);
}

// Get order_id from command line argument
const orderId = process.argv[2];

if (!orderId) {
  console.error('❌ Order ID tidak diberikan');
  console.log('\nUsage:');
  console.log('  node scripts/check-payment-status.js <order_id>');
  console.log('\nExample:');
  console.log('  node scripts/check-payment-status.js PSB-1779109027046-Z115YL');
  process.exit(1);
}

// Prepare Basic Auth header
const auth = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64');

console.log('🔍 Checking Payment Status from Midtrans');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Order ID:', orderId);
console.log('Environment:', IS_PRODUCTION ? 'Production' : 'Sandbox');
console.log('API URL:', `https://${BASE_URL}/v2/${orderId}/status`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Prepare request options
const options = {
  hostname: BASE_URL,
  path: `/v2/${encodeURIComponent(orderId)}/status`,
  method: 'GET',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
  },
};

// Send request
const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📥 Response Status:', res.statusCode);
    
    if (res.statusCode === 200) {
      const response = JSON.parse(data);
      
      console.log('\n✅ Payment Status Found!\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Order ID:', response.order_id);
      console.log('Transaction Status:', response.transaction_status);
      console.log('Fraud Status:', response.fraud_status || 'N/A');
      console.log('Payment Type:', response.payment_type || 'N/A');
      console.log('Gross Amount:', response.gross_amount);
      console.log('Transaction Time:', response.transaction_time);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // Show status mapping
      console.log('📊 Status Mapping:');
      if (response.transaction_status === 'settlement') {
        console.log('   → Will be mapped to: PAID ✅');
      } else if (response.transaction_status === 'capture' && response.fraud_status === 'accept') {
        console.log('   → Will be mapped to: PAID ✅');
      } else if (response.transaction_status === 'pending') {
        console.log('   → Will be mapped to: PENDING ⏳');
      } else if (response.transaction_status === 'expire') {
        console.log('   → Will be mapped to: EXPIRED ⏰');
      } else if (['cancel', 'deny'].includes(response.transaction_status)) {
        console.log('   → Will be mapped to: FAILED ❌');
      } else {
        console.log('   → Unknown status');
      }
      
      // Show full response
      console.log('\n📄 Full Response:');
      console.log(JSON.stringify(response, null, 2));
      
    } else if (res.statusCode === 404) {
      console.log('\n❌ Order ID tidak ditemukan di Midtrans');
      console.log('\n💡 Kemungkinan penyebab:');
      console.log('- Order ID salah atau belum pernah dibuat payment link');
      console.log('- Menggunakan environment yang salah (sandbox vs production)');
      console.log('- Payment link belum pernah dibuka oleh user');
      
    } else {
      console.log('\n❌ Error Response:');
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('\n💡 Tips:');
  console.log('- Pastikan koneksi internet aktif');
  console.log('- Pastikan MIDTRANS_SERVER_KEY di .env.local sudah benar');
  console.log('- Pastikan MIDTRANS_IS_PRODUCTION sesuai dengan environment yang digunakan');
});

req.end();
