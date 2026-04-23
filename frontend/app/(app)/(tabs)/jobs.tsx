import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LightTheme } from '../../../src/theme/colors';

const T = LightTheme;

const STATUS_TABS = ['All', 'Active', 'Completed', 'Pending'] as const;
type StatusTab = typeof STATUS_TABS[number];

type JobStatus = 'active' | 'completed' | 'pending' | 'accepted';

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; icon: string }> = {
  active:    { label: 'Active',    bg: '#ECFDF5', color: '#10B981', icon: 'play-circle' },
  completed: { label: 'Completed', bg: '#EFF6FF', color: '#3B82F6', icon: 'checkmark-circle' },
  pending:   { label: 'Pending',   bg: '#FFFBEB', color: '#F59E0B', icon: 'time' },
  accepted:  { label: 'Accepted',  bg: '#F5F3FF', color: '#8B5CF6', icon: 'calendar-outline' },
};

const MOCK_JOBS = [
  {
    id: 'j1',
    customer: 'Rajesh Constructions',
    jobType: 'Masonry Work',
    location: 'Gachibowli, Hyderabad',
    startDate: '20 Apr 2026',
    endDate: '30 Apr 2026',
    days: 10,
    dailyRate: 800,
    status: 'active' as JobStatus,
    description: 'Brickwork for 2nd floor extension of commercial building',
  },
  {
    id: 'j2',
    customer: 'Priya Patel',
    jobType: 'Plaster & Tiling',
    location: 'Banjara Hills, Hyderabad',
    startDate: '15 Apr 2026',
    endDate: '18 Apr 2026',
    days: 3,
    dailyRate: 800,
    status: 'completed' as JobStatus,
    description: 'Tiling for bathroom renovation',
  },
  {
    id: 'j3',
    customer: 'BuildRight Pvt Ltd',
    jobType: 'RCC Foundation Work',
    location: 'Kondapur, Hyderabad',
    startDate: '25 Apr 2026',
    endDate: '5 May 2026',
    days: 8,
    dailyRate: 800,
    status: 'accepted' as JobStatus,
    description: 'Foundation slab work for residential project',
  },
  {
    id: 'j4',
    customer: 'Anand Sharma',
    jobType: 'Block Work',
    location: 'Kukatpally, Hyderabad',
    startDate: '1 May 2026',
    endDate: '3 May 2026',
    days: 2,
    dailyRate: 800,
    status: 'pending' as JobStatus,
    description: 'Partition wall block work for office space',
  },
  {
    id: 'j5',
    customer: 'Hyderabad Infra Projects',
    jobType: 'Waterproofing',
    location: 'Secunderabad, Hyderabad',
    startDate: '8 Mar 2026',
    endDate: '12 Mar 2026',
    days: 4,
    dailyRate: 800,
    status: 'completed' as JobStatus,
    description: 'Terrace waterproofing with membrane application',
  },
];

type Job = typeof MOCK_JOBS[0];

function JobCard({ job, index }: { job: Job; index: number }) {
  const router = useRouter();
  const cfg = STATUS_CONFIG[job.status];
  const total = job.days * job.dailyRate;

  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify()}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        {/* Top */}
        <View style={styles.cardTop}>
          <View style={styles.cardTopLeft}>
            <Text style={styles.customerName}>{job.customer}</Text>
            <Text style={styles.jobType}>{job.jobType}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icon as any} size={13} color={cfg.color} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={13} color={T.textMuted} />
          <Text style={styles.metaText}>{job.location}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={13} color={T.textMuted} />
          <Text style={styles.metaText}>{job.startDate} → {job.endDate}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>{job.description}</Text>

        {/* Bottom: earnings + actions */}
        <View style={styles.cardBottom}>
          <View>
            <Text style={styles.earningsLabel}>{job.days} days × ₹{job.dailyRate}</Text>
            <Text style={styles.earningsValue}>₹{total.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.actions}>
            {job.status === 'accepted' && (
              <Pressable style={styles.actionBtn}>
                <Ionicons name="play-circle" size={14} color={T.success} />
                <Text style={[styles.actionBtnText, { color: T.success }]}>Start Work</Text>
              </Pressable>
            )}
            {job.status === 'active' && (
              <Pressable style={[styles.actionBtn, styles.actionBtnBlue]}>
                <Ionicons name="checkmark-done-outline" size={14} color="#3B82F6" />
                <Text style={[styles.actionBtnText, { color: '#3B82F6' }]}>Complete</Text>
              </Pressable>
            )}
            {(job.status === 'pending' || job.status === 'accepted') && (
              <Pressable style={[styles.actionBtn, styles.actionBtnRed]}>
                <Ionicons name="close-circle-outline" size={14} color="#EF4444" />
                <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Decline</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function JobsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<StatusTab>('All');

  const filtered = MOCK_JOBS.filter(job => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return job.status === 'active' || job.status === 'accepted';
    if (activeTab === 'Completed') return job.status === 'completed';
    if (activeTab === 'Pending') return job.status === 'pending';
    return true;
  });

  const totalEarnings = MOCK_JOBS
    .filter(j => j.status === 'completed')
    .reduce((sum, j) => sum + j.days * j.dailyRate, 0);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Jobs</Text>
        <Pressable
          style={styles.availabilityBtn}
          onPress={() => router.push('/(app)/availability')}
        >
          <Ionicons name="toggle" size={18} color={T.navy} />
          <Text style={styles.availabilityBtnText}>Availability</Text>
        </Pressable>
      </View>

      {/* Earnings summary */}
      <Animated.View entering={FadeInDown.springify()} style={styles.earningsBanner}>
        <View style={styles.earningsLeft}>
          <Text style={styles.earningsBannerLabel}>Total Earned</Text>
          <Text style={styles.earningsBannerValue}>₹{totalEarnings.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.earningsRight}>
          <View style={styles.earningsStat}>
            <Text style={styles.earningsStatValue}>{MOCK_JOBS.filter(j => j.status === 'completed').length}</Text>
            <Text style={styles.earningsStatLabel}>Completed</Text>
          </View>
          <View style={styles.earningsDivider} />
          <View style={styles.earningsStat}>
            <Text style={styles.earningsStatValue}>{MOCK_JOBS.filter(j => j.status === 'active').length}</Text>
            <Text style={styles.earningsStatLabel}>Active</Text>
          </View>
        </View>
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {STATUS_TABS.map(tab => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <JobCard job={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="briefcase-outline" size={56} color={T.textMuted} />
            <Text style={styles.emptyTitle}>No jobs yet</Text>
            <Text style={styles.emptySubtitle}>Make yourself available to start receiving job requests</Text>
            <Pressable
              style={styles.emptyBtn}
              onPress={() => router.push('/(app)/availability')}
            >
              <Text style={styles.emptyBtnText}>Set Availability</Text>
            </Pressable>
          </View>
        }
      />
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
  availabilityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
  },
  availabilityBtnText: { fontSize: 13, fontWeight: '600', color: T.navy },

  earningsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: T.navy,
    marginHorizontal: 16,
    marginVertical: 14,
    borderRadius: 16,
    padding: 18,
  },
  earningsLeft: {},
  earningsBannerLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  earningsBannerValue: { fontSize: 28, fontWeight: '900', color: T.amber },
  earningsRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  earningsStat: { alignItems: 'center' },
  earningsStatValue: { fontSize: 22, fontWeight: '800', color: '#fff' },
  earningsStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  earningsDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: T.navy },
  tabText: { fontSize: 13, fontWeight: '600', color: T.textMuted },
  tabTextActive: { color: T.navy },

  listContent: { padding: 16, paddingBottom: 32 },

  card: {
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 12,
  },
  cardPressed: { opacity: 0.93 },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTopLeft: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: '700', color: T.navy, marginBottom: 2 },
  jobType: { fontSize: 13, color: T.textSecondary },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    marginLeft: 10,
  },
  statusText: { fontSize: 12, fontWeight: '700' },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  metaText: { fontSize: 13, color: T.textMuted },
  description: { fontSize: 13, color: T.textSecondary, marginTop: 6, lineHeight: 18, marginBottom: 12 },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  earningsLabel: { fontSize: 11, color: T.textMuted, marginBottom: 2 },
  earningsValue: { fontSize: 20, fontWeight: '800', color: T.navy },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  actionBtnBlue: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  actionBtnRed: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  actionBtnText: { fontSize: 12, fontWeight: '700' },

  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: T.navy, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: T.textSecondary, marginTop: 8, textAlign: 'center', lineHeight: 20 },
  emptyBtn: {
    marginTop: 20, backgroundColor: T.navy,
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12,
  },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
