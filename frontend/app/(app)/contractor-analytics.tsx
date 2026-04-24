import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LightTheme as T } from '../../src/theme/colors';
import { SPRING_SNAPPY, SPRING_BOUNCY } from '../../src/utils/animations';

const SUMMARY_STATS = [
  { label: 'Materials Spend', value: '₹2.8L', icon: 'cube-outline' as const, color: '#3B82F6', sub: 'This month' },
  { label: 'Labor Costs', value: '₹1.2L', icon: 'people-outline' as const, color: '#8B5CF6', sub: 'This month' },
  { label: 'Active Projects', value: '3', icon: 'business-outline' as const, color: '#10B981', sub: 'Running' },
  { label: 'Avg Cost/Day', value: '₹18K', icon: 'trending-up-outline' as const, color: T.amber, sub: 'Per day' },
];

const WEEKLY_BARS = [
  { day: 'Mon', value: 42, amount: '₹42K' },
  { day: 'Tue', value: 68, amount: '₹68K' },
  { day: 'Wed', value: 55, amount: '₹55K' },
  { day: 'Thu', value: 80, amount: '₹80K' },
  { day: 'Fri', value: 72, amount: '₹72K' },
  { day: 'Sat', value: 38, amount: '₹38K' },
  { day: 'Sun', value: 24, amount: '₹24K' },
];

const TOP_CATEGORIES = [
  { name: 'Cement', pct: 32, color: '#F59E0B', amount: '₹1.45L' },
  { name: 'Steel', pct: 28, color: '#3B82F6', amount: '₹1.27L' },
  { name: 'Labor', pct: 24, color: '#10B981', amount: '₹1.08L' },
  { name: 'Other', pct: 16, color: '#8B5CF6', amount: '₹72K' },
];

const MONTHLY_TREND = [
  { month: 'Nov', value: 48, label: '₹2.1L' },
  { month: 'Dec', value: 62, label: '₹2.8L' },
  { month: 'Jan', value: 55, label: '₹2.5L' },
  { month: 'Feb', value: 78, label: '₹3.5L' },
  { month: 'Mar', value: 70, label: '₹3.2L' },
  { month: 'Apr', value: 100, label: '₹4.5L' },
];

function AnimatedBar({ value, delay }: { value: number; delay: number }) {
  const height = useSharedValue(0);
  const barStyle = useAnimatedStyle(() => ({ height: height.value }));

  useEffect(() => {
    const t = setTimeout(() => {
      height.value = withTiming((value / 100) * 110, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return <Animated.View style={[styles.barFill, barStyle]} />;
}

function AnimatedCategoryBar({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  const width = useSharedValue(0);
  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` as any }));

  useEffect(() => {
    const t = setTimeout(() => {
      width.value = withTiming(pct, { duration: 900, easing: Easing.out(Easing.cubic) });
    }, delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return <Animated.View style={[styles.catBarFill, { backgroundColor: color }, barStyle]} />;
}

function StatCard({ item, index }: { item: typeof SUMMARY_STATS[0]; index: number }) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View
      style={[styles.statCard, anim]}
      entering={FadeInDown.delay(index * 70).springify().damping(18).stiffness(180)}
    >
      <Pressable
        style={styles.statInner}
        onPressIn={() => { scale.value = withSpring(0.96, SPRING_SNAPPY); }}
        onPressOut={() => { scale.value = withSpring(1, SPRING_BOUNCY); }}
      >
        <View style={[styles.statIcon, { backgroundColor: `${item.color}18` }]}>
          <Ionicons name={item.icon} size={18} color={item.color} />
        </View>
        <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
        <Text style={styles.statLabel}>{item.label}</Text>
        <Text style={styles.statSub}>{item.sub}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function ContractorAnalyticsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Revenue Summary Hero */}
        <Animated.View entering={FadeInDown.delay(0).springify().damping(18)}>
          <View style={styles.heroCard}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroLabel}>Total Spend This Month</Text>
              <Text style={styles.heroAmount}>₹4,52,000</Text>
              <View style={styles.trendRow}>
                <View style={styles.trendBadge}>
                  <Ionicons name="trending-up" size={13} color="#10B981" />
                  <Text style={styles.trendText}>+18% vs last month</Text>
                </View>
              </View>
            </View>
            <View style={styles.heroIconBox}>
              <Ionicons name="analytics" size={32} color={T.amber} />
            </View>
          </View>
        </Animated.View>

        {/* Stats 2×2 */}
        <Animated.View entering={FadeInDown.delay(80).springify().damping(18)}>
          <View style={styles.statsGrid}>
            {SUMMARY_STATS.map((item, i) => (
              <StatCard key={item.label} item={item} index={i} />
            ))}
          </View>
        </Animated.View>

        {/* Weekly Spend Bar Chart */}
        <Animated.View entering={FadeInDown.delay(200).springify().damping(18)}>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.cardTitle}>Weekly Spend</Text>
              <Text style={styles.chartSubtitle}>This week's daily expenses</Text>
            </View>
            <View style={styles.barsContainer}>
              {WEEKLY_BARS.map((bar, i) => (
                <View key={bar.day} style={styles.barCol}>
                  <Text style={styles.barAmount}>{bar.amount}</Text>
                  <View style={styles.barTrack}>
                    <AnimatedBar value={bar.value} delay={300 + i * 60} />
                  </View>
                  <Text style={styles.barDay}>{bar.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Top Expense Categories */}
        <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
          <View style={styles.sectionCard}>
            <Text style={styles.cardTitle}>Top Expense Categories</Text>
            <View style={styles.categoriesList}>
              {TOP_CATEGORIES.map((cat, i) => (
                <View key={cat.name} style={styles.catRow}>
                  <View style={styles.catLabelRow}>
                    <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                    <Text style={styles.catName}>{cat.name}</Text>
                    <Text style={styles.catAmount}>{cat.amount}</Text>
                    <Text style={styles.catPct}>{cat.pct}%</Text>
                  </View>
                  <View style={styles.catBarTrack}>
                    <AnimatedCategoryBar pct={cat.pct} color={cat.color} delay={400 + i * 60} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Monthly Spend Trend */}
        <Animated.View entering={FadeInDown.delay(460).springify().damping(18)}>
          <View style={styles.sectionCard}>
            <Text style={styles.cardTitle}>Monthly Spend Trend</Text>
            <Text style={styles.trendSub}>Last 6 months spending pattern</Text>
            <View style={styles.trendChart}>
              {MONTHLY_TREND.map((item, i) => (
                <View key={item.month} style={styles.trendCol}>
                  <Text style={styles.trendAmount}>{item.label}</Text>
                  <View style={styles.trendBarTrack}>
                    <View style={[styles.trendBarFill, { height: `${item.value}%` as any }]} />
                  </View>
                  <Text style={styles.trendMonth}>{item.month}</Text>
                </View>
              ))}
            </View>
            <View style={styles.trendFooter}>
              <View style={styles.trendDot} />
              <Text style={styles.trendFooterText}>Apr 2026 is highest spend month</Text>
            </View>
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={FadeInDown.delay(560).springify().damping(18)}>
          <Pressable
            style={styles.ctaBtn}
            onPress={() => router.push('/(app)/site-management' as any)}
          >
            <Ionicons name="business-outline" size={18} color="#fff" />
            <Text style={styles.ctaBtnText}>View All Sites & Budgets</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: T.bg,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: T.text },
  headerRight: { width: 40 },

  scrollContent: { paddingBottom: 40 },

  /* Hero Card */
  heroCard: {
    margin: 16,
    backgroundColor: T.navy,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  heroLeft: { gap: 6 },
  heroLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  heroAmount: { fontSize: 28, fontWeight: '800', color: '#fff' },
  trendRow: { flexDirection: 'row' },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  trendText: { fontSize: 12, fontWeight: '600', color: '#10B981' },
  heroIconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(242,150,13,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Stats Grid */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    width: '47.5%',
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
  },
  statInner: { padding: 14 },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 12, color: T.text, fontWeight: '600', marginBottom: 1 },
  statSub: { fontSize: 11, color: T.textMuted },

  /* Chart Card */
  chartCard: {
    marginHorizontal: 16,
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 16,
  },
  chartHeader: { marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: T.text, marginBottom: 2 },
  chartSubtitle: { fontSize: 12, color: T.textMuted },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
  },
  barCol: { flex: 1, alignItems: 'center' },
  barAmount: { fontSize: 9, color: T.textMuted, marginBottom: 4, fontWeight: '600' },
  barTrack: {
    width: 28,
    height: 110,
    backgroundColor: T.bg,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', backgroundColor: T.amber, borderRadius: 6 },
  barDay: { marginTop: 8, fontSize: 11, color: T.textMuted, fontWeight: '600' },

  /* Categories */
  sectionCard: {
    marginHorizontal: 16,
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 16,
  },
  categoriesList: { marginTop: 14, gap: 14 },
  catRow: { gap: 7 },
  catLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catDot: { width: 9, height: 9, borderRadius: 5 },
  catName: { flex: 1, fontSize: 13, fontWeight: '600', color: T.text },
  catAmount: { fontSize: 12, color: T.textSecondary, fontWeight: '500' },
  catPct: { fontSize: 13, fontWeight: '700', color: T.text, minWidth: 35, textAlign: 'right' },
  catBarTrack: { height: 7, backgroundColor: T.bg, borderRadius: 4, overflow: 'hidden' },
  catBarFill: { height: 7, borderRadius: 4 },

  /* Monthly Trend */
  trendSub: { fontSize: 12, color: T.textMuted, marginBottom: 16 },
  trendChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 12,
  },
  trendCol: { flex: 1, alignItems: 'center' },
  trendAmount: { fontSize: 9, color: T.textMuted, fontWeight: '600', marginBottom: 4 },
  trendBarTrack: {
    width: 24,
    height: 80,
    backgroundColor: T.bg,
    borderRadius: 5,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: T.border,
  },
  trendBarFill: { width: '100%', backgroundColor: `${T.navy}CC`, borderRadius: 5 },
  trendMonth: { marginTop: 6, fontSize: 10, color: T.textMuted, fontWeight: '600' },
  trendFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  trendDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: T.amber },
  trendFooterText: { fontSize: 12, color: T.textSecondary, fontWeight: '500' },

  /* CTA */
  ctaBtn: {
    marginHorizontal: 16,
    backgroundColor: T.navy,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaBtnText: { fontSize: 15, fontWeight: '700', color: '#fff', flex: 1, textAlign: 'center' },
});
