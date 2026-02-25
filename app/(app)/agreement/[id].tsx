import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

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
    draft: { label: 'Draft', color: '#6B7280', bg: 'rgba(107,114,128,0.15)' },
    pending_signature: { label: 'Pending Signature', color: '#EAB308', bg: 'rgba(234,179,8,0.15)' },
    active: { label: 'Active', color: '#22C55E', bg: 'rgba(34,197,94,0.15)' },
    completed: { label: 'Completed', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
    terminated: { label: 'Terminated', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
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
    <SafeAreaView style={s.safeArea}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Agreement Details</Text>
      </View>

      <ScrollView style={s.scrollView} showsVerticalScrollIndicator={false}>
        {/* Agreement Header */}
        <View style={s.sectionPadding}>
          <View style={s.agreementHeaderCard}>
            <View style={s.agreementHeaderRow}>
              <View style={s.flex1}>
                <Text style={s.agreementTitle}>{agreement.title}</Text>
                <Text style={s.agreementNumber}>{agreement.agreementNumber}</Text>
              </View>
              <View style={[s.statusBadge, { backgroundColor: statusInfo.bg }]}>
                <Text style={[s.statusBadgeText, { color: statusInfo.color }]}>
                  {statusInfo.label}
                </Text>
              </View>
            </View>

            {/* Progress for active agreements */}
            {isActive && (
              <View style={s.progressContainer}>
                <View style={s.progressLabelRow}>
                  <Text style={s.progressLabel}>Progress</Text>
                  <Text style={s.progressValue}>
                    ₹{agreement.paidAmount.toLocaleString()} / ₹{agreement.totalValue.toLocaleString()}
                  </Text>
                </View>
                <View style={s.progressTrack}>
                  <View
                    style={[
                      s.progressFill,
                      { width: `${(agreement.paidAmount / agreement.totalValue) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Parties */}
        <View style={s.sectionPaddingBottom}>
          <Text style={s.sectionTitle}>Parties</Text>

          {/* Contractor */}
          <View style={[s.partyCard, { marginBottom: 12 }]}>
            <View style={s.partyRow}>
              <View style={s.contractorIconCircle}>
                <Ionicons name="business" size={24} color="#A855F7" />
              </View>
              <View style={s.partyInfo}>
                <Text style={s.roleLabel}>CONTRACTOR</Text>
                <Text style={s.partyName}>{agreement.contractor.name}</Text>
                <Text style={s.partyPhone}>{agreement.contractor.phone}</Text>
              </View>
              {agreement.contractorSignedAt && (
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
              )}
            </View>
          </View>

          {/* Worker */}
          <View style={s.partyCard}>
            <View style={s.partyRow}>
              <View style={s.workerIconCircle}>
                <Ionicons name="person" size={24} color="#22C55E" />
              </View>
              <View style={s.partyInfo}>
                <Text style={s.roleLabel}>WORKER</Text>
                <Text style={s.partyName}>{agreement.worker.name}</Text>
                <View style={s.skillsRow}>
                  {agreement.worker.skills.map((skill, index) => (
                    <View key={index} style={s.skillBadge}>
                      <Text style={s.skillBadgeText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {agreement.workerSignedAt ? (
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
              ) : (
                <View style={s.pendingBadge}>
                  <Text style={s.pendingBadgeText}>Pending</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Agreement Details */}
        <View style={s.sectionPaddingBottom}>
          <Text style={s.sectionTitle}>Contract Terms</Text>
          <View style={s.card}>
            {/* Duration */}
            <View style={s.termRowBordered}>
              <Ionicons name="calendar" size={20} color={T.amber} />
              <View style={s.termContent}>
                <Text style={s.termLabel}>DURATION</Text>
                <Text style={s.termValue}>{agreement.startDate} → {agreement.endDate}</Text>
              </View>
            </View>

            {/* Rate */}
            <View style={s.termRowBordered}>
              <Ionicons name="cash" size={20} color={T.amber} />
              <View style={s.termContent}>
                <Text style={s.termLabel}>RATE</Text>
                <Text style={s.termValue}>
                  ₹{agreement.rateAmount} / {agreement.rateType}
                </Text>
              </View>
            </View>

            {/* Working Hours */}
            <View style={s.termRowBordered}>
              <Ionicons name="time" size={20} color={T.amber} />
              <View style={s.termContent}>
                <Text style={s.termLabel}>WORKING HOURS</Text>
                <Text style={s.termValue}>{agreement.workingHoursPerDay} hours/day</Text>
              </View>
            </View>

            {/* Location */}
            <View style={s.termRowNoBorder}>
              <Ionicons name="location" size={20} color={T.amber} />
              <View style={s.termContent}>
                <Text style={s.termLabel}>WORK LOCATION</Text>
                <Text style={s.termValue}>{agreement.workLocation}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Scope of Work */}
        <View style={s.sectionPaddingBottom}>
          <Text style={s.sectionTitle}>Scope of Work</Text>
          <View style={s.card}>
            <Text style={s.bodyText}>{agreement.scopeOfWork}</Text>
          </View>
        </View>

        {/* Terms */}
        <View style={s.sectionPaddingBottom}>
          <Text style={s.sectionTitle}>Terms & Conditions</Text>
          <View style={s.card}>
            <Text style={s.termsLabel}>Termination Notice</Text>
            <Text style={s.termsValue}>{agreement.terminationNoticeDays} days</Text>

            <Text style={s.termsLabel}>Termination Terms</Text>
            <Text style={s.termsBodyText}>{agreement.terminationTerms}</Text>

            {agreement.additionalTerms && (
              <>
                <Text style={s.termsLabel}>Additional Terms</Text>
                <Text style={s.termsBodyTextLast}>{agreement.additionalTerms}</Text>
              </>
            )}
          </View>
        </View>

        {/* Financial Summary */}
        <View style={s.sectionPaddingBottomLarge}>
          <Text style={s.sectionTitle}>Financial Summary</Text>
          <View style={s.card}>
            <View style={s.financeRow}>
              <Text style={s.financeLabel}>Total Contract Value</Text>
              <Text style={s.financeTotal}>₹{agreement.totalValue.toLocaleString()}</Text>
            </View>
            <View style={s.financeRow}>
              <Text style={s.financeLabel}>Amount Paid</Text>
              <Text style={s.financePaid}>₹{agreement.paidAmount.toLocaleString()}</Text>
            </View>
            <View style={s.financeRowLast}>
              <Text style={s.financeLabel}>In Escrow</Text>
              <Text style={s.financeEscrow}>₹{agreement.escrowBalance.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {(isPendingSignature && isWorker) && (
        <View style={s.bottomBar}>
          <View style={s.bottomActionsRow}>
            <TouchableOpacity
              style={s.declineButton}
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={20} color="#9CA3AF" />
              <Text style={s.declineButtonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.signButton}
              onPress={handleSign}
            >
              <Ionicons name="create" size={20} color="#FFFFFF" />
              <Text style={s.signButtonText}>Sign Agreement</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isActive && (
        <View style={s.bottomBar}>
          <TouchableOpacity
            style={s.terminateButton}
            onPress={handleTerminate}
          >
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <Text style={s.terminateButtonText}>Terminate Agreement</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = {
  safeArea: {
    flex: 1,
    backgroundColor: T.bg,
  } as const,
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  headerTitle: {
    color: T.text,
    fontSize: 20,
    fontWeight: '700' as const,
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  } as const,
  sectionPadding: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionPaddingBottom: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionPaddingBottomLarge: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  agreementHeaderCard: {
    backgroundColor: T.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  agreementHeaderRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 12,
  },
  flex1: {
    flex: 1,
  } as const,
  agreementTitle: {
    color: T.text,
    fontSize: 20,
    fontWeight: '700' as const,
  },
  agreementNumber: {
    color: T.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusBadgeText: {
    fontWeight: '500' as const,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressLabelRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 8,
  },
  progressLabel: {
    color: T.textMuted,
  },
  progressValue: {
    color: T.text,
  },
  progressTrack: {
    height: 8,
    backgroundColor: T.bg,
    borderRadius: 9999,
  },
  progressFill: {
    height: 8,
    backgroundColor: T.success,
    borderRadius: 9999,
  },
  sectionTitle: {
    color: T.text,
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  partyCard: {
    backgroundColor: T.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  partyRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  contractorIconCircle: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(168,85,247,0.15)',
    borderRadius: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  workerIconCircle: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderRadius: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  partyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  roleLabel: {
    color: T.textMuted,
    fontSize: 12,
  },
  partyName: {
    color: T.text,
    fontWeight: '500' as const,
  },
  partyPhone: {
    color: T.textSecondary,
    fontSize: 14,
  },
  skillsRow: {
    flexDirection: 'row' as const,
    marginTop: 4,
  },
  skillBadge: {
    backgroundColor: T.bg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  skillBadgeText: {
    color: T.textSecondary,
    fontSize: 12,
  },
  pendingBadge: {
    backgroundColor: 'rgba(234,179,8,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pendingBadgeText: {
    color: '#EAB308',
    fontSize: 12,
  },
  card: {
    backgroundColor: T.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  termRowBordered: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  termRowNoBorder: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
  },
  termContent: {
    marginLeft: 16,
    flex: 1,
  },
  termLabel: {
    color: T.textMuted,
    fontSize: 12,
  },
  termValue: {
    color: T.text,
  },
  bodyText: {
    color: T.textSecondary,
    lineHeight: 24,
  },
  termsLabel: {
    color: T.textMuted,
    fontSize: 14,
    marginBottom: 8,
  },
  termsValue: {
    color: T.text,
    marginBottom: 16,
  },
  termsBodyText: {
    color: T.textSecondary,
    marginBottom: 16,
  },
  termsBodyTextLast: {
    color: T.textSecondary,
  },
  financeRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 8,
  },
  financeRowLast: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  financeLabel: {
    color: T.textSecondary,
  },
  financeTotal: {
    color: T.text,
    fontWeight: '700' as const,
  },
  financePaid: {
    color: T.success,
  },
  financeEscrow: {
    color: T.amber,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  bottomActionsRow: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  declineButton: {
    flex: 1,
    backgroundColor: T.bg,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  declineButtonText: {
    color: T.textSecondary,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  signButton: {
    flex: 1,
    backgroundColor: T.success,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  signButtonText: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  terminateButton: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  terminateButtonText: {
    color: '#EF4444',
    fontWeight: '600' as const,
    marginLeft: 8,
  },
};
