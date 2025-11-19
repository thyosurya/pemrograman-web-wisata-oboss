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
        Schema::create('pemesanan', function (Blueprint $table) {
            $table->id('id_pemesanan');//m
            $table->unsignedBigInteger('id_wisatawan');//m
            $table->unsignedBigInteger('id_kamar');//m
            $table->dateTime('tgl_pemesanan')->useCurrent();//m
            $table->date('tgl_checkin')->nullable();//m
            $table->date('tgl_checkout')->nullable();//m
            $table->integer('jumlah_tamu');//m
            $table->integer('jumlah_malam');//m
            $table->decimal('harga_permalam', 10, 2);//m
            $table->decimal('total_harga', 10, 2);//m
            $table->enum('status_pemesanan', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');//m
            $table->string('booking_token', 10)->unique()->nullable();//b
            $table->string('bukti_pembayaran')->nullable();//b
            $table->text('catatan')->nullable();//m
            $table->timestamps();//m

            // Foreign Keys
            $table->foreign('id_wisatawan')->references('id_wisatawan')->on('wisatawan')->onDelete('cascade');//m
            $table->foreign('id_kamar')->references('id_kamar')->on('kamar_villa')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemesanan');
    }
};
