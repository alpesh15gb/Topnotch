<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #333; }
    .header { background: #1e3a5f; color: white; padding: 20px 30px; display: flex; justify-content: space-between; align-items: flex-start; }
    .company-name { font-size: 22px; font-weight: bold; }
    .invoice-title { font-size: 28px; font-weight: bold; text-align: right; }
    .invoice-number { font-size: 13px; text-align: right; }
    .body { padding: 20px 30px; }
    .parties { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .party-box { width: 48%; }
    .party-box h4 { font-size: 10px; text-transform: uppercase; color: #666; margin-bottom: 5px; border-bottom: 1px solid #ddd; padding-bottom: 3px; }
    .party-box .name { font-size: 14px; font-weight: bold; color: #1e3a5f; }
    .details { display: flex; justify-content: space-between; background: #f5f8fa; padding: 10px; margin-bottom: 15px; border-radius: 4px; }
    .detail-item { text-align: center; }
    .detail-item label { font-size: 9px; text-transform: uppercase; color: #666; display: block; }
    .detail-item span { font-weight: bold; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
    th { background: #1e3a5f; color: white; padding: 8px; text-align: left; font-size: 10px; }
    td { padding: 8px; border-bottom: 1px solid #eee; }
    tr:nth-child(even) td { background: #f9f9f9; }
    .text-right { text-align: right; }
    .totals { float: right; width: 260px; }
    .totals table td { border-bottom: 1px solid #eee; }
    .totals .total-row td { background: #1e3a5f; color: white; font-weight: bold; font-size: 13px; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 2px solid #1e3a5f; font-size: 10px; color: #666; }
    .gst-details { margin-top: 15px; font-size: 10px; }
    .clearfix::after { content: ''; display: table; clear: both; }
</style>
</head>
<body>
<div class="header">
    <div>
        @if($setting?->logo)
        <img src="{{ public_path('storage/' . $setting->logo) }}" height="50" alt="Logo">
        @endif
        <div class="company-name">{{ $setting?->tenant?->name ?? 'Company Name' }}</div>
        @if($setting?->gstin)<div style="font-size:10px">GSTIN: {{ $setting->gstin }}</div>@endif
        @if($setting?->address)<div style="font-size:10px">{{ $setting->address }}, {{ $setting->city }}</div>@endif
        @if($setting?->phone)<div style="font-size:10px">Ph: {{ $setting->phone }}</div>@endif
    </div>
    <div>
        <div class="invoice-title">TAX INVOICE</div>
        <div class="invoice-number">{{ $invoice->number }}</div>
        <div style="font-size:10px; text-align:right">Date: {{ $invoice->date->format('d M Y') }}</div>
        @if($invoice->due_date)<div style="font-size:10px; text-align:right">Due: {{ $invoice->due_date->format('d M Y') }}</div>@endif
    </div>
</div>

<div class="body">
    <div class="parties">
        <div class="party-box">
            <h4>Bill To</h4>
            <div class="name">{{ $invoice->party->name }}</div>
            @if($invoice->party->gstin)<div>GSTIN: {{ $invoice->party->gstin }}</div>@endif
            @if($invoice->party->billing_address)<div>{{ $invoice->party->billing_address }}</div>@endif
            @if($invoice->party->city)<div>{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
            @if($invoice->party->phone)<div>Ph: {{ $invoice->party->phone }}</div>@endif
        </div>
        <div class="party-box" style="text-align:right">
            <h4>Ship To</h4>
            @if($invoice->party->shipping_address)
            <div>{{ $invoice->party->shipping_address }}</div>
            @else
            <div>Same as billing address</div>
            @endif
            @if($invoice->place_of_supply)<div>Place of Supply: {{ $invoice->place_of_supply }}</div>@endif
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Item / Description</th>
                <th>HSN/SAC</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Rate</th>
                <th class="text-right">Disc%</th>
                <th class="text-right">CGST</th>
                <th class="text-right">SGST</th>
                <th class="text-right">IGST</th>
                <th class="text-right">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $idx => $item)
            <tr>
                <td>{{ $idx + 1 }}</td>
                <td>{{ $item->item?->name ?? $item->description }}</td>
                <td>{{ $item->hsn_sac }}</td>
                <td class="text-right">{{ $item->qty }}</td>
                <td class="text-right">{{ number_format($item->unit_price, 2) }}</td>
                <td class="text-right">{{ $item->discount_pct > 0 ? $item->discount_pct.'%' : '-' }}</td>
                <td class="text-right">{{ $item->cgst > 0 ? number_format($item->cgst, 2) : '-' }}</td>
                <td class="text-right">{{ $item->sgst > 0 ? number_format($item->sgst, 2) : '-' }}</td>
                <td class="text-right">{{ $item->igst > 0 ? number_format($item->igst, 2) : '-' }}</td>
                <td class="text-right">{{ number_format($item->amount, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="clearfix">
        <div class="totals">
            <table style="width:100%">
                <tr><td>Subtotal</td><td class="text-right">₹{{ number_format($invoice->subtotal, 2) }}</td></tr>
                @if($invoice->discount > 0)
                <tr><td>Discount</td><td class="text-right">-₹{{ number_format($invoice->discount, 2) }}</td></tr>
                @endif
                @if(!$invoice->is_igst)
                <tr><td>CGST</td><td class="text-right">₹{{ number_format($invoice->items->sum('cgst'), 2) }}</td></tr>
                <tr><td>SGST</td><td class="text-right">₹{{ number_format($invoice->items->sum('sgst'), 2) }}</td></tr>
                @else
                <tr><td>IGST</td><td class="text-right">₹{{ number_format($invoice->items->sum('igst'), 2) }}</td></tr>
                @endif
                @if($invoice->tcs_amount > 0)
                <tr><td>TCS ({{ $invoice->tcs_rate }}%)</td><td class="text-right">₹{{ number_format($invoice->tcs_amount, 2) }}</td></tr>
                @endif
                <tr class="total-row"><td><strong>TOTAL</strong></td><td class="text-right"><strong>₹{{ number_format($invoice->total, 2) }}</strong></td></tr>
                @if($invoice->amount_paid > 0)
                <tr><td>Amount Paid</td><td class="text-right">₹{{ number_format($invoice->amount_paid, 2) }}</td></tr>
                <tr><td><strong>Balance Due</strong></td><td class="text-right" style="color:#c0392b"><strong>₹{{ number_format($invoice->balance, 2) }}</strong></td></tr>
                @endif
            </table>
        </div>
    </div>

    @if($invoice->notes)
    <div style="margin-top:20px; clear:both">
        <strong>Notes:</strong>
        <div style="margin-top:5px; color:#555">{{ $invoice->notes }}</div>
    </div>
    @endif

    @if($setting?->terms_and_conditions)
    <div style="margin-top:15px">
        <strong>Terms & Conditions:</strong>
        <div style="margin-top:5px; color:#555; font-size:9px">{{ $setting->terms_and_conditions }}</div>
    </div>
    @endif

    <div class="footer">
        <div style="float:right; text-align:center">
            @if($setting?->e_signature_path)
            <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" height="40" alt="Signature">
            <div>Authorized Signature</div>
            @endif
        </div>
        @if($setting?->invoice_footer_notes)
        <div>{{ $setting->invoice_footer_notes }}</div>
        @else
        <div>This is a computer generated invoice. No signature required.</div>
        @endif
    </div>
</div>
</body>
</html>
