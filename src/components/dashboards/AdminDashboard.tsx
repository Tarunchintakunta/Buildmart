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
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Admin Header */}
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
          <View className="flex-row items-center">
            <View 
              className="w-16 h-16 rounded-2xl items-center justify-center"
              style={{ backgroundColor: '#F97316' }}
            >
              <Ionicons name="shield-checkmark" size={32} color="white" />
            </View>
            <View className="ml-4">
              <Text className="text-white text-2xl font-bold">Admin Console</Text>
              <Text className="text-gray-400 font-medium">BuildMart Management</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between mb-6">
          {STATS.map((stat, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] rounded-2xl p-5 mb-3"
              style={{
                backgroundColor: '#1F2937',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
              onPress={() => {
                if (stat.label === 'Pending Verify') {
                  router.push('/(app)/(tabs)/verifications');
                } else if (stat.label === 'Total Users') {
                  router.push('/(app)/(tabs)/users');
                }
              }}
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text className="text-white text-3xl font-bold mb-1">{stat.value}</Text>
              <Text className="text-gray-400 text-sm font-medium">{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="flex-row space-x-3 mb-6">
          <TouchableOpacity
            className="flex-1 rounded-2xl p-4 flex-row items-center justify-center"
            style={{
              backgroundColor: '#F97316',
              shadowColor: '#F97316',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={() => router.push('/(app)/(tabs)/verifications')}
          >
            <Ionicons name="shield-checkmark" size={22} color="white" />
            <Text className="text-white font-bold ml-2">Verify Workers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 rounded-2xl p-4 flex-row items-center justify-center"
            style={{
              backgroundColor: '#1F2937',
              borderWidth: 1,
              borderColor: '#374151',
            }}
            onPress={() => router.push('/(app)/(tabs)/users')}
          >
            <Ionicons name="people" size={22} color="#F97316" />
            <Text className="text-white font-bold ml-2">Manage Users</Text>
          </TouchableOpacity>
        </View>

        {/* Pending Verifications */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Pending Verifications</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/verifications')}>
              <Text className="text-orange-500 font-semibold">
                View All ({mockPendingVerifications.length})
              </Text>
            </TouchableOpacity>
          </View>

          {mockPendingVerifications.map((verification, index) => (
            <View
              key={index}
              className="rounded-2xl p-5 mb-4"
              style={{
                backgroundColor: '#1F2937',
                borderLeftWidth: 4,
                borderLeftColor: '#F59E0B',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1">
                  <View className="flex-row items-center mb-3">
                    <View 
                      className="w-12 h-12 rounded-xl items-center justify-center"
                      style={{ backgroundColor: '#374151' }}
                    >
                      <Ionicons name="person" size={24} color="#6B7280" />
                    </View>
                    <View className="ml-4">
                      <Text className="text-white font-bold text-base">{verification.workerName}</Text>
                      <Text className="text-gray-400 text-sm font-medium">{verification.phone}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mb-3">
                    <Ionicons name="card" size={18} color="#9CA3AF" />
                    <Text className="text-gray-400 ml-2 font-medium">{verification.idType}</Text>
                    <Text className="text-gray-500 mx-2">•</Text>
                    <Text className="text-gray-500 text-sm font-medium">{verification.submittedAt}</Text>
                  </View>

                  <View className="flex-row">
                    {verification.skills.map((skill, idx) => (
                      <View 
                        key={idx} 
                        className="px-3 py-1 rounded-xl mr-2"
                        style={{ backgroundColor: '#374151' }}
                      >
                        <Text className="text-gray-300 text-xs font-semibold">{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row space-x-3 mt-4">
                <TouchableOpacity 
                  className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                  style={{ backgroundColor: '#374151' }}
                >
                  <Ionicons name="eye" size={20} color="#9CA3AF" />
                  <Text className="text-gray-300 font-bold ml-2">View ID</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                  style={{ backgroundColor: '#10B981' }}
                >
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text className="text-white font-bold ml-2">Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                  style={{ backgroundColor: '#EF4444' }}
                >
                  <Ionicons name="close" size={20} color="white" />
                  <Text className="text-white font-bold ml-2">Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-4">Recent Activity</Text>
          <View 
            className="rounded-2xl p-5"
            style={{
              backgroundColor: '#1F2937',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {RECENT_ACTIVITIES.map((activity, index) => (
              <View
                key={index}
                className="flex-row items-start py-4"
                style={{
                  borderBottomWidth: index !== RECENT_ACTIVITIES.length - 1 ? 1 : 0,
                  borderBottomColor: '#374151',
                }}
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: `${activity.color}20` }}
                >
                  <Ionicons name={activity.icon as any} size={20} color={activity.color} />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-gray-300 text-sm font-medium">{activity.message}</Text>
                  <Text className="text-gray-500 text-xs mt-1 font-medium">{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* System Health */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-4">System Overview</Text>
          <View className="flex-row space-x-3">
            <View 
              className="flex-1 rounded-2xl p-5"
              style={{
                backgroundColor: '#1F2937',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-gray-400 font-medium">Orders Today</Text>
                <View className="flex-row items-center">
                  <Ionicons name="trending-up" size={18} color="#10B981" />
                  <Text className="text-green-500 ml-1 font-bold">+15%</Text>
                </View>
              </View>
              <Text className="text-white text-3xl font-bold mb-3">89</Text>
              <View 
                className="h-2 rounded-full"
                style={{ backgroundColor: '#374151' }}
              >
                <View 
                  className="h-2 rounded-full"
                  style={{ backgroundColor: '#10B981', width: '75%' }}
                />
              </View>
            </View>
            <View 
              className="flex-1 rounded-2xl p-5"
              style={{
                backgroundColor: '#1F2937',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-gray-400 font-medium">Active Drivers</Text>
                <View className="flex-row items-center">
                  <View 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#10B981' }}
                  />
                  <Text className="text-green-500 ml-1 font-bold">Online</Text>
                </View>
              </View>
              <Text className="text-white text-3xl font-bold mb-3">24/30</Text>
              <View 
                className="h-2 rounded-full"
                style={{ backgroundColor: '#374151' }}
              >
                <View 
                  className="h-2 rounded-full"
                  style={{ backgroundColor: '#F97316', width: '80%' }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
