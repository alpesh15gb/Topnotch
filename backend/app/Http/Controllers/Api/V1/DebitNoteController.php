<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DebitNote;
use App\Services\NumberingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DebitNoteController extends Controller
{
    public function __construct(private NumberingService $numberingService) {}

    public function index(Request $request): JsonResponse
    {
        $query = DebitNote::with(['party', 'purchaseBill:id,number'])->latest('date');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('party_id')) {
            $query->where('party_id', $request->party_id);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('number', 'ilike', "%{$request->search}%")
                  ->orWhereHas('party', fn($p) => $p->where('name', 'ilike', "%{$request->search}%"));
            });
        }

        return response()->json($query->paginate($request->get('per_page', 20)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'party_id'         => 'required|exists:parties,id',
            'purchase_bill_id' => 'nullable|exists:purchase_bills,id',
            'date'             => 'required|date',
            'reason'           => 'nullable|string|max:500',
            'notes'            => 'nullable|string',
            'items'            => 'required|array|min:1',
            'items.*.item_id'      => 'nullable|exists:items,id',
            'items.*.description'  => 'required|string',
            'items.*.qty'          => 'required|numeric|min:0.001',
            'items.*.unit_price'   => 'required|numeric|min:0',
            'items.*.tax_rate_id'  => 'nullable|exists:tax_rates,id',
            'items.*.cgst_rate'    => 'nullable|numeric|min:0',
            'items.*.sgst_rate'    => 'nullable|numeric|min:0',
            'items.*.igst_rate'    => 'nullable|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated) {
            $subtotal  = 0;
            $taxAmount = 0;
            $itemsData = [];

            foreach ($validated['items'] as $i => $item) {
                $lineTotal = $item['qty'] * $item['unit_price'];
                $cgst = $lineTotal * (($item['cgst_rate'] ?? 0) / 100);
                $sgst = $lineTotal * (($item['sgst_rate'] ?? 0) / 100);
                $igst = $lineTotal * (($item['igst_rate'] ?? 0) / 100);

                $subtotal  += $lineTotal;
                $taxAmount += $cgst + $sgst + $igst;

                $itemsData[] = array_merge($item, [
                    'cgst' => $cgst, 'sgst' => $sgst, 'igst' => $igst,
                    'amount' => $lineTotal, 'sort_order' => $i,
                ]);
            }

            $total = $subtotal + $taxAmount;

            $debitNote = DebitNote::create([
                'number'          => $this->numberingService->generateDebitNoteNumber(),
                'party_id'        => $validated['party_id'],
                'purchase_bill_id'=> $validated['purchase_bill_id'] ?? null,
                'date'            => $validated['date'],
                'status'          => 'draft',
                'subtotal'        => $subtotal,
                'tax_amount'      => $taxAmount,
                'total'           => $total,
                'balance'         => $total,
                'reason'          => $validated['reason'] ?? null,
                'notes'           => $validated['notes'] ?? null,
            ]);

            foreach ($itemsData as $item) {
                $debitNote->items()->create($item);
            }

            return response()->json($debitNote->load(['party', 'items.taxRate']), 201);
        });
    }

    public function show(DebitNote $debitNote): JsonResponse
    {
        return response()->json(
            $debitNote->load(['party', 'purchaseBill:id,number', 'items.item', 'items.taxRate'])
        );
    }

    public function update(Request $request, DebitNote $debitNote): JsonResponse
    {
        if (in_array($debitNote->status, ['applied', 'cancelled'])) {
            return response()->json(['message' => 'Cannot update an applied or cancelled debit note'], 422);
        }

        $validated = $request->validate([
            'status' => 'nullable|in:draft,posted,cancelled',
            'reason' => 'nullable|string|max:500',
            'notes'  => 'nullable|string',
        ]);

        $debitNote->update($validated);

        return response()->json($debitNote->load(['party', 'items']));
    }

    public function destroy(DebitNote $debitNote): JsonResponse
    {
        if ($debitNote->status !== 'draft') {
            return response()->json(['message' => 'Only draft debit notes can be deleted'], 422);
        }

        $debitNote->delete();

        return response()->json(['message' => 'Debit note deleted']);
    }
}
