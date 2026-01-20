import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const JOB_TABS = ['Requests', 'Active', 'Completed'];

const MOCK_JOBS = [
  {
    id: 'j1',
    requestNumber: 'LBR-2024-0001',
    customer: 'Rahul Sharma',
    description: 'Need help unloading cement bags from truck',
    address: '123 MG Road, Koramangala',
    distance: '2.3 km',
    date: '2024-02-15',
    time: '09:00',
    duration: 2,
    rate: 200,
    skill: 'Coolie',
    status: 'pending',
  },
  {
    id: 'j2',
    requestNumber: 'LBR-2024-0002',
    customer: 'Priya Patel',
    description: 'Install ceiling fan and fix wiring issue',
    address: '45 Park Street',
    distance: '3.1 km',
    date: '2024-02-16',
    time: '10:00',
    duration: 3,
    rate: 450,
    skill: 'Electrician',
    status: 'accepted',
  },
  {
    id: 'j3',
    requestNumber: 'LBR-2024-0003',
    customer: 'Amit Kumar',
    description: 'Paint two bedrooms, prep work included',
    address: '78 Brigade Road',
    distance: '4.5 km',
    date: '2024-02-17',
    time: '08:00',
    duration: 8,
    rate: 120,
    skill: 'Painter',
    status: 'in_progress',
  },
  {
    id: 'j4',
    requestNumber: 'LBR-2024-0004',
    customer: 'Sneha Reddy',
    description: 'Help with furniture moving',
    address: '22 Indiranagar',
    distance: '1.8 km',
    date: '2024-02-10',
    time: '14:00',
    duration: 3,
    rate: 150,
    skill: 'Helper',
    status: 'completed',
    rating: 5,
  },
  {
    id: 'j5',
    requestNumber: 'LBR-2024-0005',
    customer: 'Vikram Singh',
    description: 'Fix bathroom plumbing leak',
    address: '90 Whitefield',
    distance: '8.2 km',
    date: '2024-02-08',
    time: '11:00',
    duration: 2,
    rate: 300,
    skill: 'Plumber',
    status: 'completed',
    rating: 4,
  },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'pending':
      return { bg: 'bg-orange-500/20', text: 'text-orange-500', label: 'New Request' };
    case 'accepted':
      return { bg: 'bg-blue-500/20', text: 'text-blue-500', label: 'Accepted' };
    case 'in_progress':
      return { bg: 'bg-purple-500/20', text: 'text-purple-500', label: 'In Progress' };
    case 'completed':
      return { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Completed' };
    case 'cancelled':
      return { bg: 'bg-red-500/20', text: 'text-red-500', label: 'Cancelled' };
    default:
      return { bg: 'bg-gray-500/20', text: 'text-gray-500', label: status };
  }
};

export default function JobsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('Requests');

  const filteredJobs = MOCK_JOBS.filter((job) => {
    if (selectedTab === 'Requests') return job.status === 'pending';
    if (selectedTab === 'Active') return ['accepted', 'in_progress'].includes(job.status);
    if (selectedTab === 'Completed') return ['completed', 'cancelled'].includes(job.status);
    return true;
  });

  const pendingCount = MOCK_JOBS.filter((j) => j.status === 'pending').length;

  const renderJob = ({ item: job }: { item: typeof MOCK_JOBS[0] }) => {
    const statusStyle = getStatusStyle(job.status);
    const isPending = job.status === 'pending';
    const isActive = ['accepted', 'in_progress'].includes(job.status);

    return (
      <View className={`bg-gray-800 rounded-xl p-4 mb-3 ${isPending ? 'border-l-4 border-orange-500' : ''}`}>
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <View className="flex-row items-center">
              {isPending && (
                <View className="bg-orange-500 px-2 py-0.5 rounded mr-2">
                  <Text className="text-white text-xs font-bold">NEW</Text>
                </View>
              )}
              <Text className="text-gray-400 text-sm">{job.requestNumber}</Text>
            </View>
            <Text className="text-white font-semibold text-lg mt-1">{job.description}</Text>
          </View>
          <View className={`px-2 py-1 rounded ${statusStyle.bg}`}>
            <Text className={`text-xs font-medium ${statusStyle.text}`}>
              {statusStyle.label}
            </Text>
          </View>
        </View>

        {/* Customer & Skill */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="person" size={16} color="#9CA3AF" />
          <Text className="text-gray-300 ml-2">{job.customer}</Text>
          <View className="bg-gray-700 px-2 py-0.5 rounded ml-3">
            <Text className="text-gray-300 text-xs">{job.skill}</Text>
          </View>
        </View>

        {/* Location */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="location" size={16} color="#9CA3AF" />
          <Text className="text-gray-400 ml-2 flex-1" numberOfLines={1}>
            {job.address}
          </Text>
          <Text className="text-orange-500">{job.distance}</Text>
        </View>

        {/* Date & Time */}
        <View className="flex-row items-center mb-3">
          <Ionicons name="calendar" size={16} color="#9CA3AF" />
          <Text className="text-gray-400 ml-2">
            {job.date} at {job.time}
          </Text>
          <Text className="text-gray-500 mx-2">•</Text>
          <Ionicons name="time" size={16} color="#9CA3AF" />
          <Text className="text-gray-400 ml-1">{job.duration} hours</Text>
        </View>

        {/* Rate */}
        <View className="flex-row items-center justify-between py-3 border-t border-gray-700">
          <View>
            <Text className="text-gray-500 text-xs">Rate</Text>
            <Text className="text-orange-500 font-bold text-lg">₹{job.rate}/hour</Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-500 text-xs">Total Earning</Text>
            <Text className="text-white font-bold text-lg">
              ₹{(job.rate * job.duration).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Rating for completed jobs */}
        {job.status === 'completed' && job.rating && (
          <View className="flex-row items-center pt-3 border-t border-gray-700">
            <Text className="text-gray-400">Customer Rating:</Text>
            <View className="flex-row items-center ml-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= job.rating! ? 'star' : 'star-outline'}
                  size={18}
                  color="#F59E0B"
                />
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        {isPending && (
          <View className="flex-row space-x-3 mt-3 pt-3 border-t border-gray-700">
            <TouchableOpacity className="flex-1 bg-green-500 py-3 rounded-lg flex-row items-center justify-center">
              <Ionicons name="checkmark-circle" size={18} color="white" />
              <Text className="text-white font-semibold ml-2">Accept Job</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-gray-700 py-3 rounded-lg flex-row items-center justify-center">
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              <Text className="text-gray-300 font-semibold ml-2">Decline</Text>
            </TouchableOpacity>
          </View>
        )}

        {isActive && (
          <View className="flex-row space-x-3 mt-3 pt-3 border-t border-gray-700">
            <TouchableOpacity className="flex-1 bg-blue-500 py-3 rounded-lg flex-row items-center justify-center">
              <Ionicons name="navigate" size={18} color="white" />
              <Text className="text-white font-semibold ml-2">Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-green-500 py-3 rounded-lg flex-row items-center justify-center">
              <Ionicons name="checkmark-done-circle" size={18} color="white" />
              <Text className="text-white font-semibold ml-2">
                {job.status === 'accepted' ? 'Start Work' : 'Complete'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-800">
        <Text className="text-white text-2xl font-bold">Jobs</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 py-3 border-b border-gray-800">
        {JOB_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 py-2 rounded-lg mr-2 flex-row items-center justify-center ${
              selectedTab === tab ? 'bg-orange-500' : 'bg-gray-800'
            }`}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              className={`font-medium ${
                selectedTab === tab ? 'text-white' : 'text-gray-400'
              }`}
            >
              {tab}
            </Text>
            {tab === 'Requests' && pendingCount > 0 && (
              <View className={`ml-2 w-5 h-5 rounded-full items-center justify-center ${
                selectedTab === tab ? 'bg-white' : 'bg-orange-500'
              }`}>
                <Text className={`text-xs font-bold ${
                  selectedTab === tab ? 'text-orange-500' : 'text-white'
                }`}>
                  {pendingCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Jobs List */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Ionicons name="briefcase" size={48} color="#6B7280" />
            <Text className="text-gray-400 mt-4">
              {selectedTab === 'Requests'
                ? 'No new job requests'
                : selectedTab === 'Active'
                ? 'No active jobs'
                : 'No completed jobs yet'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
