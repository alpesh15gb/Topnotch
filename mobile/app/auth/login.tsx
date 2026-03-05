import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth-store';
import api from '../../lib/api';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/login', { email, password });
            const { user, token } = response.data;
            setAuth(user, token);
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <View className="flex-1 justify-center px-8">
                <View className="items-center mb-12">
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={{ width: 160, height: 100 }}
                        resizeMode="contain"
                    />
                    <Text className="text-gray-500 mt-2">Manage your business on the go</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-700 mb-2 font-semibold">Email Address</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-primary"
                            placeholder="name@company.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-700 mb-2 font-semibold">Password</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-primary"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        className={`bg-primary p-4 rounded-xl items-center mt-4 ${loading ? 'opacity-70' : ''}`}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text className="text-white font-bold text-lg">
                            {loading ? 'Logging in...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center mt-4">
                        <Text className="text-primary font-semibold">Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-12 flex-row justify-center">
                    <Text className="text-gray-500">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/auth/register')}>
                        <Text className="text-accent font-bold">Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
