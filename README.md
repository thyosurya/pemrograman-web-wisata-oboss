# Wisata Oboss - Sistem Booking Villa & Kamar

Sistem booking online untuk villa dan kamar dengan tema wisata alam. Dibangun dengan Laravel (Backend) dan React + TypeScript (Frontend).

## 🎨 Fitur

### Untuk Wisatawan:
- **Landing Page** dengan hero section dan pencarian
- **Browse Kamar & Villa** dengan filter dan sorting
- **Detail Kamar** dengan galeri foto dan booking form
- **Checkout & Pembayaran** dengan upload bukti transfer
- **Tracking Status** pemesanan dengan booking token
- **Booking Success** dengan konfirmasi dan booking token
- **Check Booking** untuk melihat status pemesanan
- **About Page** informasi tentang villa

### Untuk Admin:
- **Dashboard** dengan statistik dan overview pemesanan
- **Manajemen Kamar & Villa** (CRUD dengan upload foto)
- **Manajemen Wisatawan** (CRUD data tamu)
- **Manajemen Pemesanan** (view, update status, konfirmasi)
- **Manajemen Pembayaran** (verifikasi bukti transfer, update status)
- **Laporan** (statistik dan ringkasan bisnis)

## 🛠️ Tech Stack

### Backend (Laravel 11)
- PHP 8.x
- Laravel 11
- MySQL
- RESTful API

### Frontend (React + TypeScript)
- React 19
- TypeScript
- Vite
- TailwindCSS
- React Router
- Lucide Icons
- date-fns

## 📦 Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure database in `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pbo_tasya
DB_USERNAME=root
DB_PASSWORD=
```

6. Run migrations:
```bash
php artisan migrate
```

7. Start development server:
```bash
php artisan serve
```

Backend akan berjalan di `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 🎨 Design System

### Color Palette
- **Nature Green**: `#22c55e` - Primary color untuk CTA dan highlight
- **Ocean Blue**: `#0ea5e9` - Secondary color untuk aksen
- **Cream**: `#fdf9f3` - Background color untuk warmth

### Typography
- Font Family: System UI fonts
- Heading: Bold, 2xl-4xl
- Body: Regular, sm-base

### Components
- **Buttons**: Rounded-lg dengan shadow
- **Cards**: Rounded-xl dengan hover effects
- **Forms**: Clean inputs dengan focus states

## 📁 Project Structure

```
pbo-tasya/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── WisatawanController.php
│   │   │   ├── KamarVillaController.php
│   │   │   ├── PemesananController.php
│   │   │   └── LaporanController.php
│   │   └── Models/
│   │       ├── Wisatawan.php
│   │       ├── KamarVilla.php
│   │       └── Pemesanan.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
└── frontend/
    └── src/
        ├── components/
        │   ├── Header.tsx
        │   ├── Footer.tsx
        │   └── AdminSidebar.tsx
        ├── pages/
        │   ├── LandingPage.tsx
        │   ├── RoomsListPage.tsx
        │   ├── RoomDetailPage.tsx
        │   ├── CheckoutPage.tsx
        │   ├── BookingSuccessPage.tsx
        │   ├── CheckBookingPage.tsx
        │   ├── AboutPage.tsx
        │   ├── AdminDashboard.tsx
        │   ├── AdminKamarPage.tsx
        │   ├── AdminWisatawanPage.tsx
        │   ├── AdminPembayaranPage.tsx
        │   └── AdminLaporanPage.tsx
        └── services/
            └── api.ts
```

## 🔌 API Endpoints

### Wisatawan
- `GET /api/wisatawan` - List all wisatawan
- `POST /api/wisatawan` - Create new wisatawan
- `GET /api/wisatawan/{id}` - Get wisatawan detail
- `PUT /api/wisatawan/{id}` - Update wisatawan
- `DELETE /api/wisatawan/{id}` - Delete wisatawan

### Kamar Villa
- `GET /api/kamar-villa` - List all rooms
- `POST /api/kamar-villa` - Create new room
- `GET /api/kamar-villa/{id}` - Get room detail
- `PUT /api/kamar-villa/{id}` - Update room
- `DELETE /api/kamar-villa/{id}` - Delete room

### Pemesanan
- `GET /api/pemesanan` - List all bookings
- `POST /api/pemesanan` - Create new booking
- `GET /api/pemesanan/{id}` - Get booking detail
- `GET /api/pemesanan/check/{token}` - Check booking by token
- `PUT /api/pemesanan/{id}` - Update booking
- `DELETE /api/pemesanan/{id}` - Delete booking

### Laporan
- `GET /api/laporan` - Get detailed reports
- `GET /api/laporan/ringkasan` - Get summary statistics

## 🗃️ Database Schema

### Table: wisatawan
- `id_wisatawan` (PK)
- `nama`
- `email` (Unique)
- `no_telp`
- `alamat`
- `tanggal_daftar`

### Table: kamar_villa
- `id_kamar` (PK)
- `tipe_kamar`
- `deskripsi`
- `harga_permalam`
- `kapasitas`
- `jumlah_tersedia`
- `status_aktif`
- `foto_utama`

### Table: pemesanan
- `id_pemesanan` (PK)
- `id_wisatawan` (FK)
- `id_kamar` (FK)
- `tgl_pemesanan`
- `tgl_checkin`
- `tgl_checkout`
- `jumlah_tamu`
- `jumlah_malam`
- `harga_permalam`
- `total_harga`
- `status_pemesanan` (enum: pending, confirmed, completed, cancelled)
- `booking_token` (Unique, 10 characters)
- `bukti_pembayaran` (Upload path)
- `catatan`
- `created_at`, `updated_at`

## 📝 Development Notes

- Backend API menggunakan RESTful convention
- Frontend state management menggunakan React Hooks
- Validasi form di client dan server side
- Responsive design untuk mobile, tablet, dan desktop
- Upload file untuk foto kamar dan bukti pembayaran
- Booking system dengan unique token untuk tracking
- Sample data tersedia melalui seeders

## 🚀 Fitur Utama yang Sudah Diimplementasi

✅ Landing page dengan hero section
✅ Browse dan filter kamar villa
✅ Detail kamar dengan informasi lengkap
✅ Checkout dan pembayaran
✅ Upload bukti pembayaran
✅ Booking tracking dengan token
✅ Admin dashboard dengan statistik
✅ CRUD Kamar Villa
✅ CRUD Wisatawan
✅ Management Pemesanan
✅ Management Pembayaran
✅ Laporan dan ringkasan

## 🔜 Next Steps

1. Implementasi autentikasi admin (JWT/Laravel Sanctum)
2. Integrasi payment gateway otomatis
3. Email notification untuk konfirmasi booking
4. Advanced filtering & search dengan multiple criteria
5. Real-time availability check
6. Review & rating system
7. Export laporan ke PDF/Excel

## 👥 Contributors

- Developer: Thyo Surya
- Design: Inspired by modern tourism websites

## 📄 License

This project is for educational purposes.
