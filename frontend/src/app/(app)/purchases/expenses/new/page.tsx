'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { ArrowLeft, Save, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ExpenseFormData {
    date: string;
    category: string;
    amount: number;
    payment_mode: string;
    vendor_name: string;
    tax_amount: number;
    reference_number: string;
    notes: string;
}

const expenseCategories = [
    'Office Supplies', 'Travel & Transport', 'Meals & Entertainment',
    'Utilities', 'Rent & Leasing', 'Software & IT', 'Marketing', 'Consulting & Legal',
    'Postage & Shipping', 'Miscellaneous'
];

export default function NewExpensePage() {
    const router = useRouter();
    const [receiptFile, setReceiptFile] = useState<File | null>(null);

    const { control, handleSubmit, watch } = useForm<ExpenseFormData>({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            category: '',
            amount: 0,
            payment_mode: 'Cash',
            vendor_name: '',
            tax_amount: 0,
            reference_number: '',
            notes: '',
        }
    });

    const saveMutation = useMutation({
        mutationFn: async (data: ExpenseFormData) => {
            // First create expense
            const res = await api.post('/v1/expenses', data);

            // If receipt exists, upload it
            if (receiptFile && res.data?.id) {
                const formData = new FormData();
                formData.append('receipt', receiptFile);
                await api.post(`/v1/expenses/${res.data.id}/receipt`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            return res;
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
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
            <div className="flex items-center gap-4">
                <Link href="/purchases/expenses" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Record Expense</h1>
                    <p className="text-sm text-slate-500">Log a new business expense and attach receipts</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Basic Details</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date <span className="text-red-500">*</span></label>
                        <Controller control={control} name="date" rules={{ required: true }} render={({ field }) => (
                            <input type="date" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Expense Category <span className="text-red-500">*</span></label>
                        <Controller control={control} name="category" rules={{ required: true }} render={({ field }) => (
                            <select {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] bg-white">
                                <option value="">Select Category...</option>
                                {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                            <Controller control={control} name="amount" rules={{ required: true, min: 0.01 }} render={({ field }) => (
                                <input type="number" step="any" min="0" {...field} className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                            )} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tax Included (Optional)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                            <Controller control={control} name="tax_amount" render={({ field }) => (
                                <input type="number" step="any" min="0" {...field} className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                            )} />
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-4 mt-4">
                        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Payment Details</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Payment Mode</label>
                        <Controller control={control} name="payment_mode" render={({ field }) => (
                            <select {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] bg-white">
                                <option value="Cash">Cash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="UPI">UPI</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Reference No. / UPI Txn ID</label>
                        <Controller control={control} name="reference_number" render={({ field }) => (
                            <input type="text" {...field} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Paid To (Vendor Name)</label>
                        <Controller control={control} name="vendor_name" render={({ field }) => (
                            <input type="text" {...field} placeholder="e.g. Amazon, Uber, Local Store" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B]" />
                        )} />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-4 mt-4">
                        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Additional Info</h2>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                        <Controller control={control} name="notes" render={({ field }) => (
                            <textarea {...field} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] resize-y" placeholder="Any details..." />
                        )} />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Attach Receipt</label>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud size={32} className="text-slate-400 mb-2" />
                                <p className="mb-1 text-sm text-slate-500 font-medium">Click to upload or drag and drop</p>
                                <p className="text-xs text-slate-400">PDF, JPG, PNG (MAX. 5MB)</p>
                            </div>
                            <input type="file" className="hidden" accept=".pdf,image/png,image/jpeg" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} />
                        </label>
                        {receiptFile && (
                            <p className="text-sm text-emerald-600 mt-2 font-medium flex items-center gap-1">
                                ✓ Selected file: {receiptFile.name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Floating Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex justify-end gap-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pl-24 md:pl-64">
                    <Link href="/purchases/expenses" className="px-6 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium transition-colors">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saveMutation.isPending}
                        className="flex items-center gap-2 px-8 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] font-medium transition-colors disabled:opacity-70"
                    >
                        <Save size={18} />
                        {saveMutation.isPending ? 'Saving...' : 'Record Expense'}
                    </button>
                </div>
            </form>
        </div>
    );
}
