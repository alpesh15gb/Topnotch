import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Settings, Bell, Shield, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '../../store/auth-store';
import { useRouter } from 'expo-router';

const C = { primary: '#0F172A', accent: '#F59E0B', bg: '#F8FAFC' };

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => { logout(); router.replace('/auth/login'); };

  const menuItems = [
    { icon: <Settings size={20} color="#475569" />, label: 'Account Settings' },
    { icon: <Bell size={20} color="#475569" />, label: 'Notifications' },
    { icon: <Shield size={20} color="#475569" />, label: 'Security & Privacy' },
  ];

  return (
    <View style={s.container}>
      <ScrollView>
        <View style={s.header}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'A'}</Text>
          </View>
          <Text style={s.name}>{user?.name || 'Administrator'}</Text>
          <Text style={s.email}>{user?.email || 'admin@topnotch.app'}</Text>
        </View>

        <View style={s.section}>
          <View style={s.card}>
            {menuItems.map((item, idx) => (
              <TouchableOpacity key={idx} style={[s.row, idx < menuItems.length - 1 && s.rowBorder]}>
                <View style={s.rowIcon}>{item.icon}</View>
                <Text style={s.rowLabel}>{item.label}</Text>
                <ChevronRight size={18} color="#CBD5E1" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[s.card, s.row, { marginTop: 16 }]} onPress={handleLogout}>
            <View style={s.rowIcon}><LogOut size={20} color="#EF4444" /></View>
            <Text style={[s.rowLabel, { color: '#EF4444', fontWeight: 'bold' }]}>Log Out</Text>
          </TouchableOpacity>

          <Text style={s.version}>TopNotch Accounting Mobile v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { backgroundColor: C.primary, paddingVertical: 40, alignItems: 'center' },
  avatar: { width: 80, height: 80, backgroundColor: C.accent, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)' },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  name: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  email: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 },
  section: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1, borderWidth: 1, borderColor: '#F1F5F9' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  rowIcon: { marginRight: 14 },
  rowLabel: { flex: 1, fontSize: 15, color: C.primary, fontWeight: '500' },
  version: { textAlign: 'center', color: '#CBD5E1', fontSize: 12, marginTop: 24 },
});
