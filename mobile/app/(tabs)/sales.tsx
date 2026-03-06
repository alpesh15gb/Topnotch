import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, FlatList, RefreshControl,
} from 'react-native';
import { Search, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const C = {
  bg: '#12172B', card: '#1A2035', accent: '#F59E0B',
  text: '#FFF', sub: '#8892A4', border: '#2A3350', input: '#0F172A',
};

const STATUS_FILTERS = ['All', 'Draft', 'Posted', 'Paid', 'Overdue'];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#334155', text: '#94A3B8' },
  posted: { bg: '#1E3A5F', text: '#60A5FA' },
  paid: { bg: '#14532D', text: '#34D399' },
  partially_paid: { bg: '#7C4A00', text: '#F59E0B' },
  overdue: { bg: '#7F1D1D', text: '#F87171' },
};

function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.draft;
  return (
    <View style={[s.badge, { backgroundColor: colors.bg }]}>
      <Text style={[s.badgeText, { color: colors.text }]}>
        {status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
      </Text>
    </View>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatAmount(amount: number | string) {
  const n = parseFloat(String(amount)) || 0;
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function SalesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['invoices', search, statusFilter],
    queryFn: () =>
      api.get('/v1/invoices', {
        params: {
          search: search || undefined,
          status: statusFilter !== 'All' ? statusFilter.toLowerCase() : undefined,
        },
      }).then(r => r.data.data || []),
  });

  const invoices: any[] = data || [];

  return (
    <View style={s.container}>
      {/* Search */}
      <View style={s.searchBar}>
        <Search color={C.sub} size={18} />
        <TextInput
          style={s.searchInput}
          placeholder="Search invoices..."
          placeholderTextColor={C.sub}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Status Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.filterScroll}
        contentContainerStyle={s.filterContent}
      >
        {STATUS_FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[s.pill, statusFilter === f && s.pillActive]}
            onPress={() => setStatusFilter(f)}
          >
            <Text style={[s.pillText, statusFilter === f && s.pillTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator color={C.accent} size="large" />
        </View>
      ) : isError ? (
        <View style={s.center}>
          <Text style={s.errorText}>Failed to load invoices</Text>
          <TouchableOpacity style={s.retryBtn} onPress={() => refetch()}>
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : invoices.length === 0 ? (
        <View style={s.center}>
          <View style={s.emptyIcon}><Search color={C.sub} size={32} /></View>
          <Text style={s.emptyTitle}>No invoices found</Text>
          <Text style={s.emptySub}>Tap the + button to create one</Text>
          <TouchableOpacity style={s.emptyBtn} onPress={() => router.push('/sales/new' as any)}>
            <Text style={s.emptyBtnText}>Create Invoice</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={C.accent} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.card}
              onPress={() => router.push(('/sales/' + item.id) as any)}
              activeOpacity={0.75}
            >
              <View style={s.cardTop}>
                <Text style={s.invoiceNo}>{item.invoice_number || item.number || 'INV'}</Text>
                <StatusBadge status={item.status || 'draft'} />
                <Text style={s.amount}>{formatAmount(item.total_amount || item.total || 0)}</Text>
              </View>
              <View style={s.cardBottom}>
                <Text style={s.customerName} numberOfLines={1}>
                  {item.party?.name || item.customer_name || 'Customer'}
                </Text>
                <Text style={s.date}>{formatDate(item.date)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={s.fab} onPress={() => router.push('/sales/new' as any)}>
        <Plus color="white" size={28} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.input, margin: 12, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: C.border,
  },
  searchInput: { flex: 1, color: C.text, marginHorizontal: 10, fontSize: 14 },
  filterScroll: { maxHeight: 44 },
  filterContent: { paddingHorizontal: 12, gap: 8, alignItems: 'center' },
  pill: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: C.border, backgroundColor: C.card,
  },
  pillActive: { backgroundColor: C.accent, borderColor: C.accent },
  pillText: { color: C.sub, fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { color: '#F87171', fontSize: 15, marginBottom: 12 },
  retryBtn: { backgroundColor: C.accent, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#000', fontWeight: 'bold' },
  emptyIcon: {
    width: 80, height: 80, backgroundColor: C.card, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    borderWidth: 1, borderColor: C.border,
  },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: C.text },
  emptySub: { fontSize: 13, color: C.sub, marginTop: 4 },
  emptyBtn: { marginTop: 20, backgroundColor: C.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  card: {
    backgroundColor: C.card, borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: C.border,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  invoiceNo: { color: C.text, fontWeight: '700', fontSize: 14, flex: 1 },
  amount: { color: C.text, fontWeight: '700', fontSize: 14 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  customerName: { color: C.sub, fontSize: 13, flex: 1, marginRight: 8 },
  date: { color: C.sub, fontSize: 12 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginRight: 10 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  fab: {
    position: 'absolute', bottom: 24, right: 24, width: 56, height: 56,
    backgroundColor: C.accent, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', elevation: 6,
  },
});
