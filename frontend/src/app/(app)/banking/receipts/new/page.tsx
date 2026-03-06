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
interface Invoice { id: number; number: string; total: number; balance: number; }
interface BankAccount { id: number; name: string; account_number: string | null; }

interface ReceiptFormData {
    party_id: number | '';
    invoice_id: number | '';
    date: string;
    amount: number | '';
    method: string;
    reference: string;
    account_id: number | '';
    notes: string;
}

const paymentModes = ['cash', 'bank', 'cheque', 'upi', 'neft', 'rtgs', 'imps'];

export default function NewReceiptPage() {
    const router = useRouter();
    const [selectedPartyId, setSelectedPartyId] = useState<number | ''>('');

    const { control, handleSubmit, setValue } = useForm<ReceiptFormData>({
        defaultValues: {
            party_id: '',
            invoice_id: '',
            date: new Date().toISOString().split('T')[0],
            amount: '',
            method: 'bank',
            reference: '',
            account_id: '',
            notes: '',
        },
    });

    const { data: parties = [] } = useQuery<Party[]>({
        queryKey: ['parties', 'customer'],
        queryFn: async () => (await api.get('/v1/parties', { params: { type: 'customer', per_page: 200 } })).data.data,
    });

    const { data: invoices = [] } = useQuery<Invoice[]>({
        queryKey: ['invoices', 'unpaid', selectedPartyId],
        queryFn: async () => {
            const res = await api.get('/v1/invoices', { params: { party_id: selectedPartyId, per_page: 100 } });
            return (res.data.data || []).filter((inv: Invoice) => inv.balance > 0);
        },
        enabled: !!selectedPartyId,
    });

    const { data: bankAccounts = [] } = useQuery<BankAccount[]>({
        queryKey: ['bank-accounts'],
        queryFn: async () => (await api.get('/v1/bank-accounts')).data.data || [],
    });

    // Record receipt via invoice payment endpoint
    const saveMutation = useMutation({
        mutationFn: async (data: ReceiptFormData) => {
            if (!data.invoice_id) throw new Error('Please select an invoice');
            return api.post(`/v1/invoices/${data.invoice_id}/payment`, {
                date: data.date,
                amount: Number(data.amount),
                method: data.method,
                reference: data.reference,
                account_id: data.account_id ? Number(data.account_id) : null,
                notes: data.notes,
            });
        },
        onSuccess: () => {
            toast.success('Receipt recorded successfully');
            router.push('/banking/receipts');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || err.message || 'Failed to record receipt'),
    });

    const handleInvoiceSelect = (invoiceId: number) => {
        const inv = invoices.find(i => i.id === invoiceId);
        if (inv) setValue('amount', inv.balance);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            <div className="flex items-center gap-4">
                <Link href="/banking/receipts" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Record Receipt</h1>
                    <p className="text-sm text-slate-500">Record money received from a customer</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Customer <span className="text-red-500">*</span></label>
                    <Controller
                        control={control}
                        name="party_id"
                        rules={{ required: 'Customer is required' }}
                        render={({ field, fieldState }) => (
                            <>
                                <select
                                    {...field}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent bg-white"
                                    onChange={e => {
                                        const val = e.target.value ? Number(e.target.value) : '';
                                        field.onChange(val);
                                        setSelectedPartyId(val);
                                        setValue('invoice_id', '');
                                        setValue('amount', '');
                                    }}
                                >
                                    <option value="">Select Customer...</option>
                                    {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                            </>
                        )}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Against Invoice <span className="text-red-500">*</span></label>
                    <Controller
                        control={control}
                        name="invoice_id"
                        rules={{ required: 'Invoice is required' }}
                        render={({ field, fieldState }) => (
                            <>
                                <select
                                    {...field}
                                    disabled={!selectedPartyId}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent bg-white disabled:bg-slate-50 disabled:text-slate-400"
                                    onChange={e => {
                                        const val = e.target.value ? Number(e.target.value) : '';
                                        field.onChange(val);
                                        if (val !== '') handleInvoiceSelect(val as number);
                                    }}
                                >
                                    <option value="">{selectedPartyId ? 'Select Invoice...' : 'Select a customer first'}</option>
                                    {invoices.map(inv => (
                                        <option key={inv.id} value={inv.id}>
                                            {inv.number} — Balance: ₹{Number(inv.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </option>
                                    ))}
                                </select>
                                {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                                {selectedPartyId && invoices.length === 0 && (
                                    <p className="text-amber-600 text-xs mt-1">No outstanding invoices for this customer</p>
                                )}
                            </>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Receipt Date <span className="text-red-500">*</span></label>
                        <Controller control={control} name="date" rules={{ required: true }} render={({ field }) => (
                            <input type="date" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount Received <span className="text-red-500">*</span></label>
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method <span className="text-red-500">*</span></label>
                        <Controller control={control} name="method" render={({ field }) => (
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
                    <Controller control={control} name="reference" render={({ field }) => (
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
                    <Link href="/banking/receipts" className="px-6 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium">Cancel</Link>
                    <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-8 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium disabled:opacity-70">
                        <Save size={18} />
                        {saveMutation.isPending ? 'Saving...' : 'Record Receipt'}
                    </button>
                </div>
            </form>
        </div>
    );
}
