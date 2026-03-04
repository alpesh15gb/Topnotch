<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Serif', Georgia, serif; font-size: 11px; color: #4a3f3f; background: #fff; }

    .outer { border: 1px solid #e8d5d5; margin: 0; }

    .top-border { height: 6px; background: #d4a5a5; }

    .header { padding: 28px 35px 20px; text-align: center; border-bottom: 1px solid #e8d5d5; background: #fff9f9; position: relative; }
    .logo-wrap { margin-bottom: 8px; }
    .logo-wrap img { max-height: 55px; }
    .boutique-name { font-size: 26px; color: #8b4f4f; letter-spacing: 4px; text-transform: uppercase; font-weight: normal; }
    .boutique-tagline { font-size: 9px; color: #b08080; letter-spacing: 2px; margin-top: 3px; text-transform: uppercase; }
    .boutique-info { font-size: 9px; color: #7a6060; margin-top: 6px; }

    .invoice-stamp { position: absolute; top: 28px; right: 35px; text-align: right; }
    .invoice-stamp .stamp-title { font-size: 13px; color: #d4a5a5; letter-spacing: 3px; text-transform: uppercase; font-weight: normal; }
    .invoice-stamp .stamp-num { font-size: 11px; color: #8b4f4f; font-weight: bold; margin-top: 3px; }
    .invoice-stamp .stamp-date { font-size: 9px; color: #b08080; margin-top: 2px; }

    .divider-line { border: none; border-top: 1px solid #e8d5d5; margin: 0; }
    .divider-ornament { text-align: center; margin: -7px 0; line-height: 14px; }
    .divider-ornament span { background: #fff9f9; padding: 0 8px; font-size: 14px; color: #d4a5a5; }

    .parties-section { display: flex; padding: 18px 35px; gap: 20px; border-bottom: 1px solid #e8d5d5; background: #fff; }
    .party-card { flex: 1; padding: 12px 15px; border: 1px solid #f0dddd; border-radius: 4px; }
    .party-card .pc-title { font-size: 8px; text-transform: uppercase; letter-spacing: 2px; color: #d4a5a5; margin-bottom: 7px; }
    .party-card .pc-name { font-size: 13px; color: #5a3535; font-weight: bold; }
    .party-card .pc-info { font-size: 9px; color: #7a6060; margin-top: 2px; }

    .body { padding: 20px 35px; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    thead tr { border-bottom: 2px solid #d4a5a5; }
    thead th { color: #8b4f4f; padding: 8px 7px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; background: #fff9f9; }
    tbody tr { border-bottom: 1px solid #f5e8e8; }
    tbody td { padding: 9px 7px; font-size: 10px; }
    tbody tr:last-child td { border-bottom: 2px solid #d4a5a5; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .item-name { font-weight: bold; color: #4a3535; font-size: 11px; }
    .item-desc { font-size: 9px; color: #a08080; font-style: italic; margin-top: 1px; }

    .lower-section { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 5px; }
    .notes-col { width: 52%; }
    .totals-col { width: 42%; }

    .notes-title { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #d4a5a5; margin-bottom: 5px; }
    .notes-text { font-size: 9px; color: #7a6060; line-height: 1.5; }

    .totals-table { width: 100%; border-collapse: collapse; }
    .totals-table tr { border-bottom: 1px solid #f5e8e8; }
    .totals-table td { padding: 5px 7px; font-size: 10px; }
    .tl { color: #7a6060; }
    .tv { text-align: right; color: #4a3535; }
    .grand-row { background: #d4a5a5; border: none; }
    .grand-row td { color: #fff; font-weight: bold; font-size: 12px; padding: 7px; border-bottom: none; }
    .balance-row td { color: #c0392b; font-weight: bold; }
    .discount-val { color: #d4a5a5; }

    .footer { margin-top: 25px; border-top: 1px solid #e8d5d5; padding-top: 14px; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-note { font-size: 9px; color: #b08080; font-style: italic; }
    .sig-wrap { text-align: center; }
    .sig-wrap img { max-height: 40px; display: block; margin: 0 auto 5px; }
    .sig-label { font-size: 9px; color: #b08080; border-top: 1px solid #e8d5d5; padding-top: 4px; letter-spacing: 1px; }

    .bottom-border { height: 6px; background: #d4a5a5; }
</style>
</head>
<body>

<div class="outer">
    <div class="top-border"></div>

    <div class="header">
        <div class="invoice-stamp">
            <div class="stamp-title">Invoice</div>
            <div class="stamp-num">{{ $invoice->number }}</div>
            <div class="stamp-date">{{ $invoice->date->format('d M Y') }}</div>
            @if($invoice->due_date)
            <div class="stamp-date">Due: {{ $invoice->due_date->format('d M Y') }}</div>
            @endif
        </div>
        <div class="logo-wrap">
            @if($setting?->logo)
            <img src="{{ public_path('storage/' . $setting->logo) }}" alt="Logo">
            @endif
        </div>
        <div class="boutique-name">{{ $setting?->tenant?->name ?? 'Boutique Name' }}</div>
        <div class="boutique-tagline">Elegance &amp; Style</div>
        <div class="boutique-info">
            @if($setting?->gstin)GSTIN: {{ $setting->gstin }} &nbsp;|&nbsp; @endif
            @if($setting?->address){{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }} &nbsp;|&nbsp; @endif
            @if($setting?->phone)Ph: {{ $setting->phone }}@endif
        </div>
    </div>

    <div class="parties-section">
        <div class="party-card">
            <div class="pc-title">Billed To</div>
            <div class="pc-name">{{ $invoice->party->name }}</div>
            @if($invoice->party->gstin)<div class="pc-info">GSTIN: {{ $invoice->party->gstin }}</div>@endif
            @if($invoice->party->billing_address)<div class="pc-info">{{ $invoice->party->billing_address }}</div>@endif
            @if($invoice->party->city)<div class="pc-info">{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
            @if($invoice->party->phone)<div class="pc-info">Ph: {{ $invoice->party->phone }}</div>@endif
        </div>
        <div class="party-card">
            <div class="pc-title">Order Details</div>
            <div class="pc-info"><strong style="color:#5a3535;">Invoice No:</strong> {{ $invoice->number }}</div>
            <div class="pc-info"><strong style="color:#5a3535;">Date:</strong> {{ $invoice->date->format('d M Y') }}</div>
            @if($invoice->due_date)
            <div class="pc-info"><strong style="color:#5a3535;">Due Date:</strong> {{ $invoice->due_date->format('d M Y') }}</div>
            @endif
            @if($invoice->place_of_supply)
            <div class="pc-info"><strong style="color:#5a3535;">Place of Supply:</strong> {{ $invoice->place_of_supply }}</div>
            @endif
            <div class="pc-info"><strong style="color:#5a3535;">Tax:</strong> {{ $invoice->is_igst ? 'IGST' : 'CGST + SGST' }}</div>
        </div>
    </div>

    <div class="body">
        <table>
            <thead>
                <tr>
                    <th style="width:5%">#</th>
                    <th style="width:28%">Item Description</th>
                    <th style="width:9%">HSN/SAC</th>
                    <th class="text-right" style="width:7%">Qty</th>
                    <th class="text-right" style="width:9%">Rate (&#8377;)</th>
                    <th class="text-right" style="width:7%">Disc%</th>
                    @if($invoice->is_igst)
                    <th class="text-right" style="width:10%">IGST (&#8377;)</th>
                    @else
                    <th class="text-right" style="width:9%">CGST (&#8377;)</th>
                    <th class="text-right" style="width:9%">SGST (&#8377;)</th>
                    @endif
                    <th class="text-right" style="width:11%">Amount (&#8377;)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $idx => $item)
                <tr>
                    <td class="text-center" style="color:#b08080;">{{ $idx + 1 }}</td>
                    <td>
                        <div class="item-name">{{ $item->item?->name ?? $item->description }}</div>
                        @if($item->item?->name && $item->description)
                        <div class="item-desc">{{ $item->description }}</div>
                        @endif
                    </td>
                    <td class="text-center" style="color:#b08080;">{{ $item->hsn_sac ?? '-' }}</td>
                    <td class="text-right">{{ $item->qty }}</td>
                    <td class="text-right">{{ number_format($item->unit_price, 2) }}</td>
                    <td class="text-right class discount-val">{{ $item->discount_pct > 0 ? $item->discount_pct . '%' : '-' }}</td>
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

        <div class="lower-section">
            <div class="notes-col">
                @if($invoice->notes)
                <div class="notes-title">Special Notes</div>
                <div class="notes-text">{{ $invoice->notes }}</div>
                @endif
                @if($setting?->terms_and_conditions)
                <div class="notes-title" style="margin-top:10px;">Terms &amp; Conditions</div>
                <div class="notes-text" style="color:#b08080; font-size:9px;">{{ $setting->terms_and_conditions }}</div>
                @endif
            </div>
            <div class="totals-col">
                <table class="totals-table">
                    <tr><td class="tl">Subtotal</td><td class="tv">&#8377;{{ number_format($invoice->subtotal, 2) }}</td></tr>
                    @if($invoice->discount > 0)
                    <tr><td class="tl discount-val">Discount</td><td class="tv discount-val">-&#8377;{{ number_format($invoice->discount, 2) }}</td></tr>
                    @endif
                    @if($invoice->is_igst)
                    <tr><td class="tl">IGST</td><td class="tv">&#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</td></tr>
                    @else
                    <tr><td class="tl">CGST</td><td class="tv">&#8377;{{ number_format($invoice->items->sum('cgst'), 2) }}</td></tr>
                    <tr><td class="tl">SGST</td><td class="tv">&#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</td></tr>
                    @endif
                    @if($invoice->tcs_amount > 0)
                    <tr><td class="tl">TCS ({{ $invoice->tcs_rate }}%)</td><td class="tv">&#8377;{{ number_format($invoice->tcs_amount, 2) }}</td></tr>
                    @endif
                    <tr class="grand-row"><td class="tl">Total</td><td class="tv">&#8377;{{ number_format($invoice->total, 2) }}</td></tr>
                    @if($invoice->amount_paid > 0)
                    <tr><td class="tl">Amount Paid</td><td class="tv" style="color:#27ae60;">&#8377;{{ number_format($invoice->amount_paid, 2) }}</td></tr>
                    <tr class="balance-row"><td class="tl">Balance Due</td><td class="tv">&#8377;{{ number_format($invoice->balance, 2) }}</td></tr>
                    @endif
                </table>
            </div>
        </div>

        <div class="footer">
            <div class="footer-note">
                @if($setting?->invoice_footer_notes)
                {{ $setting->invoice_footer_notes }}
                @else
                Thank you for shopping with us. We appreciate your business.
                @endif
            </div>
            <div class="sig-wrap">
                @if($setting?->e_signature_path)
                <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" alt="Signature">
                @else
                <div style="height:35px;"></div>
                @endif
                <div class="sig-label">Authorised Signatory</div>
            </div>
        </div>
    </div>

    <div class="bottom-border"></div>
</div>

</body>
</html>
