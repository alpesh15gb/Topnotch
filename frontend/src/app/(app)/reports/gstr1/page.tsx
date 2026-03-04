'use client';

import { useState } from 'react';
import { Download, Filter, Calendar, Calculator } from 'lucide-react';

export default function GSTR1ReportPage() {
    const [month, setMonth] = useState('03');
    const [year, setYear] = useState('2026');

    // Static mock data for UI demo purposes
    const summaryData = [
        { type: 'B2B Invoices', count: 45, taxable: 1250000.00, igst: 45000.00, cgst: 90000.00, sgst: 90000.00, total: 1475000.00 },
        { type: 'B2C (Large) Invoices', count: 2, taxable: 350000.00, igst: 63000.00, cgst: 0, sgst: 0, total: 413000.00 },
        { type: 'B2C (Small) Invoices', count: 128, taxable: 85000.00, igst: 0, cgst: 7650.00, sgst: 7650.00, total: 100300.00 },
        { type: 'Credit/Debit Notes (Reg)', count: 3, taxable: -25000.00, igst: 0, cgst: -2250.00, sgst: -2250.00, total: -29500.00 },
        { type: 'Export Invoices', count: 0, taxable: 0, igst: 0, cgst: 0, sgst: 0, total: 0 },
        { type: 'Nil Rated / Exempted', count: 12, taxable: 15400.00, igst: 0, cgst: 0, sgst: 0, total: 15400.00 },
    ];

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
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            {/* ... other months */}
                        </select>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="px-3 py-2 bg-white outline-none border-l border-slate-200 text-sm font-medium"
                        >
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm">
                        <Filter size={16} />
                        More Filters
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="font-bold text-slate-800">Return Summary</h2>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B] text-[#0F172A] rounded-md hover:bg-[#D97706] transition-colors font-medium text-sm">
                        <Download size={16} />
                        Export JSON (GST Portal)
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-3 font-semibold">Table Details</th>
                                <th className="px-4 py-3 font-semibold text-right">Voucher Count</th>
                                <th className="px-4 py-3 font-semibold text-right">Taxable Value</th>
                                <th className="px-4 py-3 font-semibold text-right">IGST</th>
                                <th className="px-4 py-3 font-semibold text-right">CGST</th>
                                <th className="px-4 py-3 font-semibold text-right">SGST</th>
                                <th className="px-4 py-3 font-semibold text-right">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
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
                                <td className="px-4 py-3 text-right font-bold text-slate-800">190</td>
                                <td className="px-4 py-3 text-right font-bold text-slate-800">₹1,675,400.00</td>
                                <td className="px-4 py-3 text-right font-bold text-slate-800">₹108,000.00</td>
                                <td className="px-4 py-3 text-right font-bold text-slate-800">₹95,400.00</td>
                                <td className="px-4 py-3 text-right font-bold text-slate-800">₹95,400.00</td>
                                <td className="px-4 py-3 text-right font-bold text-[#F59E0B]">₹1,974,200.00</td>
                            </tr>
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
