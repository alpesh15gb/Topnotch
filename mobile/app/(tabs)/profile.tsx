import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Settings, LogOut, ChevronRight, User, Building2, FileText, BarChart3 } from 'lucide-react-native';
import { useAuthStore } from '../../store/auth-store';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const C = {
  bg: '#12172B', card: '#1A2035', accent: '#F59E0B',
  text: '#FFF', sub: '#8892A4', border: '#2A3350', input: '#0F172A', red: '#F87171',
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const { data: company } = useQuery({
    queryKey: ['company'],
    queryFn: () => api.get('/v1/settings/company').then(r => r.data),
  });

  const handleLogout = () => { logout(); router.replace('/auth/login'); };

  const quickLinks = [
    { icon: <FileText size={20} color={C.accent} />, label: 'Invoices', onPress: () => router.push('/(tabs)/sales' as any) },
    { icon: <BarChart3 size={20} color="#A78BFA" />, label: 'Reports', onPress: () => router.push('/reports/index' as any) },
    { icon: <Settings size={20} color={C.sub} />, label: 'Settings', onPress: () => {} },
  ];

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* User Card */}
        <View style={s.userCard}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'A'}</Text>
          </View>
          <Text style={s.name}>{user?.name || 'Administrator'}</Text>
          <Text style={s.email}>{user?.email || ''}</Text>
        </View>

        {/* Company Info */}
        {company && (
          <View style={s.companyCard}>
            <View style={s.companyRow}>
              <Building2 size={18} color={C.accent} />
              <View style={{ marginLeft: 12 }}>
                <Text style={s.companyName}>{company.company_name || company.name}</Text>
                {company.gstin && <Text style={s.companyGstin}>GSTIN: {company.gstin}</Text>}
                {company.city && <Text style={s.companyCity}>{[company.city, company.state].filter(Boolean).join(', ')}</Text>}
              </View>
            </View>
          </View>
        )}

        {/* Quick Links */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Quick Access</Text>
          <View style={s.card}>
            {quickLinks.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[s.row, idx < quickLinks.length - 1 && s.rowBorder]}
                onPress={item.onPress}
              >
                <View style={s.rowIcon}>{item.icon}</View>
                <Text style={s.rowLabel}>{item.label}</Text>
                <ChevronRight size={16} color={C.border} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View style={[s.section, { marginTop: 8 }]}>
          <TouchableOpacity style={[s.card, s.row]} onPress={handleLogout}>
            <View style={s.rowIcon}><LogOut size={20} color={C.red} /></View>
            <Text style={[s.rowLabel, { color: C.red, fontWeight: '700' }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.version}>TopNotch Accounting v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  userCard: { alignItems: 'center', paddingTop: 60, paddingBottom: 32, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: C.border },
  avatar: { width: 80, height: 80, backgroundColor: C.accent, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#000', fontSize: 32, fontWeight: 'bold' },
  name: { color: C.text, fontSize: 20, fontWeight: '700', marginBottom: 4 },
  email: { color: C.sub, fontSize: 14 },
  companyCard: { margin: 16, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  companyRow: { flexDirection: 'row', alignItems: 'flex-start' },
  companyName: { color: C.text, fontSize: 16, fontWeight: '700' },
  companyGstin: { color: C.sub, fontSize: 12, marginTop: 2 },
  companyCity: { color: C.sub, fontSize: 12, marginTop: 1 },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionLabel: { color: C.sub, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
  card: { backgroundColor: C.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  rowIcon: { marginRight: 14, width: 28, alignItems: 'center' },
  rowLabel: { flex: 1, fontSize: 15, color: C.text, fontWeight: '500' },
  version: { textAlign: 'center', color: C.border, fontSize: 12, marginTop: 24 },
});
