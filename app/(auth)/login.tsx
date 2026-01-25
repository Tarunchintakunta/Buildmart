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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (phoneNumber: string) => {
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
      {/* Decorative Background Elements */}
      <View className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
      <View className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 py-8">
            {/* Logo/Header Section */}
            <View className="items-center mb-12 mt-8">
              <View 
                className="w-24 h-24 rounded-3xl items-center justify-center mb-6"
                style={{
                  backgroundColor: '#F97316',
                  shadowColor: '#F97316',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Ionicons name="construct" size={48} color="white" />
              </View>
              <Text className="text-4xl font-bold text-white mb-2">BuildMart</Text>
              <Text className="text-gray-400 text-center text-base max-w-xs leading-5">
                Construction Materials & Labor Marketplace
              </Text>
            </View>

            {/* Welcome Section */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-white mb-2">Welcome back</Text>
              <Text className="text-gray-400 text-base leading-6">
                Enter your phone number to continue
              </Text>
            </View>

            {/* Phone Input Card */}
            <View className="mb-6">
              <Text className="text-gray-300 mb-3 text-sm font-medium">Phone Number</Text>
              <View 
                className="flex-row items-center rounded-2xl px-5 py-4"
                style={{
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  borderWidth: 1,
                  borderColor: 'rgba(55, 65, 81, 0.5)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <View className="flex-row items-center mr-3">
                  <Text className="text-white text-lg font-semibold">+91</Text>
                  <View className="w-px h-6 bg-gray-600 ml-3" />
                </View>
                <TextInput
                  className="flex-1 text-white text-lg font-medium"
                  placeholder="Enter phone number"
                  placeholderTextColor="#6B7280"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={10}
                  autoFocus={false}
                />
                {phone.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setPhone('')}
                    className="ml-2"
                  >
                    <Ionicons name="close-circle" size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="py-4 rounded-2xl mb-6"
              onPress={handleLogin}
              disabled={phone.length < 10 || isLoading}
              style={{
                backgroundColor: phone.length >= 10 ? '#F97316' : 'rgba(55, 65, 81, 0.5)',
                opacity: phone.length >= 10 && !isLoading ? 1 : 0.6,
                shadowColor: phone.length >= 10 ? '#F97316' : '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: phone.length >= 10 ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              {isLoading ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white text-center font-semibold text-lg ml-2">
                    Signing in...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Continue
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-700" />
              <Text className="text-gray-500 text-xs mx-4 font-medium">OR</Text>
              <View className="flex-1 h-px bg-gray-700" />
            </View>

            {/* Quick Login Section */}
            <View className="mt-2">
              <Text className="text-gray-400 text-center mb-5 text-sm font-medium">
                Quick Login (Demo)
              </Text>
              <View className="space-y-2.5">
                <QuickLoginButton
                  label="Customer"
                  phone="9876543101"
                  icon="person"
                  color="#3B82F6"
                  onPress={() => quickLogin('9876543101')}
                />
                <QuickLoginButton
                  label="Contractor"
                  phone="9876543201"
                  icon="business"
                  color="#8B5CF6"
                  onPress={() => quickLogin('9876543201')}
                />
                <QuickLoginButton
                  label="Worker"
                  phone="9876543301"
                  icon="hammer"
                  color="#F59E0B"
                  onPress={() => quickLogin('9876543301')}
                />
                <QuickLoginButton
                  label="Shopkeeper"
                  phone="9876543401"
                  icon="storefront"
                  color="#10B981"
                  onPress={() => quickLogin('9876543401')}
                />
                <QuickLoginButton
                  label="Driver"
                  phone="9876543501"
                  icon="car"
                  color="#EF4444"
                  onPress={() => quickLogin('9876543501')}
                />
                <QuickLoginButton
                  label="Admin"
                  phone="9876543601"
                  icon="shield-checkmark"
                  color="#6366F1"
                  onPress={() => quickLogin('9876543601')}
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
  color,
  onPress,
}: {
  label: string;
  phone: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}) {
  // Convert hex color to rgba for background
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <TouchableOpacity
      className="flex-row items-center p-4 rounded-2xl"
      onPress={onPress}
      style={{
        backgroundColor: 'rgba(31, 41, 55, 0.6)',
        borderWidth: 1,
        borderColor: 'rgba(55, 65, 81, 0.3)',
        shadowColor: color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View 
        className="w-12 h-12 rounded-xl items-center justify-center"
        style={{ backgroundColor: hexToRgba(color, 0.2) }}
      >
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-white font-semibold text-base mb-0.5">{label}</Text>
        <Text className="text-gray-400 text-sm">{phone}</Text>
      </View>
      <View 
        className="w-8 h-8 rounded-full items-center justify-center"
        style={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
      >
        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}
