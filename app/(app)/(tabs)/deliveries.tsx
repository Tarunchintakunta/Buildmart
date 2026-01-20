import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const DELIVERY_TABS = ['Active', 'Available', 'Completed'];

const MOCK_DELIVERIES = [
  {
    id: 'd1',
    orderNumber: 'ORD-2024-0002',
    type: 'order',
    customer: 'Rajesh Constructions',
    shop: 'Sri Lakshmi Traders',
    pickupAddress: '25 Chickpet, Bangalore',
    deliveryAddress: '100 Industrial Area, Bangalore',
    items: '50x Cement bags, 20x TMT Bars',
    distance: '5.2 km',
    earnings: 200,
    status: 'pickup',
    assignedAt: '10:30 AM',
  },
  {
    id: 'd2',
    orderNumber: 'ORD-2024-0005',
    type: 'order',
    customer: 'Amit Kumar',
    shop: 'Anand Hardware',
    pickupAddress: '10 KR Market, Bangalore',
    deliveryAddress: '78 Brigade Road, Bangalore',
    items: '2x Wooden Doors, 4x Door Hinges',
    distance: '3.8 km',
    earnings: 150,
    status: 'delivering',
    assignedAt: '09:45 AM',
  },
  {
    id: 'd3',
    orderNumber: 'ORD-2024-0010',
    type: 'order',
    customer: 'Priya Patel',
    shop: 'Balaji Construction',
    pickupAddress: '40 Yeshwanthpur, Bangalore',
    deliveryAddress: '45 Park Street, Bangalore',
    items: '5x Copper Wire coils',
    distance: '6.5 km',
    earnings: 180,
    status: 'available',
    assignedAt: null,
  },
  {
    id: 'd4',
    orderNumber: 'CON-2024-001',
    type: 'concierge',
    customer: 'Vikram Singh',
    shop: 'Sri Lakshmi Traders',
    originalShop: 'Anand Hardware',
    pickupAddress: '25 Chickpet, Bangalore',
    deliveryAddress: '90 Whitefield, Bangalore',
    items: '5x UltraTech Cement (from alternate shop)',
    distance: '12.3 km',
    earnings: 350,
    bonusEarnings: 100,
    status: 'available',
    assignedAt: null,
  },
  {
    id: 'd5',
    orderNumber: 'ORD-2024-0001',
    type: 'order',
    customer: 'Rahul Sharma',
    shop: 'Anand Hardware',
    pickupAddress: '10 KR Market, Bangalore',
    deliveryAddress: '123 MG Road, Koramangala',
    items: '10x Cement bags, 5kg Nails',
    distance: '4.1 km',
    earnings: 150,
    status: 'completed',
    completedAt: '11:30 AM',
  },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'pickup':
      return { bg: 'bg-blue-500/20', text: 'text-blue-500', label: 'Pickup' };
    case 'delivering':
      return { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Delivering' };
    case 'available':
      return { bg: 'bg-orange-500/20', text: 'text-orange-500', label: 'Available' };
    case 'completed':
      return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Completed' };
    default:
      return { bg: 'bg-gray-500/20', text: 'text-gray-500', label: status };
  }
};

export default function DeliveriesScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('Active');

  const filteredDeliveries = MOCK_DELIVERIES.filter((delivery) => {
    if (selectedTab === 'Active') return ['pickup', 'delivering'].includes(delivery.status);
    if (selectedTab === 'Available') return delivery.status === 'available';
    if (selectedTab === 'Completed') return delivery.status === 'completed';
    return true;
  });

  const activeCount = MOCK_DELIVERIES.filter((d) => ['pickup', 'delivering'].includes(d.status)).length;
  const availableCount = MOCK_DELIVERIES.filter((d) => d.status === 'available').length;

  const renderDelivery = ({ item: delivery }: { item: typeof MOCK_DELIVERIES[0] }) => {
    const statusStyle = getStatusStyle(delivery.status);
    const isConcierge = delivery.type === 'concierge';
    const isActive = ['pickup', 'delivering'].includes(delivery.status);
    const isAvailable = delivery.status === 'available';

    return (
      <View className={`bg-gray-800 rounded-xl p-4 mb-3 ${
        isConcierge ? 'border-l-4 border-purple-500' : isActive ? 'border-l-4 border-green-500' : ''
      }`}>
        {/* Header */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <View className="flex-row items-center">
              {isConcierge && (
                <View className="bg-purple-500/20 px-2 py-0.5 rounded mr-2 flex-row items-center">
                  <Ionicons name="flash" size={12} color="#A855F7" />
                  <Text className="text-purple-500 text-xs font-bold ml-1">CONCIERGE</Text>
                </View>
              )}
              <Text className="text-gray-400 text-sm">{delivery.orderNumber}</Text>
            </View>
            <Text className="text-white font-semibold mt-1">{delivery.customer}</Text>
          </View>
          <View className={`px-2 py-1 rounded ${statusStyle.bg}`}>
            <Text className={`text-xs font-medium ${statusStyle.text}`}>
              {statusStyle.label}
            </Text>
          </View>
        </View>

        {/* Pickup Location */}
        <View className="flex-row items-start mb-2">
          <View className="w-6 items-center">
            <View className="w-3 h-3 bg-blue-500 rounded-full" />
            <View className="w-0.5 h-8 bg-gray-600 my-1" />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-gray-500 text-xs">PICKUP</Text>
            <Text className="text-white">{delivery.shop}</Text>
            <Text className="text-gray-400 text-sm" numberOfLines={1}>
              {delivery.pickupAddress}
            </Text>
          </View>
        </View>

        {/* Delivery Location */}
        <View className="flex-row items-start mb-3">
          <View className="w-6 items-center">
            <View className="w-3 h-3 bg-green-500 rounded-full" />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-gray-500 text-xs">DELIVER TO</Text>
            <Text className="text-white">{delivery.customer}</Text>
            <Text className="text-gray-400 text-sm" numberOfLines={1}>
              {delivery.deliveryAddress}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View className="flex-row items-center mb-3 bg-gray-700/50 p-2 rounded-lg">
          <Ionicons name="cube" size={16} color="#9CA3AF" />
          <Text className="text-gray-300 ml-2 text-sm flex-1" numberOfLines={1}>
            {delivery.items}
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row items-center justify-between py-3 border-t border-gray-700">
          <View className="flex-row items-center">
            <Ionicons name="navigate" size={16} color="#F97316" />
            <Text className="text-gray-400 ml-2">{delivery.distance}</Text>
          </View>
          <View className="items-end">
            <Text className="text-green-500 font-bold text-lg">₹{delivery.earnings}</Text>
            {isConcierge && (delivery as any).bonusEarnings && (
              <Text className="text-purple-500 text-xs">+₹{(delivery as any).bonusEarnings} bonus</Text>
            )}
          </View>
        </View>

        {/* Actions for Active */}
        {isActive && (
          <View className="flex-row space-x-3 pt-3 border-t border-gray-700">
            <TouchableOpacity className="flex-1 bg-blue-500 py-3 rounded-lg flex-row items-center justify-center">
              <Ionicons name="navigate" size={18} color="white" />
              <Text className="text-white font-semibold ml-2">Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-green-500 py-3 rounded-lg flex-row items-center justify-center">
              <Ionicons name="checkmark-circle" size={18} color="white" />
              <Text className="text-white font-semibold ml-2">
                {delivery.status === 'pickup' ? 'Picked Up' : 'Delivered'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Actions for Available */}
        {isAvailable && (
          <View className="pt-3 border-t border-gray-700">
            <TouchableOpacity className={`py-3 rounded-lg flex-row items-center justify-center ${
              isConcierge ? 'bg-purple-500' : 'bg-orange-500'
            }`}>
              <Ionicons name="hand-right" size={18} color="white" />
              <Text className="text-white font-semibold ml-2">Accept Delivery</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Completed Info */}
        {delivery.status === 'completed' && (
          <View className="flex-row items-center pt-3 border-t border-gray-700">
            <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
            <Text className="text-gray-400 ml-2">Completed at {(delivery as any).completedAt}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-800">
        <Text className="text-white text-2xl font-bold">Deliveries</Text>
      </View>

      {/* Stats */}
      <View className="flex-row px-4 py-3 space-x-3">
        <View className="flex-1 bg-green-500/10 rounded-xl p-4 border border-green-500/30">
          <View className="flex-row items-center justify-between">
            <Text className="text-green-500 font-bold text-2xl">{activeCount}</Text>
            <Ionicons name="car" size={24} color="#22C55E" />
          </View>
          <Text className="text-gray-400 text-sm mt-1">Active Now</Text>
        </View>
        <View className="flex-1 bg-orange-500/10 rounded-xl p-4 border border-orange-500/30">
          <View className="flex-row items-center justify-between">
            <Text className="text-orange-500 font-bold text-2xl">{availableCount}</Text>
            <Ionicons name="list" size={24} color="#F97316" />
          </View>
          <Text className="text-gray-400 text-sm mt-1">Available</Text>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 pb-3 border-b border-gray-800">
        {DELIVERY_TABS.map((tab) => (
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

      {/* Deliveries List */}
      <FlatList
        data={filteredDeliveries}
        renderItem={renderDelivery}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Ionicons name="car" size={48} color="#6B7280" />
            <Text className="text-gray-400 mt-4">
              {selectedTab === 'Active'
                ? 'No active deliveries'
                : selectedTab === 'Available'
                ? 'No available deliveries'
                : 'No completed deliveries'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
