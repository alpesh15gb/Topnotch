<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Party;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Party::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'ilike', "%{$request->search}%")
                  ->orWhere('gstin', 'ilike', "%{$request->search}%")
                  ->orWhere('email', 'ilike', "%{$request->search}%");
            });
        }
        if ($request->boolean('active_only', true)) {
            $query->where('is_active', true);
        }

        $parties = $query->orderBy('name')->paginate($request->get('per_page', 20));

        return response()->json($parties);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:customer,supplier,both',
            'name' => 'required|string|max:255',
            'gstin' => 'nullable|string|size:15',
            'pan' => 'nullable|string|size:10',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:15',
            'billing_address' => 'nullable|string',
            'shipping_address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'state_code' => 'nullable|string|size:2',
            'pincode' => 'nullable|string|max:6',
            'credit_limit' => 'nullable|numeric|min:0',
            'payment_terms_days' => 'nullable|integer|min:0',
            'opening_balance' => 'nullable|numeric',
            'balance_type' => 'nullable|in:Dr,Cr',
        ]);

        $party = Party::create($validated);

        return response()->json($party, 201);
    }

    public function show(Party $party): JsonResponse
    {
        return response()->json($party->load(['invoices' => fn($q) => $q->latest()->limit(10)]));
    }

    public function update(Request $request, Party $party): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'in:customer,supplier,both',
            'name' => 'string|max:255',
            'gstin' => 'nullable|string|size:15',
            'pan' => 'nullable|string|size:10',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:15',
            'billing_address' => 'nullable|string',
            'shipping_address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'state_code' => 'nullable|string|size:2',
            'pincode' => 'nullable|string|max:6',
            'credit_limit' => 'nullable|numeric|min:0',
            'payment_terms_days' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $party->update($validated);

        return response()->json($party);
    }

    public function destroy(Party $party): JsonResponse
    {
        if ($party->invoices()->exists() || $party->purchaseBills()->exists()) {
            return response()->json(['message' => 'Cannot delete party with transactions'], 422);
        }

        $party->delete();

        return response()->json(['message' => 'Party deleted']);
    }

    public function validateGSTIN(Request $request): JsonResponse
    {
        $gstin = $request->validate(['gstin' => 'required|string|size:15'])['gstin'];

        // Basic GSTIN format validation
        $pattern = '/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/';
        $isValid = preg_match($pattern, strtoupper($gstin));

        return response()->json([
            'gstin' => $gstin,
            'is_valid' => (bool) $isValid,
            'state_code' => $isValid ? substr($gstin, 0, 2) : null,
        ]);
    }
}
