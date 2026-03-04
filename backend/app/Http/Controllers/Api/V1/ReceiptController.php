<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\InvoicePayment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReceiptController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = InvoicePayment::with([
            'invoice:id,number,party_id',
            'invoice.party:id,name',
            'account:id,name',
        ])->latest('date');

        if ($request->filled('from_date')) {
            $query->whereDate('date', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('date', '<=', $request->to_date);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('reference', 'ilike', "%{$request->search}%")
                  ->orWhereHas('invoice.party', fn($p) => $p->where('name', 'ilike', "%{$request->search}%"));
            });
        }

        $receipts = $query->paginate($request->get('per_page', 20));

        // Shape response to match frontend Receipt interface
        $receipts->getCollection()->transform(function ($payment) {
            return [
                'id'              => $payment->id,
                'receipt_number'  => 'RCP/' . str_pad($payment->id, 4, '0', STR_PAD_LEFT),
                'date'            => $payment->date,
                'amount'          => $payment->amount,
                'payment_mode'    => $payment->method,
                'reference_number'=> $payment->reference,
                'party'           => $payment->invoice?->party,
                'invoices'        => [[
                    'number'         => $payment->invoice?->number,
                    'amount_applied' => $payment->amount,
                ]],
            ];
        });

        return response()->json($receipts);
    }

    public function show(InvoicePayment $receipt): JsonResponse
    {
        $receipt->load(['invoice.party', 'account']);

        return response()->json([
            'id'              => $receipt->id,
            'receipt_number'  => 'RCP/' . str_pad($receipt->id, 4, '0', STR_PAD_LEFT),
            'date'            => $receipt->date,
            'amount'          => $receipt->amount,
            'payment_mode'    => $receipt->method,
            'reference_number'=> $receipt->reference,
            'party'           => $receipt->invoice?->party,
            'invoices'        => [[
                'number'         => $receipt->invoice?->number,
                'amount_applied' => $receipt->amount,
            ]],
        ]);
    }
}
