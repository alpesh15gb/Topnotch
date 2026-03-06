'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface LoanFormData {
    name: string;
    type: 'secured' | 'unsecured';
    lender: string;
    principal_amount: number | '';
    interest_rate: number | '';
    emi_amount: number | '';
    tenure_months: number | '';
    start_date: string;
    account_number: string;
    notes: string;
}

export default function NewLoanPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { control, handleSubmit } = useForm<LoanFormData>({
        defaultValues: {
            name: '',
            type: 'secured',
            lender: '',
            principal_amount: '',
            interest_rate: '',
            emi_amount: '',
            tenure_months: '',
            start_date: new Date().toISOString().split('T')[0],
            account_number: '',
            notes: '',
        },
    });

    const saveMutation = useMutation({
        mutationFn: async (data: LoanFormData) => api.post('/v1/loans', {
            ...data,
            principal_amount: Number(data.principal_amount),
            interest_rate: Number(data.interest_rate),
            emi_amount: Number(data.emi_amount) || null,
            tenure_months: Number(data.tenure_months) || null,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loans'] });
            toast.success('Loan account added');
            router.push('/banking/loans');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add loan'),
    });

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            <div className="flex items-center gap-4">
                <Link href="/banking/loans" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Add Loan Account</h1>
                    <p className="text-sm text-slate-500">Track a business loan, EMI, or credit facility</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Loan Name <span className="text-red-500">*</span></label>
                        <Controller control={control} name="name" rules={{ required: true }} render={({ field }) => (
                            <input {...field} type="text" placeholder="e.g. SBI Business Loan, CC Limit" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Loan Type <span className="text-red-500">*</span></label>
                        <Controller control={control} name="type" render={({ field }) => (
                            <select {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] bg-white">
                                <option value="secured">Secured</option>
                                <option value="unsecured">Unsecured</option>
                            </select>
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Lender (Bank/NBFC) <span className="text-red-500">*</span></label>
                        <Controller control={control} name="lender" rules={{ required: true }} render={({ field }) => (
                            <input {...field} type="text" placeholder="State Bank of India" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Principal Amount <span className="text-red-500">*</span></label>
                        <Controller control={control} name="principal_amount" rules={{ required: true, min: 1 }} render={({ field, fieldState }) => (
                            <>
                                <input {...field} type="number" step="0.01" min="1" placeholder="0.00" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : '')} />
                                {fieldState.error && <p className="text-red-500 text-xs mt-1">Required</p>}
                            </>
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Interest Rate (% p.a.) <span className="text-red-500">*</span></label>
                        <Controller control={control} name="interest_rate" rules={{ required: true, min: 0 }} render={({ field, fieldState }) => (
                            <>
                                <input {...field} type="number" step="0.01" min="0" placeholder="12.5" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : '')} />
                                {fieldState.error && <p className="text-red-500 text-xs mt-1">Required</p>}
                            </>
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">EMI Amount</label>
                        <Controller control={control} name="emi_amount" render={({ field }) => (
                            <input {...field} type="number" step="0.01" min="0" placeholder="Monthly EMI (optional)" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : '')} />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tenure (Months)</label>
                        <Controller control={control} name="tenure_months" render={({ field }) => (
                            <input {...field} type="number" min="1" placeholder="36" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : '')} />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                        <Controller control={control} name="start_date" render={({ field }) => (
                            <input {...field} type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Loan Account Number</label>
                        <Controller control={control} name="account_number" render={({ field }) => (
                            <input {...field} type="text" placeholder="Loan account / reference number" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] font-mono" />
                        )} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                        <Controller control={control} name="notes" render={({ field }) => (
                            <textarea {...field} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] resize-none text-sm" placeholder="Purpose of loan, collateral, etc." />
                        )} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Link href="/banking/loans" className="px-6 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium">Cancel</Link>
                    <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-8 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium disabled:opacity-70">
                        <Save size={18} />
                        {saveMutation.isPending ? 'Saving...' : 'Add Loan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
