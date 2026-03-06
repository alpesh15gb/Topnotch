'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Download, Calculator, Calendar } from 'lucide-react';

export default function GSTR3BReportPage() {
    const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const period = `${year}-${month}`;

    const { data, isLoading } = useQuery({
        queryKey: ['gstr3b', period],
        queryFn: async () => {
            const res = await api.get('/v1/reports/gst/gstr3b', { params: { period } });
            return res.data;
        }
    });

    const outward = data?.outward_tax || { taxable_value: 0, igst: 0, cgst: 0, sgst: 0 };
    const itc = data?.itc_available || { igst: 0, cgst: 0, sgst: 0 };
    const payable = data?.tax_payable || { igst: 0, cgst: 0, sgst: 0 };

    const summaryData = [
        { section: '3.1 Details of Outward Supplies and inward supplies liable to reverse charge' },
        { type: '(a) Outward taxable supplies (other than zero rated, nil rated and exempted)', taxable: outward.taxable_value, igst: outward.igst, cgst: outward.cgst, sgst: outward.sgst, cess: 0 },
        { type: '(b) Outward taxable supplies (zero rated)', taxable: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 },
        { type: '(c) Other outward supplies (Nil rated, exempted)', taxable: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 },
        { type: '(d) Inward supplies (liable to reverse charge)', taxable: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 },
        { type: '(e) Non-GST outward supplies', taxable: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 },
        { section: '4. Eligible ITC' },
        { type: '(A) ITC Available (whether in full or part)', taxable: null, igst: itc.igst, cgst: itc.cgst, sgst: itc.sgst, cess: 0 },
        { type: '(B) ITC Reversed', taxable: null, igst: 0, cgst: 0, sgst: 0, cess: 0 },
        { type: '(C) Net ITC Available (A) - (B)', taxable: null, igst: itc.igst, cgst: itc.cgst, sgst: itc.sgst, cess: 0 },
    ];

    const handleExport = async () => {
        try {
            const res = await api.get('/v1/reports/gst/export', { params: { return_type: 'GSTR3B', period } });
            const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `GSTR3B_${period}.json`;
            a.click();
        } catch (e) {
            console.error('Export failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">GSTR-3B</h1>
                    <p className="text-sm text-slate-500">Summary return of outward and inward supplies along with ITC</p>
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

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="font-bold text-slate-800">Return Summary</h2>
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B] text-[#0F172A] rounded-md hover:bg-[#D97706] transition-colors font-medium text-sm">
                        <Download size={16} />
                        Export JSON
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-3 font-semibold w-1/3">Nature of Supplies</th>
                                <th className="px-4 py-3 font-semibold text-right">Taxable Value</th>
                                <th className="px-4 py-3 font-semibold text-right">IGST</th>
                                <th className="px-4 py-3 font-semibold text-right">CGST</th>
                                <th className="px-4 py-3 font-semibold text-right">SGST/UTGST</th>
                                <th className="px-4 py-3 font-semibold text-right">Cess</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading Report Data...</td></tr>
                            ) : (
                                summaryData.map((row, idx) => {
                                    if (row.section) {
                                        return (
                                            <tr key={idx} className="bg-slate-50 border-y border-slate-200">
                                                <td colSpan={6} className="px-4 py-3 font-bold text-slate-800 text-sm">
                                                    {row.section}
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-700 text-sm pl-8">
                                                {row.type}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-800 font-medium">
                                                {row.taxable !== null ? `₹${(row.taxable || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-600">₹{(row.igst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-right text-slate-600">₹{(row.cgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-right text-slate-600">₹{(row.sgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-right text-slate-400">₹{(row.cess || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-5">
                        <h3 className="font-bold text-rose-800 mb-4 flex items-center gap-2">
                            <Calculator size={18} /> Tax Payable
                        </h3>
                        <div className="space-y-3 text-sm text-rose-900">
                            <div className="flex justify-between"><span>IGST:</span> <span className="font-semibold">₹{(outward.igst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                            <div className="flex justify-between"><span>CGST:</span> <span className="font-semibold">₹{(outward.cgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                            <div className="flex justify-between"><span>SGST:</span> <span className="font-semibold">₹{(outward.sgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                            <div className="flex justify-between pt-2 border-t border-rose-200 font-bold text-base">
                                <span>Total Payable Base:</span> <span>₹{(outward.igst + outward.cgst + outward.sgst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
                        <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                            <Calculator size={18} /> Net Tax to Pay in Cash (After ITC)
                        </h3>
                        <div className="space-y-3 text-sm text-emerald-900">
                            <div className="flex justify-between"><span>IGST:</span> <span className="font-semibold">₹{(payable.igst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                            <div className="flex justify-between"><span>CGST:</span> <span className="font-semibold">₹{(payable.cgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                            <div className="flex justify-between"><span>SGST:</span> <span className="font-semibold">₹{(payable.sgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                            <div className="flex justify-between pt-2 border-t border-emerald-200 font-bold text-base">
                                <span>Net Tax to Pay in Cash:</span> <span className="text-emerald-700">₹{(data?.total_tax_payable || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
