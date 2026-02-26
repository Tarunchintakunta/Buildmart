import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type Filter = 'all' | 'this_month' | 'last_month';

type Job = {
  id: string;
  title: string;
  customer: string;
  date: string;
  duration: string;
  earnings: number;
  rating: number;
};

const MOCK_JOBS: Job[] = [
  { id: '1', title: 'Wall Plastering - 3BHK', customer: 'Rajesh Kumar', date: 'Feb 24, 2026', duration: '3 days', earnings: 2400, rating: 5 },
  { id: '2', title: 'Foundation Digging', customer: 'Suresh Patel', date: 'Feb 20, 2026', duration: '5 days', earnings: 4000, rating: 4 },
  { id: '3', title: 'Brick Laying - Compound Wall', customer: 'Amit Shah', date: 'Feb 15, 2026', duration: '2 days', earnings: 1600, rating: 5 },
  { id: '4', title: 'Cement Mixing & Hauling', customer: 'Priya Menon', date: 'Jan 28, 2026', duration: '4 days', earnings: 3200, rating: 4 },
  { id: '5', title: 'Site Cleanup & Debris Removal', customer: 'Vikram Reddy', date: 'Jan 18, 2026', duration: '1 day', earnings: 800, rating: 3 },
  { id: '6', title: 'Scaffolding Assembly', customer: 'Deepak Joshi', date: 'Jan 10, 2026', duration: '2 days', earnings: 1800, rating: 5 },
];

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'this_month', label: 'This Month' },
  { key: 'last_month', label: 'Last Month' },
];

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= rating ? 'star' : 'star-outline'}
        size={14}
        color="#F59E0B"
      />
    );
  }
  return stars;
};

export default function JobHistoryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');

  const filteredJobs = MOCK_JOBS.filter((job) => {
    if (filter === 'this_month') return job.date.includes('Feb');
    if (filter === 'last_month') return job.date.includes('Jan');
    return true;
  });

  const totalEarnings = filteredJobs.reduce((sum, job) => sum + job.earnings, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Job History</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* Stats Row */}
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statValue}>120</Text>
            <Text style={s.statLabel}>Total Jobs</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statValue, { color: '#10B981' }]}>Rs.72K</Text>
            <Text style={s.statLabel}>Earnings</Text>
          </View>
          <View style={s.statCard}>
            <View style={s.ratingRow}>
              <Text style={s.statValue}>4.5</Text>
              <Ionicons name="star" size={16} color="#F59E0B" />
            </View>
            <Text style={s.statLabel}>Avg Rating</Text>
          </View>
        </View>

        {/* Filter */}
        <View style={s.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[s.filterBtn, filter === f.key && s.filterBtnActive]}
              activeOpacity={0.7}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[s.filterText, filter === f.key && s.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Job Cards */}
        {filteredJobs.map((job) => (
          <View key={job.id} style={s.jobCard}>
            <View style={s.jobHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.jobTitle}>{job.title}</Text>
                <View style={s.jobMeta}>
                  <Ionicons name="person-outline" size={13} color={T.textSecondary} />
                  <Text style={s.jobMetaText}>{job.customer}</Text>
                </View>
              </View>
              <View style={s.earningsBadge}>
                <Text style={s.earningsText}>Rs.{job.earnings.toLocaleString()}</Text>
              </View>
            </View>

            <View style={s.jobFooter}>
              <View style={s.jobFooterLeft}>
                <View style={s.jobMeta}>
                  <Ionicons name="calendar-outline" size={13} color={T.textSecondary} />
                  <Text style={s.jobMetaText}>{job.date}</Text>
                </View>
                <View style={s.jobMeta}>
                  <Ionicons name="time-outline" size={13} color={T.textSecondary} />
                  <Text style={s.jobMetaText}>{job.duration}</Text>
                </View>
              </View>
              <View style={s.starsRow}>
                {renderStars(job.rating)}
              </View>
            </View>
          </View>
        ))}

        {/* Total Earnings Summary */}
        <View style={s.totalCard}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total Earnings ({filter === 'all' ? 'All Time' : filter === 'this_month' ? 'This Month' : 'Last Month'})</Text>
            <Text style={s.totalValue}>Rs.{totalEarnings.toLocaleString()}</Text>
          </View>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Jobs Shown</Text>
            <Text style={s.totalCount}>{filteredJobs.length}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.text,
  },
  statsRow: {
    flexDirection: 'row' as const,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    alignItems: 'center' as const,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: T.navy,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: T.textMuted,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  filterRow: {
    flexDirection: 'row' as const,
    gap: 10,
    marginBottom: 18,
  },
  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
  },
  filterBtnActive: {
    backgroundColor: T.navy,
    borderColor: T.navy,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  jobCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 4,
  },
  jobMeta: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 5,
  },
  jobMetaText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: T.textSecondary,
  },
  earningsBadge: {
    backgroundColor: '#10B981' + '1A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  earningsText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#10B981',
  },
  jobFooter: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  jobFooterLeft: {
    gap: 4,
  },
  starsRow: {
    flexDirection: 'row' as const,
    gap: 2,
  },
  totalCard: {
    backgroundColor: T.navy,
    borderRadius: 14,
    padding: 18,
    marginTop: 8,
  },
  totalRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#9CA3AF',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#10B981',
  },
  totalCount: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
};
