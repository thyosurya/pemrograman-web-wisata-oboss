<?php

namespace App\Http\Controllers;

use App\Models\Pemesanan;
use App\Models\Wisatawan;
use App\Models\KamarVilla;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LaporanController extends Controller
{
    /**
     * Get laporan berdasarkan periode
     */
    public function getLaporan(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = $validated['start_date'];
        $endDate = $validated['end_date'];

        // Get pemesanan dalam periode
        $pemesanan = Pemesanan::with(['wisatawan', 'kamarVilla'])
            ->whereBetween('tgl_pemesanan', [$startDate, $endDate])
            ->get();

        // Statistik Umum
        $totalPemesanan = $pemesanan->count();
        $totalPendapatan = $pemesanan->sum('total_harga');
        $totalWisatawan = $pemesanan->sum('jumlah_tamu');
        $totalMalam = $pemesanan->sum('jumlah_malam');

        // Status Pemesanan
        $statusPemesanan = $pemesanan->groupBy('status_pemesanan')->map(function ($group) {
            return [
                'count' => $group->count(),
                'total_pendapatan' => $group->sum('total_harga'),
            ];
        });

        // Kamar Terpopuler
        $kamarTerpopuler = $pemesanan->groupBy('id_kamar')->map(function ($group) {
            $kamar = $group->first()->kamarVilla;
            return [
                'id_kamar' => $kamar->id_kamar,
                'tipe_kamar' => $kamar->tipe_kamar,
                'total_booking' => $group->count(),
                'total_pendapatan' => $group->sum('total_harga'),
                'total_malam' => $group->sum('jumlah_malam'),
            ];
        })->sortByDesc('total_booking')->values();

        // Pendapatan Per Hari
        $pendapatanPerHari = $pemesanan->groupBy(function ($item) {
            return \Carbon\Carbon::parse($item->tgl_pemesanan)->format('Y-m-d');
        })->map(function ($group, $date) {
            return [
                'tanggal' => $date,
                'jumlah_pemesanan' => $group->count(),
                'total_pendapatan' => $group->sum('total_harga'),
            ];
        })->sortBy('tanggal')->values();

        // Rata-rata
        $rataRataPendapatan = $totalPemesanan > 0 ? $totalPendapatan / $totalPemesanan : 0;
        $rataRataTamu = $totalPemesanan > 0 ? $totalWisatawan / $totalPemesanan : 0;
        $rataRataMalam = $totalPemesanan > 0 ? $totalMalam / $totalPemesanan : 0;

        // Tingkat Okupansi
        $totalKamarTersedia = KamarVilla::where('status_aktif', true)->sum('jumlah_tersedia');
        $totalHariPeriode = \Carbon\Carbon::parse($startDate)->diffInDays(\Carbon\Carbon::parse($endDate)) + 1;
        $totalKapasitas = $totalKamarTersedia * $totalHariPeriode;
        $tingkatOkupansi = $totalKapasitas > 0 ? ($totalMalam / $totalKapasitas) * 100 : 0;

        return response()->json([
            'periode' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'jumlah_hari' => $totalHariPeriode,
            ],
            'statistik_umum' => [
                'total_pemesanan' => $totalPemesanan,
                'total_pendapatan' => $totalPendapatan,
                'total_wisatawan' => $totalWisatawan,
                'total_malam' => $totalMalam,
                'rata_rata_pendapatan' => round($rataRataPendapatan, 2),
                'rata_rata_tamu' => round($rataRataTamu, 2),
                'rata_rata_malam' => round($rataRataMalam, 2),
                'tingkat_okupansi' => round($tingkatOkupansi, 2),
            ],
            'status_pemesanan' => $statusPemesanan,
            'kamar_terpopuler' => $kamarTerpopuler,
            'pendapatan_per_hari' => $pendapatanPerHari,
            'detail_pemesanan' => $pemesanan->map(function ($item) {
                return [
                    'id_pemesanan' => $item->id_pemesanan,
                    'booking_token' => $item->booking_token,
                    'tgl_pemesanan' => $item->tgl_pemesanan,
                    'tgl_checkin' => $item->tgl_checkin,
                    'tgl_checkout' => $item->tgl_checkout,
                    'wisatawan' => $item->wisatawan->nama,
                    'kamar' => $item->kamarVilla->tipe_kamar,
                    'jumlah_tamu' => $item->jumlah_tamu,
                    'jumlah_malam' => $item->jumlah_malam,
                    'total_harga' => $item->total_harga,
                    'status_pemesanan' => $item->status_pemesanan,
                ];
            }),
        ]);
    }

    /**
     * Get laporan ringkasan (tanpa filter, data terkini)
     */
    public function getRingkasan()
    {
        $today = now()->format('Y-m-d');
        $thisMonth = now()->format('Y-m');
        $thisYear = now()->format('Y');

        // Hari Ini
        $hariIni = Pemesanan::whereDate('tgl_pemesanan', $today)->get();
        
        // Bulan Ini
        $bulanIni = Pemesanan::whereYear('tgl_pemesanan', $thisYear)
            ->whereMonth('tgl_pemesanan', now()->month)
            ->get();
        
        // Tahun Ini
        $tahunIni = Pemesanan::whereYear('tgl_pemesanan', $thisYear)->get();

        return response()->json([
            'hari_ini' => [
                'total_pemesanan' => $hariIni->count(),
                'total_pendapatan' => $hariIni->sum('total_harga'),
            ],
            'bulan_ini' => [
                'total_pemesanan' => $bulanIni->count(),
                'total_pendapatan' => $bulanIni->sum('total_harga'),
            ],
            'tahun_ini' => [
                'total_pemesanan' => $tahunIni->count(),
                'total_pendapatan' => $tahunIni->sum('total_harga'),
            ],
        ]);
    }
}
