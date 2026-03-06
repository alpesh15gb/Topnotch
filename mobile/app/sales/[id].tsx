import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { ArrowLeft, Download, Share2, Printer, Edit, Trash2 } from 'lucide-react-native';

const C = { bg: '#12172B', card: '#1A2035', accent: '#F59E0B', text: '#FFFFFF', sub: '#8892A4', border: '#2A3350', input: '#0F172A', green: '#34D399', red: '#F87171' };

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    draft: { bg: '#334155', text: '#94A3B8' },
    posted: { bg: '#1E3A5F', text: '#60A5FA' },
    paid: { bg: '#14532D', text: '#34D399' },
    partially_paid: { bg: '#7C4A00', text: '#F59E0B' },
    overdue: { bg: '#7F1D1D', text: '#F87171' },
};

export default function InvoiceDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const { data: invoice, isLoading, isError } = useQuery({
        queryKey: ['invoice', id],
        queryFn: () => api.get(`/v1/invoices/${id}`).then(r => r.data),
    });

    if (isLoading) return <View style={s.center}><ActivityIndicator color={C.accent} size="large" /></View>;
    if (isError || !invoice) return <View style={s.center}><Text style={{ color: C.red }}>Failed to load invoice details.</Text></View>;

    const statusColor = STATUS_COLORS[invoice.status] || STATUS_COLORS.draft;

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" backgroundColor={C.bg} />
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}><ArrowLeft size={22} color={C.text} /></TouchableOpacity>
                <Text style={s.headerTitle}>Invoice {invoice.invoice_number}</Text>
                <View style={s.headerBtn} />
            </View>

            <ScrollView style={s.scroll}>
                <View style={s.summaryCard}>
                    <Text style={s.summaryAmount}>₹{(invoice.total_amount || 0).toLocaleString('en-IN')}</Text>
                    <View style={[s.badge, { backgroundColor: statusColor.bg, alignSelf: 'center', marginTop: 8 }]}>
                        <Text style={[s.badgeText, { color: statusColor.text }]}>{invoice.status.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={s.actionRow}>
                    <TouchableOpacity style={s.actionBtn} onPress={() => Alert.alert('Export', 'Generating PDF...')}><Download size={20} color={C.text} /><Text style={s.actionText}>PDF</Text></TouchableOpacity>
                    <TouchableOpacity style={s.actionBtn} onPress={() => Alert.alert('Share', 'Sharing link...')}><Share2 size={20} color={C.text} /><Text style={s.actionText}>Share</Text></TouchableOpacity>
                    <TouchableOpacity style={s.actionBtn}><Printer size={20} color={C.text} /><Text style={s.actionText}>Print</Text></TouchableOpacity>
                    <TouchableOpacity style={s.actionBtn}><Edit size={20} color={C.text} /><Text style={s.actionText}>Edit</Text></TouchableOpacity>
                </View>

                <View style={s.card}>
                    <Text style={s.sectionTitle}>Bill To</Text>
                    <Text style={s.partyName}>{invoice.party?.name || 'Unknown'}</Text>
                    {invoice.party?.email && <Text style={s.partyContact}>{invoice.party.email}</Text>}
                    {invoice.party?.phone && <Text style={s.partyContact}>{invoice.party.phone}</Text>}
                </View>

                <View style={s.card}>
                    <Text style={s.sectionTitle}>Details</Text>
                    <View style={s.detailRow}><Text style={s.detailLabel}>Invoice Date</Text><Text style={s.detailValue}>{invoice.date}</Text></View>
                    <View style={s.detailRow}><Text style={s.detailLabel}>Due Date</Text><Text style={s.detailValue}>{invoice.due_date}</Text></View>
                    <View style={s.detailRow}><Text style={s.detailLabel}>Subtotal</Text><Text style={s.detailValue}>₹{invoice.subtotal || 0}</Text></View>
                    <View style={s.detailRow}><Text style={s.detailLabel}>Tax Amount</Text><Text style={s.detailValue}>₹{invoice.tax_amount || 0}</Text></View>
                </View>

                <View style={s.card}>
                    <Text style={s.sectionTitle}>Items ({invoice.items?.length || 0})</Text>
                    {invoice.items?.map((item: any) => (
                        <View key={item.id} style={s.itemRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={s.itemName}>{item.item?.name || item.description}</Text>
                                <Text style={s.itemSub}>{item.quantity} x ₹{item.unit_price}</Text>
                            </View>
                            <Text style={s.itemTotal}>₹{item.total}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {invoice.status !== 'paid' && (
                <View style={s.footer}>
                    <TouchableOpacity style={s.recordPayBtn} onPress={() => Alert.alert('Record Payment', 'Opening payment modal...')}>
                        <Text style={s.recordPayText}>Record Payment</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 14, paddingHorizontal: 16, backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border },
    headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, color: C.text, fontSize: 17, fontWeight: 'bold', textAlign: 'center' },
    scroll: { flex: 1 },
    summaryCard: { alignItems: 'center', paddingVertical: 32 },
    summaryAmount: { color: C.text, fontSize: 36, fontWeight: 'bold' },
    badge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText: { fontSize: 12, fontWeight: 'bold' },
    actionRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: C.card, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border, marginBottom: 16 },
    actionBtn: { alignItems: 'center' },
    actionText: { color: C.text, fontSize: 12, marginTop: 6, fontWeight: '500' },
    card: { backgroundColor: C.card, marginHorizontal: 16, marginBottom: 16, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: C.border },
    sectionTitle: { color: C.text, fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
    partyName: { color: C.text, fontSize: 16, fontWeight: '600', marginBottom: 4 },
    partyContact: { color: C.sub, fontSize: 14 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
    detailLabel: { color: C.sub, fontSize: 14 },
    detailValue: { color: C.text, fontSize: 14, fontWeight: '500' },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
    itemName: { color: C.text, fontSize: 15, fontWeight: '500', marginBottom: 4 },
    itemSub: { color: C.sub, fontSize: 13 },
    itemTotal: { color: C.text, fontSize: 15, fontWeight: 'bold' },
    footer: { padding: 16, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border },
    recordPayBtn: { backgroundColor: C.accent, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
    recordPayText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
