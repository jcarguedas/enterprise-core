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
            $table->string('legal_name')->nullable()->after('name');
            $table->string('commercial_name')->nullable()->after('legal_name');
            $table->string('fiscal_email')->nullable()->index()->after('email');
            $table->string('province', 100)->nullable()->after('address');
            $table->string('canton', 100)->nullable()->after('province');
            $table->string('district', 100)->nullable()->after('canton');
            $table->string('neighborhood', 100)->nullable()->after('district');
            $table->string('other_signs', 500)->nullable()->after('neighborhood');
            $table->text('fiscal_notes')->nullable()->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropIndex(['fiscal_email']);
            $table->dropColumn([
                'legal_name',
                'commercial_name',
                'fiscal_email',
                'province',
                'canton',
                'district',
                'neighborhood',
                'other_signs',
                'fiscal_notes',
            ]);
        });
    }
};
