import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { useWalletStore } from '../../../src/store/useStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const wallet = useWalletStore((state) => state.wallet);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'customer':
        return 'Customer';
      case 'contractor':
        return 'Contractor';
      case 'worker':
        return 'Worker';
      case 'shopkeeper':
        return 'Shop Owner';
      case 'driver':
        return 'Delivery Driver';
      case 'admin':
        return 'Administrator';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'customer':
        return 'bg-blue-500';
      case 'contractor':
        return 'bg-purple-500';
      case 'worker':
        return 'bg-green-500';
      case 'shopkeeper':
        return 'bg-orange-500';
      case 'driver':
        return 'bg-cyan-500';
      case 'admin':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMenuItems = () => {
    const commonItems = [
      {
        id: 'wallet',
        label: 'Wallet',
        icon: 'wallet',
        route: '/(app)/(tabs)/wallet',
        show: true,
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: 'notifications',
        route: null,
        show: true,
      },
      {
        id: 'help',
        label: 'Help & Support',
        icon: 'help-circle',
        route: null,
        show: true,
      },
      {
        id: 'about',
        label: 'About',
        icon: 'information-circle',
        route: null,
        show: true,
      },
    ];

    switch (user?.role) {
      case 'customer':
        return [
          { id: 'orders', label: 'My Orders', icon: 'receipt', route: '/(app)/(tabs)/orders' },
          { id: 'addresses', label: 'Saved Addresses', icon: 'location', route: null },
          ...commonItems,
        ];
      case 'contractor':
        return [
          { id: 'agreements', label: 'My Agreements', icon: 'document-text', route: '/(app)/(tabs)/agreements' },
          { id: 'orders', label: 'My Orders', icon: 'receipt', route: '/(app)/(tabs)/orders' },
          { id: 'workers', label: 'Hired Workers', icon: 'people', route: '/(app)/(tabs)/workers' },
          ...commonItems,
        ];
      case 'worker':
        return [
          { id: 'jobs', label: 'My Jobs', icon: 'briefcase', route: '/(app)/(tabs)/jobs' },
          { id: 'agreements', label: 'My Contracts', icon: 'document-text', route: '/(app)/(tabs)/agreements' },
          { id: 'verification', label: 'Verification', icon: 'shield-checkmark', route: null },
          { id: 'skills', label: 'My Skills', icon: 'construct', route: null },
          ...commonItems,
        ];
      case 'shopkeeper':
        return [
          { id: 'shop', label: 'Shop Settings', icon: 'storefront', route: null },
          { id: 'inventory', label: 'Inventory', icon: 'cube', route: '/(app)/(tabs)/inventory' },
          { id: 'orders', label: 'Orders', icon: 'receipt', route: '/(app)/(tabs)/orders' },
          { id: 'drivers', label: 'My Drivers', icon: 'car', route: null },
          ...commonItems,
        ];
      case 'driver':
        return [
          { id: 'deliveries', label: 'My Deliveries', icon: 'car', route: '/(app)/(tabs)/deliveries' },
          { id: 'vehicle', label: 'Vehicle Info', icon: 'car-sport', route: null },
          ...commonItems,
        ];
      case 'admin':
        return [
          { id: 'verifications', label: 'Verifications', icon: 'shield-checkmark', route: '/(app)/(tabs)/verifications' },
          { id: 'users', label: 'User Management', icon: 'people', route: '/(app)/(tabs)/users' },
          ...commonItems,
        ];
      default:
        return commonItems;
    }
  };

  const walletBalance = wallet?.balance ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-3 border-b border-gray-800">
          <Text className="text-white text-2xl font-bold">Profile</Text>
        </View>

        {/* Profile Card */}
        <View className="px-4 mt-4">
          <View className="bg-gray-800 rounded-2xl p-5">
            <View className="flex-row items-center">
              <View className="w-20 h-20 bg-gray-700 rounded-full items-center justify-center">
                <Ionicons name="person" size={40} color="#6B7280" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white text-xl font-bold">{user?.full_name}</Text>
                <Text className="text-gray-400">{user?.phone}</Text>
                <View className={`self-start px-3 py-1 rounded-full mt-2 ${getRoleColor(user?.role || '')}`}>
                  <Text className="text-white text-sm font-medium">
                    {getRoleLabel(user?.role || '')}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="bg-gray-700 p-2 rounded-full">
                <Ionicons name="pencil" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Location */}
            {user?.address && (
              <View className="flex-row items-center mt-4 pt-4 border-t border-gray-700">
                <Ionicons name="location" size={18} color="#9CA3AF" />
                <Text className="text-gray-400 ml-2 flex-1" numberOfLines={1}>
                  {user.address}, {user.city}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Wallet Summary */}
        <View className="px-4 mt-4">
          <TouchableOpacity className="bg-orange-500 rounded-2xl p-5">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-orange-100 text-sm">Wallet Balance</Text>
                <Text className="text-white text-2xl font-bold mt-1">
                  ₹{walletBalance.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="bg-white/20 rounded-full p-3 mr-3">
                  <Ionicons name="add" size={20} color="white" />
                </View>
                <View className="bg-white/20 rounded-full p-3">
                  <Ionicons name="wallet" size={20} color="white" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="px-4 mt-6">
          <Text className="text-gray-400 text-sm mb-3 px-2">MENU</Text>
          <View className="bg-gray-800 rounded-2xl overflow-hidden">
            {getMenuItems().map((item, index) => (
              <TouchableOpacity
                key={item.id}
                className={`flex-row items-center px-4 py-4 ${
                  index !== getMenuItems().length - 1 ? 'border-b border-gray-700' : ''
                }`}
                onPress={() => item.route && router.push(item.route as any)}
              >
                <View className="w-10 h-10 bg-gray-700 rounded-full items-center justify-center">
                  <Ionicons name={item.icon as any} size={20} color="#F97316" />
                </View>
                <Text className="text-white font-medium ml-3 flex-1">{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-4 mt-6 mb-8">
          <TouchableOpacity
            className="bg-red-500/10 rounded-2xl py-4 flex-row items-center justify-center"
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="#EF4444" />
            <Text className="text-red-500 font-semibold ml-2">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="items-center pb-8">
          <Text className="text-gray-600 text-sm">BuildMart v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
