<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\PartyController;
use App\Http\Controllers\Api\V1\ItemController;
use App\Http\Controllers\Api\V1\AccountController;
use App\Http\Controllers\Api\V1\TaxRateController;
use App\Http\Controllers\Api\V1\EstimateController;
use App\Http\Controllers\Api\V1\SaleOrderController;
use App\Http\Controllers\Api\V1\ProformaController;
use App\Http\Controllers\Api\V1\InvoiceController;
use App\Http\Controllers\Api\V1\PurchaseOrderController;
use App\Http\Controllers\Api\V1\PurchaseBillController;
use App\Http\Controllers\Api\V1\ExpenseController;
use App\Http\Controllers\Api\V1\BankAccountController;
use App\Http\Controllers\Api\V1\ChequeController;
use App\Http\Controllers\Api\V1\LoanAccountController;
use App\Http\Controllers\Api\V1\FundTransferController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\GstReportController;
use App\Http\Controllers\Api\V1\CompanySettingController;
use App\Http\Controllers\Api\V1\UserManagementController;
use App\Http\Controllers\Api\V1\BackupController;
use App\Http\Controllers\Api\V1\DebitNoteController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ReceiptController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Public auth routes
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

    // Protected routes (require auth)
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // GSTIN validation (no tenant needed)
        Route::post('/validate-gstin', [PartyController::class, 'validateGSTIN']);

        // Tenant-scoped routes
        Route::middleware(['identify.tenant', 'ensure.tenant.access'])->group(function () {

            // Master data
            Route::apiResource('parties', PartyController::class);

            Route::apiResource('items', ItemController::class);
            Route::post('items/{item}/stock-adjustment', [ItemController::class, 'stockAdjustment']);

            Route::get('accounts/tree', [AccountController::class, 'tree']);
            Route::apiResource('accounts', AccountController::class);

            Route::apiResource('tax-rates', TaxRateController::class);

            // Sales
            Route::apiResource('estimates', EstimateController::class);
            Route::post('estimates/{estimate}/convert', [EstimateController::class, 'convert']);
            Route::post('estimates/{estimate}/send', [EstimateController::class, 'send']);

            Route::apiResource('sale-orders', SaleOrderController::class);

            Route::apiResource('proforma-invoices', ProformaController::class);

            Route::apiResource('invoices', InvoiceController::class);
            Route::post('invoices/{invoice}/payment', [InvoiceController::class, 'recordPayment']);
            Route::get('invoices/{invoice}/pdf', [InvoiceController::class, 'generatePDF']);
            Route::post('invoices/{invoice}/send', [InvoiceController::class, 'send']);

            // Purchases
            Route::apiResource('purchase-orders', PurchaseOrderController::class);

            Route::apiResource('purchase-bills', PurchaseBillController::class);
            Route::post('purchase-bills/{purchaseBill}/payment', [PurchaseBillController::class, 'recordPayment']);

            Route::apiResource('expenses', ExpenseController::class);
            Route::post('expenses/{expense}/receipt', [ExpenseController::class, 'attachReceipt']);

            Route::apiResource('debit-notes', DebitNoteController::class);

            // Cash & Bank
            Route::apiResource('bank-accounts', BankAccountController::class);
            Route::post('bank-accounts/{bankAccount}/reconcile', [BankAccountController::class, 'reconcile']);

            Route::apiResource('cheques', ChequeController::class);

            Route::apiResource('loans', LoanAccountController::class);

            Route::apiResource('fund-transfers', FundTransferController::class);

            // Banking payments & receipts
            Route::get('payments', [PaymentController::class, 'index']);
            Route::post('payments', [PaymentController::class, 'store']);
            Route::get('payments/{vendorPayment}', [PaymentController::class, 'show']);
            Route::delete('payments/{vendorPayment}', [PaymentController::class, 'destroy']);

            Route::get('receipts', [ReceiptController::class, 'index']);
            Route::get('receipts/{receipt}', [ReceiptController::class, 'show']);

            // Reports
            Route::prefix('reports')->group(function () {
                Route::get('sales/summary', [ReportController::class, 'salesSummary']);
                Route::get('sales/outstanding', [ReportController::class, 'outstandingReceivables']);
                Route::get('purchases/summary', [ReportController::class, 'purchaseSummary']);
                Route::get('purchases/outstanding', [ReportController::class, 'outstandingPayables']);
                Route::get('daybook', [ReportController::class, 'daybook']);
                Route::get('profit-loss', [ReportController::class, 'profitLoss']);
                Route::get('balance-sheet', [ReportController::class, 'balanceSheet']);
                Route::get('cash-flow', [ReportController::class, 'cashFlow']);
                Route::get('party-statement/{party}', [ReportController::class, 'partyStatement']);

                // GST
                Route::get('gst/gstr1', [GstReportController::class, 'gstr1']);
                Route::get('gst/gstr2', [GstReportController::class, 'gstr2']);
                Route::get('gst/gstr3b', [GstReportController::class, 'gstr3b']);
                Route::get('gst/hsn-summary', [GstReportController::class, 'hsnSummary']);
                Route::get('gst/export', [GstReportController::class, 'exportJson']);
            });

            // Settings
            Route::get('settings/company', [CompanySettingController::class, 'show']);
            Route::put('settings/company', [CompanySettingController::class, 'update']);
            Route::post('settings/company/logo', [CompanySettingController::class, 'uploadLogo']);
            Route::post('settings/company/signature', [CompanySettingController::class, 'uploadESignature']);

            Route::apiResource('users', UserManagementController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::get('users/activity-log', [UserManagementController::class, 'activityLog']);

            // Backup
            Route::get('backups', [BackupController::class, 'index']);
            Route::post('backups/local', [BackupController::class, 'triggerLocal']);
            Route::post('backups/google-drive', [BackupController::class, 'triggerGoogleDrive']);
            Route::get('backups/{backup}/download', [BackupController::class, 'download']);
        });
    });
});
