<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Wisatawan extends Model
{
    use HasFactory;

    protected $table = 'wisatawan';
    protected $primaryKey = 'id_wisatawan';
    public $timestamps = true;

    protected $fillable = [
        'nama',
        'email',
        'no_telp',
        'alamat',
        'tanggal_daftar',
    ];

    protected $casts = [
        'tanggal_daftar' => 'datetime',
    ];

    // Relationship
    public function pemesanan()
    {
        return $this->hasMany(Pemesanan::class, 'id_wisatawan', 'id_wisatawan');
    }
}
