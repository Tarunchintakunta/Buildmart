import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const VERIFICATION_TABS = ['Pending', 'Approved', 'Rejected'];

const MOCK_VERIFICATIONS = [
  {
    id: 'v1',
    workerId: 'w4',
    workerName: 'Ganesh Babu',
    phone: '9876543304',
    email: 'ganesh@email.com',
    idType: 'Aadhar Card',
    idNumber: 'XXXX-XXXX-3456',
    idFrontUrl: 'https://placeholder.com/id_front.jpg',
    idBackUrl: 'https://placeholder.com/id_back.jpg',
    selfieUrl: 'https://placeholder.com/selfie.jpg',
    skills: ['Plumber', 'Welder'],
    experience: 10,
    dailyRate: 850,
    status: 'pending',
    submittedAt: '2024-02-15 10:30 AM',
  },
  {
    id: 'v2',
    workerId: 'w6',
    workerName: 'Srinivas K',
    phone: '9876543306',
    email: 'srinivas@email.com',
    idType: 'Driving License',
    idNumber: 'DL-KA-2015-123456',
    idFrontUrl: 'https://placeholder.com/id_front2.jpg',
    idBackUrl: null,
    selfieUrl: 'https://placeholder.com/selfie2.jpg',
    skills: ['Mason'],
    experience: 5,
    dailyRate: 700,
    status: 'pending',
    submittedAt: '2024-02-15 08:15 AM',
  },
  {
    id: 'v3',
    workerId: 'w7',
    workerName: 'Rajan M',
    phone: '9876543307',
    email: 'rajan@email.com',
    idType: 'Voter ID',
    idNumber: 'VOTER987654',
    idFrontUrl: 'https://placeholder.com/id_front3.jpg',
    idBackUrl: null,
    selfieUrl: null,
    skills: ['Electrician', 'Helper'],
    experience: 3,
    dailyRate: 600,
    status: 'pending',
    submittedAt: '2024-02-14 04:45 PM',
  },
  {
    id: 'v4',
    workerId: 'w1',
    workerName: 'Ramu Yadav',
    phone: '9876543301',
    email: 'ramu@email.com',
    idType: 'Aadhar Card',
    idNumber: 'XXXX-XXXX-1234',
    idFrontUrl: 'https://placeholder.com/id1_front.jpg',
    idBackUrl: 'https://placeholder.com/id1_back.jpg',
    selfieUrl: 'https://placeholder.com/selfie1.jpg',
    skills: ['Coolie', 'Helper'],
    experience: 5,
    dailyRate: 600,
    status: 'approved',
    submittedAt: '2024-02-10 09:00 AM',
    reviewedAt: '2024-02-10 11:30 AM',
    reviewedBy: 'Admin One',
  },
  {
    id: 'v5',
    workerId: 'w8',
    workerName: 'Kumar S',
    phone: '9876543308',
    email: 'kumar@email.com',
    idType: 'PAN Card',
    idNumber: 'ABCDE1234F',
    idFrontUrl: 'https://placeholder.com/id5_front.jpg',
    idBackUrl: null,
    selfieUrl: null,
    skills: ['Painter'],
    experience: 2,
    dailyRate: 550,
    status: 'rejected',
    submittedAt: '2024-02-12 02:00 PM',
    reviewedAt: '2024-02-12 05:00 PM',
    reviewedBy: 'Admin Two',
    rejectionReason: 'ID document is blurry and unreadable',
  },
];

export default function VerificationsScreen() {
  const [selectedTab, setSelectedTab] = useState('Pending');
  const [selectedVerification, setSelectedVerification] = useState<typeof MOCK_VERIFICATIONS[0] | null>(null);

  const filteredVerifications = MOCK_VERIFICATIONS.filter((v) => {
    return v.status === selectedTab.toLowerCase();
  });

  const pendingCount = MOCK_VERIFICATIONS.filter((v) => v.status === 'pending').length;

  const handleApprove = (verification: typeof MOCK_VERIFICATIONS[0]) => {
    Alert.alert(
      'Approve Verification',
      `Are you sure you want to approve ${verification.workerName}'s verification?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: () => {
            Alert.alert('Success', 'Worker has been verified successfully');
          },
        },
      ]
    );
  };

  const handleReject = (verification: typeof MOCK_VERIFICATIONS[0]) => {
    Alert.alert(
      'Reject Verification',
      `Are you sure you want to reject ${verification.workerName}'s verification?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Rejected', 'Verification has been rejected');
          },
        },
      ]
    );
  };

  const renderVerification = ({ item: verification }: { item: typeof MOCK_VERIFICATIONS[0] }) => {
    const isPending = verification.status === 'pending';
    const isRejected = verification.status === 'rejected';

    return (
      <View 
        className="rounded-2xl p-5 mb-4"
        style={{
          backgroundColor: '#1F2937',
          borderLeftWidth: isPending ? 4 : 0,
          borderLeftColor: isPending ? '#F59E0B' : 'transparent',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        {/* Header */}
        <View className="flex-row items-start mb-4">
          <View 
            className="w-16 h-16 rounded-xl items-center justify-center"
            style={{ backgroundColor: '#374151' }}
          >
            <Ionicons name="person" size={36} color="#6B7280" />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-white font-bold text-lg mb-1">{verification.workerName}</Text>
            <Text className="text-gray-400 font-medium mb-2">{verification.phone}</Text>
            <View className="flex-row flex-wrap">
              {verification.skills.map((skill, index) => (
                <View 
                  key={index} 
                  className="px-3 py-1 rounded-xl mr-2 mb-1"
                  style={{ backgroundColor: '#374151' }}
                >
                  <Text className="text-gray-300 text-xs font-semibold">{skill}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className="items-end">
            <Text className="text-gray-500 text-xs font-medium mb-1">Experience</Text>
            <Text className="text-white font-bold">{verification.experience} years</Text>
            <Text className="text-orange-500 font-bold text-base mt-1">₹{verification.dailyRate}/day</Text>
          </View>
        </View>

        {/* ID Document Info */}
        <View className="bg-gray-700/50 rounded-lg p-3 mb-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="card" size={18} color="#F97316" />
            <Text className="text-white font-medium ml-2">{verification.idType}</Text>
          </View>
          <Text className="text-gray-400 text-sm">ID Number: {verification.idNumber}</Text>
          <Text className="text-gray-500 text-xs mt-1">Submitted: {verification.submittedAt}</Text>
        </View>

        {/* Document Previews */}
        <View className="mb-4">
          <Text className="text-gray-400 text-sm mb-2">Documents</Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-1 h-24 bg-gray-700 rounded-lg items-center justify-center">
              <Ionicons name="image" size={24} color="#6B7280" />
              <Text className="text-gray-400 text-xs mt-1">ID Front</Text>
            </TouchableOpacity>
            {verification.idBackUrl && (
              <TouchableOpacity className="flex-1 h-24 bg-gray-700 rounded-lg items-center justify-center">
                <Ionicons name="image" size={24} color="#6B7280" />
                <Text className="text-gray-400 text-xs mt-1">ID Back</Text>
              </TouchableOpacity>
            )}
            {verification.selfieUrl && (
              <TouchableOpacity className="flex-1 h-24 bg-gray-700 rounded-lg items-center justify-center">
                <Ionicons name="person-circle" size={24} color="#6B7280" />
                <Text className="text-gray-400 text-xs mt-1">Selfie</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Rejection Reason */}
        {isRejected && (verification as any).rejectionReason && (
          <View className="bg-red-500/10 rounded-lg p-3 mb-4 border border-red-500/30">
            <View className="flex-row items-center mb-1">
              <Ionicons name="close-circle" size={16} color="#EF4444" />
              <Text className="text-red-500 font-medium ml-2">Rejection Reason</Text>
            </View>
            <Text className="text-gray-400 text-sm">{(verification as any).rejectionReason}</Text>
          </View>
        )}

        {/* Review Info */}
        {!isPending && (
          <View className="flex-row items-center py-3 border-t border-gray-700">
            <Ionicons
              name={verification.status === 'approved' ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={verification.status === 'approved' ? '#22C55E' : '#EF4444'}
            />
            <Text className="text-gray-400 ml-2 text-sm">
              {verification.status === 'approved' ? 'Approved' : 'Rejected'} by {(verification as any).reviewedBy} on {(verification as any).reviewedAt}
            </Text>
          </View>
        )}

        {/* Actions for Pending */}
        {isPending && (
          <View 
            className="flex-row space-x-3 pt-4"
            style={{ borderTopWidth: 1, borderTopColor: '#374151' }}
          >
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
              style={{
                backgroundColor: '#374151',
                borderWidth: 1,
                borderColor: '#4B5563',
              }}
              onPress={() => setSelectedVerification(verification)}
            >
              <Ionicons name="eye" size={20} color="#9CA3AF" />
              <Text className="text-gray-300 font-bold ml-2">View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
              style={{ backgroundColor: '#10B981' }}
              onPress={() => handleApprove(verification)}
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
              style={{ backgroundColor: '#EF4444' }}
              onPress={() => handleReject(verification)}
            >
              <Ionicons name="close" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View 
        className="px-5 py-4 border-b"
        style={{ borderBottomColor: '#374151' }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-3xl font-bold">Verifications</Text>
          {pendingCount > 0 && (
            <View 
              className="px-4 py-2 rounded-xl"
              style={{ backgroundColor: '#F59E0B' }}
            >
              <Text className="text-black font-bold">{pendingCount} Pending</Text>
            </View>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View 
        className="flex-row px-4 py-4 border-b"
        style={{ borderBottomColor: '#374151' }}
      >
        {VERIFICATION_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            className="flex-1 py-3 rounded-xl mr-2"
            style={{
              backgroundColor: selectedTab === tab ? '#F97316' : '#1F2937',
            }}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              className="text-center font-semibold"
              style={{
                color: selectedTab === tab ? '#FFFFFF' : '#9CA3AF',
                fontSize: 14,
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Verification List */}
      <FlatList
        data={filteredVerifications}
        renderItem={renderVerification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Ionicons name="shield-checkmark" size={48} color="#6B7280" />
            <Text className="text-gray-400 mt-4">
              {selectedTab === 'Pending'
                ? 'No pending verifications'
                : selectedTab === 'Approved'
                ? 'No approved verifications'
                : 'No rejected verifications'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
