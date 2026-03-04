<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Estimate;
use App\Models\SaleOrder;
use App\Models\ProformaInvoice;
use App\Models\PurchaseOrder;
use App\Models\PurchaseBill;
use Illuminate\Support\Facades\DB;

class NumberingService
{
    public function generateInvoiceNumber(string $prefix = 'INV', int $year = null): string
    {
        $year = $year ?? date('Y');
        $count = Invoice::whereYear('created_at', $year)->count() + 1;
        return sprintf('%s/%s/%04d', $prefix, $year, $count);
    }

    public function generateEstimateNumber(): string
    {
        $year = date('Y');
        $count = Estimate::whereYear('created_at', $year)->count() + 1;
        return sprintf('EST/%s/%04d', $year, $count);
    }

    public function generateSaleOrderNumber(): string
    {
        $year = date('Y');
        $count = SaleOrder::whereYear('created_at', $year)->count() + 1;
        return sprintf('SO/%s/%04d', $year, $count);
    }

    public function generateProformaNumber(): string
    {
        $year = date('Y');
        $count = ProformaInvoice::whereYear('created_at', $year)->count() + 1;
        return sprintf('PI/%s/%04d', $year, $count);
    }

    public function generatePurchaseOrderNumber(): string
    {
        $year = date('Y');
        $count = PurchaseOrder::whereYear('created_at', $year)->count() + 1;
        return sprintf('PO/%s/%04d', $year, $count);
    }

    public function generatePurchaseBillNumber(): string
    {
        $year = date('Y');
        $count = PurchaseBill::whereYear('created_at', $year)->count() + 1;
        return sprintf('BILL/%s/%04d', $year, $count);
    }
}
