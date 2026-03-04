<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // payment/receipt/journal/contra/sales/purchase
            $table->string('reference_type')->nullable(); // morphable model
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->date('date');
            $table->string('narration')->nullable();
            $table->string('number')->nullable();
            $table->timestamps();

            $table->index(['reference_type', 'reference_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
