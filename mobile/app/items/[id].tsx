import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { ArrowLeft, Package, Tag, BarChart3 } from 'lucide-react-native';

const C = { bg: '#12172B', card: '#1A2035', accent: '#F59E0B', text: '#FFFFFF', sub: '#8892A4', border: '#2A3350', input: '#0F172A', green: '#34D399', red: '#F87171' };

const fmt = (n: number) => '₹' + (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ItemDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const { data: item, isLoading, isError } = useQuery({
        queryKey: ['item', id],
        queryFn: () => api.get(`/v1/items/${id}`).then(r => r.data),
    });

    if (isLoading) return <View style={s.center}><ActivityIndicator color={C.accent} size="large" /></View>;
    if (isError || !item) return <View style={s.center}><Text style={{ color: C.red }}>Failed to load item details.</Text></View>;

    const isGoods = item.type === 'goods';

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" backgroundColor={C.bg} />
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}><ArrowLeft size={22} color={C.text} /></TouchableOpacity>
                <Text style={s.headerTitle} numberOfLines={1}>{item.name}</Text>
                <View style={s.headerBtn} />
            </View>

            <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Icon + Name */}
                <View style={s.profileHeader}>
                    <View style={s.iconBox}>
                        <Package size={36} color={C.accent} />
                    </View>
                    <Text style={s.name}>{item.name}</Text>
                    <View style={s.typeBadge}>
                        <Text style={s.typeText}>{isGoods ? 'GOODS' : 'SERVICE'}</Text>
                    </View>
                    {item.hsn_code && (
                        <Text style={s.hsn}>HSN: {item.hsn_code}</Text>
                    )}
                </View>

                {/* Pricing */}
                <View style={s.card}>
                    <Text style={s.sectionTitle}>Pricing</Text>
                    <View style={s.row}>
                        <Text style={s.rowLabel}>Sale Price</Text>
                        <Text style={[s.rowValue, { color: C.green }]}>{fmt(item.sale_price)}</Text>
                    </View>
                    <View style={s.row}>
                        <Text style={s.rowLabel}>Purchase Price</Text>
                        <Text style={s.rowValue}>{fmt(item.purchase_price)}</Text>
                    </View>
                    {item.tax_rate > 0 && (
                        <View style={[s.row, { borderBottomWidth: 0 }]}>
                            <Text style={s.rowLabel}>GST Rate</Text>
                            <View style={s.gstBadge}>
                                <Tag size={12} color={C.accent} />
                                <Text style={s.gstText}>{item.tax_rate}%</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Stock (goods only) */}
                {isGoods && (
                    <View style={s.card}>
                        <Text style={s.sectionTitle}>Inventory</Text>
                        <View style={s.row}>
                            <Text style={s.rowLabel}>Current Stock</Text>
                            <Text style={[s.rowValue, { color: (item.current_stock || 0) > 0 ? C.green : C.red }]}>
                                {item.current_stock || 0} {item.unit || 'units'}
                            </Text>
                        </View>
                        {item.opening_stock !== undefined && (
                            <View style={s.row}>
                                <Text style={s.rowLabel}>Opening Stock</Text>
                                <Text style={s.rowValue}>{item.opening_stock || 0} {item.unit || 'units'}</Text>
                            </View>
                        )}
                        <View style={[s.row, { borderBottomWidth: 0 }]}>
                            <Text style={s.rowLabel}>Unit</Text>
                            <Text style={s.rowValue}>{item.unit || '—'}</Text>
                        </View>
                    </View>
                )}

                {/* Description */}
                {item.description && (
                    <View style={s.card}>
                        <Text style={s.sectionTitle}>Description</Text>
                        <Text style={s.description}>{item.description}</Text>
                    </View>
                )}
            </ScrollView>
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
    profileHeader: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 16 },
    iconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    name: { color: C.text, fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
    typeBadge: { backgroundColor: C.input, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: C.border },
    typeText: { color: C.sub, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
    hsn: { color: C.sub, fontSize: 12, marginTop: 6 },
    card: { backgroundColor: C.card, marginHorizontal: 16, marginBottom: 16, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: C.border },
    sectionTitle: { color: C.text, fontSize: 15, fontWeight: 'bold', marginBottom: 14 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
    rowLabel: { color: C.sub, fontSize: 14 },
    rowValue: { color: C.text, fontSize: 15, fontWeight: '600' },
    gstBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.input, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: C.border },
    gstText: { color: C.accent, fontSize: 14, fontWeight: '700' },
    description: { color: C.sub, fontSize: 14, lineHeight: 22 },
});
