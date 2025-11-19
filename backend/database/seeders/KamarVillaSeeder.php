<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KamarVillaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kamarVilla = [
            [
                'tipe_kamar' => 'Villa Deluxe Ocean View',
                'deskripsi' => 'Villa mewah dengan pemandangan laut yang menakjubkan. Dilengkapi dengan fasilitas lengkap untuk kenyamanan maksimal Anda. Cocok untuk keluarga atau grup kecil yang ingin menikmati liburan dengan privasi dan kenyamanan tinggi. Terdapat ruang tamu luas, dapur lengkap, dan balkon privat menghadap ke laut.',
                'harga_permalam' => 1500000,
                'kapasitas' => 4,
                'jumlah_tersedia' => 3,
                'status_aktif' => true,
                'foto_utama' => 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tipe_kamar' => 'Kamar Garden Suite',
                'deskripsi' => 'Kamar nyaman dengan taman pribadi yang asri. Sempurna untuk pasangan yang mencari ketenangan dan privasi. Dilengkapi dengan tempat tidur king size, kamar mandi dengan bathtub, dan akses langsung ke taman yang indah. Suasana romantis dengan pemandangan hijau yang menyegarkan.',
                'harga_permalam' => 800000,
                'kapasitas' => 2,
                'jumlah_tersedia' => 5,
                'status_aktif' => true,
                'foto_utama' => 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tipe_kamar' => 'Villa Mountain View',
                'deskripsi' => 'Villa luas dengan pemandangan pegunungan yang spektakuler. Ideal untuk keluarga besar atau grup hingga 6 orang. Memiliki 3 kamar tidur, ruang keluarga, dapur lengkap, dan teras luas dengan view pegunungan. Udara sejuk dan pemandangan alam yang memukau membuat liburan Anda tak terlupakan.',
                'harga_permalam' => 1200000,
                'kapasitas' => 6,
                'jumlah_tersedia' => 2,
                'status_aktif' => true,
                'foto_utama' => 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tipe_kamar' => 'Kamar Standard',
                'deskripsi' => 'Kamar nyaman dengan fasilitas lengkap dan harga terjangkau. Cocok untuk solo traveler atau pasangan dengan budget terbatas namun tetap ingin menikmati kenyamanan. Dilengkapi dengan AC, TV kabel, WiFi gratis, dan kamar mandi dalam. Lokasi strategis dekat dengan area rekreasi.',
                'harga_permalam' => 500000,
                'kapasitas' => 2,
                'jumlah_tersedia' => 8,
                'status_aktif' => true,
                'foto_utama' => 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tipe_kamar' => 'Villa Family Paradise',
                'deskripsi' => 'Villa keluarga yang sempurna dengan fasilitas lengkap untuk anak-anak. Memiliki area bermain anak, kolam renang pribadi, dan taman yang luas. 4 kamar tidur dengan konfigurasi fleksibel, ruang makan besar, dan dapur modern. Cocok untuk liburan keluarga yang berkesan.',
                'harga_permalam' => 1800000,
                'kapasitas' => 8,
                'jumlah_tersedia' => 2,
                'status_aktif' => true,
                'foto_utama' => 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tipe_kamar' => 'Kamar Superior',
                'deskripsi' => 'Kamar superior dengan view taman dan fasilitas premium. Lebih luas dari kamar standard dengan furniture berkualitas tinggi. Tempat tidur queen size yang nyaman, working desk, mini bar, dan smart TV. Ideal untuk business traveler atau pasangan yang menginginkan kenyamanan ekstra.',
                'harga_permalam' => 650000,
                'kapasitas' => 2,
                'jumlah_tersedia' => 6,
                'status_aktif' => true,
                'foto_utama' => 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tipe_kamar' => 'Villa Honeymoon Special',
                'deskripsi' => 'Villa romantis khusus untuk pasangan bulan madu. Desain interior romantis dengan jacuzzi outdoor, pemandangan sunset yang indah, dan privasi maksimal. Dilengkapi dengan welcome fruit basket, dekorasi bunga, dan complimentary romantic dinner. Pengalaman honeymoon yang tak terlupakan.',
                'harga_permalam' => 2000000,
                'kapasitas' => 2,
                'jumlah_tersedia' => 2,
                'status_aktif' => true,
                'foto_utama' => 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tipe_kamar' => 'Kamar Budget',
                'deskripsi' => 'Kamar budget dengan fasilitas dasar yang memadai. Pilihan ekonomis untuk backpacker atau wisatawan budget. Meskipun sederhana, kamar tetap bersih, nyaman, dan aman. Dilengkapi dengan AC, WiFi, dan kamar mandi dalam. Akses mudah ke transportasi umum dan tempat wisata.',
                'harga_permalam' => 350000,
                'kapasitas' => 2,
                'jumlah_tersedia' => 10,
                'status_aktif' => true,
                'foto_utama' => 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('kamar_villa')->insert($kamarVilla);
    }
}
