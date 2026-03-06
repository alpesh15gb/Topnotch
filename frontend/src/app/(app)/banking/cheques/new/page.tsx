'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Party { id: number; name: string; }
interface BankAccount { id: number; name: string; account_number: string | null; }

interface ChequeFormData {
    number: string;
    date: string;
    type: 'issued' | 'received';
    amount: number | '';
    party_id: number | '';
    bank_account_id: number | '';
    micr_code: string;
    notes: string;
}

export default function NewChequePage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { control, handleSubmit, watch } = useForm<ChequeFormData>({
        defaultValues: {
            number: '',
            date: new Date().toISOString().split('T')[0],
            type: 'received',
            amount: '',
            party_id: '',
            bank_account_id: '',
            micr_code: '',
            notes: '',
        },
    });

    const chequeType = watch('type');

    const { data: parties = [] } = useQuery<Party[]>({
        queryKey: ['parties'],
        queryFn: async () => (await api.get('/v1/parties', { params: { per_page: 200 } })).data.data,
    });

    const { data: bankAccounts = [] } = useQuery<BankAccount[]>({
        queryKey: ['bank-accounts'],
        queryFn: async () => (await api.get('/v1/bank-accounts')).data.data || [],
    });

    const saveMutation = useMutation({
        mutationFn: async (data: ChequeFormData) => api.post('/v1/cheques', { ...data, amount: Number(data.amount) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cheques'] });
            toast.success('Cheque recorded');
            router.push('/banking/cheques');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to record cheque'),
    });

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            <div className="flex items-center gap-4">
                <Link href="/banking/cheques" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Record Cheque</h1>
                    <p className="text-sm text-slate-500">Track an issued or received cheque</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cheque Type <span className="text-red-500">*</span></label>
                    <Controller control={control} name="type" render={({ field }) => (
                        <div className="flex gap-4">
                            {[{ val: 'received', label: 'Received (from customer)', color: 'emerald' }, { val: 'issued', label: 'Issued (to vendor)', color: 'rose' }].map(opt => (
                                <label key={opt.val} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" {...field} value={opt.val} checked={field.value === opt.val} className="accent-amber-500" />
                                    <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    )} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cheque Number <span className="text-red-500">*</span></label>
                        <Controller control={control} name="number" rules={{ required: true }} render={({ field }) => (
                            <input {...field} type="text" placeholder="123456" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cheque Date <span className="text-red-500">*</span></label>
                        <Controller control={control} name="date" rules={{ required: true }} render={({ field }) => (
                            <input {...field} type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount <span className="text-red-500">*</span></label>
                        <Controller control={control} name="amount" rules={{ required: true, min: 1 }} render={({ field, fieldState }) => (
                            <>
                                <input {...field} type="number" step="0.01" min="1" placeholder="0.00" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : '')} />
                                {fieldState.error && <p className="text-red-500 text-xs mt-1">Valid amount required</p>}
                            </>
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">MICR Code</label>
                        <Controller control={control} name="micr_code" render={({ field }) => (
                            <input {...field} type="text" placeholder="000000000" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] font-mono" />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{chequeType === 'received' ? 'Received From' : 'Issued To'} <span className="text-red-500">*</span></label>
                        <Controller control={control} name="party_id" rules={{ required: true }} render={({ field, fieldState }) => (
                            <>
                                <select {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] bg-white"
                                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : '')}>
                                    <option value="">Select Party...</option>
                                    {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                {fieldState.error && <p className="text-red-500 text-xs mt-1">Required</p>}
                            </>
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Bank Account <span className="text-red-500">*</span></label>
                        <Controller control={control} name="bank_account_id" rules={{ required: true }} render={({ field, fieldState }) => (
                            <>
                                <select {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] bg-white"
                                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : '')}>
                                    <option value="">Select Account...</option>
                                    {bankAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                                {fieldState.error && <p className="text-red-500 text-xs mt-1">Required</p>}
                            </>
                        )} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                    <Controller control={control} name="notes" render={({ field }) => (
                        <textarea {...field} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] resize-none text-sm" placeholder="Any additional notes..." />
                    )} />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Link href="/banking/cheques" className="px-6 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium">Cancel</Link>
                    <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-8 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium disabled:opacity-70">
                        <Save size={18} />
                        {saveMutation.isPending ? 'Saving...' : 'Record Cheque'}
                    </button>
                </div>
            </form>
        </div>
    );
}
