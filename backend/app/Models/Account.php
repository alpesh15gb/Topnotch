<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'code', 'type', 'sub_type', 'parent_id',
        'opening_balance', 'opening_balance_type', 'is_system', 'is_active', 'description',
    ];

    protected $casts = [
        'is_system' => 'boolean',
        'is_active' => 'boolean',
        'opening_balance' => 'decimal:2',
    ];

    public function parent()
    {
        return $this->belongsTo(Account::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Account::class, 'parent_id');
    }

    public function voucherItems()
    {
        return $this->hasMany(VoucherItem::class);
    }

    public function invoicePayments()
    {
        return $this->hasMany(InvoicePayment::class);
    }

    public function bankAccounts()
    {
        return $this->hasMany(BankAccount::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function fundTransfersFrom()
    {
        return $this->hasMany(FundTransfer::class, 'from_account_id');
    }

    public function fundTransfersTo()
    {
        return $this->hasMany(FundTransfer::class, 'to_account_id');
    }

    public function allChildren()
    {
        return $this->children()->with('allChildren');
    }
}
