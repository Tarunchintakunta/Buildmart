import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

const JOB_TABS = ['Requests', 'Active', 'Completed'];

const MOCK_JOBS = [
  {
    id: 'j1',
    requestNumber: 'LBR-2024-0001',
    customer: 'Rahul Sharma',
    description: 'Need help unloading cement bags from truck',
    address: '123 MG Road, Koramangala',
    distance: '2.3 km',
    date: '2024-02-15',
    time: '09:00',
    duration: 2,
    rate: 200,
    skill: 'Coolie',
    status: 'pending',
  },
  {
    id: 'j2',
    requestNumber: 'LBR-2024-0002',
    customer: 'Priya Patel',
    description: 'Install ceiling fan and fix wiring issue',
    address: '45 Park Street',
    distance: '3.1 km',
    date: '2024-02-16',
    time: '10:00',
    duration: 3,
    rate: 450,
    skill: 'Electrician',
    status: 'accepted',
  },
  {
    id: 'j3',
    requestNumber: 'LBR-2024-0003',
    customer: 'Amit Kumar',
    description: 'Paint two bedrooms, prep work included',
    address: '78 Brigade Road',
    distance: '4.5 km',
    date: '2024-02-17',
    time: '08:00',
    duration: 8,
    rate: 120,
    skill: 'Painter',
    status: 'in_progress',
  },
  {
    id: 'j4',
    requestNumber: 'LBR-2024-0004',
    customer: 'Sneha Reddy',
    description: 'Help with furniture moving',
    address: '22 Indiranagar',
    distance: '1.8 km',
    date: '2024-02-10',
    time: '14:00',
    duration: 3,
    rate: 150,
    skill: 'Helper',
    status: 'completed',
    rating: 5,
  },
  {
    id: 'j5',
    requestNumber: 'LBR-2024-0005',
    customer: 'Vikram Singh',
    description: 'Fix bathroom plumbing leak',
    address: '90 Whitefield',
    distance: '8.2 km',
    date: '2024-02-08',
    time: '11:00',
    duration: 2,
    rate: 300,
    skill: 'Plumber',
    status: 'completed',
    rating: 4,
  },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'pending':
      return { bg: 'rgba(242,150,13,0.15)', color: '#F2960D', label: 'New Request' };
    case 'accepted':
      return { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', label: 'Accepted' };
    case 'in_progress':
      return { bg: 'rgba(139,92,246,0.15)', color: '#8B5CF6', label: 'In Progress' };
    case 'completed':
      return { bg: 'rgba(16,185,129,0.15)', color: '#10B981', label: 'Completed' };
    case 'cancelled':
      return { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', label: 'Cancelled' };
    default:
      return { bg: 'rgba(107,114,128,0.15)', color: '#6B7280', label: status };
  }
};

export default function JobsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('Requests');

  const filteredJobs = MOCK_JOBS.filter((job) => {
    if (selectedTab === 'Requests') return job.status === 'pending';
    if (selectedTab === 'Active') return ['accepted', 'in_progress'].includes(job.status);
    if (selectedTab === 'Completed') return ['completed', 'cancelled'].includes(job.status);
    return true;
  });

  const pendingCount = MOCK_JOBS.filter((j) => j.status === 'pending').length;

  const renderJob = ({ item: job }: { item: typeof MOCK_JOBS[0] }) => {
    const statusStyle = getStatusStyle(job.status);
    const isPending = job.status === 'pending';
    const isActive = ['accepted', 'in_progress'].includes(job.status);

    return (
      <View
        style={[
          s.card,
          isPending && s.cardPending,
        ]}
      >
        <View style={s.cardHeader}>
          <View style={{ flex: 1 }}>
            <View style={s.rowCenter}>
              {isPending && (
                <View style={s.newBadge}>
                  <Text style={s.newBadgeText}>NEW</Text>
                </View>
              )}
              <Text style={s.requestNumber}>{job.requestNumber}</Text>
            </View>
            <Text style={s.description}>{job.description}</Text>
          </View>
          <View style={[s.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[s.statusText, { color: statusStyle.color }]}>
              {statusStyle.label}
            </Text>
          </View>
        </View>

        {/* Customer & Skill */}
        <View style={s.infoRow}>
          <Ionicons name="person" size={16} color={T.textMuted} />
          <Text style={s.customerText}>{job.customer}</Text>
          <View style={s.skillBadge}>
            <Text style={s.skillText}>{job.skill}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={s.infoRow}>
          <Ionicons name="location" size={16} color={T.textMuted} />
          <Text style={s.addressText} numberOfLines={1}>
            {job.address}
          </Text>
          <Text style={s.distanceText}>{job.distance}</Text>
        </View>

        {/* Date & Time */}
        <View style={s.infoRowBottom}>
          <Ionicons name="calendar" size={16} color={T.textMuted} />
          <Text style={s.dateText}>
            {job.date} at {job.time}
          </Text>
          <Text style={s.dotSeparator}>•</Text>
          <Ionicons name="time" size={16} color={T.textMuted} />
          <Text style={s.dateText}>{job.duration} hours</Text>
        </View>

        {/* Rate */}
        <View style={s.rateSection}>
          <View>
            <Text style={s.rateLabel}>Rate</Text>
            <Text style={s.rateValue}>{'\u20B9'}{job.rate}/hour</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.rateLabel}>Total Earning</Text>
            <Text style={s.totalValue}>
              {'\u20B9'}{(job.rate * job.duration).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Rating for completed jobs */}
        {job.status === 'completed' && job.rating && (
          <View style={s.ratingSection}>
            <Text style={s.ratingLabel}>Customer Rating:</Text>
            <View style={s.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= job.rating! ? 'star' : 'star-outline'}
                  size={18}
                  color="#F59E0B"
                />
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        {isPending && (
          <View style={s.actionsRow}>
            <TouchableOpacity style={[s.actionBtn, s.acceptBtn]}>
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={s.actionBtnTextWhite}>Accept Job</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.actionBtn, s.declineBtn]}>
              <Ionicons name="close-circle" size={18} color={T.textMuted} />
              <Text style={s.actionBtnTextMuted}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}

        {isActive && (
          <View style={s.actionsRow}>
            <TouchableOpacity style={[s.actionBtn, s.navigateBtn]}>
              <Ionicons name="navigate" size={18} color="#FFFFFF" />
              <Text style={s.actionBtnTextWhite}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.actionBtn, s.startBtn]}>
              <Ionicons name="checkmark-done-circle" size={18} color="#FFFFFF" />
              <Text style={s.actionBtnTextWhite}>
                {job.status === 'accepted' ? 'Start Work' : 'Complete'}
              </Text>
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
        <Text style={s.headerTitle}>Jobs</Text>
      </View>

      {/* Tabs */}
      <View style={s.tabBar}>
        {JOB_TABS.map((tab) => {
          const isActive = selectedTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[s.tab, isActive ? s.tabActive : s.tabInactive]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={isActive ? s.tabTextActive : s.tabTextInactive}>
                {tab}
              </Text>
              {tab === 'Requests' && pendingCount > 0 && (
                <View style={[s.badge, isActive ? s.badgeActive : s.badgeInactive]}>
                  <Text style={isActive ? s.badgeTextActive : s.badgeTextInactive}>
                    {pendingCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Jobs List */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyContainer}>
            <Ionicons name="briefcase" size={48} color={T.textSecondary} />
            <Text style={s.emptyText}>
              {selectedTab === 'Requests'
                ? 'No new job requests'
                : selectedTab === 'Active'
                ? 'No active jobs'
                : 'No completed jobs yet'}
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

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    backgroundColor: T.surface,
  } as const,

  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: T.text,
  },

  tabBar: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    backgroundColor: T.surface,
    gap: 8,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  tabActive: {
    backgroundColor: T.navy,
  },

  tabInactive: {
    backgroundColor: T.bg,
  },

  tabTextActive: {
    fontWeight: '500' as const,
    fontSize: 14,
    color: '#FFFFFF',
  },

  tabTextInactive: {
    fontWeight: '500' as const,
    fontSize: 14,
    color: T.textSecondary,
  },

  badge: {
    marginLeft: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  badgeActive: {
    backgroundColor: '#FFFFFF',
  },

  badgeInactive: {
    backgroundColor: T.amber,
  },

  badgeTextActive: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: T.navy,
  },

  badgeTextInactive: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },

  card: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 12,
  } as const,

  cardPending: {
    borderLeftWidth: 4,
    borderLeftColor: T.amber,
  },

  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 12,
  },

  rowCenter: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },

  newBadge: {
    backgroundColor: T.amber,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },

  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700' as const,
  },

  requestNumber: {
    color: T.textMuted,
    fontSize: 13,
  },

  description: {
    color: T.text,
    fontWeight: '600' as const,
    fontSize: 17,
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '500' as const,
  },

  infoRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },

  infoRowBottom: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },

  customerText: {
    color: T.text,
    marginLeft: 8,
    fontSize: 14,
  },

  skillBadge: {
    backgroundColor: T.bg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 12,
  },

  skillText: {
    color: T.textSecondary,
    fontSize: 12,
  },

  addressText: {
    color: T.textSecondary,
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },

  distanceText: {
    color: T.amber,
    fontSize: 14,
    fontWeight: '500' as const,
  },

  dateText: {
    color: T.textSecondary,
    marginLeft: 8,
    fontSize: 14,
  },

  dotSeparator: {
    color: T.textMuted,
    marginHorizontal: 8,
  },

  rateSection: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },

  rateLabel: {
    color: T.textMuted,
    fontSize: 12,
  },

  rateValue: {
    color: T.amber,
    fontWeight: '700' as const,
    fontSize: 17,
  },

  totalValue: {
    color: T.text,
    fontWeight: '700' as const,
    fontSize: 17,
  },

  ratingSection: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },

  ratingLabel: {
    color: T.textSecondary,
    fontSize: 14,
  },

  starsRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginLeft: 8,
  },

  actionsRow: {
    flexDirection: 'row' as const,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
    gap: 12,
  },

  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  acceptBtn: {
    backgroundColor: T.success,
  },

  declineBtn: {
    backgroundColor: T.bg,
  },

  navigateBtn: {
    backgroundColor: T.info,
  },

  startBtn: {
    backgroundColor: T.success,
  },

  actionBtnTextWhite: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
    marginLeft: 8,
    fontSize: 14,
  },

  actionBtnTextMuted: {
    color: T.textSecondary,
    fontWeight: '600' as const,
    marginLeft: 8,
    fontSize: 14,
  },

  emptyContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 48,
  },

  emptyText: {
    color: T.textSecondary,
    marginTop: 16,
    fontSize: 15,
  },
};
