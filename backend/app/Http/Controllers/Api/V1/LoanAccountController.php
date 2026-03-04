<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\LoanAccount;
use App\Models\LoanEmiSchedule;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoanAccountController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(LoanAccount::with('account')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'lender' => 'required|string|max:255',
            'principal' => 'required|numeric|min:1',
            'interest_rate' => 'required|numeric|min:0|max:100',
            'tenure_months' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'account_id' => 'nullable|exists:accounts,id',
        ]);

        // Calculate EMI using PMT formula
        $r = ($validated['interest_rate'] / 100) / 12;
        $n = $validated['tenure_months'];
        $p = $validated['principal'];
        $emi = $r > 0
            ? $p * $r * pow(1 + $r, $n) / (pow(1 + $r, $n) - 1)
            : $p / $n;

        $validated['emi_amount'] = round($emi, 2);
        $validated['outstanding_balance'] = $validated['principal'];

        $loan = LoanAccount::create($validated);

        // Generate EMI schedule
        $this->generateEmiSchedule($loan);

        return response()->json($loan->load('emiSchedule'), 201);
    }

    public function show(LoanAccount $loanAccount): JsonResponse
    {
        return response()->json($loanAccount->load(['account', 'emiSchedule']));
    }

    public function update(Request $request, LoanAccount $loanAccount): JsonResponse
    {
        $validated = $request->validate(['status' => 'in:active,closed,foreclosed']);
        $loanAccount->update($validated);
        return response()->json($loanAccount);
    }

    public function destroy(LoanAccount $loanAccount): JsonResponse
    {
        DB::transaction(function () use ($loanAccount) {
            $loanAccount->emiSchedule()->delete();
            $loanAccount->delete();
        });
        return response()->json(['message' => 'Loan account deleted']);
    }

    private function generateEmiSchedule(LoanAccount $loan): void
    {
        $balance = $loan->principal;
        $r = ($loan->interest_rate / 100) / 12;
        $startDate = Carbon::parse($loan->start_date);

        for ($i = 1; $i <= $loan->tenure_months; $i++) {
            $interestComponent = round($balance * $r, 2);
            $principalComponent = round($loan->emi_amount - $interestComponent, 2);

            if ($i === $loan->tenure_months) {
                $principalComponent = $balance;
            }

            $balance -= $principalComponent;

            LoanEmiSchedule::create([
                'loan_id' => $loan->id,
                'installment_no' => $i,
                'due_date' => $startDate->copy()->addMonths($i)->toDateString(),
                'principal_component' => $principalComponent,
                'interest_component' => $interestComponent,
                'emi_amount' => $loan->emi_amount,
                'outstanding_principal' => max(0, $balance),
                'status' => 'pending',
            ]);
        }
    }
}
