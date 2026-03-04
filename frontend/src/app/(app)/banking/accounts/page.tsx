'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Search, Building2 } from 'lucide-react';
import Link from 'next/link';

interface BankAccount {
    id: number;
    name: string;
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    balance: number;
    type: string;
}

export default function BankAccountsPage() {
    const [search, setSearch] = useState('');

    const { data: accounts, isLoading } = useQuery({
        queryKey: ['bank_accounts', search],
        queryFn: async () => {
            // Typically banking is part of chart of accounts mapped specially, but assuming a dedicated endpoint for dashboard
            const res = await api.get('/v1/accounts', {
                params: { search, type: 'bank' } // Mock filter
            }).catch(() => ({ data: { data: [] } }));
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Bank Accounts</h1>
                    <p className="text-sm text-slate-500">Manage your company bank and cash accounts</p>
                </div>

                <button
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Add Bank Account</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Cash in Hand Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            <span className="font-bold text-xl">₹</span>
                        </div>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">Cash Account</h3>
                    <p className="text-sm text-slate-500 mb-4">Main Cash Register</p>
                    <div className="pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-500">Current Balance</p>
                        <p className="text-2xl font-bold text-emerald-600">₹45,200.00</p>
                    </div>
                </div>

                {isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-pulse">
                            <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
                            <div className="h-6 bg-slate-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-slate-100 rounded w-3/4 mb-4"></div>
                            <div className="pt-4 border-t border-slate-100 mt-4">
                                <div className="h-4 bg-slate-100 rounded w-1/3 mb-2"></div>
                                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))
                ) : accounts?.data?.length === 0 ? (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-lg font-medium text-slate-700">No bank accounts added</p>
                        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Connect your bank account to start tracking incoming and outgoing payments automatically.</p>
                    </div>
                ) : (
                    accounts?.data?.map((account: BankAccount) => (
                        <div key={account.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                    <Building2 size={24} />
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">{account.bank_name || account.name}</h3>
                            <p className="text-sm text-slate-500 mb-4 font-mono">{account.account_number ? `****${account.account_number.slice(-4)}` : account.name}</p>
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-sm text-slate-500">Current Balance</p>
                                <p className={`text-2xl font-bold ${account.balance < 0 ? 'text-red-500' : 'text-slate-800'}`}>
                                    ₹{Math.abs(account.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
