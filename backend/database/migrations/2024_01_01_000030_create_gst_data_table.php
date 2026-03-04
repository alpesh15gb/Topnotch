<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gst_data', function (Blueprint $table) {
            $table->id();
            $table->enum('return_type', ['GSTR1', 'GSTR2', 'GSTR3B', 'GSTR9', 'GSTR9C']);
            $table->string('period', 7); // YYYY-MM format
            $table->json('data');
            $table->enum('status', ['draft', 'filed'])->default('draft');
            $table->timestamp('filed_at')->nullable();
            $table->timestamps();

            $table->unique(['return_type', 'period']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gst_data');
    }
};
