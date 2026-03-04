<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; color: #1c0a00; background: #fffbf5; }

    .outer { border: 2px solid #92400e; background: #fffbf5; }

    .top-pattern { height: 8px; background: repeating-linear-gradient(90deg, #92400e 0px, #92400e 10px, #d97706 10px, #d97706 20px, #fbbf24 20px, #fbbf24 30px, #d97706 30px, #d97706 40px); }

    .header { padding: 18px 28px; text-align: center; border-bottom: 2px solid #92400e; background: #fff8ed; }
    .logo-wrap img { max-height: 55px; margin-bottom: 8px; }
    .restaurant-name { font-size: 26px; font-weight: bold; color: #92400e; letter-spacing: 2px; font-style: italic; }
    .restaurant-tagline { font-size: 9px; color: #b45309; letter-spacing: 3px; text-transform: uppercase; margin-top: 2px; }
    .restaurant-info { font-size: 9px; color: #78350f; margin-top: 6px; }

    .inv-strip { background: #92400e; color: #fef3c7; display: flex; justify-content: space-between; padding: 8px 24px; font-size: 9px; align-items: center; }
    .is-type { font-size: 13px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; }
    .is-num { font-size: 11px; }
    .is-date { font-size: 9px; opacity: 0.85; }

    .guest-section { display: flex; padding: 12px 20px; gap: 16px; border-bottom: 1px solid #fde68a; }
    .gs-block { flex: 1; padding: 10px 12px; background: #fff8ed; border: 1px solid #fde68a; border-radius: 4px; }
    .gs-title { font-size: 8px; text-transform: uppercase; letter-spacing: 1.5px; color: #92400e; font-weight: bold; margin-bottom: 5px; }
    .gs-name { font-size: 12px; font-weight: bold; color: #1c0a00; }
    .gs-info { font-size: 9px; color: #78350f; margin-top: 2px; }

    .body { padding: 16px 20px; }

    .menu-header { background: #78350f; color: #fef3c7; display: flex; padding: 7px 10px; font-size: 8px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }
    .mh-num { width: 5%; }
    .mh-item { flex: 1; }
    .mh-qty { width: 8%; text-align: center; }
    .mh-rate { width: 12%; text-align: right; }
    .mh-disc { width: 8%; text-align: right; }
    @if(true) /* placeholder for tax columns */
    .mh-tax { width: 12%; text-align: right; }
    @endif
    .mh-amount { width: 13%; text-align: right; }

    .menu-item { padding: 9px 10px; border-bottom: 1px dashed #fde68a; display: flex; align-items: flex-start; }
    .menu-item:nth-child(even) { background: #fffdf8; }
    .mi-num { width: 5%; color: #92400e; font-weight: bold; font-size: 11px; }
    .mi-name-col { flex: 1; }
    .mi-name { font-size: 11px; font-weight: bold; color: #1c0a00; }
    .mi-desc { font-size: 8px; color: #a16207; margin-top: 1px; font-style: italic; }
    .mi-hsn { font-size: 8px; color: #78350f; }
    .mi-qty { width: 8%; text-align: center; font-weight: bold; font-size: 11px; }
    .mi-rate { width: 12%; text-align: right; }
    .mi-disc { width: 8%; text-align: right; color: #d97706; }
    .mi-tax { width: 12%; text-align: right; font-size: 9px; color: #92400e; }
    .mi-amount { width: 13%; text-align: right; font-weight: bold; color: #92400e; font-size: 11px; }
    .veg-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #16a34a; margin-right: 3px; vertical-align: middle; }
    .nonveg-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #dc2626; margin-right: 3px; vertical-align: middle; }

    .menu-footer-row { background: #92400e; color: #fef3c7; display: flex; padding: 6px 10px; font-size: 9px; font-weight: bold; }
    .mfr-label { flex: 1; }
    .mfr-value { width: 13%; text-align: right; }

    .lower-section { display: flex; justify-content: space-between; margin-top: 15px; gap: 16px; }
    .notes-col { flex: 1; }
    .totals-col { width: 250px; }

    .menu-notes { background: #fff8ed; border: 1px solid #fde68a; border-radius: 4px; padding: 10px 12px; margin-bottom: 10px; }
    .mn-title { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #92400e; font-weight: bold; margin-bottom: 4px; }
    .mn-text { font-size: 9px; color: #78350f; line-height: 1.5; }

    .totals-box { border: 2px solid #92400e; border-radius: 5px; overflow: hidden; }
    .tb-head { background: #92400e; color: #fef3c7; padding: 6px 12px; font-size: 9px; text-align: center; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    .tb-row { display: flex; justify-content: space-between; padding: 5px 12px; border-bottom: 1px solid #fde68a; font-size: 9px; }
    .tb-row:last-child { border-bottom: none; }
    .tb-label { color: #78350f; }
    .tb-value { font-weight: bold; color: #1c0a00; }
    .tb-grand { background: #78350f; }
    .tb-grand .tb-label, .tb-grand .tb-value { color: #fef3c7; font-size: 12px; font-weight: bold; }
    .tb-balance .tb-label, .tb-balance .tb-value { color: #dc2626; font-weight: bold; }
    .tb-paid .tb-value { color: #16a34a; }
    .tb-discount .tb-value { color: #d97706; }

    .footer { margin-top: 18px; border-top: 2px solid #92400e; padding-top: 12px; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-left { font-size: 9px; color: #78350f; font-style: italic; }
    .sig-zone { text-align: center; }
    .sig-zone img { max-height: 35px; display: block; margin: 0 auto 4px; }
    .sig-zone .sz-label { font-size: 8px; color: #92400e; border-top: 1px solid #fde68a; padding-top: 3px; }

    .bottom-pattern { height: 8px; background: repeating-linear-gradient(90deg, #fbbf24 0px, #fbbf24 10px, #d97706 10px, #d97706 20px, #92400e 20px, #92400e 30px, #d97706 30px, #d97706 40px); }
</style>
</head>
<body>

<div class="outer">
    <div class="top-pattern"></div>

    <div class="header">
        @if($setting?->logo)
        <div class="logo-wrap">
            <img src="{{ public_path('storage/' . $setting->logo) }}" alt="Logo">
        </div>
        @endif
        <div class="restaurant-name">{{ $setting?->tenant?->name ?? 'The Restaurant' }}</div>
        <div class="restaurant-tagline">Fine Dining &amp; Takeaway</div>
        <div class="restaurant-info">
            @if($setting?->gstin)GSTIN: {{ $setting->gstin }} &nbsp;|&nbsp; @endif
            @if($setting?->address){{ $setting->address }}, {{ $setting->city }} &nbsp;|&nbsp; @endif
            @if($setting?->phone)Ph: {{ $setting->phone }}@endif
        </div>
    </div>

    <div class="inv-strip">
        <div>
            <div class="is-type">Tax Invoice / Bill</div>
        </div>
        <div style="text-align:center;">
            <div class="is-num">{{ $invoice->number }}</div>
        </div>
        <div style="text-align:right;">
            <div class="is-date">Date: {{ $invoice->date->format('d M Y') }}</div>
            @if($invoice->due_date)
            <div class="is-date">Due: {{ $invoice->due_date->format('d M Y') }}</div>
            @endif
        </div>
    </div>

    <div class="guest-section">
        <div class="gs-block">
            <div class="gs-title">Guest / Customer</div>
            <div class="gs-name">{{ $invoice->party->name }}</div>
            @if($invoice->party->gstin)<div class="gs-info">GSTIN: {{ $invoice->party->gstin }}</div>@endif
            @if($invoice->party->billing_address)<div class="gs-info">{{ $invoice->party->billing_address }}</div>@endif
            @if($invoice->party->city)<div class="gs-info">{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
            @if($invoice->party->phone)<div class="gs-info">Ph: {{ $invoice->party->phone }}</div>@endif
        </div>
        <div class="gs-block">
            <div class="gs-title">Order Details</div>
            <div class="gs-info"><strong>Invoice No:</strong> {{ $invoice->number }}</div>
            <div class="gs-info"><strong>Date:</strong> {{ $invoice->date->format('d M Y') }}</div>
            @if($invoice->due_date)
            <div class="gs-info"><strong>Due:</strong> {{ $invoice->due_date->format('d M Y') }}</div>
            @endif
            @if($invoice->place_of_supply)
            <div class="gs-info"><strong>Place:</strong> {{ $invoice->place_of_supply }}</div>
            @endif
            <div class="gs-info"><strong>Tax:</strong> {{ $invoice->is_igst ? 'IGST' : 'CGST + SGST' }}</div>
        </div>
    </div>

    <div class="body">
        <div class="menu-header">
            <div class="mh-num">#</div>
            <div class="mh-item">Food Item / Service</div>
            <div class="mh-qty">Qty</div>
            <div class="mh-rate">Rate (&#8377;)</div>
            <div class="mh-disc">Disc%</div>
            @if($invoice->is_igst)
            <div class="mh-tax">IGST (&#8377;)</div>
            @else
            <div class="mh-tax">CGST (&#8377;)</div>
            <div class="mh-tax">SGST (&#8377;)</div>
            @endif
            <div class="mh-amount">Amount (&#8377;)</div>
        </div>

        @foreach($invoice->items as $idx => $item)
        <div class="menu-item">
            <div class="mi-num">{{ $idx + 1 }}</div>
            <div class="mi-name-col">
                <div class="mi-name">
                    @if($idx % 3 == 0)
                    <span class="veg-dot"></span>
                    @else
                    <span class="nonveg-dot"></span>
                    @endif
                    {{ $item->item?->name ?? $item->description }}
                </div>
                @if($item->item?->name && $item->description)
                <div class="mi-desc">{{ $item->description }}</div>
                @endif
                @if($item->hsn_sac)
                <div class="mi-hsn">HSN/SAC: {{ $item->hsn_sac }}</div>
                @endif
            </div>
            <div class="mi-qty">{{ $item->qty }}</div>
            <div class="mi-rate">{{ number_format($item->unit_price, 2) }}</div>
            <div class="mi-disc">{{ $item->discount_pct > 0 ? $item->discount_pct . '%' : '-' }}</div>
            @if($invoice->is_igst)
            <div class="mi-tax">{{ $item->igst > 0 ? number_format($item->igst, 2) : '-' }}</div>
            @else
            <div class="mi-tax">{{ $item->cgst > 0 ? number_format($item->cgst, 2) : '-' }}<br>{{ $item->sgst > 0 ? number_format($item->sgst, 2) : '-' }}</div>
            @endif
            <div class="mi-amount">&#8377;{{ number_format($item->amount, 2) }}</div>
        </div>
        @endforeach

        <div class="menu-footer-row">
            <div class="mfr-label">Total Items: {{ count($invoice->items) }}</div>
            <div class="mfr-value">&#8377;{{ number_format($invoice->subtotal, 2) }}</div>
        </div>

        <div class="lower-section">
            <div class="notes-col">
                @if($invoice->notes)
                <div class="menu-notes">
                    <div class="mn-title">Chef's Note / Special Instructions</div>
                    <div class="mn-text">{{ $invoice->notes }}</div>
                </div>
                @endif
                @if($setting?->terms_and_conditions)
                <div class="menu-notes">
                    <div class="mn-title">Terms &amp; Conditions</div>
                    <div class="mn-text">{{ $setting->terms_and_conditions }}</div>
                </div>
                @endif
                <div class="menu-notes" style="border-color:#92400e;">
                    <div class="mn-title">GST Summary</div>
                    @if($invoice->is_igst)
                    <div class="mn-text">IGST Total: &#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</div>
                    @else
                    <div class="mn-text">CGST Total: &#8377;{{ number_format($invoice->items->sum('cgst'), 2) }} | SGST Total: &#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</div>
                    @endif
                    <div class="mn-text">Total Tax: &#8377;{{ number_format($invoice->tax_amount, 2) }}</div>
                </div>
            </div>
            <div class="totals-col">
                <div class="totals-box">
                    <div class="tb-head">Bill Summary</div>
                    <div class="tb-row"><span class="tb-label">Subtotal</span><span class="tb-value">&#8377;{{ number_format($invoice->subtotal, 2) }}</span></div>
                    @if($invoice->discount > 0)
                    <div class="tb-row tb-discount"><span class="tb-label">Discount</span><span class="tb-value">-&#8377;{{ number_format($invoice->discount, 2) }}</span></div>
                    @endif
                    @if($invoice->is_igst)
                    <div class="tb-row"><span class="tb-label">IGST</span><span class="tb-value">&#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</span></div>
                    @else
                    <div class="tb-row"><span class="tb-label">CGST</span><span class="tb-value">&#8377;{{ number_format($invoice->items->sum('cgst'), 2) }}</span></div>
                    <div class="tb-row"><span class="tb-label">SGST</span><span class="tb-value">&#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</span></div>
                    @endif
                    @if($invoice->tcs_amount > 0)
                    <div class="tb-row"><span class="tb-label">TCS ({{ $invoice->tcs_rate }}%)</span><span class="tb-value">&#8377;{{ number_format($invoice->tcs_amount, 2) }}</span></div>
                    @endif
                    <div class="tb-row tb-grand"><span class="tb-label">GRAND TOTAL</span><span class="tb-value">&#8377;{{ number_format($invoice->total, 2) }}</span></div>
                    @if($invoice->amount_paid > 0)
                    <div class="tb-row tb-paid"><span class="tb-label">Paid</span><span class="tb-value">&#8377;{{ number_format($invoice->amount_paid, 2) }}</span></div>
                    <div class="tb-row tb-balance"><span class="tb-label">Balance</span><span class="tb-value">&#8377;{{ number_format($invoice->balance, 2) }}</span></div>
                    @endif
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="footer-left">
                @if($setting?->invoice_footer_notes)
                {{ $setting->invoice_footer_notes }}
                @else
                Thank you for dining with us! Please visit again.
                @endif
                <div style="margin-top:4px; font-size:8px; color:#a16207;">
                    <span style="color:#16a34a;">&#9679;</span> Vegetarian &nbsp;
                    <span style="color:#dc2626;">&#9679;</span> Non-Vegetarian
                </div>
            </div>
            <div class="sig-zone">
                @if($setting?->e_signature_path)
                <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" alt="Signature">
                @else
                <div style="height:30px;"></div>
                @endif
                <div class="sz-label">Authorised Signatory</div>
            </div>
        </div>
    </div>

    <div class="bottom-pattern"></div>
</div>

</body>
</html>
