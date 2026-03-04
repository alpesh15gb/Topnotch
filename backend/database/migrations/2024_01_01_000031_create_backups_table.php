<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('backups', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['google_drive', 'local', 's3']);
            $table->string('filename');
            $table->unsignedBigInteger('size')->default(0); // bytes
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->string('path')->nullable();
            $table->string('drive_file_id')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('backups');
    }
};
