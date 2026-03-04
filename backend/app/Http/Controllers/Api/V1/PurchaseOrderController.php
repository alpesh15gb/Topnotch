<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Services\NumberingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseOrderController extends Controller
{
    public function __construct(private NumberingService $numberingService) {}

    public function index(Request $request): JsonResponse
    {
        $query = PurchaseOrder::with(['party'])->latest('date');

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
            'expected_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'nullable|exists:items,id',
            'items.*.description' => 'required|string',
            'items.*.qty' => 'required|numeric|min:0.001',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $subtotal = collect($validated['items'])->sum(fn($i) => $i['qty'] * $i['unit_price']);

        $order = PurchaseOrder::create([
            'number' => $this->numberingService->generatePurchaseOrderNumber(),
            'party_id' => $validated['party_id'],
            'date' => $validated['date'],
            'expected_date' => $validated['expected_date'] ?? null,
            'status' => 'draft',
            'subtotal' => $subtotal,
            'tax_amount' => 0,
            'discount' => 0,
            'total' => $subtotal,
            'notes' => $validated['notes'] ?? null,
        ]);

        foreach ($validated['items'] as $i => $item) {
            $order->items()->create(array_merge($item, [
                'pending_qty' => $item['qty'],
                'amount' => $item['qty'] * $item['unit_price'],
                'sort_order' => $i,
            ]));
        }

        return response()->json($order->load(['party', 'items']), 201);
    }

    public function show(PurchaseOrder $purchaseOrder): JsonResponse
    {
        return response()->json($purchaseOrder->load(['party', 'items.item', 'bills']));
    }

    public function update(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        $validated = $request->validate(['status' => 'in:draft,sent,received,partially_received,cancelled']);
        $purchaseOrder->update($validated);
        return response()->json($purchaseOrder);
    }

    public function destroy(PurchaseOrder $purchaseOrder): JsonResponse
    {
        if ($purchaseOrder->status !== 'draft') {
            return response()->json(['message' => 'Only draft orders can be deleted'], 422);
        }
        $purchaseOrder->delete();
        return response()->json(['message' => 'Purchase order deleted']);
    }
}
