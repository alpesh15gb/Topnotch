import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { TrendingUp, TrendingDown, Clock, Plus } from 'lucide-react-native';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const kpis = [
    { title: 'Today\'s Sales', amount: '₹12,450', icon: <TrendingUp color="#10B981" size={24} />, trend: '+12%' },
    { title: 'Weekly Expenses', amount: '₹4,200', icon: <TrendingDown color="#EF4444" size={24} />, trend: '-5%' },
    { title: 'Pending GST', amount: '₹1,500', icon: <Clock color="#F59E0B" size={24} />, trend: 'Due 15th' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="p-6">
          <Text className="text-gray-500 text-sm font-medium uppercase tracking-wider">Financial Overview</Text>
          <Text className="text-primary text-2xl font-bold mt-1">Hello, Admin!</Text>

          {/* KPI Cards */}
          <View className="flex-row flex-wrap justify-between mt-6">
            {kpis.map((kpi, idx) => (
              <View key={idx} className="bg-white p-4 rounded-2xl w-[48%] mb-4 shadow-sm border border-gray-100">
                <View className="flex-row justify-between items-center mb-2">
                  <View className="bg-gray-50 p-2 rounded-lg">{kpi.icon}</View>
                  <Text className="text-xs font-bold text-gray-400">{kpi.trend}</Text>
                </View>
                <Text className="text-gray-500 text-xs font-medium">{kpi.title}</Text>
                <Text className="text-primary text-lg font-bold mt-1">{kpi.amount}</Text>
              </View>
            ))}
          </View>

          {/* Recent Activity */}
          <Text className="text-primary text-xl font-bold mt-4 mb-4">Recent Activity</Text>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} className="bg-white p-4 rounded-2xl mb-3 flex-row items-center shadow-sm border border-gray-100">
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
                <Text className="text-blue-600 font-bold">INV</Text>
              </View>
              <View className="flex-1">
                <Text className="text-primary font-bold">Invoice #INV-00{i}</Text>
                <Text className="text-gray-500 text-xs">Customer Acme Corp • Today</Text>
              </View>
              <Text className="text-primary font-bold">₹2,500</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-accent rounded-full items-center justify-center shadow-lg"
        onPress={() => { }}
      >
        <Plus color="white" size={32} />
      </TouchableOpacity>
    </View>
  );
}
