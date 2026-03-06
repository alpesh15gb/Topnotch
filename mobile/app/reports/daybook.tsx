import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { format, subDays, addDays } from 'date-fns';

const C = { bg: '#12172B', card: '#1A2035', accent: '#F59E0B', text: '#FFF', sub: '#8892A4', border: '#2A3350', green: '#34D399', red: '#F87171' };

const fmt = (n: number) => '₹' + (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function DaybookScreen() {
    const router = useRouter();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const { data, isLoading, isError, refetch, isRefetching } = useQuery({
        queryKey: ['report-daybook', date],
        queryFn: () => api.get('/v1/reports/daybook', { params: { date } }).then(r => r.data),
    });

    const entries: any[] = data?.entries || data?.transactions || [];
    const totals = data?.totals || data;

    const prevDay = () => setDate(format(subDays(new Date(date), 1), 'yyyy-MM-dd'));
    const nextDay = () => {
        const next = addDays(new Date(date), 1);
        if (next <= new Date()) setDate(format(next, 'yyyy-MM-dd'));
    };

    return (
        <View style={s.root}>
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}><ArrowLeft size={22} color={C.text} /></TouchableOpacity>
                <Text style={s.headerTitle}>Daybook</Text>
                <View style={s.headerBtn} />
            </View>

            {/* Date Navigation */}
            <View style={s.dateNav}>
                <TouchableOpacity onPress={prevDay} style={s.navBtn}><ChevronLeft size={22} color={C.text} /></TouchableOpacity>
                <Text style={s.dateText}>{format(new Date(date), 'dd MMMM yyyy')}</Text>
                <TouchableOpacity onPress={nextDay} style={s.navBtn}><ChevronRight size={22} color={C.text} /></TouchableOpacity>
            </View>

            {/* Totals */}
            {totals && (
                <View style={s.totalsRow}>
                    <View style={s.totalCard}>
                        <Text style={s.totalLabel}>Total In</Text>
                        <Text style={[s.totalVal, { color: C.green }]}>{fmt(totals.total_debit || totals.total_in || 0)}</Text>
                    </View>
                    <View style={s.totalCard}>
                        <Text style={s.totalLabel}>Total Out</Text>
                        <Text style={[s.totalVal, { color: C.red }]}>{fmt(totals.total_credit || totals.total_out || 0)}</Text>
                    </View>
                </View>
            )}

            {isLoading ? (
                <View style={s.center}><ActivityIndicator color={C.accent} size="large" /></View>
            ) : isError ? (
                <View style={s.center}>
                    <Text style={{ color: C.red, marginBottom: 12 }}>Failed to load daybook</Text>
                    <TouchableOpacity style={s.retryBtn} onPress={() => refetch()}><Text style={s.retryText}>Retry</Text></TouchableOpacity>
                </View>
            ) : entries.length === 0 ? (
                <View style={s.center}><Text style={{ color: C.sub, fontSize: 15 }}>No transactions on this date</Text></View>
            ) : (
                <FlatList
                    data={entries}
                    keyExtractor={(item, i) => String(item.id || i)}
                    contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
                    refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={C.accent} />}
                    renderItem={({ item }) => (
                        <View style={s.entryCard}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={s.entryType}>{item.type || item.voucher_type || 'Transaction'}</Text>
                                <Text style={[s.entryAmt, { color: item.debit > 0 ? C.green : C.red }]}>
                                    {item.debit > 0 ? '+' : '-'}{fmt(item.debit || item.credit || item.amount || 0)}
                                </Text>
                            </View>
                            <Text style={s.entryDesc} numberOfLines={1}>{item.description || item.narration || item.particulars || ''}</Text>
                            {item.reference && <Text style={s.entryRef}>Ref: {item.reference}</Text>}
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: C.border },
    headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, color: C.text, fontSize: 17, fontWeight: 'bold', textAlign: 'center' },
    dateNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
    navBtn: { padding: 6 },
    dateText: { color: C.text, fontSize: 16, fontWeight: '700' },
    totalsRow: { flexDirection: 'row', padding: 12, gap: 12 },
    totalCard: { flex: 1, backgroundColor: C.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border },
    totalLabel: { color: C.sub, fontSize: 12, fontWeight: '600', marginBottom: 4 },
    totalVal: { fontSize: 18, fontWeight: '800' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    retryBtn: { backgroundColor: C.accent, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
    retryText: { color: '#000', fontWeight: 'bold' },
    entryCard: { backgroundColor: C.card, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: C.border },
    entryType: { color: C.accent, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    entryAmt: { fontSize: 15, fontWeight: '700' },
    entryDesc: { color: C.text, fontSize: 14, marginTop: 2 },
    entryRef: { color: C.sub, fontSize: 12, marginTop: 4 },
});
