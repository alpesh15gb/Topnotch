import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Clock, Plus, FileText, ShoppingCart, CreditCard } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const C = { primary: '#0F172A', accent: '#F59E0B', bg: '#F8FAFC' };

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const kpis = [
    { title: "Today's Sales", amount: '₹12,450', icon: <TrendingUp color="#10B981" size={22} />, trend: '+12%', trendColor: '#10B981', route: '/(tabs)/sales' },
    { title: 'Weekly Expenses', amount: '₹4,200', icon: <TrendingDown color="#EF4444" size={22} />, trend: '-5%', trendColor: '#EF4444', route: '/(tabs)/purchases' },
    { title: 'Pending GST', amount: '₹1,500', icon: <Clock color={C.accent} size={22} />, trend: 'Due 15th', trendColor: C.accent, route: '/(tabs)/sales' },
  ];

  const quickActions = [
    { label: 'New Invoice', icon: <FileText color="#fff" size={20} />, route: '/sales/new', bg: '#3B82F6' },
    { label: 'New Purchase', icon: <ShoppingCart color="#fff" size={20} />, route: '/purchases/new', bg: '#8B5CF6' },
    { label: 'New Expense', icon: <CreditCard color="#fff" size={20} />, route: '/(tabs)/purchases', bg: '#EF4444' },
  ];

  return (
    <View style={s.container}>
      <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={s.content}>
          <Text style={s.label}>FINANCIAL OVERVIEW</Text>
          <Text style={s.heading}>Hello, Admin!</Text>

          {/* KPI Cards */}
          <View style={s.kpiRow}>
            {kpis.map((kpi, idx) => (
              <TouchableOpacity key={idx} style={s.kpiCard} onPress={() => router.push(kpi.route as any)}>
                <View style={s.kpiTop}>
                  <View style={s.kpiIcon}>{kpi.icon}</View>
                  <Text style={[s.trend, { color: kpi.trendColor }]}>{kpi.trend}</Text>
                </View>
                <Text style={s.kpiTitle}>{kpi.title}</Text>
                <Text style={s.kpiAmount}>{kpi.amount}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <Text style={s.sectionTitle}>Quick Actions</Text>
          <View style={s.actionsRow}>
            {quickActions.map((action, idx) => (
              <TouchableOpacity key={idx} style={[s.actionBtn, { backgroundColor: action.bg }]} onPress={() => router.push(action.route as any)}>
                {action.icon}
                <Text style={s.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Activity */}
          <Text style={s.sectionTitle}>Recent Invoices</Text>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} style={s.activityRow} onPress={() => router.push('/sales/new' as any)}>
              <View style={s.invBadge}><Text style={s.invText}>INV</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.invTitle}>Invoice #INV-00{i}</Text>
                <Text style={s.invSub}>Customer Acme Corp • Today</Text>
              </View>
              <Text style={s.invAmount}>₹2,500</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={s.fab} onPress={() => router.push('/sales/new' as any)}>
        <Plus color="white" size={28} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20 },
  label: { fontSize: 11, fontWeight: '600', color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase' },
  heading: { fontSize: 24, fontWeight: 'bold', color: C.primary, marginTop: 4 },
  kpiRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
  kpiCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, width: '48%', marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  kpiTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  kpiIcon: { backgroundColor: '#F8FAFC', padding: 6, borderRadius: 8 },
  trend: { fontSize: 11, fontWeight: 'bold' },
  kpiTitle: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  kpiAmount: { fontSize: 18, fontWeight: 'bold', color: C.primary, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: C.primary, marginTop: 8, marginBottom: 12 },
  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  actionBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 14, gap: 6 },
  actionLabel: { color: '#fff', fontSize: 11, fontWeight: '700', textAlign: 'center' },
  activityRow: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1, borderWidth: 1, borderColor: '#F1F5F9' },
  invBadge: { width: 40, height: 40, backgroundColor: '#EFF6FF', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  invText: { color: '#3B82F6', fontWeight: 'bold', fontSize: 10 },
  invTitle: { fontSize: 14, fontWeight: 'bold', color: C.primary },
  invSub: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  invAmount: { fontSize: 14, fontWeight: 'bold', color: C.primary },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, backgroundColor: C.accent, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 6 },
});
