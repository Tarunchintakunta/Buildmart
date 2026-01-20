import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { useAuth } from '../../../src/context/AuthContext';
import { useCartStore, useWalletStore, useWorkerStore } from '../../../src/store/useStore';

// Dashboard components for each role
import CustomerDashboard from '../../../src/components/dashboards/CustomerDashboard';
import ContractorDashboard from '../../../src/components/dashboards/ContractorDashboard';
import WorkerDashboard from '../../../src/components/dashboards/WorkerDashboard';
import ShopkeeperDashboard from '../../../src/components/dashboards/ShopkeeperDashboard';
import DriverDashboard from '../../../src/components/dashboards/DriverDashboard';
import AdminDashboard from '../../../src/components/dashboards/AdminDashboard';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const cartItemCount = useCartStore((state) => state.getItemCount());

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderDashboard = () => {
    switch (user?.role) {
      case 'customer':
        return <CustomerDashboard />;
      case 'contractor':
        return <ContractorDashboard />;
      case 'worker':
        return <WorkerDashboard />;
      case 'shopkeeper':
        return <ShopkeeperDashboard />;
      case 'driver':
        return <DriverDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <View className="flex-1 items-center justify-center">
            <Text className="text-white">Unknown role</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
        <View>
          <Text className="text-gray-400 text-sm">Welcome back,</Text>
          <Text className="text-white text-xl font-bold">{user?.full_name}</Text>
        </View>
        <View className="flex-row items-center space-x-3">
          {/* Cart (for customer/contractor) */}
          {(user?.role === 'customer' || user?.role === 'contractor') && (
            <TouchableOpacity
              className="relative"
              onPress={() => router.push('/(app)/checkout')}
            >
              <Ionicons name="cart-outline" size={26} color="white" />
              {cartItemCount > 0 && (
                <View className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {/* Notifications */}
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={26} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dashboard Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F97316"
          />
        }
      >
        {renderDashboard()}
      </ScrollView>
    </SafeAreaView>
  );
}
