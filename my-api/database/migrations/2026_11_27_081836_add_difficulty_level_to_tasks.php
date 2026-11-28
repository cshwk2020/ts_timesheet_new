<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Decimal is perfect for half-stars (e.g., 3.5). Nullable in case it's optional.
            $table->decimal('difficulty_level', 2, 1)->nullable()->after('task_details');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('difficulty_level');
        });
    }
};