import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { LightTheme as T } from '../../src/theme/colors';

const SPRING_SNAPPY = { damping: 18, stiffness: 280, mass: 0.8 };
const SPRING_BOUNCY = { damping: 12, stiffness: 200, mass: 0.9 };

type Period = 'Today' | 'Week' | 'Month';

const PERIODS: Period[] = ['Today', 'Week', 'Month'];

interface PeriodData {
  revenue: string;
  revenueDelta: string;
  orders: number;
  productsSold: number;
  avgOrderValue: string;
  returnRate: string;
}

const PERIOD_DATA: Record<Period, PeriodData> = {
  Today: {
    revenue: '₹8,450',
    revenueDelta: '+12% vs yesterday',
    orders: 6,
    productsSold: 24,
    avgOrderValue: '₹1,408',
    returnRate: '0%',
  },
  Week: {
    revenue: '₹58,200',
    revenueDelta: '+18% vs last week',
    orders: 42,
    productsSold: 186,
    avgOrderValue: '₹1,386',
    returnRate: '1.8%',
  },
  Month: {
    revenue: '₹1,24,500',
    revenueDelta: '+23% vs last month',
    orders: 89,
    productsSold: 342,
    avgOrderValue: '₹1,398',
    returnRate: '2.1%',
  },
};

const WEEK_CHART = [
  { day: 'Mon', value: 0.58 },
  { day: 'Tue', value: 0.76 },
  { day: 'Wed', value: 0.44 },
  { day: 'Thu', value: 0.88 },
  { day: 'Fri', value: 0.70 },
  { day: 'Sat', value: 1.00 },
  { day: 'Sun', value: 0.32 },
];

const TOP_PRODUCTS = [
  { name: 'UltraTech Cement', qty: '124 bags', revenue: '₹47,740', rank: 1 },
  { name: 'TMT Steel', qty: '890 kg', revenue: '₹64,080', rank: 2 },
  { name: 'Red Bricks', qty: '5,000 pcs', revenue: '₹35,000', rank: 3 },
];

const RECENT_ORDERS = [
  { id: '#ORD-8821', customer: 'Ravi Kumar', amount: '₹2,310', status: 'Delivered', time: '2h ago', statusColor: T.success },
  { id: '#ORD-8820', customer: 'Prasad Varma', amount: '₹8,450', status: 'Processing', time: '4h ago', statusColor: '#3B82F6' },
  { id: '#ORD-8819', customer: 'Suresh Rao', amount: '₹1,125', status: 'Delivered', time: '6h ago', statusColor: T.success },
  { id: '#ORD-8818', customer: 'Kiran Babu', amount: '₹5,670', status: 'Delivered', time: 'Yesterday', statusColor: T.success },
  { id: '#ORD-8817', customer: 'Mohammed Ali', amount: '₹3,200', status: 'Cancelled', time: 'Yesterday', statusColor: T.error },
];

const KPI_CONFIGS = [
  { key: 'orders' as const, label: 'Orders Received', icon: 'bag-outline' as const, iconBg: '#DBEAFE', iconColor: '#3B82F6' },
  { key: 'productsSold' as const, label: 'Products Sold', icon: 'cube-outline' as const, iconBg: '#D1FAE5', iconColor: T.success },
  { key: 'avgOrderValue' as const, label: 'Avg Order Value', icon: 'trending-up-outline' as const, iconBg: T.amberBg, iconColor: T.amber },
  { key: 'returnRate' as const, label: 'Return Rate', icon: 'return-down-back-outline' as const, iconBg: '#FEE2E2', iconColor: T.error },
];

export default function ShopAnalyticsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('Month');
  const data = PERIOD_DATA[period];

  const kpiValues: Record<string, string> = {
    orders: String(data.orders),
    productsSold: String(data.productsSold),
    avgOrderValue: data.avgOrderValue,
    returnRate: data.returnRate,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={s.headerTitle}>Shop Analytics</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Period Selector */}
        <Animated.View entering={FadeInDown.delay(50).springify()} style={s.periodRow}>
          {PERIODS.map((p) => (
            <Pressable
              key={p}
              style={({ pressed }) => [
                s.periodBtn,
                period === p && s.periodBtnActive,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[s.periodBtnText, period === p && s.periodBtnTextActive]}>{p}</Text>
              {period === p && <View style={s.periodUnderline} />}
            </Pressable>
          ))}
        </Animated.View>

        {/* Revenue Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={s.revenueCard}>
          <View style={s.revenueLeft}>
            <Text style={s.revenueLabel}>Revenue ({period})</Text>
            <Text style={s.revenueValue}>{data.revenue}</Text>
            <View style={s.revenueDeltaRow}>
              <Ionicons name="trending-up" size={14} color={T.success} />
              <Text style={s.revenueDelta}>{data.revenueDelta}</Text>
            </View>
          </View>
          <View style={s.revenueIconCircle}>
            <Ionicons name="cash-outline" size={28} color={T.amber} />
          </View>
        </Animated.View>

        {/* KPI Grid 2×2 */}
        <View style={s.kpiGrid}>
          {KPI_CONFIGS.map((kpi, i) => (
            <Animated.View
              key={kpi.key}
              entering={ZoomIn.delay(150 + i * 60).springify().damping(SPRING_BOUNCY.damping).stiffness(SPRING_BOUNCY.stiffness)}
              style={s.kpiCard}
            >
              <View style={[s.kpiIconCircle, { backgroundColor: kpi.iconBg }]}>
                <Ionicons name={kpi.icon} size={20} color={kpi.iconColor} />
              </View>
              <Text style={s.kpiValue}>{kpiValues[kpi.key]}</Text>
              <Text style={s.kpiLabel}>{kpi.label}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Bar Chart */}
        <Animated.View entering={FadeInDown.delay(380).springify()} style={s.section}>
          <Text style={s.sectionTitle}>WEEKLY REVENUE TREND</Text>
          <View style={s.chartCard}>
            <View style={s.chartContainer}>
              {WEEK_CHART.map((bar, i) => (
                <View key={bar.day} style={s.chartBarColumn}>
                  <View style={s.chartBarTrack}>
                    <View
                      style={[
                        s.chartBar,
                        {
                          height: `${bar.value * 100}%`,
                          backgroundColor: bar.value >= 0.85 ? T.amber : T.navy,
                        },
                      ]}
                    />
                  </View>
                  <Text style={s.chartLabel}>{bar.day}</Text>
                </View>
              ))}
            </View>
            <View style={s.chartLegendRow}>
              <View style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: T.amber }]} />
                <Text style={s.legendText}>Peak day</Text>
              </View>
              <View style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: T.navy }]} />
                <Text style={s.legendText}>Regular</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Top Selling Products */}
        <Animated.View entering={FadeInDown.delay(460).springify()} style={s.section}>
          <Text style={s.sectionTitle}>TOP SELLING PRODUCTS</Text>
          <View style={s.listCard}>
            {TOP_PRODUCTS.map((product, index) => (
              <View
                key={product.rank}
                style={[s.productRow, index < TOP_PRODUCTS.length - 1 && s.rowBorder]}
              >
                <View style={s.rankBadge}>
                  <Text style={s.rankText}>#{product.rank}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.productName}>{product.name}</Text>
                  <Text style={s.productMeta}>{product.qty} sold</Text>
                </View>
                <Text style={s.productRevenue}>{product.revenue}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Orders Summary */}
        <Animated.View entering={FadeInDown.delay(540).springify()} style={s.section}>
          <Text style={s.sectionTitle}>RECENT ORDERS SUMMARY</Text>
          <View style={s.listCard}>
            {RECENT_ORDERS.map((order, index) => (
              <View
                key={order.id}
                style={[s.orderRow, index < RECENT_ORDERS.length - 1 && s.rowBorder]}
              >
                <View style={{ flex: 1 }}>
                  <View style={s.orderTopRow}>
                    <Text style={s.orderId}>{order.id}</Text>
                    <View style={[s.statusPill, { backgroundColor: order.statusColor + '1A' }]}>
                      <Text style={[s.statusPillText, { color: order.statusColor }]}>
                        {order.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={s.orderCustomer}>{order.customer}</Text>
                  <Text style={s.orderTime}>{order.time}</Text>
                </View>
                <Text style={s.orderAmount}>{order.amount}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: T.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: T.text,
  },
  periodRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    gap: 4,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  periodBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  periodBtnActive: {},
  periodBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: T.textSecondary,
  },
  periodBtnTextActive: {
    color: T.amber,
    fontWeight: '700',
  },
  periodUnderline: {
    position: 'absolute',
    bottom: -1,
    left: '15%',
    right: '15%',
    height: 2,
    backgroundColor: T.amber,
    borderRadius: 2,
  },
  revenueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: T.navy,
    borderRadius: 18,
    padding: 20,
  },
  revenueLeft: {
    gap: 4,
  },
  revenueLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
  },
  revenueValue: {
    fontSize: 28,
    fontWeight: '800',
    color: T.white,
  },
  revenueDeltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  revenueDelta: {
    fontSize: 12,
    fontWeight: '600',
    color: T.success,
  },
  revenueIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  kpiCard: {
    width: '47%',
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  kpiIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    color: T.text,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: T.textMuted,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: T.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
    marginLeft: 2,
  },
  chartCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    marginBottom: 16,
  },
  chartBarColumn: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarTrack: {
    width: 22,
    height: 110,
    backgroundColor: T.bg,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    borderRadius: 6,
  },
  chartLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: T.textMuted,
    marginTop: 6,
  },
  chartLegendRow: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: T.textSecondary,
  },
  listCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: T.amberBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: T.amber,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: T.text,
  },
  productMeta: {
    fontSize: 12,
    color: T.textMuted,
    marginTop: 2,
  },
  productRevenue: {
    fontSize: 14,
    fontWeight: '700',
    color: T.navy,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  orderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: T.text,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderCustomer: {
    fontSize: 12,
    color: T.textSecondary,
  },
  orderTime: {
    fontSize: 11,
    color: T.textMuted,
    marginTop: 1,
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: T.amber,
    marginLeft: 12,
  },
});
