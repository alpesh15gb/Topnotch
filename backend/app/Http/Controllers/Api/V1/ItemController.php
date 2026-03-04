<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Item::with(['category', 'unit', 'taxRate']);

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'ilike', "%{$request->search}%")
                  ->orWhere('sku', 'ilike', "%{$request->search}%")
                  ->orWhere('hsn_sac', 'ilike', "%{$request->search}%");
            });
        }
        if ($request->boolean('active_only', true)) {
            $query->where('is_active', true);
        }

        return response()->json($query->orderBy('name')->paginate($request->get('per_page', 20)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|unique:items',
            'hsn_sac' => 'nullable|string|max:8',
            'type' => 'required|in:product,service',
            'category_id' => 'nullable|exists:item_categories,id',
            'unit_id' => 'nullable|exists:item_units,id',
            'sale_price' => 'required|numeric|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'tax_rate_id' => 'nullable|exists:tax_rates,id',
            'track_stock' => 'boolean',
            'opening_stock' => 'nullable|numeric|min:0',
            'stock_alert_qty' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $validated['current_stock'] = $validated['opening_stock'] ?? 0;
        $item = Item::create($validated);

        return response()->json($item->load(['category', 'unit', 'taxRate']), 201);
    }

    public function show(Item $item): JsonResponse
    {
        return response()->json($item->load(['category', 'unit', 'taxRate']));
    }

    public function update(Request $request, Item $item): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'sku' => 'nullable|string|unique:items,sku,' . $item->id,
            'hsn_sac' => 'nullable|string|max:8',
            'type' => 'in:product,service',
            'category_id' => 'nullable|exists:item_categories,id',
            'unit_id' => 'nullable|exists:item_units,id',
            'sale_price' => 'numeric|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'tax_rate_id' => 'nullable|exists:tax_rates,id',
            'track_stock' => 'boolean',
            'stock_alert_qty' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $item->update($validated);

        return response()->json($item->load(['category', 'unit', 'taxRate']));
    }

    public function destroy(Item $item): JsonResponse
    {
        if ($item->invoiceItems()->exists()) {
            return response()->json(['message' => 'Cannot delete item with transactions'], 422);
        }

        $item->delete();

        return response()->json(['message' => 'Item deleted']);
    }

    public function stockAdjustment(Request $request, Item $item): JsonResponse
    {
        $validated = $request->validate([
            'qty' => 'required|numeric',
            'type' => 'required|in:add,subtract,set',
            'reason' => 'nullable|string',
        ]);

        $item->current_stock = match ($validated['type']) {
            'add' => $item->current_stock + $validated['qty'],
            'subtract' => max(0, $item->current_stock - $validated['qty']),
            'set' => $validated['qty'],
        };

        $item->save();

        return response()->json($item);
    }
}
