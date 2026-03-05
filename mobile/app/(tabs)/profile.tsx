import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { User, Settings, Bell, Shield, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '../../store/auth-store';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.replace('/auth/login');
    };

    const menuItems = [
        { icon: <Settings size={22} color="#475569" />, label: 'Account Settings' },
        { icon: <Bell size={22} color="#475569" />, label: 'Notifications' },
        { icon: <Shield size={22} color="#475569" />, label: 'Security & Privacy' },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                {/* Header */}
                <View className="bg-primary p-8 items-center">
                    <View className="w-24 h-24 bg-accent rounded-full border-4 border-white/20 items-center justify-center mb-4">
                        <Text className="text-white text-3xl font-bold">
                            {user?.name?.charAt(0) || 'A'}
                        </Text>
                    </View>
                    <Text className="text-white text-xl font-bold">{user?.name || 'Administrator'}</Text>
                    <Text className="text-white/60 text-sm">{user?.email || 'admin@topnotch.app'}</Text>
                </View>

                {/* Menu Items */}
                <View className="p-6">
                    <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-6">
                        {menuItems.map((item, idx) => (
                            <TouchableOpacity
                                key={idx}
                                className={`flex-row items-center p-4 ${idx !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
                            >
                                <View className="mr-4">{item.icon}</View>
                                <Text className="flex-1 text-primary font-medium">{item.label}</Text>
                                <ChevronRight size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        className="bg-white rounded-2xl flex-row items-center p-4 shadow-sm border border-gray-100"
                        onPress={handleLogout}
                    >
                        <View className="mr-4">
                            <LogOut size={22} color="#EF4444" />
                        </View>
                        <Text className="flex-1 text-red-500 font-bold">Log Out</Text>
                    </TouchableOpacity>

                    <View className="items-center mt-8">
                        <Text className="text-gray-400 text-xs">TopNotch Accounting Mobile v1.0.0</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
