import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const C = { bg: '#12172B', card: '#1A2035', accent: '#F59E0B', text: '#FFF', sub: '#8892A4', border: '#2A3350', green: '#34D399', red: '#F87171', blue: '#60A5FA' };

const fmt = (n: number) => '₹' + (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function Section({ title, items, total, color }: { title: string; items: any[]; total: number; color: string }) {
    return (
        <View style={s.section}>
            <Text style={s.sectionTitle}>{title}</Text>
            <View style={s.card}>
                {(items || []).map((item: any, i: number) => (
                    <View key={i} style={r.row}>
                        <Text style={r.label}>{item.name || item.label || item.account}</Text>
                        <Text style={r.value}>{fmt(item.amount || item.balance || item.value || 0)}</Text>
                    </View>
                ))}
                <View style={[r.row, { borderBottomWidth: 0 }]}>
                    <Text style={[r.label, { fontWeight: '700', color: C.text }]}>Total {title}</Text>
                    <Text style={[r.value, { fontWeight: '800', color }]}>{fmt(total)}</Text>
                </View>
            </View>
        </View>
    );
}

export default function BalanceSheetScreen() {
    const router = useRouter();
    const today = new Date().toISOString().split('T')[0];

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['report-bs'],
        queryFn: () => api.get('/v1/reports/balance-sheet', { params: { as_of: today } }).then(r => r.data),
    });

    const bs = data?.balance_sheet || data;

    return (
        <View style={s.root}>
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}><ArrowLeft size={22} color={C.text} /></TouchableOpacity>
                <Text style={s.headerTitle}>Balance Sheet</Text>
                <View style={s.headerBtn} />
            </View>

            {isLoading ? (
                <View style={s.center}><ActivityIndicator color={C.accent} size="large" /></View>
            ) : isError ? (
                <View style={s.center}>
                    <Text style={{ color: C.red, marginBottom: 12 }}>Failed to load Balance Sheet</Text>
                    <TouchableOpacity style={s.retryBtn} onPress={() => refetch()}><Text style={s.retryText}>Retry</Text></TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                    <Section title="Assets" items={bs?.assets || []} total={bs?.total_assets || 0} color={C.green} />
                    <Section title="Liabilities" items={bs?.liabilities || []} total={bs?.total_liabilities || 0} color={C.red} />
                    <Section title="Equity" items={bs?.equity || []} total={bs?.total_equity || 0} color={C.blue} />

                    <View style={[s.card, { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }]}>
                        <Text style={{ color: C.text, fontWeight: '800', fontSize: 16 }}>Balanced?</Text>
                        <Text style={{ color: bs?.is_balanced ? C.green : C.red, fontWeight: '800', fontSize: 16 }}>
                            {bs?.is_balanced ? '✓ Yes' : '✗ No'}
                        </Text>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: C.border },
    headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, color: C.text, fontSize: 17, fontWeight: 'bold', textAlign: 'center' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    retryBtn: { backgroundColor: C.accent, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
    retryText: { color: '#000', fontWeight: 'bold' },
    section: { marginBottom: 16 },
    sectionTitle: { color: C.sub, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' },
    card: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
});

const r = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
    label: { color: C.sub, fontSize: 14, flex: 1 },
    value: { color: C.text, fontSize: 14, fontWeight: '600' },
});
