import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';

const AGREEMENT_TABS = ['All', 'Active', 'Pending', 'Completed'];

const MOCK_AGREEMENTS = [
  {
    id: 'a1',
    agreementNumber: 'AGR-2024-001',
    title: 'Site Labor for Brigade Project',
    contractor: 'Rajesh Constructions',
    worker: 'Ramu Yadav',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    rateType: 'daily',
    rateAmount: 600,
    totalValue: 36000,
    status: 'active',
    workLocation: 'Brigade Road Construction Site',
  },
  {
    id: 'a2',
    agreementNumber: 'AGR-2024-002',
    title: 'Mason Work - Electronic City Villa',
    contractor: 'BuildRight Pvt Ltd',
    worker: 'Suresh Kumar',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    rateType: 'weekly',
    rateAmount: 5600,
    totalValue: 67200,
    status: 'active',
    workLocation: 'Electronic City Villa Project',
  },
  {
    id: 'a3',
    agreementNumber: 'AGR-2024-003',
    title: 'Electrical Installation',
    contractor: 'Sharma Builders',
    worker: 'Mohammed Ali',
    startDate: '2024-01-20',
    endDate: '2024-02-28',
    rateType: 'daily',
    rateAmount: 900,
    totalValue: 36000,
    status: 'active',
    workLocation: 'Marathahalli Office Complex',
  },
  {
    id: 'a4',
    agreementNumber: 'AGR-2024-004',
    title: 'Carpentry - Modular Kitchen',
    contractor: 'Prime Infrastructure',
    worker: 'Venkat Rao',
    startDate: '2024-02-10',
    endDate: '2024-05-10',
    rateType: 'monthly',
    rateAmount: 30000,
    totalValue: 90000,
    status: 'active',
    workLocation: 'Hebbal Apartment Complex',
  },
  {
    id: 'a5',
    agreementNumber: 'AGR-2024-005',
    title: 'Plumbing - Housing Society',
    contractor: 'Metro Constructions',
    worker: 'Ganesh Babu',
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    rateType: 'weekly',
    rateAmount: 5950,
    totalValue: 102200,
    status: 'pending_signature',
    workLocation: 'JP Nagar Housing Society',
  },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'active':
      return { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Active' };
    case 'pending_signature':
      return { bg: 'bg-yellow-500/20', text: 'text-yellow-500', label: 'Pending Signature' };
    case 'completed':
      return { bg: 'bg-blue-500/20', text: 'text-blue-500', label: 'Completed' };
    case 'terminated':
      return { bg: 'bg-red-500/20', text: 'text-red-500', label: 'Terminated' };
    case 'draft':
      return { bg: 'bg-gray-500/20', text: 'text-gray-500', label: 'Draft' };
    default:
      return { bg: 'bg-gray-500/20', text: 'text-gray-500', label: status };
  }
};

const getRateLabel = (type: string, amount: number) => {
  switch (type) {
    case 'daily':
      return `₹${amount}/day`;
    case 'weekly':
      return `₹${amount}/week`;
    case 'monthly':
      return `₹${amount}/month`;
    default:
      return `₹${amount}`;
  }
};

export default function AgreementsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('All');

  const isContractor = user?.role === 'contractor';
  const isWorker = user?.role === 'worker';

  const filteredAgreements = MOCK_AGREEMENTS.filter((agreement) => {
    if (selectedTab === 'All') return true;
    if (selectedTab === 'Active') return agreement.status === 'active';
    if (selectedTab === 'Pending') return agreement.status === 'pending_signature';
    if (selectedTab === 'Completed') return ['completed', 'terminated'].includes(agreement.status);
    return true;
  });

  const renderAgreement = ({ item: agreement }: { item: typeof MOCK_AGREEMENTS[0] }) => {
    const statusStyle = getStatusStyle(agreement.status);
    const isPending = agreement.status === 'pending_signature';

    return (
      <TouchableOpacity
        className={`bg-gray-800 rounded-xl p-4 mb-3 ${isPending ? 'border-l-4 border-yellow-500' : ''}`}
        onPress={() => router.push(`/(app)/agreement/${agreement.id}`)}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-white font-semibold text-lg">{agreement.title}</Text>
            <Text className="text-gray-400 text-sm">{agreement.agreementNumber}</Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${statusStyle.bg}`}>
            <Text className={`text-sm font-medium ${statusStyle.text}`}>
              {statusStyle.label}
            </Text>
          </View>
        </View>

        {/* Parties */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="business" size={16} color="#9CA3AF" />
          <Text className="text-gray-300 ml-2">
            {isWorker ? agreement.contractor : agreement.worker}
          </Text>
        </View>

        {/* Location */}
        <View className="flex-row items-center mb-3">
          <Ionicons name="location" size={16} color="#9CA3AF" />
          <Text className="text-gray-400 ml-2" numberOfLines={1}>
            {agreement.workLocation}
          </Text>
        </View>

        {/* Duration & Rate */}
        <View className="flex-row items-center justify-between py-3 border-t border-gray-700">
          <View>
            <Text className="text-gray-500 text-xs">Duration</Text>
            <Text className="text-white">
              {agreement.startDate} - {agreement.endDate}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-500 text-xs">Rate</Text>
            <Text className="text-orange-500 font-bold">
              {getRateLabel(agreement.rateType, agreement.rateAmount)}
            </Text>
          </View>
        </View>

        {/* Total Value */}
        <View className="flex-row items-center justify-between pt-3 border-t border-gray-700">
          <Text className="text-gray-400">Total Contract Value</Text>
          <Text className="text-white font-bold text-lg">
            ₹{agreement.totalValue.toLocaleString()}
          </Text>
        </View>

        {/* Actions for pending agreements */}
        {isPending && isWorker && (
          <View className="flex-row space-x-3 mt-4 pt-3 border-t border-gray-700">
            <TouchableOpacity className="flex-1 bg-green-500 py-3 rounded-lg flex-row items-center justify-center">
              <Ionicons name="checkmark-circle" size={18} color="white" />
              <Text className="text-white font-semibold ml-2">Sign Agreement</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-gray-700 py-3 rounded-lg flex-row items-center justify-center">
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              <Text className="text-gray-300 font-semibold ml-2">Decline</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-800 flex-row items-center justify-between">
        <Text className="text-white text-2xl font-bold">
          {isContractor ? 'My Contracts' : 'Agreements'}
        </Text>
        {isContractor && (
          <TouchableOpacity
            className="bg-orange-500 px-4 py-2 rounded-full flex-row items-center"
            onPress={() => router.push('/(app)/agreement/create')}
          >
            <Ionicons name="add" size={18} color="white" />
            <Text className="text-white font-medium ml-1">New</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 py-3 border-b border-gray-800">
        {AGREEMENT_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 py-2 rounded-lg mr-2 ${
              selectedTab === tab ? 'bg-orange-500' : 'bg-gray-800'
            }`}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              className={`text-center font-medium ${
                selectedTab === tab ? 'text-white' : 'text-gray-400'
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pending Notification for Workers */}
      {isWorker && selectedTab === 'All' && MOCK_AGREEMENTS.some(a => a.status === 'pending_signature') && (
        <View className="mx-4 mt-3 bg-yellow-500/10 rounded-xl p-4 flex-row items-center border border-yellow-500/30">
          <Ionicons name="alert-circle" size={24} color="#EAB308" />
          <View className="ml-3 flex-1">
            <Text className="text-yellow-500 font-semibold">Action Required</Text>
            <Text className="text-gray-400 text-sm">
              You have pending agreements to sign
            </Text>
          </View>
        </View>
      )}

      {/* Agreements List */}
      <FlatList
        data={filteredAgreements}
        renderItem={renderAgreement}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Ionicons name="document-text" size={48} color="#6B7280" />
            <Text className="text-gray-400 mt-4">No agreements found</Text>
            {isContractor && (
              <TouchableOpacity
                className="bg-orange-500 px-6 py-3 rounded-full mt-4"
                onPress={() => router.push('/(app)/agreement/create')}
              >
                <Text className="text-white font-semibold">Create Agreement</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
