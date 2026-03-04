<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('debit_notes', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->foreignId('party_id')->constrained('parties')->restrictOnDelete();
            $table->foreignId('purchase_bill_id')->nullable()->constrained('purchase_bills')->nullOnDelete();
            $table->date('date');
            $table->enum('status', ['draft', 'posted', 'applied', 'cancelled'])->default('draft');
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->decimal('balance', 15, 2)->default(0);
            $table->text('reason')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'date']);
            $table->index('party_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('debit_notes');
    }
};
