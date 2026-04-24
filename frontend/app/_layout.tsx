import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { useAuth } from '../src/hooks/useAuth';
import { setupNotificationHandler } from '../src/utils/notifications';
import ErrorBoundary from '../src/components/ui/ErrorBoundary';
import '../src/i18n';
import '../global.css';

// Register notification handler immediately (before any component mounts)
setupNotificationHandler();

function RootLayoutNav() {
  const { isInitialized, isAuthenticated, initialize } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Initialize auth (load from storage + verify token) on mount
  useEffect(() => {
    initialize();
  }, []);

  // Route guard — runs after initialization completes
  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)/');
    }
  }, [isAuthenticated, isInitialized, segments]);

  // While initializing show a navy splash
  if (!isInitialized) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1A1D2E',
        }}
      >
        <ActivityIndicator size="large" color="#F2960D" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <RootLayoutNav />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
