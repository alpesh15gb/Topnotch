<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TaxRate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaxRateController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(TaxRate::where('is_active', true)->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'rate' => 'required|numeric|min:0|max:100',
            'type' => 'required|in:GST,TDS,TCS,CESS,none',
            'cgst_rate' => 'nullable|numeric|min:0',
            'sgst_rate' => 'nullable|numeric|min:0',
            'igst_rate' => 'nullable|numeric|min:0',
            'cess_rate' => 'nullable|numeric|min:0',
        ]);

        return response()->json(TaxRate::create($validated), 201);
    }

    public function show(TaxRate $taxRate): JsonResponse
    {
        return response()->json($taxRate);
    }

    public function update(Request $request, TaxRate $taxRate): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:100',
            'is_active' => 'boolean',
        ]);

        $taxRate->update($validated);

        return response()->json($taxRate);
    }

    public function destroy(TaxRate $taxRate): JsonResponse
    {
        if ($taxRate->items()->exists() || $taxRate->invoiceItems()->exists()) {
            return response()->json(['message' => 'Cannot delete tax rate in use'], 422);
        }

        $taxRate->delete();

        return response()->json(['message' => 'Tax rate deleted']);
    }
}
