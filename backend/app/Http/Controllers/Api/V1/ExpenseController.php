<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Expense::with(['account', 'party'])->latest('date');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        if ($request->filled('from_date')) {
            $query->whereDate('date', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('date', '<=', $request->to_date);
        }

        return response()->json($query->paginate($request->get('per_page', 20)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'category' => 'required|string|max:100',
            'description' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'tax_rate_id' => 'nullable|exists:tax_rates,id',
            'account_id' => 'required|exists:accounts,id',
            'party_id' => 'nullable|exists:parties,id',
            'is_reimbursable' => 'boolean',
            'is_recurring' => 'boolean',
            'recurring_frequency' => 'nullable|required_if:is_recurring,true|in:daily,weekly,monthly,quarterly,yearly',
            'notes' => 'nullable|string',
        ]);

        if ($validated['is_recurring'] ?? false) {
            $validated['next_recurring_date'] = $validated['date'];
        }

        $expense = Expense::create($validated);

        return response()->json($expense->load(['account', 'party']), 201);
    }

    public function show(Expense $expense): JsonResponse
    {
        return response()->json($expense->load(['account', 'party', 'taxRate']));
    }

    public function update(Request $request, Expense $expense): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'date',
            'category' => 'string|max:100',
            'description' => 'string',
            'amount' => 'numeric|min:0.01',
            'account_id' => 'exists:accounts,id',
            'notes' => 'nullable|string',
        ]);

        $expense->update($validated);

        return response()->json($expense);
    }

    public function destroy(Expense $expense): JsonResponse
    {
        $expense->delete();
        return response()->json(['message' => 'Expense deleted']);
    }

    public function attachReceipt(Request $request, Expense $expense): JsonResponse
    {
        $request->validate(['receipt' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240']);

        $path = $request->file('receipt')->store('expenses/receipts', 'public');
        $expense->update(['receipt_path' => $path]);

        return response()->json(['path' => $path]);
    }
}
