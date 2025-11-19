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
        return response()->json($pemesanan, 201);
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
        $pemesanan = Pemesanan::findOrFail($id);
        
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

        $pemesanan->update($validated);
        return response()->json($pemesanan);
    }

    /**
     * Remove the specified pemesanan from storage.
     */
    public function destroy($id)
    {
        $pemesanan = Pemesanan::findOrFail($id);
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
}
