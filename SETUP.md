# Setup Guide - Wisata Oboss

## Prerequisites

Pastikan Anda telah menginstall:
- PHP >= 8.2
- Composer
- Node.js >= 18.x
- MySQL/MariaDB
- Git

## Step-by-Step Installation

### 1. Clone atau Download Project

```bash
cd d:\development\pbo-tasya
```

### 2. Backend Setup (Laravel)

#### Install Dependencies
```bash
cd backend
composer install
```

#### Environment Configuration
```bash
# Copy file .env
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### Database Setup
Edit file `.env` dan sesuaikan dengan konfigurasi database Anda:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pbo_tasya
DB_USERNAME=root
DB_PASSWORD=
```

Buat database di MySQL:
```sql
CREATE DATABASE pbo_tasya;
```

#### Run Migrations
```bash
php artisan migrate
```

#### Start Backend Server
```bash
php artisan serve
```
Backend akan berjalan di: http://localhost:8000

### 3. Frontend Setup (React + TypeScript)

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start Development Server
```bash
npm run dev
```
Frontend akan berjalan di: http://localhost:5173 atau http://localhost:5174

### 4. Access Application

**Frontend (User Interface):**
- Landing Page: http://localhost:5173/
- Admin Panel: http://localhost:5173/admin

**Backend API:**
- Base URL: http://localhost:8000/api

## Testing the Application

### Test Frontend Routes

1. **Landing Page**
   - Buka http://localhost:5173/
   - Cek hero section, search bar, dan featured rooms

2. **Room Detail**
   - Klik "Lihat Detail" pada salah satu kamar
   - URL: http://localhost:5173/rooms/1

3. **Checkout Page**
   - Dari halaman detail, isi form booking dan klik "Lanjut ke Pembayaran"
   - URL: http://localhost:5173/checkout

4. **Admin Dashboard**
   - Buka http://localhost:5173/admin
   - Cek statistics dan data table

5. **Admin Data Kamar**
   - Buka http://localhost:5173/admin/kamar
   - Test tambah, edit, dan hapus kamar

6. **Admin Data Wisatawan**
   - Buka http://localhost:5173/admin/wisatawan
   - Test CRUD operations

### Test Backend API

Gunakan Postman atau Thunder Client untuk test API:

#### Get All Rooms
```
GET http://localhost:8000/api/kamar-villa
```

#### Create Wisatawan
```
POST http://localhost:8000/api/wisatawan
Content-Type: application/json

{
  "nama": "Test User",
  "email": "test@example.com",
  "no_telp": "081234567890",
  "alamat": "Jl. Test No. 123"
}
```

#### Create Booking
```
POST http://localhost:8000/api/pemesanan
Content-Type: application/json

{
  "id_wisatawan": 1,
  "id_kamar": 1,
  "tgl_checkin": "2025-11-20",
  "tgl_checkout": "2025-11-23",
  "jumlah_tamu": 2,
  "catatan": "Lantai atas jika tersedia"
}
```

## Common Issues & Solutions

### Issue: Port Already in Use

**Error:** `Port 5173 is in use`

**Solution:** Vite akan otomatis mencoba port lain (5174, 5175, dst). Atau stop process yang menggunakan port tersebut.

### Issue: Database Connection Error

**Error:** `SQLSTATE[HY000] [1045] Access denied`

**Solution:** 
1. Cek kredensial database di file `.env`
2. Pastikan MySQL service sudah running
3. Pastikan database sudah dibuat

### Issue: Composer Install Error

**Error:** `Your requirements could not be resolved`

**Solution:**
```bash
composer update
composer install --ignore-platform-reqs
```

### Issue: NPM Install Error

**Error:** Package installation fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue: Migration Error

**Error:** `Class 'Pemesanan' not found`

**Solution:**
```bash
composer dump-autoload
php artisan migrate:fresh
```

## Development Tips

### Hot Module Replacement (HMR)
Frontend menggunakan Vite HMR. Setiap perubahan code akan otomatis ter-reload.

### API Testing
Gunakan tools seperti:
- Postman
- Thunder Client (VS Code Extension)
- Insomnia

### Database Management
Gunakan tools seperti:
- phpMyAdmin
- MySQL Workbench
- TablePlus
- DBeaver

### Code Editor Extensions (VS Code)
Recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- PHP Intelephense
- Laravel Extension Pack

## Next Development Steps

1. **Authentication**
   - Implement JWT authentication
   - Add login/register pages
   - Protect admin routes

2. **Payment Integration**
   - Integrate payment gateway (Midtrans, Xendit)
   - Add payment verification

3. **File Upload**
   - Implement image upload for rooms
   - Add payment proof upload

4. **Email Notifications**
   - Booking confirmation email
   - Payment verification email

5. **Advanced Features**
   - Real-time availability check
   - Calendar view for bookings
   - Review and rating system
   - Advanced search and filtering

## Support

Untuk bantuan lebih lanjut, hubungi:
- Email: support@wisataoboss.com
- Documentation: [Link to docs]
