'use client';

import { FileBarChart2, Calculator, Users, Package, FileSpreadsheet, Send } from 'lucide-react';
import Link from 'next/link';

type Report = {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    badges?: string[];
};

type ReportCategory = {
    category: string;
    description: string;
    reports: Report[];
};

const reportCategories: ReportCategory[] = [
    {
        category: "GST Returns (India)",
        description: "Filing and compliance reports required by the GST portal.",
        reports: [
            {
                title: "GSTR-1",
                description: "Details of outward supplies of goods or services.",
                href: "/reports/gstr1",
                icon: <FileBarChart2 size={24} className="text-[#F59E0B]" />,
                badges: ["Monthly/Quarterly"]
            },
            {
                title: "GSTR-3B",
                description: "Summary return of outward and inward supplies.",
                href: "/reports/gstr3b",
                icon: <Calculator size={24} className="text-blue-500" />,
                badges: ["Monthly"]
            },
            {
                title: "GSTR-2B Reconciliation",
                description: "Auto-drafted ITC statement for reconciliation.",
                href: "/reports/gstr2b",
                icon: <FileSpreadsheet size={24} className="text-emerald-500" />,
                badges: ["Reconciliation"]
            }
        ]
    },
    {
        category: "Financials & Accounting",
        description: "Core accounting reports for business health.",
        reports: [
            {
                title: "Day Book",
                description: "Daily transaction log of all receipts and payments.",
                href: "/reports/daybook",
                icon: <FileTextIcon size={24} className="text-slate-500" />
            },
            {
                title: "Profit & Loss",
                description: "Income and expenses covering a specific period.",
                href: "/reports/profit-loss",
                icon: <TrendingUpIcon size={24} className="text-emerald-500" />
            },
            {
                title: "Balance Sheet",
                description: "Financial snapshot of assets, liabilities, and equity.",
                href: "/reports/balance-sheet",
                icon: <ScaleIcon size={24} className="text-indigo-500" />
            }
        ]
    },
    {
        category: "Sales & Receivables",
        description: "Track outgoing sales and pending payments.",
        reports: [
            {
                title: "Customer Outstanding",
                description: "Unpaid invoices and balances by customer.",
                href: "/reports/outstanding",
                icon: <Users size={24} className="text-rose-500" />
            },
            {
                title: "Sales Summary",
                description: "Aggregate sales categorized by item or period.",
                href: "/reports/sales-summary",
                icon: <BarChart3Icon size={24} className="text-blue-500" />
            }
        ]
    }
];

// Helper icons
function FileTextIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg> }
function TrendingUpIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg> }
function ScaleIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" /></svg> }
function BarChart3Icon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg> }

export default function ReportsPage() {
    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
                <p className="text-sm text-slate-500">Business insights, financial statements, and tax compliance</p>
            </div>

            <div className="space-y-8">
                {reportCategories.map((cat, index) => (
                    <div key={index} className="space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">{cat.category}</h2>
                            <p className="text-sm text-slate-500">{cat.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cat.reports.map((report, rIndex) => (
                                <Link
                                    key={rIndex}
                                    href={report.href}
                                    className="block bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-[#F59E0B] hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-[#F59E0B]/10 transition-colors">
                                            {report.icon}
                                        </div>
                                        {report.badges && (
                                            <div className="flex gap-1">
                                                {report.badges.map((badge, bIndex) => (
                                                    <span key={bIndex} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded uppercase tracking-wider">
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 group-hover:text-[#F59E0B] transition-colors">{report.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{report.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
