'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Party { id: number; name: string; }
interface Bill { id: number; number: string; total: number; balance: number; }
interface BankAccount { id: number; name: string; account_number: string | null; }

interface PaymentFormData {
    party_id: number | '';
    purchase_bill_id: number | '';
    date: string;
    amount: number | '';
    payment_mode: string;
    reference_number: string;
    account_id: number | '';
    notes: string;
}

const paymentModes = ['cash', 'bank', 'cheque', 'upi', 'neft', 'rtgs', 'imps'];

export default function NewPaymentPage() {
    const router = useRouter();
    const [selectedPartyId, setSelectedPartyId] = useState<number | ''>('');

    const { control, handleSubmit, setValue } = useForm<PaymentFormData>({
        defaultValues: {
            party_id: '',
            purchase_bill_id: '',
            date: new Date().toISOString().split('T')[0],
            amount: '',
            payment_mode: 'bank',
            reference_number: '',
            account_id: '',
            notes: '',
        },
    });

    const { data: parties = [] } = useQuery<Party[]>({
        queryKey: ['parties', 'supplier'],
        queryFn: async () => (await api.get('/v1/parties', { params: { type: 'supplier', per_page: 200 } })).data.data,
    });

    const { data: bills = [] } = useQuery<Bill[]>({
        queryKey: ['purchase-bills', 'unpaid', selectedPartyId],
        queryFn: async () => {
            const res = await api.get('/v1/purchase-bills', { params: { party_id: selectedPartyId, status: 'posted,partially_paid,overdue', per_page: 100 } });
            return (res.data.data || []).filter((b: Bill) => b.balance > 0);
        },
        enabled: !!selectedPartyId,
    });

    const { data: bankAccounts = [] } = useQuery<BankAccount[]>({
        queryKey: ['bank-accounts'],
        queryFn: async () => (await api.get('/v1/bank-accounts')).data.data || [],
    });

    const saveMutation = useMutation({
        mutationFn: async (data: PaymentFormData) => api.post('/v1/payments', { ...data, amount: Number(data.amount) }),
        onSuccess: () => {
            toast.success('Payment recorded successfully');
            router.push('/banking/payments');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to record payment'),
    });

    const handleBillSelect = (billId: number) => {
        const bill = bills.find(b => b.id === billId);
        if (bill) setValue('amount', bill.balance);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            <div className="flex items-center gap-4">
                <Link href="/banking/payments" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Record Payment</h1>
                    <p className="text-sm text-slate-500">Record money paid to a vendor or supplier</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Vendor / Supplier <span className="text-red-500">*</span></label>
                    <Controller
                        control={control}
                        name="party_id"
                        rules={{ required: 'Vendor is required' }}
                        render={({ field, fieldState }) => (
                            <>
                                <select
                                    {...field}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent bg-white"
                                    onChange={e => {
                                        const val = e.target.value ? Number(e.target.value) : '';
                                        field.onChange(val);
                                        setSelectedPartyId(val);
                                        setValue('purchase_bill_id', '');
                                        setValue('amount', '');
                                    }}
                                >
                                    <option value="">Select Vendor...</option>
                                    {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                            </>
                        )}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Against Bill (optional)</label>
                    <Controller
                        control={control}
                        name="purchase_bill_id"
                        render={({ field }) => (
                            <select
                                {...field}
                                disabled={!selectedPartyId}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent bg-white disabled:bg-slate-50 disabled:text-slate-400"
                                onChange={e => {
                                    const val = e.target.value ? Number(e.target.value) : '';
                                    field.onChange(val);
                                    if (val !== '') handleBillSelect(val as number);
                                }}
                            >
                                <option value="">On Account (no specific bill)</option>
                                {bills.map(b => (
                                    <option key={b.id} value={b.id}>
                                        {b.number} — Balance: ₹{Number(b.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Payment Date <span className="text-red-500">*</span></label>
                        <Controller control={control} name="date" rules={{ required: true }} render={({ field }) => (
                            <input type="date" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount <span className="text-red-500">*</span></label>
                        <Controller control={control} name="amount" rules={{ required: true, min: 0.01 }} render={({ field, fieldState }) => (
                            <>
                                <input {...field} type="number" step="0.01" min="0.01" placeholder="0.00" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : '')} />
                                {fieldState.error && <p className="text-red-500 text-xs mt-1">Valid amount required</p>}
                            </>
                        )} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Payment Mode <span className="text-red-500">*</span></label>
                        <Controller control={control} name="payment_mode" render={({ field }) => (
                            <select {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] bg-white">
                                {paymentModes.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                            </select>
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Bank Account</label>
                        <Controller control={control} name="account_id" render={({ field }) => (
                            <select {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] bg-white"
                                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : '')}>
                                <option value="">Select Account (optional)</option>
                                {bankAccounts.map(a => <option key={a.id} value={a.id}>{a.name}{a.account_number ? ` - ****${a.account_number.slice(-4)}` : ''}</option>)}
                            </select>
                        )} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Reference / Cheque No.</label>
                    <Controller control={control} name="reference_number" render={({ field }) => (
                        <input {...field} type="text" placeholder="Transaction ID, cheque number..." className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                    )} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                    <Controller control={control} name="notes" render={({ field }) => (
                        <textarea {...field} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] resize-none text-sm" placeholder="Any additional notes..." />
                    )} />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Link href="/banking/payments" className="px-6 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium">Cancel</Link>
                    <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-8 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium disabled:opacity-70">
                        <Save size={18} />
                        {saveMutation.isPending ? 'Saving...' : 'Record Payment'}
                    </button>
                </div>
            </form>
        </div>
    );
}
