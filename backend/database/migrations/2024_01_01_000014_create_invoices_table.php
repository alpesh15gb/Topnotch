<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('number');
            $table->string('series_prefix')->default('INV');
            $table->foreignId('party_id')->constrained('parties')->restrictOnDelete();
            $table->foreignId('sale_order_id')->nullable()->constrained('sale_orders')->nullOnDelete();
            $table->foreignId('proforma_id')->nullable()->constrained('proforma_invoices')->nullOnDelete();
            $table->foreignId('estimate_id')->nullable()->constrained('estimates')->nullOnDelete();
            $table->date('date');
            $table->date('due_date')->nullable();
            $table->string('supply_state')->nullable();
            $table->string('supply_state_code', 2)->nullable();
            $table->string('place_of_supply')->nullable();
            $table->boolean('is_igst')->default(false);
            $table->enum('status', ['draft', 'posted', 'partially_paid', 'paid', 'overdue', 'cancelled'])->default('draft');
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('tcs_rate', 5, 2)->default(0);
            $table->decimal('tcs_amount', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->decimal('amount_paid', 15, 2)->default(0);
            $table->decimal('balance', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->string('irn')->nullable(); // e-invoice IRN
            $table->unsignedTinyInteger('template_id')->default(1);
            $table->boolean('is_recurring')->default(false);
            $table->string('recurring_frequency')->nullable(); // daily/weekly/monthly/quarterly/yearly
            $table->date('next_recurring_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'date']);
            $table->index(['party_id', 'status']);
            $table->index('due_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
