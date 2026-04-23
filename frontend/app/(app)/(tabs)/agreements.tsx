import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../../src/hooks/useAuth';
import { LightTheme } from '../../../src/theme/colors';

const T = LightTheme;

const STATUS_TABS = ['All', 'Active', 'Pending', 'Completed', 'Terminated'] as const;
type StatusTab = typeof STATUS_TABS[number];

type AgreementStatus = 'draft' | 'pending_signature' | 'active' | 'completed' | 'terminated';

const STATUS_CONFIG: Record<AgreementStatus, { label: string; bg: string; color: string; icon: string }> = {
  draft:             { label: 'Draft',          bg: '#F9FAFB', color: '#6B7280', icon: 'document-outline' },
  pending_signature: { label: 'Awaiting Sign',  bg: '#FFFBEB', color: '#F59E0B', icon: 'time-outline' },
  active:            { label: 'Active',          bg: '#ECFDF5', color: '#10B981', icon: 'checkmark-circle' },
  completed:         { label: 'Completed',       bg: '#EFF6FF', color: '#3B82F6', icon: 'trophy-outline' },
  terminated:        { label: 'Terminated',      bg: '#FEF2F2', color: '#EF4444', icon: 'close-circle' },
};

const MOCK_AGREEMENTS = [
  {
    id: 'agr001',
    contractId: 'BM-AGR-2026-001',
    contractor: 'Rajesh Constructions Pvt Ltd',
    contractorName: 'Rajesh Sharma',
    worker: 'Ramu Yadav',
    workerSkill: 'Mason',
    jobType: 'Masonry & Plastering',
    description: 'Complete brickwork and plastering for G+2 residential building at Gachibowli.',
    location: 'Gachibowli, Hyderabad',
    startDate: '01 May 2026',
    duration: 45,
    dailyRate: 800,
    totalValue: 36000,
    status: 'active' as AgreementStatus,
    contractorSigned: true,
    workerSigned: true,
    createdDate: '20 Apr 2026',
  },
  {
    id: 'agr002',
    contractId: 'BM-AGR-2026-002',
    contractor: 'BuildRight Infrastructure',
    contractorName: 'Anil Kumar',
    worker: 'Venkat Rao',
    workerSkill: 'Electrician',
    jobType: 'Electrical Installation',
    description: 'Full electrical wiring, panel installation, and safety testing for commercial complex.',
    location: 'HITEC City, Hyderabad',
    startDate: '10 May 2026',
    duration: 30,
    dailyRate: 1200,
    totalValue: 36000,
    status: 'pending_signature' as AgreementStatus,
    contractorSigned: true,
    workerSigned: false,
    createdDate: '22 Apr 2026',
  },
  {
    id: 'agr003',
    contractId: 'BM-AGR-2026-003',
    contractor: 'Sharma Builders',
    contractorName: 'Sunil Sharma',
    worker: 'Mohammed Khader',
    workerSkill: 'Carpenter',
    jobType: 'Modular Kitchen & Carpentry',
    description: 'Custom modular kitchen, wardrobe, and false ceiling installation for 3BHK apartment.',
    location: 'Banjara Hills, Hyderabad',
    startDate: '15 Mar 2026',
    duration: 20,
    dailyRate: 1100,
    totalValue: 22000,
    status: 'completed' as AgreementStatus,
    contractorSigned: true,
    workerSigned: true,
    createdDate: '10 Mar 2026',
  },
  {
    id: 'agr004',
    contractId: 'BM-AGR-2026-004',
    contractor: 'Hyderabad Infra Projects',
    contractorName: 'Venkata Rao Reddy',
    worker: 'Srinivas Reddy',
    workerSkill: 'Welder',
    jobType: 'Steel Fabrication',
    description: 'Structural steel work and railing fabrication for industrial warehouse.',
    location: 'Uppal, Hyderabad',
    startDate: '05 Feb 2026',
    duration: 15,
    dailyRate: 1300,
    totalValue: 19500,
    status: 'terminated' as AgreementStatus,
    contractorSigned: true,
    workerSigned: true,
    createdDate: '01 Feb 2026',
  },
];

type Agreement = typeof MOCK_AGREEMENTS[0];

function AgreementCard({ agreement, index, isContractor }: { agreement: Agreement; index: number; isContractor: boolean }) {
  const router = useRouter();
  const cfg = STATUS_CONFIG[agreement.status];

  const canSign = agreement.status === 'pending_signature' && !agreement.workerSigned;

  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify()}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => router.push(`/(app)/agreement/${agreement.id}`)}
      >
        {/* Contract ID + Status */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.contractId}>{agreement.contractId}</Text>
            <Text style={styles.createdDate}>Created {agreement.createdDate}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icon as any} size={13} color={cfg.color} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        {/* Parties */}
        <View style={styles.partiesRow}>
          <View style={styles.partyBox}>
            <Ionicons name="business-outline" size={14} color={T.navy} />
            <View style={styles.partyInfo}>
              <Text style={styles.partyLabel}>Contractor</Text>
              <Text style={styles.partyName} numberOfLines={1}>{agreement.contractorName}</Text>
            </View>
          </View>
          <View style={styles.partiesArrow}>
            <Ionicons name="swap-horizontal" size={18} color={T.textMuted} />
          </View>
          <View style={styles.partyBox}>
            <Ionicons name="person-outline" size={14} color={T.amber} />
            <View style={styles.partyInfo}>
              <Text style={styles.partyLabel}>Worker</Text>
              <Text style={styles.partyName} numberOfLines={1}>{agreement.worker}</Text>
            </View>
          </View>
        </View>

        {/* Job info */}
        <View style={styles.jobRow}>
          <Ionicons name="briefcase-outline" size={13} color={T.textMuted} />
          <Text style={styles.jobType}>{agreement.jobType}</Text>
          <Text style={styles.jobDot}>·</Text>
          <Text style={styles.jobDuration}>{agreement.duration} days</Text>
        </View>
        <Text style={styles.jobDescription} numberOfLines={2}>{agreement.description}</Text>

        {/* Value + signatures */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.valueLabel}>Contract Value</Text>
            <Text style={styles.valueAmount}>₹{agreement.totalValue.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.signaturesRow}>
            <View style={[styles.sigDot, { backgroundColor: agreement.contractorSigned ? T.success : T.border }]} />
            <View style={[styles.sigDot, { backgroundColor: agreement.workerSigned ? T.success : T.border }]} />
            {canSign && (
              <Pressable
                style={styles.signBtn}
                onPress={() => router.push(`/(app)/agreement/${agreement.id}`)}
              >
                <Text style={styles.signBtnText}>Sign Now</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function AgreementsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<StatusTab>('All');

  const isContractor = user?.role === 'contractor';

  const filtered = MOCK_AGREEMENTS.filter(agr => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return agr.status === 'active';
    if (activeTab === 'Pending') return agr.status === 'pending_signature' || agr.status === 'draft';
    if (activeTab === 'Completed') return agr.status === 'completed';
    if (activeTab === 'Terminated') return agr.status === 'terminated';
    return true;
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contracts</Text>
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>{MOCK_AGREEMENTS.filter(a => a.status === 'active').length}</Text>
            <Text style={styles.headerStatLabel}>Active</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>{MOCK_AGREEMENTS.length}</Text>
            <Text style={styles.headerStatLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Status Tabs */}
      <View style={styles.tabScroll}>
        <FlatList
          data={STATUS_TABS as unknown as StatusTab[]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          contentContainerStyle={styles.tabList}
          renderItem={({ item: tab }) => (
            <Pressable
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </Pressable>
          )}
        />
      </View>

      {/* Agreements list */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <AgreementCard agreement={item} index={index} isContractor={isContractor} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={56} color={T.textMuted} />
            <Text style={styles.emptyTitle}>No contracts found</Text>
            <Text style={styles.emptySubtitle}>
              {isContractor ? 'Create an agreement to get started' : 'Your contracts will appear here'}
            </Text>
          </View>
        }
      />

      {/* FAB for contractors */}
      {isContractor && (
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={() => router.push('/(app)/agreement/create')}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  headerTitle: { fontSize: 26, fontWeight: '700', color: T.navy },
  headerStats: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerStat: { alignItems: 'center' },
  headerStatValue: { fontSize: 18, fontWeight: '800', color: T.navy },
  headerStatLabel: { fontSize: 11, color: T.textMuted },
  headerStatDivider: { width: 1, height: 24, backgroundColor: T.border },

  tabScroll: {
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  tabList: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
  },
  tabActive: { backgroundColor: T.navy, borderColor: T.navy },
  tabText: { fontSize: 13, fontWeight: '600', color: T.textSecondary },
  tabTextActive: { color: '#fff' },

  listContent: { padding: 16, paddingBottom: 80 },

  card: {
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 12,
  },
  cardPressed: { opacity: 0.93 },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  contractId: { fontSize: 14, fontWeight: '800', color: T.navy },
  createdDate: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  statusText: { fontSize: 12, fontWeight: '700' },

  partiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  partyBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  partiesArrow: { paddingHorizontal: 4 },
  partyInfo: { flex: 1 },
  partyLabel: { fontSize: 10, color: T.textMuted, marginBottom: 1 },
  partyName: { fontSize: 13, fontWeight: '700', color: T.navy },

  jobRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  jobType: { fontSize: 13, fontWeight: '600', color: T.textSecondary },
  jobDot: { color: T.textMuted },
  jobDuration: { fontSize: 13, color: T.textMuted },
  jobDescription: { fontSize: 13, color: T.textMuted, lineHeight: 18, marginBottom: 12 },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  valueLabel: { fontSize: 11, color: T.textMuted, marginBottom: 2 },
  valueAmount: { fontSize: 20, fontWeight: '800', color: T.navy },
  signaturesRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sigDot: { width: 10, height: 10, borderRadius: 5 },
  signBtn: {
    backgroundColor: T.amber,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    marginLeft: 6,
  },
  signBtnText: { fontSize: 12, fontWeight: '800', color: '#fff' },

  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: T.navy, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: T.textSecondary, marginTop: 8, textAlign: 'center', lineHeight: 20 },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: T.amber,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.amber,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabPressed: { opacity: 0.85 },
});
