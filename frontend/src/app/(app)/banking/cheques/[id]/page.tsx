'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, Trash2, FileSignature } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    cleared: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    bounced: 'bg-red-100 text-red-700 border-red-200',
    cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
};

const typeColors: Record<string, string> = {
    issued: 'text-rose-600 bg-rose-50 border-rose-200',
    received: 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

export default function ChequeDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const qc = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['cheque', id],
        queryFn: () => api.get(`/v1/cheques/${id}`).then(r => r.data),
    });

    const cheque = data?.cheque || data;

    const updateStatus = useMutation({
        mutationFn: (status: string) => api.put(`/v1/cheques/${id}`, { status }),
        onSuccess: () => {
            toast.success('Cheque status updated');
            qc.invalidateQueries({ queryKey: ['cheque', id] });
            qc.invalidateQueries({ queryKey: ['cheques'] });
        },
        onError: () => toast.error('Failed to update status'),
    });

    const deleteMutation = useMutation({
        mutationFn: () => api.delete(`/v1/cheques/${id}`),
        onSuccess: () => {
            toast.success('Cheque deleted');
            router.push('/banking/cheques');
        },
        onError: () => toast.error('Failed to delete cheque'),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (isError || !cheque) {
        return (
            <div className="text-center py-16">
                <p className="text-slate-500 mb-4">Cheque not found.</p>
                <Link href="/banking/cheques" className="text-[#F59E0B] hover:underline">Back to Cheques</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/banking/cheques" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                    <ArrowLeft size={20} className="text-slate-600" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <FileSignature size={22} className="text-slate-500" />
                        <h1 className="text-2xl font-bold text-slate-800">Cheque #{cheque.number}</h1>
                        <span className={cn('px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded border', typeColors[cheque.type])}>
                            {cheque.type}
                        </span>
                        <span className={cn('px-2.5 py-1 text-xs font-semibold rounded-full border', statusColors[cheque.status])}>
                            {cheque.status}
                        </span>
                    </div>
                </div>
                {cheque.status === 'pending' && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => updateStatus.mutate('cleared')}
                            disabled={updateStatus.isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                            <CheckCircle2 size={16} />
                            Mark Cleared
                        </button>
                        <button
                            onClick={() => updateStatus.mutate('bounced')}
                            disabled={updateStatus.isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
                        >
                            <XCircle size={16} />
                            Mark Bounced
                        </button>
                    </div>
                )}
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-semibold text-slate-700">Cheque Details</h2>
                </div>
                <div className="divide-y divide-slate-100">
                    <div className="grid grid-cols-2 divide-x divide-slate-100">
                        <div className="px-6 py-4">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Cheque Number</p>
                            <p className="text-slate-800 font-bold text-lg">#{cheque.number}</p>
                        </div>
                        <div className="px-6 py-4">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Date</p>
                            <p className="text-slate-800 font-semibold">{cheque.date ? format(new Date(cheque.date), 'dd MMMM yyyy') : '—'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-slate-100">
                        <div className="px-6 py-4">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Party</p>
                            <p className="text-slate-800 font-semibold">{cheque.party?.name || '—'}</p>
                        </div>
                        <div className="px-6 py-4">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Bank Account</p>
                            <p className="text-slate-800 font-semibold">{cheque.bank_account?.name || '—'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-slate-100">
                        <div className="px-6 py-4">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Amount</p>
                            <p className={cn("font-bold text-xl", cheque.type === 'received' ? 'text-emerald-600' : 'text-slate-800')}>
                                {cheque.type === 'received' ? '+' : '-'} ₹{Number(cheque.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        {cheque.micr_code && (
                            <div className="px-6 py-4">
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">MICR Code</p>
                                <p className="text-slate-800 font-mono">{cheque.micr_code}</p>
                            </div>
                        )}
                    </div>
                    {cheque.notes && (
                        <div className="px-6 py-4">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Notes</p>
                            <p className="text-slate-700">{cheque.notes}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                    <h2 className="font-semibold text-red-700">Danger Zone</h2>
                </div>
                <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-800">Delete this cheque</p>
                        <p className="text-sm text-slate-500">This action cannot be undone.</p>
                    </div>
                    <button
                        onClick={() => {
                            if (confirm('Delete this cheque? This cannot be undone.')) {
                                deleteMutation.mutate();
                            }
                        }}
                        disabled={deleteMutation.isPending}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
