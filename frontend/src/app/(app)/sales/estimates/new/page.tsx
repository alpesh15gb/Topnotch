'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface TaxRate {
    id: number;
    name: string;
    rate: number;
    type: string;
}

interface Item {
    id: number;
    name: string;
    hsn_sac: string | null;
    sale_price: number;
    tax_rate_id: number | null;
    tax_rate: TaxRate | null;
}

interface Party {
    id: number;
    name: string;
}

interface EstimateFormData {
    party_id: number | '';
    date: string;
    expiry_date: string;
    notes: string;
    items: {
        item_id: number | '';
        description: string;
        qty: number;
        unit_price: number;
        discount_pct: number;
        tax_rate_id: number | '';
        tax_rate_obj?: TaxRate | null;
    }[];
}

export default function NewEstimatePage() {
    const router = useRouter();

    const { control, handleSubmit, watch, setValue } = useForm<EstimateFormData>({
        defaultValues: {
            party_id: '',
            date: new Date().toISOString().split('T')[0],
            expiry_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            notes: '',
            items: [
                { item_id: '', description: '', qty: 1, unit_price: 0, discount_pct: 0, tax_rate_id: '' }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'items' });

    const watchItems = watch('items');

    const { data: parties } = useQuery({
        queryKey: ['parties', 'customers'],
        queryFn: async () => (await api.get('/v1/parties', { params: { type: 'customer' } })).data.data as Party[]
    });

    const { data: itemsList } = useQuery({
        queryKey: ['items', 'all'],
        queryFn: async () => (await api.get('/v1/items')).data.data as Item[]
    });

    const { data: taxRates } = useQuery({
        queryKey: ['tax-rates'],
        queryFn: async () => (await api.get('/v1/tax-rates')).data as TaxRate[]
    });

    const totals = useMemo(() => {
        let subtotal = 0;
        let cgstAmount = 0;
        let sgstAmount = 0;

        watchItems.forEach((item) => {
            const lineTotal = (Number(item.qty) || 0) * (Number(item.unit_price) || 0) * (1 - (Number(item.discount_pct) || 0) / 100);
            subtotal += lineTotal;
            if (item.tax_rate_obj) {
                const rate = item.tax_rate_obj.rate;
                cgstAmount += (lineTotal * (rate / 2)) / 100;
                sgstAmount += (lineTotal * (rate / 2)) / 100;
            }
        });

        const taxTotal = cgstAmount + sgstAmount;
        const grandTotal = subtotal + taxTotal;

        return { subtotal, cgstAmount, sgstAmount, taxTotal, grandTotal };
    }, [watchItems]);

    const handleItemSelect = (index: number, itemId: number) => {
        const item = itemsList?.find(i => i.id === itemId);
        if (item) {
            setValue(`items.${index}.description`, `${item.name}${item.hsn_sac ? ` (HSN: ${item.hsn_sac})` : ''}`);
            setValue(`items.${index}.unit_price`, item.sale_price || 0);
            setValue(`items.${index}.tax_rate_id`, item.tax_rate_id || '');
            setValue(`items.${index}.tax_rate_obj`, item.tax_rate);
        }
    };

    const handleTaxRateChange = (index: number, rateId: number) => {
        const rate = taxRates?.find(t => t.id === rateId);
        setValue(`items.${index}.tax_rate_obj`, rate || null);
    };

    const saveMutation = useMutation({
        mutationFn: async (data: EstimateFormData) => {
            const payload = {
                party_id: data.party_id,
                date: data.date,
                expiry_date: data.expiry_date,
                notes: data.notes,
                items: data.items.map(item => {
                    const rate = item.tax_rate_obj?.rate || 0;
                    return {
                        item_id: item.item_id || null,
                        description: item.description,
                        qty: Number(item.qty),
                        unit_price: Number(item.unit_price),
                        discount_pct: Number(item.discount_pct),
                        tax_rate_id: item.tax_rate_id || null,
                        cgst_rate: rate / 2,
                        sgst_rate: rate / 2,
                        igst_rate: 0,
                    };
                })
            };
            return api.post('/v1/estimates', payload);
        },
        onSuccess: () => {
            toast.success('Estimate created successfully');
            router.push('/sales/estimates');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to create estimate');
        }
    });

    const onSubmit = (data: EstimateFormData) => {
        saveMutation.mutate(data);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-24">
            <div className="flex items-center gap-4">
                <Link href="/sales/estimates" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">New Estimate</h1>
                    <p className="text-sm text-slate-500">Draft a new sales quote for a customer</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Header Details */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 md:col-span-3 lg:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Customer <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            control={control}
                            name="party_id"
                            rules={{ required: 'Customer is required' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <select
                                        {...field}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent bg-white"
                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                                    >
                                        <option value="">Select Customer...</option>
                                        {parties?.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                                </>
                            )}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Estimate Date <span className="text-red-500">*</span>
                        </label>
                        <Controller control={control} name="date" rules={{ required: true }} render={({ field }) => (
                            <input type="date" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Valid Until</label>
                        <Controller control={control} name="expiry_date" render={({ field }) => (
                            <input type="date" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>
                </div>

                {/* Line Items */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800">Line Items</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="px-4 py-3 font-medium w-56">Item</th>
                                    <th className="px-4 py-3 font-medium">Description</th>
                                    <th className="px-4 py-3 font-medium w-24 text-right">Qty</th>
                                    <th className="px-4 py-3 font-medium w-32 text-right">Price</th>
                                    <th className="px-4 py-3 font-medium w-24 text-right">Disc. %</th>
                                    <th className="px-4 py-3 font-medium w-36">Tax Rate</th>
                                    <th className="px-4 py-3 font-medium w-32 text-right">Amount</th>
                                    <th className="w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {fields.map((field, index) => {
                                    const item = watchItems[index];
                                    const lineTotal = (Number(item.qty) || 0) * (Number(item.unit_price) || 0) * (1 - (Number(item.discount_pct) || 0) / 100);

                                    return (
                                        <tr key={field.id} className="align-top group hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.item_id`} render={({ field: sf }) => (
                                                    <select
                                                        {...sf}
                                                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B] bg-white"
                                                        onChange={(e) => {
                                                            const val = e.target.value ? Number(e.target.value) : '';
                                                            sf.onChange(val);
                                                            if (val !== '') handleItemSelect(index, val as number);
                                                        }}
                                                    >
                                                        <option value="">Custom Item</option>
                                                        {itemsList?.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                                    </select>
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.description`} render={({ field: df }) => (
                                                    <textarea {...df} rows={1} className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B] resize-y" placeholder="Item description..." />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.qty`} render={({ field: qf }) => (
                                                    <input type="number" step="any" min="0" {...qf} className="w-full px-2 py-1.5 text-sm text-right border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B]" />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.unit_price`} render={({ field: pf }) => (
                                                    <input type="number" step="any" min="0" {...pf} className="w-full px-2 py-1.5 text-sm text-right border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B]" />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.discount_pct`} render={({ field: df }) => (
                                                    <input type="number" step="any" min="0" max="100" {...df} className="w-full px-2 py-1.5 text-sm text-right border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B]" />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.tax_rate_id`} render={({ field: tf }) => (
                                                    <select
                                                        {...tf}
                                                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B] bg-white"
                                                        onChange={(e) => {
                                                            const val = e.target.value ? Number(e.target.value) : '';
                                                            tf.onChange(val);
                                                            if (val !== '') handleTaxRateChange(index, val as number);
                                                            else setValue(`items.${index}.tax_rate_obj`, null);
                                                        }}
                                                    >
                                                        <option value="">None (0%)</option>
                                                        {taxRates?.map(t => <option key={t.id} value={t.id}>{t.name} ({t.rate}%)</option>)}
                                                    </select>
                                                )} />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="pt-2 font-medium text-slate-800 tabular-nums">
                                                    ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="pt-1.5 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                >
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
                        <button
                            type="button"
                            onClick={() => append({ item_id: '', description: '', qty: 1, unit_price: 0, discount_pct: 0, tax_rate_id: '' })}
                            className="flex items-center gap-1.5 text-sm font-medium text-[#F59E0B] hover:text-[#D97706] transition-colors"
                        >
                            <Plus size={16} /> Add Line Item
                        </button>
                    </div>
                </div>

                {/* Totals & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Terms & Notes</h3>
                        <Controller control={control} name="notes" render={({ field }) => (
                            <textarea
                                {...field}
                                className="w-full flex-1 min-h-[120px] px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none text-sm"
                                placeholder="Quote valid for 30 days. Subject to terms and conditions..."
                            />
                        )} />
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal:</span>
                                <span className="font-medium">₹{totals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            {totals.taxTotal > 0 && (
                                <div className="py-2 border-y border-slate-100 space-y-2">
                                    <div className="flex justify-between text-slate-500 text-xs">
                                        <span>CGST:</span>
                                        <span>₹{totals.cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 text-xs">
                                        <span>SGST:</span>
                                        <span>₹{totals.sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                                <span className="text-base font-bold text-slate-800">Grand Total:</span>
                                <span className="text-xl font-bold text-[#F59E0B]">
                                    ₹{totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 px-6 flex justify-end gap-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pl-24 transition-all duration-300">
                    <Link href="/sales/estimates" className="px-6 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium transition-colors">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saveMutation.isPending}
                        className="flex items-center gap-2 px-8 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium transition-colors disabled:opacity-70"
                    >
                        <Save size={18} />
                        {saveMutation.isPending ? 'Saving...' : 'Save Estimate'}
                    </button>
                </div>
            </form>
        </div>
    );
}
