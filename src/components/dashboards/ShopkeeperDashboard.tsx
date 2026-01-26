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
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Shop Status Card */}
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
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold mb-2">{shop.name}</Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={18} color="#F59E0B" />
                <Text className="text-white ml-1 font-semibold">{shop.rating}</Text>
                <Text className="text-gray-400 mx-2">•</Text>
                <Text className="text-gray-400 font-medium">{shop.totalOrders} orders</Text>
              </View>
            </View>
            <View 
              className="px-4 py-2 rounded-xl"
              style={{ 
                backgroundColor: shop.isOpen ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' 
              }}
            >
              <Text 
                className="font-bold"
                style={{ color: shop.isOpen ? '#10B981' : '#EF4444' }}
              >
                {shop.isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>

          {/* Revenue Summary */}
          <View 
            className="flex-row pt-4"
            style={{ borderTopWidth: 1, borderTopColor: '#374151' }}
          >
            <View className="flex-1">
              <Text className="text-gray-400 text-sm font-medium mb-1">Available Balance</Text>
              <Text className="text-white text-3xl font-bold">
                ₹{walletBalance.toLocaleString()}
              </Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-gray-400 text-sm font-medium mb-1">Total Earned</Text>
              <Text className="text-green-500 text-3xl font-bold">
                ₹{totalEarned.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between mb-6">
          {STATS.map((stat, index) => (
            <View 
              key={index} 
              className="w-[48%] rounded-2xl p-5 mb-3"
              style={{
                backgroundColor: '#1F2937',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                {stat.trend && (
                  <View className="flex-row items-center">
                    <Ionicons name="trending-up" size={16} color="#10B981" />
                    <Text className="text-green-500 text-xs ml-1 font-bold">{stat.trend}</Text>
                  </View>
                )}
              </View>
              <Text className="text-white text-3xl font-bold mb-1">{stat.value}</Text>
              <Text className="text-gray-400 text-sm font-medium">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="flex-row space-x-3 mb-6">
          <TouchableOpacity
            className="flex-1 rounded-2xl p-4 flex-row items-center justify-center"
            style={{
              backgroundColor: '#F97316',
              shadowColor: '#F97316',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={() => router.push('/(app)/(tabs)/inventory')}
          >
            <Ionicons name="add-circle" size={22} color="white" />
            <Text className="text-white font-bold ml-2">Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 rounded-2xl p-4 flex-row items-center justify-center"
            style={{
              backgroundColor: '#1F2937',
              borderWidth: 1,
              borderColor: '#374151',
            }}
            onPress={() => router.push('/(app)/(tabs)/orders')}
          >
            <Ionicons name="receipt" size={22} color="#F97316" />
            <Text className="text-white font-bold ml-2">View Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Pending Orders */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Pending Orders</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/orders')}>
              <Text className="text-orange-500 font-semibold">View All</Text>
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
            <View 
              key={index} 
              className="rounded-2xl p-5 mb-3"
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
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-white font-bold text-base">{order.id}</Text>
                    <Text className="text-gray-500 text-xs ml-2 font-medium">{order.time}</Text>
                  </View>
                  <Text className="text-gray-400 text-sm mb-1 font-medium">{order.customer}</Text>
                  <Text className="text-gray-500 text-sm mb-2" numberOfLines={1}>
                    {order.items}
                  </Text>
                  <Text className="text-orange-500 font-bold text-lg">{order.total}</Text>
                </View>
                <View className="space-y-2 ml-4">
                  <TouchableOpacity 
                    className="px-5 py-3 rounded-xl"
                    style={{ backgroundColor: '#10B981' }}
                  >
                    <Text className="text-white font-bold">Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="px-5 py-3 rounded-xl"
                    style={{ backgroundColor: '#374151' }}
                  >
                    <Text className="text-gray-300 font-bold">Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Low Stock Alert */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Low Stock Alert</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/inventory')}>
              <Text className="text-orange-500 font-semibold">Manage</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
            <View className="flex-row space-x-4">
              {[
                { name: 'UltraTech Cement 50kg', stock: 5, minStock: 20 },
                { name: 'TMT Bar 12mm', stock: 8, minStock: 25 },
                { name: 'PVC Pipe 4 inch', stock: 12, minStock: 30 },
              ].map((item, index) => (
                <View 
                  key={index} 
                  className="rounded-2xl p-5 w-48"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 1,
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Ionicons name="warning" size={24} color="#EF4444" />
                  <Text className="text-white font-bold mt-3 mb-2" numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View className="flex-row items-center mb-3">
                    <Text className="text-red-500 font-bold text-lg">{item.stock}</Text>
                    <Text className="text-gray-400 text-sm ml-1"> / {item.minStock} min</Text>
                  </View>
                  <TouchableOpacity 
                    className="rounded-xl py-3"
                    style={{ backgroundColor: '#EF4444' }}
                  >
                    <Text className="text-white text-center font-bold">Restock</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Assigned Drivers */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-4">Your Drivers</Text>
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
    </ScrollView>
  );
}
