import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type Period = 'Today' | 'This Week' | 'This Month' | 'This Year';

const PERIODS: Period[] = ['Today', 'This Week', 'This Month', 'This Year'];

const KPI_DATA = [
  { label: 'Total Revenue', value: 'Rs.12.5L', trend: '+12.5%', up: true, icon: 'wallet' as const, color: '#10B981' },
  { label: 'Total Orders', value: '456', trend: '+8.3%', up: true, icon: 'cube' as const, color: '#3B82F6' },
  { label: 'Active Users', value: '1,250', trend: '+15.2%', up: true, icon: 'people' as const, color: '#8B5CF6' },
  { label: 'New Signups', value: '45', trend: '-3.1%', up: false, icon: 'person-add' as const, color: T.amber },
];

const CHART_BARS = [
  { day: 'Mon', height: 65 },
  { day: 'Tue', height: 80 },
  { day: 'Wed', height: 45 },
  { day: 'Thu', height: 95 },
  { day: 'Fri', height: 72 },
  { day: 'Sat', height: 110 },
  { day: 'Sun', height: 55 },
];

const USER_DISTRIBUTION = [
  { role: 'Customer', percentage: 45, color: '#3B82F6' },
  { role: 'Worker', percentage: 25, color: '#10B981' },
  { role: 'Contractor', percentage: 15, color: '#8B5CF6' },
  { role: 'Shopkeeper', percentage: 10, color: T.amber },
  { role: 'Driver', percentage: 5, color: '#EF4444' },
];

const TOP_SHOPS = [
  { rank: 1, name: 'Sharma Building Materials', orders: 89, revenue: 'Rs.2.8L' },
  { rank: 2, name: 'Krishna Cement House', orders: 72, revenue: 'Rs.2.1L' },
  { rank: 3, name: 'Gupta Hardware & Tools', orders: 65, revenue: 'Rs.1.9L' },
  { rank: 4, name: 'Patel Steel Traders', orders: 58, revenue: 'Rs.1.6L' },
  { rank: 5, name: 'Singh Sand & Gravel', orders: 44, revenue: 'Rs.1.2L' },
];

const PLATFORM_HEALTH = [
  { label: 'Uptime', value: '99.8%', icon: 'cloud-done-outline' as const, color: '#10B981' },
  { label: 'Avg Response', value: '120ms', icon: 'speedometer-outline' as const, color: '#3B82F6' },
  { label: 'Pending Issues', value: '7', icon: 'alert-circle-outline' as const, color: '#EF4444' },
];

export default function AdminAnalyticsScreen() {
  const router = useRouter();
  const [activePeriod, setActivePeriod] = useState<Period>('This Month');

  const maxBarHeight = Math.max(...CHART_BARS.map((b) => b.height));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Platform Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Period Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingVertical: 12 }}
        >
          {PERIODS.map((period) => (
            <TouchableOpacity
              key={period}
              style={[s.periodTab, activePeriod === period && s.periodTabActive]}
              onPress={() => setActivePeriod(period)}
            >
              <Text style={[s.periodText, activePeriod === period && s.periodTextActive]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* KPI Cards (2x2) */}
        <View style={s.kpiGrid}>
          {KPI_DATA.map((kpi) => (
            <View key={kpi.label} style={s.kpiCard}>
              <View style={s.kpiHeader}>
                <View style={[s.kpiIcon, { backgroundColor: kpi.color + '18' }]}>
                  <Ionicons name={kpi.icon} size={18} color={kpi.color} />
                </View>
                <View style={[s.trendBadge, { backgroundColor: kpi.up ? '#10B98118' : '#EF444418' }]}>
                  <Ionicons
                    name={kpi.up ? 'arrow-up' : 'arrow-down'}
                    size={12}
                    color={kpi.up ? '#10B981' : '#EF4444'}
                  />
                  <Text style={[s.trendText, { color: kpi.up ? '#10B981' : '#EF4444' }]}>
                    {kpi.trend}
                  </Text>
                </View>
              </View>
              <Text style={s.kpiValue}>{kpi.value}</Text>
              <Text style={s.kpiLabel}>{kpi.label}</Text>
            </View>
          ))}
        </View>

        {/* Revenue Chart */}
        <View style={s.sectionCard}>
          <Text style={s.sectionTitle}>Revenue Trend</Text>
          <Text style={s.sectionSubtitle}>Weekly revenue overview</Text>
          <View style={s.chartContainer}>
            {CHART_BARS.map((bar) => (
              <View key={bar.day} style={s.chartBarCol}>
                <View style={s.chartBarWrapper}>
                  <View
                    style={[
                      s.chartBar,
                      {
                        height: (bar.height / maxBarHeight) * 100,
                        backgroundColor: T.amber,
                      },
                    ]}
                  />
                </View>
                <Text style={s.chartLabel}>{bar.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* User Distribution */}
        <View style={s.sectionCard}>
          <Text style={s.sectionTitle}>User Distribution</Text>
          <Text style={s.sectionSubtitle}>Active users by role</Text>
          <View style={{ gap: 14, marginTop: 16 }}>
            {USER_DISTRIBUTION.map((item) => (
              <View key={item.role} style={s.distRow}>
                <View style={s.distLabelRow}>
                  <View style={[s.distDot, { backgroundColor: item.color }]} />
                  <Text style={s.distRole}>{item.role}</Text>
                  <Text style={s.distPct}>{item.percentage}%</Text>
                </View>
                <View style={s.distTrack}>
                  <View
                    style={[
                      s.distFill,
                      { width: `${item.percentage}%` as any, backgroundColor: item.color },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Top Shops */}
        <View style={s.sectionCard}>
          <Text style={s.sectionTitle}>Top Shops</Text>
          <Text style={s.sectionSubtitle}>Ranked by orders this month</Text>
          <View style={{ gap: 12, marginTop: 16 }}>
            {TOP_SHOPS.map((shop) => (
              <View key={shop.rank} style={s.shopRow}>
                <View
                  style={[
                    s.rankBadge,
                    shop.rank <= 3 && { backgroundColor: T.amber + '18' },
                  ]}
                >
                  <Text
                    style={[
                      s.rankText,
                      shop.rank <= 3 && { color: T.amber },
                    ]}
                  >
                    #{shop.rank}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.shopName}>{shop.name}</Text>
                  <Text style={s.shopMeta}>{shop.orders} orders</Text>
                </View>
                <Text style={s.shopRevenue}>{shop.revenue}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Platform Health */}
        <View style={s.sectionCard}>
          <Text style={s.sectionTitle}>Platform Health</Text>
          <View style={s.healthRow}>
            {PLATFORM_HEALTH.map((item) => (
              <View key={item.label} style={s.healthItem}>
                <View style={[s.healthIcon, { backgroundColor: item.color + '18' }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={s.healthValue}>{item.value}</Text>
                <Text style={s.healthLabel}>{item.label}</Text>
              </View>
            ))}
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

  /* Period Tabs */
  periodTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
  },
  periodTabActive: {
    backgroundColor: T.navy,
    borderColor: T.navy,
  },
  periodText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.textMuted,
  },
  periodTextActive: {
    color: T.white,
  },

  /* KPI Grid */
  kpiGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    paddingHorizontal: 20,
    gap: 12,
  },
  kpiCard: {
    width: '47%' as any,
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
  kpiHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  kpiIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  trendBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 2,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: T.text,
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 12,
    color: T.textMuted,
    fontWeight: '500' as const,
  },

  /* Section Card */
  sectionCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: T.textMuted,
    marginTop: 2,
  },

  /* Chart */
  chartContainer: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    justifyContent: 'space-between' as const,
    marginTop: 20,
    height: 120,
    gap: 8,
  },
  chartBarCol: {
    flex: 1,
    alignItems: 'center' as const,
  },
  chartBarWrapper: {
    flex: 1,
    justifyContent: 'flex-end' as const,
    width: '100%' as any,
  },
  chartBar: {
    width: '100%' as any,
    borderRadius: 6,
    minHeight: 8,
  },
  chartLabel: {
    fontSize: 11,
    color: T.textMuted,
    fontWeight: '500' as const,
    marginTop: 8,
  },

  /* Distribution */
  distRow: {
    gap: 6,
  },
  distLabelRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  distDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  distRole: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600' as const,
    color: T.text,
  },
  distPct: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.text,
  },
  distTrack: {
    height: 8,
    backgroundColor: T.bg,
    borderRadius: 4,
    overflow: 'hidden' as const,
  },
  distFill: {
    height: 8,
    borderRadius: 4,
  },

  /* Top Shops */
  shopRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '800' as const,
    color: T.textMuted,
  },
  shopName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: T.text,
  },
  shopMeta: {
    fontSize: 12,
    color: T.textMuted,
    marginTop: 2,
  },
  shopRevenue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.amber,
  },

  /* Platform Health */
  healthRow: {
    flexDirection: 'row' as const,
    marginTop: 16,
    gap: 12,
  },
  healthItem: {
    flex: 1,
    alignItems: 'center' as const,
    gap: 6,
  },
  healthIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  healthValue: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: T.text,
  },
  healthLabel: {
    fontSize: 11,
    color: T.textMuted,
    fontWeight: '500' as const,
  },
};
