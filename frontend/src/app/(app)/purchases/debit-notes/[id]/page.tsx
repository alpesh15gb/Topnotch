'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowLeft, Trash2, FileText } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DNItem {
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

interface DebitNote {
    id: number;
    number: string;
    date: string;
    reason: string | null;
    status: 'draft' | 'posted' | 'applied' | 'cancelled';
    subtotal: number;
    tax_amount: number;
    total: number;
    balance: number;
    notes: string | null;
    party: { id: number; name: string; gstin: string | null; billing_address: string | null; city: string | null; state: string | null };
    original_bill: { id: number; number: string } | null;
    items: DNItem[];
}

const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    posted: 'bg-blue-100 text-blue-700',
    applied: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-slate-200 text-slate-500',
};

const fmt = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function DebitNoteDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: note, isLoading, isError } = useQuery<DebitNote>({
        queryKey: ['debit_note', id],
        queryFn: () => api.get('/v1/debit-notes/' + id).then(r => r.data),
        enabled: !!id,
    });

    const deleteMutation = useMutation({
        mutationFn: () => api.delete('/v1/debit-notes/' + id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['debit_notes'] });
            toast.success('Debit note deleted');
            router.push('/purchases/debit-notes');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
    });

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" /></div>;
    if (isError || !note) return <div className="text-center py-20 text-red-500">Failed to load debit note</div>;

    const cgstTotal = note.items.reduce((s, i) => s + Number(i.cgst), 0);
    const sgstTotal = note.items.reduce((s, i) => s + Number(i.sgst), 0);

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/purchases/debit-notes" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-slate-800">{note.number}</h1>
                            <span className={cn('px-2.5 py-1 text-xs font-semibold rounded-full', statusColors[note.status])}>
                                {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{note.party.name} &middot; {format(new Date(note.date), 'dd MMM yyyy')}</p>
                    </div>
                </div>
                {note.status === 'draft' && (
                    <button
                        onClick={() => { if (confirm('Delete this debit note?')) deleteMutation.mutate(); }}
                        disabled={deleteMutation.isPending}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-rose-300 text-rose-600 bg-white rounded-lg hover:bg-rose-50 transition-colors font-medium text-sm"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-base font-semibold text-slate-800 mb-4">Debit Note Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Date</p>
                                <p className="text-slate-800 font-medium mt-1">{format(new Date(note.date), 'dd MMM yyyy')}</p>
                            </div>
                            {note.original_bill && (
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Against Bill</p>
                                    <Link href={`/purchases/bills/${note.original_bill.id}`} className="text-blue-600 font-medium mt-1 hover:underline block">
                                        {note.original_bill.number}
                                    </Link>
                                </div>
                            )}
                            <div className="col-span-2">
                                <p className="text-sm font-medium text-slate-500">Supplier</p>
                                <p className="text-slate-800 font-medium mt-1">{note.party.name}</p>
                                {note.party.gstin && <p className="text-sm text-slate-500">GSTIN: {note.party.gstin}</p>}
                                {note.party.billing_address && <p className="text-sm text-slate-500 mt-0.5">{note.party.billing_address}</p>}
                            </div>
                            {note.reason && (
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-slate-500">Reason</p>
                                    <p className="text-sm text-slate-700 mt-1">{note.reason}</p>
                                </div>
                            )}
                            {note.notes && (
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-slate-500">Notes</p>
                                    <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">{note.notes}</p>
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
                            <span className="font-medium">{fmt(note.subtotal)}</span>
                        </div>
                        {cgstTotal > 0 && <div className="flex justify-between text-slate-500"><span>CGST</span><span>{fmt(cgstTotal)}</span></div>}
                        {sgstTotal > 0 && <div className="flex justify-between text-slate-500"><span>SGST</span><span>{fmt(sgstTotal)}</span></div>}
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-base font-bold text-slate-800">Total</span>
                            <span className="text-2xl font-bold text-[#F59E0B]">{fmt(note.total)}</span>
                        </div>
                        {note.balance > 0 && (
                            <div className="flex justify-between text-amber-600 text-xs font-semibold">
                                <span>Unapplied Balance</span>
                                <span>{fmt(note.balance)}</span>
                            </div>
                        )}
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
                            {note.items.map((item, idx) => {
                                const taxRate = item.cgst_rate + item.sgst_rate || item.igst_rate;
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
