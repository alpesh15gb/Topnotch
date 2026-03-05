import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth-store';
import api from '../../lib/api';

const C = { primary: '#0F172A', accent: '#F59E0B', bg: '#F8FAFC' };

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleLogin = async () => {
        if (!email || !password) { Alert.alert('Error', 'Please fill in all fields'); return; }
        setLoading(true);
        try {
            const response = await api.post('/v1/auth/login', { email, password });
            const { user, token } = response.data;
            setAuth(user, token);
            router.replace('/(tabs)');
        } catch (error: any) {
            console.log('Login error:', JSON.stringify(error?.response?.data), error?.message, error?.code);
            Alert.alert('Login Failed', error.response?.data?.message || error?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: C.bg }}>
            <ScrollView contentContainerStyle={s.scroll}>
                <View style={s.logoBox}>
                    <Image source={require('../../assets/images/logo.png')} style={s.logo} resizeMode="contain" />
                    <Text style={s.tagline}>Manage your business on the go</Text>
                </View>

                <View style={s.form}>
                    <Text style={s.formTitle}>Sign In</Text>

                    <Text style={s.label}>Email Address</Text>
                    <TextInput style={s.input} placeholder="name@company.com" placeholderTextColor="#94A3B8" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

                    <Text style={s.label}>Password</Text>
                    <TextInput style={s.input} placeholder="••••••••" placeholderTextColor="#94A3B8" value={password} onChangeText={setPassword} secureTextEntry />

                    <TouchableOpacity style={s.forgotBtn} onPress={() => {}}>
                        <Text style={s.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleLogin} disabled={loading}>
                        <Text style={s.btnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
                    </TouchableOpacity>

                    <View style={s.registerRow}>
                        <Text style={s.registerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/register')}>
                            <Text style={s.registerLink}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    logoBox: { alignItems: 'center', marginBottom: 32 },
    logo: { width: 180, height: 110 },
    tagline: { color: '#64748B', fontSize: 14, marginTop: 8 },
    form: { backgroundColor: '#fff', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
    formTitle: { fontSize: 22, fontWeight: 'bold', color: C.primary, marginBottom: 20 },
    label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
    input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: C.primary, marginBottom: 14 },
    forgotBtn: { alignSelf: 'flex-end', marginBottom: 20 },
    forgotText: { color: C.accent, fontSize: 13, fontWeight: '600' },
    btn: { backgroundColor: C.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    btnDisabled: { opacity: 0.6 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    registerText: { color: '#94A3B8', fontSize: 14 },
    registerLink: { color: C.accent, fontWeight: 'bold', fontSize: 14 },
});
