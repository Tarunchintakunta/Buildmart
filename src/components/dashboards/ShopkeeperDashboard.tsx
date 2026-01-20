import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWalletStore, useShopStore } from '../../store/useStore';

const STATS = [
  { label: "Today's Orders", value: '12', icon: 'receipt', color: '#3B82F6', trend: '+3' },
  { label: 'Pending', value: '5', icon: 'time', color: '#F59E0B', trend: null },
  { label: "Today's Revenue", value: '₹45K', icon: 'cash', color: '#10B981', trend: '+12%' },
  { label: 'Low Stock', value: '8', icon: 'warning', color: '#EF4444', trend: null },
];

export default function ShopkeeperDashboard() {
  const router = useRouter();
  const wallet = useWalletStore((state) => state.wallet);

  const walletBalance = wallet?.balance ?? 150000;
  const totalEarned = wallet?.total_earned ?? 500000;

  // Mock shop data
  const shop = {
    name: 'Anand Hardware & Building Materials',
    rating: 4.5,
    totalOrders: 1250,
    isOpen: true,
  };

  return (
    <View className="flex-1 p-4">
      {/* Shop Status Card */}
      <View className="bg-gray-800 rounded-2xl p-5 mb-6">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">{shop.name}</Text>
            <View className="flex-row items-center mt-2">
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text className="text-white ml-1">{shop.rating}</Text>
              <Text className="text-gray-400 mx-2">•</Text>
              <Text className="text-gray-400">{shop.totalOrders} orders</Text>
            </View>
          </View>
          <View className={`px-3 py-1 rounded-full ${shop.isOpen ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <Text className={shop.isOpen ? 'text-green-500' : 'text-red-500'}>
              {shop.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>

        {/* Revenue Summary */}
        <View className="flex-row mt-4 pt-4 border-t border-gray-700">
          <View className="flex-1">
            <Text className="text-gray-400 text-sm">Available Balance</Text>
            <Text className="text-white text-2xl font-bold mt-1">
              ₹{walletBalance.toLocaleString()}
            </Text>
          </View>
          <View className="flex-1 items-end">
            <Text className="text-gray-400 text-sm">Total Earned</Text>
            <Text className="text-green-500 text-2xl font-bold mt-1">
              ₹{totalEarned.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="flex-row flex-wrap justify-between mb-6">
        {STATS.map((stat, index) => (
          <View key={index} className="w-[48%] bg-gray-800 rounded-xl p-4 mb-3">
            <View className="flex-row items-center justify-between">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              {stat.trend && (
                <View className="flex-row items-center">
                  <Ionicons name="trending-up" size={14} color="#22C55E" />
                  <Text className="text-green-500 text-xs ml-1">{stat.trend}</Text>
                </View>
              )}
            </View>
            <Text className="text-white text-2xl font-bold mt-2">{stat.value}</Text>
            <Text className="text-gray-400 text-sm">{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View className="flex-row space-x-3 mb-6">
        <TouchableOpacity
          className="flex-1 bg-orange-500 rounded-xl p-4 flex-row items-center justify-center"
          onPress={() => router.push('/(app)/(tabs)/inventory')}
        >
          <Ionicons name="add-circle" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Add Product</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-gray-800 rounded-xl p-4 flex-row items-center justify-center"
          onPress={() => router.push('/(app)/(tabs)/orders')}
        >
          <Ionicons name="receipt" size={20} color="#F97316" />
          <Text className="text-white font-semibold ml-2">View Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Pending Orders */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-lg font-semibold">Pending Orders</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/orders')}>
            <Text className="text-orange-500">View All</Text>
          </TouchableOpacity>
        </View>

        {[
          {
            id: 'ORD-2024-0002',
            customer: 'Rajesh Constructions',
            items: '50x Cement, 20x TMT Bars',
            total: '₹30,000',
            time: '10 mins ago',
          },
          {
            id: 'ORD-2024-0003',
            customer: 'Priya Patel',
            items: '1x UPVC Window, 2x Door Hinges',
            total: '₹10,230',
            time: '25 mins ago',
          },
        ].map((order, index) => (
          <View key={index} className="bg-gray-800 rounded-xl p-4 mb-3 border-l-4 border-orange-500">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-white font-medium">{order.id}</Text>
                  <Text className="text-gray-500 text-xs ml-2">{order.time}</Text>
                </View>
                <Text className="text-gray-400 text-sm mt-1">{order.customer}</Text>
                <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
                  {order.items}
                </Text>
                <Text className="text-orange-500 font-semibold mt-2">{order.total}</Text>
              </View>
              <View className="space-y-2">
                <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-lg">
                  <Text className="text-white font-medium">Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-700 px-4 py-2 rounded-lg">
                  <Text className="text-gray-300 font-medium">Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Low Stock Alert */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-lg font-semibold">Low Stock Alert</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/inventory')}>
            <Text className="text-orange-500">Manage</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {[
              { name: 'UltraTech Cement 50kg', stock: 5, minStock: 20 },
              { name: 'TMT Bar 12mm', stock: 8, minStock: 25 },
              { name: 'PVC Pipe 4 inch', stock: 12, minStock: 30 },
            ].map((item, index) => (
              <View key={index} className="bg-red-500/10 rounded-xl p-4 w-44 border border-red-500/30">
                <Ionicons name="warning" size={20} color="#EF4444" />
                <Text className="text-white font-medium mt-2" numberOfLines={2}>
                  {item.name}
                </Text>
                <View className="flex-row items-center mt-2">
                  <Text className="text-red-500 font-bold">{item.stock}</Text>
                  <Text className="text-gray-400 text-sm"> / {item.minStock} min</Text>
                </View>
                <TouchableOpacity className="bg-red-500 rounded-lg py-2 mt-3">
                  <Text className="text-white text-center font-medium text-sm">Restock</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Assigned Drivers */}
      <View className="mb-6">
        <Text className="text-white text-lg font-semibold mb-3">Your Drivers</Text>
        <View className="flex-row space-x-3">
          {[
            { name: 'Krishna', status: 'delivering', orders: 2 },
            { name: 'Ramesh', status: 'available', orders: 0 },
          ].map((driver, index) => (
            <View key={index} className="flex-1 bg-gray-800 rounded-xl p-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-gray-700 rounded-full items-center justify-center">
                  <Ionicons name="person" size={20} color="#6B7280" />
                </View>
                <View className="ml-3">
                  <Text className="text-white font-medium">{driver.name}</Text>
                  <Text
                    className={`text-sm ${
                      driver.status === 'available' ? 'text-green-500' : 'text-orange-500'
                    }`}
                  >
                    {driver.status === 'available' ? 'Available' : `${driver.orders} deliveries`}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
