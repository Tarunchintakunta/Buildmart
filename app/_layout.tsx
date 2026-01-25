import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import '../global.css';

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        )}
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
