'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowLeft, Trash2, FileText, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface POItem {
    description: string;
    qty: number;
    unit_price: number;
    amount: number;
}

interface PurchaseOrder {
    id: number;
    number: string;
    date: string;
    expected_date: string | null;
    status: 'draft' | 'sent' | 'received' | 'cancelled';
    subtotal: number;
    total: number;
    notes: string | null;
    party: { id: number; name: string; gstin: string | null; billing_address: string | null; city: string | null; state: string | null };
    items: POItem[];
}

const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    received: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-slate-200 text-slate-500',
};

const fmt = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function PurchaseOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: po, isLoading, isError } = useQuery<PurchaseOrder>({
        queryKey: ['purchase_order', id],
        queryFn: () => api.get('/v1/purchase-orders/' + id).then(r => r.data),
        enabled: !!id,
    });

    const convertMutation = useMutation({
        mutationFn: () => api.post(`/v1/purchase-orders/${id}/convert`),
        onSuccess: () => {
            toast.success('Converted to purchase bill');
            router.push('/purchases/bills');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to convert'),
    });

    const deleteMutation = useMutation({
        mutationFn: () => api.delete('/v1/purchase-orders/' + id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchase_orders'] });
            toast.success('Purchase order deleted');
            router.push('/purchases/purchase-orders');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
    });

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" /></div>;
    if (isError || !po) return <div className="text-center py-20 text-red-500">Failed to load purchase order</div>;

    const canConvert = po.status === 'draft' || po.status === 'sent';

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/purchases/purchase-orders" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-slate-800">{po.number}</h1>
                            <span className={cn('px-2.5 py-1 text-xs font-semibold rounded-full', statusColors[po.status])}>
                                {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{po.party.name} &middot; {format(new Date(po.date), 'dd MMM yyyy')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {po.status === 'draft' && (
                        <button
                            onClick={() => { if (confirm('Delete this purchase order?')) deleteMutation.mutate(); }}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-rose-300 text-rose-600 bg-white rounded-lg hover:bg-rose-50 transition-colors font-medium text-sm"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    )}
                    {canConvert && (
                        <button
                            onClick={() => convertMutation.mutate()}
                            disabled={convertMutation.isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors font-medium text-sm shadow-sm"
                        >
                            <RefreshCw size={16} />
                            {convertMutation.isPending ? 'Converting...' : 'Convert to Bill'}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-base font-semibold text-slate-800 mb-4">Order Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Order Date</p>
                                <p className="text-slate-800 font-medium mt-1">{format(new Date(po.date), 'dd MMM yyyy')}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Expected Delivery</p>
                                <p className="text-slate-800 font-medium mt-1">{po.expected_date ? format(new Date(po.expected_date), 'dd MMM yyyy') : '—'}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm font-medium text-slate-500">Supplier</p>
                                <p className="text-slate-800 font-medium mt-1">{po.party.name}</p>
                                {po.party.gstin && <p className="text-sm text-slate-500">GSTIN: {po.party.gstin}</p>}
                                {po.party.billing_address && <p className="text-sm text-slate-500 mt-0.5">{po.party.billing_address}</p>}
                                {(po.party.city || po.party.state) && (
                                    <p className="text-sm text-slate-500">{[po.party.city, po.party.state].filter(Boolean).join(', ')}</p>
                                )}
                            </div>
                            {po.notes && (
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-slate-500">Notes / Terms</p>
                                    <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">{po.notes}</p>
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
                            <span className="font-medium">{fmt(po.subtotal)}</span>
                        </div>
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-base font-bold text-slate-800">Total</span>
                            <span className="text-2xl font-bold text-[#F59E0B]">{fmt(po.total)}</span>
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
                                <th className="px-6 py-3 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {po.items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-slate-800 font-medium">{item.description}</td>
                                    <td className="px-6 py-4 text-right text-slate-600">{item.qty}</td>
                                    <td className="px-6 py-4 text-right text-slate-600">{fmt(item.unit_price)}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-slate-800">{fmt(item.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
