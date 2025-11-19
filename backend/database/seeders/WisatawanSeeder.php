<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class WisatawanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $wisatawan = [
            [
                'nama' => 'Budi Santoso',
                'email' => 'budi.santoso@email.com',
                'no_telp' => '081234567890',
                'alamat' => 'Jl. Sudirman No. 123, Jakarta Pusat',
                'tanggal_daftar' => now()->subDays(30),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Siti Nurhaliza',
                'email' => 'siti.nurhaliza@email.com',
                'no_telp' => '082345678901',
                'alamat' => 'Jl. Gatot Subroto No. 456, Bandung',
                'tanggal_daftar' => now()->subDays(25),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Ahmad Wijaya',
                'email' => 'ahmad.wijaya@email.com',
                'no_telp' => '083456789012',
                'alamat' => 'Jl. Diponegoro No. 789, Surabaya',
                'tanggal_daftar' => now()->subDays(20),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Dewi Lestari',
                'email' => 'dewi.lestari@email.com',
                'no_telp' => '084567890123',
                'alamat' => 'Jl. Ahmad Yani No. 321, Yogyakarta',
                'tanggal_daftar' => now()->subDays(15),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Rizki Ramadhan',
                'email' => 'rizki.ramadhan@email.com',
                'no_telp' => '085678901234',
                'alamat' => 'Jl. Pahlawan No. 654, Malang',
                'tanggal_daftar' => now()->subDays(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Linda Kusuma',
                'email' => 'linda.kusuma@email.com',
                'no_telp' => '086789012345',
                'alamat' => 'Jl. Merdeka No. 987, Semarang',
                'tanggal_daftar' => now()->subDays(8),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Hendra Gunawan',
                'email' => 'hendra.gunawan@email.com',
                'no_telp' => '087890123456',
                'alamat' => 'Jl. Veteran No. 147, Solo',
                'tanggal_daftar' => now()->subDays(5),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Rina Maharani',
                'email' => 'rina.maharani@email.com',
                'no_telp' => '088901234567',
                'alamat' => 'Jl. Imam Bonjol No. 258, Bali',
                'tanggal_daftar' => now()->subDays(3),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('wisatawan')->insert($wisatawan);
    }
}
