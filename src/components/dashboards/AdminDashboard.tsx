import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAdminStore } from '../../store/useStore';

const STATS = [
  { label: 'Total Users', value: '1,250', icon: 'people', color: '#3B82F6' },
  { label: 'Active Workers', value: '342', icon: 'hammer', color: '#10B981' },
  { label: 'Pending Verify', value: '12', icon: 'shield', color: '#F59E0B' },
  { label: "Today's Orders", value: '89', icon: 'receipt', color: '#8B5CF6' },
];

const RECENT_ACTIVITIES = [
  { type: 'verification', message: 'Ganesh Babu submitted ID for verification', time: '5 min ago', icon: 'shield-checkmark', color: '#F59E0B' },
  { type: 'order', message: 'New bulk order worth ₹30,000 placed', time: '12 min ago', icon: 'receipt', color: '#3B82F6' },
  { type: 'agreement', message: 'New agreement signed between Rajesh Const. and Ramu', time: '25 min ago', icon: 'document-text', color: '#10B981' },
  { type: 'user', message: 'New shopkeeper registered: Metro Hardware', time: '1 hour ago', icon: 'person-add', color: '#8B5CF6' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const pendingVerifications = useAdminStore((state) => state.pendingVerifications);

  // Mock pending verifications
  const mockPendingVerifications = [
    {
      id: 'v1',
      workerName: 'Ganesh Babu',
      phone: '9876543304',
      idType: 'Aadhar Card',
      submittedAt: '2 hours ago',
      skills: ['Plumber', 'Welder'],
    },
    {
      id: 'v2',
      workerName: 'Srinivas K',
      phone: '9876543306',
      idType: 'Driving License',
      submittedAt: '5 hours ago',
      skills: ['Mason'],
    },
  ];

  return (
    <View className="flex-1 p-4">
      {/* Admin Header */}
      <View className="bg-gray-800 rounded-2xl p-5 mb-6">
        <View className="flex-row items-center">
          <View className="w-14 h-14 bg-orange-500 rounded-full items-center justify-center">
            <Ionicons name="shield-checkmark" size={28} color="white" />
          </View>
          <View className="ml-4">
            <Text className="text-white text-xl font-bold">Admin Console</Text>
            <Text className="text-gray-400">BuildMart Management</Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="flex-row flex-wrap justify-between mb-6">
        {STATS.map((stat, index) => (
          <TouchableOpacity
            key={index}
            className="w-[48%] bg-gray-800 rounded-xl p-4 mb-3"
            onPress={() => {
              if (stat.label === 'Pending Verify') {
                router.push('/(app)/(tabs)/verifications');
              } else if (stat.label === 'Total Users') {
                router.push('/(app)/(tabs)/users');
              }
            }}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
            </View>
            <Text className="text-white text-2xl font-bold mt-2">{stat.value}</Text>
            <Text className="text-gray-400 text-sm">{stat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View className="flex-row space-x-3 mb-6">
        <TouchableOpacity
          className="flex-1 bg-orange-500 rounded-xl p-4 flex-row items-center justify-center"
          onPress={() => router.push('/(app)/(tabs)/verifications')}
        >
          <Ionicons name="shield-checkmark" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Verify Workers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-gray-800 rounded-xl p-4 flex-row items-center justify-center"
          onPress={() => router.push('/(app)/(tabs)/users')}
        >
          <Ionicons name="people" size={20} color="#F97316" />
          <Text className="text-white font-semibold ml-2">Manage Users</Text>
        </TouchableOpacity>
      </View>

      {/* Pending Verifications */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-lg font-semibold">Pending Verifications</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/verifications')}>
            <Text className="text-orange-500">View All ({mockPendingVerifications.length})</Text>
          </TouchableOpacity>
        </View>

        {mockPendingVerifications.map((verification, index) => (
          <View
            key={index}
            className="bg-gray-800 rounded-xl p-4 mb-3 border-l-4 border-yellow-500"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-gray-700 rounded-full items-center justify-center">
                    <Ionicons name="person" size={20} color="#6B7280" />
                  </View>
                  <View className="ml-3">
                    <Text className="text-white font-medium">{verification.workerName}</Text>
                    <Text className="text-gray-400 text-sm">{verification.phone}</Text>
                  </View>
                </View>

                <View className="flex-row items-center mt-3">
                  <Ionicons name="card" size={16} color="#9CA3AF" />
                  <Text className="text-gray-400 ml-2">{verification.idType}</Text>
                  <Text className="text-gray-500 mx-2">•</Text>
                  <Text className="text-gray-500 text-sm">{verification.submittedAt}</Text>
                </View>

                <View className="flex-row mt-2">
                  {verification.skills.map((skill, idx) => (
                    <View key={idx} className="bg-gray-700 px-2 py-1 rounded mr-2">
                      <Text className="text-gray-300 text-xs">{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-3 mt-4">
              <TouchableOpacity className="flex-1 bg-gray-700 py-3 rounded-lg flex-row items-center justify-center">
                <Ionicons name="eye" size={18} color="#9CA3AF" />
                <Text className="text-gray-300 font-medium ml-2">View ID</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-green-500 py-3 rounded-lg flex-row items-center justify-center">
                <Ionicons name="checkmark" size={18} color="white" />
                <Text className="text-white font-medium ml-2">Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-red-500 py-3 rounded-lg flex-row items-center justify-center">
                <Ionicons name="close" size={18} color="white" />
                <Text className="text-white font-medium ml-2">Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Activity */}
      <View className="mb-6">
        <Text className="text-white text-lg font-semibold mb-3">Recent Activity</Text>
        <View className="bg-gray-800 rounded-xl p-4">
          {RECENT_ACTIVITIES.map((activity, index) => (
            <View
              key={index}
              className={`flex-row items-start py-3 ${
                index !== RECENT_ACTIVITIES.length - 1 ? 'border-b border-gray-700' : ''
              }`}
            >
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: `${activity.color}20` }}
              >
                <Ionicons name={activity.icon as any} size={16} color={activity.color} />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-gray-300 text-sm">{activity.message}</Text>
                <Text className="text-gray-500 text-xs mt-1">{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* System Health */}
      <View className="mb-6">
        <Text className="text-white text-lg font-semibold mb-3">System Overview</Text>
        <View className="flex-row space-x-3">
          <View className="flex-1 bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-400">Orders Today</Text>
              <View className="flex-row items-center">
                <Ionicons name="trending-up" size={16} color="#22C55E" />
                <Text className="text-green-500 ml-1">+15%</Text>
              </View>
            </View>
            <Text className="text-white text-xl font-bold mt-2">89</Text>
            <View className="h-2 bg-gray-700 rounded-full mt-2">
              <View className="h-2 bg-green-500 rounded-full w-3/4" />
            </View>
          </View>
          <View className="flex-1 bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-400">Active Drivers</Text>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-500 rounded-full" />
                <Text className="text-green-500 ml-1">Online</Text>
              </View>
            </View>
            <Text className="text-white text-xl font-bold mt-2">24/30</Text>
            <View className="h-2 bg-gray-700 rounded-full mt-2">
              <View className="h-2 bg-orange-500 rounded-full w-4/5" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
