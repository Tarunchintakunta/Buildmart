import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';

const ORDER_TABS = ['All', 'Active', 'Completed', 'Cancelled'];

const MOCK_ORDERS = [
  {
    id: 'o1',
    orderNumber: 'ORD-2024-0001',
    shop: 'Anand Hardware',
    items: '10x Cement bags, 5kg Nails',
    itemCount: 2,
    total: 5460,
    status: 'delivered',
    date: '2024-02-10',
    deliveryTime: '45 mins',
  },
  {
    id: 'o2',
    orderNumber: 'ORD-2024-0002',
    shop: 'Sri Lakshmi Traders',
    items: '50x Cement, 20x TMT Bars',
    itemCount: 2,
    total: 30000,
    status: 'out_for_delivery',
    date: '2024-02-15',
    deliveryTime: '25 mins remaining',
  },
  {
    id: 'o3',
    orderNumber: 'ORD-2024-0003',
    shop: 'Balaji Construction',
    items: '1x UPVC Window, 2x Door Hinges',
    itemCount: 2,
    total: 10230,
    status: 'pending',
    date: '2024-02-15',
    deliveryTime: 'Waiting for acceptance',
  },
  {
    id: 'o4',
    orderNumber: 'ORD-2024-0004',
    shop: 'RK Building Supplies',
    items: '100x TMT Bar 12mm',
    itemCount: 1,
    total: 65000,
    status: 'processing',
    date: '2024-02-14',
    deliveryTime: 'Preparing order',
  },
  {
    id: 'o5',
    orderNumber: 'ORD-2024-0005',
    shop: 'Ganesh Hardware',
    items: '5x Copper Wire, 2x MCB Box',
    itemCount: 2,
    total: 25000,
    status: 'cancelled',
    date: '2024-02-08',
    deliveryTime: 'Cancelled by shop',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return { bg: 'bg-green-500/20', text: 'text-green-500' };
    case 'out_for_delivery':
      return { bg: 'bg-blue-500/20', text: 'text-blue-500' };
    case 'processing':
      return { bg: 'bg-purple-500/20', text: 'text-purple-500' };
    case 'pending':
      return { bg: 'bg-yellow-500/20', text: 'text-yellow-500' };
    case 'accepted':
      return { bg: 'bg-orange-500/20', text: 'text-orange-500' };
    case 'cancelled':
      return { bg: 'bg-red-500/20', text: 'text-red-500' };
    default:
      return { bg: 'bg-gray-500/20', text: 'text-gray-500' };
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'Delivered';
    case 'out_for_delivery':
      return 'Out for Delivery';
    case 'processing':
      return 'Processing';
    case 'pending':
      return 'Pending';
    case 'accepted':
      return 'Accepted';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'checkmark-circle';
    case 'out_for_delivery':
      return 'car';
    case 'processing':
      return 'cube';
    case 'pending':
      return 'time';
    case 'accepted':
      return 'checkmark';
    case 'cancelled':
      return 'close-circle';
    default:
      return 'help-circle';
  }
};

export default function OrdersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('All');

  const isShopkeeper = user?.role === 'shopkeeper';

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    if (selectedTab === 'All') return true;
    if (selectedTab === 'Active')
      return ['pending', 'accepted', 'processing', 'out_for_delivery'].includes(
        order.status
      );
    if (selectedTab === 'Completed') return order.status === 'delivered';
    if (selectedTab === 'Cancelled') return order.status === 'cancelled';
    return true;
  });

  const renderOrder = ({ item: order }: { item: typeof MOCK_ORDERS[0] }) => {
    const statusStyle = getStatusColor(order.status);

    return (
      <TouchableOpacity
        className="bg-gray-800 rounded-xl p-4 mb-3"
        onPress={() => router.push(`/(app)/order/${order.id}`)}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View>
            <Text className="text-white font-semibold">{order.orderNumber}</Text>
            <Text className="text-gray-400 text-sm">{order.date}</Text>
          </View>
          <View className={`flex-row items-center px-3 py-1 rounded-full ${statusStyle.bg}`}>
            <Ionicons
              name={getStatusIcon(order.status) as any}
              size={14}
              color={statusStyle.text.replace('text-', '#').replace('-500', '')}
            />
            <Text className={`ml-1 text-sm font-medium ${statusStyle.text}`}>
              {getStatusLabel(order.status)}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-2">
          <Ionicons name="storefront" size={16} color="#9CA3AF" />
          <Text className="text-gray-300 ml-2">{order.shop}</Text>
        </View>

        <Text className="text-gray-400 text-sm" numberOfLines={1}>
          {order.items}
        </Text>

        <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-700">
          <View className="flex-row items-center">
            <Ionicons name="time" size={16} color="#F97316" />
            <Text className="text-orange-500 ml-2 text-sm">{order.deliveryTime}</Text>
          </View>
          <Text className="text-white font-bold">₹{order.total.toLocaleString()}</Text>
        </View>

        {/* Shopkeeper Actions */}
        {isShopkeeper && ['pending'].includes(order.status) && (
          <View className="flex-row space-x-3 mt-3 pt-3 border-t border-gray-700">
            <TouchableOpacity className="flex-1 bg-green-500 py-2 rounded-lg items-center">
              <Text className="text-white font-medium">Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-red-500/20 py-2 rounded-lg items-center">
              <Text className="text-red-500 font-medium">Decline</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-800">
        <Text className="text-white text-2xl font-bold">
          {isShopkeeper ? 'Manage Orders' : 'My Orders'}
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 py-3 border-b border-gray-800">
        {ORDER_TABS.map((tab) => (
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

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Ionicons name="receipt" size={48} color="#6B7280" />
            <Text className="text-gray-400 mt-4">No orders found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
