<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('user_id', 32)->index(); // From BelongsToUser trait
            $table->string('name');
            $table->string('color')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Foreign key to auth_user_table
            $table->foreign('user_id')->references('user_id')->on('auth_user_table')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_types');
    }
};