import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

const C = { bg: '#12172B', card: '#1A2035', accent: '#F59E0B', text: '#FFFFFF', sub: '#8892A4', border: '#2A3350', input: '#0F172A' };

export default function NewPartyScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('customer');
    const [address, setAddress] = useState('');

    const mutation = useMutation({
        mutationFn: () => api.post('/v1/parties', { name, email, phone, type, address }),
        onSuccess: () => {
            Alert.alert('Success', 'Party created successfully');
            queryClient.invalidateQueries({ queryKey: ['parties'] });
            router.back();
        },
        onError: (err: any) => {
            Alert.alert('Error', err.response?.data?.message || 'Failed to create party');
        }
    });

    const handleSave = () => {
        if (!name) return Alert.alert('Error', 'Name is required');
        mutation.mutate();
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" backgroundColor={C.bg} />
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}><ArrowLeft size={22} color={C.text} /></TouchableOpacity>
                <Text style={s.headerTitle}>New Party</Text>
                <View style={s.headerBtn} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView style={s.scroll} contentContainerStyle={{ padding: 16 }}>
                    <View style={s.typeToggle}>
                        <TouchableOpacity style={[s.typeBtn, type === 'customer' && s.typeBtnActive]} onPress={() => setType('customer')}>
                            <Text style={[s.typeText, type === 'customer' && s.typeTextActive]}>Customer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[s.typeBtn, type === 'supplier' && s.typeBtnActive]} onPress={() => setType('supplier')}>
                            <Text style={[s.typeText, type === 'supplier' && s.typeTextActive]}>Supplier</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={s.card}>
                        <View style={s.field}>
                            <Text style={s.label}>Party Name *</Text>
                            <View style={s.inputWrapper}>
                                <User size={18} color={C.sub} style={s.inputIcon} />
                                <TextInput style={s.input} placeholder="Acme Corp" placeholderTextColor={C.sub} value={name} onChangeText={setName} />
                            </View>
                        </View>

                        <View style={s.field}>
                            <Text style={s.label}>Email Address</Text>
                            <View style={s.inputWrapper}>
                                <Mail size={18} color={C.sub} style={s.inputIcon} />
                                <TextInput style={s.input} placeholder="contact@acme.com" placeholderTextColor={C.sub} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                            </View>
                        </View>

                        <View style={s.field}>
                            <Text style={s.label}>Phone Number</Text>
                            <View style={s.inputWrapper}>
                                <Phone size={18} color={C.sub} style={s.inputIcon} />
                                <TextInput style={s.input} placeholder="+91 9876543210" placeholderTextColor={C.sub} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
                            </View>
                        </View>

                        <View style={s.field}>
                            <Text style={s.label}>Billing Address</Text>
                            <View style={[s.inputWrapper, { alignItems: 'flex-start', paddingTop: 12 }]}>
                                <MapPin size={18} color={C.sub} style={s.inputIcon} />
                                <TextInput style={[s.input, { height: 80, textAlignVertical: 'top' }]} placeholder="Street address, City, ZIP" placeholderTextColor={C.sub} multiline value={address} onChangeText={setAddress} />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={s.footer}>
                <TouchableOpacity style={s.saveBtnBig} onPress={handleSave} disabled={mutation.isPending}>
                    <Text style={s.saveBtnBigText}>{mutation.isPending ? 'Saving...' : 'Save Party'}</Text>
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
    label: { color: C.text, fontSize: 13, fontWeight: '600', marginBottom: 8 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.input, borderRadius: 10, borderWidth: 1, borderColor: C.border },
    inputIcon: { marginLeft: 12, marginRight: 8 },
    input: { flex: 1, color: C.text, fontSize: 15, paddingVertical: 12, paddingRight: 12 },
    footer: { padding: 16, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border },
    saveBtnBig: { backgroundColor: C.accent, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
    saveBtnBigText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
