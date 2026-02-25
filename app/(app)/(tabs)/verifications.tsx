import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

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
        style={[
          s.card,
          isPending && { borderLeftWidth: 4, borderLeftColor: T.amber },
        ]}
      >
        {/* Header */}
        <View style={s.cardHeader}>
          <View style={s.avatar}>
            <Ionicons name="person" size={36} color={T.textMuted} />
          </View>
          <View style={s.cardHeaderInfo}>
            <Text style={s.workerName}>{verification.workerName}</Text>
            <Text style={s.workerPhone}>{verification.phone}</Text>
            <View style={s.skillsRow}>
              {verification.skills.map((skill, index) => (
                <View key={index} style={s.skillBadge}>
                  <Text style={s.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={s.cardHeaderRight}>
            <Text style={s.experienceLabel}>Experience</Text>
            <Text style={s.experienceValue}>{verification.experience} years</Text>
            <Text style={s.rateValue}>₹{verification.dailyRate}/day</Text>
          </View>
        </View>

        {/* ID Document Info */}
        <View style={s.idSection}>
          <View style={s.idHeader}>
            <Ionicons name="card" size={18} color={T.amber} />
            <Text style={s.idType}>{verification.idType}</Text>
          </View>
          <Text style={s.idNumber}>ID Number: {verification.idNumber}</Text>
          <Text style={s.submittedAt}>Submitted: {verification.submittedAt}</Text>
        </View>

        {/* Document Previews */}
        <View style={s.documentsSection}>
          <Text style={s.documentsLabel}>Documents</Text>
          <View style={s.documentsRow}>
            <TouchableOpacity style={s.documentBox}>
              <Ionicons name="image" size={24} color={T.textMuted} />
              <Text style={s.documentBoxLabel}>ID Front</Text>
            </TouchableOpacity>
            {verification.idBackUrl && (
              <TouchableOpacity style={s.documentBox}>
                <Ionicons name="image" size={24} color={T.textMuted} />
                <Text style={s.documentBoxLabel}>ID Back</Text>
              </TouchableOpacity>
            )}
            {verification.selfieUrl && (
              <TouchableOpacity style={s.documentBox}>
                <Ionicons name="person-circle" size={24} color={T.textMuted} />
                <Text style={s.documentBoxLabel}>Selfie</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Rejection Reason */}
        {isRejected && (verification as any).rejectionReason && (
          <View style={s.rejectionBox}>
            <View style={s.rejectionHeader}>
              <Ionicons name="close-circle" size={16} color="#EF4444" />
              <Text style={s.rejectionTitle}>Rejection Reason</Text>
            </View>
            <Text style={s.rejectionText}>{(verification as any).rejectionReason}</Text>
          </View>
        )}

        {/* Review Info */}
        {!isPending && (
          <View style={s.reviewInfo}>
            <Ionicons
              name={verification.status === 'approved' ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={verification.status === 'approved' ? T.success : '#EF4444'}
            />
            <Text style={s.reviewText}>
              {verification.status === 'approved' ? 'Approved' : 'Rejected'} by {(verification as any).reviewedBy} on {(verification as any).reviewedAt}
            </Text>
          </View>
        )}

        {/* Actions for Pending */}
        {isPending && (
          <View style={s.actionsRow}>
            <TouchableOpacity
              style={s.viewDetailsBtn}
              onPress={() => setSelectedVerification(verification)}
            >
              <Ionicons name="eye" size={20} color={T.textSecondary} />
              <Text style={s.viewDetailsBtnText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.approveBtn}
              onPress={() => handleApprove(verification)}
            >
              <Ionicons name="checkmark" size={20} color={T.white} />
              <Text style={s.actionBtnTextWhite}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.rejectBtn}
              onPress={() => handleReject(verification)}
            >
              <Ionicons name="close" size={20} color={T.white} />
              <Text style={s.actionBtnTextWhite}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerRow}>
          <Text style={s.headerTitle}>Verifications</Text>
          {pendingCount > 0 && (
            <View style={s.pendingBadge}>
              <Text style={s.pendingBadgeText}>{pendingCount} Pending</Text>
            </View>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabBar}>
        {VERIFICATION_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              s.tab,
              selectedTab === tab ? s.tabActive : s.tabInactive,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                s.tabText,
                selectedTab === tab ? s.tabTextActive : s.tabTextInactive,
              ]}
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
          <View style={s.emptyContainer}>
            <Ionicons name="shield-checkmark" size={48} color={T.textMuted} />
            <Text style={s.emptyText}>
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

const s = {
  container: {
    flex: 1,
    backgroundColor: T.bg,
  } as const,

  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  } as const,
  headerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  headerTitle: {
    color: T.text,
    fontSize: 30,
    fontWeight: '700' as const,
  },
  pendingBadge: {
    backgroundColor: T.amber,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  pendingBadgeText: {
    color: '#1A1D2E',
    fontWeight: '700' as const,
    fontSize: 14,
  },

  // Tabs
  tabBar: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  tabActive: {
    backgroundColor: T.navy,
  },
  tabInactive: {
    backgroundColor: T.bg,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  tabTextActive: {
    color: T.white,
  },
  tabTextInactive: {
    color: T.textSecondary,
  },

  // Card
  card: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  } as const,

  // Card Header
  cardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: T.bg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  cardHeaderInfo: {
    flex: 1,
    marginLeft: 16,
  },
  workerName: {
    color: T.text,
    fontWeight: '700' as const,
    fontSize: 18,
    marginBottom: 4,
  },
  workerPhone: {
    color: T.textSecondary,
    fontWeight: '500' as const,
    fontSize: 14,
    marginBottom: 8,
  },
  skillsRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
  },
  skillBadge: {
    backgroundColor: T.bg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 4,
  },
  skillText: {
    color: T.textSecondary,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  cardHeaderRight: {
    alignItems: 'flex-end' as const,
  },
  experienceLabel: {
    color: T.textMuted,
    fontSize: 12,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  experienceValue: {
    color: T.text,
    fontWeight: '700' as const,
    fontSize: 14,
  },
  rateValue: {
    color: T.amber,
    fontWeight: '700' as const,
    fontSize: 16,
    marginTop: 4,
  },

  // ID Section
  idSection: {
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  idHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  idType: {
    color: T.text,
    fontWeight: '500' as const,
    fontSize: 14,
    marginLeft: 8,
  },
  idNumber: {
    color: T.textSecondary,
    fontSize: 14,
  },
  submittedAt: {
    color: T.textMuted,
    fontSize: 12,
    marginTop: 4,
  },

  // Documents Section
  documentsSection: {
    marginBottom: 16,
  },
  documentsLabel: {
    color: T.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  documentsRow: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  documentBox: {
    flex: 1,
    height: 96,
    backgroundColor: T.bg,
    borderRadius: 10,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  documentBoxLabel: {
    color: T.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  // Rejection
  rejectionBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  rejectionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
  },
  rejectionTitle: {
    color: '#EF4444',
    fontWeight: '500' as const,
    fontSize: 14,
    marginLeft: 8,
  },
  rejectionText: {
    color: T.textSecondary,
    fontSize: 14,
  },

  // Review Info
  reviewInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  reviewText: {
    color: T.textSecondary,
    marginLeft: 8,
    fontSize: 14,
  },

  // Action Buttons
  actionsRow: {
    flexDirection: 'row' as const,
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  viewDetailsBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
  },
  viewDetailsBtnText: {
    color: T.textSecondary,
    fontWeight: '700' as const,
    fontSize: 14,
    marginLeft: 8,
  },
  approveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: T.success,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#EF4444',
  },
  actionBtnTextWhite: {
    color: T.white,
    fontWeight: '700' as const,
    fontSize: 14,
    marginLeft: 8,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 48,
  },
  emptyText: {
    color: T.textSecondary,
    fontSize: 16,
    marginTop: 16,
  },
};
