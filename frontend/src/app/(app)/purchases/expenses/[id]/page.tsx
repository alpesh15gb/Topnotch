'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowLeft, Trash2, Paperclip } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Expense {
    id: number;
    number: string;
    date: string;
    status: 'draft' | 'posted' | 'paid' | 'cancelled';
    category: string | null;
    description: string;
    amount: number;
    tax_amount: number;
    total: number;
    payment_mode: string | null;
    reference: string | null;
    notes: string | null;
    receipt_url: string | null;
    party: { id: number; name: string } | null;
    account: { id: number; name: string } | null;
}

const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    posted: 'bg-blue-100 text-blue-700',
    paid: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-slate-200 text-slate-500',
};

const fmt = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function ExpenseDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: expense, isLoading, isError } = useQuery<Expense>({
        queryKey: ['expense', id],
        queryFn: () => api.get('/v1/expenses/' + id).then(r => r.data),
        enabled: !!id,
    });

    const deleteMutation = useMutation({
        mutationFn: () => api.delete('/v1/expenses/' + id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            toast.success('Expense deleted');
            router.push('/purchases/expenses');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
    });

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" /></div>;
    if (isError || !expense) return <div className="text-center py-20 text-red-500">Failed to load expense</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/purchases/expenses" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-slate-800">{expense.number || `EXP-${id}`}</h1>
                            <span className={cn('px-2.5 py-1 text-xs font-semibold rounded-full', statusColors[expense.status])}>
                                {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{format(new Date(expense.date), 'dd MMM yyyy')}</p>
                    </div>
                </div>
                {(expense.status === 'draft' || expense.status === 'posted') && (
                    <button
                        onClick={() => { if (confirm('Delete this expense?')) deleteMutation.mutate(); }}
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
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                        <h2 className="text-base font-semibold text-slate-800">Expense Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Date</p>
                                <p className="text-slate-800 font-medium mt-1">{format(new Date(expense.date), 'dd MMM yyyy')}</p>
                            </div>
                            {expense.category && (
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Category</p>
                                    <p className="text-slate-800 font-medium mt-1 capitalize">{expense.category}</p>
                                </div>
                            )}
                            <div className="col-span-2">
                                <p className="text-sm font-medium text-slate-500">Description</p>
                                <p className="text-slate-800 font-medium mt-1">{expense.description}</p>
                            </div>
                            {expense.party && (
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Paid To</p>
                                    <Link href={`/masters/parties/${expense.party.id}`} className="text-blue-600 font-medium mt-1 hover:underline block">
                                        {expense.party.name}
                                    </Link>
                                </div>
                            )}
                            {expense.account && (
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Account</p>
                                    <p className="text-slate-800 font-medium mt-1">{expense.account.name}</p>
                                </div>
                            )}
                            {expense.payment_mode && (
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Payment Mode</p>
                                    <p className="text-slate-800 font-medium mt-1 capitalize">{expense.payment_mode}</p>
                                </div>
                            )}
                            {expense.reference && (
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Reference</p>
                                    <p className="text-slate-800 font-medium mt-1">{expense.reference}</p>
                                </div>
                            )}
                            {expense.notes && (
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-slate-500">Notes</p>
                                    <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">{expense.notes}</p>
                                </div>
                            )}
                        </div>

                        {expense.receipt_url && (
                            <div className="pt-4 border-t border-slate-100">
                                <a
                                    href={expense.receipt_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
                                >
                                    <Paperclip size={16} />
                                    View Receipt
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
                    <h2 className="text-base font-semibold text-slate-800 mb-4">Summary</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Amount</span>
                            <span className="font-medium">{fmt(expense.amount)}</span>
                        </div>
                        {Number(expense.tax_amount) > 0 && (
                            <div className="flex justify-between text-slate-500">
                                <span>Tax (GST)</span>
                                <span>{fmt(expense.tax_amount)}</span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-base font-bold text-slate-800">Total</span>
                            <span className="text-2xl font-bold text-[#F59E0B]">{fmt(expense.total || expense.amount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
