'use client';

import { useState, useMemo } from 'react';
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
    supply_state: string;
}

interface PurchaseBillFormData {
    party_id: number | '';
    date: string;
    due_date: string;
    supply_state: string;
    is_igst: boolean;
    notes: string;
    vendor_invoice_number: string;
    items: {
        item_id: number | '';
        description: string;
        qty: number;
        unit_price: number;
        discount_pct: number;
        tax_rate_id: number | '';
        tax_rate_obj?: TaxRate | null;
    }[];
    discount: number;
    tcs_rate: number;
}

export default function NewPurchaseBillPage() {
    const router = useRouter();
    const [activeTenantState, setActiveTenantState] = useState('Maharashtra'); // Mocked for now

    const { control, handleSubmit, watch, setValue } = useForm<PurchaseBillFormData>({
        defaultValues: {
            party_id: '',
            date: new Date().toISOString().split('T')[0],
            due_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
            supply_state: '',
            is_igst: false,
            vendor_invoice_number: '',
            notes: '',
            discount: 0,
            tcs_rate: 0,
            items: [
                { item_id: '', description: '', qty: 1, unit_price: 0, discount_pct: 0, tax_rate_id: '' }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items'
    });

    const watchItems = watch('items');
    const watchDiscount = watch('discount');
    const watchTcs = watch('tcs_rate');
    const watchIsIgst = watch('is_igst');

    // Load masters component data
    const { data: parties } = useQuery({
        queryKey: ['parties', 'vendors'],
        queryFn: async () => (await api.get('/v1/parties?type=vendor')).data.data as Party[]
    });

    const { data: itemsList } = useQuery({
        queryKey: ['items', 'all'],
        queryFn: async () => (await api.get('/v1/items')).data.data as Item[]
    });

    const { data: taxRates } = useQuery({
        queryKey: ['tax-rates'],
        queryFn: async () => (await api.get('/v1/tax-rates')).data as TaxRate[]
    });

    // Calculate totals
    const totals = useMemo(() => {
        let subtotal = 0;
        let cgstAmount = 0;
        let sgstAmount = 0;
        let igstAmount = 0;

        watchItems.forEach((item) => {
            const lineTotal = (Number(item.qty) || 0) * (Number(item.unit_price) || 0) * (1 - (Number(item.discount_pct) || 0) / 100);
            subtotal += lineTotal;

            if (item.tax_rate_obj) {
                const rate = item.tax_rate_obj.rate;
                if (watchIsIgst) {
                    igstAmount += (lineTotal * rate) / 100;
                } else {
                    cgstAmount += (lineTotal * (rate / 2)) / 100;
                    sgstAmount += (lineTotal * (rate / 2)) / 100;
                }
            }
        });

        const discountAmount = Number(watchDiscount) || 0;
        const taxTotal = cgstAmount + sgstAmount + igstAmount;

        // TCS is calculated on (Subtotal - Discount + Tax)
        const taxableForTcs = Math.max(0, subtotal - discountAmount + taxTotal);
        const tcsAmount = (taxableForTcs * (Number(watchTcs) || 0)) / 100;

        const grandTotal = subtotal - discountAmount + taxTotal + tcsAmount;

        return { subtotal, cgstAmount, sgstAmount, igstAmount, taxTotal, tcsAmount, grandTotal };
    }, [watchItems, watchDiscount, watchTcs, watchIsIgst]);

    const handlePartyChange = (partyId: number) => {
        const party = parties?.find(p => p.id === partyId);
        if (party) {
            setValue('supply_state', party.supply_state || '');
            setValue('is_igst', party.supply_state !== activeTenantState);
        }
    };

    const handleItemSelect = (index: number, itemId: number) => {
        const item = itemsList?.find(i => i.id === itemId);
        if (item) {
            setValue(`items.${index}.description`, `${item.name}${item.hsn_sac ? ` (HSN: ${item.hsn_sac})` : ''}`);
            setValue(`items.${index}.unit_price`, item.sale_price || 0); // Usually purchase price, but placeholder for now
            setValue(`items.${index}.tax_rate_id`, item.tax_rate_id || '');
            setValue(`items.${index}.tax_rate_obj`, item.tax_rate);
        }
    };

    const handleTaxRateChange = (index: number, rateId: number) => {
        const rate = taxRates?.find(t => t.id === rateId);
        setValue(`items.${index}.tax_rate_obj`, rate || null);
    };

    const saveMutation = useMutation({
        mutationFn: async (data: any) => {
            return api.post('/v1/purchase-bills', data);
        },
        onSuccess: (res) => {
            toast.success('Purchase bill recorded successfully');
            router.push(`/purchases/bills/${res.data.id}`);
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to record purchase bill');
        }
    });

    const onSubmit = (data: PurchaseBillFormData) => {
        // Add tax rate breakdowns to payload
        const payload = {
            ...data,
            items: data.items.map(item => {
                const rate = item.tax_rate_obj?.rate || 0;
                return {
                    ...item,
                    cgst_rate: data.is_igst ? 0 : rate / 2,
                    sgst_rate: data.is_igst ? 0 : rate / 2,
                    igst_rate: data.is_igst ? rate : 0,
                };
            })
        };
        saveMutation.mutate(payload);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-24">
            <div className="flex items-center gap-4">
                <Link href="/purchases/bills" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Record Bill</h1>
                    <p className="text-sm text-slate-500">Record a new purchase bill from a vendor</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Top Details */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="col-span-1 md:col-span-4 lg:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Vendor <span className="text-red-500">*</span></label>
                        <Controller
                            control={control}
                            name="party_id"
                            rules={{ required: 'Vendor is required' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <select
                                        {...field}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent bg-white"
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            field.onChange(val);
                                            handlePartyChange(val);
                                        }}
                                    >
                                        <option value="">Select Vendor...</option>
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Bill No.</label>
                        <Controller control={control} name="vendor_invoice_number" render={({ field }) => (
                            <input type="text" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Bill Date <span className="text-red-500">*</span></label>
                        <Controller control={control} name="date" rules={{ required: true }} render={({ field }) => (
                            <input type="date" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                        <Controller control={control} name="due_date" render={({ field }) => (
                            <input type="date" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div className="col-span-1 md:col-span-4 flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 mt-2">
                        <div>
                            <p className="text-sm font-medium text-slate-700">Tax Setup</p>
                            <p className="text-xs text-slate-500 mt-0.5">Determine GST types based on supply location</p>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-slate-600">Place of Supply:</label>
                                <Controller control={control} name="supply_state" render={({ field }) => (
                                    <input type="text" {...field} className="px-2 py-1 text-sm border border-slate-300 rounded w-32" placeholder="State" />
                                )} />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <Controller control={control} name="is_igst" render={({ field }) => (
                                    <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} className="w-4 h-4 text-[#F59E0B] rounded focus:ring-[#F59E0B]" />
                                )} />
                                <span className="text-sm font-medium text-slate-700">Inter-State (IGST)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* ... Similar Line Items as Invoice form ... */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800">Item Details</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="px-4 py-3 font-medium w-64">Item</th>
                                    <th className="px-4 py-3 font-medium">Description</th>
                                    <th className="px-4 py-3 font-medium w-24 text-right">Qty</th>
                                    <th className="px-4 py-3 font-medium w-32 text-right">Price</th>
                                    <th className="px-4 py-3 font-medium w-24 text-right">Disc. %</th>
                                    <th className="px-4 py-3 font-medium w-32">Tax Rate</th>
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
                                                <Controller control={control} name={`items.${index}.item_id`} render={({ field: selectField }) => (
                                                    <select
                                                        {...selectField}
                                                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B] bg-white"
                                                        onChange={(e) => {
                                                            const val = e.target.value ? Number(e.target.value) : '';
                                                            selectField.onChange(val);
                                                            if (val !== '') handleItemSelect(index, val);
                                                        }}
                                                    >
                                                        <option value="">Custom Item</option>
                                                        {itemsList?.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                                    </select>
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.description`} render={({ field: descField }) => (
                                                    <textarea {...descField} rows={1} className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B] resize-y" placeholder="Item description..." />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.qty`} render={({ field: qtyField }) => (
                                                    <input type="number" step="any" min="0" {...qtyField} className="w-full px-2 py-1.5 text-sm text-right border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B]" />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.unit_price`} render={({ field: priceField }) => (
                                                    <input type="number" step="any" min="0" {...priceField} className="w-full px-2 py-1.5 text-sm text-right border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B]" />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.discount_pct`} render={({ field: discField }) => (
                                                    <input type="number" step="any" min="0" max="100" {...discField} className="w-full px-2 py-1.5 text-sm text-right border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B]" />
                                                )} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Controller control={control} name={`items.${index}.tax_rate_id`} render={({ field: taxField }) => (
                                                    <select
                                                        {...taxField}
                                                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B] bg-white"
                                                        onChange={(e) => {
                                                            const val = e.target.value ? Number(e.target.value) : '';
                                                            taxField.onChange(val);
                                                            if (val !== '') handleTaxRateChange(index, val);
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

                {/* Totals & Notes - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Remarks</h3>
                        <Controller control={control} name="notes" render={({ field }) => (
                            <textarea
                                {...field}
                                className="w-full flex-1 min-h-[120px] px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none text-sm"
                                placeholder="Internal notes regarding this purchase..."
                            />
                        )} />
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal:</span>
                                <span className="font-medium">₹{totals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>

                            <div className="flex justify-between items-center text-slate-600">
                                <span>Total Discount (₹):</span>
                                <Controller control={control} name="discount" render={({ field }) => (
                                    <input type="number" step="any" min="0" {...field} className="w-24 px-2 py-1 text-right border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B]" />
                                )} />
                            </div>

                            {totals.taxTotal > 0 && (
                                <div className="py-2 border-y border-slate-100 space-y-2">
                                    {watchIsIgst ? (
                                        <div className="flex justify-between text-slate-500 text-xs">
                                            <span>IGST:</span>
                                            <span>₹{totals.igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between text-slate-500 text-xs">
                                                <span>CGST:</span>
                                                <span>₹{totals.cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between text-slate-500 text-xs">
                                                <span>SGST:</span>
                                                <span>₹{totals.sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-between items-center text-slate-600">
                                <span>TCS Rate (%):</span>
                                <Controller control={control} name="tcs_rate" render={({ field }) => (
                                    <input type="number" step="any" min="0" max="100" {...field} className="w-16 px-2 py-1 text-right border border-slate-300 rounded focus:ring-1 focus:ring-[#F59E0B]" />
                                )} />
                            </div>

                            {totals.tcsAmount > 0 && (
                                <div className="flex justify-between text-slate-500 text-xs">
                                    <span>TCS Amount:</span>
                                    <span>₹{totals.tcsAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                    <Link href="/purchases/bills" className="px-6 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium transition-colors">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saveMutation.isPending}
                        className="flex items-center gap-2 px-8 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium transition-colors disabled:opacity-70"
                    >
                        <Save size={18} />
                        {saveMutation.isPending ? 'Saving...' : 'Record Bill'}
                    </button>
                </div>
            </form>
        </div>
    );
}
