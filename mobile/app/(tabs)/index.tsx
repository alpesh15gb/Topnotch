import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import {
  FileText, ShoppingCart, FileCheck, Truck,
  CreditCard, Package, Receipt, ClipboardList,
  BarChart2, Users, Settings, ChevronDown,
  TrendingUp, BookOpen
} from 'lucide-react-native';
import { useAuthStore } from '../../store/auth-store';

const C = { bg: '#12172B', card: '#1E2640', accent: '#F59E0B', text: '#FFFFFF', sub: '#8892A4', border: '#2A3350' };

const CREATE_ACTIONS = [
  { label: 'Invoice',         icon: FileText,      route: '/sales/new',      color: '#60A5FA' },
  { label: 'Purchase',        icon: ShoppingCart,  route: '/purchases/new',  color: '#60A5FA' },
  { label: 'Estimate',        icon: FileCheck,     route: '/sales/new',      color: '#60A5FA' },
  { label: 'Delivery\nChallan', icon: Truck,       route: '/sales/new',      color: '#60A5FA' },
  { label: 'Credit Note',     icon: CreditCard,    route: '/sales/new',      color: '#60A5FA' },
  { label: 'Purchase\nOrder', icon: ClipboardList, route: '/purchases/new',  color: '#60A5FA' },
  { label: 'Expenses',        icon: Receipt,       route: '/purchases/new',  color: '#60A5FA' },
  { label: 'Pro Forma\nInvoice', icon: FileText,   route: '/sales/new',      color: '#60A5FA' },
];

const QUICK_ACCESS = [
  { label: 'Reports',   icon: BarChart2,     route: '/(tabs)/sales',     color: '#A78BFA' },
  { label: 'Parties',   icon: Users,         route: '/(tabs)/parties',   color: '#34D399' },
  { label: 'Items',     icon: Package,       route: '/(tabs)/items',     color: '#F59E0B' },
  { label: 'Settings',  icon: Settings,      route: '/(tabs)/profile',   color: '#94A3B8' },
  { label: 'Sales',     icon: TrendingUp,    route: '/(tabs)/sales',     color: '#60A5FA' },
  { label: 'Ledger',    icon: BookOpen,      route: '/(tabs)/profile',   color: '#F87171' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.companyAvatar}>
            <Text style={s.companyInitial}>TN</Text>
          </View>
          <TouchableOpacity style={s.companyNameRow}>
            <Text style={s.companyName} numberOfLines={1}>TopNotch</Text>
            <ChevronDown size={16} color={C.text} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
        <Image source={require('../../assets/images/logo.png')} style={s.headerLogo} resizeMode="contain" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Sales / Purchases Summary */}
        <View style={s.summaryCard}>
          <View style={s.summaryTop}>
            <TouchableOpacity style={s.periodRow}>
              <Text style={s.periodText}>This Year</Text>
              <ChevronDown size={14} color={C.text} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/sales' as any)}>
              <Text style={s.viewLink}>View Bills</Text>
            </TouchableOpacity>
          </View>
          <View style={s.summaryRow}>
            <TouchableOpacity style={s.summaryItem} onPress={() => router.push('/(tabs)/sales' as any)}>
              <Text style={s.summaryLabel}>Sales</Text>
              <Text style={s.summaryAmount}>₹0.00</Text>
            </TouchableOpacity>
            <View style={s.summaryDivider} />
            <TouchableOpacity style={s.summaryItem} onPress={() => router.push('/(tabs)/purchases' as any)}>
              <Text style={s.summaryLabel}>Purchases</Text>
              <Text style={s.summaryAmount}>₹0.00</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Create Section */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Create</Text>
          <View style={s.grid}>
            {CREATE_ACTIONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity key={idx} style={s.gridItem} onPress={() => router.push(item.route as any)}>
                  <View style={s.gridIcon}>
                    <Icon size={28} color={item.color} strokeWidth={1.5} />
                  </View>
                  <Text style={s.gridLabel}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quick Access */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Quick Access</Text>
          <View style={s.grid}>
            {QUICK_ACCESS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity key={idx} style={s.gridItem} onPress={() => router.push(item.route as any)}>
                  <View style={s.gridIcon}>
                    <Icon size={28} color={item.color} strokeWidth={1.5} />
                  </View>
                  <Text style={s.gridLabel}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  companyAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  companyInitial: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  companyNameRow: { flexDirection: 'row', alignItems: 'center' },
  companyName: { color: C.text, fontWeight: 'bold', fontSize: 16, maxWidth: 160 },
  headerLogo: { width: 90, height: 40 },
  summaryCard: { backgroundColor: C.card, margin: 14, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  periodRow: { flexDirection: 'row', alignItems: 'center' },
  periodText: { color: C.text, fontWeight: '600', fontSize: 15 },
  viewLink: { color: C.accent, fontWeight: '600', fontSize: 14 },
  summaryRow: { flexDirection: 'row' },
  summaryItem: { flex: 1, alignItems: 'flex-start' },
  summaryLabel: { color: C.sub, fontSize: 13, marginBottom: 4 },
  summaryAmount: { color: C.text, fontSize: 22, fontWeight: 'bold' },
  summaryDivider: { width: 1, backgroundColor: C.border, marginHorizontal: 16 },
  section: { backgroundColor: C.card, marginHorizontal: 14, marginBottom: 14, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
  sectionTitle: { color: C.text, fontSize: 17, fontWeight: 'bold', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '25%', alignItems: 'center', marginBottom: 20 },
  gridIcon: { width: 54, height: 54, borderRadius: 14, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 1, borderColor: C.border },
  gridLabel: { color: C.text, fontSize: 11, textAlign: 'center', lineHeight: 15 },
});
