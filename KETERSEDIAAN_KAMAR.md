# 🏨 Sistem Ketersediaan Kamar Dinamis

Sistem ketersediaan kamar di aplikasi Wisata Oboss sudah sepenuhnya **OTOMATIS dan DINAMIS**. Ketersediaan kamar akan berubah secara real-time berdasarkan aktivitas pemesanan.

---

## 🎯 Konsep Dasar: Occupied Status

Sistem bekerja dengan konsep **"Occupied Status"** - status yang mengunci/tidak mengunci kamar:

### Status yang MENGUNCI Kamar (Occupied):
- ✅ **`confirmed`** - Kamar sudah dipastikan untuk tamu tertentu

### Status yang TIDAK Mengunci Kamar (Not Occupied):
- ⭕ **`pending`** - Pemesanan belum dikonfirmasi
- ⭕ **`completed`** - Tamu sudah selesai menginap
- ⭕ **`cancelled`** - Pemesanan dibatalkan

### Aturan Perubahan Ketersediaan:
| Transisi | Perubahan Ketersediaan | Contoh |
|----------|------------------------|--------|
| **Not Occupied → Occupied** | **-1** (kurangi) | `pending` → `confirmed` |
| **Occupied → Not Occupied** | **+1** (tambah) | `confirmed` → `cancelled` |
| **Occupied → Occupied** | **0** (tidak berubah) | `confirmed` → `confirmed` |
| **Not Occupied → Not Occupied** | **0** (tidak berubah) | `pending` → `cancelled` |

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

Sistem secara otomatis mendeteksi transisi status dan menyesuaikan ketersediaan:

#### a) Dari `pending` → `confirmed`
```
PUT /api/pemesanan/{id}
Body: { "status_pemesanan": "confirmed" }
```
**Otomatis terjadi:**
- ✅ `jumlah_tersedia` kamar **BERKURANG 1**
- ✅ Validasi: Gagal jika kamar tidak tersedia
- 📌 **Alasan**: Not occupied → Occupied

#### b) Dari `confirmed` → `cancelled`
```
PUT /api/pemesanan/{id}
Body: { "status_pemesanan": "cancelled" }
```
**Otomatis terjadi:**
- ✅ `jumlah_tersedia` kamar **BERTAMBAH 1**
- ✅ Kamar kembali tersedia untuk tamu lain
- 📌 **Alasan**: Occupied → Not occupied

#### c) Dari `pending` → `cancelled`
```
PUT /api/pemesanan/{id}
Body: { "status_pemesanan": "cancelled" }
```
**Otomatis terjadi:**
- ⭕ **Tidak ada perubahan ketersediaan**
- 📌 **Alasan**: Not occupied → Not occupied (belum pernah di-reserve)

#### d) Dari `confirmed` → `completed`
```
PUT /api/pemesanan/{id}
Body: { "status_pemesanan": "completed" }
```
**Otomatis terjadi:**
- ✅ `jumlah_tersedia` kamar **BERTAMBAH 1**
- ✅ Kamar kembali tersedia untuk tamu lain
- 📌 **Alasan**: Occupied → Not occupied

#### e) Dari `cancelled` → `confirmed` (Re-confirm)
```
PUT /api/pemesanan/{id}
Body: { "status_pemesanan": "confirmed" }
```
**Otomatis terjadi:**
- ✅ `jumlah_tersedia` kamar **BERKURANG 1**
- 📌 **Alasan**: Not occupied → Occupied (pemesanan di-aktifkan kembali)

#### f) Dari `completed` → `confirmed` (Edge case)
```
PUT /api/pemesanan/{id}
Body: { "status_pemesanan": "confirmed" }
```
**Otomatis terjadi:**
- ✅ `jumlah_tersedia` kamar **BERKURANG 1**
- 📌 **Alasan**: Not occupied → Occupied (jarang terjadi, tapi sistem handle)

### 3️⃣ **Saat Check-In**
```
POST /api/pemesanan/{id}/check-in
```
**Otomatis terjadi:**
- ✅ Jika status masih `pending`: Otomatis menjadi `confirmed` → `jumlah_tersedia` **BERKURANG 1**
- ✅ Jika sudah `confirmed`: Tidak ada perubahan ketersediaan (sudah occupied)
- ✅ `is_checked_in` = true
- ✅ `actual_checkin` diisi dengan waktu sekarang
- 📌 **Alasan**: Check-in = Kamar pasti occupied, sistem adjust jika belum di-reserve

### 4️⃣ **Saat Check-Out**
```
POST /api/pemesanan/{id}/check-out
```
**Otomatis terjadi:**
- ✅ Status berubah ke `completed`
- ✅ `jumlah_tersedia` kamar **BERTAMBAH 1** (jika belum check-out sebelumnya)
- ✅ `is_checked_out` = true
- ✅ `actual_checkout` diisi dengan waktu sekarang
- 📌 **Alasan**: Check-out = Kamar menjadi not occupied, otomatis restore availability
- ⚠️ **Proteksi**: Tidak double-increment jika status sudah `completed` sebelumnya

### 5️⃣ **Saat Pemesanan Dihapus**
```
DELETE /api/pemesanan/{id}
```
**Otomatis terjadi:**
- ✅ Jika pemesanan `confirmed` dan belum check-out: `jumlah_tersedia` kamar **BERTAMBAH 1**
- ⭕ Jika pemesanan `pending`, `cancelled`, atau sudah `completed`: Tidak ada perubahan
- 📌 **Alasan**: Hapus pemesanan yang masih occupied = Free up room


## 🔄 Skenario Lengkap

### Skenario 1: Pemesanan Normal
1. **Buat pemesanan**: `status_pemesanan = "pending"`
   - Ketersediaan: **Tidak berubah** (Not occupied)

2. **Konfirmasi pemesanan**: Update ke `"confirmed"`
   - Ketersediaan: **-1** (Transisi: Not occupied → Occupied)

3. **Tamu check-in**: POST `/check-in`
   - Ketersediaan: **Tidak berubah** (Sudah occupied sejak confirmed)
   - Status tracking: `is_checked_in = true`, `actual_checkin` recorded

4. **Tamu check-out**: POST `/check-out`
   - Ketersediaan: **+1** (Transisi: Occupied → Not occupied)
   - Status: `completed`, `is_checked_out = true`

### Skenario 2: Pembatalan Setelah Konfirmasi
1. **Pemesanan**: `pending` → `confirmed`
   - Ketersediaan: **-1** (10 → 9)

2. **Pembatalan**: `confirmed` → `cancelled`
   - Ketersediaan: **+1** (9 → 10, kamar kembali available)

### Skenario 3: Admin Mengubah Status Berkali-kali (Edge Case)
**Kondisi awal**: Kamar tersedia = 10

1. **Admin confirm pemesanan**: `pending` → `confirmed`
   - Ketersediaan: 10 → **9** (Transisi: Not occupied → Occupied)

2. **Admin batalkan**: `confirmed` → `cancelled`
   - Ketersediaan: 9 → **10** (Transisi: Occupied → Not occupied)

3. **Admin confirm lagi**: `cancelled` → `confirmed`
   - Ketersediaan: 10 → **9** (Transisi: Not occupied → Occupied)

4. **Admin set completed**: `confirmed` → `completed`
   - Ketersediaan: 9 → **10** (Transisi: Occupied → Not occupied)

5. **Admin confirm lagi**: `completed` → `confirmed`
   - Ketersediaan: 10 → **9** (Transisi: Not occupied → Occupied)

**Hasil**: Ketersediaan tetap **konsisten** ✅
- Sistem tidak "ngaco" atau "nambah-nambah gajelas"
- Setiap transisi hanya peduli: Apakah status berubah dari occupied ke not-occupied atau sebaliknya?
- Tidak ada kumulatif error meski admin ubah status puluhan kali

### Skenario 4: Check-in Tanpa Konfirmasi
1. **Pemesanan**: `status_pemesanan = "pending"`
   - Ketersediaan: **Tidak berubah** (10 tetap 10)

2. **Check-in langsung**: POST `/check-in`
   - Ketersediaan: **-1** (10 → 9, otomatis di-reserve)
   - Status: Otomatis menjadi `confirmed`

3. **Check-out**: POST `/check-out`
   - Ketersediaan: **+1** (9 → 10)
   - Status: `completed`
   - Status: `completed`

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

### Selesaikan Pemesanan (Complete)
```bash
PUT /api/pemesanan/{id}
Content-Type: application/json

{
  "status_pemesanan": "completed"
}
```
**Catatan**: Ini akan mengembalikan ketersediaan kamar jika belum melalui proses check-out

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
   - Pemesanan sudah check-in sebelumnya
   - Kamar tidak tersedia (untuk pemesanan pending yang belum di-reserve)

2. **Check-out gagal** jika:
   - Pemesanan belum check-in
   - Pemesanan sudah check-out sebelumnya

3. **Konfirmasi pemesanan gagal** jika:
   - Kamar tidak tersedia (`jumlah_tersedia < 1`)
   - Mencegah overbooking secara otomatis

---

## 🔍 Monitoring & Debugging

### Cek Jumlah Pemesanan Aktif per Kamar
Endpoint `GET /api/kamar-villa` menampilkan:
```json
{
  "id_kamar": 1,
  "tipe_kamar": "Villa Deluxe",
  "jumlah_kamar": 10,
  "jumlah_tersedia": 7,
  "pemesanan_aktif": 3
}
```

### Rumus Ketersediaan
```
Kamar Tersedia = Total Kamar - Pemesanan dengan status "confirmed" (yang belum check-out)
```

### Query untuk Verifikasi Manual
Lihat dokumen `TESTING_KETERSEDIAAN.md` untuk query SQL lengkap:
- Cek total occupied bookings per kamar
- Validasi konsistensi `jumlah_tersedia`
- Audit trail status transitions

---

## 🚀 Keunggulan Sistem Baru

✅ **100% Otomatis** - Tidak perlu manual update ketersediaan  
✅ **Real-time** - Perubahan langsung tercermin di database  
✅ **Konsisten** - Admin bisa ubah status berkali-kali tanpa error kumulatif  
✅ **Trackable** - Semua perubahan tercatat dengan timestamp  
✅ **Reversible** - Pembatalan otomatis mengembalikan ketersediaan  
✅ **Safe** - Validasi built-in mencegah overbooking  
✅ **Bulletproof** - Sistem menggunakan occupied/not-occupied state, bukan specific transitions

---

## 🧪 Testing Guidelines

Lihat file `TESTING_KETERSEDIAAN.md` untuk:
- Test Case 1-4 (semua kombinasi status transition)
- Transition Matrix (16 kombinasi)
- SQL queries untuk manual verification
- Edge cases dan known limitations

### Quick Test: Admin Status Changes
```bash
# Starting: Kamar tersedia = 10

# 1. Confirm booking
curl -X PUT http://localhost:8000/api/pemesanan/1 \
  -d '{"status_pemesanan":"confirmed"}'
# Expected: Tersedia = 9

# 2. Cancel it
curl -X PUT http://localhost:8000/api/pemesanan/1 \
  -d '{"status_pemesanan":"cancelled"}'
# Expected: Tersedia = 10 (restored)

# 3. Confirm again
curl -X PUT http://localhost:8000/api/pemesanan/1 \
  -d '{"status_pemesanan":"confirmed"}'
# Expected: Tersedia = 9 (re-reserved)

# 4. Complete it
curl -X PUT http://localhost:8000/api/pemesanan/1 \
  -d '{"status_pemesanan":"completed"}'
# Expected: Tersedia = 10 (restored)

# 5. Confirm again (edge case)
curl -X PUT http://localhost:8000/api/pemesanan/1 \
  -d '{"status_pemesanan":"confirmed"}'
# Expected: Tersedia = 9 (system handles gracefully)

# Final result: Tersedia ALWAYS accurate, no cumulative errors ✅
```

---

## 🎉 Kesimpulan

Sistem ketersediaan kamar sudah **SEPENUHNYA DINAMIS dan OTOMATIS**!

### Perbaikan Terbaru (v2.0)
- ✅ **Fixed**: Bug "ketersediaan ngaco" saat admin ubah status berkali-kali
- ✅ **Architecture**: Dari transition-based → state-based (occupied/not-occupied)
- ✅ **Bulletproof**: Bisa handle semua kombinasi status changes tanpa error kumulatif
- ✅ **Testing**: Comprehensive test cases tersedia di `TESTING_KETERSEDIAAN.md`

### Tidak Perlu Lagi:
- ❌ Manual update ketersediaan
- ❌ Worry tentang admin ubah-ubah status
- ❌ Takut availability "nambah-nambah gajelas"

### Semuanya Otomatis:
- ✅ Booking confirmed → Kamar occupied
- ✅ Booking cancelled/completed → Kamar available
- ✅ Check-in/check-out → Tracked dengan timestamp
- ✅ Real-time updates across all endpoints

