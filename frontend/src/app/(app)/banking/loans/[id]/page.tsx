'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Loan {
    id: number;
    name: string;
    type: 'secured' | 'unsecured';
    lender: string;
    principal_amount: number;
    remaining_balance: number;
    interest_rate: number;
    emi_amount: number | null;
    tenure_months: number | null;
    start_date: string | null;
    account_number: string | null;
    notes: string | null;
}

const fmt = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function LoanDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: loan, isLoading, isError } = useQuery<Loan>({
        queryKey: ['loan', id],
        queryFn: () => api.get('/v1/loans/' + id).then(r => r.data),
        enabled: !!id,
    });

    const deleteMutation = useMutation({
        mutationFn: () => api.delete('/v1/loans/' + id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loans'] });
            toast.success('Loan account deleted');
            router.push('/banking/loans');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
    });

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" /></div>;
    if (isError || !loan) return <div className="text-center py-20 text-red-500">Failed to load loan details</div>;

    const paidAmount = loan.principal_amount - loan.remaining_balance;
    const progressPct = loan.principal_amount > 0 ? Math.min(100, (paidAmount / loan.principal_amount) * 100) : 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/banking/loans" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{loan.name}</h1>
                        <p className="text-sm text-slate-500 mt-0.5">{loan.lender} &middot; {loan.type} loan &middot; {loan.interest_rate}% p.a.</p>
                    </div>
                </div>
                <button
                    onClick={() => { if (confirm('Delete this loan account?')) deleteMutation.mutate(); }}
                    disabled={deleteMutation.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-rose-300 text-rose-600 bg-white rounded-lg hover:bg-rose-50 transition-colors font-medium text-sm"
                >
                    <Trash2 size={16} />
                    Delete
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <p className="text-sm font-medium text-slate-500">Principal Amount</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{fmt(loan.principal_amount)}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <p className="text-sm font-medium text-slate-500">Outstanding Balance</p>
                    <p className="text-3xl font-bold text-rose-600 mt-2">{fmt(loan.remaining_balance)}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <p className="text-sm font-medium text-slate-500">Amount Repaid</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{fmt(paidAmount)}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h2 className="text-base font-semibold text-slate-800">Repayment Progress</h2>
                <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                </div>
                <p className="text-sm text-slate-500">{progressPct.toFixed(1)}% repaid</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                    {loan.emi_amount && (
                        <div>
                            <p className="text-sm font-medium text-slate-500">Monthly EMI</p>
                            <p className="text-lg font-bold text-slate-800 mt-1">{fmt(loan.emi_amount)}</p>
                        </div>
                    )}
                    {loan.tenure_months && (
                        <div>
                            <p className="text-sm font-medium text-slate-500">Tenure</p>
                            <p className="text-lg font-bold text-slate-800 mt-1">{loan.tenure_months} months</p>
                        </div>
                    )}
                    {loan.start_date && (
                        <div>
                            <p className="text-sm font-medium text-slate-500">Start Date</p>
                            <p className="text-lg font-bold text-slate-800 mt-1">{format(new Date(loan.start_date), 'dd MMM yyyy')}</p>
                        </div>
                    )}
                    {loan.account_number && (
                        <div>
                            <p className="text-sm font-medium text-slate-500">Loan A/C No.</p>
                            <p className="text-lg font-bold text-slate-800 mt-1 font-mono">{loan.account_number}</p>
                        </div>
                    )}
                </div>

                {loan.notes && (
                    <div className="pt-4 border-t border-slate-100">
                        <p className="text-sm font-medium text-slate-500">Notes</p>
                        <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">{loan.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
