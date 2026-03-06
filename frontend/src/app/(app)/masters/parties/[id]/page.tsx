'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowLeft, Building, Phone, Mail, MapPin, CreditCard, FileText, Edit } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Party {
    id: number;
    name: string;
    type: 'customer' | 'supplier' | 'both';
    gstin: string | null;
    pan: string | null;
    phone: string | null;
    email: string | null;
    city: string | null;
    state: string | null;
    billing_address: string | null;
    credit_limit: number | null;
    payment_terms: number | null;
    balance: number;
}

interface Transaction {
    date: string;
    type: string;
    number: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
}

interface PartyStatement {
    party: Party;
    transactions: Transaction[];
    opening_balance: number;
    closing_balance: number;
}

const fmt = (n: number) => '₹' + Math.abs(Number(n)).toLocaleString('en-IN', { minimumFractionDigits: 2 });

function getFiscalYearStart() {
    const now = new Date();
    const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    return `${year}-04-01`;
}

const typeColors = {
    customer: 'bg-blue-50 text-blue-700',
    supplier: 'bg-emerald-50 text-emerald-700',
    both: 'bg-purple-50 text-purple-700',
};

const typeLabels = {
    customer: 'Customer',
    supplier: 'Supplier',
    both: 'Both',
};

export default function PartyDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [fromDate, setFromDate] = useState(getFiscalYearStart());
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

    const { data: party, isLoading: partyLoading, isError: partyError } = useQuery<Party>({
        queryKey: ['party', id],
        queryFn: () => api.get('/v1/parties/' + id).then(r => r.data),
        enabled: !!id,
    });

    const { data: statement, isLoading: statementLoading } = useQuery<PartyStatement>({
        queryKey: ['party-statement', id, fromDate, toDate],
        queryFn: () =>
            api.get(`/v1/reports/party-statement/${id}`, {
                params: { from_date: fromDate, to_date: toDate },
            }).then(r => r.data),
        enabled: !!id && !!fromDate && !!toDate,
    });

    if (partyLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" />
            </div>
        );
    }

    if (partyError || !party) {
        return <div className="text-center py-20 text-red-500">Failed to load data</div>;
    }

    const balance = party.balance ?? 0;
    const isCustomer = party.type === 'customer' || party.type === 'both';
    const balanceColor = balance === 0
        ? 'text-slate-600'
        : (isCustomer && balance > 0) || (!isCustomer && balance < 0)
            ? 'text-emerald-600'
            : 'text-rose-600';

    const outstandingCardColor = balance === 0
        ? 'bg-slate-50 border-slate-200'
        : balance > 0
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-rose-50 border-rose-200';

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/masters/parties"
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-slate-800">{party.name}</h1>
                            <span className={cn(
                                'px-2.5 py-1 text-xs font-semibold rounded-full',
                                typeColors[party.type]
                            )}>
                                {typeLabels[party.type]}
                            </span>
                        </div>
                        {party.gstin && (
                            <p className="text-sm text-slate-500 mt-0.5">GSTIN: {party.gstin}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <Link
                        href={`/masters/parties/${id}/edit`}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
                    >
                        <Edit size={16} />
                        Edit Party
                    </Link>
                    {isCustomer && (
                        <Link
                            href="/sales/invoices/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors font-medium text-sm shadow-sm"
                        >
                            <FileText size={16} />
                            New Invoice
                        </Link>
                    )}
                </div>
            </div>

            {/* Top Cards: Party Info + Outstanding */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Party Info Card */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Building size={18} className="text-slate-400" />
                        <h2 className="text-base font-semibold text-slate-800">Party Information</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {party.gstin && (
                            <div>
                                <p className="text-sm font-medium text-slate-500">GSTIN</p>
                                <p className="text-slate-800 font-medium mt-1 font-mono text-sm">{party.gstin}</p>
                            </div>
                        )}
                        {party.pan && (
                            <div>
                                <p className="text-sm font-medium text-slate-500">PAN</p>
                                <p className="text-slate-800 font-medium mt-1 font-mono text-sm">{party.pan}</p>
                            </div>
                        )}
                        {party.phone && (
                            <div>
                                <p className="text-sm font-medium text-slate-500">Phone</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Phone size={14} className="text-slate-400" />
                                    <p className="text-slate-800 font-medium text-sm">{party.phone}</p>
                                </div>
                            </div>
                        )}
                        {party.email && (
                            <div>
                                <p className="text-sm font-medium text-slate-500">Email</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Mail size={14} className="text-slate-400" />
                                    <p className="text-slate-800 font-medium text-sm">{party.email}</p>
                                </div>
                            </div>
                        )}
                        {(party.city || party.state) && (
                            <div>
                                <p className="text-sm font-medium text-slate-500">Location</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <MapPin size={14} className="text-slate-400" />
                                    <p className="text-slate-800 font-medium text-sm">
                                        {[party.city, party.state].filter(Boolean).join(', ')}
                                    </p>
                                </div>
                            </div>
                        )}
                        {party.billing_address && (
                            <div className="sm:col-span-2">
                                <p className="text-sm font-medium text-slate-500">Billing Address</p>
                                <p className="text-slate-800 font-medium mt-1 text-sm whitespace-pre-line">
                                    {party.billing_address}
                                </p>
                            </div>
                        )}
                        {party.credit_limit != null && party.credit_limit > 0 && (
                            <div>
                                <p className="text-sm font-medium text-slate-500">Credit Limit</p>
                                <p className="text-slate-800 font-medium mt-1">{fmt(party.credit_limit)}</p>
                            </div>
                        )}
                        {party.payment_terms != null && (
                            <div>
                                <p className="text-sm font-medium text-slate-500">Payment Terms</p>
                                <p className="text-slate-800 font-medium mt-1">{party.payment_terms} days</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Outstanding Balance Card */}
                <div className={cn('rounded-xl border shadow-sm p-6 flex flex-col justify-center', outstandingCardColor)}>
                    <div className="flex items-center gap-2 mb-3">
                        <CreditCard size={18} className="text-slate-500" />
                        <h2 className="text-base font-semibold text-slate-700">Outstanding Balance</h2>
                    </div>
                    <div className={cn('text-4xl font-bold mt-2', balanceColor)}>
                        {fmt(balance)}
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                        {balance === 0
                            ? 'No outstanding balance'
                            : balance > 0
                                ? isCustomer ? 'Receivable (Dr)' : 'Payable (Cr)'
                                : isCustomer ? 'Advance / Credit (Cr)' : 'Advance paid (Dr)'}
                    </p>
                </div>
            </div>

            {/* Party Statement */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-base font-semibold text-slate-800">Party Statement</h2>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-slate-500 whitespace-nowrap">From:</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={e => setFromDate(e.target.value)}
                                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-slate-500 whitespace-nowrap">To:</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={e => setToDate(e.target.value)}
                                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                </div>

                {statementLoading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" />
                    </div>
                ) : (
                    <>
                        {/* Opening Balance Row */}
                        {statement && (
                            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-sm">
                                <span className="font-medium text-slate-600">Opening Balance</span>
                                <span className={cn(
                                    'font-semibold',
                                    statement.opening_balance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                                )}>
                                    {statement.opening_balance >= 0
                                        ? `${fmt(statement.opening_balance)} Dr`
                                        : `${fmt(Math.abs(statement.opening_balance))} Cr`}
                                </span>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                        <th className="px-6 py-3 font-medium">Date</th>
                                        <th className="px-6 py-3 font-medium">Description</th>
                                        <th className="px-6 py-3 font-medium">Voucher #</th>
                                        <th className="px-6 py-3 font-medium text-right">Debit</th>
                                        <th className="px-6 py-3 font-medium text-right">Credit</th>
                                        <th className="px-6 py-3 font-medium text-right">Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {!statement || statement.transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                                                No transactions in this period
                                            </td>
                                        </tr>
                                    ) : (
                                        statement.transactions.map((tx, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50">
                                                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">
                                                    {format(new Date(tx.date), 'dd MMM yyyy')}
                                                </td>
                                                <td className="px-6 py-3 text-slate-800 font-medium">
                                                    {tx.description || tx.type}
                                                </td>
                                                <td className="px-6 py-3 text-slate-500">{tx.number || '—'}</td>
                                                <td className="px-6 py-3 text-right">
                                                    {tx.debit > 0 ? (
                                                        <span className="text-rose-600 font-medium">{fmt(tx.debit)}</span>
                                                    ) : (
                                                        <span className="text-slate-300">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    {tx.credit > 0 ? (
                                                        <span className="text-emerald-600 font-medium">{fmt(tx.credit)}</span>
                                                    ) : (
                                                        <span className="text-slate-300">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 text-right font-semibold text-slate-700">
                                                    {Math.abs(tx.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    <span className={cn(
                                                        'ml-1 text-xs font-medium',
                                                        tx.balance >= 0 ? 'text-rose-500' : 'text-emerald-500'
                                                    )}>
                                                        {tx.balance >= 0 ? 'Dr' : 'Cr'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Closing Balance Row */}
                        {statement && (
                            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-700">Closing Balance</span>
                                <span className={cn(
                                    'font-bold text-base',
                                    statement.closing_balance >= 0 ? 'text-rose-600' : 'text-emerald-600'
                                )}>
                                    {statement.closing_balance >= 0
                                        ? `${fmt(statement.closing_balance)} Dr`
                                        : `${fmt(Math.abs(statement.closing_balance))} Cr`}
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
