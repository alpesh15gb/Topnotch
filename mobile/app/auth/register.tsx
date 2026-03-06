import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ScrollView, StyleSheet, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth-store';

const C = {
  bg: '#12172B', card: '#1A2035', accent: '#F59E0B',
  text: '#FFFFFF', sub: '#8892A4', border: '#2A3350', input: '#0F172A',
};

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleRegister = async () => {
    if (!name || !companyName || !email || !password || !passwordConfirmation) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== passwordConfirmation) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/v1/auth/register', {
        name,
        email,
        password,
        company_name: companyName,
      });
      const { user, token } = res.data;
      setAuth(user, token);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Registration Failed', error?.response?.data?.message || error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={s.inner}>
            <View style={s.titleBlock}>
              <Text style={s.title}>Create Account</Text>
              <Text style={s.subtitle}>Join TopNotch Accounting today</Text>
            </View>

            <View style={s.form}>
              <View style={s.field}>
                <Text style={s.label}>Full Name</Text>
                <TextInput
                  style={s.input}
                  placeholder="John Doe"
                  placeholderTextColor={C.sub}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={s.field}>
                <Text style={s.label}>Company Name</Text>
                <TextInput
                  style={s.input}
                  placeholder="My Company Pvt Ltd"
                  placeholderTextColor={C.sub}
                  value={companyName}
                  onChangeText={setCompanyName}
                />
              </View>

              <View style={s.field}>
                <Text style={s.label}>Email Address</Text>
                <TextInput
                  style={s.input}
                  placeholder="name@company.com"
                  placeholderTextColor={C.sub}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={s.field}>
                <Text style={s.label}>Password</Text>
                <TextInput
                  style={s.input}
                  placeholder="••••••••"
                  placeholderTextColor={C.sub}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={s.field}>
                <Text style={s.label}>Confirm Password</Text>
                <TextInput
                  style={s.input}
                  placeholder="••••••••"
                  placeholderTextColor={C.sub}
                  value={passwordConfirmation}
                  onChangeText={setPasswordConfirmation}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={[s.btn, loading && { opacity: 0.7 }]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={s.btnText}>
                  {loading ? 'Creating Account...' : 'Register'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={s.footer}>
              <Text style={s.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={s.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  titleBlock: { alignItems: 'center', marginBottom: 32 },
  title: { color: C.text, fontSize: 26, fontWeight: 'bold' },
  subtitle: { color: C.sub, fontSize: 14, marginTop: 6 },
  form: { gap: 16 },
  field: { gap: 6 },
  label: { color: C.sub, fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: C.input, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    color: C.text, fontSize: 15,
  },
  btn: {
    backgroundColor: C.accent, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  btnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { color: C.sub, fontSize: 14 },
  footerLink: { color: C.accent, fontSize: 14, fontWeight: 'bold' },
});
