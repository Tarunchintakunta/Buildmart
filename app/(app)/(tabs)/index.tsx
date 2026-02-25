import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../src/context/AuthContext';
import { useCartStore } from '../../../src/store/useStore';
import { LightTheme } from '../../../src/theme/designSystem';

import CustomerDashboard from '../../../src/components/dashboards/CustomerDashboard';
import ContractorDashboard from '../../../src/components/dashboards/ContractorDashboard';
import WorkerDashboard from '../../../src/components/dashboards/WorkerDashboard';
import ShopkeeperDashboard from '../../../src/components/dashboards/ShopkeeperDashboard';
import DriverDashboard from '../../../src/components/dashboards/DriverDashboard';
import AdminDashboard from '../../../src/components/dashboards/AdminDashboard';

const T = LightTheme;

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const cartItemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    if (user && !user.role) {
      logout().then(() => {
        router.replace('/(auth)/login');
      });
    }
  }, [user, logout, router]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderDashboard = () => {
    if (!user || !user.role) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <Ionicons name="alert-circle" size={48} color={T.amber} />
          <Text style={{ color: T.text, fontSize: 18, marginTop: 16, marginBottom: 8, fontWeight: '700' }}>
            Session Error
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: T.navy, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
            onPress={async () => { await logout(); router.replace('/(auth)/login'); }}
          >
            <Text style={{ color: T.white, fontWeight: '700' }}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (user.role) {
      case 'customer': return <CustomerDashboard />;
      case 'contractor': return <ContractorDashboard />;
      case 'worker': return <WorkerDashboard />;
      case 'shopkeeper': return <ShopkeeperDashboard />;
      case 'driver': return <DriverDashboard />;
      case 'admin': return <AdminDashboard />;
      default: return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.full_name}</Text>
        </View>
        <View style={styles.headerActions}>
          {(user?.role === 'customer' || user?.role === 'contractor') && (
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => router.push('/(app)/checkout')}
            >
              <Ionicons name="cart-outline" size={22} color={T.text} />
              {cartItemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="notifications-outline" size={22} color={T.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dashboard Content */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={T.amber}
          />
        }
      >
        {renderDashboard()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  greeting: {
    fontSize: 13,
    color: T.textSecondary,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: T.text,
  },
  headerActions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  cartBadge: {
    position: 'absolute' as const,
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: T.amber,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  cartBadgeText: {
    color: T.white,
    fontSize: 10,
    fontWeight: '700' as const,
  },
};
