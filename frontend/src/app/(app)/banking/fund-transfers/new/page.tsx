'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Account { id: number; name: string; account_number: string | null; type: string; }
interface FundTransferFormData {
    date: string;
    from_account_id: number | '';
    to_account_id: number | '';
    amount: number | '';
    reference: string;
    notes: string;
}

export default function NewFundTransferPage() {
    const router = useRouter();

    const { control, handleSubmit, watch, formState: { errors } } = useForm<FundTransferFormData>({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            from_account_id: '',
            to_account_id: '',
            amount: '',
            reference: '',
            notes: '',
        }
    });

    const watchFrom = watch('from_account_id');
    const watchTo = watch('to_account_id');

    const { data: accounts, isLoading } = useQuery({ queryKey: ['bank-accounts'], queryFn: async () => (await api.get('/v1/bank-accounts')).data as Account[] });

    const saveMutation = useMutation({
        mutationFn: async (data: FundTransferFormData) => api.post('/v1/fund-transfers', { ...data, amount: Number(data.amount) }),
        onSuccess: () => { toast.success('Fund transfer recorded successfully'); router.push('/banking/fund-transfers'); },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to record fund transfer')
    });

    const onSubmit = (data: FundTransferFormData) => saveMutation.mutate(data);

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-24">
            <div className="flex items-center gap-4">
                <Link href="/banking/fund-transfers" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"><ArrowLeft size={20} /></Link>
                <div><h1 className="text-2xl font-bold text-slate-800">New Fund Transfer</h1><p className="text-sm text-slate-500">Transfer funds between bank or cash accounts</p></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Transfer Date <span className="text-red-500">*</span></label>
                    <Controller control={control} name="date" rules={{ required: true }} render={({ field }) => (
                        <input type="date" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] outline-none" />
                    )} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">From Account (Source) <span className="text-red-500">*</span></label>
                        <Controller control={control} name="from_account_id" rules={{ required: 'Source account required', validate: v => v !== watchTo || 'Accounts must be different' }} render={({ field, fieldState }) => (
                            <>
                                <select {...field} disabled={isLoading} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] bg-white outline-none">
                                    <option value="">Select Account...</option>
                                    {accounts?.map(a => <option key={a.id} value={a.id}>{a.name} {a.account_number ? `(${a.account_number})` : ''}</option>)}
                                </select>
                                {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                            </>
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">To Account (Destination) <span className="text-red-500">*</span></label>
                        <Controller control={control} name="to_account_id" rules={{ required: 'Destination account required', validate: v => v !== watchFrom || 'Accounts must be different' }} render={({ field, fieldState }) => (
                            <>
                                <select {...field} disabled={isLoading} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] bg-white outline-none">
                                    <option value="">Select Account...</option>
                                    {accounts?.map(a => <option key={a.id} value={a.id}>{a.name} {a.account_number ? `(${a.account_number})` : ''}</option>)}
                                </select>
                                {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                            </>
                        )} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount <span className="text-red-500">*</span></label>
                    <Controller control={control} name="amount" rules={{ required: 'Amount required', min: { value: 0.01, message: 'Amount must be greater than 0' } }} render={({ field, fieldState }) => (
                        <>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                                <input type="number" step="0.01" min="0" {...field} className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] outline-none" placeholder="0.00" />
                            </div>
                            {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                        </>
                    )} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Reference / Transaction ID</label>
                    <Controller control={control} name="reference" render={({ field }) => (
                        <input type="text" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] outline-none" placeholder="Cheque no, UTR, etc." />
                    )} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                    <Controller control={control} name="notes" render={({ field }) => (
                        <textarea {...field} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] outline-none resize-none" placeholder="Optional notes" />
                    )} />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-2">
                    <Link href="/banking/fund-transfers" className="px-6 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium">Cancel</Link>
                    <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-8 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium disabled:opacity-70">
                        <Save size={18} />{saveMutation.isPending ? 'Saving...' : 'Record Transfer'}
                    </button>
                </div>
            </form>
        </div>
    );
}
