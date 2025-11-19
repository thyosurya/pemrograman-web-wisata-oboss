<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kamar_villa', function (Blueprint $table) {
            $table->id('id_kamar');//m
            $table->string('tipe_kamar', 50);//m
            $table->text('deskripsi')->nullable();//m
            $table->decimal('harga_permalam', 10, 2);//m
            $table->integer('kapasitas');//m
            $table->integer('jumlah_tersedia');//m
            $table->boolean('status_aktif')->default(true);//m
            $table->string('foto_utama', 255)->nullable();//m
            $table->timestamps();//m
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kamar_villa');
    }
};
