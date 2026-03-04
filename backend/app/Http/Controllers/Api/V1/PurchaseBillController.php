<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PurchaseBill;
use App\Services\NumberingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseBillController extends Controller
{
    public function __construct(private NumberingService $numberingService) {}

    public function index(Request $request): JsonResponse
    {
        $query = PurchaseBill::with(['party'])->latest('date');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('party_id')) {
            $query->where('party_id', $request->party_id);
        }

        return response()->json($query->paginate($request->get('per_page', 20)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'party_id' => 'required|exists:parties,id',
            'purchase_order_id' => 'nullable|exists:purchase_orders,id',
            'supplier_invoice_no' => 'nullable|string',
            'supplier_invoice_date' => 'nullable|date',
            'date' => 'required|date',
            'due_date' => 'nullable|date',
            'itc_eligible' => 'boolean',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'nullable|exists:items,id',
            'items.*.description' => 'required|string',
            'items.*.qty' => 'required|numeric|min:0.001',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax_rate_id' => 'nullable|exists:tax_rates,id',
            'items.*.itc_eligible' => 'boolean',
        ]);

        return DB::transaction(function () use ($validated) {
            $subtotal = 0;
            $taxAmount = 0;
            $itemsData = [];

            foreach ($validated['items'] as $i => $item) {
                $lineTotal = $item['qty'] * $item['unit_price'];
                $subtotal += $lineTotal;
                $itemsData[] = array_merge($item, ['amount' => $lineTotal, 'sort_order' => $i]);
            }

            $bill = PurchaseBill::create([
                'number' => $this->numberingService->generatePurchaseBillNumber(),
                'party_id' => $validated['party_id'],
                'purchase_order_id' => $validated['purchase_order_id'] ?? null,
                'supplier_invoice_no' => $validated['supplier_invoice_no'] ?? null,
                'supplier_invoice_date' => $validated['supplier_invoice_date'] ?? null,
                'date' => $validated['date'],
                'due_date' => $validated['due_date'] ?? null,
                'status' => 'draft',
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total' => $subtotal + $taxAmount,
                'balance' => $subtotal + $taxAmount,
                'amount_paid' => 0,
                'itc_eligible' => $validated['itc_eligible'] ?? true,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($itemsData as $item) {
                $bill->items()->create($item);
            }

            return response()->json($bill->load(['party', 'items']), 201);
        });
    }

    public function show(PurchaseBill $purchaseBill): JsonResponse
    {
        return response()->json($purchaseBill->load(['party', 'items.item', 'items.taxRate', 'purchaseOrder']));
    }

    public function update(Request $request, PurchaseBill $purchaseBill): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'nullable|in:draft,posted,cancelled',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $purchaseBill->update($validated);

        return response()->json($purchaseBill);
    }

    public function destroy(PurchaseBill $purchaseBill): JsonResponse
    {
        if ($purchaseBill->status !== 'draft') {
            return response()->json(['message' => 'Only draft bills can be deleted'], 422);
        }
        $purchaseBill->delete();
        return response()->json(['message' => 'Bill deleted']);
    }

    public function recordPayment(Request $request, PurchaseBill $purchaseBill): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'method' => 'nullable|string',
            'reference' => 'nullable|string',
        ]);

        $purchaseBill->amount_paid += $validated['amount'];
        $purchaseBill->balance -= $validated['amount'];
        $purchaseBill->status = $purchaseBill->balance <= 0 ? 'paid' : 'partially_paid';
        $purchaseBill->save();

        return response()->json($purchaseBill);
    }
}
