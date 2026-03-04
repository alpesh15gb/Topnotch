<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BankAccount extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'bank_name', 'account_no', 'ifsc', 'account_type',
        'opening_balance', 'opening_date', 'current_balance', 'account_id', 'is_active',
    ];

    protected $casts = [
        'opening_date' => 'date',
        'is_active' => 'boolean',
        'opening_balance' => 'decimal:2',
        'current_balance' => 'decimal:2',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function transactions()
    {
        return $this->hasMany(BankTransaction::class);
    }

    public function cheques()
    {
        return $this->hasMany(Cheque::class);
    }
}
