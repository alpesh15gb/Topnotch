import React from 'react';
import { Tabs } from 'expo-router';
import { Home, FileText, Package, Users, MoreHorizontal } from 'lucide-react-native';

const C = { bg: '#12172B', tabBar: '#1A2035', accent: '#F59E0B', inactive: '#4A5568', border: '#2A3350' };

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.inactive,
        tabBarStyle: {
          backgroundColor: C.tabBar,
          borderTopWidth: 1,
          borderTopColor: C.border,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        headerStyle: { backgroundColor: C.bg },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: 'Bills',
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: 'Items',
          tabBarIcon: ({ color, size }) => <Package size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="parties"
        options={{
          title: 'Parties',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => <MoreHorizontal size={size} color={color} strokeWidth={2} />,
        }}
      />
      {/* Hidden tabs — still routable but not shown in tab bar */}
      <Tabs.Screen name="purchases" options={{ href: null }} />
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}
