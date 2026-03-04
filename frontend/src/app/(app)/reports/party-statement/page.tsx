'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { FileText } from 'lucide-react';

export default function PartyStatementPage() {
  const [partyId, setPartyId] = useState('');
  const [from, setFrom] = useState(new Date(new Date().getFullYear(), 3, 1).toISOString().split('T')[0]);
  const [to, setTo] = useState(new Date().toISOString().split('T')[0]);

  const { data: parties = [] } = useQuery<{ id: number; name: string }[]>({
    queryKey: ['parties-list'],
    queryFn: async () => {
      const res = await api.get('/v1/parties', { params: { per_page: 200 } });
      return res.data.data ?? [];
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['party-statement', partyId, from, to],
    enabled: !!partyId,
    queryFn: async () => {
      const res = await api.get(`/v1/reports/party-statement/${partyId}`, { params: { from_date: from, to_date: to } });
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Party Statement</h1>
        <p className="text-gray-500 text-sm mt-1">Account statement for a specific party</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
        <select value={partyId} onChange={e => setPartyId(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Select a party...</option>
          {parties.map((p: { id: number; name: string }) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <span className="text-gray-400">to</span>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>

      {!partyId ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Select a party to view statement</p>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-right">Debit</th>
                <th className="px-4 py-3 text-right">Credit</th>
                <th className="px-4 py-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(data?.transactions ?? []).map((t: { date: string; description: string; debit?: number; credit?: number; balance: number }, i: number) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{t.date}</td>
                  <td className="px-4 py-3 text-sm">{t.description}</td>
                  <td className="px-4 py-3 text-right text-sm text-red-600">{t.debit ? `₹${t.debit.toLocaleString('en-IN')}` : '-'}</td>
                  <td className="px-4 py-3 text-right text-sm text-green-600">{t.credit ? `₹${t.credit.toLocaleString('en-IN')}` : '-'}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium">{`₹${t.balance.toLocaleString('en-IN')}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
