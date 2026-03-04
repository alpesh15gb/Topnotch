<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankTransaction extends Model
{
    protected $fillable = [
        'bank_account_id', 'date', 'type', 'amount', 'description',
        'reference', 'is_reconciled', 'voucher_type', 'voucher_id',
    ];

    protected $casts = [
        'date' => 'date',
        'is_reconciled' => 'boolean',
        'amount' => 'decimal:2',
    ];

    public function bankAccount()
    {
        return $this->belongsTo(BankAccount::class);
    }
}
