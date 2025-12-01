# Testing Ketersediaan Kamar - Semua Skenario

## Setup Awal
- Kamar tersedia: **10 unit**
- ID Kamar: 1

---

## Test Case 1: Pending → Confirmed → Cancelled → Confirmed
**Initial**: 10 tersedia

### Step 1: Buat pemesanan pending
```bash
POST /api/pemesanan
Body: { "status_pemesanan": "pending" }
```
**Expected**: 10 tersedia (tidak berubah)
**Reason**: Status pending tidak mengunci kamar

### Step 2: Ubah ke confirmed
```bash
PUT /api/pemesanan/1
Body: { "status_pemesanan": "confirmed" }
```
**Expected**: 9 tersedia
**Reason**: Status confirmed mengunci kamar (-1)

### Step 3: Ubah ke cancelled
```bash
PUT /api/pemesanan/1
Body: { "status_pemesanan": "cancelled" }
```
**Expected**: 10 tersedia
**Reason**: Status cancelled release kamar (+1)

### Step 4: Ubah kembali ke confirmed
```bash
PUT /api/pemesanan/1
Body: { "status_pemesanan": "confirmed" }
```
**Expected**: 9 tersedia
**Reason**: Status confirmed mengunci kamar lagi (-1)

---

## Test Case 2: Confirmed → Completed → Confirmed
**Initial**: 10 tersedia

### Step 1: Buat pemesanan confirmed
```bash
POST /api/pemesanan
Body: { "status_pemesanan": "confirmed" }
```
**Expected**: 9 tersedia (-1)

### Step 2: Ubah ke completed
```bash
PUT /api/pemesanan/1
Body: { "status_pemesanan": "completed" }
```
**Expected**: 10 tersedia (+1)
**Reason**: Status completed release kamar

### Step 3: Ubah kembali ke confirmed (EDGE CASE)
```bash
PUT /api/pemesanan/1
Body: { "status_pemesanan": "confirmed" }
```
**Expected**: 9 tersedia (-1)
**Reason**: Status confirmed mengunci kamar lagi

---

## Test Case 3: Confirmed → Cancelled → Completed
**Initial**: 10 tersedia

### Step 1: Buat pemesanan confirmed
```bash
POST /api/pemesanan
Body: { "status_pemesanan": "confirmed" }
```
**Expected**: 9 tersedia (-1)

### Step 2: Ubah ke cancelled
```bash
PUT /api/pemesanan/1
Body: { "status_pemesanan": "cancelled" }
```
**Expected**: 10 tersedia (+1)

### Step 3: Ubah ke completed
```bash
PUT /api/pemesanan/1
Body: { "status_pemesanan": "completed" }
```
**Expected**: 10 tersedia (tidak berubah)
**Reason**: Cancelled tidak mengunci, completed tidak mengunci

---

## Test Case 4: Multiple Status Changes
**Initial**: 10 tersedia

### Sequence:
1. pending → 10 tersedia ✓
2. confirmed → 9 tersedia ✓
3. pending → 10 tersedia ✓
4. confirmed → 9 tersedia ✓
5. completed → 10 tersedia ✓
6. pending → 10 tersedia ✓
7. confirmed → 9 tersedia ✓
8. cancelled → 10 tersedia ✓

**Final Result**: 10 tersedia (kembali ke awal)

---

## Logic Baru yang Diimplementasikan

### Konsep "Occupied Status"
```php
// Status yang mengunci kamar (occupied)
$occupiedStatuses = ['confirmed'];

// Status yang tidak mengunci kamar (not occupied)
$notOccupiedStatuses = ['pending', 'completed', 'cancelled'];
```

### Rules:
1. **NOT occupied → occupied**: Kurangi ketersediaan (-1)
2. **Occupied → NOT occupied**: Tambah ketersediaan (+1)
3. **Occupied → occupied**: Tidak ada perubahan (0)
4. **NOT occupied → NOT occupied**: Tidak ada perubahan (0)

### Matrix Transisi:

| Dari ↓ / Ke → | pending | confirmed | completed | cancelled |
|---------------|---------|-----------|-----------|-----------|
| **pending**   | 0       | -1        | 0         | 0         |
| **confirmed** | +1      | 0         | +1*       | +1        |
| **completed** | 0       | -1        | 0         | 0         |
| **cancelled** | 0       | -1        | 0         | 0         |

*+1 dengan syarat belum check-out untuk menghindari double increment

---

## Verification Query

### Cek ketersediaan kamar:
```sql
SELECT id_kamar, tipe_kamar, jumlah_tersedia 
FROM kamar_villa 
WHERE id_kamar = 1;
```

### Cek semua pemesanan untuk kamar tertentu:
```sql
SELECT id_pemesanan, status_pemesanan, is_checked_in, is_checked_out
FROM pemesanan 
WHERE id_kamar = 1
ORDER BY id_pemesanan DESC;
```

### Hitung occupied rooms:
```sql
SELECT 
    COUNT(*) as occupied_count
FROM pemesanan 
WHERE id_kamar = 1 
    AND status_pemesanan = 'confirmed'
    AND is_checked_out = false;
```

---

## Edge Cases yang Ditangani

1. ✅ **Bolak-balik status**: confirmed → cancelled → confirmed
2. ✅ **Completed ke confirmed**: completed → confirmed (jarang tapi bisa)
3. ✅ **Check-out protection**: Jika sudah check-out, tidak double increment
4. ✅ **Multiple cancelled**: cancelled → cancelled (tidak ada perubahan)
5. ✅ **Validation**: Cek ketersediaan sebelum confirm

---

## Known Limitations

1. Saat ini hanya status `confirmed` yang mengunci kamar
2. Status `pending` tidak mengunci kamar (bisa jadi issue untuk high-demand rooms)
3. Tidak ada reservation expiry (pending bisa selamanya)

## Recommended Enhancements

1. **Time-based reservation**: Pending expire after X hours
2. **Soft lock for pending**: Reserve kamar sementara untuk pending
3. **Concurrent booking protection**: Database transaction + locking
4. **Audit log**: Track semua perubahan status dan ketersediaan
