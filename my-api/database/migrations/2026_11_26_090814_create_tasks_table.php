<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('user_id', 32)->index(); // From BelongsToUser trait
            
            $table->dateTime('from_datetime');
            $table->dateTime('to_datetime');
            $table->bigInteger('from_timestamp')->index();
            $table->bigInteger('to_timestamp')->index();
            
            $table->text('task_details');
            
            // Foreign key to task_types
            $table->uuid('task_type_id')->index();
            
            // ENUM for status as defined in TS
            $table->enum('status', ['planned', 'done'])->default('planned');
            
            $table->timestamps();
            $table->softDeletes();

            // Foreign keys
            $table->foreign('user_id')->references('user_id')->on('auth_user_table')->onDelete('cascade');
            $table->foreign('task_type_id')->references('id')->on('task_types')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};