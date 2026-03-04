'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { TrendingUp } from 'lucide-react';

export default function SalesReportPage() {
  const [from, setFrom] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [to, setTo] = useState(new Date().toISOString().split('T')[0]);

  const { data, isLoading } = useQuery({
    queryKey: ['report-sales', from, to],
    queryFn: async () => {
      const res = await api.get('/v1/reports/sales/summary', { params: { from_date: from, to_date: to } });
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Report</h1>
          <p className="text-gray-500 text-sm mt-1">Sales performance overview</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <span className="text-gray-400">to</span>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Sales', value: `₹${(data?.total_sales ?? 0).toLocaleString('en-IN')}` },
            { label: 'Total Invoices', value: data?.invoice_count ?? 0 },
            { label: 'Total Tax Collected', value: `₹${(data?.total_tax ?? 0).toLocaleString('en-IN')}` },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
