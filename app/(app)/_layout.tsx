import { Stack } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#111827' },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="shop/[id]"
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="worker/[id]"
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="order/[id]"
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="agreement/[id]"
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="agreement/create"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="hire"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
