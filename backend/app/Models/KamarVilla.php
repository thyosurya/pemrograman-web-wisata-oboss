<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class KamarVilla extends Model
{
    use HasFactory;

    protected $table = 'kamar_villa';
    protected $primaryKey = 'id_kamar';
    public $timestamps = true;

    protected $fillable = [
        'tipe_kamar',
        'deskripsi',
        'harga_permalam',
        'kapasitas',
        'jumlah_tersedia',
        'status_aktif',
        'foto_utama',
    ];

    protected $casts = [
        'harga_permalam' => 'decimal:2',
        'status_aktif' => 'boolean',
    ];

    // Relationship
    public function pemesanan()
    {
        return $this->hasMany(Pemesanan::class, 'id_kamar', 'id_kamar');
    }
}
