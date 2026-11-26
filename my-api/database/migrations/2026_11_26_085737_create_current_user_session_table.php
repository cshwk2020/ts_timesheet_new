<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('current_user_session', function (Blueprint $table) {
            $table->string('auth_session_id', 64)->primary();
            $table->string('user_id', 32)->index();
            $table->dateTime('logon_datetime');
            $table->dateTime('expire_datetime')->index();
            $table->string('user_agent')->nullable();
            $table->string('ip')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('user_id')->references('user_id')->on('auth_user_table');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('current_user_session');
    }
};