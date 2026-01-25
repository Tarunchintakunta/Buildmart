import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useWalletStore } from '../../store/useStore';

export default function DriverDashboard() {
  const router = useRouter();
  const wallet = useWalletStore((state) => state.wallet);
  const [isOnline, setIsOnline] = useState(true);

  const walletBalance = wallet?.balance ?? 8000;
  const totalEarned = wallet?.total_earned ?? 50000;

  // Mock driver profile
  const driverProfile = {
    name: 'Krishna Driver',
    type: 'shop_driver', // or 'freelance'
    shopName: 'Anand Hardware',
    vehicleType: 'Mini Truck',
    vehicleNumber: 'KA01AB1234',
    rating: 4.6,
    totalDeliveries: 500,
    todayDeliveries: 8,
    todayEarnings: 1200,
  };

  const isFreelance = driverProfile.type === 'freelance';

  return (
    <View className="flex-1 p-4">
      {/* Online Status Card */}
      <View className="bg-gray-800 rounded-2xl p-5 mb-6">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400 text-sm">Driver Status</Text>
            <Text className={`text-2xl font-bold mt-1 ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
              {isOnline ? 'Online - Ready' : 'Offline'}
            </Text>
          </View>
          <View className="items-center">
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: '#EF4444', true: '#22C55E' }}
              thumbColor="white"
            />
            <Text className="text-gray-400 text-xs mt-1">
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Text>
          </View>
        </View>

        {/* Driver Type Badge */}
        <View className="flex-row items-center mt-4">
          <View className={`px-3 py-1 rounded-full ${isFreelance ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
            <Text className={isFreelance ? 'text-purple-500' : 'text-blue-500'}>
              {isFreelance ? 'Freelance Driver' : `Shop Driver - ${driverProfile.shopName}`}
            </Text>
          </View>
        </View>

        {/* Vehicle Info */}
        <View className="flex-row items-center mt-4 bg-gray-700/50 rounded-lg p-3">
          <Ionicons name="car" size={24} color="#F97316" />
          <View className="ml-3">
            <Text className="text-white font-medium">{driverProfile.vehicleType}</Text>
            <Text className="text-gray-400 text-sm">{driverProfile.vehicleNumber}</Text>
          </View>
        </View>
      </View>

      {/* Today's Stats */}
      <View className="flex-row space-x-3 mb-6">
        <View className="flex-1 bg-orange-500 rounded-xl p-4">
          <Ionicons name="bicycle" size={24} color="white" />
          <Text className="text-white text-2xl font-bold mt-2">
            {driverProfile.todayDeliveries}
          </Text>
          <Text className="text-orange-100 text-sm">Today's Deliveries</Text>
        </View>
        <View className="flex-1 bg-green-600 rounded-xl p-4">
          <Ionicons name="cash" size={24} color="white" />
          <Text className="text-white text-2xl font-bold mt-2">
            ₹{driverProfile.todayEarnings}
          </Text>
          <Text className="text-green-100 text-sm">Today's Earnings</Text>
        </View>
      </View>

      {/* Wallet Summary */}
      <View className="bg-gray-800 rounded-xl p-4 mb-6">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400 text-sm">Wallet Balance</Text>
            <Text className="text-white text-2xl font-bold mt-1">
              ₹{walletBalance.toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity
            className="bg-orange-500 px-4 py-2 rounded-full"
            onPress={() => router.push('/(app)/(tabs)/wallet')}
          >
            <Text className="text-white font-medium">Withdraw</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center mt-3">
          <Ionicons name="trending-up" size={16} color="#22C55E" />
          <Text className="text-green-500 ml-1 text-sm">
            Total Earned: ₹{totalEarned.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Active Deliveries */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-lg font-semibold">Active Deliveries</Text>
          <View className="bg-orange-500/20 px-2 py-1 rounded">
            <Text className="text-orange-500 text-sm font-medium">2 Active</Text>
          </View>
        </View>

        {[
          {
            id: 'ORD-2024-0002',
            customer: 'Rajesh Constructions',
            address: '100 Industrial Area, Bangalore',
            items: '50x Cement bags',
            distance: '5.2 km',
            earnings: '₹200',
            status: 'pickup',
          },
          {
            id: 'ORD-2024-0005',
            customer: 'Amit Kumar',
            address: '78 Brigade Road, Bangalore',
            items: '2x Wooden Doors',
            distance: '3.8 km',
            earnings: '₹150',
            status: 'delivering',
          },
        ].map((delivery, index) => (
          <TouchableOpacity
            key={index}
            className="bg-gray-800 rounded-xl p-4 mb-3 border-l-4 border-orange-500"
            onPress={() => router.push(`/(app)/order/${delivery.id}`)}
          >
            <View className="flex-row justify-between items-start mb-3">
              <View>
                <Text className="text-white font-medium">{delivery.id}</Text>
                <Text className="text-gray-400 text-sm">{delivery.customer}</Text>
              </View>
              <View className={`px-2 py-1 rounded ${
                delivery.status === 'pickup' ? 'bg-blue-500/20' : 'bg-green-500/20'
              }`}>
                <Text className={delivery.status === 'pickup' ? 'text-blue-500' : 'text-green-500'}>
                  {delivery.status === 'pickup' ? 'Pickup' : 'Delivering'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-2">
              <Ionicons name="location" size={16} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm ml-2 flex-1" numberOfLines={1}>
                {delivery.address}
              </Text>
            </View>

            <View className="flex-row items-center mb-3">
              <Ionicons name="cube" size={16} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm ml-2">{delivery.items}</Text>
            </View>

            <View className="flex-row justify-between items-center pt-3 border-t border-gray-700">
              <View className="flex-row items-center">
                <Ionicons name="navigate" size={16} color="#F97316" />
                <Text className="text-gray-400 ml-1">{delivery.distance}</Text>
              </View>
              <Text className="text-green-500 font-semibold">{delivery.earnings}</Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-3 mt-3">
              <TouchableOpacity className="flex-1 bg-blue-500 py-3 rounded-lg flex-row items-center justify-center">
                <Ionicons name="navigate" size={18} color="white" />
                <Text className="text-white font-medium ml-2">Navigate</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-green-500 py-3 rounded-lg flex-row items-center justify-center">
                <Ionicons name="checkmark-circle" size={18} color="white" />
                <Text className="text-white font-medium ml-2">
                  {delivery.status === 'pickup' ? 'Picked Up' : 'Delivered'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Concierge Tasks (for Freelance drivers) */}
      {isFreelance && (
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white text-lg font-semibold">Concierge Tasks</Text>
            <View className="bg-purple-500/20 px-2 py-1 rounded">
              <Text className="text-purple-500 text-sm font-medium">1 New</Text>
            </View>
          </View>

          <View className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
            <View className="flex-row items-center mb-3">
              <Ionicons name="flash" size={20} color="#A855F7" />
              <Text className="text-purple-400 font-medium ml-2">Hybrid Fulfillment Task</Text>
            </View>
            <Text className="text-white font-medium">
              Pick up 5x UltraTech Cement from Sri Lakshmi Traders
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              Original shop (Anand Hardware) out of stock
            </Text>
            <View className="flex-row justify-between items-center mt-3">
              <Text className="text-green-500 font-semibold">+₹100 bonus</Text>
              <TouchableOpacity className="bg-purple-500 px-4 py-2 rounded-lg">
                <Text className="text-white font-medium">Accept Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Scan QR Code Button */}
      <TouchableOpacity
        className="bg-orange-500 rounded-xl p-4 mb-6 flex-row items-center justify-center"
        onPress={() => router.push('/(app)/scan?mode=delivery')}
      >
        <Ionicons name="scan" size={24} color="white" />
        <Text className="text-white font-semibold text-lg ml-3">Scan QR Code</Text>
      </TouchableOpacity>

      {/* Performance Stats */}
      <View className="mb-6">
        <Text className="text-white text-lg font-semibold mb-3">Your Performance</Text>
        <View className="bg-gray-800 rounded-xl p-4">
          <View className="flex-row justify-between mb-4">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-white">{driverProfile.totalDeliveries}</Text>
              <Text className="text-gray-400 text-sm">Total Deliveries</Text>
            </View>
            <View className="w-px bg-gray-700" />
            <View className="items-center flex-1">
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold text-white">{driverProfile.rating}</Text>
                <Ionicons name="star" size={18} color="#F59E0B" />
              </View>
              <Text className="text-gray-400 text-sm">Rating</Text>
            </View>
            <View className="w-px bg-gray-700" />
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-green-500">98%</Text>
              <Text className="text-gray-400 text-sm">On Time</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
