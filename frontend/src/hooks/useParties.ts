import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Party {
  id: number;
  type: 'customer' | 'supplier' | 'both';
  name: string;
  gstin?: string;
  pan?: string;
  email?: string;
  phone?: string;
  billing_address?: string;
  city?: string;
  state?: string;
  state_code?: string;
  current_balance: number;
  balance_type: 'Dr' | 'Cr';
  is_active: boolean;
}

export function useParties(filters: { type?: string; search?: string; active_only?: boolean } = {}) {
  return useQuery({
    queryKey: ['parties', filters],
    queryFn: () => api.get('/v1/parties', { params: filters }).then((r) => r.data),
  });
}

export function useParty(id: number) {
  return useQuery({
    queryKey: ['parties', id],
    queryFn: () => api.get(`/v1/parties/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateParty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.post('/v1/parties', data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parties'] }),
  });
}

export function useUpdateParty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      api.put(`/v1/parties/${id}`, data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parties'] }),
  });
}

export function useDeleteParty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/v1/parties/${id}`).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parties'] }),
  });
}
