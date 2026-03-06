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

export default function PurchasesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['purchase-bills', search, statusFilter],
    queryFn: () =>
      api.get('/v1/purchase-bills', {
        params: {
          search: search || undefined,
          status: statusFilter !== 'All' ? statusFilter.toLowerCase() : undefined,
        },
      }).then(r => r.data.data || []),
  });

  const bills: any[] = data || [];

  return (
    <View style={s.container}>
      <View style={s.searchBar}>
        <Search color={C.sub} size={18} />
        <TextInput
          style={s.searchInput}
          placeholder="Search purchase bills..."
          placeholderTextColor={C.sub}
          value={search}
          onChangeText={setSearch}
        />
      </View>

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
          <Text style={s.errorText}>Failed to load purchase bills</Text>
          <TouchableOpacity style={s.retryBtn} onPress={() => refetch()}>
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : bills.length === 0 ? (
        <View style={s.center}>
          <View style={s.emptyIcon}><Search color={C.sub} size={32} /></View>
          <Text style={s.emptyTitle}>No purchase bills found</Text>
          <Text style={s.emptySub}>Tap the + button to record one</Text>
          <TouchableOpacity style={s.emptyBtn} onPress={() => router.push('/purchases/new' as any)}>
            <Text style={s.emptyBtnText}>Record Bill</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bills}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={C.accent} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={s.card} activeOpacity={0.75}>
              <View style={s.cardTop}>
                <Text style={s.billNo}>{item.number || `BILL-${item.id}`}</Text>
                <StatusBadge status={item.status || 'draft'} />
                <Text style={s.amount}>{formatAmount(item.total || 0)}</Text>
              </View>
              <View style={s.cardBottom}>
                <Text style={s.supplierName} numberOfLines={1}>
                  {item.party?.name || 'Supplier'}
                </Text>
                <Text style={s.date}>{formatDate(item.date)}</Text>
              </View>
              {item.balance > 0 && (
                <Text style={s.balance}>Due: {formatAmount(item.balance)}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={s.fab} onPress={() => router.push('/purchases/new' as any)}>
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
  billNo: { color: C.text, fontWeight: '700', fontSize: 14, flex: 1 },
  amount: { color: C.text, fontWeight: '700', fontSize: 14 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  supplierName: { color: C.sub, fontSize: 13, flex: 1, marginRight: 8 },
  date: { color: C.sub, fontSize: 12 },
  balance: { color: '#F87171', fontSize: 11, fontWeight: '600', marginTop: 4 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginRight: 10 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  fab: {
    position: 'absolute', bottom: 24, right: 24, width: 56, height: 56,
    backgroundColor: C.accent, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', elevation: 6,
  },
});
