# Testing Midtrans Callback Manually

## Cara Test Callback Endpoint

Anda bisa test callback endpoint secara manual untuk memastikan semuanya berfungsi dengan baik.

### 1. Dapatkan Order ID dari Database

```sql
SELECT id, nama_lengkap, order_id, payment_status 
FROM pendaftaran_santri 
WHERE payment_status = 'pending' 
LIMIT 1;
```

### 2. Generate Signature

Signature dihitung dengan formula:
```
SHA512(order_id + status_code + gross_amount + server_key)
```

Gunakan script Node.js ini untuk generate signature:

```javascript
const crypto = require('crypto');

const orderId = 'PSB-1779109027046-Z115YL'; // Ganti dengan order_id dari database
const statusCode = '200';
const grossAmount = '200000.00';
const serverKey = process.env.MIDTRANS_SERVER_KEY; // Dari .env.local

const raw = `${orderId}${statusCode}${grossAmount}${serverKey}`;
const signature = crypto.createHash('sha512').update(raw).digest('hex');

console.log('Signature:', signature);
```

Atau gunakan online tool: https://emn178.github.io/online-tools/sha512.html

Input string (contoh):
```
PSB-1779109027046-Z115YL200200000.00YOUR_MIDTRANS_SERVER_KEY
```

**Note:** Ganti `YOUR_MIDTRANS_SERVER_KEY` dengan server key Anda dari `.env.local`

### 3. Test dengan cURL

```bash
curl -X POST http://localhost:3000/api/midtrans-callback \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "PSB-1779109027046-Z115YL",
    "transaction_status": "settlement",
    "fraud_status": "accept",
    "gross_amount": "200000.00",
    "status_code": "200",
    "signature_key": "SIGNATURE_DARI_STEP_2",
    "payment_type": "bank_transfer",
    "transaction_time": "2024-01-15 10:30:00"
  }'
```

### 4. Test dengan Postman

1. Buat request baru: `POST http://localhost:3000/api/midtrans-callback`
2. Set Headers:
   ```
   Content-Type: application/json
   ```
3. Set Body (raw JSON):
   ```json
   {
     "order_id": "PSB-1779109027046-Z115YL",
     "transaction_status": "settlement",
     "fraud_status": "accept",
     "gross_amount": "200000.00",
     "status_code": "200",
     "signature_key": "SIGNATURE_DARI_STEP_2",
     "payment_type": "bank_transfer",
     "transaction_time": "2024-01-15 10:30:00"
   }
   ```

### 5. Verifikasi Hasil

Setelah mengirim request, cek:

1. **Response dari API** (harus `{"status":"ok"}`):
   ```json
   {"status":"ok"}
   ```

2. **Log di terminal aplikasi**:
   ```
   [midtrans-callback] Received notification: { order_id: 'PSB-...', transaction_status: 'settlement', ... }
   [midtrans-callback] Looking for registration with order_id: PSB-...
   [midtrans-callback] Found exact match: uuid-...
   [midtrans-callback] Processed order_id PSB-...: pending → paid
   ```

3. **Database `pendaftaran_santri`**:
   ```sql
   SELECT id, nama_lengkap, payment_status, payment_date, payment_method
   FROM pendaftaran_santri
   WHERE order_id = 'PSB-1779109027046-Z115YL';
   ```
   
   Hasilnya harus:
   - `payment_status` = `'paid'`
   - `payment_date` = timestamp saat ini
   - `payment_method` = `'bank_transfer'`

4. **Database `payment_logs`**:
   ```sql
   SELECT * FROM payment_logs
   WHERE order_id = 'PSB-1779109027046-Z115YL'
   ORDER BY created_at DESC;
   ```
   
   Harus ada entry baru dengan:
   - `action` = `'payment_received'`
   - `performed_by` = `'system'`
   - `details` berisi informasi transaksi

## Test Different Transaction Status

### Settlement (Berhasil)
```json
{
  "transaction_status": "settlement",
  "fraud_status": "accept"
}
```
Expected: `payment_status` → `'paid'`

### Capture (Berhasil dengan fraud check)
```json
{
  "transaction_status": "capture",
  "fraud_status": "accept"
}
```
Expected: `payment_status` → `'paid'`

### Pending
```json
{
  "transaction_status": "pending"
}
```
Expected: `payment_status` → `'pending'` (no change)

### Failed
```json
{
  "transaction_status": "deny"
}
```
Expected: `payment_status` → `'failed'`

### Expired
```json
{
  "transaction_status": "expire"
}
```
Expected: `payment_status` → `'expired'`

## Troubleshooting

### Error: "Invalid signature"

- Pastikan signature dihitung dengan benar
- Pastikan `MIDTRANS_SERVER_KEY` di `.env.local` sama dengan yang digunakan untuk generate signature
- Pastikan format `gross_amount` adalah `"200000.00"` (dengan 2 desimal)

### Error: "Registration not found"

- Pastikan `order_id` ada di database
- Cek apakah order_id di database sama persis dengan yang dikirim
- Jika Midtrans menambahkan suffix timestamp, endpoint akan otomatis mencoba prefix match

### Status tidak berubah

- Cek log di terminal untuk error messages
- Pastikan database connection berfungsi
- Cek apakah ada RLS (Row Level Security) policy yang memblokir update

### Email tidak terkirim

- Email dikirim secara non-blocking, jadi tidak akan mempengaruhi update status
- Cek log untuk error message dari email service
- Pastikan `APPS_SCRIPT_URL` dan `ADMIN_EMAIL` sudah dikonfigurasi di `.env.local`
