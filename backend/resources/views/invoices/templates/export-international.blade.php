<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; color: #1a1a2e; background: #fff; }

    .outer { border: 2px solid #1a1a2e; }

    .header { background: #1a1a2e; padding: 20px 28px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand-col img { max-height: 48px; display: block; margin-bottom: 7px; }
    .brand-name { font-size: 19px; font-weight: bold; color: #fff; letter-spacing: 1px; }
    .brand-info { font-size: 8px; color: rgba(255,255,255,0.65); margin-top: 2px; }

    .doc-col { text-align: right; }
    .doc-main-title { font-size: 10px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 3px; }
    .doc-type { font-size: 20px; font-weight: bold; color: #fbbf24; letter-spacing: 2px; margin-top: 2px; }
    .doc-sub { font-size: 8px; color: rgba(255,255,255,0.6); margin-top: 2px; }
    .doc-number { font-size: 12px; color: #fff; margin-top: 5px; font-weight: bold; }

    .flag-strip { height: 4px; background: linear-gradient(to right, #ff9933 33%, #fff 33%, #fff 66%, #138808 66%); border-bottom: 1px solid #ccc; }

    .meta-row { display: flex; background: #f8f9fa; border-bottom: 1px solid #dee2e6; }
    .mr-cell { flex: 1; padding: 8px 14px; border-right: 1px solid #dee2e6; }
    .mr-cell:last-child { border-right: none; }
    .mr-label { font-size: 7px; text-transform: uppercase; letter-spacing: 1px; color: #6c757d; display: block; margin-bottom: 2px; }
    .mr-value { font-size: 10px; font-weight: bold; color: #1a1a2e; }

    .parties-section { display: flex; border-bottom: 2px solid #1a1a2e; }
    .party-col { flex: 1; padding: 12px 16px; }
    .party-col:not(:last-child) { border-right: 1px solid #dee2e6; }
    .party-col.shaded { background: #f0f4ff; }
    .pc-heading { font-size: 8px; text-transform: uppercase; letter-spacing: 1.5px; color: #fff; background: #1a1a2e; padding: 3px 8px; display: inline-block; margin-bottom: 7px; }
    .pc-name { font-size: 13px; font-weight: bold; color: #1a1a2e; }
    .pc-gstin { font-size: 9px; color: #0d47a1; font-weight: bold; margin-top: 2px; }
    .pc-info { font-size: 9px; color: #374151; margin-top: 1px; }
    .pc-country { font-size: 10px; font-weight: bold; color: #1a1a2e; margin-top: 4px; }

    .body { padding: 0; }

    table { width: 100%; border-collapse: collapse; }
    thead th { background: #1a1a2e; color: #e2e8f0; padding: 8px 7px; text-align: left; font-size: 8px; text-transform: uppercase; letter-spacing: 0.5px; border-right: 1px solid #2d3748; }
    thead th:last-child { border-right: none; }
    tbody tr { border-bottom: 1px solid #e2e8f0; }
    tbody tr:nth-child(even) td { background: #f8f9fa; }
    tbody td { padding: 7px; font-size: 9px; border-right: 1px solid #e9ecef; }
    tbody td:last-child { border-right: none; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .item-name { font-weight: bold; color: #1a1a2e; font-size: 10px; }
    .item-desc { font-size: 8px; color: #6c757d; margin-top: 1px; }

    .footer-section { border-top: 2px solid #1a1a2e; display: flex; }
    .fs-notes { flex: 1; padding: 12px 16px; border-right: 1px solid #dee2e6; }
    .fs-totals { width: 280px; }
    .fs-sig { width: 160px; padding: 12px 14px; border-left: 1px solid #dee2e6; text-align: center; }

    .fn-heading { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #6c757d; border-bottom: 1px solid #dee2e6; padding-bottom: 3px; margin-bottom: 5px; }
    .fn-text { font-size: 9px; color: #374151; line-height: 1.5; }

    .tot-row { display: flex; justify-content: space-between; padding: 5px 12px; border-bottom: 1px solid #e9ecef; font-size: 9px; }
    .tot-row:last-child { border-bottom: none; }
    .tot-label { color: #6c757d; }
    .tot-value { font-weight: bold; color: #1a1a2e; }
    .tot-grand { background: #1a1a2e; }
    .tot-grand .tot-label, .tot-grand .tot-value { color: #fbbf24; font-size: 12px; font-weight: bold; }
    .tot-balance .tot-label, .tot-balance .tot-value { color: #dc2626; font-weight: bold; }
    .tot-paid .tot-value { color: #059669; }
    .tot-discount .tot-value { color: #f59e0b; }

    .fs-sig img { max-height: 38px; display: block; margin: 20px auto 6px; }
    .sig-underline { border-top: 1px solid #1a1a2e; padding-top: 4px; font-size: 8px; color: #6c757d; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; }

    .currency-note { background: #fffbeb; border: 1px solid #fde68a; padding: 6px 16px; border-bottom: 1px solid #dee2e6; }
    .cn-text { font-size: 8px; color: #92400e; }
    .cn-text strong { color: #b45309; }

    .footer-bar { background: #f0f4ff; border-top: 1px solid #dee2e6; padding: 6px 16px; font-size: 8px; color: #6c757d; display: flex; justify-content: space-between; }
</style>
</head>
<body>

<div class="outer">
    <div class="header">
        <div class="brand-col">
            @if($setting?->logo)
            <img src="{{ public_path('storage/' . $setting->logo) }}" alt="Logo">
            @endif
            <div class="brand-name">{{ $setting?->tenant?->name ?? 'Export House' }}</div>
            @if($setting?->gstin)<div class="brand-info">GSTIN: {{ $setting->gstin }}</div>@endif
            @if($setting?->address)<div class="brand-info">{{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}, India</div>@endif
            @if($setting?->phone)<div class="brand-info">Tel: {{ $setting->phone }}</div>@endif
        </div>
        <div class="doc-col">
            <div class="doc-main-title">Commercial Document</div>
            <div class="doc-type">TAX INVOICE</div>
            <div class="doc-sub">Subject to Indian Tax Laws &amp; GST Regulations</div>
            <div class="doc-number">{{ $invoice->number }}</div>
        </div>
    </div>

    <div class="flag-strip"></div>

    <div class="meta-row">
        <div class="mr-cell"><span class="mr-label">Invoice Number</span><span class="mr-value">{{ $invoice->number }}</span></div>
        <div class="mr-cell"><span class="mr-label">Invoice Date</span><span class="mr-value">{{ $invoice->date->format('d M Y') }}</span></div>
        @if($invoice->due_date)
        <div class="mr-cell"><span class="mr-label">Due / Payment Date</span><span class="mr-value">{{ $invoice->due_date->format('d M Y') }}</span></div>
        @endif
        <div class="mr-cell"><span class="mr-label">Place of Supply</span><span class="mr-value">{{ $invoice->place_of_supply ?? 'India' }}</span></div>
        <div class="mr-cell"><span class="mr-label">Tax Scheme</span><span class="mr-value">{{ $invoice->is_igst ? 'IGST' : 'CGST + SGST' }}</span></div>
        <div class="mr-cell"><span class="mr-label">Currency</span><span class="mr-value">INR (&#8377;)</span></div>
    </div>

    <div class="currency-note">
        <span class="cn-text"><strong>Currency Note:</strong> All amounts are in Indian Rupees (INR / &#8377;). Exchange rates, if applicable, are as per RBI guidelines on the date of invoice.</span>
    </div>

    <div class="parties-section">
        <div class="party-col shaded">
            <div class="pc-heading">Exporter / Seller</div>
            <div class="pc-name">{{ $setting?->tenant?->name ?? 'Company' }}</div>
            @if($setting?->gstin)<div class="pc-gstin">GSTIN: {{ $setting->gstin }}</div>@endif
            @if($setting?->address)<div class="pc-info">{{ $setting->address }}, {{ $setting->city }}, {{ $setting->state }}</div>@endif
            @if($setting?->phone)<div class="pc-info">Ph: {{ $setting->phone }}</div>@endif
            <div class="pc-country">Country: INDIA</div>
        </div>
        <div class="party-col">
            <div class="pc-heading">Importer / Buyer / Bill To</div>
            <div class="pc-name">{{ $invoice->party->name }}</div>
            @if($invoice->party->gstin)<div class="pc-gstin">GSTIN: {{ $invoice->party->gstin }}</div>@endif
            @if($invoice->party->billing_address)<div class="pc-info">{{ $invoice->party->billing_address }}</div>@endif
            @if($invoice->party->city)<div class="pc-info">{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
            @if($invoice->party->phone)<div class="pc-info">Ph: {{ $invoice->party->phone }}</div>@endif
        </div>
        <div class="party-col">
            <div class="pc-heading">Consignee / Ship To</div>
            <div class="pc-name">{{ $invoice->party->name }}</div>
            @if($invoice->party->billing_address)<div class="pc-info">{{ $invoice->party->billing_address }}</div>@endif
            @if($invoice->party->city)<div class="pc-info">{{ $invoice->party->city }}, {{ $invoice->party->state }}</div>@endif
            @if($invoice->place_of_supply)
            <div class="pc-info" style="margin-top:5px;"><strong>Place of Supply:</strong><br>{{ $invoice->place_of_supply }}</div>
            @endif
        </div>
    </div>

    <div class="body">
        <table>
            <thead>
                <tr>
                    <th style="width:4%">Sr</th>
                    <th style="width:25%">Description of Goods / Services</th>
                    <th style="width:9%">HSN/SAC Code</th>
                    <th class="text-right" style="width:5%">Qty</th>
                    <th class="text-right" style="width:9%">Unit Price (&#8377;)</th>
                    <th class="text-right" style="width:7%">Disc%</th>
                    <th class="text-right" style="width:8%">Taxable Value (&#8377;)</th>
                    @if($invoice->is_igst)
                    <th class="text-right" style="width:9%">IGST Amt (&#8377;)</th>
                    @else
                    <th class="text-right" style="width:8%">CGST (&#8377;)</th>
                    <th class="text-right" style="width:8%">SGST (&#8377;)</th>
                    @endif
                    <th class="text-right" style="width:9%">Total (&#8377;)</th>
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
                    @php
                        $taxable = $item->unit_price * $item->qty;
                        if($item->discount_pct > 0) $taxable -= ($taxable * $item->discount_pct / 100);
                    @endphp
                    <td class="text-right">{{ number_format($taxable, 2) }}</td>
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
    </div>

    <div class="footer-section">
        <div class="fs-notes">
            @if($invoice->notes)
            <div class="fn-heading">Remarks / Notes</div>
            <div class="fn-text" style="margin-bottom:8px;">{{ $invoice->notes }}</div>
            @endif
            @if($setting?->terms_and_conditions)
            <div class="fn-heading">Terms &amp; Conditions</div>
            <div class="fn-text">{{ $setting->terms_and_conditions }}</div>
            @endif
            <div class="fn-heading" style="margin-top:8px;">Declaration</div>
            <div class="fn-text">We declare that this invoice shows the actual price of the goods/services described and that all particulars are true and correct. Subject to Indian Jurisdiction.</div>
        </div>
        <div class="fs-totals">
            <div class="tot-row"><span class="tot-label">Subtotal</span><span class="tot-value">&#8377;{{ number_format($invoice->subtotal, 2) }}</span></div>
            @if($invoice->discount > 0)
            <div class="tot-row tot-discount"><span class="tot-label">Discount</span><span class="tot-value">-&#8377;{{ number_format($invoice->discount, 2) }}</span></div>
            @endif
            @if($invoice->is_igst)
            <div class="tot-row"><span class="tot-label">IGST</span><span class="tot-value">&#8377;{{ number_format($invoice->items->sum('igst'), 2) }}</span></div>
            @else
            <div class="tot-row"><span class="tot-label">CGST</span><span class="tot-value">&#8377;{{ number_format($invoice->items->sum('cgst'), 2) }}</span></div>
            <div class="tot-row"><span class="tot-label">SGST</span><span class="tot-value">&#8377;{{ number_format($invoice->items->sum('sgst'), 2) }}</span></div>
            @endif
            @if($invoice->tcs_amount > 0)
            <div class="tot-row"><span class="tot-label">TCS ({{ $invoice->tcs_rate }}%)</span><span class="tot-value">&#8377;{{ number_format($invoice->tcs_amount, 2) }}</span></div>
            @endif
            <div class="tot-row tot-grand"><span class="tot-label">INVOICE TOTAL</span><span class="tot-value">&#8377;{{ number_format($invoice->total, 2) }}</span></div>
            @if($invoice->amount_paid > 0)
            <div class="tot-row tot-paid"><span class="tot-label">Amount Paid</span><span class="tot-value">&#8377;{{ number_format($invoice->amount_paid, 2) }}</span></div>
            <div class="tot-row tot-balance"><span class="tot-label">Balance Due</span><span class="tot-value">&#8377;{{ number_format($invoice->balance, 2) }}</span></div>
            @endif
        </div>
        <div class="fs-sig">
            <div style="font-size:8px; color:#6c757d; text-align:center; margin-bottom:5px;">For<br><strong style="color:#1a1a2e;">{{ $setting?->tenant?->name ?? 'Company' }}</strong></div>
            @if($setting?->e_signature_path)
            <img src="{{ public_path('storage/' . $setting->e_signature_path) }}" alt="Signature">
            @else
            <div style="height:38px;"></div>
            @endif
            <div class="sig-underline">Authorised Signatory</div>
        </div>
    </div>

    <div class="footer-bar">
        <span>
            @if($setting?->invoice_footer_notes)
            {{ $setting->invoice_footer_notes }}
            @else
            Computer generated document. No signature required.
            @endif
        </span>
        <span>GSTIN: {{ $setting?->gstin ?? 'N/A' }} | {{ $setting?->tenant?->name ?? '' }}</span>
    </div>
</div>

</body>
</html>
