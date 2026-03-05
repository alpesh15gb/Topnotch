'use client';

import { useState } from 'react';
import { Download, Filter, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function GSTR2BReportPage() {
    const [month, setMonth] = useState('03');
    const [year, setYear] = useState('2026');

    const summaryData = [
        { type: 'B2B Invoices (ITC Available)', count: 38, taxable: 980000.00, igst: 35280.00, cgst: 70560.00, sgst: 70560.00, cess: 0 },
        { type: 'B2B Credit Notes (ITC Reversal)', count: 2, taxable: -18000.00, igst: 0, cgst: -1620.00, sgst: -1620.00, cess: 0 },
        { type: 'Import of Goods', count: 0, taxable: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 },
        { type: 'Import of Services', count: 1, taxable: 25000.00, igst: 4500.00, cgst: 0, sgst: 0, cess: 0 },
        { type: 'ISD Credits', count: 0, taxable: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 },
        { type: 'Ineligible ITC (Rule 38/42/43)', count: 3, taxable: 45000.00, igst: 0, cgst: 4050.00, sgst: 4050.00, cess: 0 },
    ];

    const reconciliationData = [
        { invoice: 'INV-2026-001', supplier: 'Tech Supplies Pvt Ltd', gstin: '27AABCT1234A1Z5', date: '2026-02-05', taxable: 120000, gst: 21600, status: 'matched' },
        { invoice: 'INV-2026-003', supplier: 'Office Needs Co.', gstin: '29AABCO5678B2Z6', date: '2026-02-12', taxable: 35000, gst: 6300, status: 'matched' },
        { invoice: 'INV-2026-007', supplier: 'Logistics Express', gstin: '24AABLE9012C3Z7', date: '2026-02-20', taxable: 18000, gst: 3240, status: 'mismatch' },
        { invoice: 'INV-2026-009', supplier: 'Raw Material Hub', gstin: '19AABRM3456D4Z8', date: '2026-02-25', taxable: 75000, gst: 13500, status: 'missing' },
        { invoice: 'INV-2026-012', supplier: 'Cloud Services Ltd', gstin: '07AABCS7890E5Z9', date: '2026-03-01', taxable: 50000, gst: 9000, status: 'matched' },
    ];

    const statusIcon = (status: string) => {
        if (status === 'matched') return <CheckCircle size={16} className="text-emerald-500" />;
        if (status === 'mismatch') return <AlertCircle size={16} className="text-amber-500" />;
        return <XCircle size={16} className="text-rose-500" />;
    };

    const statusLabel = (status: string) => {
        if (status === 'matched') return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">Matched</span>;
        if (status === 'mismatch') return <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">Mismatch</span>;
        return <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full text-xs font-medium">Missing in Books</span>;
    };

    const matched = reconciliationData.filter(r => r.status === 'matched').length;
    const mismatch = reconciliationData.filter(r => r.status === 'mismatch').length;
    const missing = reconciliationData.filter(r => r.status === 'missing').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">GSTR-2B Reconciliation</h1>
                    <p className="text-sm text-slate-500">Auto-drafted ITC statement — reconcile with your purchase register</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                        <div className="px-3 py-2 bg-slate-50 border-r border-slate-300 text-slate-500">
                            <Calendar size={18} />
                        </div>
                        <select value={month} onChange={(e) => setMonth(e.target.value)} className="px-3 py-2 bg-white outline-none text-sm font-medium">
                            {['January','February','March','April','May','June','July','August','September','October','November','December']
                                .map((m, i) => <option key={i} value={String(i+1).padStart(2,'0')}>{m}</option>)}
                        </select>
                        <select value={year} onChange={(e) => setYear(e.target.value)} className="px-3 py-2 bg-white outline-none border-l border-slate-200 text-sm font-medium">
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm">
                        <Filter size={16} />
                        Filters
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] text-[#0F172A] rounded-lg hover:bg-[#D97706] transition-colors font-medium text-sm shadow-sm">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Reconciliation Status Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
                    <div className="p-2.5 bg-emerald-50 rounded-lg"><CheckCircle size={22} className="text-emerald-600" /></div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{matched}</p>
                        <p className="text-sm text-slate-500">Matched</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
                    <div className="p-2.5 bg-amber-50 rounded-lg"><AlertCircle size={22} className="text-amber-600" /></div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{mismatch}</p>
                        <p className="text-sm text-slate-500">Mismatch</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
                    <div className="p-2.5 bg-rose-50 rounded-lg"><XCircle size={22} className="text-rose-600" /></div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{missing}</p>
                        <p className="text-sm text-slate-500">Missing in Books</p>
                    </div>
                </div>
            </div>

            {/* ITC Summary Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-bold text-slate-800">ITC Summary (from GSTR-2B)</h2>
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
                            {summaryData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-700">{row.type}</td>
                                    <td className="px-4 py-3 text-right text-slate-600">{row.count}</td>
                                    <td className="px-4 py-3 text-right text-slate-800">₹{row.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-3 text-right text-slate-600">₹{row.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-3 text-right text-slate-600">₹{row.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-3 text-right text-slate-600">₹{row.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invoice-level Reconciliation */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h2 className="font-bold text-slate-800">Invoice-level Reconciliation</h2>
                    <div className="flex gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><CheckCircle size={12} className="text-emerald-500" /> Matched</span>
                        <span className="flex items-center gap-1"><AlertCircle size={12} className="text-amber-500" /> Mismatch</span>
                        <span className="flex items-center gap-1"><XCircle size={12} className="text-rose-500" /> Missing</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Invoice No.</th>
                                <th className="px-4 py-3 font-semibold">Supplier</th>
                                <th className="px-4 py-3 font-semibold">GSTIN</th>
                                <th className="px-4 py-3 font-semibold">Date</th>
                                <th className="px-4 py-3 font-semibold text-right">Taxable</th>
                                <th className="px-4 py-3 font-semibold text-right">GST</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {reconciliationData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {statusIcon(row.status)}
                                            {statusLabel(row.status)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-700">{row.invoice}</td>
                                    <td className="px-4 py-3 text-slate-700">{row.supplier}</td>
                                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.gstin}</td>
                                    <td className="px-4 py-3 text-slate-600">{row.date}</td>
                                    <td className="px-4 py-3 text-right text-slate-800">₹{row.taxable.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-3 text-right font-bold text-[#0F172A]">₹{row.gst.toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 flex items-start gap-3">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <div>
                    <p className="font-bold mb-1">About GSTR-2B Reconciliation</p>
                    <p>GSTR-2B is auto-generated by the GST portal based on your suppliers' filings. Reconcile this with your purchase register to ensure you claim only eligible ITC. Mismatches must be resolved before filing GSTR-3B.</p>
                </div>
            </div>
        </div>
    );
}
