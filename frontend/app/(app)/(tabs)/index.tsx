import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { useAuth } from '../../../src/hooks/useAuth';
import { useCartStore } from '../../../src/store/cart.store';
import { LightTheme as T } from '../../../src/theme/colors';

import CustomerDashboard from '../../../src/components/role/CustomerDashboard';
import WorkerDashboard from '../../../src/components/role/WorkerDashboard';
import ShopkeeperDashboard from '../../../src/components/role/ShopkeeperDashboard';
import ContractorDashboard from '../../../src/components/role/ContractorDashboard';
import DriverDashboard from '../../../src/components/role/DriverDashboard';
import AdminDashboard from '../../../src/components/role/AdminDashboard';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const cartItemCount = useCartStore((state) => state.getItemCount());

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const renderDashboard = () => {
    if (!user?.role) return null;
    switch (user.role) {
      case 'customer': return <CustomerDashboard key={refreshKey} />;
      case 'worker': return <WorkerDashboard key={refreshKey} />;
      case 'shopkeeper': return <ShopkeeperDashboard key={refreshKey} />;
      case 'contractor': return <ContractorDashboard key={refreshKey} />;
      case 'driver': return <DriverDashboard key={refreshKey} />;
      case 'admin': return <AdminDashboard key={refreshKey} />;
      default: return null;
    }
  };

  if (!user) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName} numberOfLines={1}>{user.full_name}</Text>
        </View>
        <View style={styles.headerActions}>
          {(user.role === 'customer' || user.role === 'contractor') && (
            <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/(app)/checkout' as any)}>
              <Ionicons name="cart-outline" size={22} color={T.text} />
              {cartItemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/(app)/notifications' as any)}>
            <Ionicons name="notifications-outline" size={22} color={T.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dashboard */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={T.amber} />
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
    paddingVertical: 14,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  greeting: { fontSize: 13, color: T.textSecondary, fontWeight: '500' as const, marginBottom: 2 },
  userName: { fontSize: 20, fontWeight: '800' as const, color: T.text },
  headerActions: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 },
  headerBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: T.bg, justifyContent: 'center' as const, alignItems: 'center' as const },
  cartBadge: { position: 'absolute' as const, top: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: T.amber, alignItems: 'center' as const, justifyContent: 'center' as const },
  cartBadgeText: { color: T.white, fontSize: 10, fontWeight: '700' as const },
};
