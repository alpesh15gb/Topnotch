<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans Mono', monospace; font-size: 10px; color: #111; background: #fff; }

    .receipt { max-width: 380px; margin: 0 auto; padding: 16px 18px; border-left: 1px dashed #ccc; border-right: 1px dashed #ccc; }

    .header { text-align: center; padding-bottom: 12px; border-bottom: 2px dashed #333; }
    .logo-wrap img { max-height: 50px; margin-bottom: 6px; }
    .store-name { font-size: 18px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
    .store-tagline { font-size: 8px; color: #555; margin-top: 2px; letter-spacing: 1px; }
    .store-meta { font-size: 9px; color: #444; margin-top: 5px; line-height: 1.6; }

    .inv-meta { text-align: center; padding: 9px 0; border-bottom: 1px dashed #aaa; margin-bottom: 0; }
    .inv-meta .inv-row { display: flex; justify-content: space-between; font-size: 9px; padding: 2px 0; }
    .inv-meta .inv-row .il { color: #555; }
    .inv-meta .inv-row .iv { font-weight: bold; }
    .doc-type { font-size: 11px; font-weight: bold; letter-spacing: 3px; text-align: center; padding: 7px 0; border-bottom: 2px solid #333; border-top: 1px dashed #aaa; margin: 0; }

    .bill-to { padding: 8px 0; border-bottom: 1px dashed #aaa; }
    .bill-to .bt-title { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #555; margin-bottom: 3px; }
    .bill-to .bt-name { font-size: 11px; font-weight: bold; }
    .bill-to .bt-info { font-size: 9px; color: #444; }

    .items-section { margin: 8px 0; }
    .items-header { display: flex; justify-content: space-between; font-size: 9px; font-weight: bold; text-transform: uppercase; padding: 5px 0; border-bottom: 1px solid #333; border-top: 1px solid #333; }
    .item-row { padding: 6px 0; border-bottom: 1px dashed #ddd; }
    .item-row .ir-name { font-size: 10px; font-weight: bold; }
    .item-row .ir-desc { font-size: 8px; color: #777; }
    .item-row .ir-details { display: flex; justify-content: space-between; margin-top: 3px; font-size: 9px; color: #444; }
    .item-row .ir-amount { font-size: 10px; font-weight: bold; text-align: right; margin-top: 3px; }
    .ir-tax-line { font-size: 8px; color: #777; }

    .section-line { border: none; border-top: 1px dashed #aaa; margin: 6px 0; }
    .section-line-solid { border: none; border-top: 2px solid #333; margin: 6px 0; }

    .totals-section { padding: 4px 0; }
    .t-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 10px; }
    .t-row .tl { color: #444; }
    .t-row .tv { font-weight: bold; }
    .t-grand { font-size: 13px; border-top: 2px solid #333; border-bottom: 2px solid #333; margin: 4px 0; padding: 5px 0; }
    .t-grand .tl, .t-grand .tv { font-weight: bold; font-size: 13px; }
    .t-balance .tl, .t-balance .tv { color: #c0392b; font-weight: bold; }
    .t-paid .tv { color: #27ae60; }
    .t-discount .tv { color: #e67e22; }

    .tax-summary { padding: 6px 0; border-top: 1px dashed #aaa; border-bottom: 1px dashed #aaa; margin: 6px 0; }
    .ts-title { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: bold; }
    .ts-row { display: flex; justify-content: space-between; font-size: 9px; padding: 1px 0; }

    .footer-section { text-align: center; padding-top: 10px; border-top: 2px dashed #333; }
    .sig-area { margin-bottom: 8px; }
    .sig-area img { max-height: 35px; }
    .sig-label { font-size: 8px; color: #555; border-top: 1px solid #ccc; padding-top: 3px; display: inline-block; padding-left: 15px; padding-right: 15px; }
    .footer-note { font-size: 8px; color: #555; line-height: 1.5; margin-top: 6px; }
    .footer-thanks { font-size: 11px; font-weight: bold; letter-spacing: 2px; margin-top: 8px; }
    .bottom-dots { text-align: center; font-size: 14px; color: #ccc; margin-top: 8px; letter-spacing: 4px; }

    .notes-box { padding: 6px 0; font-size: 9px; color: #555; border-top: 1px dashed #aaa; }
</style>
</head>
<body>

<div class="receipt">

    <div class="header">
        <div class="logo-wrap">
            @if($setting?->logo)
            <img src="{{ public_path('storage/' . $setting->logo) }}" alt="Logo">
            @endif
        </div>
        <div class="store-name">{{ $setting?->tenant?->name ?? 'Store Name' }}</div>
        <div class="store-tagline">Your Trusted Retail Partner</div>
        <div class="store-meta">
            @if($setting?->address){{ $setting->address }}, {{ $setting->city }}<br>@endif
            @if($setting?->state){{ $setting->state }}@endif
            @if($setting?->phone)<br>Ph: {{ $setting->phone }}@endif
            @if($setting?->gstin)<br>GSTIN: {{ $setting->gstin }}@endif
        </div>
    </div>

    <div class="doc-type">* TAX INVOICE *</div>

    <div class="inv-meta">
        <div class="inv-row"><span class="il">Invoice No:</span><span class="iv">{{ $invoice->number }}</span></div>
        <div class="inv-row"><span class="il">Date:</span><span class="iv">{{ $invoice->date->format('d/m/Y') }}</span></div>
        @if($invoice->due_date)
        <div class="inv-row"><span class="il">Due Date:</span><span class="iv">{{ $invoice->due_date->format('d/m/Y') }}</span></div>
        @endif
        @if($invoice->place_of_supply)
        <div class="inv-row"><span class="il">Place of Supply:</span><span class="iv">{{ $invoice->place_of_supply }}</span></div>
        @endif
        <div class="inv-row"><span class="il">Tax Type:</span><span class="iv">{{ $invoice->is_igst ? 'IGST' : 'CGST + SGST' }}</span></div>
    </div>

    <div class="bill-to">
        <div class="bt-title">Customer</div>
        <div class="bt-name">{{ $invoice->party->name }}</div>
        @if($invoice->party->gstin)<div class="bt-info">GSTIN: {{ $invoice->party->gstin }}</div>@endif
        @if($invoice->party->billing_address)<div class="bt-info">{{ $invoice->party->billing_address }}</div>@endif
        @if($invoice->party->city)<div class="bt-info">{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
        @if($invoice->party->phone)<div class="bt-info">Ph: {{ $invoice->party->phone }}</div>@endif
    </div>

    <hr class="section-line">

    <div class="items-section">
        <div class="items-header">
            <span>Item</span>
            <span>Amount</span>
        </div>
        @foreach($invoice->items as $idx => $item)
        <div class="item-row">
            <div class="ir-name">{{ $idx + 1 }}. {{ $item->item?->name ?? $item->description }}</div>
            @if($item->item?->name && $item->description)
            <div class="ir-desc">{{ $item->description }}</div>
            @endif
            <div class="ir-details">
                <span>{{ $item->qty }} x &#8377;{{ number_format($item->unit_price, 2) }}</span>
                @if($item->discount_pct > 0)
                <span>Disc: {{ $item->discount_pct }}%</span>
                @endif
                @if($item->hsn_sac)
                <span>HSN: {{ $item->hsn_sac }}</span>
                @endif
            </div>
            <div class="ir-tax-line">
                @if($invoice->is_igst)
                    @if($item->igst > 0)IGST: &#8377;{{ number_format($item->igst, 2) }}@endif
                @else
                    @if($item->cgst > 0)CGST: &#8377;{{ number_format($item->cgst, 2) }}@endif
                    @if($item->sgst > 0) | SGST: &#8377;{{ number_format($item->sgst, 2) }}@endif
                @endif
            </div>
            <div class="ir-amount">&#8377;{{ number_format($item->amount, 2) }}</div>
        </div>
        @endforeach
    </div>

    <hr class="section-line-solid">

    <div class="tax-summary">
        <div class="ts-title">Tax Summary</div>
        @if($invoice->is_igst)
        <div class="ts-row"><span>IGST Total</span><span>&#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</span></div>
        @else
        <div class="ts-row"><span>CGST Total</span><span>&#8377;{{ number_format($invoice->items->sum('cgst'), 2) }}</span></div>
        <div class="ts-row"><span>SGST Total</span><span>&#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</span></div>
        @endif
        <div class="ts-row"><span>Total Tax</span><span><strong>&#8377;{{ number_format($invoice->tax_amount, 2) }}</strong></span></div>
    </div>

    <div class="totals-section">
        <div class="t-row"><span class="tl">Subtotal</span><span class="tv">&#8377;{{ number_format($invoice->subtotal, 2) }}</span></div>
        @if($invoice->discount > 0)
        <div class="t-row t-discount"><span class="tl">Discount</span><span class="tv">-&#8377;{{ number_format($invoice->discount, 2) }}</span></div>
        @endif
        @if($invoice->is_igst)
        <div class="t-row"><span class="tl">IGST</span><span class="tv">&#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</span></div>
        @else
        <div class="t-row"><span class="tl">CGST</span><span class="tv">&#8377;{{ number_format($invoice->items->sum('cgst'), 2) }}</span></div>
        <div class="t-row"><span class="tl">SGST</span><span class="tv">&#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</span></div>
        @endif
        @if($invoice->tcs_amount > 0)
        <div class="t-row"><span class="tl">TCS ({{ $invoice->tcs_rate }}%)</span><span class="tv">&#8377;{{ number_format($invoice->tcs_amount, 2) }}</span></div>
        @endif
        <div class="t-row t-grand">
            <span class="tl">*** TOTAL ***</span>
            <span class="tv">&#8377;{{ number_format($invoice->total, 2) }}</span>
        </div>
        @if($invoice->amount_paid > 0)
        <div class="t-row t-paid"><span class="tl">Paid</span><span class="tv">&#8377;{{ number_format($invoice->amount_paid, 2) }}</span></div>
        <div class="t-row t-balance"><span class="tl">Balance Due</span><span class="tv">&#8377;{{ number_format($invoice->balance, 2) }}</span></div>
        @endif
    </div>

    @if($invoice->notes)
    <div class="notes-box">
        <strong>Note:</strong> {{ $invoice->notes }}
    </div>
    @endif

    @if($setting?->terms_and_conditions)
    <div class="notes-box" style="border-top:none;">
        <strong>Terms:</strong> {{ $setting->terms_and_conditions }}
    </div>
    @endif

    <div class="footer-section">
        @if($setting?->e_signature_path)
        <div class="sig-area">
            <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" alt="Signature">
            <div><span class="sig-label">Authorised Signatory</span></div>
        </div>
        @endif
        @if($setting?->invoice_footer_notes)
        <div class="footer-note">{{ $setting->invoice_footer_notes }}</div>
        @endif
        <div class="footer-thanks">THANK YOU!</div>
        <div class="footer-note" style="margin-top:4px;">Please visit again. This is a computer generated receipt.</div>
    </div>

    <div class="bottom-dots">* * * * * * * * * * * * *</div>

</div>

</body>
</html>
