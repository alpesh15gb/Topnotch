<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cheque;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChequeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Cheque::with(['party', 'bankAccount'])->latest('date');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->paginate($request->get('per_page', 20)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:issued,received',
            'cheque_no' => 'required|string',
            'date' => 'required|date',
            'bank_name' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'party_id' => 'nullable|exists:parties,id',
            'bank_account_id' => 'required|exists:bank_accounts,id',
            'post_dated_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $cheque = Cheque::create($validated);

        return response()->json($cheque->load(['party', 'bankAccount']), 201);
    }

    public function show(Cheque $cheque): JsonResponse
    {
        return response()->json($cheque->load(['party', 'bankAccount']));
    }

    public function update(Request $request, Cheque $cheque): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'in:pending,cleared,bounced,cancelled',
            'clearance_date' => 'nullable|date',
            'bounce_charges' => 'nullable|numeric|min:0',
        ]);

        $cheque->update($validated);

        return response()->json($cheque);
    }

    public function destroy(Cheque $cheque): JsonResponse
    {
        if ($cheque->status !== 'pending') {
            return response()->json(['message' => 'Only pending cheques can be deleted'], 422);
        }
        $cheque->delete();
        return response()->json(['message' => 'Cheque deleted']);
    }
}
