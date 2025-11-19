# API Documentation - Wisata Oboss

Base URL: `http://localhost:8000/api`

## Authentication

Currently, the API does not require authentication. This will be added in future versions.

## Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": {
    "field": ["validation error"]
  }
}
```

---

## Wisatawan Endpoints

### 1. Get All Wisatawan
Get paginated list of all wisatawan (tourists).

**Endpoint:** `GET /api/wisatawan`

**Response:**
```json
{
  "current_page": 1,
  "data": [
    {
      "id_wisatawan": 1,
      "nama": "John Doe",
      "email": "john@example.com",
      "no_telp": "081234567890",
      "alamat": "Jl. Merdeka No. 123",
      "tanggal_daftar": "2025-11-18T10:30:00.000000Z",
      "created_at": "2025-11-18T10:30:00.000000Z",
      "updated_at": "2025-11-18T10:30:00.000000Z"
    }
  ],
  "per_page": 10,
  "total": 1
}
```

### 2. Create Wisatawan
Create a new wisatawan.

**Endpoint:** `POST /api/wisatawan`

**Request Body:**
```json
{
  "nama": "Jane Smith",
  "email": "jane@example.com",
  "no_telp": "081234567891",
  "alamat": "Jl. Sudirman No. 456"
}
```

**Validation Rules:**
- `nama`: required, string, max:100
- `email`: required, email, unique
- `no_telp`: nullable, string, max:20
- `alamat`: nullable, string, max:255

**Response:** `201 Created`
```json
{
  "id_wisatawan": 2,
  "nama": "Jane Smith",
  "email": "jane@example.com",
  "no_telp": "081234567891",
  "alamat": "Jl. Sudirman No. 456",
  "tanggal_daftar": "2025-11-18T11:00:00.000000Z"
}
```

### 3. Get Wisatawan Detail
Get specific wisatawan by ID.

**Endpoint:** `GET /api/wisatawan/{id}`

**Response:** `200 OK`

### 4. Update Wisatawan
Update existing wisatawan.

**Endpoint:** `PUT /api/wisatawan/{id}`

**Request Body:** Same as Create (all fields optional)

**Response:** `200 OK`

### 5. Delete Wisatawan
Delete wisatawan by ID.

**Endpoint:** `DELETE /api/wisatawan/{id}`

**Response:** `200 OK`
```json
{
  "message": "Wisatawan deleted successfully"
}
```

---

## Kamar Villa Endpoints

### 1. Get All Kamar Villa
Get paginated list of all rooms and villas.

**Endpoint:** `GET /api/kamar-villa`

**Response:**
```json
{
  "current_page": 1,
  "data": [
    {
      "id_kamar": 1,
      "tipe_kamar": "Villa Deluxe Ocean View",
      "deskripsi": "Villa mewah dengan pemandangan laut",
      "harga_permalam": "1500000.00",
      "kapasitas": 4,
      "jumlah_tersedia": 3,
      "status_aktif": true,
      "foto_utama": "https://example.com/photo.jpg",
      "created_at": "2025-11-18T10:30:00.000000Z",
      "updated_at": "2025-11-18T10:30:00.000000Z"
    }
  ],
  "per_page": 10,
  "total": 1
}
```

### 2. Create Kamar Villa
Create a new room or villa.

**Endpoint:** `POST /api/kamar-villa`

**Request Body:**
```json
{
  "tipe_kamar": "Kamar Standard",
  "deskripsi": "Kamar nyaman dengan fasilitas lengkap",
  "harga_permalam": 500000,
  "kapasitas": 2,
  "jumlah_tersedia": 5,
  "status_aktif": true,
  "foto_utama": "https://example.com/room.jpg"
}
```

**Validation Rules:**
- `tipe_kamar`: required, string, max:50
- `deskripsi`: nullable, string
- `harga_permalam`: required, numeric, min:0
- `kapasitas`: required, integer, min:1
- `jumlah_tersedia`: required, integer, min:0
- `status_aktif`: nullable, boolean
- `foto_utama`: nullable, string, max:255

**Response:** `201 Created`

### 3. Get Kamar Villa Detail
Get specific room/villa by ID.

**Endpoint:** `GET /api/kamar-villa/{id}`

**Response:** `200 OK`

### 4. Update Kamar Villa
Update existing room/villa.

**Endpoint:** `PUT /api/kamar-villa/{id}`

**Response:** `200 OK`

### 5. Delete Kamar Villa
Delete room/villa by ID.

**Endpoint:** `DELETE /api/kamar-villa/{id}`

**Response:** `200 OK`

---

## Pemesanan (Booking) Endpoints

### 1. Get All Pemesanan
Get paginated list of all bookings with relationships.

**Endpoint:** `GET /api/pemesanan`

**Response:**
```json
{
  "current_page": 1,
  "data": [
    {
      "id_pemesanan": 1,
      "id_wisatawan": 1,
      "id_kamar": 1,
      "tgl_pemesanan": "2025-11-18T10:30:00.000000Z",
      "tgl_checkin": "2025-11-20",
      "tgl_checkout": "2025-11-23",
      "jumlah_tamu": 2,
      "jumlah_malam": 3,
      "harga_permalam": "1500000.00",
      "total_harga": "4500000.00",
      "status_pemesanan": "pending",
      "catatan": "Lantai atas jika tersedia",
      "wisatawan": {
        "id_wisatawan": 1,
        "nama": "John Doe",
        "email": "john@example.com"
      },
      "kamar_villa": {
        "id_kamar": 1,
        "tipe_kamar": "Villa Deluxe Ocean View",
        "harga_permalam": "1500000.00"
      }
    }
  ]
}
```

### 2. Create Pemesanan
Create a new booking. System automatically calculates nights and total price.

**Endpoint:** `POST /api/pemesanan`

**Request Body:**
```json
{
  "id_wisatawan": 1,
  "id_kamar": 1,
  "tgl_checkin": "2025-11-20",
  "tgl_checkout": "2025-11-23",
  "jumlah_tamu": 2,
  "status_pemesanan": "pending",
  "catatan": "Lantai atas jika tersedia"
}
```

**Validation Rules:**
- `id_wisatawan`: required, integer, exists in wisatawan table
- `id_kamar`: required, integer, exists in kamar_villa table
- `tgl_checkin`: required, date
- `tgl_checkout`: required, date, after:tgl_checkin
- `jumlah_tamu`: required, integer, min:1
- `status_pemesanan`: nullable, in:pending,confirmed,completed,cancelled
- `catatan`: nullable, string

**Automatic Calculations:**
- `jumlah_malam`: Calculated from date difference
- `harga_permalam`: Fetched from kamar_villa
- `total_harga`: `harga_permalam` × `jumlah_malam`
- `tgl_pemesanan`: Set to current timestamp

**Response:** `201 Created`
```json
{
  "id_pemesanan": 1,
  "id_wisatawan": 1,
  "id_kamar": 1,
  "tgl_pemesanan": "2025-11-18T10:30:00.000000Z",
  "tgl_checkin": "2025-11-20",
  "tgl_checkout": "2025-11-23",
  "jumlah_tamu": 2,
  "jumlah_malam": 3,
  "harga_permalam": "1500000.00",
  "total_harga": "4500000.00",
  "status_pemesanan": "pending",
  "catatan": "Lantai atas jika tersedia"
}
```

### 3. Get Pemesanan Detail
Get specific booking with relationships.

**Endpoint:** `GET /api/pemesanan/{id}`

**Response:** `200 OK`

### 4. Update Pemesanan
Update existing booking. System recalculates if dates change.

**Endpoint:** `PUT /api/pemesanan/{id}`

**Request Body:**
```json
{
  "tgl_checkin": "2025-11-21",
  "tgl_checkout": "2025-11-24",
  "status_pemesanan": "confirmed"
}
```

**Response:** `200 OK`

### 5. Delete Pemesanan
Delete booking by ID.

**Endpoint:** `DELETE /api/pemesanan/{id}`

**Response:** `200 OK`

---

## Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

---

## Testing with cURL

### Create Wisatawan
```bash
curl -X POST http://localhost:8000/api/wisatawan \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Test User",
    "email": "test@example.com",
    "no_telp": "081234567890",
    "alamat": "Jl. Test No. 123"
  }'
```

### Get All Rooms
```bash
curl http://localhost:8000/api/kamar-villa
```

### Create Booking
```bash
curl -X POST http://localhost:8000/api/pemesanan \
  -H "Content-Type: application/json" \
  -d '{
    "id_wisatawan": 1,
    "id_kamar": 1,
    "tgl_checkin": "2025-11-20",
    "tgl_checkout": "2025-11-23",
    "jumlah_tamu": 2,
    "catatan": "Early check-in if possible"
  }'
```

---

## Postman Collection

Import this JSON into Postman for quick testing:

```json
{
  "info": {
    "name": "Wisata Oboss API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Wisatawan",
      "item": [
        {
          "name": "Get All Wisatawan",
          "request": {
            "method": "GET",
            "url": "http://localhost:8000/api/wisatawan"
          }
        },
        {
          "name": "Create Wisatawan",
          "request": {
            "method": "POST",
            "url": "http://localhost:8000/api/wisatawan",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nama\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"no_telp\": \"081234567890\",\n  \"alamat\": \"Jl. Test\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## Future Enhancements

- JWT Authentication
- Rate Limiting
- API Versioning
- Pagination customization
- Advanced filtering and sorting
- File upload endpoints
- Payment integration endpoints
