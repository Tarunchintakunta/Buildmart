import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback, useEffect } from 'react';
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
  const { user, logout } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const cartItemCount = useCartStore((state) => state.getItemCount());

  // Redirect to login if user doesn't have a role
  useEffect(() => {
    if (user && !user.role) {
      console.warn('User missing role, logging out...', user);
      logout().then(() => {
        router.replace('/(auth)/login');
      });
    }
  }, [user, logout, router]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderDashboard = () => {
    if (!user) {
      return (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-white text-lg mb-2">No user found</Text>
          <Text className="text-gray-400 text-sm text-center">
            Please log in to continue
          </Text>
        </View>
      );
    }

    if (!user.role) {
      return (
        <View className="flex-1 items-center justify-center p-4">
          <Ionicons name="alert-circle" size={48} color="#F97316" />
          <Text className="text-white text-lg mb-2 mt-4">User role missing</Text>
          <Text className="text-gray-400 text-sm text-center mb-4">
            Please log out and log back in
          </Text>
          <TouchableOpacity
            className="bg-orange-500 px-6 py-3 rounded-full"
            onPress={async () => {
              await logout();
              router.replace('/(auth)/login');
            }}
          >
            <Text className="text-white font-semibold">Go to Login</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (user.role) {
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
          <View className="flex-1 items-center justify-center p-4">
            <Ionicons name="alert-circle" size={48} color="#F97316" />
            <Text className="text-white text-lg mb-2 mt-4">Unknown role: {String(user.role)}</Text>
            <Text className="text-gray-400 text-sm text-center mb-4">
              User: {user.full_name} ({user.phone})
            </Text>
            <TouchableOpacity
              className="bg-orange-500 px-6 py-3 rounded-full"
              onPress={async () => {
                await logout();
                router.replace('/(auth)/login');
              }}
            >
              <Text className="text-white font-semibold">Go to Login</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View 
        className="flex-row items-center justify-between px-5 py-4 border-b"
        style={{ borderBottomColor: '#374151' }}
      >
        <View>
          <Text className="text-gray-400 text-sm font-medium mb-1">Welcome back,</Text>
          <Text className="text-white text-2xl font-bold">{user?.full_name}</Text>
        </View>
        <View className="flex-row items-center space-x-4">
          {/* Cart (for customer/contractor) */}
          {(user?.role === 'customer' || user?.role === 'contractor') && (
            <TouchableOpacity
              className="relative"
              onPress={() => router.push('/(app)/checkout')}
            >
              <Ionicons name="cart-outline" size={28} color="white" />
              {cartItemCount > 0 && (
                <View 
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full items-center justify-center"
                  style={{ backgroundColor: '#F97316' }}
                >
                  <Text className="text-white text-xs font-bold">{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {/* Notifications */}
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color="white" />
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
