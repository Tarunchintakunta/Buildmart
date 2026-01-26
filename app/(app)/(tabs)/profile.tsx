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
        return '#3B82F6';
      case 'contractor':
        return '#8B5CF6';
      case 'worker':
        return '#10B981';
      case 'shopkeeper':
        return '#F97316';
      case 'driver':
        return '#06B6D4';
      case 'admin':
        return '#EF4444';
      default:
        return '#6B7280';
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
        <View 
          className="px-5 py-4 border-b"
          style={{ borderBottomColor: '#374151' }}
        >
          <Text className="text-white text-3xl font-bold">Profile</Text>
        </View>

        {/* Profile Card */}
        <View className="px-4 mt-4">
          <View 
            className="rounded-2xl p-6"
            style={{
              backgroundColor: '#1F2937',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center">
              <View 
                className="w-24 h-24 rounded-2xl items-center justify-center"
                style={{ backgroundColor: '#374151' }}
              >
                <Ionicons name="person" size={48} color="#6B7280" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white text-2xl font-bold mb-1">{user?.full_name}</Text>
                <Text className="text-gray-400 font-medium mb-2">{user?.phone}</Text>
                <View 
                  className="self-start px-4 py-2 rounded-xl"
                  style={{ backgroundColor: `${getRoleColor(user?.role || '')}20` }}
                >
                  <Text 
                    className="font-bold text-sm"
                    style={{ color: getRoleColor(user?.role || '') }}
                  >
                    {getRoleLabel(user?.role || '')}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                className="p-3 rounded-xl"
                style={{ backgroundColor: '#374151' }}
              >
                <Ionicons name="pencil" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Location */}
            {user?.address && (
              <View 
                className="flex-row items-center mt-4 pt-4"
                style={{ borderTopWidth: 1, borderTopColor: '#374151' }}
              >
                <Ionicons name="location" size={20} color="#9CA3AF" />
                <Text className="text-gray-400 ml-2 flex-1 font-medium" numberOfLines={1}>
                  {user.address}, {user.city}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Wallet Summary */}
        <View className="px-4 mt-4">
          <TouchableOpacity 
            className="rounded-2xl p-6"
            style={{
              backgroundColor: '#F97316',
              shadowColor: '#F97316',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
            onPress={() => router.push('/(app)/(tabs)/wallet')}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-orange-100 text-sm font-medium mb-1">Wallet Balance</Text>
                <Text className="text-white text-3xl font-bold">
                  ₹{walletBalance.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View 
                  className="rounded-full p-3 mr-3"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <Ionicons name="add" size={22} color="white" />
                </View>
                <View 
                  className="rounded-full p-3"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <Ionicons name="wallet" size={22} color="white" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="px-4 mt-6">
          <Text className="text-gray-400 text-sm mb-4 px-2 font-semibold">MENU</Text>
          <View 
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: '#1F2937',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {getMenuItems().map((item, index) => (
              <TouchableOpacity
                key={item.id}
                className="flex-row items-center px-5 py-4"
                style={{
                  borderBottomWidth: index !== getMenuItems().length - 1 ? 1 : 0,
                  borderBottomColor: '#374151',
                }}
                onPress={() => item.route && router.push(item.route as any)}
              >
                <View 
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)' }}
                >
                  <Ionicons name={item.icon as any} size={24} color="#F97316" />
                </View>
                <Text className="text-white font-bold ml-4 flex-1 text-base">{item.label}</Text>
                <Ionicons name="chevron-forward" size={22} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-4 mt-6 mb-8">
          <TouchableOpacity
            className="rounded-2xl py-4 flex-row items-center justify-center"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              borderWidth: 1,
              borderColor: 'rgba(239, 68, 68, 0.3)',
            }}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={22} color="#EF4444" />
            <Text className="text-red-500 font-bold ml-2">Logout</Text>
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
