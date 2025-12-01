# 🏨 Sistem Ketersediaan Kamar Dinamis

Sistem ketersediaan kamar di aplikasi Wisata Oboss sudah sepenuhnya **OTOMATIS dan DINAMIS**. Ketersediaan kamar akan berubah secara real-time berdasarkan aktivitas pemesanan.

---

## 📊 Cara Kerja Sistem

### 1️⃣ **Saat Pemesanan Dibuat dengan Status Confirmed**
```
POST /api/pemesanan
Body: { ..., "status_pemesanan": "confirmed" }
```
**Otomatis terjadi:**
- ✅ `jumlah_tersedia` kamar **BERKURANG 1**
- ✅ Kamar ter-reserve untuk tamu tersebut

### 2️⃣ **Saat Status Pemesanan Diupdate**

#### a) Dari `pending` → `confirmed`
```
PUT /api/pemesanan/{id}
Body: { "status_pemesanan": "confirmed" }
```
**Otomatis terjadi:**
- ✅ `jumlah_tersedia` kamar **BERKURANG 1**
- ✅ Validasi: Gagal jika kamar tidak tersedia

#### b) Dari `confirmed` → `cancelled`
```
PUT /api/pemesanan/{id}
Body: { "status_pemesanan": "cancelled" }
```
**Otomatis terjadi:**
- ✅ `jumlah_tersedia` kamar **BERTAMBAH 1**
- ✅ Kamar kembali tersedia untuk tamu lain

#### c) Dari `pending` → `cancelled`
```
PUT /api/pemesanan/{id}
Body: { "status_pemesanan": "cancelled" }
```
**Otomatis terjadi:**
- ✅ Tidak ada perubahan ketersediaan (karena belum pernah di-reserve)

### 3️⃣ **Saat Check-In**
```
POST /api/pemesanan/{id}/check-in
```
**Otomatis terjadi:**
- ✅ Jika status masih `pending`: `jumlah_tersedia` kamar **BERKURANG 1**
- ✅ Jika sudah `confirmed`: Tidak double pengurangan
- ✅ Status berubah ke `confirmed`
- ✅ `is_checked_in` = true
- ✅ `actual_checkin` diisi dengan waktu sekarang

### 4️⃣ **Saat Check-Out**
```
POST /api/pemesanan/{id}/check-out
```
**Otomatis terjadi:**
- ✅ `jumlah_tersedia` kamar **BERTAMBAH 1**
- ✅ Status berubah ke `completed`
- ✅ `is_checked_out` = true
- ✅ `actual_checkout` diisi dengan waktu sekarang

### 5️⃣ **Saat Pemesanan Dihapus**
```
DELETE /api/pemesanan/{id}
```
**Otomatis terjadi:**
- ✅ Jika pemesanan `confirmed` atau sudah check-in: `jumlah_tersedia` kamar **BERTAMBAH 1**
- ✅ Jika pemesanan `pending`: Tidak ada perubahan ketersediaan

---

## 🔄 Skenario Lengkap

### Skenario 1: Pemesanan Normal
1. **Buat pemesanan**: `status_pemesanan = "pending"`
   - Ketersediaan: **Tidak berubah** ✅

2. **Konfirmasi pemesanan**: Update ke `"confirmed"`
   - Ketersediaan: **-1** ✅

3. **Tamu check-in**: POST `/check-in`
   - Ketersediaan: **Tidak berubah** (sudah dikurangi saat confirmed)
   - Status tracking: `is_checked_in = true`

4. **Tamu check-out**: POST `/check-out`
   - Ketersediaan: **+1** ✅
   - Status: `completed`

**Hasil akhir: Ketersediaan kembali ke jumlah semula** ✅

---

### Skenario 2: Pemesanan Langsung Confirmed
1. **Buat pemesanan confirmed**: `status_pemesanan = "confirmed"`
   - Ketersediaan: **-1** ✅

2. **Tamu check-in**: POST `/check-in`
   - Ketersediaan: **Tidak berubah** (tidak double pengurangan)

3. **Tamu check-out**: POST `/check-out`
   - Ketersediaan: **+1** ✅

**Hasil akhir: Ketersediaan kembali ke jumlah semula** ✅

---

### Skenario 3: Pembatalan Pemesanan
1. **Buat pemesanan confirmed**: `status_pemesanan = "confirmed"`
   - Ketersediaan: **-1** ✅

2. **Batalkan pemesanan**: Update ke `"cancelled"`
   - Ketersediaan: **+1** ✅

**Hasil akhir: Ketersediaan kembali ke jumlah semula** ✅

---

### Skenario 4: Hapus Pemesanan
1. **Buat pemesanan confirmed**: `status_pemesanan = "confirmed"`
   - Ketersediaan: **-1** ✅

2. **Hapus pemesanan**: DELETE `/pemesanan/{id}`
   - Ketersediaan: **+1** ✅

**Hasil akhir: Ketersediaan kembali ke jumlah semula** ✅

---

## 📋 Field Tracking di Database

Tabel `pemesanan` memiliki field tambahan:

| Field | Tipe | Keterangan |
|-------|------|------------|
| `is_checked_in` | boolean | Apakah sudah check-in |
| `is_checked_out` | boolean | Apakah sudah check-out |
| `actual_checkin` | datetime | Waktu aktual check-in |
| `actual_checkout` | datetime | Waktu aktual check-out |

---

## 🎯 API Endpoints

### Lihat Ketersediaan Kamar
```bash
GET /api/kamar-villa
```
Response akan menampilkan `jumlah_tersedia` yang real-time.

### Konfirmasi Pemesanan
```bash
PUT /api/pemesanan/{id}
Content-Type: application/json

{
  "status_pemesanan": "confirmed"
}
```

### Check-In
```bash
POST /api/pemesanan/{id}/check-in
```

### Check-Out
```bash
POST /api/pemesanan/{id}/check-out
```

### Batalkan Pemesanan
```bash
PUT /api/pemesanan/{id}
Content-Type: application/json

{
  "status_pemesanan": "cancelled"
}
```

---

## ✅ Validasi Otomatis

Sistem memiliki validasi built-in:

1. **Check-in gagal** jika:
   - Pemesanan sudah check-in
   - Kamar tidak tersedia (untuk pemesanan pending)

2. **Check-out gagal** jika:
   - Pemesanan belum check-in
   - Pemesanan sudah check-out

3. **Konfirmasi pemesanan gagal** jika:
   - Kamar tidak tersedia (jumlah_tersedia < 1)

---

## 🔍 Monitoring

### Cek Jumlah Pemesanan Aktif per Kamar
Endpoint `GET /api/kamar-villa` sudah menambahkan field:
```json
{
  "id_kamar": 1,
  "tipe_kamar": "Villa Deluxe",
  "jumlah_tersedia": 5,
  "jumlah_pemesanan_aktif": 3  // ← Kamar yang sedang ditempati
}
```

### Rumus Ketersediaan
```
Kamar Tersedia = Total Kamar - Pemesanan Confirmed (belum check-out)
```

---

## 🚀 Keunggulan Sistem

✅ **100% Otomatis** - Tidak perlu manual update ketersediaan  
✅ **Real-time** - Perubahan langsung tercermin di database  
✅ **Konsisten** - Tidak ada resiko double booking  
✅ **Trackable** - Semua perubahan tercatat dengan timestamp  
✅ **Reversible** - Pembatalan otomatis mengembalikan ketersediaan  
✅ **Safe** - Validasi built-in mencegah error

---

## 📝 Contoh Testing

### Test 1: Cek ketersediaan awal
```bash
curl http://localhost:8000/api/kamar-villa/1
# Response: "jumlah_tersedia": 5
```

### Test 2: Buat pemesanan confirmed
```bash
curl -X POST http://localhost:8000/api/pemesanan \
  -H "Content-Type: application/json" \
  -d '{
    "id_wisatawan": 1,
    "id_kamar": 1,
    "tgl_checkin": "2025-12-10",
    "tgl_checkout": "2025-12-12",
    "jumlah_tamu": 2,
    "status_pemesanan": "confirmed"
  }'
```

### Test 3: Cek ketersediaan lagi
```bash
curl http://localhost:8000/api/kamar-villa/1
# Response: "jumlah_tersedia": 4  ✅ BERKURANG 1
```

### Test 4: Batalkan pemesanan
```bash
curl -X PUT http://localhost:8000/api/pemesanan/1 \
  -H "Content-Type: application/json" \
  -d '{"status_pemesanan": "cancelled"}'
```

### Test 5: Cek ketersediaan terakhir
```bash
curl http://localhost:8000/api/kamar-villa/1
# Response: "jumlah_tersedia": 5  ✅ KEMBALI NORMAL
```

---

## 🎉 Kesimpulan

Sistem ketersediaan kamar sudah **SEPENUHNYA DINAMIS dan OTOMATIS**!  
Tidak perlu lagi manual update, semuanya ter-handle oleh sistem secara real-time.
