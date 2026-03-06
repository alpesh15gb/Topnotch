import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Package, DollarSign, Target, Hash } from 'lucide-react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

const C = { bg: '#12172B', card: '#1A2035', accent: '#F59E0B', text: '#FFFFFF', sub: '#8892A4', border: '#2A3350', input: '#0F172A' };

export default function NewItemScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [name, setName] = useState('');
    const [type, setType] = useState('goods');
    const [salePrice, setSalePrice] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [stock, setStock] = useState('');

    const mutation = useMutation({
        mutationFn: () => api.post('/v1/items', {
            name,
            type,
            sale_price: parseFloat(salePrice) || 0,
            purchase_price: parseFloat(purchasePrice) || 0,
            current_stock: type === 'goods' ? (parseFloat(stock) || 0) : 0,
        }),
        onSuccess: () => {
            Alert.alert('Success', 'Item created successfully');
            queryClient.invalidateQueries({ queryKey: ['items'] });
            router.back();
        },
        onError: (err: any) => {
            Alert.alert('Error', err.response?.data?.message || 'Failed to create item');
        }
    });

    const handleSave = () => {
        if (!name) return Alert.alert('Error', 'Item name is required');
        mutation.mutate();
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" backgroundColor={C.bg} />
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}><ArrowLeft size={22} color={C.text} /></TouchableOpacity>
                <Text style={s.headerTitle}>New Item</Text>
                <View style={s.headerBtn} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView style={s.scroll} contentContainerStyle={{ padding: 16 }}>
                    <View style={s.typeToggle}>
                        <TouchableOpacity style={[s.typeBtn, type === 'goods' && s.typeBtnActive]} onPress={() => setType('goods')}>
                            <Text style={[s.typeText, type === 'goods' && s.typeTextActive]}>Goods/Product</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[s.typeBtn, type === 'service' && s.typeBtnActive]} onPress={() => setType('service')}>
                            <Text style={[s.typeText, type === 'service' && s.typeTextActive]}>Service</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={s.card}>
                        <View style={s.field}>
                            <Text style={s.label}>Item Name *</Text>
                            <View style={s.inputWrapper}>
                                <Package size={18} color={C.sub} style={s.inputIcon} />
                                <TextInput style={s.input} placeholder="e.g., iPhone 15 Pro, Consulting" placeholderTextColor={C.sub} value={name} onChangeText={setName} />
                            </View>
                        </View>

                        <View style={s.row}>
                            <View style={[s.field, { flex: 1, marginRight: 8 }]}>
                                <Text style={s.label}>Sale Price (₹)</Text>
                                <View style={s.inputWrapper}>
                                    <DollarSign size={18} color={C.sub} style={s.inputIcon} />
                                    <TextInput style={s.input} placeholder="0.00" placeholderTextColor={C.sub} keyboardType="decimal-pad" value={salePrice} onChangeText={setSalePrice} />
                                </View>
                            </View>
                            <View style={[s.field, { flex: 1, marginLeft: 8 }]}>
                                <Text style={s.label}>Purchase Price (₹)</Text>
                                <View style={s.inputWrapper}>
                                    <DollarSign size={18} color={C.sub} style={s.inputIcon} />
                                    <TextInput style={s.input} placeholder="0.00" placeholderTextColor={C.sub} keyboardType="decimal-pad" value={purchasePrice} onChangeText={setPurchasePrice} />
                                </View>
                            </View>
                        </View>

                        {type === 'goods' && (
                            <View style={s.field}>
                                <Text style={s.label}>Opening Stock</Text>
                                <View style={s.inputWrapper}>
                                    <Hash size={18} color={C.sub} style={s.inputIcon} />
                                    <TextInput style={s.input} placeholder="0" placeholderTextColor={C.sub} keyboardType="decimal-pad" value={stock} onChangeText={setStock} />
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={s.footer}>
                <TouchableOpacity style={s.saveBtnBig} onPress={handleSave} disabled={mutation.isPending}>
                    <Text style={s.saveBtnBigText}>{mutation.isPending ? 'Saving...' : 'Save Item'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 14, paddingHorizontal: 16, backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border },
    headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, color: C.text, fontSize: 17, fontWeight: 'bold', textAlign: 'center' },
    scroll: { flex: 1 },
    typeToggle: { flexDirection: 'row', backgroundColor: C.input, borderRadius: 12, padding: 4, marginBottom: 20 },
    typeBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    typeBtnActive: { backgroundColor: C.card, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 3 },
    typeText: { color: C.sub, fontSize: 14, fontWeight: '600' },
    typeTextActive: { color: C.text },
    card: { backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
    field: { marginBottom: 16 },
    row: { flexDirection: 'row' },
    label: { color: C.text, fontSize: 13, fontWeight: '600', marginBottom: 8 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.input, borderRadius: 10, borderWidth: 1, borderColor: C.border },
    inputIcon: { marginLeft: 12, marginRight: 8 },
    input: { flex: 1, color: C.text, fontSize: 15, paddingVertical: 12, paddingRight: 12 },
    footer: { padding: 16, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border },
    saveBtnBig: { backgroundColor: C.accent, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
    saveBtnBigText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
