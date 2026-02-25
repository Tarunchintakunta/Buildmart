import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { View, Text } from 'react-native';
import { useCartStore } from '../../../src/store/useStore';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

export default function TabsLayout() {
  const { user } = useAuth();
  const itemCount = useCartStore((state) => state.getItemCount());

  const getTabsForRole = () => {
    switch (user?.role) {
      case 'customer':
        return (
          <>
            <Tabs.Screen
              name="index"
              options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="shop"
              options={{
                title: 'Shop',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="storefront" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="orders"
              options={{
                title: 'Orders',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="receipt" size={size} color={color} />
                ),
                tabBarBadge: itemCount > 0 ? itemCount : undefined,
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" size={size} color={color} />
                ),
              }}
            />
          </>
        );

      case 'contractor':
        return (
          <>
            <Tabs.Screen
              name="index"
              options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="shop"
              options={{
                title: 'Shop',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="storefront" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="workers"
              options={{
                title: 'Hire',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="people" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="agreements"
              options={{
                title: 'Contracts',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="document-text" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" size={size} color={color} />
                ),
              }}
            />
          </>
        );

      case 'worker':
        return (
          <>
            <Tabs.Screen
              name="index"
              options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="jobs"
              options={{
                title: 'Jobs',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="briefcase" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="agreements"
              options={{
                title: 'Contracts',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="document-text" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="wallet"
              options={{
                title: 'Wallet',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="wallet" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" size={size} color={color} />
                ),
              }}
            />
          </>
        );

      case 'shopkeeper':
        return (
          <>
            <Tabs.Screen
              name="index"
              options={{
                title: 'Dashboard',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="grid" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="inventory"
              options={{
                title: 'Inventory',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="cube" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="orders"
              options={{
                title: 'Orders',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="receipt" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="wallet"
              options={{
                title: 'Wallet',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="wallet" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" size={size} color={color} />
                ),
              }}
            />
          </>
        );

      case 'driver':
        return (
          <>
            <Tabs.Screen
              name="index"
              options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="deliveries"
              options={{
                title: 'Deliveries',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="car" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="wallet"
              options={{
                title: 'Wallet',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="wallet" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" size={size} color={color} />
                ),
              }}
            />
          </>
        );

      case 'admin':
        return (
          <>
            <Tabs.Screen
              name="index"
              options={{
                title: 'Dashboard',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="grid" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="verifications"
              options={{
                title: 'Verify',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="shield-checkmark" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="users"
              options={{
                title: 'Users',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="people" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" size={size} color={color} />
                ),
              }}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
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
        },
        tabBarActiveTintColor: T.navy,
        tabBarInactiveTintColor: T.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      {getTabsForRole()}
      {/* Hidden screens that might be needed */}
      <Tabs.Screen name="shop" options={{ href: null }} />
      <Tabs.Screen name="workers" options={{ href: null }} />
      <Tabs.Screen name="orders" options={{ href: null }} />
      <Tabs.Screen name="agreements" options={{ href: null }} />
      <Tabs.Screen name="jobs" options={{ href: null }} />
      <Tabs.Screen name="wallet" options={{ href: null }} />
      <Tabs.Screen name="inventory" options={{ href: null }} />
      <Tabs.Screen name="deliveries" options={{ href: null }} />
      <Tabs.Screen name="verifications" options={{ href: null }} />
      <Tabs.Screen name="users" options={{ href: null }} />
    </Tabs>
  );
}
