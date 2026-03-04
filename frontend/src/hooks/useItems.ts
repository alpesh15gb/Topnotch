import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Item {
  id: number;
  name: string;
  sku?: string;
  hsn_sac?: string;
  type: 'product' | 'service';
  sale_price: number;
  purchase_price: number;
  current_stock: number;
  track_stock: boolean;
  is_active: boolean;
  category?: { id: number; name: string };
  unit?: { id: number; name: string; symbol: string };
  tax_rate?: { id: number; name: string; rate: number };
}

export function useItems(filters: { type?: string; search?: string } = {}) {
  return useQuery({
    queryKey: ['items', filters],
    queryFn: () => api.get('/v1/items', { params: filters }).then((r) => r.data),
  });
}

export function useItem(id: number) {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => api.get(`/v1/items/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.post('/v1/items', data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      api.put(`/v1/items/${id}`, data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/v1/items/${id}`).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  });
}

export function useTaxRates() {
  return useQuery({
    queryKey: ['tax-rates'],
    queryFn: () => api.get('/v1/tax-rates').then((r) => r.data),
    staleTime: 1000 * 60 * 30,
  });
}

export function useAccounts(filters: { type?: string } = {}) {
  return useQuery({
    queryKey: ['accounts', filters],
    queryFn: () => api.get('/v1/accounts', { params: filters }).then((r) => r.data),
    staleTime: 1000 * 60 * 10,
  });
}
