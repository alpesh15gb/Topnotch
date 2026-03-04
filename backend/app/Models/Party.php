<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Party extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'type', 'name', 'display_name', 'gstin', 'pan', 'email', 'phone',
        'billing_address', 'shipping_address', 'city', 'state', 'state_code',
        'pincode', 'country', 'credit_limit', 'payment_terms_days',
        'opening_balance', 'balance_type', 'current_balance',
        'bank_account_no', 'bank_ifsc', 'bank_name', 'is_active', 'notes',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'credit_limit' => 'decimal:2',
        'opening_balance' => 'decimal:2',
        'current_balance' => 'decimal:2',
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function estimates()
    {
        return $this->hasMany(Estimate::class);
    }

    public function saleOrders()
    {
        return $this->hasMany(SaleOrder::class);
    }

    public function purchaseBills()
    {
        return $this->hasMany(PurchaseBill::class);
    }

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function cheques()
    {
        return $this->hasMany(Cheque::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
}
