import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type Site = {
  id: string;
  name: string;
  address: string;
  startDate: string;
  progress: number;
  workers: number;
  budgetSpent: number;
  budgetTotal: number;
  avatarColors: string[];
};

const ACTIVE_SITES: Site[] = [
  {
    id: '1',
    name: 'Greenfield Residency',
    address: '12, MG Road, Bengaluru',
    startDate: '10 Jan 2026',
    progress: 68,
    workers: 5,
    budgetSpent: 8.2,
    budgetTotal: 12,
    avatarColors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'],
  },
  {
    id: '2',
    name: 'Sunrise Commercial Complex',
    address: '45, Whitefield, Bengaluru',
    startDate: '25 Dec 2025',
    progress: 42,
    workers: 4,
    budgetSpent: 5.5,
    budgetTotal: 18,
    avatarColors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'],
  },
  {
    id: '3',
    name: 'Lakeview Villa',
    address: '8, Hebbal, Bengaluru',
    startDate: '02 Feb 2026',
    progress: 15,
    workers: 3,
    budgetSpent: 1.8,
    budgetTotal: 7,
    avatarColors: ['#8B5CF6', '#F59E0B', '#3B82F6'],
  },
];

const COMPLETED_SITES: Site[] = [
  {
    id: '4',
    name: 'Palm Heights Apartment',
    address: '22, Koramangala, Bengaluru',
    startDate: '15 Jun 2025',
    progress: 100,
    workers: 6,
    budgetSpent: 14,
    budgetTotal: 14.5,
    avatarColors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#6B7280'],
  },
  {
    id: '5',
    name: 'Metro Office Park',
    address: '3, Electronic City, Bengaluru',
    startDate: '01 Mar 2025',
    progress: 100,
    workers: 8,
    budgetSpent: 22,
    budgetTotal: 23,
    avatarColors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280', '#EC4899', '#14B8A6'],
  },
];

const STATS = [
  { label: 'Total Sites', value: '5', icon: 'business' as const, color: '#3B82F6' },
  { label: 'Active', value: '3', icon: 'construct' as const, color: T.amber },
  { label: 'Workers', value: '12', icon: 'people' as const, color: '#10B981' },
  { label: 'Budget', value: 'Rs.25L', icon: 'wallet' as const, color: '#8B5CF6' },
];

export default function SiteManagementScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const sites = activeTab === 'active' ? ACTIVE_SITES : COMPLETED_SITES;

  const renderAvatars = (colors: string[]) => {
    const maxShow = 4;
    const shown = colors.slice(0, maxShow);
    const extra = colors.length - maxShow;
    return (
      <View style={s.avatarRow}>
        {shown.map((color, i) => (
          <View
            key={i}
            style={[
              s.avatar,
              { backgroundColor: color, marginLeft: i === 0 ? 0 : -8, zIndex: maxShow - i },
            ]}
          >
            <Ionicons name="person" size={10} color="#FFF" />
          </View>
        ))}
        {extra > 0 && (
          <View style={[s.avatar, { backgroundColor: T.textMuted, marginLeft: -8, zIndex: 0 }]}>
            <Text style={s.avatarExtra}>+{extra}</Text>
          </View>
        )}
        <Text style={s.workerCount}>{colors.length} workers</Text>
      </View>
    );
  };

  const renderSiteCard = (site: Site) => {
    const budgetPct = Math.round((site.budgetSpent / site.budgetTotal) * 100);
    return (
      <View key={site.id} style={s.siteCard}>
        {/* Site header */}
        <View style={s.siteHeader}>
          <View style={{ flex: 1 }}>
            <Text style={s.siteName}>{site.name}</Text>
            <View style={s.addressRow}>
              <Ionicons name="location-outline" size={13} color={T.textMuted} />
              <Text style={s.addressText}>{site.address}</Text>
            </View>
          </View>
          <View style={s.dateBadge}>
            <Ionicons name="calendar-outline" size={12} color={T.textSecondary} />
            <Text style={s.dateText}>{site.startDate}</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={s.progressSection}>
          <View style={s.progressLabelRow}>
            <Text style={s.progressLabel}>Progress</Text>
            <Text style={[s.progressPct, site.progress === 100 && { color: T.success }]}>
              {site.progress}%
            </Text>
          </View>
          <View style={s.progressTrack}>
            <View
              style={[
                s.progressFill,
                {
                  width: `${site.progress}%` as any,
                  backgroundColor: site.progress === 100 ? T.success : T.success,
                },
              ]}
            />
          </View>
        </View>

        {/* Workers */}
        {renderAvatars(site.avatarColors)}

        {/* Budget */}
        <View style={s.budgetRow}>
          <Ionicons name="wallet-outline" size={15} color={T.amber} />
          <Text style={s.budgetSpent}>Rs.{site.budgetSpent}L</Text>
          <Text style={s.budgetSep}>/</Text>
          <Text style={s.budgetTotal}>Rs.{site.budgetTotal}L</Text>
          <View style={s.budgetPctBadge}>
            <Text style={s.budgetPctText}>{budgetPct}%</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={s.actionRow}>
          <TouchableOpacity style={s.detailsBtn}>
            <Ionicons name="eye-outline" size={16} color={T.navy} />
            <Text style={s.detailsBtnText}>View Details</Text>
          </TouchableOpacity>
          {activeTab === 'active' && (
            <TouchableOpacity style={s.addWorkerBtn}>
              <Ionicons name="person-add-outline" size={16} color={T.white} />
              <Text style={s.addWorkerBtnText}>Add Worker</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Site Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Stats Summary */}
        <View style={s.statsRow}>
          {STATS.map((stat) => (
            <View key={stat.label} style={s.statCard}>
              <View style={[s.statIcon, { backgroundColor: stat.color + '18' }]}>
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={s.tabRow}>
          <TouchableOpacity
            style={[s.tab, activeTab === 'active' && s.tabActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[s.tabText, activeTab === 'active' && s.tabTextActive]}>
              Active Sites
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tab, activeTab === 'completed' && s.tabActive]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[s.tabText, activeTab === 'completed' && s.tabTextActive]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Site Cards */}
        <View style={s.siteList}>{sites.map(renderSiteCard)}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: T.text,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row' as const,
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    paddingVertical: 14,
    alignItems: 'center' as const,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: T.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: T.textMuted,
    fontWeight: '500' as const,
  },

  /* Tabs */
  tabRow: {
    flexDirection: 'row' as const,
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 24,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
  },
  tabActive: {
    backgroundColor: T.navy,
    borderColor: T.navy,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: T.textMuted,
  },
  tabTextActive: {
    color: T.white,
  },

  /* Site List */
  siteList: {
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 14,
  },

  /* Site Card */
  siteCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  siteHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 14,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  addressText: {
    fontSize: 12,
    color: T.textMuted,
  },
  dateBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    backgroundColor: T.bg,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  dateText: {
    fontSize: 11,
    color: T.textSecondary,
    fontWeight: '500' as const,
  },

  /* Progress */
  progressSection: {
    marginBottom: 14,
  },
  progressLabelRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: T.textSecondary,
    fontWeight: '500' as const,
  },
  progressPct: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: T.text,
  },
  progressTrack: {
    height: 6,
    backgroundColor: T.bg,
    borderRadius: 3,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: T.success,
  },

  /* Avatars */
  avatarRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 14,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: T.surface,
  },
  avatarExtra: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  workerCount: {
    marginLeft: 10,
    fontSize: 12,
    color: T.textSecondary,
    fontWeight: '500' as const,
  },

  /* Budget */
  budgetRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 14,
    gap: 6,
  },
  budgetSpent: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.text,
  },
  budgetSep: {
    fontSize: 14,
    color: T.textMuted,
  },
  budgetTotal: {
    fontSize: 14,
    color: T.textMuted,
  },
  budgetPctBadge: {
    backgroundColor: T.amber + '18',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginLeft: 4,
  },
  budgetPctText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: T.amber,
  },

  /* Actions */
  actionRow: {
    flexDirection: 'row' as const,
    gap: 10,
  },
  detailsBtn: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.navy,
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.navy,
  },
  addWorkerBtn: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: T.navy,
  },
  addWorkerBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.white,
  },
};
