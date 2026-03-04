<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parties', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['customer', 'supplier', 'both'])->default('customer');
            $table->string('name');
            $table->string('display_name')->nullable();
            $table->string('gstin', 15)->nullable();
            $table->string('pan', 10)->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 15)->nullable();
            $table->text('billing_address')->nullable();
            $table->text('shipping_address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('state_code', 2)->nullable();
            $table->string('pincode', 6)->nullable();
            $table->string('country')->default('India');
            $table->decimal('credit_limit', 15, 2)->default(0);
            $table->unsignedInteger('payment_terms_days')->default(30);
            $table->decimal('opening_balance', 15, 2)->default(0);
            $table->enum('balance_type', ['Dr', 'Cr'])->default('Dr');
            $table->decimal('current_balance', 15, 2)->default(0);
            $table->string('bank_account_no')->nullable();
            $table->string('bank_ifsc')->nullable();
            $table->string('bank_name')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['type', 'is_active']);
            $table->index('gstin');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parties');
    }
};
