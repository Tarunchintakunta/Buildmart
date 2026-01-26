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
      <View 
        className="w-[48%] rounded-2xl mb-4 overflow-hidden"
        style={{
          backgroundColor: '#1F2937',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        {/* Product Image Placeholder */}
        <View 
          className="h-32 items-center justify-center relative"
          style={{ backgroundColor: '#374151' }}
        >
          <Ionicons name="cube" size={44} color="#6B7280" />
          {product.isHeavy && (
            <View 
              className="absolute top-2 right-2 px-2 py-1 rounded-lg"
              style={{ backgroundColor: 'rgba(249, 115, 22, 0.9)' }}
            >
              <Text className="text-white text-xs font-semibold">Heavy</Text>
            </View>
          )}
        </View>

        <View className="p-4">
          <Text className="text-white font-bold text-base mb-1" numberOfLines={2}>
            {product.name}
          </Text>
          <Text className="text-gray-400 text-xs mb-3">{product.shop.name}</Text>

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-orange-500 font-bold text-lg">₹{product.price}</Text>
              <Text className="text-gray-500 text-xs">per {product.unit}</Text>
            </View>

            {cartQty > 0 ? (
              <View 
                className="flex-row items-center rounded-xl overflow-hidden"
                style={{ backgroundColor: '#F97316' }}
              >
                <TouchableOpacity
                  className="px-3 py-2"
                  onPress={() => {
                    // Decrease quantity logic would go here
                  }}
                >
                  <Ionicons name="remove" size={18} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-bold px-3 text-base">{cartQty}</Text>
                <TouchableOpacity
                  className="px-3 py-2"
                  onPress={() => handleAddToCart(product)}
                >
                  <Ionicons name="add" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="px-4 py-2 rounded-xl"
                style={{ backgroundColor: '#F97316' }}
                onPress={() => handleAddToCart(product)}
              >
                <Text className="text-white font-semibold">Add</Text>
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
      <View className="px-4 py-4 border-b border-gray-800">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-3xl font-bold">Shop</Text>
          <TouchableOpacity
            className="relative"
            onPress={() => router.push('/(app)/checkout')}
          >
            <Ionicons name="cart" size={28} color="white" />
            {cartItemCount > 0 && (
              <View 
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full items-center justify-center"
                style={{ backgroundColor: '#F97316' }}
              >
                <Text className="text-white text-xs font-bold">{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
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
            placeholder="Search materials..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
              <Ionicons name="close-circle" size={22} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View className="py-4 border-b border-gray-800">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              className={`flex-row items-center px-5 py-3 rounded-xl mr-3 ${
                selectedCategory === category.id ? '' : ''
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? '#F97316' : '#1F2937',
              }}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={18}
                color={selectedCategory === category.id ? 'white' : '#9CA3AF'}
              />
              <Text
                className={`ml-2 font-semibold ${
                  selectedCategory === category.id ? 'text-white' : 'text-gray-400'
                }`}
                style={{ fontSize: 14 }}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Delivery Info Banner */}
      <View 
        className="mx-4 mt-4 rounded-2xl p-4 flex-row items-center"
        style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}
      >
        <Ionicons name="time" size={22} color="#F97316" />
        <Text className="text-orange-500 ml-3 flex-1 font-semibold">
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
        <View 
          className="px-4 py-4 border-t"
          style={{ 
            backgroundColor: '#1F2937',
            borderTopColor: '#374151',
          }}
        >
          <TouchableOpacity
            className="rounded-2xl py-4 flex-row items-center justify-center"
            style={{
              backgroundColor: '#F97316',
              shadowColor: '#F97316',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={() => router.push('/(app)/checkout')}
          >
            <Ionicons name="cart" size={22} color="white" />
            <Text className="text-white font-bold ml-2 text-base">
              View Cart ({cartItemCount} items)
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
