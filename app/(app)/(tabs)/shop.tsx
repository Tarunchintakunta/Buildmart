import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../../src/store/useStore';

// Mock data
const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'grid' },
  { id: 'cement', name: 'Cement', icon: 'cube' },
  { id: 'doors', name: 'Doors', icon: 'home' },
  { id: 'pipes', name: 'Pipes', icon: 'water' },
  { id: 'steel', name: 'Steel', icon: 'hardware-chip' },
  { id: 'electrical', name: 'Electric', icon: 'flash' },
  { id: 'hardware', name: 'Hardware', icon: 'construct' },
  { id: 'paint', name: 'Paint', icon: 'color-palette' },
];

const PRODUCTS = [
  {
    id: 'p1',
    name: 'UltraTech Cement 50kg',
    category: 'cement',
    price: 380,
    unit: 'bag',
    shop: { id: 's1', name: 'Anand Hardware' },
    stock: 100,
    isHeavy: true,
    image: null,
  },
  {
    id: 'p2',
    name: 'ACC Cement 50kg',
    category: 'cement',
    price: 370,
    unit: 'bag',
    shop: { id: 's2', name: 'Sri Lakshmi Traders' },
    stock: 80,
    isHeavy: true,
    image: null,
  },
  {
    id: 'p3',
    name: 'Wooden Door - Teak',
    category: 'doors',
    price: 15000,
    unit: 'piece',
    shop: { id: 's1', name: 'Anand Hardware' },
    stock: 10,
    isHeavy: true,
    image: null,
  },
  {
    id: 'p4',
    name: 'Steel Security Door',
    category: 'doors',
    price: 25000,
    unit: 'piece',
    shop: { id: 's3', name: 'Balaji Construction' },
    stock: 15,
    isHeavy: true,
    image: null,
  },
  {
    id: 'p5',
    name: 'PVC Pipe 4 inch',
    category: 'pipes',
    price: 250,
    unit: '10ft',
    shop: { id: 's1', name: 'Anand Hardware' },
    stock: 200,
    isHeavy: false,
    image: null,
  },
  {
    id: 'p6',
    name: 'TMT Bar 12mm',
    category: 'steel',
    price: 650,
    unit: 'piece',
    shop: { id: 's2', name: 'Sri Lakshmi Traders' },
    stock: 100,
    isHeavy: true,
    image: null,
  },
  {
    id: 'p7',
    name: 'Copper Wire 2.5mm',
    category: 'electrical',
    price: 4500,
    unit: 'coil',
    shop: { id: 's3', name: 'Balaji Construction' },
    stock: 50,
    isHeavy: false,
    image: null,
  },
  {
    id: 'p8',
    name: 'Cement Nails 3 inch',
    category: 'hardware',
    price: 120,
    unit: 'kg',
    shop: { id: 's1', name: 'Anand Hardware' },
    stock: 500,
    isHeavy: false,
    image: null,
  },
  {
    id: 'p9',
    name: 'Asian Paints Primer',
    category: 'paint',
    price: 2200,
    unit: '20L',
    shop: { id: 's3', name: 'Balaji Construction' },
    stock: 30,
    isHeavy: true,
    image: null,
  },
  {
    id: 'p10',
    name: 'UPVC Window 4x3ft',
    category: 'doors',
    price: 8500,
    unit: 'piece',
    shop: { id: 's3', name: 'Balaji Construction' },
    stock: 20,
    isHeavy: false,
    image: null,
  },
];

export default function ShopScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { items, addItem, getItemCount } = useCartStore();
  const cartItemCount = getItemCount();

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    addItem({
      inventory_id: product.id,
      product: {
        id: product.id,
        name: product.name,
        unit: product.unit,
        is_heavy: product.isHeavy,
        category_id: product.category,
        created_at: new Date().toISOString(),
      },
      shop: {
        id: product.shop.id,
        owner_id: '',
        name: product.shop.name,
        address: '',
        is_active: true,
        rating: 4.5,
        opening_time: '08:00',
        closing_time: '20:00',
        delivery_radius_km: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      quantity: 1,
      price: product.price,
    });
  };

  const getCartQuantity = (productId: string) => {
    const item = items.find((i) => i.inventory_id === productId);
    return item?.quantity || 0;
  };

  const renderProduct = ({ item: product }: { item: typeof PRODUCTS[0] }) => {
    const cartQty = getCartQuantity(product.id);

    return (
      <View className="w-[48%] bg-gray-800 rounded-xl mb-3 overflow-hidden">
        {/* Product Image Placeholder */}
        <View className="h-28 bg-gray-700 items-center justify-center">
          <Ionicons name="cube" size={40} color="#6B7280" />
          {product.isHeavy && (
            <View className="absolute top-2 right-2 bg-orange-500/80 px-2 py-1 rounded">
              <Text className="text-white text-xs">Heavy</Text>
            </View>
          )}
        </View>

        <View className="p-3">
          <Text className="text-white font-medium" numberOfLines={2}>
            {product.name}
          </Text>
          <Text className="text-gray-400 text-xs mt-1">{product.shop.name}</Text>

          <View className="flex-row items-center justify-between mt-2">
            <View>
              <Text className="text-orange-500 font-bold">₹{product.price}</Text>
              <Text className="text-gray-500 text-xs">per {product.unit}</Text>
            </View>

            {cartQty > 0 ? (
              <View className="flex-row items-center bg-orange-500 rounded-lg">
                <TouchableOpacity
                  className="px-3 py-2"
                  onPress={() => {
                    // Decrease quantity logic would go here
                  }}
                >
                  <Ionicons name="remove" size={16} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-bold px-2">{cartQty}</Text>
                <TouchableOpacity
                  className="px-3 py-2"
                  onPress={() => handleAddToCart(product)}
                >
                  <Ionicons name="add" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="bg-orange-500 px-4 py-2 rounded-lg"
                onPress={() => handleAddToCart(product)}
              >
                <Text className="text-white font-medium">Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-800">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-2xl font-bold">Shop</Text>
          <TouchableOpacity
            className="relative"
            onPress={() => router.push('/(app)/checkout')}
          >
            <Ionicons name="cart" size={28} color="white" />
            {cartItemCount > 0 && (
              <View className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-800 rounded-xl px-4 mt-3">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 text-white py-3 ml-2"
            placeholder="Search materials..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View className="py-3 border-b border-gray-800">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category.id ? 'bg-orange-500' : 'bg-gray-800'
              }`}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={selectedCategory === category.id ? 'white' : '#9CA3AF'}
              />
              <Text
                className={`ml-2 font-medium ${
                  selectedCategory === category.id ? 'text-white' : 'text-gray-400'
                }`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Delivery Info Banner */}
      <View className="mx-4 mt-3 bg-orange-500/10 rounded-xl p-3 flex-row items-center">
        <Ionicons name="time" size={20} color="#F97316" />
        <Text className="text-orange-500 ml-2 flex-1">
          Heavy materials delivered in 30-60 minutes
        </Text>
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Ionicons name="search" size={48} color="#6B7280" />
            <Text className="text-gray-400 mt-4">No products found</Text>
          </View>
        }
      />

      {/* Cart Footer */}
      {cartItemCount > 0 && (
        <View className="px-4 py-3 bg-gray-800 border-t border-gray-700">
          <TouchableOpacity
            className="bg-orange-500 rounded-xl py-4 flex-row items-center justify-center"
            onPress={() => router.push('/(app)/checkout')}
          >
            <Ionicons name="cart" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">
              View Cart ({cartItemCount} items)
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
