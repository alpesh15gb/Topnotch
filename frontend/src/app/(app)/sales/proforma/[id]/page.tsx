'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowLeft, RefreshCw, Send, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProformaItem {
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

interface ProformaInvoice {
    id: number;
    number: string;
    date: string;
    valid_until: string | null;
    status: 'draft' | 'sent' | 'accepted' | 'converted' | 'cancelled';
    subtotal: number;
    tax_amount: number;
    total: number;
    notes: string | null;
    is_igst: boolean;
    party: { id: number; name: string; gstin: string | null; billing_address: string | null; city: string | null; state: string | null };
    items: ProformaItem[];
}

const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    accepted: 'bg-emerald-100 text-emerald-700',
    converted: 'bg-purple-100 text-purple-700',
    cancelled: 'bg-slate-200 text-slate-500',
};

const fmt = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function ProformaDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: proforma, isLoading, isError } = useQuery<ProformaInvoice>({
        queryKey: ['proforma', id],
        queryFn: () => api.get('/v1/proforma-invoices/' + id).then(r => r.data),
        enabled: !!id,
    });

    const convertMutation = useMutation({
        mutationFn: () => api.post(`/v1/proforma-invoices/${id}/convert`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proforma', id] });
            toast.success('Converted to invoice');
            router.push('/sales/invoices');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to convert'),
    });

    const sendMutation = useMutation({
        mutationFn: () => api.post(`/v1/proforma-invoices/${id}/send`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proforma', id] });
            toast.success('Proforma sent');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to send'),
    });

    const deleteMutation = useMutation({
        mutationFn: () => api.delete('/v1/proforma-invoices/' + id),
        onSuccess: () => {
            toast.success('Proforma deleted');
            router.push('/sales/proforma');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
    });

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" /></div>;
    if (isError || !proforma) return <div className="text-center py-20 text-red-500">Failed to load proforma invoice</div>;

    const cgstTotal = proforma.items.reduce((s, i) => s + Number(i.cgst), 0);
    const sgstTotal = proforma.items.reduce((s, i) => s + Number(i.sgst), 0);
    const igstTotal = proforma.items.reduce((s, i) => s + Number(i.igst), 0);

    const canConvert = proforma.status === 'draft' || proforma.status === 'sent' || proforma.status === 'accepted';
    const canSend = proforma.status === 'draft' || proforma.status === 'sent';

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/sales/proforma" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-slate-800">{proforma.number}</h1>
                            <span className={cn('px-2.5 py-1 text-xs font-semibold rounded-full', statusColors[proforma.status])}>
                                {proforma.status.charAt(0).toUpperCase() + proforma.status.slice(1)}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{proforma.party.name} &middot; {format(new Date(proforma.date), 'dd MMM yyyy')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {proforma.status === 'draft' && (
                        <button
                            onClick={() => { if (confirm('Delete this proforma?')) deleteMutation.mutate(); }}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-rose-300 text-rose-600 bg-white rounded-lg hover:bg-rose-50 transition-colors font-medium text-sm"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    )}
                    {canSend && (
                        <button
                            onClick={() => sendMutation.mutate()}
                            disabled={sendMutation.isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
                        >
                            <Send size={16} />
                            {sendMutation.isPending ? 'Sending...' : 'Send'}
                        </button>
                    )}
                    {canConvert && (
                        <button
                            onClick={() => convertMutation.mutate()}
                            disabled={convertMutation.isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors font-medium text-sm shadow-sm"
                        >
                            <RefreshCw size={16} />
                            {convertMutation.isPending ? 'Converting...' : 'Convert to Invoice'}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-base font-semibold text-slate-800 mb-4">Proforma Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Date</p>
                                <p className="text-slate-800 font-medium mt-1">{format(new Date(proforma.date), 'dd MMM yyyy')}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Valid Until</p>
                                <p className="text-slate-800 font-medium mt-1">{proforma.valid_until ? format(new Date(proforma.valid_until), 'dd MMM yyyy') : '—'}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm font-medium text-slate-500">Customer</p>
                                <p className="text-slate-800 font-medium mt-1">{proforma.party.name}</p>
                                {proforma.party.gstin && <p className="text-sm text-slate-500">GSTIN: {proforma.party.gstin}</p>}
                                {proforma.party.billing_address && <p className="text-sm text-slate-500 mt-0.5">{proforma.party.billing_address}</p>}
                                {(proforma.party.city || proforma.party.state) && (
                                    <p className="text-sm text-slate-500">{[proforma.party.city, proforma.party.state].filter(Boolean).join(', ')}</p>
                                )}
                            </div>
                            {proforma.notes && (
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-slate-500">Notes</p>
                                    <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">{proforma.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
                    <h2 className="text-base font-semibold text-slate-800 mb-4">Summary</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-medium">{fmt(proforma.subtotal)}</span>
                        </div>
                        {proforma.is_igst ? (
                            igstTotal > 0 && <div className="flex justify-between text-slate-500"><span>IGST</span><span>{fmt(igstTotal)}</span></div>
                        ) : (
                            <>
                                {cgstTotal > 0 && <div className="flex justify-between text-slate-500"><span>CGST</span><span>{fmt(cgstTotal)}</span></div>}
                                {sgstTotal > 0 && <div className="flex justify-between text-slate-500"><span>SGST</span><span>{fmt(sgstTotal)}</span></div>}
                            </>
                        )}
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-base font-bold text-slate-800">Grand Total</span>
                            <span className="text-2xl font-bold text-[#F59E0B]">{fmt(proforma.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

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
                            {proforma.items.map((item, idx) => {
                                const taxRate = proforma.is_igst ? item.igst_rate : item.cgst_rate + item.sgst_rate;
                                return (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-slate-800 font-medium">{item.description}</td>
                                        <td className="px-6 py-4 text-right text-slate-600">{item.qty}</td>
                                        <td className="px-6 py-4 text-right text-slate-600">{fmt(item.unit_price)}</td>
                                        <td className="px-6 py-4 text-right text-slate-600">{item.discount_pct > 0 ? `${item.discount_pct}%` : '—'}</td>
                                        <td className="px-6 py-4 text-right text-slate-600">{taxRate > 0 ? `${taxRate}%` : '0%'}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-slate-800">{fmt(item.amount)}</td>
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
