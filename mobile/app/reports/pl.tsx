import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const C = { bg: '#12172B', card: '#1A2035', accent: '#F59E0B', text: '#FFF', sub: '#8892A4', border: '#2A3350', input: '#0F172A', green: '#34D399', red: '#F87171' };

const fmt = (n: number) => '₹' + (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function Row({ label, value, indent = false, bold = false, highlight }: { label: string; value: number; indent?: boolean; bold?: boolean; highlight?: 'green' | 'red' }) {
    return (
        <View style={[r.row, { paddingLeft: indent ? 24 : 0 }]}>
            <Text style={[r.label, bold && { fontWeight: '700', color: C.text }]}>{label}</Text>
            <Text style={[r.value, bold && { fontWeight: '700' }, highlight === 'green' && { color: C.green }, highlight === 'red' && { color: C.red }]}>
                {fmt(value)}
            </Text>
        </View>
    );
}

export default function PLScreen() {
    const router = useRouter();
    const now = new Date();
    const [from, setFrom] = useState(`${now.getFullYear()}-04-01`);
    const [to, setTo] = useState(now.toISOString().split('T')[0]);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['report-pl', from, to],
        queryFn: () => api.get('/v1/reports/profit-loss', { params: { from_date: from, to_date: to } }).then(r => r.data),
    });

    const pl = data?.profit_loss || data;

    return (
        <View style={s.root}>
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}><ArrowLeft size={22} color={C.text} /></TouchableOpacity>
                <Text style={s.headerTitle}>Profit & Loss</Text>
                <View style={s.headerBtn} />
            </View>

            {isLoading ? (
                <View style={s.center}><ActivityIndicator color={C.accent} size="large" /></View>
            ) : isError ? (
                <View style={s.center}>
                    <Text style={{ color: C.red, marginBottom: 12 }}>Failed to load P&L</Text>
                    <TouchableOpacity style={s.retryBtn} onPress={() => refetch()}><Text style={s.retryText}>Retry</Text></TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                    {/* Income Section */}
                    <View style={s.section}>
                        <Text style={s.sectionTitle}>Income</Text>
                        <View style={s.card}>
                            {pl?.income?.map((item: any, i: number) => (
                                <Row key={i} label={item.name || item.label} value={item.amount || item.value || 0} indent />
                            ))}
                            <Row label="Total Income" value={pl?.total_income || pl?.revenue || 0} bold highlight="green" />
                        </View>
                    </View>

                    {/* Expenses Section */}
                    <View style={s.section}>
                        <Text style={s.sectionTitle}>Expenses</Text>
                        <View style={s.card}>
                            {pl?.expenses?.map((item: any, i: number) => (
                                <Row key={i} label={item.name || item.label} value={item.amount || item.value || 0} indent />
                            ))}
                            <Row label="Total Expenses" value={pl?.total_expenses || pl?.expenses_total || 0} bold highlight="red" />
                        </View>
                    </View>

                    {/* Net Profit */}
                    <View style={[s.card, { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Text style={{ color: C.text, fontWeight: '800', fontSize: 18 }}>Net Profit</Text>
                        <Text style={{ fontWeight: '800', fontSize: 22, color: (pl?.net_profit || 0) >= 0 ? C.green : C.red }}>
                            {fmt(pl?.net_profit || (pl?.total_income || 0) - (pl?.total_expenses || 0))}
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
