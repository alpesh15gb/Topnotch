<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LoanAccount extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'lender', 'principal', 'interest_rate', 'tenure_months',
        'emi_amount', 'start_date', 'account_id', 'outstanding_balance', 'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'principal' => 'decimal:2',
        'interest_rate' => 'decimal:2',
        'emi_amount' => 'decimal:2',
        'outstanding_balance' => 'decimal:2',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function emiSchedule()
    {
        return $this->hasMany(LoanEmiSchedule::class, 'loan_id')->orderBy('installment_no');
    }
}
