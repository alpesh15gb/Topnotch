'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Download, Filter, Calendar, AlertCircle } from 'lucide-react';

export default function GSTR2BReportPage() {
    const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const period = `${year}-${month}`;

    const { data, isLoading } = useQuery({
        queryKey: ['gstr2b', period],
        queryFn: async () => {
            const res = await api.get('/v1/reports/gst/gstr2', { params: { period } });
            return res.data;
        }
    });

    const b2bInvoices = data?.b2b || [];

    const safeSum = (arr: any[], key: string) => arr.reduce((sum, item) => sum + (item[key] || 0), 0);

    const itcEligibleCount = b2bInvoices.filter((i: any) => i.itc_eligible).length;
    const itcIneligibleCount = b2bInvoices.filter((i: any) => !i.itc_eligible).length;

    const summaryData = [
        {
            type: 'B2B Invoices (ITC Available)',
            count: itcEligibleCount,
            taxable: safeSum(b2bInvoices.filter((i: any) => i.itc_eligible), 'taxable_value'),
            igst: safeSum(b2bInvoices.filter((i: any) => i.itc_eligible), 'igst'),
            cgst: safeSum(b2bInvoices.filter((i: any) => i.itc_eligible), 'cgst'),
            sgst: safeSum(b2bInvoices.filter((i: any) => i.itc_eligible), 'sgst'),
            cess: 0
        },
        {
            type: 'Ineligible ITC',
            count: itcIneligibleCount,
            taxable: safeSum(b2bInvoices.filter((i: any) => !i.itc_eligible), 'taxable_value'),
            igst: safeSum(b2bInvoices.filter((i: any) => !i.itc_eligible), 'igst'),
            cgst: safeSum(b2bInvoices.filter((i: any) => !i.itc_eligible), 'cgst'),
            sgst: safeSum(b2bInvoices.filter((i: any) => !i.itc_eligible), 'sgst'),
            cess: 0
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">GSTR-2 (Purchase Register)</h1>
                    <p className="text-sm text-slate-500">Summary of inward supplies and ITC</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                        <div className="px-3 py-2 bg-slate-50 border-r border-slate-300 text-slate-500">
                            <Calendar size={18} />
                        </div>
                        <select value={month} onChange={(e) => setMonth(e.target.value)} className="px-3 py-2 bg-white outline-none text-sm font-medium">
                            {Array.from({ length: 12 }).map((_, i) => {
                                const m = (i + 1).toString().padStart(2, '0');
                                const name = new Date(2000, i, 1).toLocaleString('default', { month: 'long' });
                                return <option key={m} value={m}>{name}</option>;
                            })}
                        </select>
                        <select value={year} onChange={(e) => setYear(e.target.value)} className="px-3 py-2 bg-white outline-none border-l border-slate-200 text-sm font-medium">
                            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-center">
                    <p className="text-sm text-slate-500">Total Purchase Bills</p>
                    <p className="text-2xl font-bold text-slate-800">{data?.total_bills || 0}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-center">
                    <p className="text-sm text-slate-500">Total Taxable Value</p>
                    <p className="text-2xl font-bold text-slate-800">₹{(data?.total_taxable_value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-center border-l-4 border-emerald-500">
                    <p className="text-sm text-slate-500">Total ITC Available</p>
                    <p className="text-2xl font-bold text-emerald-600">₹{(data?.total_itc || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-bold text-slate-800">ITC Summary</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-3 font-semibold">Type</th>
                                <th className="px-4 py-3 font-semibold text-right">Count</th>
                                <th className="px-4 py-3 font-semibold text-right">Taxable Value</th>
                                <th className="px-4 py-3 font-semibold text-right">IGST</th>
                                <th className="px-4 py-3 font-semibold text-right">CGST</th>
                                <th className="px-4 py-3 font-semibold text-right">SGST</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading Report Data...</td></tr>
                            ) : (
                                summaryData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-700">{row.type}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">{row.count}</td>
                                        <td className="px-4 py-3 text-right text-slate-800">₹{row.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">₹{row.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">₹{row.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">₹{row.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 flex items-start gap-3">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <div>
                    <p className="font-bold mb-1">About Purchase Register</p>
                    <p>This report represents your internal purchase books. Cross verification with GSTR-2B from the portal is usually done manually or via a third-party GST utility to claim ITC correctly.</p>
                </div>
            </div>
        </div>
    );
}
