'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Download, Filter, Calendar, Calculator } from 'lucide-react';

export default function GSTR1ReportPage() {
    const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const period = `${year}-${month}`;

    const { data, isLoading } = useQuery({
        queryKey: ['gstr1', period],
        queryFn: async () => {
            const res = await api.get('/v1/reports/gst/gstr1', { params: { period } });
            return res.data;
        }
    });

    const b2bInvoices = data?.b2b || [];
    const b2cInvoices = data?.b2c || [];

    const safeSum = (arr: any[], key: string) => arr.reduce((sum, item) => sum + (item[key] || 0), 0);

    const summaryData = [
        { type: 'B2B Invoices', count: b2bInvoices.length, taxable: safeSum(b2bInvoices, 'taxable_value'), igst: safeSum(b2bInvoices, 'igst'), cgst: safeSum(b2bInvoices, 'cgst'), sgst: safeSum(b2bInvoices, 'sgst'), total: safeSum(b2bInvoices, 'total') },
        { type: 'B2C Invoices', count: b2cInvoices.length, taxable: safeSum(b2cInvoices, 'taxable_value'), igst: safeSum(b2cInvoices, 'igst'), cgst: safeSum(b2cInvoices, 'cgst'), sgst: safeSum(b2cInvoices, 'sgst'), total: safeSum(b2cInvoices, 'total') },
        { type: 'Credit/Debit Notes', count: 0, taxable: 0, igst: 0, cgst: 0, sgst: 0, total: 0 },
        { type: 'Export Invoices', count: 0, taxable: 0, igst: 0, cgst: 0, sgst: 0, total: 0 },
        { type: 'Nil Rated / Exempted', count: 0, taxable: 0, igst: 0, cgst: 0, sgst: 0, total: 0 },
    ];

    const totalRow = {
        count: summaryData.reduce((s, row) => s + row.count, 0),
        taxable: summaryData.reduce((s, row) => s + row.taxable, 0),
        igst: summaryData.reduce((s, row) => s + row.igst, 0),
        cgst: summaryData.reduce((s, row) => s + row.cgst, 0),
        sgst: summaryData.reduce((s, row) => s + row.sgst, 0),
        total: summaryData.reduce((s, row) => s + row.total, 0),
    };

    const handleExport = async () => {
        try {
            const res = await api.get('/v1/reports/gst/export', { params: { return_type: 'GSTR1', period } });
            const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `GSTR1_${period}.json`;
            a.click();
        } catch (e) {
            console.error('Export failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">GSTR-1</h1>
                    <p className="text-sm text-slate-500">Details of outward supplies of goods or services</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                        <div className="px-3 py-2 bg-slate-50 border-r border-slate-300 text-slate-500">
                            <Calendar size={18} />
                        </div>
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="px-3 py-2 bg-white outline-none text-sm font-medium"
                        >
                            {Array.from({ length: 12 }).map((_, i) => {
                                const m = (i + 1).toString().padStart(2, '0');
                                const name = new Date(2000, i, 1).toLocaleString('default', { month: 'long' });
                                return <option key={m} value={m}>{name}</option>;
                            })}
                        </select>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="px-3 py-2 bg-white outline-none border-l border-slate-200 text-sm font-medium"
                        >
                            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="font-bold text-slate-800">Return Summary</h2>
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B] text-[#0F172A] rounded-md hover:bg-[#D97706] transition-colors font-medium text-sm">
                        <Download size={16} />
                        Export JSON (GST Portal)
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-3 font-semibold">Table Details</th>
                                <th className="px-4 py-3 font-semibold text-right">Count</th>
                                <th className="px-4 py-3 font-semibold text-right">Taxable Value</th>
                                <th className="px-4 py-3 font-semibold text-right">IGST</th>
                                <th className="px-4 py-3 font-semibold text-right">CGST</th>
                                <th className="px-4 py-3 font-semibold text-right">SGST</th>
                                <th className="px-4 py-3 font-semibold text-right">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Loading Report Data...</td></tr>
                            ) : (
                                <>
                                    {summaryData.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-700">{row.type}</td>
                                            <td className="px-4 py-3 text-right text-slate-600">{row.count}</td>
                                            <td className="px-4 py-3 text-right text-slate-800 font-medium">₹{row.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-right text-slate-600">₹{row.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-right text-slate-600">₹{row.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-right text-slate-600">₹{row.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-right text-[#0F172A] font-bold">₹{row.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-slate-50 border-t-2 border-slate-300">
                                        <td className="px-4 py-3 font-bold text-slate-800 uppercase text-xs">Total</td>
                                        <td className="px-4 py-3 text-right font-bold text-slate-800">{totalRow.count}</td>
                                        <td className="px-4 py-3 text-right font-bold text-slate-800">₹{totalRow.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 text-right font-bold text-slate-800">₹{totalRow.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 text-right font-bold text-slate-800">₹{totalRow.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 text-right font-bold text-slate-800">₹{totalRow.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 text-right font-bold text-[#F59E0B]">₹{totalRow.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 flex items-start gap-3">
                <div className="p-1.5 bg-blue-100 rounded-full text-blue-600 mt-0.5"><Calculator size={16} /></div>
                <div>
                    <p className="font-bold mb-1">Important Note on GSTR-1</p>
                    <p>Please ensure all HSN/SAC codes are correctly mapped for items exceeding 1 Lakh in turnover. The exported JSON will be compatible with the offline utility tool.</p>
                </div>
            </div>
        </div>
    );
}
