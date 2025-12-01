# Wisata Oboss - Sistem Manajemen Pemesanan Villa & Kamar Berbasis Web

## Abstract

Wisata Oboss merupakan aplikasi web-based reservation system yang dirancang untuk memfasilitasi proses pemesanan dan manajemen villa serta kamar wisata. Sistem ini mengimplementasikan arsitektur client-server dengan pemisahan concern antara frontend dan backend, menggunakan RESTful API sebagai protokol komunikasi. Aplikasi ini dikembangkan menggunakan Laravel Framework sebagai backend API server dan React dengan TypeScript sebagai frontend client application, dengan fokus pada otomatisasi proses bisnis perhotelan dan sistem ketersediaan kamar yang dinamis.

## 1. Pendahuluan

### 1.1 Latar Belakang
Industri pariwisata dan perhotelan memerlukan sistem informasi yang efisien untuk mengelola reservasi dan ketersediaan kamar. Sistem manual atau semi-otomatis seringkali menghadapi permasalahan seperti double booking, inkonsistensi data ketersediaan, dan kesulitan dalam tracking status pemesanan. Wisata Oboss dikembangkan untuk mengatasi permasalahan tersebut dengan mengimplementasikan sistem pemesanan online yang terintegrasi dan otomatis.

### 1.2 Tujuan Sistem
1. Mengotomatisasi proses pemesanan villa dan kamar wisata
2. Menyediakan sistem manajemen ketersediaan kamar yang real-time dan dinamis
3. Memfasilitasi proses verifikasi pembayaran dan konfirmasi pemesanan
4. Menyediakan dashboard analitik untuk monitoring operasional bisnis
5. Meningkatkan transparansi dan kemudahan akses informasi bagi wisatawan

### 1.3 Ruang Lingkup
Sistem mencakup dua modul utama:
- **Modul Wisatawan**: Sistem frontend untuk pencarian, pemesanan, pembayaran, dan tracking
- **Modul Administrator**: Sistem backend untuk manajemen data, verifikasi, dan pelaporan

## 2. Arsitektur Sistem

### 2.1 Arsitektur Aplikasi
Sistem mengimplementasikan **Three-Tier Architecture** dengan pemisahan sebagai berikut:

```
┌─────────────────────────────────────────┐
│     Presentation Layer (Frontend)      │
│   React + TypeScript + TailwindCSS     │
│         Port: 5173 (Vite Dev)          │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST API
                  │ JSON Data Exchange
┌─────────────────▼───────────────────────┐
│      Application Layer (Backend)       │
│      Laravel 11 + PHP 8.x              │
│         Port: 8000 (Artisan)           │
└─────────────────┬───────────────────────┘
                  │ Query/Transaction
                  │ Eloquent ORM
┌─────────────────▼───────────────────────┐
│       Data Layer (Database)            │
│        MySQL/MariaDB RDBMS             │
│         Port: 3306 (Default)           │
└─────────────────────────────────────────┘
```

### 2.2 Design Pattern yang Diimplementasikan
1. **MVC (Model-View-Controller)**: Pada backend Laravel
2. **Repository Pattern**: Melalui Eloquent ORM
3. **RESTful API Design**: Untuk komunikasi client-server
4. **Component-Based Architecture**: Pada frontend React
5. **Single Responsibility Principle**: Setiap controller memiliki tanggung jawab spesifik

## 3. Fitur dan Fungsionalitas

### 3.1 Modul Wisatawan (User-Facing Features)

#### 3.1.1 Landing Page & Navigasi
- Hero section dengan call-to-action untuk pemesanan
- Quick search functionality untuk pencarian kamar
- Navigasi intuitif ke berbagai halaman sistem
- Responsive design untuk berbagai ukuran layar

#### 3.1.2 Pencarian dan Browsing Kamar
- **Filter Multi-kriteria**: Berdasarkan tipe kamar, harga, dan kapasitas
- **Sorting**: Ascending/descending berdasarkan harga
- **Real-time Availability**: Menampilkan ketersediaan aktual kamar
- **Grid Layout**: Presentasi visual dengan card-based design

#### 3.1.3 Detail Kamar
- Informasi lengkap spesifikasi kamar (kapasitas, fasilitas, deskripsi)
- Galeri foto kamar dengan foto utama
- Pricing information yang transparan
- Booking form terintegrasi dengan validasi

#### 3.1.4 Proses Checkout & Pembayaran
- Form data wisatawan dengan validasi client-side
- Kalkulasi otomatis jumlah malam dan total biaya
- Field catatan khusus untuk permintaan tamu
- Upload bukti pembayaran dengan preview
- Validasi file (format, ukuran maksimal)

#### 3.1.5 Booking Tracking System
- Unique booking token generation (8 karakter alphanumerik)
- Check booking by token untuk melihat status
- Timeline status pemesanan (pending → confirmed → completed)
- Informasi detail pemesanan dan kamar

#### 3.1.6 Booking Success Page
- Konfirmasi pemesanan dengan detail lengkap
- Display booking token untuk referensi
- Instruksi follow-up action untuk wisatawan
- Option untuk print atau save konfirmasi

### 3.2 Modul Administrator (Admin Panel Features)

#### 3.2.1 Dashboard Analitik
- **Key Performance Indicators (KPI)**:
  - Total revenue (sum dari completed bookings)
  - Total jumlah pemesanan per status
  - Total jumlah wisatawan terdaftar
  - Total kamar yang dikelola
- **Statistik Visual**: Grafik dan chart untuk trend analysis
- **Recent Activities**: Latest bookings dan transactions

#### 3.2.2 Manajemen Kamar Villa (CRUD Operations)
- **Create**: Form input dengan upload foto kamar
- **Read**: Tabel daftar kamar dengan informasi lengkap
- **Update**: Edit spesifikasi kamar dan harga
- **Delete**: Soft delete dengan validasi dependency
- **Upload Management**: Foto storage di public directory
- **Status Toggle**: Aktif/non-aktif kamar

#### 3.2.3 Manajemen Wisatawan (Guest Management)
- **Create**: Registrasi wisatawan baru dengan validasi email unique
- **Read**: Daftar wisatawan dengan pagination
- **Update**: Edit data wisatawan
- **Delete**: Remove wisatawan dengan cascade handling
- **Search & Filter**: Pencarian berdasarkan nama atau email

#### 3.2.4 Manajemen Pemesanan (Booking Management)
- **View All Bookings**: Tabel dengan relationship data (wisatawan & kamar)
- **Status Management**: Update status pemesanan (pending/confirmed/completed/cancelled)
- **Check-in/Check-out System**: Tracking tamu yang sedang menginap
- **Dynamic Availability Update**: Otomatis update ketersediaan kamar
- **Detail View**: Informasi lengkap pemesanan dengan relasi

#### 3.2.5 Manajemen Pembayaran
- **Payment Verification**: View dan verify bukti pembayaran
- **Image Preview**: Tampilan bukti transfer uploaded
- **Payment Status Update**: Konfirmasi atau reject pembayaran
- **Transaction History**: Log semua transaksi pembayaran

#### 3.2.6 Sistem Pelaporan
- **Detailed Reports**: Laporan pemesanan dengan filtering
- **Summary Statistics**: Ringkasan bisnis dan operasional
- **Export Capability**: Download laporan dalam format terstruktur
- **Date Range Filtering**: Custom period reporting

## 4. Teknologi dan Framework

### 4.1 Backend Technology Stack

#### 4.1.1 Core Framework
- **PHP 8.x**: Server-side programming language dengan support untuk OOP dan modern features
- **Laravel 11**: PHP framework dengan Eloquent ORM, routing, dan middleware support
- **Composer**: Dependency management tool untuk PHP packages

#### 4.1.2 Database
- **MySQL/MariaDB**: Relational Database Management System
- **Eloquent ORM**: Laravel's Active Record implementation untuk database operations
- **Migration System**: Version control untuk database schema

#### 4.1.3 API Architecture
- **RESTful API**: Representational State Transfer untuk client-server communication
- **JSON Format**: Data interchange format
- **CORS Middleware**: Cross-Origin Resource Sharing untuk frontend integration

### 4.2 Frontend Technology Stack

#### 4.2.1 Core Framework & Language
- **React 19**: Component-based JavaScript library untuk UI development
- **TypeScript**: Statically typed superset of JavaScript untuk type safety
- **Vite**: Modern build tool dan development server dengan Hot Module Replacement (HMR)

#### 4.2.2 Styling & UI
- **TailwindCSS**: Utility-first CSS framework untuk rapid UI development
- **Lucide Icons**: Icon library untuk visual elements
- **Responsive Design**: Mobile-first approach dengan breakpoints

#### 4.2.3 Routing & State Management
- **React Router v6**: Client-side routing dengan nested routes support
- **React Hooks**: useState, useEffect, useNavigate untuk state management
- **Context API**: Global state management (bila diperlukan)

#### 4.2.4 Date & Time Handling
- **date-fns**: Modern JavaScript date utility library untuk formatting dan manipulation

### 4.3 Development Tools
- **Git**: Version control system
- **npm**: Package manager untuk frontend dependencies
- **Artisan CLI**: Laravel's command-line interface untuk tasks automation
- **ESLint**: Linting tool untuk code quality
- **PostCSS**: CSS transformation tool

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

## 5. Database Design & Schema

### 5.1 Entity Relationship Diagram (ERD)

```
┌─────────────────────┐           ┌─────────────────────┐
│     WISATAWAN       │           │    KAMAR_VILLA      │
├─────────────────────┤           ├─────────────────────┤
│ id_wisatawan (PK)   │           │ id_kamar (PK)       │
│ nama                │           │ tipe_kamar          │
│ email (UNIQUE)      │           │ deskripsi           │
│ no_telp             │           │ harga_permalam      │
│ alamat              │           │ kapasitas           │
│ tanggal_daftar      │           │ jumlah_tersedia     │
│ created_at          │           │ status_aktif        │
│ updated_at          │           │ foto_utama          │
└──────────┬──────────┘           │ created_at          │
           │                      │ updated_at          │
           │ 1                    └──────────┬──────────┘
           │                                 │ 1
           │                                 │
           │         ┌──────────────────────┐│
           │         │    PEMESANAN         ││
           │         ├──────────────────────┤│
           └────────►│ id_pemesanan (PK)    ││
                   N │ id_wisatawan (FK)    ││
                     │ id_kamar (FK)        │◄
                     │ tgl_pemesanan        │N
                     │ tgl_checkin          │
                     │ tgl_checkout         │
                     │ jumlah_tamu          │
                     │ jumlah_malam         │
                     │ harga_permalam       │
                     │ total_harga          │
                     │ status_pemesanan     │
                     │ booking_token (UNQ)  │
                     │ bukti_pembayaran     │
                     │ catatan              │
                     │ is_checked_in        │
                     │ is_checked_out       │
                     │ actual_checkin       │
                     │ actual_checkout      │
                     │ created_at           │
                     │ updated_at           │
                     └──────────────────────┘
```

### 5.2 Table Specifications

#### 5.2.1 Table: `wisatawan`
Menyimpan data informasi wisatawan/tamu yang mendaftar dalam sistem.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id_wisatawan | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique identifier untuk wisatawan |
| nama | VARCHAR(100) | NOT NULL | Nama lengkap wisatawan |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email wisatawan untuk komunikasi |
| no_telp | VARCHAR(20) | NULLABLE | Nomor telepon wisatawan |
| alamat | VARCHAR(255) | NULLABLE | Alamat lengkap wisatawan |
| tanggal_daftar | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Tanggal registrasi wisatawan |
| created_at | TIMESTAMP | NULLABLE | Timestamp record creation |
| updated_at | TIMESTAMP | NULLABLE | Timestamp last update |

**Indexes:**
- PRIMARY KEY: `id_wisatawan`
- UNIQUE KEY: `email`

#### 5.2.2 Table: `kamar_villa`
Menyimpan data master kamar dan villa yang tersedia untuk disewakan.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id_kamar | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique identifier untuk kamar |
| tipe_kamar | VARCHAR(50) | NOT NULL | Nama/tipe kamar (e.g., "Villa Deluxe") |
| deskripsi | TEXT | NULLABLE | Deskripsi lengkap fasilitas kamar |
| harga_permalam | DECIMAL(10,2) | NOT NULL | Harga sewa per malam |
| kapasitas | INTEGER | NOT NULL | Jumlah maksimal tamu per kamar |
| jumlah_tersedia | INTEGER | NOT NULL | Jumlah kamar yang tersedia (real-time) |
| status_aktif | BOOLEAN | DEFAULT TRUE | Status kamar aktif/non-aktif |
| foto_utama | VARCHAR(255) | NULLABLE | Path file foto utama kamar |
| created_at | TIMESTAMP | NULLABLE | Timestamp record creation |
| updated_at | TIMESTAMP | NULLABLE | Timestamp last update |

**Indexes:**
- PRIMARY KEY: `id_kamar`

**Business Rules:**
- `jumlah_tersedia` diupdate otomatis saat check-in/check-out
- `harga_permalam` dalam format currency (2 decimal places)

#### 5.2.3 Table: `pemesanan`
Menyimpan data transaksi pemesanan kamar oleh wisatawan.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id_pemesanan | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique identifier untuk pemesanan |
| id_wisatawan | BIGINT UNSIGNED | FOREIGN KEY, NOT NULL | Referensi ke wisatawan |
| id_kamar | BIGINT UNSIGNED | FOREIGN KEY, NOT NULL | Referensi ke kamar yang dipesan |
| tgl_pemesanan | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pemesanan dibuat |
| tgl_checkin | DATE | NOT NULL | Tanggal rencana check-in |
| tgl_checkout | DATE | NOT NULL | Tanggal rencana check-out |
| jumlah_tamu | INTEGER | NOT NULL | Jumlah tamu yang akan menginap |
| jumlah_malam | INTEGER | NOT NULL | Durasi menginap (calculated) |
| harga_permalam | DECIMAL(10,2) | NOT NULL | Harga per malam saat pemesanan |
| total_harga | DECIMAL(10,2) | NOT NULL | Total biaya (calculated) |
| status_pemesanan | ENUM | NOT NULL, DEFAULT 'pending' | Status: pending/confirmed/completed/cancelled |
| booking_token | VARCHAR(10) | UNIQUE, NULLABLE | Token unik untuk tracking |
| bukti_pembayaran | VARCHAR(255) | NULLABLE | Path file bukti transfer |
| catatan | TEXT | NULLABLE | Catatan khusus dari wisatawan |
| is_checked_in | BOOLEAN | DEFAULT FALSE | Status sudah check-in |
| is_checked_out | BOOLEAN | DEFAULT FALSE | Status sudah check-out |
| actual_checkin | DATETIME | NULLABLE | Waktu aktual check-in |
| actual_checkout | DATETIME | NULLABLE | Waktu aktual check-out |
| created_at | TIMESTAMP | NULLABLE | Timestamp record creation |
| updated_at | TIMESTAMP | NULLABLE | Timestamp last update |

**Indexes:**
- PRIMARY KEY: `id_pemesanan`
- FOREIGN KEY: `id_wisatawan` REFERENCES `wisatawan(id_wisatawan)` ON DELETE CASCADE
- FOREIGN KEY: `id_kamar` REFERENCES `kamar_villa(id_kamar)` ON DELETE RESTRICT
- UNIQUE KEY: `booking_token`

**Status Pemesanan Flow:**
```
pending → confirmed → completed
   │           │
   └─→ cancelled
```

### 5.3 Database Normalization
Sistem database telah dinormalisasi hingga **Third Normal Form (3NF)**:
- **1NF**: Setiap kolom berisi atomic values
- **2NF**: Tidak ada partial dependencies pada composite keys
- **3NF**: Tidak ada transitive dependencies

### 5.4 Data Integrity & Constraints

#### 5.4.1 Referential Integrity
- Foreign key `id_wisatawan` dengan `ON DELETE CASCADE`: Jika wisatawan dihapus, pemesanannya ikut terhapus
- Foreign key `id_kamar` dengan `ON DELETE RESTRICT`: Kamar tidak bisa dihapus jika masih ada pemesanan aktif

#### 5.4.2 Business Logic Constraints
- `tgl_checkout` harus lebih besar dari `tgl_checkin`
- `jumlah_tamu` tidak boleh melebihi `kapasitas` kamar
- `jumlah_tersedia` tidak boleh negatif
- `total_harga` = `harga_permalam` × `jumlah_malam`

## 6. Alur Sistem dan Business Logic

### 6.1 Use Case Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    SISTEM WISATA OBOSS                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────┐                                                │
│  │Wisatawan│                                                │
│  └────┬────┘                                                │
│       │                                                     │
│       ├──► Browse Kamar                                     │
│       ├──► Lihat Detail Kamar                               │
│       ├──► Buat Pemesanan                                   │
│       ├──► Upload Bukti Pembayaran                          │
│       └──► Cek Status Pemesanan (by Token)                  │
│                                                              │
│                                                              │
│  ┌──────────┐                                               │
│  │Administrator│                                            │
│  └─────┬────┘                                               │
│        │                                                    │
│        ├──► Kelola Kamar Villa (CRUD)                       │
│        ├──► Kelola Wisatawan (CRUD)                         │
│        ├──► Kelola Pemesanan                                │
│        ├──► Verifikasi Pembayaran                           │
│        ├──► Konfirmasi Pemesanan                            │
│        ├──► Check-in Tamu                                   │
│        ├──► Check-out Tamu                                  │
│        └──► Lihat Laporan & Statistik                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 6.2 Alur Proses Pemesanan (Booking Flow)

#### 6.2.1 Sequence Diagram: Proses Booking Lengkap

```
Wisatawan        Frontend       Backend API      Database       Admin
    │                │              │               │             │
    │  Browse Kamar  │              │               │             │
    ├───────────────►│ GET /kamar-villa            │             │
    │                ├─────────────►│               │             │
    │                │              │ SELECT kamar  │             │
    │                │              ├──────────────►│             │
    │                │              │◄──────────────┤             │
    │                │◄─────────────┤ (JSON data)   │             │
    │◄───────────────┤              │               │             │
    │                │              │               │             │
    │  Pilih Kamar   │              │               │             │
    ├───────────────►│ GET /kamar-villa/{id}       │             │
    │                ├─────────────►│               │             │
    │                │              │ SELECT detail │             │
    │                │              ├──────────────►│             │
    │                │◄─────────────┤               │             │
    │◄───────────────┤              │               │             │
    │                │              │               │             │
    │ Isi Form Order │              │               │             │
    ├───────────────►│              │               │             │
    │                │              │               │             │
    │ Submit Order   │              │               │             │
    ├───────────────►│ POST /pemesanan             │             │
    │                ├─────────────►│               │             │
    │                │              │ Validate data │             │
    │                │              │ Calculate:    │             │
    │                │              │ - jumlah_malam│             │
    │                │              │ - total_harga │             │
    │                │              │ Generate token│             │
    │                │              │               │             │
    │                │              │ INSERT pemesanan            │
    │                │              ├──────────────►│             │
    │                │              │               │             │
    │                │              │ IF status=confirmed:        │
    │                │              │ UPDATE jumlah_tersedia -= 1 │
    │                │              ├──────────────►│             │
    │                │              │◄──────────────┤             │
    │                │◄─────────────┤ (booking_token)             │
    │◄───────────────┤              │               │             │
    │                │              │               │             │
    │ Upload Bukti   │              │               │             │
    ├───────────────►│ POST /upload │               │             │
    │                ├─────────────►│ Save file     │             │
    │                │              │ UPDATE bukti  │             │
    │                │              ├──────────────►│             │
    │                │◄─────────────┤               │             │
    │◄───────────────┤              │               │             │
    │                │              │               │             │
    │                │              │               │  Lihat Pemesanan
    │                │              │               │◄────────────┤
    │                │              │◄──────────────┼─────────────┤
    │                │              │ SELECT pemesanan            │
    │                │              ├──────────────►│             │
    │                │              │◄──────────────┤             │
    │                │              ├──────────────────────────►  │
    │                │              │               │             │
    │                │              │               │  Konfirmasi │
    │                │              │◄──────────────┼─────────────┤
    │                │              │ UPDATE status=confirmed     │
    │                │              ├──────────────►│             │
    │                │              │ UPDATE jumlah_tersedia -= 1 │
    │                │              ├──────────────►│             │
    │                │              ├──────────────────────────►  │
    │                │              │               │             │
    │                │              │               │  Check-in   │
    │                │              │◄──────────────┼─────────────┤
    │                │              │ UPDATE is_checked_in=true   │
    │                │              │ UPDATE actual_checkin=NOW() │
    │                │              ├──────────────►│             │
    │                │              ├──────────────────────────►  │
    │                │              │               │             │
    │                │              │               │  Check-out  │
    │                │              │◄──────────────┼─────────────┤
    │                │              │ UPDATE is_checked_out=true  │
    │                │              │ UPDATE status=completed     │
    │                │              │ UPDATE actual_checkout=NOW()│
    │                │              │ UPDATE jumlah_tersedia += 1 │
    │                │              ├──────────────►│             │
    │                │              ├──────────────────────────►  │
```

### 6.3 Sistem Ketersediaan Kamar Dinamis

#### 6.3.1 Algoritma Update Ketersediaan

**Algoritma 1: Saat Pemesanan Dibuat (Create Booking)**
```
FUNCTION createBooking(bookingData):
    VALIDATE bookingData
    
    kamar = GET kamarVilla WHERE id_kamar = bookingData.id_kamar
    
    CALCULATE jumlah_malam = (tgl_checkout - tgl_checkin).days
    CALCULATE total_harga = kamar.harga_permalam × jumlah_malam
    
    SET bookingData.jumlah_malam = jumlah_malam
    SET bookingData.total_harga = total_harga
    SET bookingData.booking_token = GENERATE_UNIQUE_TOKEN()
    
    pemesanan = CREATE Pemesanan(bookingData)
    
    IF bookingData.status_pemesanan == 'confirmed' THEN
        kamar.jumlah_tersedia -= 1
        SAVE kamar
    END IF
    
    RETURN pemesanan WITH booking_token
END FUNCTION
```

**Algoritma 2: Saat Update Status Pemesanan**
```
FUNCTION updateBookingStatus(id_pemesanan, new_status):
    pemesanan = GET Pemesanan WHERE id = id_pemesanan WITH kamarVilla
    old_status = pemesanan.status_pemesanan
    kamar = pemesanan.kamarVilla
    
    // Pending → Confirmed: Kurangi ketersediaan
    IF old_status == 'pending' AND new_status == 'confirmed' THEN
        IF kamar.jumlah_tersedia < 1 THEN
            THROW Exception("Kamar tidak tersedia")
        END IF
        kamar.jumlah_tersedia -= 1
        SAVE kamar
    END IF
    
    // Confirmed → Cancelled: Kembalikan ketersediaan
    IF old_status == 'confirmed' AND new_status == 'cancelled' THEN
        kamar.jumlah_tersedia += 1
        SAVE kamar
    END IF
    
    pemesanan.status_pemesanan = new_status
    SAVE pemesanan
    
    RETURN pemesanan
END FUNCTION
```

**Algoritma 3: Proses Check-in**
```
FUNCTION checkIn(id_pemesanan):
    pemesanan = GET Pemesanan WHERE id = id_pemesanan WITH kamarVilla
    
    // Validasi
    IF pemesanan.is_checked_in == TRUE THEN
        THROW Exception("Pemesanan sudah check-in")
    END IF
    
    kamar = pemesanan.kamarVilla
    need_reduce_availability = FALSE
    
    // Jika belum confirmed, kurangi ketersediaan sekarang
    IF pemesanan.status_pemesanan != 'confirmed' THEN
        IF kamar.jumlah_tersedia < 1 THEN
            THROW Exception("Kamar tidak tersedia")
        END IF
        need_reduce_availability = TRUE
    END IF
    
    // Update status check-in
    pemesanan.is_checked_in = TRUE
    pemesanan.actual_checkin = CURRENT_TIMESTAMP()
    pemesanan.status_pemesanan = 'confirmed'
    SAVE pemesanan
    
    // Kurangi ketersediaan jika diperlukan
    IF need_reduce_availability THEN
        kamar.jumlah_tersedia -= 1
        SAVE kamar
    END IF
    
    RETURN pemesanan WITH kamar.jumlah_tersedia
END FUNCTION
```

**Algoritma 4: Proses Check-out**
```
FUNCTION checkOut(id_pemesanan):
    pemesanan = GET Pemesanan WHERE id = id_pemesanan WITH kamarVilla
    
    // Validasi
    IF pemesanan.is_checked_in == FALSE THEN
        THROW Exception("Pemesanan belum check-in")
    END IF
    
    IF pemesanan.is_checked_out == TRUE THEN
        THROW Exception("Pemesanan sudah check-out")
    END IF
    
    // Update status check-out
    pemesanan.is_checked_out = TRUE
    pemesanan.actual_checkout = CURRENT_TIMESTAMP()
    pemesanan.status_pemesanan = 'completed'
    SAVE pemesanan
    
    // Kembalikan ketersediaan kamar
    kamar = pemesanan.kamarVilla
    kamar.jumlah_tersedia += 1
    SAVE kamar
    
    RETURN pemesanan WITH kamar.jumlah_tersedia
END FUNCTION
```

#### 6.3.2 State Transition Diagram: Status Pemesanan

```
     ┌─────────┐
     │ PENDING │ ← Pemesanan baru dibuat
     └────┬────┘   (ketersediaan tidak berubah)
          │
          │ Admin konfirmasi / Auto-confirm
          ▼
     ┌──────────┐
     │CONFIRMED │ ← Ketersediaan -1
     └────┬─────┘
          │
          ├────────► Check-in
          │          (is_checked_in = true)
          │          (actual_checkin = timestamp)
          ▼
     ┌──────────┐
     │ CHECK-IN │
     └────┬─────┘
          │
          │ Check-out
          ▼
     ┌───────────┐
     │ COMPLETED │ ← Ketersediaan +1
     └───────────┘   (is_checked_out = true)
                     (actual_checkout = timestamp)

     Alternatif Flow:
     
     PENDING ──cancel──► CANCELLED
     
     CONFIRMED ──cancel──► CANCELLED ← Ketersediaan +1
```

### 6.4 Validasi dan Error Handling

#### 6.4.1 Client-Side Validation (Frontend)
- Email format validation menggunakan regex pattern
- Date validation: check-out harus setelah check-in
- Number validation: jumlah tamu, harga harus positif
- File validation: format gambar (jpg, png), maksimal 2MB
- Required field checking

#### 6.4.2 Server-Side Validation (Backend)
```php
// Validation Rules di PemesananController
$validated = $request->validate([
    'id_wisatawan' => 'required|integer|exists:wisatawan,id_wisatawan',
    'id_kamar' => 'required|integer|exists:kamar_villa,id_kamar',
    'tgl_checkin' => 'required|date',
    'tgl_checkout' => 'required|date|after:tgl_checkin',
    'jumlah_tamu' => 'required|integer|min:1',
    'status_pemesanan' => 'nullable|in:pending,confirmed,completed,cancelled',
    'bukti_pembayaran' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
    'catatan' => 'nullable|string',
]);
```

#### 6.4.3 Business Logic Validation
- Kapasitas kamar: `jumlah_tamu` tidak boleh > `kapasitas`
- Ketersediaan: `jumlah_tersedia` harus >= 1 saat konfirmasi
- Status flow: Tidak bisa langsung dari pending ke completed
- Check-in hanya bisa dilakukan sekali
- Check-out hanya bisa setelah check-in

### 6.5 File Upload & Storage Management

#### 6.5.1 Upload Flow
```
Client                    Server                  Storage
  │                         │                        │
  │ Select File            │                        │
  ├────────────►           │                        │
  │                         │                        │
  │ POST multipart/form    │                        │
  ├───────────────────────►│                        │
  │                         │ Validate:             │
  │                         │ - File type           │
  │                         │ - File size           │
  │                         │ - Mime type           │
  │                         │                        │
  │                         │ Generate unique name  │
  │                         │ timestamp_uniqid.ext  │
  │                         │                        │
  │                         │ Move to directory     │
  │                         ├───────────────────────►│
  │                         │                        │
  │                         │ Save path to DB       │
  │                         │ 'uploads/folder/file' │
  │                         │                        │
  │ Return file path       │                        │
  │◄───────────────────────┤                        │
```

#### 6.5.2 Storage Structure
```
public/
  ├── uploads/
  │   ├── kamar_villa/
  │   │   ├── 1701234567_abc123.jpg
  │   │   ├── 1701234568_def456.png
  │   │   └── ...
  │   └── bukti_pembayaran/
  │       ├── 1701234569_ghi789.jpg
  │       ├── 1701234570_jkl012.png
  │       └── ...
```

### 6.6 Reporting & Analytics

#### 6.6.1 Dashboard KPI Calculation
```php
// Total Revenue dari completed bookings
$totalRevenue = Pemesanan::where('status_pemesanan', 'completed')
                         ->sum('total_harga');

// Jumlah pemesanan per status
$pendingBookings = Pemesanan::where('status_pemesanan', 'pending')->count();
$confirmedBookings = Pemesanan::where('status_pemesanan', 'confirmed')->count();
$completedBookings = Pemesanan::where('status_pemesanan', 'completed')->count();

// Occupancy rate
$totalKamar = KamarVilla::sum('kapasitas');
$kamarTerisi = KamarVilla::sum(DB::raw('kapasitas - jumlah_tersedia'));
$occupancyRate = ($kamarTerisi / $totalKamar) * 100;
```

#### 6.6.2 Report Generation Logic
- Filter by date range (tgl_checkin BETWEEN start AND end)
- Group by kamar, wisatawan, atau status
- Aggregate functions: SUM(total_harga), COUNT(*), AVG(jumlah_malam)
- Join dengan tabel relasi untuk detail lengkap

## 7. Testing & Quality Assurance

### 7.1 Testing Strategy

#### 7.1.1 Unit Testing
- Model validation testing
- Controller method testing
- Helper function testing
- API endpoint response testing

#### 7.1.2 Integration Testing
- Database transaction testing
- API endpoint integration
- File upload functionality
- Foreign key constraints

#### 7.1.3 User Acceptance Testing (UAT)
- End-to-end booking flow
- Admin panel functionality
- Cross-browser compatibility
- Mobile responsiveness

### 7.2 Test Scenarios

#### 7.2.1 Booking Flow Testing
```
Test Case ID: TC-001
Title: Create Booking with Confirmed Status
Precondition: Kamar tersedia >= 1
Steps:
  1. POST /api/pemesanan dengan status='confirmed'
  2. Verify response 201 Created
  3. Verify booking_token generated
  4. Check kamar jumlah_tersedia -= 1
Expected Result: Booking created, availability updated
Status: ✅ PASS
```

```
Test Case ID: TC-002
Title: Check-in Process
Precondition: Booking exists with status='confirmed'
Steps:
  1. POST /api/pemesanan/{id}/check-in
  2. Verify is_checked_in = true
  3. Verify actual_checkin timestamp
  4. Verify availability not double reduced
Expected Result: Check-in successful, no duplicate reduction
Status: ✅ PASS
```

```
Test Case ID: TC-003
Title: Cancel Confirmed Booking
Precondition: Booking exists with status='confirmed'
Steps:
  1. PUT /api/pemesanan/{id} with status='cancelled'
  2. Verify status updated
  3. Check kamar jumlah_tersedia += 1
Expected Result: Booking cancelled, availability restored
Status: ✅ PASS
```

## 8. Implementation Status

### 8.1 Completed Features

#### 8.1.1 Frontend Features
| Feature | Status | Description |
|---------|--------|-------------|
| Landing Page | ✅ Complete | Hero section dengan search functionality |
| Room Listing | ✅ Complete | Grid display dengan filter & sort |
| Room Detail | ✅ Complete | Detailed view dengan booking form |
| Checkout Process | ✅ Complete | Multi-step form dengan validasi |
| Payment Upload | ✅ Complete | File upload bukti pembayaran |
| Booking Tracking | ✅ Complete | Token-based status checking |
| Admin Dashboard | ✅ Complete | KPI dan statistik bisnis |
| Room Management | ✅ Complete | Full CRUD dengan upload foto |
| Guest Management | ✅ Complete | Full CRUD wisatawan |
| Booking Management | ✅ Complete | View, update, check-in/out |
| Payment Verification | ✅ Complete | View dan approve pembayaran |
| Reporting | ✅ Complete | Statistics dan detailed reports |

#### 8.1.2 Backend Features
| Feature | Status | Description |
|---------|--------|-------------|
| RESTful API | ✅ Complete | Full CRUD endpoints untuk semua entities |
| Dynamic Availability | ✅ Complete | Otomatis update saat booking/checkout |
| Check-in/out System | ✅ Complete | Tracking tamu dengan timestamp |
| Token Generation | ✅ Complete | Unique booking token untuk tracking |
| File Upload | ✅ Complete | Image upload untuk foto & bukti bayar |
| Data Validation | ✅ Complete | Server-side validation semua input |
| Error Handling | ✅ Complete | Proper HTTP status dan error messages |
| Database Relations | ✅ Complete | Eloquent relationships configured |

### 8.2 System Capabilities

#### 8.2.1 Otomatisasi Bisnis Proses
- ✅ Kalkulasi otomatis jumlah malam dan total harga
- ✅ Generate unique booking token otomatis
- ✅ Update ketersediaan kamar secara real-time
- ✅ Prevent double booking dengan constraint checking
- ✅ Cascade delete untuk data consistency

#### 8.2.2 Data Management
- ✅ Pagination untuk large dataset
- ✅ Eager loading untuk optimize query
- ✅ Transaction management untuk data integrity
- ✅ Timestamp tracking untuk audit trail

## 9. Future Enhancements

### 9.1 Priority 1 (High Impact)
1. **Authentication & Authorization**
   - Implementasi JWT atau Laravel Sanctum
   - Role-based access control (Admin, Staff, Guest)
   - Secure login/logout functionality
   - Password encryption dan hashing

2. **Payment Gateway Integration**
   - Integrasi Midtrans/Xendit untuk auto-payment
   - Real-time payment verification
   - Multiple payment methods (Transfer, E-wallet, CC)
   - Payment webhook handling

3. **Notification System**
   - Email notification untuk booking confirmation
   - SMS notification untuk check-in reminder
   - Admin notification untuk new booking
   - Payment status notification

### 9.2 Priority 2 (Medium Impact)
4. **Advanced Search & Filter**
   - Multi-criteria search (price range, facilities, location)
   - Date-based availability search
   - Sort by multiple fields
   - Search history dan saved searches

5. **Real-time Features**
   - WebSocket untuk real-time availability update
   - Live chat support untuk customer service
   - Real-time notification push

6. **Analytics Enhancement**
   - Advanced reporting dengan chart visualization
   - Predictive analytics untuk occupancy forecast
   - Revenue prediction dengan machine learning
   - Customer behavior analysis

### 9.3 Priority 3 (Nice to Have)
7. **Review & Rating System**
   - Guest review setelah check-out
   - Star rating untuk kamar
   - Photo upload dari guest
   - Review moderation panel

8. **Export & Documentation**
   - PDF export untuk invoice dan receipt
   - Excel export untuk reports
   - QR code untuk booking verification
   - Print-friendly invoice layout

9. **Mobile Application**
   - Native mobile app (React Native)
   - Push notification support
   - Offline mode capability
   - Location-based services

### 9.4 Technical Improvements
10. **Performance Optimization**
    - Redis caching untuk frequently accessed data
    - Database query optimization
    - Image optimization dan lazy loading
    - CDN integration untuk static assets

11. **Security Enhancements**
    - Rate limiting untuk API endpoints
    - CSRF protection
    - SQL injection prevention
    - XSS protection
    - SSL/HTTPS enforcement

12. **DevOps & Deployment**
    - Docker containerization
    - CI/CD pipeline dengan GitHub Actions
    - Automated testing integration
    - Production deployment to cloud (AWS/GCP)

## 10. Conclusion

Sistem Wisata Oboss telah berhasil mengimplementasikan solusi booking management yang comprehensive dengan fitur-fitur berikut:

1. **Arsitektur Modern**: Three-tier architecture dengan separation of concerns
2. **Dynamic Availability**: Sistem ketersediaan kamar yang real-time dan otomatis
3. **User-Friendly Interface**: Frontend yang responsive dan intuitif
4. **Robust Backend**: RESTful API dengan validation dan error handling
5. **Business Automation**: Otomatisasi perhitungan dan update data
6. **Data Integrity**: Database design dengan proper constraints dan relationships
7. **Scalability**: Architecture yang dapat dikembangkan untuk future enhancements

Sistem ini siap digunakan untuk production dengan catatan bahwa beberapa enhancement (terutama authentication dan payment gateway) sangat disarankan untuk implementasi nyata di lingkungan bisnis.

## 11. References

### 11.1 Documentation
- Laravel 11 Official Documentation: https://laravel.com/docs/11.x
- React Official Documentation: https://react.dev
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- TailwindCSS Documentation: https://tailwindcss.com/docs

### 11.2 Design Patterns
- Martin Fowler - Patterns of Enterprise Application Architecture
- RESTful API Design Best Practices
- Clean Code Principles by Robert C. Martin

### 11.3 Database Design
- Database Normalization Theory (Codd's Normal Forms)
- Entity-Relationship Modeling
- SQL Best Practices

## 12. Contributors & Credits

### 12.1 Development Team
- **Lead Developer**: Thyo Surya
- **Database Design**: Thyo Surya
- **Frontend Development**: Thyo Surya
- **Backend Development**: Thyo Surya

### 12.2 Acknowledgments
- Design inspiration from modern tourism and hospitality booking platforms
- Laravel framework community for extensive documentation
- React community for component libraries and best practices

## 13. License & Usage

### 13.1 License
This project is developed for **educational purposes** as part of academic coursework in:
- Object-Oriented Programming (PBO)
- Web Development
- Database Management Systems
- Software Engineering

### 13.2 Usage Terms
- ✅ Permitted for educational and learning purposes
- ✅ Can be used as reference for similar projects
- ✅ Can be modified and enhanced for academic assignments
- ❌ Not permitted for commercial use without proper licensing
- ❌ Requires attribution if used as reference

### 13.3 Disclaimer
This system is a prototype/proof-of-concept developed for academic purposes. For production deployment, additional security measures, testing, and compliance with relevant regulations (data protection, payment processing, etc.) must be implemented.

---

## Appendix A: Installation Guide

Refer to `SETUP.md` for detailed installation instructions.

## Appendix B: API Documentation

Refer to `API_DOCUMENTATION.md` for complete API endpoint documentation.

## Appendix C: Dynamic Availability System

Refer to `KETERSEDIAAN_KAMAR.md` for detailed explanation of the dynamic room availability system.

---

**Document Version**: 2.0  
**Last Updated**: December 1, 2025  
**Status**: Production Ready (with recommended enhancements for commercial use)
