<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pemesanan extends Model
{
    use HasFactory;

    protected $table = 'pemesanan';
    protected $primaryKey = 'id_pemesanan';
    public $timestamps = true;

    protected $fillable = [
        'id_wisatawan',
        'id_kamar',
        'tgl_pemesanan',
        'tgl_checkin',
        'tgl_checkout',
        'jumlah_tamu',
        'jumlah_malam',
        'harga_permalam',
        'total_harga',
        'status_pemesanan',
        'booking_token',
        'bukti_pembayaran',
        'catatan',
        'is_checked_in',
        'is_checked_out',
        'actual_checkin',
        'actual_checkout',
    ];

    protected $casts = [
        'tgl_pemesanan' => 'datetime',
        'tgl_checkin' => 'date',
        'tgl_checkout' => 'date',
        'harga_permalam' => 'decimal:2',
        'total_harga' => 'decimal:2',
        'is_checked_in' => 'boolean',
        'is_checked_out' => 'boolean',
        'actual_checkin' => 'datetime',
        'actual_checkout' => 'datetime',
    ];

    // Relationships
    public function wisatawan()
    {
        return $this->belongsTo(Wisatawan::class, 'id_wisatawan', 'id_wisatawan');
    }

    public function kamarVilla()
    {
        return $this->belongsTo(KamarVilla::class, 'id_kamar', 'id_kamar');
    }
}
