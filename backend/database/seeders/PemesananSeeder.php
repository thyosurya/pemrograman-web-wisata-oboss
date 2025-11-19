<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PemesananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pemesanan = [
            // Booking 1 - Completed
            [
                'id_wisatawan' => 1,
                'id_kamar' => 1,
                'tgl_pemesanan' => now()->subDays(25),
                'tgl_checkin' => now()->subDays(20)->format('Y-m-d'),
                'tgl_checkout' => now()->subDays(17)->format('Y-m-d'),
                'jumlah_tamu' => 4,
                'jumlah_malam' => 3,
                'harga_permalam' => 1500000,
                'total_harga' => 4500000,
                'status_pemesanan' => 'completed',
                'catatan' => 'Request lantai atas dengan view laut',
                'created_at' => now()->subDays(25),
                'updated_at' => now()->subDays(17),
            ],
            // Booking 2 - Confirmed
            [
                'id_wisatawan' => 2,
                'id_kamar' => 2,
                'tgl_pemesanan' => now()->subDays(15),
                'tgl_checkin' => now()->addDays(5)->format('Y-m-d'),
                'tgl_checkout' => now()->addDays(8)->format('Y-m-d'),
                'jumlah_tamu' => 2,
                'jumlah_malam' => 3,
                'harga_permalam' => 800000,
                'total_harga' => 2400000,
                'status_pemesanan' => 'confirmed',
                'catatan' => 'Honeymoon package',
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(10),
            ],
            // Booking 3 - Pending
            [
                'id_wisatawan' => 3,
                'id_kamar' => 3,
                'tgl_pemesanan' => now()->subDays(3),
                'tgl_checkin' => now()->addDays(10)->format('Y-m-d'),
                'tgl_checkout' => now()->addDays(14)->format('Y-m-d'),
                'jumlah_tamu' => 6,
                'jumlah_malam' => 4,
                'harga_permalam' => 1200000,
                'total_harga' => 4800000,
                'status_pemesanan' => 'pending',
                'catatan' => 'Keluarga besar, butuh extra bed untuk anak',
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            // Booking 4 - Confirmed
            [
                'id_wisatawan' => 4,
                'id_kamar' => 4,
                'tgl_pemesanan' => now()->subDays(10),
                'tgl_checkin' => now()->addDays(2)->format('Y-m-d'),
                'tgl_checkout' => now()->addDays(4)->format('Y-m-d'),
                'jumlah_tamu' => 2,
                'jumlah_malam' => 2,
                'harga_permalam' => 500000,
                'total_harga' => 1000000,
                'status_pemesanan' => 'confirmed',
                'catatan' => 'Check-in malam, mohon standby',
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(8),
            ],
            // Booking 5 - Completed
            [
                'id_wisatawan' => 5,
                'id_kamar' => 5,
                'tgl_pemesanan' => now()->subDays(30),
                'tgl_checkin' => now()->subDays(14)->format('Y-m-d'),
                'tgl_checkout' => now()->subDays(11)->format('Y-m-d'),
                'jumlah_tamu' => 8,
                'jumlah_malam' => 3,
                'harga_permalam' => 1800000,
                'total_harga' => 5400000,
                'status_pemesanan' => 'completed',
                'catatan' => 'Family gathering, butuh high chair untuk bayi',
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(11),
            ],
            // Booking 6 - Cancelled
            [
                'id_wisatawan' => 6,
                'id_kamar' => 6,
                'tgl_pemesanan' => now()->subDays(12),
                'tgl_checkin' => now()->addDays(3)->format('Y-m-d'),
                'tgl_checkout' => now()->addDays(6)->format('Y-m-d'),
                'jumlah_tamu' => 2,
                'jumlah_malam' => 3,
                'harga_permalam' => 650000,
                'total_harga' => 1950000,
                'status_pemesanan' => 'cancelled',
                'catatan' => 'Cancel karena perubahan jadwal',
                'created_at' => now()->subDays(12),
                'updated_at' => now()->subDays(5),
            ],
            // Booking 7 - Pending
            [
                'id_wisatawan' => 7,
                'id_kamar' => 7,
                'tgl_pemesanan' => now()->subDays(2),
                'tgl_checkin' => now()->addDays(15)->format('Y-m-d'),
                'tgl_checkout' => now()->addDays(18)->format('Y-m-d'),
                'jumlah_tamu' => 2,
                'jumlah_malam' => 3,
                'harga_permalam' => 2000000,
                'total_harga' => 6000000,
                'status_pemesanan' => 'pending',
                'catatan' => 'Honeymoon special, request romantic dinner',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            // Booking 8 - Confirmed
            [
                'id_wisatawan' => 8,
                'id_kamar' => 8,
                'tgl_pemesanan' => now()->subDays(7),
                'tgl_checkin' => now()->addDays(1)->format('Y-m-d'),
                'tgl_checkout' => now()->addDays(3)->format('Y-m-d'),
                'jumlah_tamu' => 1,
                'jumlah_malam' => 2,
                'harga_permalam' => 350000,
                'total_harga' => 700000,
                'status_pemesanan' => 'confirmed',
                'catatan' => 'Solo traveler, early check-in request',
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(5),
            ],
            // Booking 9 - Pending
            [
                'id_wisatawan' => 1,
                'id_kamar' => 4,
                'tgl_pemesanan' => now()->subDays(1),
                'tgl_checkin' => now()->addDays(20)->format('Y-m-d'),
                'tgl_checkout' => now()->addDays(25)->format('Y-m-d'),
                'jumlah_tamu' => 2,
                'jumlah_malam' => 5,
                'harga_permalam' => 500000,
                'total_harga' => 2500000,
                'status_pemesanan' => 'pending',
                'catatan' => 'Long stay discount jika ada',
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            // Booking 10 - Confirmed
            [
                'id_wisatawan' => 3,
                'id_kamar' => 2,
                'tgl_pemesanan' => now()->subDays(8),
                'tgl_checkin' => now()->addDays(7)->format('Y-m-d'),
                'tgl_checkout' => now()->addDays(9)->format('Y-m-d'),
                'jumlah_tamu' => 2,
                'jumlah_malam' => 2,
                'harga_permalam' => 800000,
                'total_harga' => 1600000,
                'status_pemesanan' => 'confirmed',
                'catatan' => 'Anniversary celebration',
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(6),
            ],
        ];

        DB::table('pemesanan')->insert($pemesanan);
    }
}
