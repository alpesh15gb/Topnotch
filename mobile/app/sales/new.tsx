import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react-native';

export default function NewSaleScreen() {
    const router = useRouter();
    const [customer, setCustomer] = useState('');
    const [items, setItems] = useState([{ name: '', qty: '1', rate: '0' }]);

    const addItem = () => setItems([...items, { name: '', qty: '1', rate: '0' }]);
    const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

    const handleSave = () => {
        Alert.alert('Success', 'Sale order saved successfully!');
        router.back();
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-primary p-4 pt-12 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft color="white" size={24} />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">New Sale Order</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Save color="#F59E0B" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-6">
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2">Customer Name</Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-primary"
                        placeholder="Select customer..."
                        value={customer}
                        onChangeText={setCustomer}
                    />
                </View>

                <Text className="text-primary font-bold text-lg mb-4">Line Items</Text>
                {items.map((item, idx) => (
                    <View key={idx} className="bg-gray-50 p-4 rounded-2xl mb-4 border border-gray-100">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-gray-500 font-bold">Item #{idx + 1}</Text>
                            {items.length > 1 && (
                                <TouchableOpacity onPress={() => removeItem(idx)}>
                                    <Trash2 color="#EF4444" size={20} />
                                </TouchableOpacity>
                            )}
                        </View>

                        <TextInput
                            className="bg-white border border-gray-200 p-3 rounded-lg mb-3 text-primary"
                            placeholder="Item name..."
                            value={item.name}
                            onChangeText={(val) => {
                                const newItems = [...items];
                                newItems[idx].name = val;
                                setItems(newItems);
                            }}
                        />

                        <View className="flex-row justify-between">
                            <View className="w-[45%]">
                                <Text className="text-gray-500 text-xs mb-1">Quantity</Text>
                                <TextInput
                                    className="bg-white border border-gray-200 p-3 rounded-lg text-primary"
                                    keyboardType="numeric"
                                    value={item.qty}
                                    onChangeText={(val) => {
                                        const newItems = [...items];
                                        newItems[idx].qty = val;
                                        setItems(newItems);
                                    }}
                                />
                            </View>
                            <View className="w-[45%]">
                                <Text className="text-gray-500 text-xs mb-1">Rate (₹)</Text>
                                <TextInput
                                    className="bg-white border border-gray-200 p-3 rounded-lg text-primary"
                                    keyboardType="numeric"
                                    value={item.rate}
                                    onChangeText={(val) => {
                                        const newItems = [...items];
                                        newItems[idx].rate = val;
                                        setItems(newItems);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                ))}

                <TouchableOpacity
                    className="flex-row items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl mb-12"
                    onPress={addItem}
                >
                    <Plus color="#94A3B8" size={20} className="mr-2" />
                    <Text className="text-gray-400 font-bold">Add Another Item</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
