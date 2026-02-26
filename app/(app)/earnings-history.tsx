import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type Period = 'today' | 'week' | 'month' | 'all';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All Time' },
];

const EARNINGS_DATA: Record<Period, { total: string; deliveries: string; avg: string; tips: string; bonuses: string }> = {
  today: { total: '1,250', deliveries: '5', avg: '250', tips: '120', bonuses: '0' },
  week: { total: '8,450', deliveries: '32', avg: '264', tips: '780', bonuses: '500' },
  month: { total: '34,200', deliveries: '128', avg: '267', tips: '3,100', bonuses: '2,000' },
  all: { total: '1,45,600', deliveries: '542', avg: '269', tips: '12,400', bonuses: '8,500' },
};

type EarningEntry = {
  id: string;
  orderNumber: string;
  customer: string;
  amount: string;
  tip: string;
  time: string;
  type: 'standard' | 'express' | 'heavy';
};

type EarningGroup = {
  date: string;
  dailyTotal: string;
  entries: EarningEntry[];
};

const EARNINGS_LIST: EarningGroup[] = [
  {
    date: 'Today, 26 Feb',
    dailyTotal: '1,250',
    entries: [
      { id: '1', orderNumber: 'BM-8834', customer: 'Rajesh Kumar', amount: '320', tip: '50', time: '2:30 PM', type: 'express' },
      { id: '2', orderNumber: 'BM-8831', customer: 'Priya Construction', amount: '280', tip: '0', time: '12:15 PM', type: 'standard' },
      { id: '3', orderNumber: 'BM-8828', customer: 'Suresh Builders', amount: '350', tip: '40', time: '10:00 AM', type: 'heavy' },
      { id: '4', orderNumber: 'BM-8825', customer: 'Kumar & Sons', amount: '180', tip: '30', time: '8:45 AM', type: 'standard' },
      { id: '5', orderNumber: 'BM-8822', customer: 'Metro Interiors', amount: '120', tip: '0', time: '7:30 AM', type: 'standard' },
    ],
  },
  {
    date: 'Yesterday, 25 Feb',
    dailyTotal: '1,480',
    entries: [
      { id: '6', orderNumber: 'BM-8818', customer: 'Arun Homes', amount: '400', tip: '60', time: '4:00 PM', type: 'heavy' },
      { id: '7', orderNumber: 'BM-8815', customer: 'Deepa Traders', amount: '220', tip: '0', time: '1:30 PM', type: 'standard' },
      { id: '8', orderNumber: 'BM-8812', customer: 'Lakshmi Hardware', amount: '360', tip: '50', time: '11:00 AM', type: 'express' },
      { id: '9', orderNumber: 'BM-8808', customer: 'Nava Constructions', amount: '280', tip: '30', time: '9:15 AM', type: 'standard' },
      { id: '10', orderNumber: 'BM-8805', customer: 'Sai Builders', amount: '220', tip: '0', time: '7:45 AM', type: 'standard' },
    ],
  },
];

const TYPE_COLORS: Record<string, string> = {
  standard: T.info,
  express: T.amber,
  heavy: T.navy,
};

export default function EarningsHistoryScreen() {
  const router = useRouter();
  const [activePeriod, setActivePeriod] = useState<Period>('today');
  const data = EARNINGS_DATA[activePeriod];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Earnings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Period Tabs */}
        <View style={s.tabRow}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p.key}
              style={[s.tab, activePeriod === p.key && s.tabActive]}
              onPress={() => setActivePeriod(p.key)}
            >
              <Text style={[s.tabText, activePeriod === p.key && s.tabTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Total Earnings Card */}
        <View style={s.totalCard}>
          <Text style={s.totalLabel}>Total Earnings</Text>
          <Text style={s.totalAmount}>Rs.{data.total}</Text>
          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Text style={s.statValue}>{data.deliveries}</Text>
              <Text style={s.statLabel}>Deliveries</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Text style={s.statValue}>Rs.{data.avg}</Text>
              <Text style={s.statLabel}>Avg/Delivery</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Text style={[s.statValue, { color: T.amber }]}>Rs.{data.tips}</Text>
              <Text style={s.statLabel}>Tips</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Text style={[s.statValue, { color: '#86EFAC' }]}>Rs.{data.bonuses}</Text>
              <Text style={s.statLabel}>Bonuses</Text>
            </View>
          </View>
        </View>

        {/* Earnings List */}
        {EARNINGS_LIST.map((group) => (
          <View key={group.date}>
            {/* Date Section Header */}
            <View style={s.dateHeader}>
              <Text style={s.dateHeaderText}>{group.date}</Text>
              <Text style={s.dateHeaderTotal}>Rs.{group.dailyTotal}</Text>
            </View>

            {/* Entries */}
            {group.entries.map((entry) => (
              <View key={entry.id} style={s.entryCard}>
                <View style={s.entryLeft}>
                  <View style={s.entryTopRow}>
                    <Text style={s.entryOrder}>{entry.orderNumber}</Text>
                    <View style={[s.typeBadge, { backgroundColor: TYPE_COLORS[entry.type] + '20' }]}>
                      <Text style={[s.typeBadgeText, { color: TYPE_COLORS[entry.type] }]}>
                        {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <Text style={s.entryCustomer}>{entry.customer}</Text>
                  <Text style={s.entryTime}>{entry.time}</Text>
                </View>
                <View style={s.entryRight}>
                  <Text style={s.entryAmount}>Rs.{entry.amount}</Text>
                  {entry.tip !== '0' && (
                    <Text style={s.entryTip}>+Rs.{entry.tip} tip</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}
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
    paddingVertical: 10,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.text,
  },
  tabRow: {
    flexDirection: 'row' as const,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: T.surface,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: T.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center' as const,
  },
  tabActive: {
    backgroundColor: T.navy,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.textMuted,
  },
  tabTextActive: {
    color: T.white,
  },
  totalCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: T.navy,
    borderRadius: 16,
    padding: 20,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  totalLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: T.white,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  statItem: {
    flex: 1,
    alignItems: 'center' as const,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.white,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dateHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  dateHeaderText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.text,
  },
  dateHeaderTotal: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.success,
  },
  entryCard: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: T.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: T.border,
  },
  entryLeft: {
    flex: 1,
  },
  entryTopRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 4,
  },
  entryOrder: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.text,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  entryCustomer: {
    fontSize: 13,
    color: T.textSecondary,
    marginBottom: 2,
  },
  entryTime: {
    fontSize: 12,
    color: T.textMuted,
  },
  entryRight: {
    alignItems: 'flex-end' as const,
  },
  entryAmount: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.success,
  },
  entryTip: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.amber,
    marginTop: 2,
  },
};
