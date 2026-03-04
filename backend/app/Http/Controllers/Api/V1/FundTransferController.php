<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\FundTransfer;
use App\Services\AccountingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FundTransferController extends Controller
{
    public function __construct(private AccountingService $accountingService) {}

    public function index(Request $request): JsonResponse
    {
        $query = FundTransfer::with(['fromAccount', 'toAccount'])->latest('date');
        return response()->json($query->paginate($request->get('per_page', 20)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'from_account_id' => 'required|exists:accounts,id|different:to_account_id',
            'to_account_id' => 'required|exists:accounts,id',
            'amount' => 'required|numeric|min:0.01',
            'reference' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $transfer = FundTransfer::create($validated);

            // Post double-entry voucher
            $this->accountingService->postVoucher(
                'contra',
                [
                    ['account_id' => $validated['to_account_id'], 'debit' => $validated['amount'], 'credit' => 0],
                    ['account_id' => $validated['from_account_id'], 'debit' => 0, 'credit' => $validated['amount']],
                ],
                $validated['date'],
                'Fund Transfer: ' . ($validated['notes'] ?? $validated['reference'] ?? ''),
                'fund_transfer',
                $transfer->id
            );

            return response()->json($transfer->load(['fromAccount', 'toAccount']), 201);
        });
    }

    public function show(FundTransfer $fundTransfer): JsonResponse
    {
        return response()->json($fundTransfer->load(['fromAccount', 'toAccount']));
    }

    public function destroy(FundTransfer $fundTransfer): JsonResponse
    {
        $fundTransfer->delete();
        return response()->json(['message' => 'Fund transfer deleted']);
    }
}
