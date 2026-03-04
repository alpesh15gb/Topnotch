<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Services\AccountingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function __construct(private AccountingService $accountingService) {}

    public function index(Request $request): JsonResponse
    {
        $query = Account::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->boolean('active_only', false)) {
            $query->where('is_active', true);
        }

        return response()->json($query->orderBy('type')->orderBy('name')->get());
    }

    public function tree(): JsonResponse
    {
        $accounts = Account::whereNull('parent_id')
            ->with('allChildren')
            ->orderBy('type')
            ->orderBy('name')
            ->get();

        return response()->json($accounts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|unique:accounts',
            'type' => 'required|in:asset,liability,income,expense,equity',
            'sub_type' => 'nullable|string',
            'parent_id' => 'nullable|exists:accounts,id',
            'opening_balance' => 'nullable|numeric',
            'opening_balance_type' => 'nullable|in:Dr,Cr',
            'description' => 'nullable|string',
        ]);

        $account = Account::create($validated);

        return response()->json($account, 201);
    }

    public function show(Account $account): JsonResponse
    {
        $balance = $this->accountingService->getBalance($account->id);
        return response()->json(array_merge($account->toArray(), ['current_balance' => $balance]));
    }

    public function update(Request $request, Account $account): JsonResponse
    {
        if ($account->is_system) {
            return response()->json(['message' => 'Cannot modify system account'], 422);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'code' => 'nullable|string|unique:accounts,code,' . $account->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $account->update($validated);

        return response()->json($account);
    }

    public function destroy(Account $account): JsonResponse
    {
        if ($account->is_system) {
            return response()->json(['message' => 'Cannot delete system account'], 422);
        }

        if ($account->voucherItems()->exists()) {
            return response()->json(['message' => 'Cannot delete account with transactions'], 422);
        }

        $account->delete();

        return response()->json(['message' => 'Account deleted']);
    }
}
