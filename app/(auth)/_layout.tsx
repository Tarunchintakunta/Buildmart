import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F5F6FA' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ animation: 'none' }} />
      <Stack.Screen name="role-select" options={{ animation: 'fade' }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="profile-setup" />
    </Stack>
  );
}
