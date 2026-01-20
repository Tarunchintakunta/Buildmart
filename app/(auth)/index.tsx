import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 px-6 justify-between py-8">
        {/* Header */}
        <View className="items-center mt-12">
          <View className="w-20 h-20 bg-orange-500 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="construct" size={40} color="white" />
          </View>
          <Text className="text-4xl font-bold text-white">BuildMart</Text>
          <Text className="text-gray-400 text-center mt-2 text-lg">
            Construction Materials & Labor Marketplace
          </Text>
        </View>

        {/* Features */}
        <View className="space-y-4">
          <FeatureItem
            icon="cube-outline"
            title="Heavy Materials"
            description="Cement, doors, steel - delivered in 30-60 mins"
          />
          <FeatureItem
            icon="people-outline"
            title="Hire Workers"
            description="Skilled labor for short-term or long-term projects"
          />
          <FeatureItem
            icon="document-text-outline"
            title="Digital Agreements"
            description="Create contracts with workers instantly"
          />
          <FeatureItem
            icon="wallet-outline"
            title="Secure Payments"
            description="Escrow-based payments for peace of mind"
          />
        </View>

        {/* Login Button */}
        <View className="space-y-4">
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity className="bg-orange-500 py-4 rounded-xl">
              <Text className="text-white text-center font-semibold text-lg">
                Get Started
              </Text>
            </TouchableOpacity>
          </Link>

          <Text className="text-gray-500 text-center text-sm">
            By continuing, you agree to our Terms of Service
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row items-center space-x-4 bg-gray-800/50 p-4 rounded-xl">
      <View className="w-12 h-12 bg-orange-500/20 rounded-full items-center justify-center">
        <Ionicons name={icon} size={24} color="#F97316" />
      </View>
      <View className="flex-1">
        <Text className="text-white font-semibold text-base">{title}</Text>
        <Text className="text-gray-400 text-sm">{description}</Text>
      </View>
    </View>
  );
}
