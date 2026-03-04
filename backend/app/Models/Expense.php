<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'date', 'category', 'description', 'amount', 'tax_rate_id', 'tax_amount',
        'account_id', 'party_id', 'is_reimbursable', 'receipt_path',
        'is_recurring', 'recurring_frequency', 'next_recurring_date', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'next_recurring_date' => 'date',
        'is_reimbursable' => 'boolean',
        'is_recurring' => 'boolean',
        'amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
    ];

    public function taxRate()
    {
        return $this->belongsTo(TaxRate::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function party()
    {
        return $this->belongsTo(Party::class);
    }
}
