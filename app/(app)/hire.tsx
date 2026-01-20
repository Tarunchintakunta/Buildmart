import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useWalletStore } from '../../src/store/useStore';

const DURATION_OPTIONS = [
  { id: 1, label: '1 Hour' },
  { id: 2, label: '2 Hours' },
  { id: 3, label: '3 Hours' },
  { id: 4, label: '4 Hours' },
  { id: 6, label: '6 Hours' },
  { id: 8, label: 'Full Day' },
];

// Mock worker data - in real app would fetch based on workerId
const MOCK_WORKER = {
  id: 'w1',
  name: 'Ramu Yadav',
  skills: ['Coolie', 'Helper'],
  hourlyRate: 100,
  dailyRate: 600,
  rating: 4.5,
  totalJobs: 120,
  isVerified: true,
  distance: '2.3 km',
};

export default function HireScreen() {
  const router = useRouter();
  const { workerId } = useLocalSearchParams();
  const { user } = useAuth();
  const wallet = useWalletStore((state) => state.wallet);

  const [description, setDescription] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const worker = MOCK_WORKER;
  const totalCost = selectedDuration >= 8
    ? worker.dailyRate
    : worker.hourlyRate * selectedDuration;

  const walletBalance = wallet?.balance ?? 25000;
  const hasEnoughBalance = walletBalance >= totalCost;

  const handleHire = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please describe the work to be done');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter the work address');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time');
      return;
    }
    if (!hasEnoughBalance) {
      Alert.alert(
        'Insufficient Balance',
        'You do not have enough balance. Please add funds to continue.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Funds', onPress: () => {} },
        ]
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Request Sent!',
        'Your hiring request has been sent to the worker. You will be notified when they respond.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">Hire Worker</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Worker Info */}
        <View className="px-4 py-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-gray-700 rounded-full items-center justify-center">
                <Ionicons name="person" size={32} color="#6B7280" />
                {worker.isVerified && (
                  <View className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <Ionicons name="checkmark" size={10} color="white" />
                  </View>
                )}
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-white font-semibold text-lg">{worker.name}</Text>
                <View className="flex-row flex-wrap mt-1">
                  {worker.skills.map((skill, index) => (
                    <View key={index} className="bg-gray-700 px-2 py-0.5 rounded mr-2">
                      <Text className="text-gray-300 text-xs">{skill}</Text>
                    </View>
                  ))}
                </View>
                <View className="flex-row items-center mt-2">
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text className="text-white ml-1">{worker.rating}</Text>
                  <Text className="text-gray-500 mx-2">•</Text>
                  <Text className="text-gray-400">{worker.totalJobs} jobs</Text>
                  <Text className="text-gray-500 mx-2">•</Text>
                  <Text className="text-gray-400">{worker.distance}</Text>
                </View>
              </View>
            </View>

            <View className="flex-row justify-around mt-4 pt-4 border-t border-gray-700">
              <View className="items-center">
                <Text className="text-gray-400 text-sm">Hourly Rate</Text>
                <Text className="text-orange-500 font-bold text-lg">₹{worker.hourlyRate}</Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-400 text-sm">Daily Rate</Text>
                <Text className="text-orange-500 font-bold text-lg">₹{worker.dailyRate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Work Description */}
        <View className="px-4 pb-4">
          <Text className="text-white font-semibold mb-2">Work Description *</Text>
          <TextInput
            className="bg-gray-800 text-white rounded-xl px-4 py-3"
            placeholder="Describe what you need help with..."
            placeholderTextColor="#6B7280"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Work Address */}
        <View className="px-4 pb-4">
          <Text className="text-white font-semibold mb-2">Work Address *</Text>
          <TextInput
            className="bg-gray-800 text-white rounded-xl px-4 py-3"
            placeholder="Enter the address where work will be done"
            placeholderTextColor="#6B7280"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        {/* Date & Time */}
        <View className="px-4 pb-4">
          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Text className="text-white font-semibold mb-2">Date *</Text>
              <TextInput
                className="bg-gray-800 text-white rounded-xl px-4 py-3"
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#6B7280"
                value={selectedDate}
                onChangeText={setSelectedDate}
              />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold mb-2">Time *</Text>
              <TextInput
                className="bg-gray-800 text-white rounded-xl px-4 py-3"
                placeholder="HH:MM"
                placeholderTextColor="#6B7280"
                value={selectedTime}
                onChangeText={setSelectedTime}
              />
            </View>
          </View>
        </View>

        {/* Duration */}
        <View className="px-4 pb-4">
          <Text className="text-white font-semibold mb-2">Duration</Text>
          <View className="flex-row flex-wrap">
            {DURATION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                  selectedDuration === option.id ? 'bg-orange-500' : 'bg-gray-800'
                }`}
                onPress={() => setSelectedDuration(option.id)}
              >
                <Text
                  className={`font-medium ${
                    selectedDuration === option.id ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cost Summary */}
        <View className="px-4 pb-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-white font-semibold text-lg mb-3">Cost Summary</Text>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">
                {selectedDuration >= 8 ? 'Daily Rate' : `Hourly Rate x ${selectedDuration}`}
              </Text>
              <Text className="text-white">
                {selectedDuration >= 8
                  ? `₹${worker.dailyRate}`
                  : `₹${worker.hourlyRate} x ${selectedDuration}`}
              </Text>
            </View>

            <View className="flex-row justify-between pt-3 border-t border-gray-700">
              <Text className="text-white font-semibold">Total</Text>
              <Text className="text-orange-500 font-bold text-xl">
                ₹{totalCost.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Wallet Balance */}
        <View className="px-4 pb-6">
          <View
            className={`rounded-xl p-4 flex-row items-center justify-between ${
              hasEnoughBalance
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="wallet"
                size={24}
                color={hasEnoughBalance ? '#22C55E' : '#EF4444'}
              />
              <View className="ml-3">
                <Text className={hasEnoughBalance ? 'text-green-500' : 'text-red-500'}>
                  Wallet Balance
                </Text>
                <Text className="text-white font-bold text-lg">
                  ₹{walletBalance.toLocaleString()}
                </Text>
              </View>
            </View>
            {!hasEnoughBalance && (
              <TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-full">
                <Text className="text-white font-medium">Add Funds</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Info Note */}
        <View className="px-4 pb-8">
          <View className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text className="text-gray-400 text-sm ml-3 flex-1">
                Payment will be held in escrow until the work is completed to your
                satisfaction. You can cancel up to 30 minutes before the scheduled time.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="px-4 py-4 border-t border-gray-800">
        <TouchableOpacity
          className={`py-4 rounded-xl flex-row items-center justify-center ${
            hasEnoughBalance && !isSubmitting ? 'bg-orange-500' : 'bg-gray-600'
          }`}
          onPress={handleHire}
          disabled={!hasEnoughBalance || isSubmitting}
        >
          {isSubmitting ? (
            <Text className="text-white font-semibold text-lg">Sending Request...</Text>
          ) : (
            <>
              <Ionicons name="paper-plane" size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                Send Hiring Request • ₹{totalCost.toLocaleString()}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
