import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../lib/api';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        if (!name || !email || !password || !passwordConfirmation) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== passwordConfirmation) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.post('/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            Alert.alert('Success', 'Account created successfully! Please login.', [
                { text: 'OK', onPress: () => router.replace('/auth/login') }
            ]);
        } catch (error: any) {
            Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                <View className="flex-1 justify-center px-8 mt-16">
                    <View className="items-center mb-8">
                        <Text className="text-primary text-2xl font-bold">Create Account</Text>
                        <Text className="text-gray-500 mt-2">Join TopNotch Accounting today</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-700 mb-2 font-semibold">Full Name</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-primary"
                                placeholder="John Doe"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

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

                        <View>
                            <Text className="text-gray-700 mb-2 font-semibold">Confirm Password</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-primary"
                                placeholder="••••••••"
                                value={passwordConfirmation}
                                onChangeText={setPasswordConfirmation}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            className={`bg-primary p-4 rounded-xl items-center mt-4 ${loading ? 'opacity-70' : ''}`}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            <Text className="text-white font-bold text-lg">
                                {loading ? 'Creating Account...' : 'Register'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="mt-8 flex-row justify-center">
                        <Text className="text-gray-500">Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/login')}>
                            <Text className="text-accent font-bold">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
