import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';

// Mock worker data
const MOCK_WORKER = {
  id: 'w1',
  name: 'Ramu Yadav',
  phone: '9876543301',
  email: 'ramu@email.com',
  skills: ['Coolie', 'Helper'],
  experience: 5,
  dailyRate: 600,
  hourlyRate: 100,
  rating: 4.5,
  totalJobs: 120,
  totalEarnings: 72000,
  status: 'waiting',
  isVerified: true,
  bio: 'Experienced in loading and unloading heavy materials. Reliable and punctual worker with 5 years of experience in construction sites.',
  address: 'Madiwala Village, Bangalore',
  joinedAt: 'January 2024',
  completedAgreements: 8,
  reviews: [
    { customer: 'Rajesh Constructions', rating: 5, comment: 'Excellent work, very reliable', date: '2024-02-10' },
    { customer: 'Priya Patel', rating: 4, comment: 'Good helper, on time', date: '2024-02-05' },
    { customer: 'BuildRight Pvt Ltd', rating: 5, comment: 'Hardworking and professional', date: '2024-01-28' },
  ],
};

export default function WorkerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const worker = MOCK_WORKER;

  const isContractor = user?.role === 'contractor';
  const isCustomer = user?.role === 'customer';
  const canHire = (isContractor || isCustomer) && worker.status === 'waiting' && worker.isVerified;

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">Worker Profile</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="px-4 py-6 items-center">
          <View className="w-24 h-24 bg-gray-700 rounded-full items-center justify-center">
            <Ionicons name="person" size={48} color="#6B7280" />
            {worker.isVerified && (
              <View className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2">
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            )}
          </View>
          <Text className="text-white text-2xl font-bold mt-4">{worker.name}</Text>
          <View className={`mt-2 px-4 py-1 rounded-full ${
            worker.status === 'waiting' ? 'bg-green-500/20' : 'bg-orange-500/20'
          }`}>
            <Text className={worker.status === 'waiting' ? 'text-green-500' : 'text-orange-500'}>
              {worker.status === 'waiting' ? 'Available for Work' : 'Currently Working'}
            </Text>
          </View>
        </View>

        {/* Skills */}
        <View className="px-4 pb-4">
          <View className="flex-row flex-wrap justify-center">
            {worker.skills.map((skill, index) => (
              <View key={index} className="bg-orange-500/20 px-4 py-2 rounded-full m-1">
                <Text className="text-orange-500 font-medium">{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row px-4 pb-4">
          <View className="flex-1 bg-gray-800 rounded-xl p-4 mr-2 items-center">
            <View className="flex-row items-center">
              <Ionicons name="star" size={20} color="#F59E0B" />
              <Text className="text-white text-2xl font-bold ml-1">{worker.rating}</Text>
            </View>
            <Text className="text-gray-400 text-sm mt-1">Rating</Text>
          </View>
          <View className="flex-1 bg-gray-800 rounded-xl p-4 mx-1 items-center">
            <Text className="text-white text-2xl font-bold">{worker.totalJobs}</Text>
            <Text className="text-gray-400 text-sm mt-1">Jobs Done</Text>
          </View>
          <View className="flex-1 bg-gray-800 rounded-xl p-4 ml-2 items-center">
            <Text className="text-white text-2xl font-bold">{worker.experience}y</Text>
            <Text className="text-gray-400 text-sm mt-1">Experience</Text>
          </View>
        </View>

        {/* Rates */}
        <View className="px-4 pb-4">
          <View className="bg-orange-500 rounded-xl p-4">
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-orange-100 text-sm">Hourly Rate</Text>
                <Text className="text-white text-2xl font-bold">₹{worker.hourlyRate}</Text>
              </View>
              <View className="w-px bg-white/30" />
              <View className="items-center">
                <Text className="text-orange-100 text-sm">Daily Rate</Text>
                <Text className="text-white text-2xl font-bold">₹{worker.dailyRate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View className="px-4 pb-4">
          <Text className="text-white text-lg font-semibold mb-2">About</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-gray-300 leading-6">{worker.bio}</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View className="px-4 pb-4">
          <Text className="text-white text-lg font-semibold mb-2">Contact</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center mb-3">
              <Ionicons name="call" size={18} color="#9CA3AF" />
              <Text className="text-gray-300 ml-3">{worker.phone}</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <Ionicons name="mail" size={18} color="#9CA3AF" />
              <Text className="text-gray-300 ml-3">{worker.email}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="location" size={18} color="#9CA3AF" />
              <Text className="text-gray-300 ml-3">{worker.address}</Text>
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View className="px-4 pb-8">
          <Text className="text-white text-lg font-semibold mb-2">Reviews</Text>
          {worker.reviews.map((review, index) => (
            <View key={index} className="bg-gray-800 rounded-xl p-4 mb-3">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-white font-medium">{review.customer}</Text>
                <View className="flex-row items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= review.rating ? 'star' : 'star-outline'}
                      size={14}
                      color="#F59E0B"
                    />
                  ))}
                </View>
              </View>
              <Text className="text-gray-400">{review.comment}</Text>
              <Text className="text-gray-500 text-sm mt-2">{review.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {canHire && (
        <View className="px-4 py-4 border-t border-gray-800">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-gray-700 py-4 rounded-xl flex-row items-center justify-center"
              onPress={() => {/* Call worker */}}
            >
              <Ionicons name="call" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-orange-500 py-4 rounded-xl flex-row items-center justify-center"
              onPress={() => router.push(`/(app)/hire?workerId=${worker.id}`)}
            >
              <Ionicons name="calendar" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">
                {isContractor ? 'Create Agreement' : 'Book Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
