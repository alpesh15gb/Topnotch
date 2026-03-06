'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Party { id: number; name: string; }
interface Bill { id: number; number: string; total: number; balance: number; }
interface Item { id: number; name: string; purchase_price: number | null; }
interface TaxRate { id: number; name: string; cgst_rate: number; sgst_rate: number; igst_rate: number; }

interface DNFormData {
    party_id: number | '';
    original_bill_id: number | '';
    date: string;
    reason: string;
    notes: string;
    items: {
        item_id: number | '';
        description: string;
        qty: number;
        unit_price: number;
        discount_pct: number;
        tax_rate_id: number | '';
    }[];
}

export default function NewDebitNotePage() {
    const router = useRouter();
    const [selectedPartyId, setSelectedPartyId] = useState<number | ''>('');

    const { control, handleSubmit, watch, setValue } = useForm<DNFormData>({
        defaultValues: {
            party_id: '',
            original_bill_id: '',
            date: new Date().toISOString().split('T')[0],
            reason: '',
            notes: '',
            items: [{ item_id: '', description: '', qty: 1, unit_price: 0, discount_pct: 0, tax_rate_id: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'items' });
    const watchItems = watch('items');

    const { data: parties = [] } = useQuery<Party[]>({
        queryKey: ['parties', 'supplier'],
        queryFn: async () => (await api.get('/v1/parties', { params: { type: 'supplier', per_page: 200 } })).data.data,
    });

    const { data: bills = [] } = useQuery<Bill[]>({
        queryKey: ['purchase-bills', 'unpaid', selectedPartyId],
        queryFn: async () => {
            const res = await api.get('/v1/purchase-bills', { params: { party_id: selectedPartyId, per_page: 100 } });
            return res.data.data || [];
        },
        enabled: !!selectedPartyId,
    });

    const { data: itemsList = [] } = useQuery<Item[]>({
        queryKey: ['items'],
        queryFn: async () => (await api.get('/v1/items', { params: { per_page: 200 } })).data.data,
    });

    const { data: taxRates = [] } = useQuery<TaxRate[]>({
        queryKey: ['tax-rates'],
        queryFn: async () => (await api.get('/v1/tax-rates')).data,
    });

    const subtotal = useMemo(() => {
        return watchItems.reduce((sum, item) => {
            const base = (Number(item.qty) || 0) * (Number(item.unit_price) || 0);
            const disc = base * (Number(item.discount_pct) || 0) / 100;
            return sum + base - disc;
        }, 0);
    }, [watchItems]);

    const taxTotal = useMemo(() => {
        return watchItems.reduce((sum, item) => {
            const base = (Number(item.qty) || 0) * (Number(item.unit_price) || 0);
            const disc = base * (Number(item.discount_pct) || 0) / 100;
            const taxable = base - disc;
            const rate = taxRates.find(t => t.id === Number(item.tax_rate_id));
            const totalRate = rate ? (rate.cgst_rate + rate.sgst_rate || rate.igst_rate) : 0;
            return sum + taxable * totalRate / 100;
        }, 0);
    }, [watchItems, taxRates]);

    const handleItemSelect = (index: number, itemId: number) => {
        const item = itemsList.find(i => i.id === itemId);
        if (item) {
            setValue(`items.${index}.description`, item.name);
            setValue(`items.${index}.unit_price`, item.purchase_price || 0);
        }
    };

    const saveMutation = useMutation({
        mutationFn: async (data: DNFormData) => api.post('/v1/debit-notes', data),
        onSuccess: () => {
            toast.success('Debit note created');
            router.push('/purchases/debit-notes');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create debit note'),
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-24">
            <div className="flex items-center gap-4">
                <Link href="/purchases/debit-notes" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">New Debit Note</h1>
                    <p className="text-sm text-slate-500">Record a purchase return or adjustment</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Supplier <span className="text-red-500">*</span></label>
                        <Controller
                            control={control}
                            name="party_id"
                            rules={{ required: 'Supplier is required' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <select
                                        {...field}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent bg-white"
                                        onChange={e => {
                                            const val = e.target.value ? Number(e.target.value) : '';
                                            field.onChange(val);
                                            setSelectedPartyId(val);
                                        }}
                                    >
                                        <option value="">Select Supplier...</option>
                                        {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                    {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                                </>
                            )}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Original Bill (optional)</label>
                        <Controller
                            control={control}
                            name="original_bill_id"
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent bg-white"
                                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : '')}
                                    disabled={!selectedPartyId}
                                >
                                    <option value="">No Reference Bill</option>
                                    {bills.map(b => <option key={b.id} value={b.id}>{b.number} — ₹{Number(b.total).toLocaleString('en-IN')}</option>)}
                                </select>
                            )}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date <span className="text-red-500">*</span></label>
                        <Controller control={control} name="date" rules={{ required: true }} render={({ field }) => (
                            <input type="date" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Return</label>
                        <Controller control={control} name="reason" render={({ field }) => (
                            <input {...field} type="text" placeholder="Damaged goods, wrong item, quality issue..." className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800">Returned Items</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="px-4 py-3 font-medium w-48">Item</th>
                                    <th className="px-4 py-3 font-medium">Description</th>
                                    <th className="px-4 py-3 font-medium w-24 text-right">Qty</th>
                                    <th className="px-4 py-3 font-medium w-28 text-right">Rate</th>
                                    <th className="px-4 py-3 font-medium w-20 text-right">Disc%</th>
                                    <th className="px-4 py-3 font-medium w-36">Tax</th>
                                    <th className="px-4 py-3 font-medium w-28 text-right">Amount</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {fields.map((field, index) => {
                                    const item = watchItems[index];
                                    const base = (Number(item.qty) || 0) * (Number(item.unit_price) || 0);
                                    const disc = base * (Number(item.discount_pct) || 0) / 100;
                                    const taxable = base - disc;
                                    const rate = taxRates.find(t => t.id === Number(item.tax_rate_id));
                                    const totalRate = rate ? (rate.cgst_rate + rate.sgst_rate || rate.igst_rate) : 0;
                                    const lineTotal = taxable + taxable * totalRate / 100;

                                    return (
                                        <tr key={field.id} className="align-top hover:bg-slate-50 group">
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.item_id`} render={({ field: f }) => (
                                                    <select {...f} className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B] bg-white"
                                                        onChange={e => { const v = e.target.value ? Number(e.target.value) : ''; f.onChange(v); if (v !== '') handleItemSelect(index, v as number); }}>
                                                        <option value="">Custom</option>
                                                        {itemsList.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                                    </select>
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.description`} render={({ field: f }) => (
                                                    <input {...f} type="text" required className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B]" placeholder="Description" />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.qty`} render={({ field: f }) => (
                                                    <input {...f} type="number" step="any" min="0.001" required className="w-full px-2 py-1.5 text-sm text-right border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B]" />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.unit_price`} render={({ field: f }) => (
                                                    <input {...f} type="number" step="any" min="0" required className="w-full px-2 py-1.5 text-sm text-right border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B]" />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.discount_pct`} render={({ field: f }) => (
                                                    <input {...f} type="number" step="any" min="0" max="100" className="w-full px-2 py-1.5 text-sm text-right border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B]" />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.tax_rate_id`} render={({ field: f }) => (
                                                    <select {...f} className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B] bg-white"
                                                        onChange={e => f.onChange(e.target.value ? Number(e.target.value) : '')}>
                                                        <option value="">No Tax</option>
                                                        {taxRates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                    </select>
                                                )} />
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-slate-800">
                                                ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button type="button" onClick={() => remove(index)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <button type="button" onClick={() => append({ item_id: '', description: '', qty: 1, unit_price: 0, discount_pct: 0, tax_rate_id: '' })}
                            className="flex items-center gap-1.5 text-sm font-medium text-[#F59E0B] hover:text-[#D97706]">
                            <Plus size={16} /> Add Line Item
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Internal Notes</h3>
                        <Controller control={control} name="notes" render={({ field }) => (
                            <textarea {...field} className="w-full min-h-[80px] px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] resize-none text-sm" placeholder="Additional notes..." />
                        )} />
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Tax</span>
                            <span>₹{taxTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-200">
                            <span>Total</span>
                            <span className="text-[#F59E0B]">₹{(subtotal + taxTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 px-6 flex justify-end gap-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pl-24">
                    <Link href="/purchases/debit-notes" className="px-6 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium">Cancel</Link>
                    <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-8 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium disabled:opacity-70">
                        <Save size={18} />
                        {saveMutation.isPending ? 'Saving...' : 'Save Debit Note'}
                    </button>
                </div>
            </form>
        </div>
    );
}
