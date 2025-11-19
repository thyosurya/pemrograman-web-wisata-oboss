<?php

namespace App\Http\Controllers;

use App\Models\Wisatawan;
use Illuminate\Http\Request;

class WisatawanController extends Controller
{
    /**
     * Display a listing of wisatawan.
     */
    public function index()
    {
        $wisatawan = Wisatawan::all();
        return response()->json($wisatawan);
    }

    /**
     * Store a newly created wisatawan in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'email' => 'required|email|unique:wisatawan,email',
            'no_telp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string|max:255',
        ]);

        $wisatawan = Wisatawan::create($validated);
        return response()->json($wisatawan, 201);
    }

    /**
     * Display the specified wisatawan.
     */
    public function show($id)
    {
        $wisatawan = Wisatawan::findOrFail($id);
        return response()->json($wisatawan);
    }

    /**
     * Update the specified wisatawan in storage.
     */
    public function update(Request $request, $id)
    {
        $wisatawan = Wisatawan::findOrFail($id);
        
        $validated = $request->validate([
            'nama_lengkap' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|email|max:100|unique:wisatawan,email,' . $wisatawan->id_wisatawan . ',id_wisatawan',
            'no_telepon' => 'sometimes|required|string|max:20',
            'alamat' => 'nullable|string',
        ]);

        $wisatawan->update($validated);
        return response()->json($wisatawan);
    }

    /**
     * Remove the specified wisatawan from storage.
     */
    public function destroy($id)
    {
        $wisatawan = Wisatawan::findOrFail($id);
        $wisatawan->delete();
        return response()->json(['message' => 'Wisatawan deleted successfully'], 200);
    }
}
