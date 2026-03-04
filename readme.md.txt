🏦 TopNotch Accounting — Full Stack App Prompt

PROJECT OVERVIEW
Build TopNotch — a multi-tenant, bank-grade accounting and business management platform with web + mobile apps. Think Tally meets Zoho Books meets a modern fintech product. Designed for SMBs in India with GST compliance built-in.

TECH STACK RECOMMENDATION
Backend:

Laravel 11 (API-first, REST + WebSocket)
PostgreSQL — multi-tenant with schema-per-tenant isolation
Redis — caching, queues, sessions
Laravel Sanctum — auth tokens for web + mobile
Laravel Horizon — queue monitoring
Spatie/Laravel-Permission — roles & permissions per tenant

Web Frontend:

Next.js 14 (App Router) + TypeScript
Tailwind CSS + shadcn/ui
Zustand — state management
React Query (TanStack) — server state, caching
Recharts / ApexCharts — financial graphs

Mobile App:

React Native (Expo) — iOS + Android
NativeWind — Tailwind for React Native
React Navigation — bottom tabs + stack navigation
Offline-first with WatermelonDB + background sync

Invoice PDF Generation:

Puppeteer or wkhtmltopdf (server-side)
10–15 pre-built Blade/HTML templates

Backups:

Google Drive API — automated daily backups per tenant
Local backup — downloadable ZIP (DB + attachments)

Hosting:

Docker + Docker Compose
Nginx reverse proxy
Can run on Hostinger KVM VPS


MULTI-TENANCY ARCHITECTURE

Each business = 1 tenant with a unique subdomain (acme.topnotch.app)
PostgreSQL schema-per-tenant for complete data isolation
Tenant onboarding: Register → Create Company → Auto-provision schema
Super Admin panel to manage all tenants
Each tenant has: Owner, Admin, Accountant, Viewer roles
Tenant-level settings: currency, GST number, logo, fiscal year, invoice prefix


MODULE 1 — SALES
1.1 Estimates

Create estimates with line items (product/service, qty, rate, discount, tax)
Status: Draft → Sent → Accepted → Rejected → Expired
Convert to: Invoice / Sale Order / Proforma Invoice (1-click conversion, carry all data)
Email estimate as PDF to customer
Expiry date with auto-status update

1.2 Sale Orders

Internal confirmation before fulfillment
Status: Draft → Confirmed → Partially Invoiced → Fully Invoiced → Cancelled
Convert to: Invoice (partial or full)
Link to estimate if originated from one
Track pending quantities

1.3 Proforma Invoice

Pre-invoice document for advance payment requests
Convert to: Invoice (1-click)
Not posted to accounts until converted
Useful for customs/export

1.4 Sales Invoice

Full GST invoice with CGST/SGST/IGST auto-calculation based on party state
Invoice numbering: auto-sequential, customizable prefix (e.g., INV-2024-001)
Multi-item with HSN/SAC codes
Discount: item-level + invoice-level
TCS support
Payment terms: Due date, partial payment tracking
Status: Draft → Posted → Partially Paid → Paid → Overdue → Cancelled
10–15 invoice templates (selector before download/print)
Recurring invoice support
E-Invoice (IRN generation) ready structure
WhatsApp share + Email + Direct print

Invoice Templates (15 designs):

Classic Clean (white, minimal)
Executive Dark (dark header, gold accents)
Modern Gradient (blue-purple header)
GST Compliant (government-style format)
Boutique (elegant serif, cream background)
Tech Startup (monospace, dark mode)
Retail Receipt (compact, barcode-ready)
Service Pro (orange accent, clean lines)
Agency Creative (asymmetric, bold typography)
Industrial (gray, structured, heavy borders)
Export/International (dual currency, clean)
Medical/Healthcare (green, professional)
Construction (blueprint style)
Restaurant/Hospitality (warm, elegant)
Minimal Ink (ultra-minimal, black/white only)


MODULE 2 — PURCHASES
2.1 Purchase Bills

Record supplier invoices
Link to Purchase Orders (3-way matching: PO → GRN → Bill)
GSTR-2 data capture (supplier GSTIN, invoice date, tax breakup)
ITC (Input Tax Credit) eligibility flag per line
Payment tracking (due date, partial payments)
Status: Draft → Posted → Partially Paid → Paid → Overdue

2.2 Purchase Orders

Send POs to suppliers
Status: Draft → Sent → Partially Received → Fully Received → Cancelled
Convert to Purchase Bill on receipt
Item-wise pending qty tracking

2.3 Expenses

Non-inventory business expenses (travel, utilities, rent, etc.)
Category-wise (create custom categories)
Attach receipt photos (mobile camera capture)
Reimbursable vs. direct expense
Link to bank/cash account
Recurring expense support
Mileage tracking option


MODULE 3 — CASH, BANK, CHEQUES & LOANS
3.1 Bank Accounts

Add multiple bank accounts per tenant
Opening balance entry
Manual transaction entry (credit/debit)
Bank reconciliation (match transactions to entries)
Statement upload (CSV/OFX import)
Running balance display

3.2 Cash Accounts

Petty cash management
Multiple cash accounts (branch-wise)
Cash flow tracking

3.3 Cheque Management

Cheques Issued (against payments)
Cheques Received (from customers)
Status tracking: Issued → Cleared / Bounced / Cancelled
Bounce charges entry
Post-dated cheque (PDC) reminders
Cheque register report

3.4 Loan Accounts

Track business loans (bank loans, director loans, etc.)
EMI schedule with auto-entries
Principal vs. interest breakup
Outstanding balance tracking
Prepayment handling

3.5 Fund Transfers

Transfer between bank ↔ cash ↔ loan accounts
Double-entry auto-posting


MODULE 4 — REPORTS
All reports: filterable by date range, party, account, branch; exportable to PDF + Excel.
4.1 Sales Reports

Sales Summary (by period, by party, by item, by salesperson)
Invoice-wise sales register
Outstanding receivables (aging: 0-30, 31-60, 61-90, 90+ days)
Sales return summary
Top customers by revenue
Item-wise sales analysis

4.2 Purchase Reports

Purchase summary (by period, by supplier, by item)
Bill-wise purchase register
Outstanding payables (aging buckets)
Expense category analysis
ITC summary

4.3 Daybook (Journal)

All daily transactions in chronological order
Filter by account, voucher type, amount range
Printable daily summary

4.4 Profit & Loss Statement

Revenue vs. Expenses
Gross Profit / Net Profit
Period comparison (this month vs. last month, this year vs. last year)
Category-wise breakdown
Export to PDF (CA-friendly format)

4.5 Party Statement

Customer/Supplier ledger
Opening balance → transactions → closing balance
Shareable with party (email/WhatsApp)
Printable statement format

4.6 GST Reports

GSTR-1: Outward supplies (B2B, B2C, exports, amendments) — JSON export for portal upload
GSTR-2 (GSTR-2B reconciliation): Inward supplies, ITC matching
GSTR-3B: Summary return — auto-calculated from data, JSON export
GSTR-9: Annual return summary — aggregated data
HSN Summary report
Tax liability statement

4.7 Balance Sheet

Assets vs. Liabilities
Capital accounts
Snapshot by date

4.8 Cash Flow Statement

Operating / Investing / Financing activities
Monthly cash flow trend chart


MODULE 5 — MASTER DATA

Parties (Customers + Suppliers): GSTIN validation, state, credit limit, payment terms, opening balance
Items/Products: HSN/SAC, unit, tax rate, sale price, purchase price, stock tracking (basic)
Chart of Accounts: Standard Indian COA, customizable, grouped (Assets/Liabilities/Income/Expense)
Tax Rates: GST slabs (0%, 5%, 12%, 18%, 28%), cess, TDS, TCS
Units of Measure: pcs, kg, ltr, mtr, box, etc.
Warehouses/Branches: Multi-location support


MODULE 6 — SETTINGS & CONFIGURATION
Company Settings:

Logo, name, address, GSTIN, PAN, CIN
Fiscal year start (April or January)
Currency & decimal places
Invoice prefix/numbering format
Default tax, default payment terms
E-signature upload for invoices

User & Role Management:

Invite team members via email
Roles: Owner, Admin, Accountant, Sales, Viewer
Module-level permissions (can view/create/edit/delete)
Activity log (who did what, when)

Notification Settings:

Payment due reminders (email + push)
Cheque clearance reminders
Low stock alerts
GST filing deadline reminders


MODULE 7 — BACKUP SYSTEM
Google Drive Backup:

OAuth2 connection per tenant
Scheduled: Daily, Weekly, Monthly
Backup includes: Full DB export (SQL) + uploaded attachments (ZIP)
Stored in tenant's own Google Drive folder: TopNotch Backups/[CompanyName]/
View backup history, restore trigger (manual)

Local Backup:

Download full backup ZIP from Settings
Includes SQL dump + media files
Password-protected ZIP option


MODULE 8 — MOBILE APP (React Native)
Mobile-specific UX:

Bottom tab navigation: Dashboard, Sales, Purchase, Cash/Bank, Reports
Quick actions floating button: New Invoice, New Expense, New Receipt
Dashboard: Today's sales, pending payments, cash balance — all at a glance
Offline-first: Create invoices, expenses offline → sync when connected
Push notifications: Payment reminders, overdue alerts
Receipt scanning: Camera → attach to expense
Invoice share: PDF preview → WhatsApp/Email directly
Biometric login (Face ID / fingerprint)
Dark mode support


UI/UX DESIGN DIRECTION
Web App:

Left sidebar navigation (collapsible)
Top bar: company switcher, notifications, user menu
Clean, data-dense tables with inline actions
Card-based dashboard with KPI widgets
Color theme: Deep navy + crisp white + amber accents (financial authority)
Consistent 8px grid spacing
Skeleton loaders, optimistic UI updates

Mobile App:

Native feel, not a web wrapper
Large touch targets (minimum 48px)
Swipe gestures for quick actions
Bottom sheets instead of modals
Compact data tables with horizontal scroll
Summary cards before detail lists


DATABASE SCHEMA HIGHLIGHTS
tenants, tenant_settings
users, roles, permissions, user_tenant
parties (customers + suppliers unified)
items, item_units, item_categories
accounts (chart of accounts)
tax_rates
vouchers (master table for all transactions)
voucher_items
invoices, invoice_items, invoice_payments
purchase_bills, purchase_bill_items
expenses
bank_accounts, bank_transactions
cheques
loan_accounts, loan_emi_schedule
gst_data (GSTR-1/2/3B staging tables)
backups
activity_log

API ARCHITECTURE

RESTful API: /api/v1/ prefix
Tenant identification via subdomain or X-Tenant-ID header
JWT tokens (Laravel Sanctum)
Rate limiting per tenant
Webhook support for payment gateway integration
Pagination, filtering, sorting on all list endpoints
API versioning


DEPLOYMENT
yaml# docker-compose.yml services:
- app (Laravel + PHP-FPM)
- web (Next.js)
- nginx
- postgres
- redis
- worker (Laravel queue)
- scheduler (Laravel cron)

PHASE ROADMAP
PhaseScopePhase 1Auth, Multi-tenancy, Masters, Sales (Invoice + Estimate)Phase 2Purchase, Cash/Bank, Cheques, Basic ReportsPhase 3GST Reports, Loans, Advanced Reports, BackupPhase 4Mobile App (React Native), Invoice TemplatesPhase 5E-Invoice, WhatsApp integration, API webhooks

This prompt is ready to hand directly to a dev team, use with an AI coding agent, or break into individual sprint tickets. Want me to generate the database schema SQL, Laravel boilerplate structure, or the Next.js project scaffold next?