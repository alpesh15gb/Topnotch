import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, Filter, Plus } from 'lucide-react-native';

const C = { primary: '#0F172A', accent: '#F59E0B', bg: '#F8FAFC' };

export default function PurchasesScreen() {
  return (
    <View style={s.container}>
      <View style={s.searchBar}>
        <Search color="rgba(255,255,255,0.6)" size={18} />
        <TextInput style={s.input} placeholder="Search purchase bills..." placeholderTextColor="rgba(255,255,255,0.4)" />
        <Filter color="rgba(255,255,255,0.6)" size={18} />
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={s.empty}>
          <View style={s.emptyIcon}><Search color="#94A3B8" size={32} /></View>
          <Text style={s.emptyTitle}>No purchase bills recorded</Text>
          <Text style={s.emptySub}>Easily record your business expenses</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={s.fab}><Plus color="white" size={28} /></TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  searchBar: { flexDirection: 'row', alignItems: 'center', margin: 12, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: C.primary },
  input: { flex: 1, color: '#fff', marginHorizontal: 10, fontSize: 14 },
  empty: { alignItems: 'center', justifyContent: 'center', marginTop: 80, padding: 24 },
  emptyIcon: { width: 80, height: 80, backgroundColor: '#F1F5F9', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: '#475569' },
  emptySub: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, backgroundColor: C.accent, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 6 },
});
