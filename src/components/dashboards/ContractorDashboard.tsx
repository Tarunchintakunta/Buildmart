import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWalletStore, useLaborStore } from '../../store/useStore';

const STATS = [
  { label: 'Active Contracts', value: '4', icon: 'document-text', color: '#3B82F6' },
  { label: 'Workers Hired', value: '12', icon: 'people', color: '#10B981' },
  { label: 'Pending Orders', value: '3', icon: 'cube', color: '#F59E0B' },
  { label: 'This Month', value: '₹2.5L', icon: 'trending-up', color: '#8B5CF6' },
];

export default function ContractorDashboard() {
  const router = useRouter();
  const wallet = useWalletStore((state) => state.wallet);

  const walletBalance = wallet?.balance ?? 500000;
  const heldBalance = wallet?.held_balance ?? 50000;

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Wallet Card */}
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
              <Text className="text-gray-400 text-sm font-medium mb-1">Available Balance</Text>
              <Text className="text-white text-4xl font-bold">
                ₹{walletBalance.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity 
              className="px-5 py-3 rounded-xl"
              style={{ backgroundColor: '#F97316' }}
            >
              <Text className="text-white font-bold">Add Funds</Text>
            </TouchableOpacity>
          </View>
          <View 
            className="flex-row items-center px-4 py-3 rounded-xl mt-4"
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}
          >
            <Ionicons name="lock-closed" size={20} color="#F59E0B" />
            <Text className="text-yellow-500 ml-2 font-semibold">
              ₹{heldBalance.toLocaleString()} held in escrow
            </Text>
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
                <Text className="text-white text-2xl font-bold">{stat.value}</Text>
              </View>
              <Text className="text-gray-400 text-sm font-medium">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-4">Quick Actions</Text>
          <View className="flex-row space-x-3">
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
              onPress={() => router.push('/(app)/agreement/create')}
            >
              <Ionicons name="add-circle" size={22} color="white" />
              <Text className="text-white font-bold ml-2">New Agreement</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 rounded-2xl p-4 flex-row items-center justify-center"
              style={{
                backgroundColor: '#1F2937',
                borderWidth: 1,
                borderColor: '#374151',
              }}
              onPress={() => router.push('/(app)/(tabs)/shop')}
            >
              <Ionicons name="cart" size={22} color="#F97316" />
              <Text className="text-white font-bold ml-2">Bulk Order</Text>
            </TouchableOpacity>
          </View>
        </View>

      {/* Active Agreements */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-lg font-semibold">Active Agreements</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/agreements')}>
            <Text className="text-orange-500">View All</Text>
          </TouchableOpacity>
        </View>

        {[
          {
            id: 'AGR-2024-001',
            worker: 'Ramu Yadav',
            title: 'Site Labor',
            rate: '₹600/day',
            status: 'active',
            endDate: 'Mar 15',
          },
          {
            id: 'AGR-2024-002',
            worker: 'Suresh Kumar',
            title: 'Mason Work',
            rate: '₹5,600/week',
            status: 'active',
            endDate: 'Apr 30',
          },
        ].map((agreement, index) => (
          <TouchableOpacity
            key={index}
            className="bg-gray-800 rounded-xl p-4 mb-3"
            onPress={() => router.push(`/(app)/agreement/${agreement.id}`)}
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-white font-medium">{agreement.title}</Text>
                <Text className="text-gray-400 text-sm mt-1">{agreement.worker}</Text>
                <View className="flex-row items-center mt-2">
                  <Text className="text-orange-500 font-semibold">{agreement.rate}</Text>
                  <Text className="text-gray-500 mx-2">•</Text>
                  <Text className="text-gray-400 text-sm">Ends {agreement.endDate}</Text>
                </View>
              </View>
              <View className="bg-green-500/20 px-2 py-1 rounded">
                <Text className="text-green-500 text-xs font-medium">Active</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

        {/* Available Workers */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Available Workers</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/workers')}>
              <Text className="text-orange-500 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
            <View className="flex-row space-x-4">
              {[
                { name: 'Ramu Y.', skill: 'Coolie', rate: '₹600/day', rating: 4.5 },
                { name: 'Mohammed A.', skill: 'Electrician', rate: '₹900/day', rating: 4.6 },
                { name: 'Venkat R.', skill: 'Carpenter', rate: '₹1000/day', rating: 4.9 },
              ].map((worker, index) => (
                <TouchableOpacity
                  key={index}
                  className="rounded-2xl p-4 w-44"
                  style={{
                    backgroundColor: '#1F2937',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                  onPress={() => router.push('/(app)/(tabs)/workers')}
                >
                  <View 
                    className="w-14 h-14 rounded-xl items-center justify-center mb-3"
                    style={{ backgroundColor: '#374151' }}
                  >
                    <Ionicons name="person" size={28} color="#6B7280" />
                  </View>
                  <Text className="text-white font-bold text-base mb-1">{worker.name}</Text>
                  <Text className="text-gray-400 text-sm mb-2">{worker.skill}</Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-orange-500 font-bold text-sm">{worker.rate}</Text>
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text className="text-gray-400 text-xs ml-1 font-medium">{worker.rating}</Text>
                    </View>
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
