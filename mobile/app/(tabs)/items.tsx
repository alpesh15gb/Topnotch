import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Search, Filter, Plus, Package } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const C = { bg: '#12172B', card: '#1E2640', accent: '#F59E0B', text: '#FFFFFF', sub: '#8892A4', border: '#2A3350', primary: '#0F172A' };

export default function ItemsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['items', search],
    queryFn: () => api.get('/v1/items', { params: { search: search || undefined } }).then((r) => r.data.data || []),
  });

  const items: any[] = data || [];

  return (
    <View style={s.container}>
      <View style={s.searchBar}>
        <Search color="rgba(255,255,255,0.6)" size={18} />
        <TextInput
          style={s.input}
          placeholder="Search items..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={search}
          onChangeText={setSearch}
        />
        <Filter color="rgba(255,255,255,0.6)" size={18} />
      </View>

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator color={C.accent} size="large" />
        </View>
      ) : isError ? (
        <View style={s.center}>
          <Text style={{ color: '#F87171' }}>Failed to load items</Text>
        </View>
      ) : items.length === 0 ? (
        <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={C.accent} />}>
          <View style={s.empty}>
            <View style={s.emptyIcon}><Package color="#8892A4" size={32} /></View>
            <Text style={s.emptyTitle}>No items added yet</Text>
            <Text style={s.emptySub}>Add products and services to use in invoices</Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={C.accent} />}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.card} onPress={() => router.push(`/items/${item.id}` as any)} activeOpacity={0.75}>
              <View style={s.cardTop}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.price}>₹{(item.sale_price || 0).toLocaleString('en-IN')}</Text>
              </View>
              <View style={s.cardBottom}>
                <Text style={s.type}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
                {item.type === 'goods' && (
                  <Text style={s.stock}>Stock: {item.current_stock || 0}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={s.fab} onPress={() => router.push('/items/new' as any)}>
        <Plus color="white" size={28} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  searchBar: { flexDirection: 'row', alignItems: 'center', margin: 12, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: C.primary, borderWidth: 1, borderColor: C.border },
  input: { flex: 1, color: '#fff', marginHorizontal: 10, fontSize: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', justifyContent: 'center', marginTop: 80, padding: 24 },
  emptyIcon: { width: 80, height: 80, backgroundColor: C.card, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: C.border },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: C.text },
  emptySub: { fontSize: 13, color: C.sub, marginTop: 4, textAlign: 'center' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, backgroundColor: C.accent, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 6 },
  card: { backgroundColor: C.card, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  name: { color: C.text, fontWeight: '700', fontSize: 15, flex: 1, marginRight: 8 },
  price: { color: C.text, fontWeight: '700', fontSize: 15 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  type: { color: C.sub, fontSize: 13 },
  stock: { color: C.accent, fontSize: 13, fontWeight: '500' },
});
