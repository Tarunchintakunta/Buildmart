import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type Period = 'today' | 'week' | 'month';

const KPI_DATA: Record<Period, { revenue: string; orders: string; avgOrder: string; returnRate: string }> = {
  today: { revenue: 'Rs.12K', orders: '4', avgOrder: 'Rs.3,000', returnRate: '0%' },
  week: { revenue: 'Rs.45K', orders: '12', avgOrder: 'Rs.3,750', returnRate: '2%' },
  month: { revenue: 'Rs.1.8L', orders: '48', avgOrder: 'Rs.3,750', returnRate: '3%' },
};

const TOP_PRODUCTS = [
  { rank: 1, name: 'UltraTech Cement 50kg', unitsSold: 120, revenue: 'Rs.42,000' },
  { rank: 2, name: 'TMT Steel Bars 12mm', unitsSold: 85, revenue: 'Rs.38,250' },
  { rank: 3, name: 'Asian Paints Ace 20L', unitsSold: 45, revenue: 'Rs.31,500' },
  { rank: 4, name: 'PVC Pipes 4 inch', unitsSold: 60, revenue: 'Rs.18,000' },
  { rank: 5, name: 'Electrical Wire 90m', unitsSold: 35, revenue: 'Rs.14,000' },
];

const LOW_STOCK_ITEMS = [
  { name: 'White Cement 5kg', stock: 3, minStock: 10 },
  { name: 'Wall Putty 20kg', stock: 5, minStock: 15 },
  { name: 'PVC Elbow Joint', stock: 8, minStock: 20 },
  { name: 'Primer 4L', stock: 2, minStock: 10 },
];

const CHART_BARS = [
  { day: 'Mon', value: 0.6 },
  { day: 'Tue', value: 0.8 },
  { day: 'Wed', value: 0.45 },
  { day: 'Thu', value: 0.9 },
  { day: 'Fri', value: 0.7 },
  { day: 'Sat', value: 1.0 },
  { day: 'Sun', value: 0.35 },
];

export default function ShopAnalyticsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('week');

  const kpi = KPI_DATA[period];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Shop Analytics</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Period Tabs */}
        <View style={s.periodContainer}>
          {(['today', 'week', 'month'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[s.periodTab, period === p && s.periodTabActive]}
              onPress={() => setPeriod(p)}
              activeOpacity={0.7}
            >
              <Text style={[s.periodTabText, period === p && s.periodTabTextActive]}>
                {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* KPI Cards */}
        <View style={s.kpiGrid}>
          <View style={s.kpiCard}>
            <View style={[s.kpiIconCircle, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="cash-outline" size={20} color={T.info} />
            </View>
            <Text style={s.kpiValue}>{kpi.revenue}</Text>
            <Text style={s.kpiLabel}>Revenue</Text>
          </View>
          <View style={s.kpiCard}>
            <View style={[s.kpiIconCircle, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="cart-outline" size={20} color={T.success} />
            </View>
            <Text style={s.kpiValue}>{kpi.orders}</Text>
            <Text style={s.kpiLabel}>Orders</Text>
          </View>
          <View style={s.kpiCard}>
            <View style={[s.kpiIconCircle, { backgroundColor: T.amberBg }]}>
              <Ionicons name="trending-up-outline" size={20} color={T.amber} />
            </View>
            <Text style={s.kpiValue}>{kpi.avgOrder}</Text>
            <Text style={s.kpiLabel}>Avg Order</Text>
          </View>
          <View style={s.kpiCard}>
            <View style={[s.kpiIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="return-down-back-outline" size={20} color="#EF4444" />
            </View>
            <Text style={s.kpiValue}>{kpi.returnRate}</Text>
            <Text style={s.kpiLabel}>Return Rate</Text>
          </View>
        </View>

        {/* Revenue Chart Placeholder */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>REVENUE TREND</Text>
          <View style={s.chartCard}>
            <View style={s.chartContainer}>
              {CHART_BARS.map((bar) => (
                <View key={bar.day} style={s.chartBarColumn}>
                  <View style={s.chartBarTrack}>
                    <View
                      style={[
                        s.chartBar,
                        {
                          height: `${bar.value * 100}%` as any,
                          backgroundColor: bar.value >= 0.8 ? T.amber : T.navy,
                        },
                      ]}
                    />
                  </View>
                  <Text style={s.chartLabel}>{bar.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Top Selling Products */}
        <View style={s.section}>
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
                  <Text style={s.productMeta}>
                    {product.unitsSold} units sold
                  </Text>
                </View>
                <Text style={s.productRevenue}>{product.revenue}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Customer Insights */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>CUSTOMER INSIGHTS</Text>
          <View style={s.insightsRow}>
            {/* Pie Chart Placeholder */}
            <View style={s.pieCard}>
              <View style={s.pieChart}>
                <View style={s.pieInner}>
                  <Text style={s.pieValue}>68%</Text>
                  <Text style={s.pieLabel}>Returning</Text>
                </View>
              </View>
              <View style={s.pieLegend}>
                <View style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: T.navy }]} />
                  <Text style={s.legendText}>Returning (68%)</Text>
                </View>
                <View style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: T.amber }]} />
                  <Text style={s.legendText}>New (32%)</Text>
                </View>
              </View>
            </View>
            {/* Avg Rating */}
            <View style={s.ratingCard}>
              <Ionicons name="star" size={28} color={T.amber} />
              <Text style={s.ratingValue}>4.6</Text>
              <Text style={s.ratingLabel}>Avg Rating</Text>
              <Text style={s.ratingCount}>128 reviews</Text>
            </View>
          </View>
        </View>

        {/* Low Stock Alerts */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>LOW STOCK ALERTS</Text>
          <View style={s.listCard}>
            {LOW_STOCK_ITEMS.map((item, index) => (
              <View
                key={item.name}
                style={[s.stockRow, index < LOW_STOCK_ITEMS.length - 1 && s.rowBorder]}
              >
                <View style={s.stockWarning}>
                  <Ionicons name="warning" size={16} color="#EF4444" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.stockName}>{item.name}</Text>
                  <Text style={s.stockMeta}>
                    {item.stock} left (min: {item.minStock})
                  </Text>
                </View>
                <TouchableOpacity style={s.restockBtn} activeOpacity={0.7}>
                  <Text style={s.restockBtnText}>Restock</Text>
                </TouchableOpacity>
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
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.text,
  },
  periodContainer: {
    flexDirection: 'row' as const,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
  },
  periodTabActive: {
    backgroundColor: T.navy,
    borderColor: T.navy,
  },
  periodTabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.textSecondary,
  },
  periodTabTextActive: {
    color: T.white,
  },
  kpiGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  kpiCard: {
    width: '47%' as any,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    alignItems: 'center' as const,
  },
  kpiIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 10,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: T.text,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: T.textMuted,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  chartCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
  },
  chartContainer: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    justifyContent: 'space-between' as const,
    height: 140,
  },
  chartBarColumn: {
    flex: 1,
    alignItems: 'center' as const,
  },
  chartBarTrack: {
    width: 24,
    height: 120,
    backgroundColor: T.bg,
    borderRadius: 6,
    justifyContent: 'flex-end' as const,
    overflow: 'hidden' as const,
  },
  chartBar: {
    width: '100%' as const,
    borderRadius: 6,
  },
  chartLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: T.textMuted,
    marginTop: 6,
  },
  listCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden' as const,
  },
  productRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
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
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: T.navy,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: T.text,
  },
  productMeta: {
    fontSize: 12,
    color: T.textMuted,
    marginTop: 2,
  },
  productRevenue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.text,
  },
  insightsRow: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  pieCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    alignItems: 'center' as const,
  },
  pieChart: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: T.navy,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 6,
    borderColor: T.amber,
    marginBottom: 12,
  },
  pieInner: {
    alignItems: 'center' as const,
  },
  pieValue: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: T.white,
  },
  pieLabel: {
    fontSize: 8,
    color: '#D1D5DB',
    fontWeight: '600' as const,
  },
  pieLegend: {
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: T.textSecondary,
    fontWeight: '500' as const,
  },
  ratingCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: T.text,
    marginTop: 4,
  },
  ratingLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.textSecondary,
    marginTop: 2,
  },
  ratingCount: {
    fontSize: 11,
    color: T.textMuted,
    marginTop: 4,
  },
  stockRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  stockWarning: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  stockName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: T.text,
  },
  stockMeta: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 2,
    fontWeight: '500' as const,
  },
  restockBtn: {
    backgroundColor: T.amber,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  restockBtnText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: T.white,
  },
};
