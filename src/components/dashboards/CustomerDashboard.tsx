import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWalletStore } from '../../store/useStore';

const CATEGORIES = [
  { id: '1', name: 'Cement', icon: 'cube', color: '#EF4444' },
  { id: '2', name: 'Doors', icon: 'home', color: '#F59E0B' },
  { id: '3', name: 'Pipes', icon: 'water', color: '#3B82F6' },
  { id: '4', name: 'Steel', icon: 'hardware-chip', color: '#8B5CF6' },
  { id: '5', name: 'Sand', icon: 'layers', color: '#EC4899' },
  { id: '6', name: 'Paint', icon: 'color-palette', color: '#10B981' },
  { id: '7', name: 'Electric', icon: 'flash', color: '#F97316' },
  { id: '8', name: 'Hardware', icon: 'construct', color: '#6366F1' },
];

const QUICK_ACTIONS = [
  { id: '1', name: 'Order Materials', icon: 'cube', route: '/(app)/(tabs)/shop' },
  { id: '2', name: 'Hire Worker', icon: 'person-add', route: '/(app)/(tabs)/workers' },
  { id: '3', name: 'My Orders', icon: 'receipt', route: '/(app)/(tabs)/orders' },
  { id: '4', name: 'Track Delivery', icon: 'location', route: '/(app)/(tabs)/orders' },
];

export default function CustomerDashboard() {
  const router = useRouter();
  const wallet = useWalletStore((state) => state.wallet);

  // Mock wallet data if not loaded
  const walletBalance = wallet?.balance ?? 25000;

  return (
    <View className="flex-1 p-4">
      {/* Wallet Card */}
      <TouchableOpacity className="bg-gradient-to-r bg-orange-500 rounded-2xl p-5 mb-6">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-orange-100 text-sm">Wallet Balance</Text>
            <Text className="text-white text-3xl font-bold mt-1">
              ₹{walletBalance.toLocaleString()}
            </Text>
          </View>
          <View className="bg-white/20 rounded-full p-2">
            <Ionicons name="wallet" size={24} color="white" />
          </View>
        </View>
        <View className="flex-row mt-4 space-x-3">
          <TouchableOpacity className="bg-white/20 px-4 py-2 rounded-full flex-row items-center">
            <Ionicons name="add" size={16} color="white" />
            <Text className="text-white ml-1 font-medium">Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white/20 px-4 py-2 rounded-full flex-row items-center">
            <Ionicons name="time" size={16} color="white" />
            <Text className="text-white ml-1 font-medium">History</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View className="mb-6">
        <Text className="text-white text-lg font-semibold mb-3">Quick Actions</Text>
        <View className="flex-row flex-wrap justify-between">
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              className="w-[48%] bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center"
              onPress={() => router.push(action.route as any)}
            >
              <View className="w-10 h-10 bg-orange-500/20 rounded-full items-center justify-center">
                <Ionicons name={action.icon as any} size={20} color="#F97316" />
              </View>
              <Text className="text-white ml-3 font-medium flex-1">{action.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Categories */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-lg font-semibold">Categories</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/shop')}>
            <Text className="text-orange-500">View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="items-center"
                onPress={() => router.push('/(app)/(tabs)/shop')}
              >
                <View
                  className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={28}
                    color={category.color}
                  />
                </View>
                <Text className="text-gray-300 text-xs">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Recent Orders */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-lg font-semibold">Recent Orders</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/orders')}>
            <Text className="text-orange-500">View All</Text>
          </TouchableOpacity>
        </View>
        <View className="bg-gray-800 rounded-xl p-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-green-500/20 rounded-full items-center justify-center">
              <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-white font-medium">ORD-2024-0001</Text>
              <Text className="text-gray-400 text-sm">10x Cement bags, 5kg Nails</Text>
            </View>
            <View className="items-end">
              <Text className="text-white font-semibold">₹5,460</Text>
              <Text className="text-green-500 text-xs">Delivered</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Featured Shops */}
      <View className="mb-6">
        <Text className="text-white text-lg font-semibold mb-3">Nearby Shops</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {[
              { name: 'Anand Hardware', rating: 4.5, distance: '2.3 km' },
              { name: 'Sri Lakshmi Traders', rating: 4.3, distance: '3.1 km' },
              { name: 'Balaji Construction', rating: 4.7, distance: '4.5 km' },
            ].map((shop, index) => (
              <TouchableOpacity
                key={index}
                className="bg-gray-800 rounded-xl p-4 w-44"
                onPress={() => router.push('/(app)/(tabs)/shop')}
              >
                <View className="w-full h-20 bg-gray-700 rounded-lg mb-3 items-center justify-center">
                  <Ionicons name="storefront" size={32} color="#6B7280" />
                </View>
                <Text className="text-white font-medium" numberOfLines={1}>
                  {shop.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text className="text-gray-400 text-sm ml-1">
                    {shop.rating} • {shop.distance}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
