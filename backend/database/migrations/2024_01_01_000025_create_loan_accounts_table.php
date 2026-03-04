<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loan_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('lender');
            $table->decimal('principal', 15, 2);
            $table->decimal('interest_rate', 5, 2); // per annum
            $table->unsignedSmallInteger('tenure_months');
            $table->decimal('emi_amount', 15, 2)->default(0);
            $table->date('start_date');
            $table->foreignId('account_id')->nullable()->constrained('accounts')->nullOnDelete();
            $table->decimal('outstanding_balance', 15, 2)->default(0);
            $table->enum('status', ['active', 'closed', 'foreclosed'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loan_accounts');
    }
};
