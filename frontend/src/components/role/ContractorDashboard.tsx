import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LightTheme as T } from '../../theme/colors';
import { SPRING_BOUNCY, SPRING_SNAPPY } from '../../utils/animations';

const BANNER_URI = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80';

const STATS = [
  { label: 'Active Sites', value: '3', icon: 'business-outline' as const, color: '#8B5CF6' },
  { label: 'Workers Hired', value: '12', icon: 'people-outline' as const, color: '#3B82F6' },
  { label: 'Orders Placed', value: '24', icon: 'cube-outline' as const, color: '#10B981' },
  { label: 'Budget Used', value: '68%', icon: 'pie-chart-outline' as const, color: T.amber },
];

const QUICK_ACTIONS = [
  { name: 'Find Workers', icon: 'people-outline' as const, route: '/(app)/(tabs)/workers', color: '#3B82F6' },
  { name: 'Order Materials', icon: 'cube-outline' as const, route: '/(app)/(tabs)/shop', color: '#10B981' },
  { name: 'Create Agreement', icon: 'document-text-outline' as const, route: '/(app)/agreement/create', color: '#8B5CF6' },
  { name: 'My Sites', icon: 'business-outline' as const, route: '/(app)/site-management', color: T.amber },
  { name: 'Analytics', icon: 'bar-chart-outline' as const, route: '/(app)/contractor-analytics', color: '#EF4444' },
];

const ACTIVE_SITES = [
  {
    id: '1',
    name: 'Hitech City Apartment',
    location: 'Madhapur, Hyderabad',
    progress: 68,
    workers: 8,
    budget: '₹12L',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Banjara Hills Villa',
    location: 'Jubilee Hills, Hyderabad',
    progress: 35,
    workers: 5,
    budget: '₹8L',
    status: 'Active',
  },
];

const RECENT_WORKERS = [
  { id: '1', name: 'Ravi Kumar', trade: 'Mason', color: '#3B82F6' },
  { id: '2', name: 'Suresh Rao', trade: 'Electrician', color: '#10B981' },
  { id: '3', name: 'Anil Singh', trade: 'Plumber', color: '#F59E0B' },
];

function QuickActionCard({ item, index }: { item: typeof QUICK_ACTIONS[0]; index: number }) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View
      style={[styles.quickCard, anim]}
      entering={ZoomIn.delay(index * 80).springify().damping(16)}
    >
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.94, SPRING_SNAPPY); }}
        onPressOut={() => { scale.value = withSpring(1, SPRING_BOUNCY); }}
        onPress={() => router.push(item.route as any)}
        style={styles.quickPressable}
      >
        <View style={[styles.quickIcon, { backgroundColor: `${item.color}18` }]}>
          <Ionicons name={item.icon} size={22} color={item.color} />
        </View>
        <Text style={styles.quickLabel}>{item.name}</Text>
      </Pressable>
    </Animated.View>
  );
}

function StatCard({ item, index }: { item: typeof STATS[0]; index: number }) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View
      style={[styles.statCard, anim]}
      entering={ZoomIn.delay(index * 80).springify().damping(18).stiffness(180)}
    >
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.96, SPRING_SNAPPY); }}
        onPressOut={() => { scale.value = withSpring(1, SPRING_BOUNCY); }}
        style={styles.statInner}
      >
        <View style={[styles.statIconBox, { backgroundColor: `${item.color}18` }]}>
          <Ionicons name={item.icon} size={18} color={item.color} />
        </View>
        <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
        <Text style={styles.statLabel}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

function SiteProgressBar({ progress }: { progress: number }) {
  const width = useSharedValue(0);
  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%` as any,
  }));
  useEffect(() => {
    const t = setTimeout(() => {
      width.value = withTiming(progress, { duration: 900, easing: Easing.out(Easing.cubic) });
    }, 300);
    return () => clearTimeout(t);
  }, [progress]);
  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, barStyle]} />
    </View>
  );
}

export default function ContractorDashboard() {
  const router = useRouter();
  const [displayBalance, setDisplayBalance] = useState(0);
  const targetBalance = 45200;

  useEffect(() => {
    const start = Date.now();
    const duration = 900;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayBalance(Math.round(eased * targetBalance));
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.root}>
      {/* Navy Header Card */}
      <Animated.View entering={FadeInDown.delay(0).springify().damping(18)}>
        <View style={styles.walletCard}>
          <Image
            source={{ uri: BANNER_URI }}
            style={styles.walletBg}
            resizeMode="cover"
          />
          <View style={styles.walletOverlay} />
          <View style={styles.walletContent}>
            <View style={styles.walletTopRow}>
              <View>
                <Text style={styles.walletLabel}>Project Wallet</Text>
                <Text style={styles.walletAmount}>
                  ₹{displayBalance.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={[styles.walletBadge]}>
                <Ionicons name="shield-checkmark" size={13} color={T.amber} />
                <Text style={styles.walletBadgeText}>Verified</Text>
              </View>
            </View>
            <View style={styles.walletActions}>
              <Pressable
                style={styles.walletBtn}
                onPress={() => router.push('/(app)/(tabs)/wallet' as any)}
              >
                <Ionicons name="add" size={15} color="#fff" />
                <Text style={styles.walletBtnText}>Add Funds</Text>
              </Pressable>
              <Pressable
                style={styles.walletBtn}
                onPress={() => router.push('/(app)/(tabs)/wallet' as any)}
              >
                <Ionicons name="arrow-up" size={15} color="#fff" />
                <Text style={styles.walletBtnText}>Withdraw</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Stats Grid 2×2 */}
      <Animated.View entering={FadeInDown.delay(80).springify().damping(18)} style={styles.statsSection}>
        <View style={styles.statsGrid}>
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} item={stat} index={i} />
          ))}
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(160).springify().damping(18)}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((action, i) => (
            <QuickActionCard key={action.name} item={action} index={i} />
          ))}
        </View>
      </Animated.View>

      {/* Active Sites */}
      <Animated.View entering={FadeInDown.delay(280).springify().damping(18)}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Sites</Text>
          <Pressable onPress={() => router.push('/(app)/site-management' as any)}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>
        {ACTIVE_SITES.map((site, i) => (
          <Animated.View
            key={site.id}
            entering={FadeInDown.delay(280 + i * 70).springify().damping(18)}
          >
            <Pressable style={styles.siteCard} onPress={() => router.push('/(app)/site-management' as any)}>
              <View style={styles.siteCardHeader}>
                <View style={styles.siteIconBox}>
                  <Ionicons name="business" size={20} color={T.amber} />
                </View>
                <View style={styles.siteInfo}>
                  <Text style={styles.siteName}>{site.name}</Text>
                  <View style={styles.siteLocationRow}>
                    <Ionicons name="location-outline" size={12} color={T.textMuted} />
                    <Text style={styles.siteLocation}>{site.location}</Text>
                  </View>
                </View>
                <View style={styles.siteStatusBadge}>
                  <View style={styles.siteStatusDot} />
                  <Text style={styles.siteStatusText}>{site.status}</Text>
                </View>
              </View>
              <View style={styles.siteProgressRow}>
                <Text style={styles.siteProgressLabel}>Progress</Text>
                <Text style={styles.siteProgressPct}>{site.progress}%</Text>
              </View>
              <SiteProgressBar progress={site.progress} />
              <View style={styles.siteMeta}>
                <View style={styles.siteMetaItem}>
                  <Ionicons name="people-outline" size={13} color={T.textSecondary} />
                  <Text style={styles.siteMetaText}>{site.workers} workers</Text>
                </View>
                <View style={styles.siteMetaItem}>
                  <Ionicons name="wallet-outline" size={13} color={T.textSecondary} />
                  <Text style={styles.siteMetaText}>{site.budget}</Text>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </Animated.View>

      {/* Recent Workers */}
      <Animated.View entering={FadeInDown.delay(420).springify().damping(18)}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Workers</Text>
          <Pressable onPress={() => router.push('/(app)/(tabs)/workers' as any)}>
            <Text style={styles.viewAll}>See All</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.workersScroll}
        >
          {RECENT_WORKERS.map((worker, i) => (
            <Animated.View
              key={worker.id}
              entering={FadeInRight.delay(420 + i * 60).springify().damping(16)}
            >
              <Pressable style={styles.workerChip} onPress={() => router.push('/(app)/(tabs)/workers' as any)}>
                <View style={[styles.workerAvatar, { backgroundColor: worker.color }]}>
                  <Ionicons name="person" size={16} color="#fff" />
                </View>
                <View style={styles.workerInfo}>
                  <Text style={styles.workerName}>{worker.name}</Text>
                  <Text style={styles.workerTrade}>{worker.trade}</Text>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingBottom: 100 },

  /* Wallet Hero */
  walletCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    height: 180,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  walletBg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  walletOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26,29,46,0.82)' },
  walletContent: { flex: 1, padding: 20, justifyContent: 'space-between' },
  walletTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  walletLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4, fontWeight: '500' },
  walletAmount: { fontSize: 30, fontWeight: '800', color: '#fff' },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(242,150,13,0.18)',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(242,150,13,0.4)',
  },
  walletBadgeText: { fontSize: 11, fontWeight: '600', color: T.amber },
  walletActions: { flexDirection: 'row', gap: 10 },
  walletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  walletBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },

  /* Stats Grid */
  statsSection: { marginBottom: 4, paddingHorizontal: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: {
    width: '47.5%',
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
  },
  statInner: { padding: 16, alignItems: 'flex-start' },
  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: { fontSize: 22, fontWeight: '800', marginBottom: 3 },
  statLabel: { fontSize: 12, color: T.textSecondary, fontWeight: '500' },

  /* Quick Actions */
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: T.text,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  viewAll: { fontSize: 13, fontWeight: '600', color: T.amber },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  quickCard: {
    width: '30.5%',
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
  },
  quickPressable: { padding: 14, alignItems: 'center' },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: T.text,
    textAlign: 'center',
    lineHeight: 15,
  },

  /* Active Sites */
  siteCard: {
    marginHorizontal: 16,
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  siteCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  siteIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  siteInfo: { flex: 1 },
  siteName: { fontSize: 15, fontWeight: '700', color: T.text, marginBottom: 3 },
  siteLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  siteLocation: { fontSize: 12, color: T.textMuted },
  siteStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  siteStatusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  siteStatusText: { fontSize: 11, fontWeight: '600', color: '#10B981' },
  siteProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  siteProgressLabel: { fontSize: 12, color: T.textSecondary, fontWeight: '500' },
  siteProgressPct: { fontSize: 12, fontWeight: '700', color: T.text },
  progressTrack: {
    height: 7,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: 7,
    backgroundColor: T.amber,
    borderRadius: 4,
  },
  siteMeta: { flexDirection: 'row', gap: 16 },
  siteMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  siteMetaText: { fontSize: 12, color: T.textSecondary, fontWeight: '500' },

  /* Recent Workers */
  workersScroll: { paddingHorizontal: 16, paddingBottom: 4, gap: 10 },
  workerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: T.border,
    gap: 10,
    minWidth: 150,
  },
  workerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workerInfo: { gap: 2 },
  workerName: { fontSize: 13, fontWeight: '700', color: T.text },
  workerTrade: { fontSize: 11, color: T.textMuted },
});
