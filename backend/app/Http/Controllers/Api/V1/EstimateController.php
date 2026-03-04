<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Estimate;
use App\Models\Invoice;
use App\Models\ProformaInvoice;
use App\Models\SaleOrder;
use App\Services\NumberingService;
use App\Services\EmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EstimateController extends Controller
{
    public function __construct(
        private NumberingService $numberingService,
        private EmailService $emailService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = Estimate::with(['party'])->latest('date');

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
            'date' => 'required|date',
            'expiry_date' => 'nullable|date|after:date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'nullable|exists:items,id',
            'items.*.description' => 'required|string',
            'items.*.qty' => 'required|numeric|min:0.001',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.discount_pct' => 'nullable|numeric|min:0|max:100',
            'items.*.tax_rate_id' => 'nullable|exists:tax_rates,id',
        ]);

        return DB::transaction(function () use ($validated) {
            $subtotal = 0;
            $taxAmount = 0;
            $itemsData = [];

            foreach ($validated['items'] as $i => $item) {
                $lineTotal = $item['qty'] * $item['unit_price'] * (1 - ($item['discount_pct'] ?? 0) / 100);
                $subtotal += $lineTotal;
                $itemsData[] = array_merge($item, ['amount' => $lineTotal, 'sort_order' => $i]);
            }

            $estimate = Estimate::create([
                'number' => $this->numberingService->generateEstimateNumber(),
                'party_id' => $validated['party_id'],
                'date' => $validated['date'],
                'expiry_date' => $validated['expiry_date'] ?? null,
                'status' => 'draft',
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'discount' => 0,
                'total' => $subtotal,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($itemsData as $item) {
                $estimate->items()->create($item);
            }

            return response()->json($estimate->load(['party', 'items']), 201);
        });
    }

    public function show(Estimate $estimate): JsonResponse
    {
        return response()->json($estimate->load(['party', 'items.item', 'items.taxRate']));
    }

    public function update(Request $request, Estimate $estimate): JsonResponse
    {
        if (in_array($estimate->status, ['accepted', 'rejected'])) {
            return response()->json(['message' => 'Cannot update a finalized estimate'], 422);
        }

        $validated = $request->validate([
            'status' => 'nullable|in:draft,sent,accepted,rejected,expired',
            'expiry_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $estimate->update($validated);

        return response()->json($estimate);
    }

    public function destroy(Estimate $estimate): JsonResponse
    {
        if ($estimate->status !== 'draft') {
            return response()->json(['message' => 'Only draft estimates can be deleted'], 422);
        }
        $estimate->delete();
        return response()->json(['message' => 'Estimate deleted']);
    }

    public function convert(Request $request, Estimate $estimate): JsonResponse
    {
        $validated = $request->validate([
            'to' => 'required|in:invoice,sale_order,proforma',
        ]);

        if ($estimate->converted_to) {
            return response()->json(['message' => 'Estimate already converted'], 422);
        }

        return DB::transaction(function () use ($validated, $estimate) {
            $converted = match ($validated['to']) {
                'invoice' => $this->convertToInvoice($estimate),
                'sale_order' => $this->convertToSaleOrder($estimate),
                'proforma' => $this->convertToProforma($estimate),
            };

            $estimate->update([
                'converted_to' => $validated['to'],
                'converted_id' => $converted->id,
                'status' => 'accepted',
            ]);

            return response()->json(['converted' => $converted]);
        });
    }

    public function send(Request $request, Estimate $estimate): JsonResponse
    {
        $this->emailService->sendEstimate($estimate, $request->email);
        $estimate->update(['status' => 'sent']);
        return response()->json(['message' => 'Estimate sent']);
    }

    private function convertToInvoice(Estimate $estimate): Invoice
    {
        $numberingService = app(NumberingService::class);
        $invoice = Invoice::create([
            'number' => $numberingService->generateInvoiceNumber(),
            'series_prefix' => 'INV',
            'party_id' => $estimate->party_id,
            'estimate_id' => $estimate->id,
            'date' => now()->toDateString(),
            'status' => 'draft',
            'subtotal' => $estimate->subtotal,
            'discount' => $estimate->discount,
            'tax_amount' => $estimate->tax_amount,
            'total' => $estimate->total,
            'balance' => $estimate->total,
            'amount_paid' => 0,
        ]);

        foreach ($estimate->items as $item) {
            $invoice->items()->create([
                'item_id' => $item->item_id,
                'description' => $item->description,
                'qty' => $item->qty,
                'unit_price' => $item->unit_price,
                'discount_pct' => $item->discount_pct,
                'tax_rate_id' => $item->tax_rate_id,
                'cgst' => $item->cgst,
                'sgst' => $item->sgst,
                'igst' => $item->igst,
                'amount' => $item->amount,
                'sort_order' => $item->sort_order,
            ]);
        }

        return $invoice;
    }

    private function convertToSaleOrder(Estimate $estimate): SaleOrder
    {
        $numberingService = app(NumberingService::class);
        $order = SaleOrder::create([
            'number' => $numberingService->generateSaleOrderNumber(),
            'party_id' => $estimate->party_id,
            'estimate_id' => $estimate->id,
            'date' => now()->toDateString(),
            'status' => 'confirmed',
            'subtotal' => $estimate->subtotal,
            'tax_amount' => $estimate->tax_amount,
            'discount' => $estimate->discount,
            'total' => $estimate->total,
        ]);

        foreach ($estimate->items as $item) {
            $order->items()->create([
                'item_id' => $item->item_id,
                'description' => $item->description,
                'qty' => $item->qty,
                'unit_price' => $item->unit_price,
                'pending_qty' => $item->qty,
                'amount' => $item->amount,
            ]);
        }

        return $order;
    }

    private function convertToProforma(Estimate $estimate): ProformaInvoice
    {
        $numberingService = app(NumberingService::class);
        $proforma = ProformaInvoice::create([
            'number' => $numberingService->generateProformaNumber(),
            'party_id' => $estimate->party_id,
            'estimate_id' => $estimate->id,
            'date' => now()->toDateString(),
            'status' => 'draft',
            'subtotal' => $estimate->subtotal,
            'tax_amount' => $estimate->tax_amount,
            'discount' => $estimate->discount,
            'total' => $estimate->total,
        ]);

        foreach ($estimate->items as $item) {
            $proforma->items()->create([
                'item_id' => $item->item_id,
                'description' => $item->description,
                'qty' => $item->qty,
                'unit_price' => $item->unit_price,
                'discount_pct' => $item->discount_pct,
                'tax_rate_id' => $item->tax_rate_id,
                'cgst' => $item->cgst,
                'sgst' => $item->sgst,
                'igst' => $item->igst,
                'amount' => $item->amount,
            ]);
        }

        return $proforma;
    }
}
