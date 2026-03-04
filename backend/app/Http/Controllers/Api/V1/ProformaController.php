<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ProformaInvoice;
use App\Services\NumberingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProformaController extends Controller
{
    public function __construct(private NumberingService $numberingService) {}

    public function index(Request $request): JsonResponse
    {
        $query = ProformaInvoice::with(['party'])->latest('date');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate($request->get('per_page', 20)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'party_id' => 'required|exists:parties,id',
            'date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.qty' => 'required|numeric|min:0.001',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $subtotal = collect($validated['items'])->sum(fn($i) => $i['qty'] * $i['unit_price']);

        $proforma = ProformaInvoice::create([
            'number' => $this->numberingService->generateProformaNumber(),
            'party_id' => $validated['party_id'],
            'date' => $validated['date'],
            'status' => 'draft',
            'subtotal' => $subtotal,
            'tax_amount' => 0,
            'discount' => 0,
            'total' => $subtotal,
            'notes' => $validated['notes'] ?? null,
        ]);

        foreach ($validated['items'] as $i => $item) {
            $proforma->items()->create(array_merge($item, ['amount' => $item['qty'] * $item['unit_price'], 'sort_order' => $i]));
        }

        return response()->json($proforma->load(['party', 'items']), 201);
    }

    public function show(ProformaInvoice $proformaInvoice): JsonResponse
    {
        return response()->json($proformaInvoice->load(['party', 'items.item']));
    }

    public function update(Request $request, ProformaInvoice $proformaInvoice): JsonResponse
    {
        $validated = $request->validate(['status' => 'in:draft,sent,accepted,converted,cancelled']);
        $proformaInvoice->update($validated);
        return response()->json($proformaInvoice);
    }

    public function destroy(ProformaInvoice $proformaInvoice): JsonResponse
    {
        if ($proformaInvoice->status !== 'draft') {
            return response()->json(['message' => 'Only draft proformas can be deleted'], 422);
        }
        $proformaInvoice->delete();
        return response()->json(['message' => 'Proforma invoice deleted']);
    }
}
