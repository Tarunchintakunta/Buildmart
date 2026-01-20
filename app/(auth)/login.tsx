import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(phone);
      if (!result.success) {
        Alert.alert('Login Failed', result.error || 'Unknown error');
      }
      // Navigation handled by RootLayout auth state
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (phoneNumber: string, role: string) => {
    setPhone(phoneNumber);
    setIsLoading(true);
    try {
      const result = await login(phoneNumber);
      if (!result.success) {
        Alert.alert('Login Failed', result.error || 'Unknown error');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-6 py-8">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>

            {/* Header */}
            <View className="mt-8 mb-8">
              <Text className="text-3xl font-bold text-white">Welcome back</Text>
              <Text className="text-gray-400 mt-2 text-base">
                Enter your phone number to continue
              </Text>
            </View>

            {/* Phone Input */}
            <View className="mb-6">
              <Text className="text-gray-400 mb-2 text-sm">Phone Number</Text>
              <View className="flex-row items-center bg-gray-800 rounded-xl px-4">
                <Text className="text-white text-lg mr-2">+91</Text>
                <View className="w-px h-6 bg-gray-600 mr-3" />
                <TextInput
                  className="flex-1 text-white text-lg py-4"
                  placeholder="Enter phone number"
                  placeholderTextColor="#6B7280"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={10}
                />
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className={`py-4 rounded-xl mb-8 ${
                phone.length >= 10 ? 'bg-orange-500' : 'bg-gray-700'
              }`}
              onPress={handleLogin}
              disabled={phone.length < 10 || isLoading}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {isLoading ? 'Signing in...' : 'Continue'}
              </Text>
            </TouchableOpacity>

            {/* Quick Login Section */}
            <View className="mt-4">
              <Text className="text-gray-500 text-center mb-4 text-sm">
                Quick Login (Demo)
              </Text>
              <View className="space-y-3">
                <QuickLoginButton
                  label="Customer"
                  phone="9876543101"
                  icon="person"
                  onPress={() => quickLogin('9876543101', 'customer')}
                />
                <QuickLoginButton
                  label="Contractor"
                  phone="9876543201"
                  icon="business"
                  onPress={() => quickLogin('9876543201', 'contractor')}
                />
                <QuickLoginButton
                  label="Worker"
                  phone="9876543301"
                  icon="hammer"
                  onPress={() => quickLogin('9876543301', 'worker')}
                />
                <QuickLoginButton
                  label="Shopkeeper"
                  phone="9876543401"
                  icon="storefront"
                  onPress={() => quickLogin('9876543401', 'shopkeeper')}
                />
                <QuickLoginButton
                  label="Driver"
                  phone="9876543501"
                  icon="car"
                  onPress={() => quickLogin('9876543501', 'driver')}
                />
                <QuickLoginButton
                  label="Admin"
                  phone="9876543601"
                  icon="shield-checkmark"
                  onPress={() => quickLogin('9876543601', 'admin')}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function QuickLoginButton({
  label,
  phone,
  icon,
  onPress,
}: {
  label: string;
  phone: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="flex-row items-center bg-gray-800 p-3 rounded-xl"
      onPress={onPress}
    >
      <View className="w-10 h-10 bg-orange-500/20 rounded-full items-center justify-center">
        <Ionicons name={icon} size={20} color="#F97316" />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-white font-medium">{label}</Text>
        <Text className="text-gray-500 text-sm">{phone}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
    </TouchableOpacity>
  );
}
