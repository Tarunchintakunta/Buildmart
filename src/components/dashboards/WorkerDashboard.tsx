import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useWorkerStore, useWalletStore } from '../../store/useStore';

export default function WorkerDashboard() {
  const router = useRouter();
  const { status, toggleStatus } = useWorkerStore();
  const wallet = useWalletStore((state) => state.wallet);
  const [isAvailable, setIsAvailable] = useState(status === 'waiting');

  const walletBalance = wallet?.balance ?? 12000;
  const totalEarned = wallet?.total_earned ?? 72000;

  const handleToggle = () => {
    setIsAvailable(!isAvailable);
    toggleStatus();
  };

  // Mock worker profile data
  const workerProfile = {
    skills: ['Coolie', 'Helper'],
    rating: 4.5,
    totalJobs: 120,
    isVerified: true,
    dailyRate: 600,
  };

  return (
    <View className="flex-1 p-4">
      {/* Status Toggle Card */}
      <View className="bg-gray-800 rounded-2xl p-5 mb-6">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400 text-sm">Your Status</Text>
            <Text className={`text-2xl font-bold mt-1 ${isAvailable ? 'text-green-500' : 'text-orange-500'}`}>
              {isAvailable ? 'Available for Work' : 'Currently Working'}
            </Text>
          </View>
          <View className="items-center">
            <Switch
              value={isAvailable}
              onValueChange={handleToggle}
              trackColor={{ false: '#F97316', true: '#22C55E' }}
              thumbColor="white"
            />
            <Text className="text-gray-400 text-xs mt-1">
              {isAvailable ? 'Waiting' : 'Working'}
            </Text>
          </View>
        </View>

        {/* Verification Badge */}
        {workerProfile.isVerified ? (
          <View className="flex-row items-center bg-green-500/10 px-3 py-2 rounded-lg mt-4">
            <Ionicons name="shield-checkmark" size={16} color="#22C55E" />
            <Text className="text-green-500 ml-2 text-sm font-medium">Verified Worker</Text>
          </View>
        ) : (
          <TouchableOpacity className="flex-row items-center bg-yellow-500/10 px-3 py-2 rounded-lg mt-4">
            <Ionicons name="warning" size={16} color="#EAB308" />
            <Text className="text-yellow-500 ml-2 text-sm">
              Complete verification to accept jobs
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#EAB308" />
          </TouchableOpacity>
        )}
      </View>

      {/* Earnings Card */}
      <View className="bg-orange-500 rounded-2xl p-5 mb-6">
        <View className="flex-row justify-between">
          <View>
            <Text className="text-orange-100 text-sm">Wallet Balance</Text>
            <Text className="text-white text-3xl font-bold mt-1">
              ₹{walletBalance.toLocaleString()}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-orange-100 text-sm">Total Earned</Text>
            <Text className="text-white text-xl font-bold mt-1">
              ₹{totalEarned.toLocaleString()}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="bg-white/20 rounded-full py-3 mt-4 flex-row items-center justify-center"
          onPress={() => router.push('/(app)/(tabs)/wallet')}
        >
          <Ionicons name="arrow-down" size={18} color="white" />
          <Text className="text-white font-semibold ml-2">Withdraw</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View className="flex-row space-x-3 mb-6">
        <View className="flex-1 bg-gray-800 rounded-xl p-4 items-center">
          <Text className="text-3xl font-bold text-white">{workerProfile.totalJobs}</Text>
          <Text className="text-gray-400 text-sm mt-1">Jobs Done</Text>
        </View>
        <View className="flex-1 bg-gray-800 rounded-xl p-4 items-center">
          <View className="flex-row items-center">
            <Text className="text-3xl font-bold text-white">{workerProfile.rating}</Text>
            <Ionicons name="star" size={20} color="#F59E0B" className="ml-1" />
          </View>
          <Text className="text-gray-400 text-sm mt-1">Rating</Text>
        </View>
        <View className="flex-1 bg-gray-800 rounded-xl p-4 items-center">
          <Text className="text-3xl font-bold text-white">₹{workerProfile.dailyRate}</Text>
          <Text className="text-gray-400 text-sm mt-1">Daily Rate</Text>
        </View>
      </View>

      {/* Skills */}
      <View className="mb-6">
        <Text className="text-white text-lg font-semibold mb-3">Your Skills</Text>
        <View className="flex-row flex-wrap">
          {workerProfile.skills.map((skill, index) => (
            <View
              key={index}
              className="bg-orange-500/20 px-4 py-2 rounded-full mr-2 mb-2"
            >
              <Text className="text-orange-500 font-medium">{skill}</Text>
            </View>
          ))}
          <TouchableOpacity className="bg-gray-800 px-4 py-2 rounded-full flex-row items-center">
            <Ionicons name="add" size={16} color="#9CA3AF" />
            <Text className="text-gray-400 ml-1">Add Skill</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Job Requests */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-lg font-semibold">Job Requests</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/jobs')}>
            <Text className="text-orange-500">View All</Text>
          </TouchableOpacity>
        </View>

        {/* Pending Job Request */}
        <View className="bg-gray-800 rounded-xl p-4 mb-3 border-l-4 border-orange-500">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <View className="flex-row items-center">
                <View className="bg-orange-500/20 px-2 py-1 rounded mr-2">
                  <Text className="text-orange-500 text-xs font-medium">NEW</Text>
                </View>
                <Text className="text-gray-400 text-sm">2 hours work</Text>
              </View>
              <Text className="text-white font-medium mt-2">Unload cement bags</Text>
              <Text className="text-gray-400 text-sm mt-1">Koramangala, 2.3 km away</Text>
              <Text className="text-orange-500 font-semibold mt-2">₹200/hour</Text>
            </View>
            <View className="space-y-2">
              <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-lg">
                <Text className="text-white font-medium">Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-700 px-4 py-2 rounded-lg">
                <Text className="text-gray-300 font-medium">Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Active Agreements */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-lg font-semibold">Active Contracts</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/agreements')}>
            <Text className="text-orange-500">View All</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="bg-gray-800 rounded-xl p-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-white font-medium">Site Labor - Brigade Project</Text>
              <Text className="text-gray-400 text-sm mt-1">Rajesh Constructions</Text>
              <View className="flex-row items-center mt-2">
                <Text className="text-orange-500 font-semibold">₹600/day</Text>
                <Text className="text-gray-500 mx-2">•</Text>
                <Text className="text-gray-400 text-sm">Ends Mar 15</Text>
              </View>
            </View>
            <View className="bg-green-500/20 px-2 py-1 rounded">
              <Text className="text-green-500 text-xs font-medium">Active</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
