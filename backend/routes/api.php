<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WisatawanController;
use App\Http\Controllers\KamarVillaController;
use App\Http\Controllers\PemesananController;
use App\Http\Controllers\LaporanController;

Route::middleware('api')->group(function () {
    // Wisatawan Routes
    Route::apiResource('wisatawan', WisatawanController::class);
    
    // Kamar Villa Routes
    Route::apiResource('kamar-villa', KamarVillaController::class);
    
    // Pemesanan Routes
    Route::apiResource('pemesanan', PemesananController::class);
    
    // Check booking by token
    Route::get('pemesanan/check/{token}', [PemesananController::class, 'checkByToken']);
    
    // Laporan Routes
    Route::get('laporan', [LaporanController::class, 'getLaporan']);
    Route::get('laporan/ringkasan', [LaporanController::class, 'getRingkasan']);
});
