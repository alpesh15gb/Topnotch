<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendor_payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_number')->unique();
            $table->foreignId('party_id')->constrained('parties')->restrictOnDelete();
            $table->foreignId('account_id')->constrained('accounts')->restrictOnDelete();
            $table->date('date');
            $table->decimal('amount', 15, 2);
            $table->string('payment_mode')->nullable(); // cash/bank/cheque/upi/neft/rtgs
            $table->string('reference_number')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['party_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_payments');
    }
};
