'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowLeft, FileText, Send, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EstimateItem {
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

interface Estimate {
    id: number;
    number: string;
    date: string;
    expiry_date: string | null;
    status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
    subtotal: number;
    tax_amount: number;
    total: number;
    notes: string | null;
    is_igst: boolean;
    party: {
        id: number;
        name: string;
        gstin: string | null;
        billing_address: string | null;
        city: string | null;
        state: string | null;
    };
    items: EstimateItem[];
}

const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    accepted: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-rose-100 text-rose-700',
    expired: 'bg-amber-100 text-amber-700',
};

const statusLabels: Record<string, string> = {
    draft: 'Draft',
    sent: 'Sent',
    accepted: 'Accepted',
    rejected: 'Rejected',
    expired: 'Expired',
};

const fmt = (n: number) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function EstimateDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: estimate, isLoading, isError } = useQuery<Estimate>({
        queryKey: ['estimate', id],
        queryFn: () => api.get('/v1/estimates/' + id).then(r => r.data),
        enabled: !!id,
    });

    const convertMutation = useMutation({
        mutationFn: () => api.post(`/v1/estimates/${id}/convert`, { type: 'invoice' }),
        onSuccess: () => {
            toast.success('Estimate converted to invoice successfully');
            router.push('/sales/invoices');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to convert estimate');
        },
    });

    const sendMutation = useMutation({
        mutationFn: () => api.post(`/v1/estimates/${id}/send`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['estimate', id] });
            toast.success('Estimate sent successfully');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to send estimate');
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" />
            </div>
        );
    }

    if (isError || !estimate) {
        return <div className="text-center py-20 text-red-500">Failed to load data</div>;
    }

    const cgstTotal = estimate.items.reduce((s, i) => s + Number(i.cgst), 0);
    const sgstTotal = estimate.items.reduce((s, i) => s + Number(i.sgst), 0);
    const igstTotal = estimate.items.reduce((s, i) => s + Number(i.igst), 0);

    const canConvert = estimate.status === 'draft' || estimate.status === 'sent' || estimate.status === 'accepted';
    const canSend = estimate.status === 'draft' || estimate.status === 'sent';

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/sales/estimates"
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-slate-800">{estimate.number}</h1>
                            <span className={cn(
                                'px-2.5 py-1 text-xs font-semibold rounded-full',
                                statusColors[estimate.status]
                            )}>
                                {statusLabels[estimate.status]}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {estimate.party.name} &middot; {format(new Date(estimate.date), 'dd MMM yyyy')}
                            {estimate.expiry_date && (
                                <span className="ml-2 text-slate-400">
                                    (Expires: {format(new Date(estimate.expiry_date), 'dd MMM yyyy')})
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {canSend && (
                        <button
                            onClick={() => sendMutation.mutate()}
                            disabled={sendMutation.isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm disabled:opacity-60"
                        >
                            <Send size={16} />
                            {sendMutation.isPending ? 'Sending...' : 'Send'}
                        </button>
                    )}
                    {canConvert && (
                        <button
                            onClick={() => convertMutation.mutate()}
                            disabled={convertMutation.isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors font-medium text-sm shadow-sm disabled:opacity-60"
                        >
                            <RefreshCw size={16} />
                            {convertMutation.isPending ? 'Converting...' : 'Convert to Invoice'}
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content: Details + Totals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Estimate Details */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-base font-semibold text-slate-800 mb-4">Estimate Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Date</p>
                                <p className="text-slate-800 font-medium mt-1">
                                    {format(new Date(estimate.date), 'dd MMM yyyy')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Expiry Date</p>
                                <p className="text-slate-800 font-medium mt-1">
                                    {estimate.expiry_date
                                        ? format(new Date(estimate.expiry_date), 'dd MMM yyyy')
                                        : '—'}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm font-medium text-slate-500">Customer</p>
                                <p className="text-slate-800 font-medium mt-1">{estimate.party.name}</p>
                                {estimate.party.gstin && (
                                    <p className="text-sm text-slate-500">GSTIN: {estimate.party.gstin}</p>
                                )}
                                {estimate.party.billing_address && (
                                    <p className="text-sm text-slate-500 mt-0.5">{estimate.party.billing_address}</p>
                                )}
                                {(estimate.party.city || estimate.party.state) && (
                                    <p className="text-sm text-slate-500">
                                        {[estimate.party.city, estimate.party.state].filter(Boolean).join(', ')}
                                    </p>
                                )}
                            </div>
                            {estimate.notes && (
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-slate-500">Notes</p>
                                    <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">{estimate.notes}</p>
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
                            <span className="font-medium text-slate-800">{fmt(estimate.subtotal)}</span>
                        </div>
                        {estimate.is_igst ? (
                            igstTotal > 0 && (
                                <div className="flex justify-between text-slate-500">
                                    <span>IGST</span>
                                    <span>{fmt(igstTotal)}</span>
                                </div>
                            )
                        ) : (
                            <>
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
                            </>
                        )}
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-base font-bold text-slate-800">Grand Total</span>
                            <span className="text-2xl font-bold text-[#F59E0B]">{fmt(estimate.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Items Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                    <FileText size={16} className="text-slate-400" />
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
                            {estimate.items.map((item, idx) => {
                                const taxRate = estimate.is_igst
                                    ? item.igst_rate
                                    : item.cgst_rate + item.sgst_rate;
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
        </div>
    );
}
