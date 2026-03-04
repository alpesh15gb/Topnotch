import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useSalesSummary(fromDate: string, toDate: string) {
  return useQuery({
    queryKey: ['reports', 'sales-summary', fromDate, toDate],
    queryFn: () =>
      api.get('/v1/reports/sales/summary', { params: { from_date: fromDate, to_date: toDate } })
        .then((r) => r.data),
    enabled: !!(fromDate && toDate),
  });
}

export function usePurchaseSummary(fromDate: string, toDate: string) {
  return useQuery({
    queryKey: ['reports', 'purchases-summary', fromDate, toDate],
    queryFn: () =>
      api.get('/v1/reports/purchases/summary', { params: { from_date: fromDate, to_date: toDate } })
        .then((r) => r.data),
    enabled: !!(fromDate && toDate),
  });
}

export function useProfitLoss(fromDate: string, toDate: string) {
  return useQuery({
    queryKey: ['reports', 'profit-loss', fromDate, toDate],
    queryFn: () =>
      api.get('/v1/reports/profit-loss', { params: { from_date: fromDate, to_date: toDate } })
        .then((r) => r.data),
    enabled: !!(fromDate && toDate),
  });
}

export function useBalanceSheet(asOfDate: string) {
  return useQuery({
    queryKey: ['reports', 'balance-sheet', asOfDate],
    queryFn: () =>
      api.get('/v1/reports/balance-sheet', { params: { as_of_date: asOfDate } })
        .then((r) => r.data),
    enabled: !!asOfDate,
  });
}

export function useDaybook(date: string) {
  return useQuery({
    queryKey: ['reports', 'daybook', date],
    queryFn: () =>
      api.get('/v1/reports/daybook', { params: { date } }).then((r) => r.data),
    enabled: !!date,
  });
}

export function useGSTR1(period: string) {
  return useQuery({
    queryKey: ['reports', 'gstr1', period],
    queryFn: () =>
      api.get('/v1/reports/gst/gstr1', { params: { period } }).then((r) => r.data),
    enabled: !!period,
  });
}

export function useGSTR3B(period: string) {
  return useQuery({
    queryKey: ['reports', 'gstr3b', period],
    queryFn: () =>
      api.get('/v1/reports/gst/gstr3b', { params: { period } }).then((r) => r.data),
    enabled: !!period,
  });
}

export function useOutstandingReceivables() {
  return useQuery({
    queryKey: ['reports', 'outstanding-receivables'],
    queryFn: () => api.get('/v1/reports/sales/outstanding').then((r) => r.data),
  });
}

export function useOutstandingPayables() {
  return useQuery({
    queryKey: ['reports', 'outstanding-payables'],
    queryFn: () => api.get('/v1/reports/purchases/outstanding').then((r) => r.data),
  });
}
