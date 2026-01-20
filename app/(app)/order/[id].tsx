import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock order data
const MOCK_ORDER = {
  id: 'o1',
  orderNumber: 'ORD-2024-0001',
  status: 'delivered',
  shop: {
    name: 'Anand Hardware & Building Materials',
    phone: '9876543401',
    address: '10 KR Market, Bangalore',
  },
  customer: {
    name: 'Rahul Sharma',
    phone: '9876543101',
    address: '123 MG Road, Koramangala, Bangalore',
  },
  driver: {
    name: 'Krishna Driver',
    phone: '9876543501',
    vehicle: 'Mini Truck - KA01AB1234',
  },
  items: [
    { name: 'UltraTech Cement 50kg', quantity: 10, price: 380, total: 3800 },
    { name: 'Cement Nails 3 inch', quantity: 5, price: 120, total: 600 },
  ],
  subtotal: 4400,
  deliveryFee: 150,
  tax: 792,
  total: 5342,
  createdAt: '2024-02-10 09:30 AM',
  deliveredAt: '2024-02-10 10:15 AM',
  estimatedDelivery: '45 mins',
};

const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    pending: { label: 'Pending', color: '#EAB308', bg: 'bg-yellow-500/20', icon: 'time' },
    accepted: { label: 'Accepted', color: '#F97316', bg: 'bg-orange-500/20', icon: 'checkmark' },
    processing: { label: 'Processing', color: '#8B5CF6', bg: 'bg-purple-500/20', icon: 'cube' },
    out_for_delivery: { label: 'Out for Delivery', color: '#3B82F6', bg: 'bg-blue-500/20', icon: 'car' },
    delivered: { label: 'Delivered', color: '#22C55E', bg: 'bg-green-500/20', icon: 'checkmark-circle' },
    cancelled: { label: 'Cancelled', color: '#EF4444', bg: 'bg-red-500/20', icon: 'close-circle' },
  };
  return statusMap[status] || statusMap.pending;
};

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const order = MOCK_ORDER;
  const statusInfo = getStatusInfo(order.status);

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">Order Details</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Order Header */}
        <View className="px-4 py-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row justify-between items-start mb-3">
              <View>
                <Text className="text-white text-xl font-bold">{order.orderNumber}</Text>
                <Text className="text-gray-400 text-sm">{order.createdAt}</Text>
              </View>
              <View className={`flex-row items-center px-3 py-2 rounded-full ${statusInfo.bg}`}>
                <Ionicons name={statusInfo.icon as any} size={16} color={statusInfo.color} />
                <Text style={{ color: statusInfo.color }} className="ml-2 font-medium">
                  {statusInfo.label}
                </Text>
              </View>
            </View>

            {order.status === 'delivered' && (
              <View className="flex-row items-center bg-green-500/10 px-3 py-2 rounded-lg">
                <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                <Text className="text-green-500 ml-2">Delivered at {order.deliveredAt}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Delivery Timeline */}
        <View className="px-4 pb-4">
          <Text className="text-white text-lg font-semibold mb-3">Delivery Details</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            {/* Pickup */}
            <View className="flex-row items-start mb-4">
              <View className="items-center">
                <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center">
                  <Ionicons name="storefront" size={16} color="white" />
                </View>
                <View className="w-0.5 h-12 bg-gray-600 my-1" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-400 text-xs">PICKUP FROM</Text>
                <Text className="text-white font-medium">{order.shop.name}</Text>
                <Text className="text-gray-400 text-sm">{order.shop.address}</Text>
                <TouchableOpacity className="flex-row items-center mt-2">
                  <Ionicons name="call" size={14} color="#F97316" />
                  <Text className="text-orange-500 ml-1">{order.shop.phone}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Delivery */}
            <View className="flex-row items-start">
              <View className="items-center">
                <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
                  <Ionicons name="location" size={16} color="white" />
                </View>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-400 text-xs">DELIVER TO</Text>
                <Text className="text-white font-medium">{order.customer.name}</Text>
                <Text className="text-gray-400 text-sm">{order.customer.address}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Driver Info */}
        {order.driver && (
          <View className="px-4 pb-4">
            <Text className="text-white text-lg font-semibold mb-3">Driver</Text>
            <View className="bg-gray-800 rounded-xl p-4 flex-row items-center">
              <View className="w-14 h-14 bg-gray-700 rounded-full items-center justify-center">
                <Ionicons name="person" size={28} color="#6B7280" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-white font-medium">{order.driver.name}</Text>
                <Text className="text-gray-400 text-sm">{order.driver.vehicle}</Text>
              </View>
              <TouchableOpacity className="bg-green-500 p-3 rounded-full">
                <Ionicons name="call" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Order Items */}
        <View className="px-4 pb-4">
          <Text className="text-white text-lg font-semibold mb-3">
            Items ({order.items.length})
          </Text>
          <View className="bg-gray-800 rounded-xl p-4">
            {order.items.map((item, index) => (
              <View
                key={index}
                className={`flex-row items-center py-3 ${
                  index !== order.items.length - 1 ? 'border-b border-gray-700' : ''
                }`}
              >
                <View className="w-12 h-12 bg-gray-700 rounded-lg items-center justify-center">
                  <Ionicons name="cube" size={24} color="#6B7280" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-white font-medium">{item.name}</Text>
                  <Text className="text-gray-400 text-sm">
                    ₹{item.price} × {item.quantity}
                  </Text>
                </View>
                <Text className="text-white font-bold">₹{item.total.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Summary */}
        <View className="px-4 pb-8">
          <Text className="text-white text-lg font-semibold mb-3">Payment Summary</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Subtotal</Text>
              <Text className="text-white">₹{order.subtotal.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Delivery Fee</Text>
              <Text className="text-white">₹{order.deliveryFee}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-400">Tax (GST)</Text>
              <Text className="text-white">₹{order.tax}</Text>
            </View>
            <View className="flex-row justify-between pt-3 border-t border-gray-700">
              <Text className="text-white font-semibold text-lg">Total Paid</Text>
              <Text className="text-orange-500 font-bold text-xl">
                ₹{order.total.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {order.status === 'delivered' && (
        <View className="px-4 py-4 border-t border-gray-800">
          <TouchableOpacity className="bg-orange-500 py-4 rounded-xl flex-row items-center justify-center">
            <Ionicons name="refresh" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Reorder</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
