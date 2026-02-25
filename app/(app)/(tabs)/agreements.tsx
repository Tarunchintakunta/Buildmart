import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

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
      return { bg: 'rgba(16,185,129,0.15)', color: T.success, label: 'Active' };
    case 'pending_signature':
      return { bg: 'rgba(242,150,13,0.15)', color: T.amber, label: 'Pending Signature' };
    case 'completed':
      return { bg: 'rgba(59,130,246,0.15)', color: T.info, label: 'Completed' };
    case 'terminated':
      return { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', label: 'Terminated' };
    case 'draft':
      return { bg: 'rgba(107,114,128,0.15)', color: T.textSecondary, label: 'Draft' };
    default:
      return { bg: 'rgba(107,114,128,0.15)', color: T.textSecondary, label: status };
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
        style={[
          s.card,
          isPending && { borderLeftWidth: 4, borderLeftColor: T.amber },
        ]}
        onPress={() => router.push(`/(app)/agreement/${agreement.id}`)}
        activeOpacity={0.7}
      >
        {/* Title Row */}
        <View style={s.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={s.cardTitle}>{agreement.title}</Text>
            <Text style={s.cardSubtitle}>{agreement.agreementNumber}</Text>
          </View>
          <View style={[s.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[s.statusText, { color: statusStyle.color }]}>
              {statusStyle.label}
            </Text>
          </View>
        </View>

        {/* Parties */}
        <View style={s.infoRow}>
          <Ionicons name="business" size={16} color={T.textMuted} />
          <Text style={s.infoText}>
            {isWorker ? agreement.contractor : agreement.worker}
          </Text>
        </View>

        {/* Location */}
        <View style={[s.infoRow, { marginBottom: 14 }]}>
          <Ionicons name="location" size={16} color={T.textMuted} />
          <Text style={s.infoTextMuted} numberOfLines={1}>
            {agreement.workLocation}
          </Text>
        </View>

        {/* Duration & Rate */}
        <View style={s.dividerRow}>
          <View>
            <Text style={s.labelSmall}>Duration</Text>
            <Text style={s.valueText}>
              {agreement.startDate} - {agreement.endDate}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.labelSmall}>Rate</Text>
            <Text style={s.rateText}>
              {getRateLabel(agreement.rateType, agreement.rateAmount)}
            </Text>
          </View>
        </View>

        {/* Total Value */}
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Total Contract Value</Text>
          <Text style={s.totalValue}>
            ₹{agreement.totalValue.toLocaleString()}
          </Text>
        </View>

        {/* Actions for pending agreements */}
        {isPending && isWorker && (
          <View style={s.actionsRow}>
            <TouchableOpacity style={s.signButton} activeOpacity={0.7}>
              <Ionicons name="checkmark-circle" size={18} color={T.white} />
              <Text style={s.signButtonText}>Sign Agreement</Text>
            </TouchableOpacity>
            <View style={{ width: 12 }} />
            <TouchableOpacity style={s.declineButton} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color={T.textMuted} />
              <Text style={s.declineButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>
          {isContractor ? 'My Contracts' : 'Agreements'}
        </Text>
        {isContractor && (
          <TouchableOpacity
            style={s.newButton}
            onPress={() => router.push('/(app)/agreement/create')}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={18} color={T.white} />
            <Text style={s.newButtonText}>New</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={s.tabBar}>
        {AGREEMENT_TABS.map((tab) => {
          const isActive = selectedTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                s.tab,
                isActive ? s.tabActive : s.tabInactive,
              ]}
              onPress={() => setSelectedTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  s.tabText,
                  isActive ? s.tabTextActive : s.tabTextInactive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Pending Notification for Workers */}
      {isWorker && selectedTab === 'All' && MOCK_AGREEMENTS.some(a => a.status === 'pending_signature') && (
        <View style={s.alertBanner}>
          <Ionicons name="alert-circle" size={24} color={T.amber} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={s.alertTitle}>Action Required</Text>
            <Text style={s.alertSubtitle}>
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
          <View style={s.emptyContainer}>
            <Ionicons name="document-text" size={48} color={T.textSecondary} />
            <Text style={s.emptyText}>No agreements found</Text>
            {isContractor && (
              <TouchableOpacity
                style={s.emptyButton}
                onPress={() => router.push('/(app)/agreement/create')}
                activeOpacity={0.7}
              >
                <Text style={s.emptyButtonText}>Create Agreement</Text>
              </TouchableOpacity>
            )}
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
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: T.text,
  },
  newButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.amber,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  newButtonText: {
    color: T.white,
    fontWeight: '600' as const,
    fontSize: 14,
    marginLeft: 4,
  },

  // Tabs
  tabBar: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9999,
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
  },
  tabTextActive: {
    color: T.white,
  },
  tabTextInactive: {
    color: T.textSecondary,
  },

  // Alert Banner
  alertBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: 'rgba(242,150,13,0.1)',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: 'rgba(242,150,13,0.3)',
  },
  alertTitle: {
    color: T.amber,
    fontWeight: '700' as const,
    fontSize: 15,
  },
  alertSubtitle: {
    color: T.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },

  // Card
  card: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: T.textMuted,
    marginTop: 2,
  },

  // Status Badge
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },

  // Info Rows
  infoRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 6,
  },
  infoText: {
    color: T.textSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
  infoTextMuted: {
    color: T.textMuted,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },

  // Duration & Rate
  dividerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  labelSmall: {
    fontSize: 11,
    color: T.textMuted,
    fontWeight: '500' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  valueText: {
    fontSize: 14,
    color: T.text,
    fontWeight: '500' as const,
    marginTop: 2,
  },
  rateText: {
    fontSize: 15,
    color: T.amber,
    fontWeight: '700' as const,
    marginTop: 2,
  },

  // Total Row
  totalRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  totalLabel: {
    fontSize: 14,
    color: T.textSecondary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: T.text,
  },

  // Actions
  actionsRow: {
    flexDirection: 'row' as const,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  signButton: {
    flex: 1,
    backgroundColor: T.success,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  signButtonText: {
    color: T.white,
    fontWeight: '700' as const,
    fontSize: 14,
    marginLeft: 8,
  },
  declineButton: {
    flex: 1,
    backgroundColor: T.bg,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 1,
    borderColor: T.border,
  },
  declineButtonText: {
    color: T.textSecondary,
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
    fontSize: 15,
    marginTop: 16,
  },
  emptyButton: {
    backgroundColor: T.amber,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 9999,
    marginTop: 16,
  },
  emptyButtonText: {
    color: T.white,
    fontWeight: '700' as const,
    fontSize: 15,
  },
};
