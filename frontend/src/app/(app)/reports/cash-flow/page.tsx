'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

export default function CashFlowPage() {
  const [from, setFrom] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [to, setTo] = useState(new Date().toISOString().split('T')[0]);

  const { data, isLoading } = useQuery({
    queryKey: ['report-cashflow', from, to],
    queryFn: async () => {
      const res = await api.get('/v1/reports/cash-flow', { params: { from_date: from, to_date: to } });
      return res.data;
    },
  });

  const inflow = data?.operating?.receipts_from_customers ?? 0;
  const outflow = (data?.operating?.payments_to_suppliers ?? 0) + (data?.operating?.expense_payments ?? 0);
  const net = data?.operating?.net_operating ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cash Flow</h1>
          <p className="text-gray-500 text-sm mt-1">Money in vs money out</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <span className="text-gray-400">to</span>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-green-600 mb-2"><ArrowUpRight className="w-5 h-5" /><span className="text-sm font-medium">Total Inflow</span></div>
          <p className="text-2xl font-bold text-gray-900">₹{inflow.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-red-500 mb-2"><ArrowDownRight className="w-5 h-5" /><span className="text-sm font-medium">Total Outflow</span></div>
          <p className="text-2xl font-bold text-gray-900">₹{outflow.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-blue-600 mb-2"><Wallet className="w-5 h-5" /><span className="text-sm font-medium">Net Cash Flow</span></div>
          <p className={`text-2xl font-bold ${net >= 0 ? 'text-green-600' : 'text-red-500'}`}>₹{Math.abs(net).toLocaleString('en-IN')}</p>
        </div>
      </div>

      {isLoading && <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Loading...</div>}
    </div>
  );
}
