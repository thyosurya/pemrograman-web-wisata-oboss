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
        Schema::create('wisatawan', function (Blueprint $table) {
            $table->id('id_wisatawan'); //m
            $table->string('nama', 100);//m
            $table->string('email', 100)->unique();//m
            $table->string('no_telp', 20)->nullable();//m
            $table->string('alamat', 255)->nullable();//m
            $table->dateTime('tanggal_daftar')->useCurrent();//m
            $table->timestamps();//m
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wisatawan');
    }
};
