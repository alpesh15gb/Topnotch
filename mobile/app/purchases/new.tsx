import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save, Camera, Paperclip } from 'lucide-react-native';

export default function NewExpenseScreen() {
    const router = useRouter();
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        Alert.alert('Success', 'Expense recorded successfully!');
        router.back();
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-primary p-4 pt-12 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft color="white" size={24} />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Record Expense</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Save color="#F59E0B" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-6">
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2">Category</Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-primary"
                        placeholder="E.g., Travel, Meals, Office Supplies"
                        value={category}
                        onChangeText={setCategory}
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2">Amount (₹)</Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-primary"
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>

                <View className="mb-8">
                    <Text className="text-gray-700 font-semibold mb-2">Description</Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-primary h-24"
                        placeholder="What was this expense for?"
                        multiline
                        textAlignVertical="top"
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <Text className="text-primary font-bold text-lg mb-4">Attachments</Text>
                <View className="flex-row">
                    <TouchableOpacity className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl items-center justify-center mr-4">
                        <Camera color="#94A3B8" size={32} />
                        <Text className="text-gray-400 text-xs mt-1">Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl items-center justify-center">
                        <Paperclip color="#94A3B8" size={32} />
                        <Text className="text-gray-400 text-xs mt-1">Upload</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
