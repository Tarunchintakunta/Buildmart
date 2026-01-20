import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';

// Mock agreement data
const MOCK_AGREEMENT = {
  id: 'a1',
  agreementNumber: 'AGR-2024-001',
  title: 'Site Labor for Brigade Project',
  status: 'active',
  contractor: {
    id: 'c1',
    name: 'Rajesh Constructions',
    phone: '9876543201',
  },
  worker: {
    id: 'w1',
    name: 'Ramu Yadav',
    phone: '9876543301',
    skills: ['Coolie', 'Helper'],
  },
  scopeOfWork: 'Loading, unloading, and general site assistance for residential construction. Worker will help with material handling, site cleanup, and support skilled workers as needed.',
  startDate: '2024-01-15',
  endDate: '2024-03-15',
  rateType: 'daily',
  rateAmount: 600,
  workingHoursPerDay: 8,
  workLocation: 'Brigade Road Construction Site, Bangalore',
  terminationNoticeDays: 7,
  terminationTerms: 'Either party may terminate with 7 days written notice. In case of misconduct, immediate termination without notice.',
  additionalTerms: 'Worker must report at 8 AM sharp. Safety gear will be provided. One meal per day included.',
  totalValue: 36000,
  paidAmount: 12000,
  escrowBalance: 6000,
  contractorSignedAt: '2024-01-14 10:30 AM',
  workerSignedAt: '2024-01-14 02:15 PM',
  createdAt: '2024-01-14 10:00 AM',
};

const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Draft', color: '#6B7280', bg: 'bg-gray-500/20' },
    pending_signature: { label: 'Pending Signature', color: '#EAB308', bg: 'bg-yellow-500/20' },
    active: { label: 'Active', color: '#22C55E', bg: 'bg-green-500/20' },
    completed: { label: 'Completed', color: '#3B82F6', bg: 'bg-blue-500/20' },
    terminated: { label: 'Terminated', color: '#EF4444', bg: 'bg-red-500/20' },
  };
  return statusMap[status] || statusMap.draft;
};

export default function AgreementDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const agreement = MOCK_AGREEMENT;
  const statusInfo = getStatusInfo(agreement.status);

  const isContractor = user?.role === 'contractor';
  const isWorker = user?.role === 'worker';
  const isPendingSignature = agreement.status === 'pending_signature';
  const isActive = agreement.status === 'active';

  const handleSign = () => {
    Alert.alert(
      'Sign Agreement',
      'By signing, you agree to all terms and conditions stated in this agreement.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign',
          onPress: () => {
            Alert.alert('Success', 'Agreement signed successfully!');
          },
        },
      ]
    );
  };

  const handleTerminate = () => {
    Alert.alert(
      'Terminate Agreement',
      `This will terminate the agreement. A ${agreement.terminationNoticeDays}-day notice period will apply.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Terminate',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Agreement Terminated', 'Notice period has started.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">Agreement Details</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Agreement Header */}
        <View className="px-4 py-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">{agreement.title}</Text>
                <Text className="text-gray-400 text-sm mt-1">{agreement.agreementNumber}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${statusInfo.bg}`}>
                <Text style={{ color: statusInfo.color }} className="font-medium">
                  {statusInfo.label}
                </Text>
              </View>
            </View>

            {/* Progress for active agreements */}
            {isActive && (
              <View className="mt-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-400">Progress</Text>
                  <Text className="text-white">
                    ₹{agreement.paidAmount.toLocaleString()} / ₹{agreement.totalValue.toLocaleString()}
                  </Text>
                </View>
                <View className="h-2 bg-gray-700 rounded-full">
                  <View
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${(agreement.paidAmount / agreement.totalValue) * 100}%` }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Parties */}
        <View className="px-4 pb-4">
          <Text className="text-white text-lg font-semibold mb-3">Parties</Text>

          {/* Contractor */}
          <View className="bg-gray-800 rounded-xl p-4 mb-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-purple-500/20 rounded-full items-center justify-center">
                <Ionicons name="business" size={24} color="#A855F7" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-gray-400 text-xs">CONTRACTOR</Text>
                <Text className="text-white font-medium">{agreement.contractor.name}</Text>
                <Text className="text-gray-400 text-sm">{agreement.contractor.phone}</Text>
              </View>
              {agreement.contractorSignedAt && (
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
              )}
            </View>
          </View>

          {/* Worker */}
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-green-500/20 rounded-full items-center justify-center">
                <Ionicons name="person" size={24} color="#22C55E" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-gray-400 text-xs">WORKER</Text>
                <Text className="text-white font-medium">{agreement.worker.name}</Text>
                <View className="flex-row mt-1">
                  {agreement.worker.skills.map((skill, index) => (
                    <View key={index} className="bg-gray-700 px-2 py-0.5 rounded mr-2">
                      <Text className="text-gray-300 text-xs">{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {agreement.workerSignedAt ? (
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
              ) : (
                <View className="bg-yellow-500/20 px-2 py-1 rounded">
                  <Text className="text-yellow-500 text-xs">Pending</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Agreement Details */}
        <View className="px-4 pb-4">
          <Text className="text-white text-lg font-semibold mb-3">Contract Terms</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            {/* Duration */}
            <View className="flex-row items-center mb-4 pb-4 border-b border-gray-700">
              <Ionicons name="calendar" size={20} color="#F97316" />
              <View className="ml-4 flex-1">
                <Text className="text-gray-400 text-xs">DURATION</Text>
                <Text className="text-white">{agreement.startDate} → {agreement.endDate}</Text>
              </View>
            </View>

            {/* Rate */}
            <View className="flex-row items-center mb-4 pb-4 border-b border-gray-700">
              <Ionicons name="cash" size={20} color="#F97316" />
              <View className="ml-4 flex-1">
                <Text className="text-gray-400 text-xs">RATE</Text>
                <Text className="text-white">
                  ₹{agreement.rateAmount} / {agreement.rateType}
                </Text>
              </View>
            </View>

            {/* Working Hours */}
            <View className="flex-row items-center mb-4 pb-4 border-b border-gray-700">
              <Ionicons name="time" size={20} color="#F97316" />
              <View className="ml-4 flex-1">
                <Text className="text-gray-400 text-xs">WORKING HOURS</Text>
                <Text className="text-white">{agreement.workingHoursPerDay} hours/day</Text>
              </View>
            </View>

            {/* Location */}
            <View className="flex-row items-start">
              <Ionicons name="location" size={20} color="#F97316" />
              <View className="ml-4 flex-1">
                <Text className="text-gray-400 text-xs">WORK LOCATION</Text>
                <Text className="text-white">{agreement.workLocation}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Scope of Work */}
        <View className="px-4 pb-4">
          <Text className="text-white text-lg font-semibold mb-3">Scope of Work</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-gray-300 leading-6">{agreement.scopeOfWork}</Text>
          </View>
        </View>

        {/* Terms */}
        <View className="px-4 pb-4">
          <Text className="text-white text-lg font-semibold mb-3">Terms & Conditions</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-gray-400 text-sm mb-2">Termination Notice</Text>
            <Text className="text-white mb-4">{agreement.terminationNoticeDays} days</Text>

            <Text className="text-gray-400 text-sm mb-2">Termination Terms</Text>
            <Text className="text-gray-300 mb-4">{agreement.terminationTerms}</Text>

            {agreement.additionalTerms && (
              <>
                <Text className="text-gray-400 text-sm mb-2">Additional Terms</Text>
                <Text className="text-gray-300">{agreement.additionalTerms}</Text>
              </>
            )}
          </View>
        </View>

        {/* Financial Summary */}
        <View className="px-4 pb-8">
          <Text className="text-white text-lg font-semibold mb-3">Financial Summary</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Total Contract Value</Text>
              <Text className="text-white font-bold">₹{agreement.totalValue.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Amount Paid</Text>
              <Text className="text-green-500">₹{agreement.paidAmount.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-400">In Escrow</Text>
              <Text className="text-yellow-500">₹{agreement.escrowBalance.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {(isPendingSignature && isWorker) && (
        <View className="px-4 py-4 border-t border-gray-800">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-gray-700 py-4 rounded-xl flex-row items-center justify-center"
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={20} color="#9CA3AF" />
              <Text className="text-gray-300 font-semibold ml-2">Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-green-500 py-4 rounded-xl flex-row items-center justify-center"
              onPress={handleSign}
            >
              <Ionicons name="create" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Sign Agreement</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isActive && (
        <View className="px-4 py-4 border-t border-gray-800">
          <TouchableOpacity
            className="bg-red-500/20 py-4 rounded-xl flex-row items-center justify-center"
            onPress={handleTerminate}
          >
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <Text className="text-red-500 font-semibold ml-2">Terminate Agreement</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
