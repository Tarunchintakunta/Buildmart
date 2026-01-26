import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
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
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Status Toggle Card */}
        <View 
          className="rounded-2xl p-6 mb-6"
          style={{
            backgroundColor: '#1F2937',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1">
              <Text className="text-gray-400 text-sm font-medium mb-1">Your Status</Text>
              <Text 
                className="text-2xl font-bold"
                style={{ color: isAvailable ? '#10B981' : '#F97316' }}
              >
                {isAvailable ? 'Available for Work' : 'Currently Working'}
              </Text>
            </View>
            <View className="items-center">
              <Switch
                value={isAvailable}
                onValueChange={handleToggle}
                trackColor={{ false: '#F97316', true: '#10B981' }}
                thumbColor="white"
              />
              <Text className="text-gray-400 text-xs mt-2 font-medium">
                {isAvailable ? 'Waiting' : 'Working'}
              </Text>
            </View>
          </View>

          {/* Verification Badge */}
          {workerProfile.isVerified ? (
            <View 
              className="flex-row items-center px-4 py-3 rounded-xl"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
            >
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text className="text-green-500 ml-2 font-bold">Verified Worker</Text>
            </View>
          ) : (
            <TouchableOpacity 
              className="flex-row items-center px-4 py-3 rounded-xl"
              style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)' }}
              onPress={() => router.push('/(app)/(tabs)/verifications')}
            >
              <Ionicons name="warning" size={20} color="#F59E0B" />
              <Text className="text-yellow-500 ml-2 font-semibold flex-1">
                Complete verification to accept jobs
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#F59E0B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Earnings Card */}
        <View 
          className="rounded-2xl p-6 mb-6"
          style={{
            backgroundColor: '#F97316',
            shadowColor: '#F97316',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="flex-row justify-between mb-4">
            <View className="flex-1">
              <Text className="text-orange-100 text-sm font-medium mb-1">Wallet Balance</Text>
              <Text className="text-white text-4xl font-bold">
                ₹{walletBalance.toLocaleString()}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-orange-100 text-sm font-medium mb-1">Total Earned</Text>
              <Text className="text-white text-2xl font-bold">
                ₹{totalEarned.toLocaleString()}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="rounded-xl py-4 mt-4 flex-row items-center justify-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            onPress={() => router.push('/(app)/(tabs)/wallet')}
          >
            <Ionicons name="arrow-down" size={20} color="white" />
            <Text className="text-white font-bold ml-2">Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View className="flex-row space-x-3 mb-6">
          <View 
            className="flex-1 rounded-2xl p-5 items-center"
            style={{
              backgroundColor: '#1F2937',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-4xl font-bold text-white mb-2">{workerProfile.totalJobs}</Text>
            <Text className="text-gray-400 text-sm font-medium">Jobs Done</Text>
          </View>
          <View 
            className="flex-1 rounded-2xl p-5 items-center"
            style={{
              backgroundColor: '#1F2937',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center mb-2">
              <Text className="text-4xl font-bold text-white">{workerProfile.rating}</Text>
              <Ionicons name="star" size={24} color="#F59E0B" style={{ marginLeft: 4 }} />
            </View>
            <Text className="text-gray-400 text-sm font-medium">Rating</Text>
          </View>
          <View 
            className="flex-1 rounded-2xl p-5 items-center"
            style={{
              backgroundColor: '#1F2937',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-4xl font-bold text-white mb-2">₹{workerProfile.dailyRate}</Text>
            <Text className="text-gray-400 text-sm font-medium">Daily Rate</Text>
          </View>
        </View>

        {/* Skills */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-4">Your Skills</Text>
          <View className="flex-row flex-wrap">
            {workerProfile.skills.map((skill, index) => (
              <View
                key={index}
                className="px-4 py-2 rounded-xl mr-2 mb-2"
                style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)' }}
              >
                <Text className="text-orange-500 font-bold">{skill}</Text>
              </View>
            ))}
            <TouchableOpacity 
              className="px-4 py-2 rounded-xl flex-row items-center"
              style={{
                backgroundColor: '#1F2937',
                borderWidth: 1,
                borderColor: '#374151',
              }}
            >
              <Ionicons name="add" size={18} color="#9CA3AF" />
              <Text className="text-gray-400 ml-1 font-medium">Add Skill</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Job Requests */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Job Requests</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/jobs')}>
              <Text className="text-orange-500 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          {/* Pending Job Request */}
          <View 
            className="rounded-2xl p-5 mb-3"
            style={{
              backgroundColor: '#1F2937',
              borderLeftWidth: 4,
              borderLeftColor: '#F97316',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="flex-row items-center mb-3">
                  <View 
                    className="px-3 py-1 rounded-xl mr-2"
                    style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)' }}
                  >
                    <Text className="text-orange-500 text-xs font-bold">NEW</Text>
                  </View>
                  <Text className="text-gray-400 text-sm font-medium">2 hours work</Text>
                </View>
                <Text className="text-white font-bold text-base mb-2">Unload cement bags</Text>
                <Text className="text-gray-400 text-sm mb-2">Koramangala, 2.3 km away</Text>
                <Text className="text-orange-500 font-bold text-lg">₹200/hour</Text>
              </View>
              <View className="space-y-2 ml-4">
                <TouchableOpacity 
                  className="px-5 py-3 rounded-xl"
                  style={{ backgroundColor: '#10B981' }}
                >
                  <Text className="text-white font-bold">Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="px-5 py-3 rounded-xl"
                  style={{ backgroundColor: '#374151' }}
                >
                  <Text className="text-gray-300 font-bold">Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Active Agreements */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Active Contracts</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/agreements')}>
              <Text className="text-orange-500 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            className="rounded-2xl p-5"
            style={{
              backgroundColor: '#1F2937',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={() => router.push('/(app)/(tabs)/agreements')}
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-white font-bold text-base mb-1">Site Labor - Brigade Project</Text>
                <Text className="text-gray-400 text-sm mb-2">Rajesh Constructions</Text>
                <View className="flex-row items-center">
                  <Text className="text-orange-500 font-bold">₹600/day</Text>
                  <Text className="text-gray-500 mx-2">•</Text>
                  <Text className="text-gray-400 text-sm">Ends Mar 15</Text>
                </View>
              </View>
              <View 
                className="px-3 py-2 rounded-xl"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
              >
                <Text className="text-green-500 text-xs font-bold">Active</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
