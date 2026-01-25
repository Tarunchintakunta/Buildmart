import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { UserRole } from '../../../src/types/database';

const USER_TABS: (UserRole | 'all')[] = ['all', 'customer', 'contractor', 'worker', 'shopkeeper', 'driver'];

const MOCK_USERS = [
  { id: 'u1', name: 'Rahul Sharma', phone: '9876543101', role: 'customer', isActive: true, joinedAt: '2024-01-10' },
  { id: 'u2', name: 'Priya Patel', phone: '9876543102', role: 'customer', isActive: true, joinedAt: '2024-01-12' },
  { id: 'u3', name: 'Rajesh Constructions', phone: '9876543201', role: 'contractor', isActive: true, joinedAt: '2024-01-05' },
  { id: 'u4', name: 'BuildRight Pvt Ltd', phone: '9876543202', role: 'contractor', isActive: true, joinedAt: '2024-01-08' },
  { id: 'u5', name: 'Ramu Yadav', phone: '9876543301', role: 'worker', isActive: true, isVerified: true, joinedAt: '2024-01-15' },
  { id: 'u6', name: 'Suresh Kumar', phone: '9876543302', role: 'worker', isActive: true, isVerified: true, joinedAt: '2024-01-18' },
  { id: 'u7', name: 'Ganesh Babu', phone: '9876543304', role: 'worker', isActive: true, isVerified: false, joinedAt: '2024-02-01' },
  { id: 'u8', name: 'Anand Hardware', phone: '9876543401', role: 'shopkeeper', isActive: true, joinedAt: '2024-01-02' },
  { id: 'u9', name: 'Sri Lakshmi Traders', phone: '9876543402', role: 'shopkeeper', isActive: true, joinedAt: '2024-01-03' },
  { id: 'u10', name: 'Krishna Driver', phone: '9876543501', role: 'driver', isActive: true, joinedAt: '2024-01-20' },
  { id: 'u11', name: 'Naveen Transport', phone: '9876543503', role: 'driver', isActive: false, joinedAt: '2024-01-22' },
];

const getRoleStyle = (role: string) => {
  switch (role) {
    case 'customer':
      return { bg: 'bg-blue-500/20', text: 'text-blue-500', icon: 'person' };
    case 'contractor':
      return { bg: 'bg-purple-500/20', text: 'text-purple-500', icon: 'business' };
    case 'worker':
      return { bg: 'bg-green-500/20', text: 'text-green-500', icon: 'hammer' };
    case 'shopkeeper':
      return { bg: 'bg-orange-500/20', text: 'text-orange-500', icon: 'storefront' };
    case 'driver':
      return { bg: 'bg-cyan-500/20', text: 'text-cyan-500', icon: 'car' };
    default:
      return { bg: 'bg-gray-500/20', text: 'text-gray-500', icon: 'person' };
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'customer': return 'Customer';
    case 'contractor': return 'Contractor';
    case 'worker': return 'Worker';
    case 'shopkeeper': return 'Shopkeeper';
    case 'driver': return 'Driver';
    case 'admin': return 'Admin';
    default: return role;
  }
};

export default function UsersScreen() {
  const [selectedTab, setSelectedTab] = useState<UserRole | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesRole = selectedTab === 'all' || user.role === selectedTab;
    return matchesSearch && matchesRole;
  });

  const getUserCounts = (): Record<UserRole | 'all', number> => {
    return {
      all: MOCK_USERS.length,
      customer: MOCK_USERS.filter((u) => u.role === 'customer').length,
      contractor: MOCK_USERS.filter((u) => u.role === 'contractor').length,
      worker: MOCK_USERS.filter((u) => u.role === 'worker').length,
      shopkeeper: MOCK_USERS.filter((u) => u.role === 'shopkeeper').length,
      driver: MOCK_USERS.filter((u) => u.role === 'driver').length,
      admin: MOCK_USERS.filter((u) => u.role === 'admin').length,
    };
  };

  const counts = getUserCounts();

  const renderUser = ({ item: user }: { item: typeof MOCK_USERS[0] }) => {
    const roleStyle = getRoleStyle(user.role);
    const isWorker = user.role === 'worker';

    return (
      <View className="bg-gray-800 rounded-xl p-4 mb-3">
        <View className="flex-row items-center">
          <View className="w-14 h-14 bg-gray-700 rounded-full items-center justify-center">
            <Ionicons name={roleStyle.icon as any} size={28} color="#6B7280" />
          </View>

          <View className="flex-1 ml-4">
            <View className="flex-row items-center">
              <Text className="text-white font-semibold text-lg">{user.name}</Text>
              {!user.isActive && (
                <View className="bg-red-500/20 px-2 py-0.5 rounded ml-2">
                  <Text className="text-red-500 text-xs">Inactive</Text>
                </View>
              )}
            </View>
            <Text className="text-gray-400">{user.phone}</Text>
            <View className="flex-row items-center mt-1">
              <View className={`px-2 py-0.5 rounded ${roleStyle.bg}`}>
                <Text className={`text-xs font-medium ${roleStyle.text}`}>
                  {getRoleLabel(user.role)}
                </Text>
              </View>
              {isWorker && (
                <View className={`ml-2 px-2 py-0.5 rounded ${
                  (user as any).isVerified ? 'bg-green-500/20' : 'bg-yellow-500/20'
                }`}>
                  <Text className={`text-xs ${
                    (user as any).isVerified ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {(user as any).isVerified ? 'Verified' : 'Unverified'}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="items-end">
            <Text className="text-gray-500 text-xs">Joined</Text>
            <Text className="text-gray-400 text-sm">{user.joinedAt}</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row space-x-2 mt-4 pt-3 border-t border-gray-700">
          <TouchableOpacity className="flex-1 bg-gray-700 py-2 rounded-lg flex-row items-center justify-center">
            <Ionicons name="eye" size={16} color="#9CA3AF" />
            <Text className="text-gray-300 ml-2 text-sm">View</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-gray-700 py-2 rounded-lg flex-row items-center justify-center">
            <Ionicons name="create" size={16} color="#F97316" />
            <Text className="text-orange-500 ml-2 text-sm">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity className={`flex-1 py-2 rounded-lg flex-row items-center justify-center ${
            user.isActive ? 'bg-red-500/20' : 'bg-green-500/20'
          }`}>
            <Ionicons
              name={user.isActive ? 'ban' : 'checkmark-circle'}
              size={16}
              color={user.isActive ? '#EF4444' : '#22C55E'}
            />
            <Text className={`ml-2 text-sm ${user.isActive ? 'text-red-500' : 'text-green-500'}`}>
              {user.isActive ? 'Disable' : 'Enable'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-800">
        <Text className="text-white text-2xl font-bold">User Management</Text>

        {/* Search */}
        <View className="flex-row items-center bg-gray-800 rounded-xl px-4 mt-3">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 text-white py-3 ml-2"
            placeholder="Search by name or phone..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Role Filters */}
      <View className="py-3 border-b border-gray-800">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={USER_TABS}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          keyExtractor={(item) => item}
          renderItem={({ item: tab }) => (
            <TouchableOpacity
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedTab === tab ? 'bg-orange-500' : 'bg-gray-800'
              }`}
              onPress={() => setSelectedTab(tab)}
            >
              <Text className={`font-medium ${
                selectedTab === tab ? 'text-white' : 'text-gray-400'
              }`}>
                {tab === 'all' ? 'All' : getRoleLabel(tab)} ({counts[tab]})
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Stats Summary */}
      <View className="flex-row px-4 py-3 space-x-2">
        <View className="flex-1 bg-gray-800 rounded-lg p-3 items-center">
          <Text className="text-white font-bold text-xl">{MOCK_USERS.length}</Text>
          <Text className="text-gray-400 text-xs">Total Users</Text>
        </View>
        <View className="flex-1 bg-gray-800 rounded-lg p-3 items-center">
          <Text className="text-green-500 font-bold text-xl">
            {MOCK_USERS.filter((u) => u.isActive).length}
          </Text>
          <Text className="text-gray-400 text-xs">Active</Text>
        </View>
        <View className="flex-1 bg-gray-800 rounded-lg p-3 items-center">
          <Text className="text-red-500 font-bold text-xl">
            {MOCK_USERS.filter((u) => !u.isActive).length}
          </Text>
          <Text className="text-gray-400 text-xs">Inactive</Text>
        </View>
        <View className="flex-1 bg-gray-800 rounded-lg p-3 items-center">
          <Text className="text-yellow-500 font-bold text-xl">
            {MOCK_USERS.filter((u) => u.role === 'worker' && !(u as any).isVerified).length}
          </Text>
          <Text className="text-gray-400 text-xs">Unverified</Text>
        </View>
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Ionicons name="people" size={48} color="#6B7280" />
            <Text className="text-gray-400 mt-4">No users found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
