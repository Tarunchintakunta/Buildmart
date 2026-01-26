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
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Online Status Card */}
        <View 
          className="rounded-2xl p-6 mb-6"
          style={{
            backgroundColor: '#1F2937',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1">
              <Text className="text-gray-400 text-sm font-medium mb-1">Driver Status</Text>
              <Text 
                className="text-2xl font-bold"
                style={{ color: isOnline ? '#10B981' : '#EF4444' }}
              >
                {isOnline ? 'Online - Ready' : 'Offline'}
              </Text>
            </View>
            <View className="items-center">
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: '#EF4444', true: '#10B981' }}
                thumbColor="white"
              />
              <Text className="text-gray-400 text-xs mt-2 font-medium">
                {isOnline ? 'Go Offline' : 'Go Online'}
              </Text>
            </View>
          </View>

          {/* Driver Type Badge */}
          <View className="flex-row items-center mb-4">
            <View 
              className="px-4 py-2 rounded-xl"
              style={{ 
                backgroundColor: isFreelance ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)' 
              }}
            >
              <Text 
                className="font-bold"
                style={{ color: isFreelance ? '#8B5CF6' : '#3B82F6' }}
              >
                {isFreelance ? 'Freelance Driver' : `Shop Driver - ${driverProfile.shopName}`}
              </Text>
            </View>
          </View>

          {/* Vehicle Info */}
          <View 
            className="flex-row items-center rounded-xl p-4"
            style={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
          >
            <Ionicons name="car" size={28} color="#F97316" />
            <View className="ml-4">
              <Text className="text-white font-bold text-base">{driverProfile.vehicleType}</Text>
              <Text className="text-gray-400 text-sm font-medium">{driverProfile.vehicleNumber}</Text>
            </View>
          </View>
        </View>

        {/* Today's Stats */}
        <View className="flex-row space-x-3 mb-6">
          <View 
            className="flex-1 rounded-2xl p-5"
            style={{
              backgroundColor: '#F97316',
              shadowColor: '#F97316',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="bicycle" size={28} color="white" />
            <Text className="text-white text-3xl font-bold mt-3 mb-1">
              {driverProfile.todayDeliveries}
            </Text>
            <Text className="text-orange-100 text-sm font-medium">Today's Deliveries</Text>
          </View>
          <View 
            className="flex-1 rounded-2xl p-5"
            style={{
              backgroundColor: '#10B981',
              shadowColor: '#10B981',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="cash" size={28} color="white" />
            <Text className="text-white text-3xl font-bold mt-3 mb-1">
              ₹{driverProfile.todayEarnings}
            </Text>
            <Text className="text-green-100 text-sm font-medium">Today's Earnings</Text>
          </View>
        </View>

        {/* Wallet Summary */}
        <View 
          className="rounded-2xl p-5 mb-6"
          style={{
            backgroundColor: '#1F2937',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-gray-400 text-sm font-medium mb-1">Wallet Balance</Text>
              <Text className="text-white text-3xl font-bold">
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
        <View 
          className="flex-row items-center mt-4 pt-4"
          style={{ borderTopWidth: 1, borderTopColor: '#374151' }}
        >
          <Ionicons name="trending-up" size={20} color="#10B981" />
          <Text className="text-green-500 ml-2 font-semibold">
            Total Earned: ₹{totalEarned.toLocaleString()}
          </Text>
        </View>
      </View>

        {/* Active Deliveries */}
        <View className="mb-6 px-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Active Deliveries</Text>
            <View 
              className="px-3 py-2 rounded-xl"
              style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)' }}
            >
              <Text className="text-orange-500 text-sm font-bold">2 Active</Text>
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
            className="rounded-2xl p-5 mb-4"
            style={{
              backgroundColor: '#1F2937',
              borderLeftWidth: 4,
              borderLeftColor: '#F97316',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={() => router.push(`/(app)/order/${delivery.id}`)}
          >
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="text-white font-bold text-base mb-1">{delivery.id}</Text>
                <Text className="text-gray-400 text-sm font-medium">{delivery.customer}</Text>
              </View>
              <View 
                className="px-3 py-2 rounded-xl"
                style={{ 
                  backgroundColor: delivery.status === 'pickup' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)' 
                }}
              >
                <Text 
                  className="font-bold text-sm"
                  style={{ color: delivery.status === 'pickup' ? '#3B82F6' : '#10B981' }}
                >
                  {delivery.status === 'pickup' ? 'Pickup' : 'Delivering'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-3">
              <Ionicons name="location" size={18} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm ml-2 flex-1 font-medium" numberOfLines={1}>
                {delivery.address}
              </Text>
            </View>

            <View className="flex-row items-center mb-4">
              <Ionicons name="cube" size={18} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm ml-2 font-medium">{delivery.items}</Text>
            </View>

            <View 
              className="flex-row justify-between items-center pt-4 mb-4"
              style={{ borderTopWidth: 1, borderTopColor: '#374151' }}
            >
              <View className="flex-row items-center">
                <Ionicons name="navigate" size={18} color="#F97316" />
                <Text className="text-gray-400 ml-2 font-semibold">{delivery.distance}</Text>
              </View>
              <Text className="text-green-500 font-bold text-lg">{delivery.earnings}</Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity 
                className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                style={{ backgroundColor: '#3B82F6' }}
              >
                <Ionicons name="navigate" size={20} color="white" />
                <Text className="text-white font-bold ml-2">Navigate</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                style={{ backgroundColor: '#10B981' }}
              >
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text className="text-white font-bold ml-2">
                  {delivery.status === 'pickup' ? 'Picked Up' : 'Delivered'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        </View>

        {/* Concierge Tasks (for Freelance drivers) */}
        {isFreelance && (
          <View className="mb-6 px-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl font-bold">Concierge Tasks</Text>
              <View 
                className="px-3 py-2 rounded-xl"
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
              >
                <Text className="text-purple-500 text-sm font-bold">1 New</Text>
              </View>
            </View>

            <View 
              className="rounded-2xl p-5"
              style={{
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(139, 92, 246, 0.3)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center mb-3">
                <Ionicons name="flash" size={24} color="#8B5CF6" />
                <Text className="text-purple-400 font-bold ml-2">Hybrid Fulfillment Task</Text>
              </View>
              <Text className="text-white font-bold text-base mb-2">
                Pick up 5x UltraTech Cement from Sri Lakshmi Traders
              </Text>
              <Text className="text-gray-400 text-sm mb-4">
                Original shop (Anand Hardware) out of stock
              </Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-green-500 font-bold text-lg">+₹100 bonus</Text>
                <TouchableOpacity 
                  className="px-5 py-3 rounded-xl"
                  style={{ backgroundColor: '#8B5CF6' }}
                >
                  <Text className="text-white font-bold">Accept Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Scan QR Code Button */}
        <View className="px-4 mb-6">
          <TouchableOpacity
            className="rounded-2xl p-4 flex-row items-center justify-center"
            style={{
              backgroundColor: '#F97316',
              shadowColor: '#F97316',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={() => router.push('/(app)/scan?mode=delivery')}
          >
            <Ionicons name="scan" size={26} color="white" />
            <Text className="text-white font-bold text-lg ml-3">Scan QR Code</Text>
          </TouchableOpacity>
        </View>

        {/* Performance Stats */}
        <View className="mb-6 px-4">
          <Text className="text-white text-xl font-bold mb-4">Your Performance</Text>
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
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-3xl font-bold text-white mb-1">{driverProfile.totalDeliveries}</Text>
                <Text className="text-gray-400 text-sm font-medium">Total Deliveries</Text>
              </View>
              <View className="w-px" style={{ backgroundColor: '#374151' }} />
              <View className="items-center flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="text-3xl font-bold text-white">{driverProfile.rating}</Text>
                  <Ionicons name="star" size={20} color="#F59E0B" style={{ marginLeft: 4 }} />
                </View>
                <Text className="text-gray-400 text-sm font-medium">Rating</Text>
              </View>
              <View className="w-px" style={{ backgroundColor: '#374151' }} />
              <View className="items-center flex-1">
                <Text className="text-3xl font-bold text-green-500 mb-1">98%</Text>
                <Text className="text-gray-400 text-sm font-medium">On Time</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
