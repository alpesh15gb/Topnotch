'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface BankAccountFormData {
    name: string;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    branch: string;
    opening_balance: number | '';
    type: string;
}

export default function NewBankAccountPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { control, handleSubmit } = useForm<BankAccountFormData>({
        defaultValues: {
            name: '',
            bank_name: '',
            account_number: '',
            ifsc_code: '',
            branch: '',
            opening_balance: 0,
            type: 'current',
        },
    });

    const saveMutation = useMutation({
        mutationFn: async (data: BankAccountFormData) => api.post('/v1/bank-accounts', { ...data, opening_balance: Number(data.opening_balance) || 0 }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bank_accounts'] });
            toast.success('Bank account added');
            router.push('/banking/accounts');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add bank account'),
    });

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            <div className="flex items-center gap-4">
                <Link href="/banking/accounts" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Add Bank Account</h1>
                    <p className="text-sm text-slate-500">Connect a bank or cash account to track transactions</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Display Name <span className="text-red-500">*</span></label>
                        <Controller control={control} name="name" rules={{ required: true }} render={({ field }) => (
                            <input {...field} type="text" placeholder="e.g. SBI Current Account" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Type <span className="text-red-500">*</span></label>
                        <Controller control={control} name="type" render={({ field }) => (
                            <select {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] bg-white">
                                <option value="current">Current Account</option>
                                <option value="savings">Savings Account</option>
                                <option value="cash">Cash in Hand</option>
                                <option value="overdraft">Overdraft</option>
                                <option value="credit_card">Credit Card</option>
                            </select>
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Opening Balance</label>
                        <Controller control={control} name="opening_balance" render={({ field }) => (
                            <input {...field} type="number" step="0.01" placeholder="0.00" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : '')} />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                        <Controller control={control} name="bank_name" render={({ field }) => (
                            <input {...field} type="text" placeholder="State Bank of India" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                        <Controller control={control} name="account_number" render={({ field }) => (
                            <input {...field} type="text" placeholder="1234567890" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label>
                        <Controller control={control} name="ifsc_code" render={({ field }) => (
                            <input {...field} type="text" placeholder="SBIN0001234" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] uppercase" />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
                        <Controller control={control} name="branch" render={({ field }) => (
                            <input {...field} type="text" placeholder="Main Branch" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Link href="/banking/accounts" className="px-6 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium">Cancel</Link>
                    <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-8 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium disabled:opacity-70">
                        <Save size={18} />
                        {saveMutation.isPending ? 'Saving...' : 'Add Account'}
                    </button>
                </div>
            </form>
        </div>
    );
}
