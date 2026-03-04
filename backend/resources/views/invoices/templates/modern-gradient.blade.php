<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #374151; background: #fff; }

    .header {
        background: #4f46e5;
        background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%);
        color: #fff;
        padding: 30px 35px 50px;
        position: relative;
    }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .logo-wrap img { max-height: 50px; margin-bottom: 8px; }
    .company-name { font-size: 21px; font-weight: bold; letter-spacing: 0.5px; }
    .company-info { font-size: 9px; color: rgba(255,255,255,0.8); margin-top: 3px; }
    .invoice-right { text-align: right; }
    .invoice-title { font-size: 30px; font-weight: bold; letter-spacing: 4px; opacity: 0.95; }
    .invoice-num { font-size: 12px; margin-top: 5px; opacity: 0.85; }
    .invoice-dates { font-size: 10px; margin-top: 4px; opacity: 0.75; }

    .wave-divider { height: 30px; overflow: hidden; margin-top: -1px; }
    .wave-divider svg { display: block; width: 100%; }

    .body { padding: 10px 35px 30px; }

    .cards-row { display: flex; justify-content: space-between; margin-bottom: 25px; gap: 15px; }
    .card { flex: 1; border-radius: 10px; padding: 14px 16px; border: 1px solid #e5e7eb; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
    .card-title { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 6px; }
    .card-name { font-size: 13px; font-weight: bold; color: #1f2937; }
    .card-info { font-size: 9px; color: #6b7280; margin-top: 2px; }
    .card-highlight { background: linear-gradient(135deg, #eff6ff, #f5f3ff); border-color: #c7d2fe; }

    .pill-row { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
    .pill { background: #f3f4f6; border-radius: 20px; padding: 5px 14px; font-size: 9px; color: #4b5563; border: 1px solid #e5e7eb; }
    .pill strong { color: #1f2937; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-radius: 10px; overflow: hidden; }
    thead tr { background: linear-gradient(135deg, #3b82f6, #8b5cf6); }
    thead th { color: #fff; padding: 10px 9px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
    tbody tr { border-bottom: 1px solid #f3f4f6; }
    tbody tr:hover td { background: #fafafa; }
    tbody td { padding: 9px; font-size: 10px; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .item-name { font-weight: bold; color: #1f2937; }
    .item-desc { font-size: 9px; color: #9ca3af; }

    .bottom-grid { display: flex; justify-content: space-between; }
    .notes-col { width: 54%; }
    .totals-col { width: 40%; }

    .notes-box { background: #f9fafb; border-radius: 8px; padding: 12px 14px; border: 1px solid #e5e7eb; margin-bottom: 10px; }
    .notes-box h4 { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 5px; }
    .notes-box p { font-size: 10px; color: #6b7280; }

    .totals-box { background: #f9fafb; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb; }
    .totals-row { display: flex; justify-content: space-between; padding: 7px 14px; border-bottom: 1px solid #f0f0f0; font-size: 10px; }
    .totals-row:last-child { border-bottom: none; }
    .totals-row .tl { color: #6b7280; }
    .totals-row .tv { font-weight: 600; color: #374151; }
    .totals-grand { background: linear-gradient(135deg, #3b82f6, #8b5cf6); }
    .totals-grand .tl, .totals-grand .tv { color: #fff; font-size: 13px; font-weight: bold; }
    .balance-due .tl, .balance-due .tv { color: #ef4444; font-weight: bold; }

    .footer { margin-top: 25px; display: flex; justify-content: space-between; align-items: flex-end; border-top: 2px solid #e5e7eb; padding-top: 15px; }
    .footer-note { font-size: 9px; color: #9ca3af; }
    .sig-wrap { text-align: center; }
    .sig-wrap img { max-height: 38px; display: block; margin: 0 auto 5px; }
    .sig-line { font-size: 9px; color: #9ca3af; border-top: 1px solid #d1d5db; padding-top: 4px; margin-top: 2px; }
</style>
</head>
<body>

<div class="header">
    <div class="header-top">
        <div class="logo-wrap">
            @if($setting?->logo)
            <img src="{{ public_path('storage/' . $setting->logo) }}" alt="Logo">
            @endif
            <div class="company-name">{{ $setting?->tenant?->name ?? 'Company Name' }}</div>
            @if($setting?->gstin)<div class="company-info">GSTIN: {{ $setting->gstin }}</div>@endif
            @if($setting?->address)<div class="company-info">{{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}</div>@endif
            @if($setting?->phone)<div class="company-info">Ph: {{ $setting->phone }}</div>@endif
        </div>
        <div class="invoice-right">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-num">{{ $invoice->number }}</div>
            <div class="invoice-dates">Date: {{ $invoice->date->format('d M Y') }}</div>
            @if($invoice->due_date)
            <div class="invoice-dates">Due: {{ $invoice->due_date->format('d M Y') }}</div>
            @endif
        </div>
    </div>
</div>

<div class="body">
    <div class="cards-row">
        <div class="card card-highlight">
            <div class="card-title">Billed To</div>
            <div class="card-name">{{ $invoice->party->name }}</div>
            @if($invoice->party->gstin)<div class="card-info">GSTIN: {{ $invoice->party->gstin }}</div>@endif
            @if($invoice->party->billing_address)<div class="card-info">{{ $invoice->party->billing_address }}</div>@endif
            @if($invoice->party->city)<div class="card-info">{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
            @if($invoice->party->phone)<div class="card-info">Ph: {{ $invoice->party->phone }}</div>@endif
        </div>
        <div class="card">
            <div class="card-title">From</div>
            <div class="card-name">{{ $setting?->tenant?->name ?? 'Company' }}</div>
            @if($setting?->gstin)<div class="card-info">GSTIN: {{ $setting->gstin }}</div>@endif
            @if($setting?->address)<div class="card-info">{{ $setting->address }}, {{ $setting->city }}</div>@endif
            @if($setting?->phone)<div class="card-info">Ph: {{ $setting->phone }}</div>@endif
        </div>
        <div class="card" style="background: linear-gradient(135deg,#f0fdf4,#d1fae5); border-color:#a7f3d0;">
            <div class="card-title">Payment Summary</div>
            <div class="card-name" style="color:#059669; font-size:18px;">&#8377;{{ number_format($invoice->total, 2) }}</div>
            <div class="card-info">Total Invoice Amount</div>
            @if($invoice->balance > 0)
            <div class="card-info" style="color:#ef4444; margin-top:4px; font-weight:bold;">Balance: &#8377;{{ number_format($invoice->balance, 2) }}</div>
            @else
            <div class="card-info" style="color:#059669; margin-top:4px; font-weight:bold;">PAID IN FULL</div>
            @endif
        </div>
    </div>

    <div class="pill-row">
        <div class="pill"><strong>Invoice:</strong> {{ $invoice->number }}</div>
        <div class="pill"><strong>Date:</strong> {{ $invoice->date->format('d M Y') }}</div>
        @if($invoice->due_date)<div class="pill"><strong>Due:</strong> {{ $invoice->due_date->format('d M Y') }}</div>@endif
        @if($invoice->place_of_supply)<div class="pill"><strong>Place of Supply:</strong> {{ $invoice->place_of_supply }}</div>@endif
        <div class="pill"><strong>Tax:</strong> {{ $invoice->is_igst ? 'IGST' : 'CGST + SGST' }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width:4%">#</th>
                <th style="width:29%">Item / Description</th>
                <th style="width:9%">HSN/SAC</th>
                <th class="text-right" style="width:6%">Qty</th>
                <th class="text-right" style="width:9%">Rate</th>
                <th class="text-right" style="width:7%">Disc%</th>
                @if($invoice->is_igst)
                <th class="text-right" style="width:10%">IGST</th>
                @else
                <th class="text-right" style="width:9%">CGST</th>
                <th class="text-right" style="width:9%">SGST</th>
                @endif
                <th class="text-right" style="width:10%">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $idx => $item)
            <tr>
                <td class="text-center" style="color:#9ca3af;">{{ $idx + 1 }}</td>
                <td>
                    <div class="item-name">{{ $item->item?->name ?? $item->description }}</div>
                    @if($item->item?->name && $item->description)
                    <div class="item-desc">{{ $item->description }}</div>
                    @endif
                </td>
                <td class="text-center" style="color:#6b7280;">{{ $item->hsn_sac ?? '-' }}</td>
                <td class="text-right">{{ $item->qty }}</td>
                <td class="text-right">&#8377;{{ number_format($item->unit_price, 2) }}</td>
                <td class="text-right" style="color:#f59e0b;">{{ $item->discount_pct > 0 ? $item->discount_pct . '%' : '-' }}</td>
                @if($invoice->is_igst)
                <td class="text-right">{{ $item->igst > 0 ? '&#8377;' . number_format($item->igst, 2) : '-' }}</td>
                @else
                <td class="text-right">{{ $item->cgst > 0 ? '&#8377;' . number_format($item->cgst, 2) : '-' }}</td>
                <td class="text-right">{{ $item->sgst > 0 ? '&#8377;' . number_format($item->sgst, 2) : '-' }}</td>
                @endif
                <td class="text-right"><strong style="color:#1f2937;">&#8377;{{ number_format($item->amount, 2) }}</strong></td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="bottom-grid">
        <div class="notes-col">
            @if($invoice->notes)
            <div class="notes-box">
                <h4>Notes</h4>
                <p>{{ $invoice->notes }}</p>
            </div>
            @endif
            @if($setting?->terms_and_conditions)
            <div class="notes-box">
                <h4>Terms &amp; Conditions</h4>
                <p style="font-size:9px; color:#9ca3af;">{{ $setting->terms_and_conditions }}</p>
            </div>
            @endif
        </div>
        <div class="totals-col">
            <div class="totals-box">
                <div class="totals-row"><span class="tl">Subtotal</span><span class="tv">&#8377;{{ number_format($invoice->subtotal, 2) }}</span></div>
                @if($invoice->discount > 0)
                <div class="totals-row"><span class="tl">Discount</span><span class="tv" style="color:#10b981;">-&#8377;{{ number_format($invoice->discount, 2) }}</span></div>
                @endif
                @if($invoice->is_igst)
                <div class="totals-row"><span class="tl">IGST</span><span class="tv">&#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</span></div>
                @else
                <div class="totals-row"><span class="tl">CGST</span><span class="tv">&#8377;{{ number_format($invoice->items->sum('cgst'), 2) }}</span></div>
                <div class="totals-row"><span class="tl">SGST</span><span class="tv">&#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</span></div>
                @endif
                @if($invoice->tcs_amount > 0)
                <div class="totals-row"><span class="tl">TCS ({{ $invoice->tcs_rate }}%)</span><span class="tv">&#8377;{{ number_format($invoice->tcs_amount, 2) }}</span></div>
                @endif
                <div class="totals-row totals-grand"><span class="tl">TOTAL</span><span class="tv">&#8377;{{ number_format($invoice->total, 2) }}</span></div>
                @if($invoice->amount_paid > 0)
                <div class="totals-row"><span class="tl">Amount Paid</span><span class="tv" style="color:#059669;">&#8377;{{ number_format($invoice->amount_paid, 2) }}</span></div>
                <div class="totals-row balance-due"><span class="tl">Balance Due</span><span class="tv">&#8377;{{ number_format($invoice->balance, 2) }}</span></div>
                @endif
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="footer-note">
            @if($setting?->invoice_footer_notes)
            {{ $setting->invoice_footer_notes }}
            @else
            This is a computer generated invoice. No signature required.
            @endif
        </div>
        <div class="sig-wrap">
            @if($setting?->e_signature_path)
            <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" alt="Signature">
            @endif
            <div class="sig-line">Authorised Signatory</div>
        </div>
    </div>
</div>

</body>
</html>
