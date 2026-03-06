'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface TaxRate {
    id: number;
    name: string;
    rate: number;
}

interface Account {
    id: number;
    name: string;
    type: string;
}

interface Party {
    id: number;
    name: string;
}

interface ExpenseFormData {
    date: string;
    category: string;
    description: string;
    amount: number;
    tax_rate_id: number | '';
    account_id: number | '';
    party_id: number | '';
    is_recurring: boolean;
    recurring_frequency: string;
    notes: string;
}

const EXPENSE_CATEGORIES = [
    'Travel',
    'Office Supplies',
    'Meals & Entertainment',
    'Utilities',
    'Salaries',
    'Rent',
    'Marketing',
    'Other',
];

export default function NewExpensePage() {
    const router = useRouter();

    const { control, handleSubmit, watch } = useForm<ExpenseFormData>({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            category: '',
            description: '',
            amount: 0,
            tax_rate_id: '',
            account_id: '',
            party_id: '',
            is_recurring: false,
            recurring_frequency: 'monthly',
            notes: '',
        }
    });

    const watchAmount = watch('amount');
    const watchTaxRateId = watch('tax_rate_id');
    const watchIsRecurring = watch('is_recurring');

    const { data: accounts } = useQuery({
        queryKey: ['accounts', 'all'],
        queryFn: async () => (await api.get('/v1/accounts')).data.data as Account[]
    });

    const { data: parties } = useQuery({
        queryKey: ['parties', 'all'],
        queryFn: async () => (await api.get('/v1/parties')).data.data as Party[]
    });

    const { data: taxRates } = useQuery({
        queryKey: ['tax-rates'],
        queryFn: async () => (await api.get('/v1/tax-rates')).data as TaxRate[]
    });

    const selectedTaxRate = taxRates?.find(t => t.id === Number(watchTaxRateId));
    const taxAmount = selectedTaxRate ? (Number(watchAmount) || 0) * selectedTaxRate.rate / 100 : 0;

    const saveMutation = useMutation({
        mutationFn: async (data: ExpenseFormData) => {
            const payload = {
                ...data,
                amount: Number(data.amount),
                tax_rate_id: data.tax_rate_id || null,
                account_id: data.account_id || null,
                party_id: data.party_id || null,
                recurring_frequency: data.is_recurring ? data.recurring_frequency : null,
            };
            return api.post('/v1/expenses', payload);
        },
        onSuccess: () => {
            toast.success('Expense recorded successfully');
            router.push('/purchases/expenses');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to record expense');
        }
    });

    const onSubmit = (data: ExpenseFormData) => {
        saveMutation.mutate(data);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-24">
            <div className="flex items-center gap-4">
                <Link href="/purchases/expenses" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">New Expense</h1>
                    <p className="text-sm text-slate-500">Record a business expense</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                    <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3">Expense Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <Controller control={control} name="date" rules={{ required: true }} render={({ field }) => (
                                <input type="date" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                            )} />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <Controller control={control} name="category" render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        list="expense-categories"
                                        placeholder="Select or type a category..."
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]"
                                    />
                                    <datalist id="expense-categories">
                                        {EXPENSE_CATEGORIES.map(c => <option key={c} value={c} />)}
                                    </datalist>
                                </>
                            )} />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <Controller control={control} name="description" rules={{ required: 'Description is required' }} render={({ field, fieldState }) => (
                                <>
                                    <textarea {...field} rows={2} placeholder="Brief description of the expense..." className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] resize-y" />
                                    {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                                </>
                            )} />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                                <Controller control={control} name="amount" rules={{ required: true, min: 0.01 }} render={({ field, fieldState }) => (
                                    <>
                                        <input type="number" step="any" min="0.01" {...field} className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                                        {fieldState.error && <p className="text-red-500 text-xs mt-1">Valid amount required</p>}
                                    </>
                                )} />
                            </div>
                        </div>

                        {/* Tax Rate */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tax Rate (Optional)</label>
                            <Controller control={control} name="tax_rate_id" render={({ field }) => (
                                <select
                                    {...field}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] bg-white"
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                                >
                                    <option value="">No Tax</option>
                                    {taxRates?.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.rate}%)</option>
                                    ))}
                                </select>
                            )} />
                        </div>

                        {/* Tax breakdown */}
                        {selectedTaxRate && taxAmount > 0 && (
                            <div className="md:col-span-2 bg-amber-50 border border-amber-100 rounded-lg p-4">
                                <div className="flex justify-between text-sm text-amber-800">
                                    <span>Base Amount:</span>
                                    <span className="font-medium">₹{Number(watchAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-sm text-amber-800 mt-1">
                                    <span>{selectedTaxRate.name} ({selectedTaxRate.rate}%):</span>
                                    <span className="font-medium">₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-amber-900 mt-2 pt-2 border-t border-amber-200">
                                    <span>Total (incl. tax):</span>
                                    <span>₹{(Number(watchAmount) + taxAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
                    <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3">Account & Vendor</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Account */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Account <span className="text-red-500">*</span>
                            </label>
                            <Controller control={control} name="account_id" rules={{ required: 'Account is required' }} render={({ field, fieldState }) => (
                                <>
                                    <select
                                        {...field}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] bg-white"
                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                                    >
                                        <option value="">Select Account...</option>
                                        {accounts?.map(a => (
                                            <option key={a.id} value={a.id}>{a.name}</option>
                                        ))}
                                    </select>
                                    {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                                </>
                            )} />
                        </div>

                        {/* Party / Vendor */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Vendor (Optional)</label>
                            <Controller control={control} name="party_id" render={({ field }) => (
                                <select
                                    {...field}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] bg-white"
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                                >
                                    <option value="">Select vendor (optional)</option>
                                    {parties?.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            )} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
                    <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3">Additional Info</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Is Recurring */}
                        <div className="md:col-span-2">
                            <Controller control={control} name="is_recurring" render={({ field }) => (
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        className="w-4 h-4 text-[#F59E0B] rounded focus:ring-[#F59E0B]"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Recurring Expense</span>
                                </label>
                            )} />
                        </div>

                        {/* Recurring Frequency */}
                        {watchIsRecurring && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                                <Controller control={control} name="recurring_frequency" render={({ field }) => (
                                    <select {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] bg-white">
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                )} />
                            </div>
                        )}

                        {/* Notes */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                            <Controller control={control} name="notes" render={({ field }) => (
                                <textarea {...field} rows={3} placeholder="Any additional notes..." className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] resize-y" />
                            )} />
                        </div>
                    </div>
                </div>

                {/* Floating Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 px-6 flex justify-end gap-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pl-24 transition-all duration-300">
                    <Link href="/purchases/expenses" className="px-6 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium transition-colors">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saveMutation.isPending}
                        className="flex items-center gap-2 px-8 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium transition-colors disabled:opacity-70"
                    >
                        <Save size={18} />
                        {saveMutation.isPending ? 'Saving...' : 'Save Expense'}
                    </button>
                </div>
            </form>
        </div>
    );
}
