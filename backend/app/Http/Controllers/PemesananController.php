<?php

namespace App\Http\Controllers;

use App\Models\Pemesanan;
use Illuminate\Http\Request;

class PemesananController extends Controller
{
    /**
     * Display a listing of pemesanan.
     */
    public function index()
    {
        $pemesanan = Pemesanan::with(['wisatawan', 'kamarVilla'])->get();
        return response()->json($pemesanan);
    }

    /**
     * Store a newly created pemesanan in storage.
     */
    public function store(Request $request)
    {
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

        // Handle file upload
        if ($request->hasFile('bukti_pembayaran')) {
            $file = $request->file('bukti_pembayaran');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/bukti_pembayaran'), $filename);
            $validated['bukti_pembayaran'] = 'uploads/bukti_pembayaran/' . $filename;
        }

        // Calculate jumlah_malam and total_harga
        $checkin = new \DateTime($validated['tgl_checkin']);
        $checkout = new \DateTime($validated['tgl_checkout']);
        $jumlahMalam = $checkout->diff($checkin)->days;

        // Get harga_permalam from kamar
        $kamarVilla = \App\Models\KamarVilla::find($validated['id_kamar']);
        $hargaPermalam = $kamarVilla->harga_permalam;
        $totalHarga = $hargaPermalam * $jumlahMalam;

        $validated['jumlah_malam'] = $jumlahMalam;
        $validated['harga_permalam'] = $hargaPermalam;
        $validated['total_harga'] = $totalHarga;
        $validated['tgl_pemesanan'] = now();
        $validated['booking_token'] = strtoupper(substr(uniqid(), -8));

        $pemesanan = Pemesanan::create($validated);

        // Jika langsung confirmed, kurangi ketersediaan kamar
        if (isset($validated['status_pemesanan']) && $validated['status_pemesanan'] === 'confirmed') {
            $kamarVilla->jumlah_tersedia -= 1;
            $kamarVilla->save();
        }

        return response()->json($pemesanan->load(['wisatawan', 'kamarVilla']), 201);
    }

    /**
     * Display the specified pemesanan.
     */
    public function show($id)
    {
        $pemesanan = Pemesanan::with(['wisatawan', 'kamarVilla'])->findOrFail($id);
        return response()->json($pemesanan);
    }

    /**
     * Update the specified pemesanan in storage.
     */
    public function update(Request $request, $id)
    {
        $pemesanan = Pemesanan::with('kamarVilla')->findOrFail($id);
        $statusLama = $pemesanan->status_pemesanan;
        
        $validated = $request->validate([
            'tgl_checkin' => 'sometimes|required|date',
            'tgl_checkout' => 'sometimes|required|date',
            'jumlah_tamu' => 'sometimes|required|integer|min:1',
            'status_pemesanan' => 'nullable|in:pending,confirmed,completed,cancelled',
            'catatan' => 'nullable|string',
        ]);

        // Recalculate if dates changed
        if (isset($validated['tgl_checkin']) || isset($validated['tgl_checkout'])) {
            $checkin = new \DateTime($validated['tgl_checkin'] ?? $pemesanan->tgl_checkin);
            $checkout = new \DateTime($validated['tgl_checkout'] ?? $pemesanan->tgl_checkout);
            $jumlahMalam = $checkout->diff($checkin)->days;
            $validated['jumlah_malam'] = $jumlahMalam;
            $validated['total_harga'] = $pemesanan->harga_permalam * $jumlahMalam;
        }

        // Handle perubahan status untuk update ketersediaan kamar
        if (isset($validated['status_pemesanan']) && $validated['status_pemesanan'] !== $statusLama) {
            $kamar = $pemesanan->kamarVilla;
            
            // Tentukan apakah status lama "mengunci" kamar (occupied)
            $wasOccupied = in_array($statusLama, ['confirmed']);
            // Tentukan apakah status baru "mengunci" kamar (occupied)
            $willBeOccupied = in_array($validated['status_pemesanan'], ['confirmed']);
            
            // Jika dari tidak occupied menjadi occupied: kurangi ketersediaan
            if (!$wasOccupied && $willBeOccupied) {
                if ($kamar->jumlah_tersedia < 1) {
                    return response()->json(['message' => 'Kamar tidak tersedia'], 400);
                }
                $kamar->jumlah_tersedia -= 1;
                $kamar->save();
            }
            
            // Jika dari occupied menjadi tidak occupied: tambah ketersediaan
            if ($wasOccupied && !$willBeOccupied) {
                // Hanya tambah jika belum pernah check-out (untuk menghindari double penambahan)
                if (!$pemesanan->is_checked_out) {
                    $kamar->jumlah_tersedia += 1;
                    $kamar->save();
                }
            }
        }

        $pemesanan->update($validated);
        return response()->json($pemesanan->load(['wisatawan', 'kamarVilla']));
    }

    /**
     * Remove the specified pemesanan from storage.
     */
    public function destroy($id)
    {
        $pemesanan = Pemesanan::with('kamarVilla')->findOrFail($id);
        
        // Jika pemesanan confirmed atau checked-in tapi belum check-out, kembalikan ketersediaan
        if (($pemesanan->status_pemesanan === 'confirmed' || $pemesanan->is_checked_in) && !$pemesanan->is_checked_out) {
            $kamar = $pemesanan->kamarVilla;
            $kamar->jumlah_tersedia += 1;
            $kamar->save();
        }
        
        $pemesanan->delete();
        return response()->json(['message' => 'Pemesanan deleted successfully'], 200);
    }

    /**
     * Check booking status by token.
     */
    public function checkByToken($token)
    {
        $pemesanan = Pemesanan::with(['wisatawan', 'kamarVilla'])
            ->where('booking_token', strtoupper($token))
            ->first();

        if (!$pemesanan) {
            return response()->json(['message' => 'Booking tidak ditemukan'], 404);
        }

        return response()->json($pemesanan);
    }

    /**
     * Check-in: Mengurangi ketersediaan kamar
     */
    public function checkIn($id)
    {
        $pemesanan = Pemesanan::with(['kamarVilla'])->findOrFail($id);

        // Validasi status
        if ($pemesanan->is_checked_in) {
            return response()->json(['message' => 'Pemesanan sudah check-in'], 400);
        }

        if ($pemesanan->status_pemesanan !== 'confirmed') {
            return response()->json(['message' => 'Pemesanan harus dikonfirmasi terlebih dahulu'], 400);
        }

        // Cek ketersediaan kamar
        $kamar = $pemesanan->kamarVilla;
        
        // Jika belum pernah dikurangi ketersediaannya (status bukan confirmed), kurangi sekarang
        $needToReduceAvailability = false;
        if ($pemesanan->status_pemesanan !== 'confirmed') {
            if ($kamar->jumlah_tersedia < 1) {
                return response()->json(['message' => 'Kamar tidak tersedia'], 400);
            }
            $needToReduceAvailability = true;
        }

        // Update pemesanan
        $pemesanan->is_checked_in = true;
        $pemesanan->actual_checkin = now();
        $pemesanan->status_pemesanan = 'confirmed'; // Pastikan statusnya confirmed
        $pemesanan->save();

        // Kurangi ketersediaan kamar jika belum pernah dikurangi
        if ($needToReduceAvailability) {
            $kamar->jumlah_tersedia -= 1;
            $kamar->save();
        }

        return response()->json([
            'message' => 'Check-in berhasil',
            'pemesanan' => $pemesanan,
            'kamar_tersedia' => $kamar->jumlah_tersedia
        ]);
    }

    /**
     * Check-out: Menambah ketersediaan kamar
     */
    public function checkOut($id)
    {
        $pemesanan = Pemesanan::with(['kamarVilla'])->findOrFail($id);

        // Validasi status
        if (!$pemesanan->is_checked_in) {
            return response()->json(['message' => 'Pemesanan belum check-in'], 400);
        }

        if ($pemesanan->is_checked_out) {
            return response()->json(['message' => 'Pemesanan sudah check-out'], 400);
        }

        // Update pemesanan
        $pemesanan->is_checked_out = true;
        $pemesanan->actual_checkout = now();
        $pemesanan->status_pemesanan = 'completed';
        $pemesanan->save();

        // Tambah ketersediaan kamar
        $kamar = $pemesanan->kamarVilla;
        $kamar->jumlah_tersedia += 1;
        $kamar->save();

        return response()->json([
            'message' => 'Check-out berhasil',
            'pemesanan' => $pemesanan,
            'kamar_tersedia' => $kamar->jumlah_tersedia
        ]);
    }
}
