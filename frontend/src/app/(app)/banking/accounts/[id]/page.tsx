'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowLeft, Trash2, Building2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface BankAccount {
    id: number;
    name: string;
    bank_name: string | null;
    account_number: string | null;
    ifsc_code: string | null;
    branch: string | null;
    type: string;
    balance: number;
    opening_balance: number;
}

const fmt = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function BankAccountDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: account, isLoading, isError } = useQuery<BankAccount>({
        queryKey: ['bank_account', id],
        queryFn: () => api.get('/v1/bank-accounts/' + id).then(r => r.data),
        enabled: !!id,
    });

    const deleteMutation = useMutation({
        mutationFn: () => api.delete('/v1/bank-accounts/' + id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bank_accounts'] });
            toast.success('Bank account deleted');
            router.push('/banking/accounts');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
    });

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" /></div>;
    if (isError || !account) return <div className="text-center py-20 text-red-500">Failed to load account details</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/banking/accounts" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{account.name}</h1>
                        <p className="text-sm text-slate-500 mt-0.5 capitalize">{account.type?.replace('_', ' ')} Account{account.bank_name ? ` — ${account.bank_name}` : ''}</p>
                    </div>
                </div>
                <button
                    onClick={() => { if (confirm('Delete this bank account?')) deleteMutation.mutate(); }}
                    disabled={deleteMutation.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-rose-300 text-rose-600 bg-white rounded-lg hover:bg-rose-50 transition-colors font-medium text-sm"
                >
                    <Trash2 size={16} />
                    Delete
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                        <Building2 size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Current Balance</p>
                        <p className={`text-3xl font-bold mt-1 ${account.balance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {fmt(account.balance)}
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <p className="text-sm font-medium text-slate-500">Opening Balance</p>
                    <p className="text-2xl font-bold text-slate-800 mt-2">{fmt(account.opening_balance)}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-base font-semibold text-slate-800 mb-4">Account Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Bank Name', value: account.bank_name },
                        { label: 'Account Number', value: account.account_number ? `****${account.account_number.slice(-4)}` : null },
                        { label: 'IFSC Code', value: account.ifsc_code },
                        { label: 'Branch', value: account.branch },
                        { label: 'Account Type', value: account.type?.replace('_', ' ') },
                    ].filter(f => f.value).map(f => (
                        <div key={f.label}>
                            <p className="text-sm font-medium text-slate-500">{f.label}</p>
                            <p className="text-slate-800 font-medium mt-1 capitalize">{f.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
