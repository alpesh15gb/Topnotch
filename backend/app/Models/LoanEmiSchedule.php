<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanEmiSchedule extends Model
{
    protected $fillable = [
        'loan_id', 'installment_no', 'due_date', 'principal_component',
        'interest_component', 'emi_amount', 'outstanding_principal', 'status', 'payment_date',
    ];

    protected $casts = [
        'due_date' => 'date',
        'payment_date' => 'date',
        'principal_component' => 'decimal:2',
        'interest_component' => 'decimal:2',
        'emi_amount' => 'decimal:2',
        'outstanding_principal' => 'decimal:2',
    ];

    public function loan()
    {
        return $this->belongsTo(LoanAccount::class, 'loan_id');
    }
}
