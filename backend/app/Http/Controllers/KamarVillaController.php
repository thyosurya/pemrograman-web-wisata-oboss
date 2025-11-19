<?php

namespace App\Http\Controllers;

use App\Models\KamarVilla;
use Illuminate\Http\Request;

class KamarVillaController extends Controller
{
    /**
     * Display a listing of kamar villa.
     */
    public function index()
    {
        $kamarVilla = KamarVilla::all();
        return response()->json($kamarVilla);
    }

    /**
     * Store a newly created kamar villa in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipe_kamar' => 'required|string|max:50',
            'deskripsi' => 'nullable|string',
            'harga_permalam' => 'required|numeric|min:0',
            'kapasitas' => 'required|integer|min:1',
            'jumlah_tersedia' => 'required|integer|min:0',
            'status_aktif' => 'nullable|boolean',
            'foto_utama' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        // Handle file upload
        if ($request->hasFile('foto_utama')) {
            $file = $request->file('foto_utama');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/kamar_villa'), $filename);
            $validated['foto_utama'] = 'uploads/kamar_villa/' . $filename;
        } elseif ($request->has('foto_utama_url')) {
            // If URL is provided instead of file
            $validated['foto_utama'] = $request->input('foto_utama_url');
        }

        $kamarVilla = KamarVilla::create($validated);
        return response()->json($kamarVilla, 201);
    }

    /**
     * Display the specified kamar villa.
     */
    public function show($id)
    {
        $kamarVilla = KamarVilla::findOrFail($id);
        return response()->json($kamarVilla);
    }

    /**
     * Update the specified kamar villa in storage.
     */
    public function update(Request $request, $id)
    {
        $kamarVilla = KamarVilla::findOrFail($id);
        
        $validated = $request->validate([
            'tipe_kamar' => 'sometimes|required|string|max:50',
            'deskripsi' => 'nullable|string',
            'harga_permalam' => 'sometimes|required|numeric|min:0',
            'kapasitas' => 'sometimes|required|integer|min:1',
            'jumlah_tersedia' => 'sometimes|required|integer|min:0',
            'status_aktif' => 'nullable|boolean',
            'foto_utama' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        // Handle file upload
        if ($request->hasFile('foto_utama')) {
            // Delete old photo if exists
            if ($kamarVilla->foto_utama && file_exists(public_path($kamarVilla->foto_utama))) {
                unlink(public_path($kamarVilla->foto_utama));
            }
            
            $file = $request->file('foto_utama');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/kamar_villa'), $filename);
            $validated['foto_utama'] = 'uploads/kamar_villa/' . $filename;
        } elseif ($request->has('foto_utama_url')) {
            // If URL is provided instead of file
            $validated['foto_utama'] = $request->input('foto_utama_url');
        }

        $kamarVilla->update($validated);
        return response()->json($kamarVilla);
    }

    /**
     * Remove the specified kamar villa from storage.
     */
    public function destroy($id)
    {
        $kamarVilla = KamarVilla::findOrFail($id);
        
        // Delete photo file if exists
        if ($kamarVilla->foto_utama && file_exists(public_path($kamarVilla->foto_utama))) {
            unlink(public_path($kamarVilla->foto_utama));
        }
        
        $kamarVilla->delete();
        return response()->json(['message' => 'Kamar Villa deleted successfully'], 200);
    }
}
