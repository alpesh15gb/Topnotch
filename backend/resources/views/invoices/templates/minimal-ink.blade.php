<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; color: #000; background: #fff; }

    .page { padding: 20px 25px; }

    .header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 12px; }
    .header-inner { display: flex; justify-content: space-between; align-items: flex-start; }
    .brand-left img { max-height: 40px; display: block; margin-bottom: 5px; }
    .company-name { font-size: 18px; font-weight: bold; color: #000; }
    .company-detail { font-size: 8px; color: #000; margin-top: 2px; }

    .inv-right { text-align: right; }
    .inv-title { font-size: 22px; font-weight: bold; color: #000; text-transform: uppercase; letter-spacing: 2px; }
    .inv-number { font-size: 11px; color: #000; margin-top: 3px; }
    .inv-date { font-size: 9px; color: #333; margin-top: 2px; }

    .divider { border: none; border-top: 1px solid #000; margin: 8px 0; }
    .divider-thin { border: none; border-top: 1px solid #ccc; margin: 6px 0; }

    .parties-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
    .party-half { width: 48%; }
    .ph-label { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #555; margin-bottom: 3px; }
    .ph-name { font-size: 13px; font-weight: bold; }
    .ph-info { font-size: 9px; color: #333; margin-top: 1px; }

    .meta-row { display: flex; justify-content: space-between; background: #f5f5f5; padding: 6px 10px; margin-bottom: 12px; border: 1px solid #ccc; }
    .mr-item { text-align: center; }
    .mr-label { font-size: 7px; text-transform: uppercase; letter-spacing: 1px; color: #555; display: block; }
    .mr-value { font-size: 9px; font-weight: bold; color: #000; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    thead th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 5px; text-align: left; font-size: 8px; text-transform: uppercase; letter-spacing: 0.5px; color: #000; font-weight: bold; }
    tbody td { padding: 5px; border-bottom: 1px solid #ddd; font-size: 9px; color: #000; }
    tbody tr:last-child td { border-bottom: 1px solid #000; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .item-name { font-weight: bold; font-size: 10px; }
    .item-desc { font-size: 8px; color: #555; margin-top: 1px; }

    .bottom-row { display: flex; justify-content: space-between; margin-top: 6px; }
    .notes-area { width: 55%; }
    .totals-area { width: 40%; }

    .notes-label { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #555; margin-bottom: 3px; }
    .notes-text { font-size: 9px; color: #333; line-height: 1.5; }

    .totals-table { width: 100%; border-collapse: collapse; }
    .totals-table tr { border-bottom: 1px solid #ddd; }
    .totals-table tr:last-child { border-bottom: none; }
    .totals-table td { padding: 4px 5px; font-size: 9px; }
    .t-label { color: #333; }
    .t-value { text-align: right; font-weight: bold; color: #000; }
    .t-grand { border-top: 2px solid #000; border-bottom: 2px solid #000; }
    .t-grand td { font-size: 12px; font-weight: bold; padding: 5px; }
    .t-balance td { color: #000; font-weight: bold; }

    .footer-row { margin-top: 20px; border-top: 1px solid #000; padding-top: 10px; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-left { font-size: 8px; color: #555; }
    .sig-area { text-align: center; }
    .sig-area img { max-height: 30px; display: block; margin: 0 auto 3px; }
    .sig-line { font-size: 8px; color: #555; border-top: 1px solid #000; padding-top: 3px; }
</style>
</head>
<body>

<div class="page">

    <div class="header">
        <div class="header-inner">
            <div class="brand-left">
                @if($setting?->logo)
                <img src="{{ public_path('storage/' . $setting->logo) }}" alt="Logo">
                @endif
                <div class="company-name">{{ $setting?->tenant?->name ?? 'Company Name' }}</div>
                @if($setting?->gstin)<div class="company-detail">GSTIN: {{ $setting->gstin }}</div>@endif
                @if($setting?->address)<div class="company-detail">{{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}</div>@endif
                @if($setting?->phone)<div class="company-detail">Ph: {{ $setting->phone }}</div>@endif
            </div>
            <div class="inv-right">
                <div class="inv-title">Tax Invoice</div>
                <div class="inv-number">{{ $invoice->number }}</div>
                <div class="inv-date">{{ $invoice->date->format('d M Y') }}</div>
                @if($invoice->due_date)
                <div class="inv-date">Due: {{ $invoice->due_date->format('d M Y') }}</div>
                @endif
            </div>
        </div>
    </div>

    <div class="parties-row">
        <div class="party-half">
            <div class="ph-label">Bill To</div>
            <div class="ph-name">{{ $invoice->party->name }}</div>
            @if($invoice->party->gstin)<div class="ph-info">GSTIN: {{ $invoice->party->gstin }}</div>@endif
            @if($invoice->party->billing_address)<div class="ph-info">{{ $invoice->party->billing_address }}</div>@endif
            @if($invoice->party->city)<div class="ph-info">{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
            @if($invoice->party->phone)<div class="ph-info">Ph: {{ $invoice->party->phone }}</div>@endif
        </div>
        <div class="party-half" style="text-align:right;">
            <div class="ph-label">Details</div>
            <div class="ph-info">Invoice: {{ $invoice->number }}</div>
            <div class="ph-info">Date: {{ $invoice->date->format('d M Y') }}</div>
            @if($invoice->due_date)<div class="ph-info">Due: {{ $invoice->due_date->format('d M Y') }}</div>@endif
            @if($invoice->place_of_supply)<div class="ph-info">Place of Supply: {{ $invoice->place_of_supply }}</div>@endif
            <div class="ph-info">Tax: {{ $invoice->is_igst ? 'IGST' : 'CGST + SGST' }}</div>
        </div>
    </div>

    <hr class="divider-thin">

    <table>
        <thead>
            <tr>
                <th style="width:4%">#</th>
                <th style="width:28%">Item / Description</th>
                <th style="width:9%">HSN/SAC</th>
                <th class="text-right" style="width:6%">Qty</th>
                <th class="text-right" style="width:9%">Rate (&#8377;)</th>
                <th class="text-right" style="width:7%">Disc%</th>
                @if($invoice->is_igst)
                <th class="text-right" style="width:10%">IGST (&#8377;)</th>
                @else
                <th class="text-right" style="width:9%">CGST (&#8377;)</th>
                <th class="text-right" style="width:9%">SGST (&#8377;)</th>
                @endif
                <th class="text-right" style="width:10%">Amount (&#8377;)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $idx => $item)
            <tr>
                <td class="text-center">{{ $idx + 1 }}</td>
                <td>
                    <div class="item-name">{{ $item->item?->name ?? $item->description }}</div>
                    @if($item->item?->name && $item->description)
                    <div class="item-desc">{{ $item->description }}</div>
                    @endif
                </td>
                <td class="text-center">{{ $item->hsn_sac ?? '-' }}</td>
                <td class="text-right">{{ $item->qty }}</td>
                <td class="text-right">{{ number_format($item->unit_price, 2) }}</td>
                <td class="text-right">{{ $item->discount_pct > 0 ? $item->discount_pct . '%' : '-' }}</td>
                @if($invoice->is_igst)
                <td class="text-right">{{ $item->igst > 0 ? number_format($item->igst, 2) : '-' }}</td>
                @else
                <td class="text-right">{{ $item->cgst > 0 ? number_format($item->cgst, 2) : '-' }}</td>
                <td class="text-right">{{ $item->sgst > 0 ? number_format($item->sgst, 2) : '-' }}</td>
                @endif
                <td class="text-right"><strong>{{ number_format($item->amount, 2) }}</strong></td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="bottom-row">
        <div class="notes-area">
            @if($invoice->notes)
            <div class="notes-label">Notes</div>
            <div class="notes-text" style="margin-bottom:8px;">{{ $invoice->notes }}</div>
            @endif
            @if($setting?->terms_and_conditions)
            <div class="notes-label">Terms &amp; Conditions</div>
            <div class="notes-text" style="font-size:8px; color:#555;">{{ $setting->terms_and_conditions }}</div>
            @endif
        </div>
        <div class="totals-area">
            <table class="totals-table">
                <tr><td class="t-label">Subtotal</td><td class="t-value">&#8377;{{ number_format($invoice->subtotal, 2) }}</td></tr>
                @if($invoice->discount > 0)
                <tr><td class="t-label">Discount</td><td class="t-value">-&#8377;{{ number_format($invoice->discount, 2) }}</td></tr>
                @endif
                @if($invoice->is_igst)
                <tr><td class="t-label">IGST</td><td class="t-value">&#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</td></tr>
                @else
                <tr><td class="t-label">CGST</td><td class="t-value">&#8377;{{ number_format($invoice->items->sum('cgst'), 2) }}</td></tr>
                <tr><td class="t-label">SGST</td><td class="t-value">&#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</td></tr>
                @endif
                @if($invoice->tcs_amount > 0)
                <tr><td class="t-label">TCS ({{ $invoice->tcs_rate }}%)</td><td class="t-value">&#8377;{{ number_format($invoice->tcs_amount, 2) }}</td></tr>
                @endif
                <tr class="t-grand"><td class="t-label">TOTAL</td><td class="t-value">&#8377;{{ number_format($invoice->total, 2) }}</td></tr>
                @if($invoice->amount_paid > 0)
                <tr><td class="t-label">Amount Paid</td><td class="t-value">&#8377;{{ number_format($invoice->amount_paid, 2) }}</td></tr>
                <tr class="t-balance"><td class="t-label">Balance Due</td><td class="t-value">&#8377;{{ number_format($invoice->balance, 2) }}</td></tr>
                @endif
            </table>
        </div>
    </div>

    <div class="footer-row">
        <div class="footer-left">
            @if($setting?->invoice_footer_notes)
            {{ $setting->invoice_footer_notes }}
            @else
            Computer generated invoice. No signature required.
            @endif
        </div>
        <div class="sig-area">
            @if($setting?->e_signature_path)
            <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" alt="Signature">
            @else
            <div style="height:28px;"></div>
            @endif
            <div class="sig-line">Authorised Signatory</div>
        </div>
    </div>

</div>

</body>
</html>
