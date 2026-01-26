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

  const getStockStatusValue = (stock: number, minStock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.2)' };
    if (stock <= minStock) return { label: 'Low Stock', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' };
    return { label: 'In Stock', color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' };
  };

  const renderInventoryItem = ({ item }: { item: typeof MOCK_INVENTORY[0] }) => {
    const stockStatus = getStockStatusValue(item.stock, item.minStock);
    const isLowOrOut = item.stock <= item.minStock;

    return (
      <View 
        className="rounded-2xl p-5 mb-4"
        style={{
          backgroundColor: '#1F2937',
          borderLeftWidth: isLowOrOut ? 4 : 0,
          borderLeftColor: isLowOrOut ? '#F59E0B' : 'transparent',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="text-white font-bold text-lg mb-2">{item.product}</Text>
            <View className="flex-row items-center">
              <View 
                className="px-3 py-1 rounded-xl"
                style={{ backgroundColor: '#374151' }}
              >
                <Text className="text-gray-300 text-xs font-semibold">{item.category}</Text>
              </View>
              <Text className="text-gray-500 mx-2">•</Text>
              <Text className="text-gray-400 text-sm font-medium">₹{item.price}/{item.unit}</Text>
            </View>
          </View>
          <View 
            className="px-3 py-2 rounded-xl"
            style={{ backgroundColor: stockStatus.bg }}
          >
            <Text 
              className="text-xs font-bold"
              style={{ color: stockStatus.color }}
            >
              {stockStatus.label}
            </Text>
          </View>
        </View>

        {/* Stock Info */}
        <View 
          className="flex-row items-center justify-between py-4 mb-4"
          style={{ borderTopWidth: 1, borderTopColor: '#374151' }}
        >
          <View>
            <Text className="text-gray-500 text-xs font-medium mb-1">Current Stock</Text>
            <Text 
              className="text-2xl font-bold"
              style={{
                color: item.stock === 0 ? '#EF4444' : item.stock <= item.minStock ? '#F59E0B' : '#FFFFFF',
              }}
            >
              {item.stock} {item.unit}s
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-500 text-xs font-medium mb-1">Minimum Stock</Text>
            <Text className="text-gray-400 font-semibold">{item.minStock} {item.unit}s</Text>
          </View>
        </View>

        {/* Stock Progress Bar */}
        <View 
          className="h-2 rounded-full mb-4 overflow-hidden"
          style={{ backgroundColor: '#374151' }}
        >
          <View
            className="h-full rounded-full"
            style={{ 
              width: `${Math.min((item.stock / (item.minStock * 2)) * 100, 100)}%`,
              backgroundColor: item.stock === 0 ? '#EF4444' : item.stock <= item.minStock ? '#F59E0B' : '#10B981',
            }}
          />
        </View>

        {/* Actions */}
        <View 
          className="flex-row space-x-3 mt-4 pt-4"
          style={{ borderTopWidth: 1, borderTopColor: '#374151' }}
        >
          <TouchableOpacity
            className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
            style={{
              backgroundColor: '#374151',
              borderWidth: 1,
              borderColor: '#4B5563',
            }}
            onPress={() => setEditingItem(item.id)}
          >
            <Ionicons name="create" size={20} color="#F97316" />
            <Text className="text-orange-500 font-bold ml-2">Update Stock</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
            style={{
              backgroundColor: item.isAvailable ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            }}
            onPress={() => handleToggleAvailability(item.id, item.isAvailable)}
          >
            <Ionicons
              name={item.isAvailable ? 'eye-off' : 'eye'}
              size={20}
              color={item.isAvailable ? '#EF4444' : '#10B981'}
            />
            <Text 
              className="font-bold ml-2"
              style={{ color: item.isAvailable ? '#EF4444' : '#10B981' }}
            >
              {item.isAvailable ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Restock for low/out of stock */}
        {isLowOrOut && (
          <TouchableOpacity 
            className="py-3 rounded-xl mt-4 flex-row items-center justify-center"
            style={{
              backgroundColor: '#F97316',
              shadowColor: '#F97316',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text className="text-white font-bold ml-2">Quick Restock</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View 
        className="px-5 py-4 border-b"
        style={{ borderBottomColor: '#374151' }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-3xl font-bold">Inventory</Text>
          <TouchableOpacity 
            className="px-5 py-3 rounded-xl flex-row items-center"
            style={{ backgroundColor: '#F97316' }}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-bold ml-2">Add Product</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View 
          className="flex-row items-center rounded-2xl px-4"
          style={{
            backgroundColor: '#1F2937',
            borderWidth: 1,
            borderColor: '#374151',
          }}
        >
          <Ionicons name="search" size={22} color="#6B7280" />
          <TextInput
            className="flex-1 text-white py-4 ml-3 text-base"
            placeholder="Search products..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row px-4 py-4 space-x-3">
        <View 
          className="flex-1 rounded-2xl p-4 flex-row items-center"
          style={{
            backgroundColor: '#1F2937',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View 
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
          >
            <Ionicons name="cube" size={24} color="#3B82F6" />
          </View>
          <View className="ml-3">
            <Text className="text-white font-bold text-xl">{MOCK_INVENTORY.length}</Text>
            <Text className="text-gray-400 text-xs font-medium">Products</Text>
          </View>
        </View>
        <View 
          className="flex-1 rounded-2xl p-4 flex-row items-center"
          style={{
            backgroundColor: '#1F2937',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View 
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}
          >
            <Ionicons name="warning" size={24} color="#F59E0B" />
          </View>
          <View className="ml-3">
            <Text className="text-yellow-500 font-bold text-xl">{lowStockCount}</Text>
            <Text className="text-gray-400 text-xs font-medium">Low Stock</Text>
          </View>
        </View>
        <View 
          className="flex-1 rounded-2xl p-4 flex-row items-center"
          style={{
            backgroundColor: '#1F2937',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View 
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
          >
            <Ionicons name="close-circle" size={24} color="#EF4444" />
          </View>
          <View className="ml-3">
            <Text className="text-red-500 font-bold text-xl">{outOfStockCount}</Text>
            <Text className="text-gray-400 text-xs font-medium">Out</Text>
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
