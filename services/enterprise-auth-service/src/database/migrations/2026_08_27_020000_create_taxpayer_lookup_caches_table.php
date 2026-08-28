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
        Schema::create('taxpayer_lookup_caches', function (Blueprint $table) {
            $table->id();
            $table->string('identification_number')->index();
            $table->string('source')->default('hacienda');
            $table->json('payload')->nullable();
            $table->json('normalized_payload')->nullable();
            $table->string('status')->nullable();
            $table->unsignedSmallInteger('http_status')->nullable();
            $table->timestamp('fetched_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();

            $table->index(['source', 'identification_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taxpayer_lookup_caches');
    }
};
