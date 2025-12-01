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
        Schema::table('pemesanan', function (Blueprint $table) {
            $table->boolean('is_checked_in')->default(false)->after('status_pemesanan');
            $table->boolean('is_checked_out')->default(false)->after('is_checked_in');
            $table->dateTime('actual_checkin')->nullable()->after('is_checked_out');
            $table->dateTime('actual_checkout')->nullable()->after('actual_checkin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pemesanan', function (Blueprint $table) {
            $table->dropColumn(['is_checked_in', 'is_checked_out', 'actual_checkin', 'actual_checkout']);
        });
    }
};
