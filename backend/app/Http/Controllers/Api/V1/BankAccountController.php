<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BankAccountController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(BankAccount::with('account')->where('is_active', true)->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bank_name' => 'required|string|max:255',
            'account_no' => 'required|string',
            'ifsc' => 'nullable|string|size:11',
            'account_type' => 'required|in:savings,current,cash,overdraft',
            'opening_balance' => 'nullable|numeric',
            'opening_date' => 'nullable|date',
            'account_id' => 'nullable|exists:accounts,id',
        ]);

        $validated['current_balance'] = $validated['opening_balance'] ?? 0;
        $account = BankAccount::create($validated);

        return response()->json($account, 201);
    }

    public function show(BankAccount $bankAccount): JsonResponse
    {
        $bankAccount->load(['account', 'transactions' => fn($q) => $q->latest('date')->limit(50)]);
        return response()->json($bankAccount);
    }

    public function update(Request $request, BankAccount $bankAccount): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'ifsc' => 'nullable|string|size:11',
            'is_active' => 'boolean',
        ]);

        $bankAccount->update($validated);

        return response()->json($bankAccount);
    }

    public function destroy(BankAccount $bankAccount): JsonResponse
    {
        if ($bankAccount->transactions()->exists()) {
            return response()->json(['message' => 'Cannot delete account with transactions'], 422);
        }

        $bankAccount->delete();

        return response()->json(['message' => 'Bank account deleted']);
    }

    public function reconcile(Request $request, BankAccount $bankAccount): JsonResponse
    {
        $validated = $request->validate([
            'transaction_ids' => 'required|array',
            'transaction_ids.*' => 'exists:bank_transactions,id',
            'statement_balance' => 'required|numeric',
        ]);

        $bankAccount->transactions()
            ->whereIn('id', $validated['transaction_ids'])
            ->update(['is_reconciled' => true]);

        return response()->json(['message' => 'Transactions reconciled', 'statement_balance' => $validated['statement_balance']]);
    }
}
