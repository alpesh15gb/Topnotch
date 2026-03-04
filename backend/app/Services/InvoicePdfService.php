<?php

namespace App\Services;

use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoicePdfService
{
    private array $templateNames = [
        1 => 'classic',
        2 => 'executive-dark',
        3 => 'modern-gradient',
        4 => 'gst-compliant',
        5 => 'boutique',
        6 => 'tech-startup',
        7 => 'retail-receipt',
        8 => 'service-pro',
        9 => 'agency-creative',
        10 => 'industrial',
        11 => 'export-international',
        12 => 'medical',
        13 => 'construction',
        14 => 'restaurant',
        15 => 'minimal-ink',
    ];

    public function generatePDF(Invoice $invoice, int $templateId = 1): \Barryvdh\DomPDF\PDF
    {
        $invoice->load(['party', 'items.item', 'items.taxRate', 'payments']);

        $templateName = $this->templateNames[$templateId] ?? 'classic';

        $pdf = Pdf::loadView("invoices.templates.{$templateName}", [
            'invoice' => $invoice,
            'setting' => app('current_tenant')?->setting,
        ]);

        $pdf->setPaper('A4', 'portrait');

        return $pdf;
    }

    public function getTemplateList(): array
    {
        return collect($this->templateNames)->map(function ($name, $id) {
            return [
                'id' => $id,
                'name' => $name,
                'label' => ucwords(str_replace('-', ' ', $name)),
            ];
        })->values()->toArray();
    }
}
