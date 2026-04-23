import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn, FadeInUp } from 'react-native-reanimated';

const C = {
  navy: '#1A1D2E',
  amber: '#F2960D',
  amberBg: '#FEF3C7',
  bg: '#F5F6FA',
  surface: '#FFFFFF',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  border: '#E5E7EB',
  text: '#1A1D2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  white: '#FFFFFF',
};

type Period = 'week' | 'month' | '3months';
const PERIODS: { key: Period; label: string }[] = [
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: '3months', label: 'Last 3 Months' },
];

const WEEKLY_BARS: { day: string; amount: number }[] = [
  { day: 'Mon', amount: 850 },
  { day: 'Tue', amount: 1200 },
  { day: 'Wed', amount: 640 },
  { day: 'Thu', amount: 1800 },
  { day: 'Fri', amount: 2100 },
  { day: 'Sat', amount: 3200 },
  { day: 'Sun', amount: 1450 },
];

const MAX_BAR = Math.max(...WEEKLY_BARS.map((b) => b.amount));
const BAR_HEIGHT = 100;

const PERIOD_STATS: Record<Period, { total: string; lastPeriod: string; deliveries: number; avgPerDelivery: string; tips: string; bonuses: string }> = {
  week: { total: '11,240', lastPeriod: '9,850', deliveries: 42, avgPerDelivery: '267', tips: '1,100', bonuses: '500' },
  month: { total: '38,600', lastPeriod: '34,200', deliveries: 148, avgPerDelivery: '261', tips: '3,800', bonuses: '2,000' },
  '3months': { total: '1,12,400', lastPeriod: '98,000', deliveries: 432, avgPerDelivery: '260', tips: '11,200', bonuses: '6,000' },
};

interface EarningEntry {
  id: string;
  date: string;
  orderNo: string;
  customer: string;
  pickup: string;
  drop: string;
  distance: string;
  base: number;
  tip: number;
  bonus: number;
}

const MOCK_ENTRIES: EarningEntry[] = [
  { id: 'e1', date: 'Today', orderNo: 'ORD-2024-0041', customer: 'Rajesh Kumar', pickup: 'Dilsukhnagar, Hyd', drop: 'LB Nagar, Hyd', distance: '5.2 km', base: 180, tip: 50, bonus: 0 },
  { id: 'e2', date: 'Today', orderNo: 'ORD-2024-0040', customer: 'Priya Sharma', pickup: 'Ameerpet, Hyd', drop: 'Banjara Hills, Hyd', distance: '4.8 km', base: 160, tip: 0, bonus: 50 },
  { id: 'e3', date: 'Yesterday', orderNo: 'ORD-2024-0038', customer: 'Anil Reddy', pickup: 'KPHB, Hyd', drop: 'Kondapur, Hyd', distance: '7.1 km', base: 220, tip: 30, bonus: 0 },
  { id: 'e4', date: 'Yesterday', orderNo: 'ORD-2024-0037', customer: 'Suresh Babu', pickup: 'Secunderabad', drop: 'Begumpet, Hyd', distance: '3.5 km', base: 130, tip: 20, bonus: 0 },
  { id: 'e5', date: '21 Apr', orderNo: 'ORD-2024-0034', customer: 'Kavitha Nair', pickup: 'Kukatpally, Hyd', drop: 'Miyapur, Hyd', distance: '6.3 km', base: 200, tip: 0, bonus: 100 },
  { id: 'e6', date: '21 Apr', orderNo: 'ORD-2024-0033', customer: 'Ramesh Verma', pickup: 'Gachibowli, Hyd', drop: 'Madhapur, Hyd', distance: '2.9 km', base: 110, tip: 40, bonus: 0 },
  { id: 'e7', date: '20 Apr', orderNo: 'ORD-2024-0030', customer: 'Deepa Menon', pickup: 'Charminar, Hyd', drop: 'Uppal, Hyd', distance: '9.2 km', base: 280, tip: 60, bonus: 50 },
  { id: 'e8', date: '19 Apr', orderNo: 'ORD-2024-0027', customer: 'Vijay Patel', pickup: 'Mehdipatnam', drop: 'Tolichowki, Hyd', distance: '4.1 km', base: 150, tip: 0, bonus: 0 },
];

function formatINR(n: number): string {
  return n.toLocaleString('en-IN');
}

function growthIndicator(current: string, previous: string) {
  const cur = parseFloat(current.replace(/,/g, ''));
  const prev = parseFloat(previous.replace(/,/g, ''));
  const pct = Math.round(((cur - prev) / prev) * 100);
  const up = pct >= 0;
  return { pct: Math.abs(pct), up };
}

export default function EarningsHistoryScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('month');
  const stats = PERIOD_STATS[period];
  const { pct, up } = growthIndicator(stats.total, stats.lastPeriod);

  const groupedEntries = MOCK_ENTRIES.reduce<Record<string, EarningEntry[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(350)} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Earnings History</Text>
        <View style={styles.backBtn} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Period Filters */}
        <Animated.View entering={FadeInDown.delay(60).duration(350)} style={styles.periodRow}>
          {PERIODS.map((p) => (
            <Pressable
              key={p.key}
              style={[styles.periodBtn, period === p.key && styles.periodBtnActive]}
              onPress={() => setPeriod(p.key)}
            >
              <Text style={[styles.periodBtnText, period === p.key && styles.periodBtnTextActive]}>
                {p.label}
              </Text>
            </Pressable>
          ))}
        </Animated.View>

        {/* Total Earnings Card */}
        <Animated.View entering={FadeInDown.delay(120).duration(380)} style={styles.totalCard}>
          <View style={styles.totalCardBg} />
          <Text style={styles.totalLabel}>Total Earnings</Text>
          <Text style={styles.totalAmount}>₹{stats.total}</Text>
          <View style={styles.growthRow}>
            <Ionicons
              name={up ? 'trending-up' : 'trending-down'}
              size={16}
              color={up ? C.success : C.error}
            />
            <Text style={[styles.growthText, { color: up ? C.success : C.error }]}>
              {pct}% vs last period (₹{stats.lastPeriod})
            </Text>
          </View>

          <View style={styles.statsGridCard}>
            {[
              { label: 'Deliveries', value: String(stats.deliveries), icon: 'bicycle-outline' as keyof typeof Ionicons.glyphMap },
              { label: 'Avg / Delivery', value: `₹${stats.avgPerDelivery}`, icon: 'stats-chart-outline' as keyof typeof Ionicons.glyphMap },
              { label: 'Tips', value: `₹${stats.tips}`, icon: 'heart-outline' as keyof typeof Ionicons.glyphMap },
              { label: 'Bonuses', value: `₹${stats.bonuses}`, icon: 'gift-outline' as keyof typeof Ionicons.glyphMap },
            ].map((s, i) => (
              <Animated.View key={s.label} entering={ZoomIn.delay(200 + i * 50).duration(300)} style={styles.miniStat}>
                <Ionicons name={s.icon} size={16} color="rgba(255,255,255,0.7)" />
                <Text style={styles.miniStatValue}>{s.value}</Text>
                <Text style={styles.miniStatLabel}>{s.label}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Weekly Bar Chart */}
        <Animated.View entering={FadeInDown.delay(200).duration(380)} style={styles.chartCard}>
          <Text style={styles.sectionTitle}>This Week's Breakdown</Text>
          <View style={styles.barChart}>
            {WEEKLY_BARS.map((bar, i) => {
              const heightPct = (bar.amount / MAX_BAR) * BAR_HEIGHT;
              const isToday = i === 5; // Saturday = highest
              return (
                <Animated.View key={bar.day} entering={FadeInDown.delay(250 + i * 40).duration(350)} style={styles.barCol}>
                  <Text style={styles.barAmountLabel}>
                    {bar.amount >= 1000 ? `${(bar.amount / 1000).toFixed(1)}k` : bar.amount}
                  </Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: heightPct,
                          backgroundColor: isToday ? C.amber : C.navy,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDayLabel, isToday && styles.barDayActive]}>{bar.day}</Text>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Earnings List */}
        <Animated.View entering={FadeInDown.delay(280).duration(350)} style={styles.listSection}>
          <Text style={styles.sectionTitle}>Delivery Breakdown</Text>
          {Object.entries(groupedEntries).map(([date, entries], gi) => (
            <View key={date}>
              <Text style={styles.dateGroupLabel}>{date}</Text>
              {entries.map((entry, ei) => {
                const total = entry.base + entry.tip + entry.bonus;
                return (
                  <Animated.View
                    key={entry.id}
                    entering={FadeInDown.delay(320 + gi * 60 + ei * 40).duration(320)}
                    style={styles.entryCard}
                  >
                    <View style={styles.entryLeft}>
                      <View style={styles.entryIconBox}>
                        <Ionicons name="bicycle" size={18} color={C.navy} />
                      </View>
                    </View>
                    <View style={styles.entryMid}>
                      <Text style={styles.entryOrderNo}>{entry.orderNo}</Text>
                      <Text style={styles.entryCustomer}>{entry.customer}</Text>
                      <View style={styles.entryRoute}>
                        <Ionicons name="location-outline" size={11} color={C.textMuted} />
                        <Text style={styles.entryRouteText} numberOfLines={1}>
                          {entry.pickup} → {entry.drop}
                        </Text>
                      </View>
                      <Text style={styles.entryDistance}>{entry.distance}</Text>
                    </View>
                    <View style={styles.entryRight}>
                      <Text style={styles.entryTotal}>+₹{formatINR(total)}</Text>
                      <View style={styles.entryBreakdown}>
                        <Text style={styles.breakdownItem}>Base ₹{entry.base}</Text>
                        {entry.tip > 0 && <Text style={[styles.breakdownItem, styles.breakdownTip]}>Tip ₹{entry.tip}</Text>}
                        {entry.bonus > 0 && <Text style={[styles.breakdownItem, styles.breakdownBonus]}>Bonus ₹{entry.bonus}</Text>}
                      </View>
                    </View>
                  </Animated.View>
                );
              })}
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: C.text },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: C.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  periodBtnActive: { backgroundColor: C.navy, borderColor: C.navy },
  periodBtnText: { fontSize: 12, fontWeight: '600', color: C.textSecondary },
  periodBtnTextActive: { color: C.white },
  totalCard: {
    marginHorizontal: 20,
    backgroundColor: C.navy,
    borderRadius: 20,
    padding: 22,
    overflow: 'hidden',
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  totalCardBg: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(242,150,13,0.1)',
    top: -80,
    right: -60,
  },
  totalLabel: { fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: '500', marginBottom: 4 },
  totalAmount: { fontSize: 38, fontWeight: '800', color: C.white, letterSpacing: -1, marginBottom: 6 },
  growthRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 18 },
  growthText: { fontSize: 13, fontWeight: '600' },
  statsGridCard: { flexDirection: 'row', gap: 10 },
  miniStat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  miniStatValue: { fontSize: 13, fontWeight: '700', color: C.white },
  miniStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: '500' },
  chartCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 16 },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: BAR_HEIGHT + 40,
    gap: 8,
  },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barAmountLabel: { fontSize: 9, color: C.textMuted, fontWeight: '600', marginBottom: 4 },
  barTrack: {
    width: '100%',
    height: BAR_HEIGHT,
    backgroundColor: C.bg,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 6 },
  barDayLabel: { fontSize: 11, color: C.textSecondary, fontWeight: '600', marginTop: 6 },
  barDayActive: { color: C.amber, fontWeight: '700' },
  listSection: { marginHorizontal: 20, marginTop: 20 },
  dateGroupLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textSecondary,
    marginBottom: 8,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  entryCard: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  entryLeft: { marginRight: 12 },
  entryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: C.navy + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryMid: { flex: 1 },
  entryOrderNo: { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 2 },
  entryCustomer: { fontSize: 12, color: C.textSecondary, marginBottom: 4 },
  entryRoute: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 2 },
  entryRouteText: { fontSize: 11, color: C.textMuted, flex: 1 },
  entryDistance: { fontSize: 11, color: C.textMuted },
  entryRight: { alignItems: 'flex-end', justifyContent: 'flex-start' },
  entryTotal: { fontSize: 15, fontWeight: '700', color: C.success, marginBottom: 4 },
  entryBreakdown: { gap: 2, alignItems: 'flex-end' },
  breakdownItem: { fontSize: 10, color: C.textMuted, fontWeight: '500' },
  breakdownTip: { color: C.amber },
  breakdownBonus: { color: C.success },
});
