import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
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

type SiteStatus = 'Active' | 'Planning' | 'Completed';

type Site = {
  id: string;
  name: string;
  location: string;
  progress: number;
  status: SiteStatus;
  workers: number;
  budget: string;
  budgetUsed: string;
  startDate: string;
};

const SITES: Site[] = [
  {
    id: '1',
    name: 'Hitech City Apartment',
    location: 'Madhapur, Hyderabad',
    progress: 68,
    status: 'Active',
    workers: 8,
    budget: '₹12L',
    budgetUsed: '₹8.2L',
    startDate: '10 Jan 2026',
  },
  {
    id: '2',
    name: 'Banjara Hills Villa',
    location: 'Jubilee Hills, Hyderabad',
    progress: 35,
    status: 'Active',
    workers: 5,
    budget: '₹8L',
    budgetUsed: '₹2.8L',
    startDate: '05 Feb 2026',
  },
  {
    id: '3',
    name: 'Gachibowli Office Complex',
    location: 'Gachibowli, Hyderabad',
    progress: 100,
    status: 'Completed',
    workers: 0,
    budget: '₹35L',
    budgetUsed: '₹34.2L',
    startDate: '15 Jun 2025',
  },
];

const STATUS_CONFIG: Record<SiteStatus, { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  Active: { color: '#10B981', bg: '#DCFCE7', icon: 'checkmark-circle' },
  Planning: { color: '#F59E0B', bg: '#FEF3C7', icon: 'time' },
  Completed: { color: '#3B82F6', bg: '#DBEAFE', icon: 'flag' },
};

function SiteProgressBar({ progress, delay }: { progress: number; delay: number }) {
  const width = useSharedValue(0);
  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` as any }));

  useEffect(() => {
    const t = setTimeout(() => {
      width.value = withTiming(progress, { duration: 1000, easing: Easing.out(Easing.cubic) });
    }, delay);
    return () => clearTimeout(t);
  }, [progress, delay]);

  const barColor = progress === 100 ? '#3B82F6' : progress >= 60 ? '#10B981' : T.amber;

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, { backgroundColor: barColor }, barStyle]} />
    </View>
  );
}

function SiteCard({ site, index }: { site: Site; index: number }) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const cfg = STATUS_CONFIG[site.status];

  return (
    <Animated.View
      style={anim}
      entering={FadeInDown.delay(index * 70).springify().damping(18).stiffness(180)}
    >
      <Pressable
        style={styles.siteCard}
        onPressIn={() => { scale.value = withSpring(0.98, SPRING_SNAPPY); }}
        onPressOut={() => { scale.value = withSpring(1, SPRING_BOUNCY); }}
        onPress={() => router.push('/(app)/(tabs)/workers' as any)}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.siteIconBox}>
            <Ionicons name="business" size={22} color={T.amber} />
          </View>
          <View style={styles.siteInfo}>
            <Text style={styles.siteName}>{site.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={12} color={T.textMuted} />
              <Text style={styles.locationText}>{site.location}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icon} size={11} color={cfg.color} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{site.status}</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>Completion</Text>
            <Text style={[styles.progressPct, { color: cfg.color }]}>{site.progress}%</Text>
          </View>
          <SiteProgressBar progress={site.progress} delay={index * 100 + 200} />
        </View>

        {/* Meta Grid */}
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={13} color={T.textSecondary} />
            <Text style={styles.metaLabel}>Started</Text>
            <Text style={styles.metaValue}>{site.startDate}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={13} color={T.textSecondary} />
            <Text style={styles.metaLabel}>Workers</Text>
            <Text style={styles.metaValue}>{site.workers} active</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="wallet-outline" size={13} color={T.textSecondary} />
            <Text style={styles.metaLabel}>Budget</Text>
            <Text style={styles.metaValue}>{site.budgetUsed} / {site.budget}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Pressable style={styles.detailBtn}>
            <Ionicons name="eye-outline" size={15} color={T.navy} />
            <Text style={styles.detailBtnText}>View Details</Text>
          </Pressable>
          {site.status !== 'Completed' && (
            <Pressable
              style={styles.workerBtn}
              onPress={() => router.push('/(app)/(tabs)/workers' as any)}
            >
              <Ionicons name="person-add-outline" size={15} color="#fff" />
              <Text style={styles.workerBtnText}>Add Worker</Text>
            </Pressable>
          )}
          {site.status === 'Completed' && (
            <Pressable style={styles.reportBtn}>
              <Ionicons name="document-text-outline" size={15} color="#3B82F6" />
              <Text style={styles.reportBtnText}>View Report</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function SiteManagementScreen() {
  const router = useRouter();

  const activeSites = SITES.filter(s => s.status !== 'Completed').length;
  const totalWorkers = SITES.reduce((acc, s) => acc + s.workers, 0);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={styles.headerTitle}>My Sites</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Banner */}
        <Animated.View entering={FadeInDown.delay(0).springify().damping(18)}>
          <View style={styles.summaryBanner}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{SITES.length}</Text>
              <Text style={styles.summaryLabel}>Total Sites</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{activeSites}</Text>
              <Text style={styles.summaryLabel}>Active</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalWorkers}</Text>
              <Text style={styles.summaryLabel}>Workers</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>₹55L</Text>
              <Text style={styles.summaryLabel}>Total Budget</Text>
            </View>
          </View>
        </Animated.View>

        {/* Section Header */}
        <Animated.View entering={FadeInDown.delay(60).springify().damping(18)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Sites</Text>
            <View style={styles.siteCountBadge}>
              <Text style={styles.siteCountText}>{SITES.length} sites</Text>
            </View>
          </View>
        </Animated.View>

        {/* Site Cards */}
        <View style={styles.cardsList}>
          {SITES.map((site, i) => (
            <SiteCard key={site.id} site={site} index={i} />
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() =>
          Alert.alert(
            'Add New Site',
            'This will open the site creation form.',
            [{ text: 'OK' }]
          )
        }
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
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

  scrollContent: { paddingBottom: 100 },

  /* Summary Banner */
  summaryBanner: {
    margin: 16,
    backgroundColor: T.navy,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },
  summaryItem: { alignItems: 'center', gap: 4 },
  summaryValue: { fontSize: 18, fontWeight: '800', color: '#fff' },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: '500' },
  summaryDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.15)' },

  /* Section Header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: T.text },
  siteCountBadge: {
    backgroundColor: T.amberBg,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  siteCountText: { fontSize: 12, fontWeight: '600', color: T.amber },

  /* Cards List */
  cardsList: { paddingHorizontal: 16, gap: 14 },

  /* Site Card */
  siteCard: {
    backgroundColor: T.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  siteIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  siteInfo: { flex: 1 },
  siteName: { fontSize: 15, fontWeight: '700', color: T.text, marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locationText: { fontSize: 12, color: T.textMuted },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  statusText: { fontSize: 11, fontWeight: '700' },

  /* Progress */
  progressSection: { marginBottom: 14 },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  progressLabel: { fontSize: 12, color: T.textSecondary, fontWeight: '500' },
  progressPct: { fontSize: 13, fontWeight: '800' },
  progressTrack: {
    height: 8,
    backgroundColor: T.bg,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: { height: 8, borderRadius: 5 },

  /* Meta Grid */
  metaGrid: {
    flexDirection: 'row',
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
  },
  metaItem: { flex: 1, alignItems: 'center', gap: 3 },
  metaLabel: { fontSize: 10, color: T.textMuted, fontWeight: '500', marginTop: 3 },
  metaValue: { fontSize: 12, fontWeight: '700', color: T.text, textAlign: 'center' },
  metaDivider: { width: 1, height: 36, backgroundColor: T.border },

  /* Actions */
  actionRow: { flexDirection: 'row', gap: 10 },
  detailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.navy,
  },
  detailBtnText: { fontSize: 13, fontWeight: '700', color: T.navy },
  workerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: T.navy,
  },
  workerBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  reportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
  },
  reportBtnText: { fontSize: 13, fontWeight: '700', color: '#3B82F6' },

  /* FAB */
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: T.amber,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: T.amber,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
});
