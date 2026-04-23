import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { LightTheme as T } from '../../src/theme/colors';

type DateRange = '7D' | '30D' | '90D';

const DATE_RANGES: DateRange[] = ['7D', '30D', '90D'];

type BarData = { label: string; value: number; display: string };

const BAR_DATA: Record<DateRange, BarData[]> = {
  '7D': [
    { label: 'Mon', value: 80000, display: '₹80K' },
    { label: 'Tue', value: 145000, display: '₹1.45L' },
    { label: 'Wed', value: 62000, display: '₹62K' },
    { label: 'Thu', value: 210000, display: '₹2.1L' },
    { label: 'Fri', value: 175000, display: '₹1.75L' },
    { label: 'Sat', value: 385000, display: '₹3.85L' },
    { label: 'Sun', value: 98000, display: '₹98K' },
  ],
  '30D': [
    { label: 'W1', value: 620000, display: '₹6.2L' },
    { label: 'W2', value: 840000, display: '₹8.4L' },
    { label: 'W3', value: 1150000, display: '₹11.5L' },
    { label: 'W4', value: 980000, display: '₹9.8L' },
  ],
  '90D': [
    { label: 'Jan', value: 2800000, display: '₹28L' },
    { label: 'Feb', value: 3500000, display: '₹35L' },
    { label: 'Mar', value: 4200000, display: '₹42L' },
  ],
};

const STATS_DATA: Record<DateRange, { orders: string; users: string; revenue: string; cancelled: string }> = {
  '7D': { orders: '342', users: '89', revenue: '₹12.5L', cancelled: '18' },
  '30D': { orders: '1,482', users: '312', revenue: '₹46.7L', cancelled: '64' },
  '90D': { orders: '4,290', users: '876', revenue: '₹1.24Cr', cancelled: '187' },
};

const TOP_PRODUCTS = [
  { name: 'OPC 53 Grade Cement (50kg)', orders: 423, color: '#3B82F6' },
  { name: 'Fe-500D TMT Bars 12mm', orders: 318, color: '#10B981' },
  { name: 'AAC Blocks (600×200×150)', orders: 289, color: '#8B5CF6' },
  { name: 'River Sand (1 Tonne)', orders: 245, color: T.amber },
  { name: 'Red Clay Bricks (1000 pcs)', orders: 198, color: '#EF4444' },
];

const TOP_SHOPS = [
  { name: 'Sharma Building Materials', orders: 89, revenue: '₹2.8L' },
  { name: 'Krishna Cement House', orders: 72, revenue: '₹2.1L' },
  { name: 'Gupta Hardware & Tools', orders: 65, revenue: '₹1.9L' },
  { name: 'Patel Steel Traders', orders: 58, revenue: '₹1.6L' },
  { name: 'Singh Sand & Gravel', orders: 44, revenue: '₹1.2L' },
];

const ROLE_DIST = [
  { role: 'Customers', pct: 45, color: '#3B82F6' },
  { role: 'Workers', pct: 25, color: '#10B981' },
  { role: 'Contractors', pct: 15, color: '#8B5CF6' },
  { role: 'Shopkeepers', pct: 10, color: T.amber },
  { role: 'Drivers', pct: 5, color: '#EF4444' },
];

export default function AdminAnalyticsScreen() {
  const router = useRouter();
  const [range, setRange] = useState<DateRange>('7D');

  const bars = BAR_DATA[range];
  const stats = STATS_DATA[range];
  const maxVal = Math.max(...bars.map((b) => b.value));

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={s.headerTitle}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Date Range Chips */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)} style={s.rangeRow}>
          {DATE_RANGES.map((r) => (
            <Pressable
              key={r}
              style={[s.rangeChip, range === r && s.rangeChipActive]}
              onPress={() => setRange(r)}
            >
              <Text style={[s.rangeText, range === r && s.rangeTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </Animated.View>

        {/* GMV Bar Chart */}
        <Animated.View entering={FadeInDown.delay(80).duration(450)} style={s.card}>
          <Text style={s.cardTitle}>GMV Overview</Text>
          <Text style={s.cardSub}>Gross Merchandise Value ({range})</Text>
          <View style={s.chart}>
            {bars.map((bar, i) => {
              const pct = (bar.value / maxVal) * 100;
              return (
                <View key={bar.label} style={s.barCol}>
                  <Text style={s.barValueLabel}>{bar.display}</Text>
                  <View style={s.barTrack}>
                    <Animated.View
                      entering={FadeInDown.delay(100 + i * 60).duration(400)}
                      style={[s.bar, { height: `${pct}%` as any }]}
                    />
                  </View>
                  <Text style={s.barLabel}>{bar.label}</Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View entering={FadeInDown.delay(160).duration(450)} style={s.statsGrid}>
          {[
            { label: 'Orders', value: stats.orders, icon: 'cube' as const, color: '#3B82F6' },
            { label: 'Users Registered', value: stats.users, icon: 'person-add' as const, color: '#10B981' },
            { label: 'Revenue', value: stats.revenue, icon: 'wallet' as const, color: '#8B5CF6' },
            { label: 'Cancelled', value: stats.cancelled, icon: 'close-circle' as const, color: '#EF4444' },
          ].map((stat, i) => (
            <Animated.View
              key={stat.label}
              entering={FadeInDown.delay(180 + i * 50).duration(400)}
              style={s.statCard}
            >
              <View style={[s.statIcon, { backgroundColor: stat.color + '18' }]}>
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Top Products */}
        <Animated.View entering={FadeInDown.delay(280).duration(450)} style={s.card}>
          <Text style={s.cardTitle}>Top Products</Text>
          <Text style={s.cardSub}>By order volume</Text>
          <View style={s.topList}>
            {TOP_PRODUCTS.map((p, i) => (
              <View key={p.name} style={s.topRow}>
                <View style={[s.rankBubble, { backgroundColor: p.color + '18' }]}>
                  <Text style={[s.rankNum, { color: p.color }]}>#{i + 1}</Text>
                </View>
                <Text style={s.topName} numberOfLines={1}>{p.name}</Text>
                <Text style={[s.topCount, { color: p.color }]}>{p.orders}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Top Shops */}
        <Animated.View entering={FadeInDown.delay(360).duration(450)} style={s.card}>
          <Text style={s.cardTitle}>Top Shops</Text>
          <Text style={s.cardSub}>Ranked by orders</Text>
          <View style={s.topList}>
            {TOP_SHOPS.map((shop, i) => (
              <View key={shop.name} style={s.topRow}>
                <View style={[s.rankBubble, i < 3 ? { backgroundColor: T.amber + '18' } : {}]}>
                  <Text style={[s.rankNum, i < 3 ? { color: T.amber } : { color: T.textMuted }]}>#{i + 1}</Text>
                </View>
                <Text style={s.topName} numberOfLines={1}>{shop.name}</Text>
                <View style={s.shopRight}>
                  <Text style={s.shopOrders}>{shop.orders} orders</Text>
                  <Text style={s.shopRevenue}>{shop.revenue}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Role Distribution */}
        <Animated.View entering={FadeInDown.delay(440).duration(450)} style={s.card}>
          <Text style={s.cardTitle}>User Distribution</Text>
          <Text style={s.cardSub}>Horizontal stacked bar</Text>
          {/* Stacked Bar */}
          <View style={s.stackedBar}>
            {ROLE_DIST.map((r) => (
              <View key={r.role} style={[s.stackSegment, { flex: r.pct, backgroundColor: r.color }]} />
            ))}
          </View>
          {/* Legend */}
          <View style={s.legend}>
            {ROLE_DIST.map((r) => (
              <View key={r.role} style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: r.color }]} />
                <Text style={s.legendText}>{r.role}</Text>
                <Text style={s.legendPct}>{r.pct}%</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: T.text },
  scroll: { padding: 16, paddingBottom: 40, gap: 16 },
  rangeRow: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: T.border,
  },
  rangeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  rangeChipActive: { backgroundColor: T.navy },
  rangeText: { fontSize: 14, fontWeight: '600', color: T.textSecondary },
  rangeTextActive: { color: T.white },
  card: {
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: T.text },
  cardSub: { fontSize: 12, color: T.textMuted, marginTop: 2, marginBottom: 16 },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    gap: 8,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  barValueLabel: {
    fontSize: 9,
    color: T.textMuted,
    marginBottom: 4,
    textAlign: 'center',
  },
  barTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    backgroundColor: T.amber,
    borderRadius: 6,
    minHeight: 6,
  },
  barLabel: {
    fontSize: 11,
    color: T.textMuted,
    marginTop: 6,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '47%',
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: T.border,
    gap: 8,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '800', color: T.text },
  statLabel: { fontSize: 12, color: T.textMuted, fontWeight: '500' },
  topList: { gap: 10 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rankBubble: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: { fontSize: 12, fontWeight: '800', color: T.textMuted },
  topName: { flex: 1, fontSize: 13, fontWeight: '600', color: T.text },
  topCount: { fontSize: 14, fontWeight: '700' },
  shopRight: { alignItems: 'flex-end' },
  shopOrders: { fontSize: 11, color: T.textMuted },
  shopRevenue: { fontSize: 14, fontWeight: '700', color: T.amber },
  stackedBar: {
    flexDirection: 'row',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  stackSegment: { height: '100%' },
  legend: { gap: 8 },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { flex: 1, fontSize: 13, fontWeight: '600', color: T.text },
  legendPct: { fontSize: 13, fontWeight: '700', color: T.text },
});
