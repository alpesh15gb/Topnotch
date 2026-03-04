<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\InvoicePayment;
use App\Services\InvoicePdfService;
use App\Services\NumberingService;
use App\Services\EmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function __construct(
        private InvoicePdfService $pdfService,
        private NumberingService $numberingService,
        private EmailService $emailService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = Invoice::with(['party'])->latest('date');

        if ($request->filled('status')) {
            $query->whereIn('status', explode(',', $request->status));
        }
        if ($request->filled('party_id')) {
            $query->where('party_id', $request->party_id);
        }
        if ($request->filled('from_date')) {
            $query->whereDate('date', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('date', '<=', $request->to_date);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('number', 'ilike', "%{$request->search}%")
                  ->orWhereHas('party', fn($p) => $p->where('name', 'ilike', "%{$request->search}%"));
            });
        }

        $invoices = $query->paginate($request->get('per_page', 20));

        return response()->json($invoices);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'party_id' => 'required|exists:parties,id',
            'date' => 'required|date',
            'due_date' => 'nullable|date|after_or_equal:date',
            'series_prefix' => 'string|max:10',
            'supply_state' => 'nullable|string',
            'supply_state_code' => 'nullable|string|size:2',
            'place_of_supply' => 'nullable|string',
            'is_igst' => 'boolean',
            'discount' => 'nullable|numeric|min:0',
            'tcs_rate' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'template_id' => 'integer|min:1|max:15',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'nullable|exists:items,id',
            'items.*.description' => 'required|string',
            'items.*.qty' => 'required|numeric|min:0.001',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.discount_pct' => 'nullable|numeric|min:0|max:100',
            'items.*.tax_rate_id' => 'nullable|exists:tax_rates,id',
            'items.*.cgst_rate' => 'nullable|numeric',
            'items.*.sgst_rate' => 'nullable|numeric',
            'items.*.igst_rate' => 'nullable|numeric',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $prefix = $validated['series_prefix'] ?? 'INV';
            $number = $this->numberingService->generateInvoiceNumber($prefix);

            $subtotal = 0;
            $taxAmount = 0;
            $itemsData = [];

            foreach ($validated['items'] as $i => $itemInput) {
                $qty = $itemInput['qty'];
                $price = $itemInput['unit_price'];
                $discPct = $itemInput['discount_pct'] ?? 0;
                $lineTotal = $qty * $price * (1 - $discPct / 100);

                $cgst = ($lineTotal * ($itemInput['cgst_rate'] ?? 0)) / 100;
                $sgst = ($lineTotal * ($itemInput['sgst_rate'] ?? 0)) / 100;
                $igst = ($lineTotal * ($itemInput['igst_rate'] ?? 0)) / 100;

                $subtotal += $lineTotal;
                $taxAmount += $cgst + $sgst + $igst;

                $itemsData[] = array_merge($itemInput, [
                    'cgst' => $cgst,
                    'sgst' => $sgst,
                    'igst' => $igst,
                    'amount' => $lineTotal,
                    'sort_order' => $i,
                ]);
            }

            $discount = $validated['discount'] ?? 0;
            $tcsRate = $validated['tcs_rate'] ?? 0;
            $tcsAmount = (($subtotal - $discount + $taxAmount) * $tcsRate) / 100;
            $total = $subtotal - $discount + $taxAmount + $tcsAmount;

            $invoice = Invoice::create([
                'number' => $number,
                'series_prefix' => $prefix,
                'party_id' => $validated['party_id'],
                'date' => $validated['date'],
                'due_date' => $validated['due_date'] ?? null,
                'supply_state' => $validated['supply_state'] ?? null,
                'supply_state_code' => $validated['supply_state_code'] ?? null,
                'place_of_supply' => $validated['place_of_supply'] ?? null,
                'is_igst' => $validated['is_igst'] ?? false,
                'status' => 'draft',
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax_amount' => $taxAmount,
                'tcs_rate' => $tcsRate,
                'tcs_amount' => $tcsAmount,
                'total' => $total,
                'balance' => $total,
                'amount_paid' => 0,
                'notes' => $validated['notes'] ?? null,
                'template_id' => $validated['template_id'] ?? 1,
            ]);

            foreach ($itemsData as $item) {
                $invoice->items()->create($item);
            }

            return response()->json($invoice->load(['party', 'items.taxRate']), 201);
        });
    }

    public function show(Invoice $invoice): JsonResponse
    {
        return response()->json($invoice->load(['party', 'items.item', 'items.taxRate', 'payments.account']));
    }

    public function update(Request $request, Invoice $invoice): JsonResponse
    {
        if (in_array($invoice->status, ['paid', 'cancelled'])) {
            return response()->json(['message' => 'Cannot update a paid or cancelled invoice'], 422);
        }

        $validated = $request->validate([
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'template_id' => 'integer|min:1|max:15',
            'status' => 'in:draft,posted,cancelled',
        ]);

        $invoice->update($validated);

        return response()->json($invoice->load(['party', 'items.taxRate']));
    }

    public function destroy(Invoice $invoice): JsonResponse
    {
        if ($invoice->status !== 'draft') {
            return response()->json(['message' => 'Only draft invoices can be deleted'], 422);
        }

        $invoice->delete();

        return response()->json(['message' => 'Invoice deleted']);
    }

    public function recordPayment(Request $request, Invoice $invoice): JsonResponse
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'method' => 'nullable|string',
            'reference' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if ($validated['amount'] > $invoice->balance) {
            return response()->json(['message' => 'Payment amount exceeds invoice balance'], 422);
        }

        return DB::transaction(function () use ($validated, $invoice) {
            $payment = $invoice->payments()->create($validated);

            $invoice->amount_paid += $validated['amount'];
            $invoice->balance -= $validated['amount'];
            $invoice->status = $invoice->balance <= 0 ? 'paid' : 'partially_paid';
            $invoice->save();

            return response()->json($payment, 201);
        });
    }

    public function generatePDF(Request $request, Invoice $invoice): Response
    {
        $templateId = $request->get('template_id', $invoice->template_id);
        $pdf = $this->pdfService->generatePDF($invoice, (int) $templateId);

        return $pdf->download("invoice-{$invoice->number}.pdf");
    }

    public function send(Request $request, Invoice $invoice): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'nullable|email',
        ]);

        $this->emailService->sendInvoice($invoice, $validated['email'] ?? null);

        if ($invoice->status === 'draft') {
            $invoice->update(['status' => 'posted']);
        }

        return response()->json(['message' => 'Invoice sent successfully']);
    }
}
