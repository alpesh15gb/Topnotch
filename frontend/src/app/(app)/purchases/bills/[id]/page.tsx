'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowLeft, Download, CreditCard, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BillItem {
    description: string;
    qty: number;
    unit_price: number;
    discount_pct: number;
    cgst_rate: number;
    sgst_rate: number;
    igst_rate: number;
    cgst: number;
    sgst: number;
    igst: number;
    amount: number;
}

interface Payment {
    id: number;
    date: string;
    amount: number;
    method: string;
    reference: string | null;
}

interface PurchaseBill {
    id: number;
    number: string;
    date: string;
    due_date: string | null;
    status: 'draft' | 'posted' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
    supplier_invoice_no: string | null;
    itc_eligible: boolean;
    subtotal: number;
    discount: number;
    tax_amount: number;
    total: number;
    amount_paid: number;
    balance: number;
    notes: string | null;
    party: {
        name: string;
        gstin: string | null;
        billing_address: string | null;
        city: string | null;
        state: string | null;
    };
    items: BillItem[];
    payments: Payment[];
}

interface BankAccount {
    id: number;
    name: string;
    account_number: string | null;
}

const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    posted: 'bg-blue-100 text-blue-700',
    partially_paid: 'bg-amber-100 text-amber-700',
    paid: 'bg-emerald-100 text-emerald-700',
    overdue: 'bg-rose-100 text-rose-700',
    cancelled: 'bg-slate-200 text-slate-500',
};

const statusLabels: Record<string, string> = {
    draft: 'Draft',
    posted: 'Posted',
    partially_paid: 'Partially Paid',
    paid: 'Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled',
};

const fmt = (n: number) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

const paymentMethods = ['cash', 'bank', 'cheque', 'upi', 'neft', 'rtgs'];

export default function PurchaseBillDetailPage() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const today = new Date().toISOString().split('T')[0];

    const [paymentForm, setPaymentForm] = useState({
        date: today,
        amount: '',
        method: 'cash',
        reference: '',
        account_id: '',
        notes: '',
    });

    const { data: bill, isLoading, isError } = useQuery<PurchaseBill>({
        queryKey: ['purchase_bill', id],
        queryFn: () => api.get('/v1/purchase-bills/' + id).then(r => r.data),
        enabled: !!id,
    });

    const { data: bankAccounts } = useQuery<BankAccount[]>({
        queryKey: ['bank-accounts'],
        queryFn: () => api.get('/v1/bank-accounts').then(r => r.data),
    });

    const paymentMutation = useMutation({
        mutationFn: (payload: typeof paymentForm) =>
            api.post(`/v1/purchase-bills/${id}/payment`, {
                ...payload,
                amount: Number(payload.amount),
                account_id: payload.account_id ? Number(payload.account_id) : null,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchase_bill', id] });
            setShowPaymentModal(false);
            toast.success('Payment recorded successfully');
            setPaymentForm({ date: today, amount: '', method: 'cash', reference: '', account_id: '', notes: '' });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to record payment');
        },
    });

    const openPaymentModal = () => {
        setPaymentForm(prev => ({
            ...prev,
            amount: bill?.balance ? String(bill.balance) : '',
        }));
        setShowPaymentModal(true);
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        paymentMutation.mutate(paymentForm);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" />
            </div>
        );
    }

    if (isError || !bill) {
        return <div className="text-center py-20 text-red-500">Failed to load data</div>;
    }

    const cgstTotal = bill.items.reduce((s, i) => s + Number(i.cgst), 0);
    const sgstTotal = bill.items.reduce((s, i) => s + Number(i.sgst), 0);

    const canRecordPayment = bill.status !== 'draft' && bill.status !== 'cancelled' && bill.status !== 'paid';

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/purchases/bills"
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-slate-800">{bill.number}</h1>
                            <span className={cn(
                                'px-2.5 py-1 text-xs font-semibold rounded-full',
                                statusColors[bill.status]
                            )}>
                                {statusLabels[bill.status]}
                            </span>
                            {bill.itc_eligible && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                                    <CheckCircle size={12} />
                                    ITC Eligible
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {bill.party.name} &middot; {format(new Date(bill.date), 'dd MMM yyyy')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <a
                        href={`/api/v1/purchase-bills/${id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
                    >
                        <Download size={16} />
                        Download PDF
                    </a>
                    {canRecordPayment && (
                        <button
                            onClick={openPaymentModal}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium text-sm shadow-sm"
                        >
                            <CreditCard size={16} />
                            Record Payment
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content: Details + Totals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Bill Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-base font-semibold text-slate-800 mb-4">Bill Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Bill Date</p>
                                <p className="text-slate-800 font-medium mt-1">
                                    {format(new Date(bill.date), 'dd MMM yyyy')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Due Date</p>
                                <p className="text-slate-800 font-medium mt-1">
                                    {bill.due_date ? format(new Date(bill.due_date), 'dd MMM yyyy') : '—'}
                                </p>
                            </div>
                            {bill.supplier_invoice_no && (
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Supplier Invoice No.</p>
                                    <p className="text-slate-800 font-medium mt-1">{bill.supplier_invoice_no}</p>
                                </div>
                            )}
                            <div className="col-span-2">
                                <p className="text-sm font-medium text-slate-500">Supplier</p>
                                <p className="text-slate-800 font-medium mt-1">{bill.party.name}</p>
                                {bill.party.gstin && (
                                    <p className="text-sm text-slate-500">GSTIN: {bill.party.gstin}</p>
                                )}
                                {bill.party.billing_address && (
                                    <p className="text-sm text-slate-500 mt-0.5">{bill.party.billing_address}</p>
                                )}
                                {(bill.party.city || bill.party.state) && (
                                    <p className="text-sm text-slate-500">
                                        {[bill.party.city, bill.party.state].filter(Boolean).join(', ')}
                                    </p>
                                )}
                            </div>
                            {bill.notes && (
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-slate-500">Notes</p>
                                    <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">{bill.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Totals */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
                    <h2 className="text-base font-semibold text-slate-800 mb-4">Summary</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-medium text-slate-800">{fmt(bill.subtotal)}</span>
                        </div>
                        {Number(bill.discount) > 0 && (
                            <div className="flex justify-between text-slate-600">
                                <span>Discount</span>
                                <span className="font-medium text-rose-600">- {fmt(bill.discount)}</span>
                            </div>
                        )}
                        {cgstTotal > 0 && (
                            <div className="flex justify-between text-slate-500">
                                <span>CGST</span>
                                <span>{fmt(cgstTotal)}</span>
                            </div>
                        )}
                        {sgstTotal > 0 && (
                            <div className="flex justify-between text-slate-500">
                                <span>SGST</span>
                                <span>{fmt(sgstTotal)}</span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-base font-bold text-slate-800">Grand Total</span>
                            <span className="text-2xl font-bold text-[#F59E0B]">{fmt(bill.total)}</span>
                        </div>
                        {Number(bill.amount_paid) > 0 && (
                            <>
                                <div className="flex justify-between text-emerald-600">
                                    <span>Amount Paid</span>
                                    <span className="font-medium">- {fmt(bill.amount_paid)}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-slate-800 pt-2 border-t border-slate-100">
                                    <span>Balance Due</span>
                                    <span className={bill.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                                        {fmt(bill.balance)}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Line Items Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h2 className="text-base font-semibold text-slate-800">Line Items</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                <th className="px-6 py-3 font-medium">Description</th>
                                <th className="px-6 py-3 font-medium text-right">Qty</th>
                                <th className="px-6 py-3 font-medium text-right">Rate</th>
                                <th className="px-6 py-3 font-medium text-right">Disc%</th>
                                <th className="px-6 py-3 font-medium text-right">Tax</th>
                                <th className="px-6 py-3 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {bill.items.map((item, idx) => {
                                const taxRate = item.cgst_rate + item.sgst_rate;
                                return (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-slate-800 font-medium">{item.description}</td>
                                        <td className="px-6 py-4 text-right text-slate-600">{item.qty}</td>
                                        <td className="px-6 py-4 text-right text-slate-600">{fmt(item.unit_price)}</td>
                                        <td className="px-6 py-4 text-right text-slate-600">
                                            {item.discount_pct > 0 ? `${item.discount_pct}%` : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-600">
                                            {taxRate > 0 ? `${taxRate}%` : '0%'}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-slate-800">
                                            {fmt(item.amount)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h2 className="text-base font-semibold text-slate-800">Payment History</h2>
                </div>
                {bill.payments.length === 0 ? (
                    <div className="px-6 py-10 text-center text-slate-400 text-sm">No payments recorded</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium">Method</th>
                                    <th className="px-6 py-3 font-medium">Reference</th>
                                    <th className="px-6 py-3 font-medium text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bill.payments.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-3 text-slate-700">
                                            {format(new Date(p.date), 'dd MMM yyyy')}
                                        </td>
                                        <td className="px-6 py-3 text-slate-600 capitalize">{p.method}</td>
                                        <td className="px-6 py-3 text-slate-500">{p.reference || '—'}</td>
                                        <td className="px-6 py-3 text-right font-semibold text-emerald-600">
                                            {fmt(p.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Record Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800">Record Payment</h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={paymentForm.date}
                                    onChange={e => setPaymentForm(p => ({ ...p, date: e.target.value }))}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={paymentForm.amount}
                                    onChange={e => setPaymentForm(p => ({ ...p, amount: e.target.value }))}
                                    required
                                    placeholder={`Balance: ${fmt(bill.balance)}`}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                                <select
                                    value={paymentForm.method}
                                    onChange={e => setPaymentForm(p => ({ ...p, method: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none bg-white text-sm"
                                >
                                    {paymentMethods.map(m => (
                                        <option key={m} value={m}>{m.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            {bankAccounts && bankAccounts.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bank Account</label>
                                    <select
                                        value={paymentForm.account_id}
                                        onChange={e => setPaymentForm(p => ({ ...p, account_id: e.target.value }))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none bg-white text-sm"
                                    >
                                        <option value="">Select Account (optional)</option>
                                        {bankAccounts.map(a => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}{a.account_number ? ` - ${a.account_number}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reference / Cheque No.</label>
                                <input
                                    type="text"
                                    value={paymentForm.reference}
                                    onChange={e => setPaymentForm(p => ({ ...p, reference: e.target.value }))}
                                    placeholder="Transaction ID, cheque number..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                                <textarea
                                    value={paymentForm.notes}
                                    onChange={e => setPaymentForm(p => ({ ...p, notes: e.target.value }))}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none text-sm resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentModal(false)}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={paymentMutation.isPending}
                                    className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium text-sm disabled:opacity-60 transition-colors"
                                >
                                    {paymentMutation.isPending ? 'Saving...' : 'Record Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
