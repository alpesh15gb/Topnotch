<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\VendorPayment;
use App\Services\NumberingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private NumberingService $numberingService) {}

    public function index(Request $request): JsonResponse
    {
        $query = VendorPayment::with(['party:id,name', 'account:id,name'])->latest('date');

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
                $q->where('payment_number', 'ilike', "%{$request->search}%")
                  ->orWhere('reference_number', 'ilike', "%{$request->search}%")
                  ->orWhereHas('party', fn($p) => $p->where('name', 'ilike', "%{$request->search}%"));
            });
        }

        $payments = $query->paginate($request->get('per_page', 20));

        // Append bills association (stub — extend when purchase_bill_payments pivot is added)
        $payments->getCollection()->transform(function ($payment) {
            $payment->bills = [];
            return $payment;
        });

        return response()->json($payments);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'party_id'       => 'required|exists:parties,id',
            'account_id'     => 'required|exists:accounts,id',
            'date'           => 'required|date',
            'amount'         => 'required|numeric|min:0.01',
            'payment_mode'   => 'nullable|string|in:cash,bank,cheque,upi,neft,rtgs',
            'reference_number' => 'nullable|string|max:100',
            'notes'          => 'nullable|string',
        ]);

        $payment = VendorPayment::create(array_merge($validated, [
            'payment_number' => $this->numberingService->generateVendorPaymentNumber(),
        ]));

        $payment->bills = [];

        return response()->json($payment->load(['party:id,name', 'account:id,name']), 201);
    }

    public function show(VendorPayment $vendorPayment): JsonResponse
    {
        $vendorPayment->bills = [];
        return response()->json($vendorPayment->load(['party', 'account']));
    }

    public function destroy(VendorPayment $vendorPayment): JsonResponse
    {
        $vendorPayment->delete();
        return response()->json(['message' => 'Payment deleted']);
    }
}
