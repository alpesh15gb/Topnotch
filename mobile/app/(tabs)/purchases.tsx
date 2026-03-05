import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Search, Filter, Plus } from 'lucide-react-native';

export default function PurchasesScreen() {
    return (
        <View className="flex-1 bg-gray-50">
            <View className="p-4 bg-primary">
                <View className="flex-row bg-white/10 rounded-xl px-4 py-2 items-center">
                    <Search color="white" size={20} opacity={0.6} />
                    <TextInput
                        className="flex-1 ml-2 text-white"
                        placeholder="Search purchase bills..."
                        placeholderTextColor="rgba(255,255,255,0.4)"
                    />
                    <TouchableOpacity>
                        <Filter color="white" size={20} opacity={0.6} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="items-center justify-center mt-20">
                    <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                        <Search color="#94A3B8" size={32} />
                    </View>
                    <Text className="text-gray-500 text-lg font-medium">No purchase bills recorded</Text>
                    <Text className="text-gray-400 text-sm mt-1">Easily record your business expenses</Text>
                </View>
            </ScrollView>

            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-accent rounded-full items-center justify-center shadow-lg"
                onPress={() => { }}
            >
                <Plus color="white" size={32} />
            </TouchableOpacity>
        </View>
    );
}
