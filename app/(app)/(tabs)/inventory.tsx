import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const INVENTORY_TABS = ['All', 'Low Stock', 'Out of Stock'];

const MOCK_INVENTORY = [
  {
    id: 'i1',
    product: 'UltraTech Cement 50kg',
    category: 'Cement',
    price: 380,
    stock: 100,
    minStock: 20,
    unit: 'bag',
    isAvailable: true,
  },
  {
    id: 'i2',
    product: 'ACC Cement 50kg',
    category: 'Cement',
    price: 370,
    stock: 5,
    minStock: 20,
    unit: 'bag',
    isAvailable: true,
  },
  {
    id: 'i3',
    product: 'Wooden Door - Teak',
    category: 'Doors',
    price: 15000,
    stock: 10,
    minStock: 5,
    unit: 'piece',
    isAvailable: true,
  },
  {
    id: 'i4',
    product: 'PVC Pipe 4 inch',
    category: 'Pipes',
    price: 250,
    stock: 0,
    minStock: 30,
    unit: '10ft',
    isAvailable: false,
  },
  {
    id: 'i5',
    product: 'Cement Nails 3 inch',
    category: 'Hardware',
    price: 120,
    stock: 500,
    minStock: 100,
    unit: 'kg',
    isAvailable: true,
  },
  {
    id: 'i6',
    product: 'TMT Bar 12mm',
    category: 'Steel',
    price: 650,
    stock: 8,
    minStock: 25,
    unit: 'piece',
    isAvailable: true,
  },
  {
    id: 'i7',
    product: 'Copper Wire 2.5mm',
    category: 'Electrical',
    price: 4500,
    stock: 50,
    minStock: 15,
    unit: 'coil',
    isAvailable: true,
  },
  {
    id: 'i8',
    product: 'Asian Paints Primer',
    category: 'Paint',
    price: 2200,
    stock: 0,
    minStock: 10,
    unit: '20L',
    isAvailable: false,
  },
];

const getStockStatus = (stock: number, minStock: number) => {
  if (stock === 0) return { label: 'Out of Stock', color: 'text-red-500', bg: 'bg-red-500/20' };
  if (stock <= minStock) return { label: 'Low Stock', color: 'text-yellow-500', bg: 'bg-yellow-500/20' };
  return { label: 'In Stock', color: 'text-green-500', bg: 'bg-green-500/20' };
};

export default function InventoryScreen() {
  const [selectedTab, setSelectedTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const filteredInventory = MOCK_INVENTORY.filter((item) => {
    const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedTab === 'Low Stock') return item.stock > 0 && item.stock <= item.minStock;
    if (selectedTab === 'Out of Stock') return item.stock === 0;
    return true;
  });

  const lowStockCount = MOCK_INVENTORY.filter((i) => i.stock > 0 && i.stock <= i.minStock).length;
  const outOfStockCount = MOCK_INVENTORY.filter((i) => i.stock === 0).length;

  const handleUpdateStock = (itemId: string, newStock: number) => {
    Alert.alert('Stock Updated', `Stock updated to ${newStock} units`);
    setEditingItem(null);
  };

  const handleToggleAvailability = (itemId: string, currentStatus: boolean) => {
    Alert.alert(
      currentStatus ? 'Mark as Unavailable?' : 'Mark as Available?',
      currentStatus
        ? 'This product will be hidden from customers'
        : 'This product will be visible to customers',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // Update logic here
          },
        },
      ]
    );
  };

  const renderInventoryItem = ({ item }: { item: typeof MOCK_INVENTORY[0] }) => {
    const stockStatus = getStockStatus(item.stock, item.minStock);
    const isLowOrOut = item.stock <= item.minStock;

    return (
      <View className={`bg-gray-800 rounded-xl p-4 mb-3 ${isLowOrOut ? 'border-l-4 border-yellow-500' : ''}`}>
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-white font-semibold text-lg">{item.product}</Text>
            <View className="flex-row items-center mt-1">
              <View className="bg-gray-700 px-2 py-0.5 rounded">
                <Text className="text-gray-300 text-xs">{item.category}</Text>
              </View>
              <Text className="text-gray-500 mx-2">•</Text>
              <Text className="text-gray-400 text-sm">₹{item.price}/{item.unit}</Text>
            </View>
          </View>
          <View className={`px-2 py-1 rounded ${stockStatus.bg}`}>
            <Text className={`text-xs font-medium ${stockStatus.color}`}>
              {stockStatus.label}
            </Text>
          </View>
        </View>

        {/* Stock Info */}
        <View className="flex-row items-center justify-between py-3 border-t border-gray-700">
          <View>
            <Text className="text-gray-500 text-xs">Current Stock</Text>
            <Text className={`text-xl font-bold ${
              item.stock === 0 ? 'text-red-500' : item.stock <= item.minStock ? 'text-yellow-500' : 'text-white'
            }`}>
              {item.stock} {item.unit}s
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-500 text-xs">Minimum Stock</Text>
            <Text className="text-gray-400">{item.minStock} {item.unit}s</Text>
          </View>
        </View>

        {/* Stock Progress Bar */}
        <View className="h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
          <View
            className={`h-full rounded-full ${
              item.stock === 0 ? 'bg-red-500' : item.stock <= item.minStock ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min((item.stock / (item.minStock * 2)) * 100, 100)}%` }}
          />
        </View>

        {/* Actions */}
        <View className="flex-row space-x-3 mt-4 pt-3 border-t border-gray-700">
          <TouchableOpacity
            className="flex-1 bg-gray-700 py-3 rounded-lg flex-row items-center justify-center"
            onPress={() => setEditingItem(item.id)}
          >
            <Ionicons name="create" size={18} color="#F97316" />
            <Text className="text-orange-500 font-medium ml-2">Update Stock</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg flex-row items-center justify-center ${
              item.isAvailable ? 'bg-red-500/20' : 'bg-green-500/20'
            }`}
            onPress={() => handleToggleAvailability(item.id, item.isAvailable)}
          >
            <Ionicons
              name={item.isAvailable ? 'eye-off' : 'eye'}
              size={18}
              color={item.isAvailable ? '#EF4444' : '#22C55E'}
            />
            <Text className={`font-medium ml-2 ${item.isAvailable ? 'text-red-500' : 'text-green-500'}`}>
              {item.isAvailable ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Restock for low/out of stock */}
        {isLowOrOut && (
          <TouchableOpacity className="bg-orange-500 py-3 rounded-lg mt-3 flex-row items-center justify-center">
            <Ionicons name="refresh" size={18} color="white" />
            <Text className="text-white font-semibold ml-2">Quick Restock</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-800">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-2xl font-bold">Inventory</Text>
          <TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-full flex-row items-center">
            <Ionicons name="add" size={18} color="white" />
            <Text className="text-white font-medium ml-1">Add Product</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-gray-800 rounded-xl px-4 mt-3">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 text-white py-3 ml-2"
            placeholder="Search products..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row px-4 py-3 space-x-3">
        <View className="flex-1 bg-gray-800 rounded-xl p-3 flex-row items-center">
          <View className="w-10 h-10 bg-blue-500/20 rounded-full items-center justify-center">
            <Ionicons name="cube" size={20} color="#3B82F6" />
          </View>
          <View className="ml-3">
            <Text className="text-white font-bold">{MOCK_INVENTORY.length}</Text>
            <Text className="text-gray-400 text-xs">Products</Text>
          </View>
        </View>
        <View className="flex-1 bg-gray-800 rounded-xl p-3 flex-row items-center">
          <View className="w-10 h-10 bg-yellow-500/20 rounded-full items-center justify-center">
            <Ionicons name="warning" size={20} color="#EAB308" />
          </View>
          <View className="ml-3">
            <Text className="text-yellow-500 font-bold">{lowStockCount}</Text>
            <Text className="text-gray-400 text-xs">Low Stock</Text>
          </View>
        </View>
        <View className="flex-1 bg-gray-800 rounded-xl p-3 flex-row items-center">
          <View className="w-10 h-10 bg-red-500/20 rounded-full items-center justify-center">
            <Ionicons name="close-circle" size={20} color="#EF4444" />
          </View>
          <View className="ml-3">
            <Text className="text-red-500 font-bold">{outOfStockCount}</Text>
            <Text className="text-gray-400 text-xs">Out</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 pb-3 border-b border-gray-800">
        {INVENTORY_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 py-2 rounded-lg mr-2 ${
              selectedTab === tab ? 'bg-orange-500' : 'bg-gray-800'
            }`}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              className={`text-center font-medium ${
                selectedTab === tab ? 'text-white' : 'text-gray-400'
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inventory List */}
      <FlatList
        data={filteredInventory}
        renderItem={renderInventoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Ionicons name="cube" size={48} color="#6B7280" />
            <Text className="text-gray-400 mt-4">No products found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
