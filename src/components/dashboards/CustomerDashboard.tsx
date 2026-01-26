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
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Wallet Card */}
        <TouchableOpacity 
          className="rounded-2xl p-6 mb-6"
          style={{
            backgroundColor: '#F97316',
            shadowColor: '#F97316',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
          onPress={() => router.push('/(app)/(tabs)/wallet')}
        >
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-orange-100 text-sm font-medium mb-1">Wallet Balance</Text>
              <Text className="text-white text-4xl font-bold">
                ₹{walletBalance.toLocaleString()}
              </Text>
            </View>
            <View 
              className="rounded-full p-3"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Ionicons name="wallet" size={28} color="white" />
            </View>
          </View>
          <View className="flex-row mt-6 space-x-3">
            <TouchableOpacity 
              className="px-5 py-3 rounded-xl flex-row items-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text className="text-white ml-2 font-semibold">Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="px-5 py-3 rounded-xl flex-row items-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Ionicons name="time" size={18} color="white" />
              <Text className="text-white ml-2 font-semibold">History</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="w-[48%] rounded-2xl p-4 mb-3"
                style={{
                  backgroundColor: '#1F2937',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                onPress={() => router.push(action.route as any)}
              >
                <View 
                  className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                  style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)' }}
                >
                  <Ionicons name={action.icon as any} size={24} color="#F97316" />
                </View>
                <Text className="text-white font-semibold text-base">{action.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Categories</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/shop')}>
              <Text className="text-orange-500 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
            <View className="flex-row space-x-4">
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className="items-center"
                  onPress={() => router.push('/(app)/(tabs)/shop')}
                >
                  <View
                    className="w-20 h-20 rounded-2xl items-center justify-center mb-2"
                    style={{ 
                      backgroundColor: `${category.color}20`,
                      shadowColor: category.color,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={32}
                      color={category.color}
                    />
                  </View>
                  <Text className="text-gray-300 text-sm font-medium">{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Recent Orders */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/orders')}>
              <Text className="text-orange-500 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>
          <View 
            className="rounded-2xl p-5"
            style={{
              backgroundColor: '#1F2937',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center">
              <View 
                className="w-14 h-14 rounded-xl items-center justify-center"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
              >
                <Ionicons name="checkmark-circle" size={28} color="#10B981" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-white font-bold text-base mb-1">ORD-2024-0001</Text>
                <Text className="text-gray-400 text-sm">10x Cement bags, 5kg Nails</Text>
              </View>
              <View className="items-end">
                <Text className="text-white font-bold text-lg">₹5,460</Text>
                <View 
                  className="px-2 py-1 rounded-lg mt-1"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
                >
                  <Text className="text-green-500 text-xs font-semibold">Delivered</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Featured Shops */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-4">Nearby Shops</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
            <View className="flex-row space-x-4">
              {[
                { name: 'Anand Hardware', rating: 4.5, distance: '2.3 km' },
                { name: 'Sri Lakshmi Traders', rating: 4.3, distance: '3.1 km' },
                { name: 'Balaji Construction', rating: 4.7, distance: '4.5 km' },
              ].map((shop, index) => (
                <TouchableOpacity
                  key={index}
                  className="rounded-2xl p-4 w-48"
                  style={{
                    backgroundColor: '#1F2937',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                  onPress={() => router.push('/(app)/(tabs)/shop')}
                >
                  <View 
                    className="w-full h-24 rounded-xl mb-3 items-center justify-center"
                    style={{ backgroundColor: '#374151' }}
                  >
                    <Ionicons name="storefront" size={36} color="#6B7280" />
                  </View>
                  <Text className="text-white font-bold text-base mb-2" numberOfLines={1}>
                    {shop.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={16} color="#F59E0B" />
                    <Text className="text-gray-400 text-sm ml-1 font-medium">
                      {shop.rating} • {shop.distance}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}
