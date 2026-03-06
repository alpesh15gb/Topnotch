import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { ArrowLeft, MapPin, Mail, Phone, Edit } from 'lucide-react-native';

const C = { bg: '#12172B', card: '#1A2035', accent: '#F59E0B', text: '#FFFFFF', sub: '#8892A4', border: '#2A3350', input: '#0F172A', green: '#34D399', red: '#F87171' };

export default function PartyDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const { data: party, isLoading, isError } = useQuery({
        queryKey: ['party', id],
        queryFn: () => api.get(`/v1/parties/${id}`).then(r => r.data),
    });

    if (isLoading) return <View style={s.center}><ActivityIndicator color={C.accent} size="large" /></View>;
    if (isError || !party) return <View style={s.center}><Text style={{ color: C.red }}>Failed to load party details.</Text></View>;

    const bal = parseFloat(party.current_balance || 0);

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" backgroundColor={C.bg} />
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}><ArrowLeft size={22} color={C.text} /></TouchableOpacity>
                <Text style={s.headerTitle}>{party.name}</Text>
                <TouchableOpacity style={s.headerBtn} onPress={() => Alert.alert('Edit', 'Edit party...')}><Edit size={20} color={C.text} /></TouchableOpacity>
            </View>

            <ScrollView style={s.scroll}>
                <View style={s.profileHeader}>
                    <View style={s.avatar}><Text style={s.avatarText}>{party.name.charAt(0).toUpperCase()}</Text></View>
                    <Text style={s.name}>{party.name}</Text>
                    <Text style={s.type}>{party.type.toUpperCase()}</Text>
                </View>

                <View style={s.balanceCard}>
                    <Text style={s.balLabel}>Current Balance</Text>
                    <Text style={[s.balAmount, bal < 0 ? { color: C.red } : { color: C.green }]}>
                        {bal < 0 ? 'Pay ₹' : 'Receive ₹'}{Math.abs(bal).toLocaleString('en-IN')}
                    </Text>
                </View>

                <View style={s.card}>
                    <Text style={s.sectionTitle}>Contact Info</Text>
                    <View style={s.infoRow}>
                        <Mail size={18} color={C.sub} style={s.infoIcon} />
                        <Text style={s.infoText}>{party.email || 'No email added'}</Text>
                    </View>
                    <View style={s.infoRow}>
                        <Phone size={18} color={C.sub} style={s.infoIcon} />
                        <Text style={s.infoText}>{party.phone || 'No phone added'}</Text>
                    </View>
                    <View style={[s.infoRow, { alignItems: 'flex-start', borderBottomWidth: 0 }]}>
                        <MapPin size={18} color={C.sub} style={[s.infoIcon, { marginTop: 2 }]} />
                        <Text style={s.infoText}>{party.address || 'No address added'}</Text>
                    </View>
                </View>

                <View style={s.card}>
                    <Text style={s.sectionTitle}>Recent Transactions</Text>
                    <View style={s.emptyState}>
                        <Text style={s.emptyText}>Transactions will appear here</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={s.footer}>
                <TouchableOpacity style={s.actionBtn}><Text style={s.actionText}>Give Payment</Text></TouchableOpacity>
                <TouchableOpacity style={[s.actionBtn, s.receiveBtn]}><Text style={s.receiveText}>Receive Payment</Text></TouchableOpacity>
            </View>
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
    profileHeader: { alignItems: 'center', paddingVertical: 24 },
    avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    avatarText: { color: C.text, fontSize: 32, fontWeight: 'bold' },
    name: { color: C.text, fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
    type: { color: C.sub, fontSize: 12, fontWeight: '600', letterSpacing: 1 },
    balanceCard: { backgroundColor: C.input, marginHorizontal: 16, borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: C.border, marginBottom: 16 },
    balLabel: { color: C.sub, fontSize: 14, marginBottom: 8 },
    balAmount: { fontSize: 28, fontWeight: 'bold' },
    card: { backgroundColor: C.card, marginHorizontal: 16, marginBottom: 16, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: C.border },
    sectionTitle: { color: C.text, fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
    infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
    infoIcon: { marginRight: 12 },
    infoText: { color: C.text, fontSize: 15, flex: 1 },
    emptyState: { paddingVertical: 24, alignItems: 'center' },
    emptyText: { color: C.sub, fontSize: 14 },
    footer: { flexDirection: 'row', padding: 16, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border, gap: 12 },
    actionBtn: { flex: 1, backgroundColor: C.input, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border },
    actionText: { color: C.text, fontSize: 15, fontWeight: '600' },
    receiveBtn: { backgroundColor: C.accent, borderColor: C.accent },
    receiveText: { color: '#000', fontSize: 15, fontWeight: 'bold' },
});
