import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/hooks/useAuth';
import { useCartStore } from '../../../src/store/cart.store';
import { LightTheme as T } from '../../../src/theme/colors';
import { View, Text } from 'react-native';

export default function TabsLayout() {
  const { user } = useAuth();
  const itemCount = useCartStore((state) => state.getItemCount());

  const tabBarStyle = {
    backgroundColor: T.surface,
    borderTopColor: T.border,
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  };

  const tabBarLabelStyle = {
    fontSize: 10,
    fontWeight: '700' as const,
    marginTop: 2,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  };

  const screenOptions = {
    headerShown: false,
    tabBarStyle,
    tabBarActiveTintColor: T.navy,
    tabBarInactiveTintColor: T.textMuted,
    tabBarLabelStyle,
    tabBarIconStyle: { marginTop: 4 },
  };

  // Helper: icon component
  const icon = (name: keyof typeof Ionicons.glyphMap) =>
    ({ color, size }: { color: string; size: number }) => (
      <Ionicons name={name} size={size} color={color} />
    );

  // Helper: icon with badge
  const iconWithBadge = (name: keyof typeof Ionicons.glyphMap, badge: number) =>
    ({ color, size }: { color: string; size: number }) => (
      <View>
        <Ionicons name={name} size={size} color={color} />
        {badge > 0 && (
          <View style={{
            position: 'absolute', top: -4, right: -6,
            width: 16, height: 16, borderRadius: 8,
            backgroundColor: T.amber, alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </View>
    );

  const role = user?.role;

  return (
    <Tabs screenOptions={screenOptions}>
      {/* ---- CUSTOMER ---- */}
      <Tabs.Screen
        name="index"
        options={{
          title: role === 'shopkeeper' || role === 'admin' ? 'Dashboard' : 'Home',
          tabBarIcon: role === 'shopkeeper' || role === 'admin' ? icon('grid') : icon('home'),
        }}
      />

      {/* Shop — Customer and Contractor only */}
      <Tabs.Screen
        name="shop"
        options={{
          href: role === 'customer' || role === 'contractor' ? undefined : null,
          title: 'Shop',
          tabBarIcon: iconWithBadge('storefront', itemCount),
        }}
      />

      {/* Orders — Customer and Shopkeeper */}
      <Tabs.Screen
        name="orders"
        options={{
          href: role === 'customer' || role === 'shopkeeper' ? undefined : null,
          title: 'Orders',
          tabBarIcon: icon('receipt'),
        }}
      />

      {/* Workers — Contractor only */}
      <Tabs.Screen
        name="workers"
        options={{
          href: role === 'contractor' ? undefined : null,
          title: 'Hire',
          tabBarIcon: icon('people'),
        }}
      />

      {/* Agreements — Contractor and Worker */}
      <Tabs.Screen
        name="agreements"
        options={{
          href: role === 'contractor' || role === 'worker' ? undefined : null,
          title: 'Contracts',
          tabBarIcon: icon('document-text'),
        }}
      />

      {/* Jobs — Worker only */}
      <Tabs.Screen
        name="jobs"
        options={{
          href: role === 'worker' ? undefined : null,
          title: 'Jobs',
          tabBarIcon: icon('briefcase'),
        }}
      />

      {/* Wallet — Worker, Shopkeeper, Driver */}
      <Tabs.Screen
        name="wallet"
        options={{
          href: role === 'worker' || role === 'shopkeeper' || role === 'driver' ? undefined : null,
          title: 'Wallet',
          tabBarIcon: icon('wallet'),
        }}
      />

      {/* Inventory — Shopkeeper only */}
      <Tabs.Screen
        name="inventory"
        options={{
          href: role === 'shopkeeper' ? undefined : null,
          title: 'Inventory',
          tabBarIcon: icon('cube'),
        }}
      />

      {/* Deliveries — Driver only */}
      <Tabs.Screen
        name="deliveries"
        options={{
          href: role === 'driver' ? undefined : null,
          title: 'Deliveries',
          tabBarIcon: icon('car'),
        }}
      />

      {/* Verifications — Admin only */}
      <Tabs.Screen
        name="verifications"
        options={{
          href: role === 'admin' ? undefined : null,
          title: 'Verify',
          tabBarIcon: icon('shield-checkmark'),
        }}
      />

      {/* Users — Admin only */}
      <Tabs.Screen
        name="users"
        options={{
          href: role === 'admin' ? undefined : null,
          title: 'Users',
          tabBarIcon: icon('people'),
        }}
      />

      {/* Profile — All roles */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: icon('person'),
        }}
      />
    </Tabs>
  );
}
