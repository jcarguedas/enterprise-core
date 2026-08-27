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
        Schema::table('customers', function (Blueprint $table) {
            $table->string('economic_activity_code', 20)->nullable()->index()->after('fiscal_email');
            $table->string('economic_activity_name')->nullable()->after('economic_activity_code');
            $table->string('province_code', 2)->nullable()->after('province');
            $table->string('province_name', 100)->nullable()->after('province_code');
            $table->string('canton_code', 2)->nullable()->after('canton');
            $table->string('canton_name', 100)->nullable()->after('canton_code');
            $table->string('district_code', 2)->nullable()->after('district');
            $table->string('district_name', 100)->nullable()->after('district_code');
            $table->string('neighborhood_code', 2)->nullable()->after('neighborhood');
            $table->string('neighborhood_name', 100)->nullable()->after('neighborhood_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropIndex(['economic_activity_code']);
            $table->dropColumn([
                'economic_activity_code',
                'economic_activity_name',
                'province_code',
                'province_name',
                'canton_code',
                'canton_name',
                'district_code',
                'district_name',
                'neighborhood_code',
                'neighborhood_name',
            ]);
        });
    }
};
