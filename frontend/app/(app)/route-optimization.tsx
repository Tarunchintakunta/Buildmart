import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInLeft, ZoomIn } from 'react-native-reanimated';
import { LightTheme as T } from '../../src/theme/colors';

type DeliveryStop = {
  id: string;
  order: number;
  type: 'pickup' | 'delivery';
  address: string;
  customer: string;
  items: string;
};

const STOPS: DeliveryStop[] = [
  {
    id: '1', order: 1, type: 'pickup',
    address: 'Sri Lakshmi Cement Depot, Phase 2, Jeedimetla, Hyderabad',
    customer: 'Sri Lakshmi Cement Depot',
    items: '50 bags cement, 20 bags river sand',
  },
  {
    id: '2', order: 2, type: 'delivery',
    address: '45/A, 3rd Cross, Kondapur, Hyderabad 500084',
    customer: 'Rajesh Kumar',
    items: '30 bags cement, 10 TMT bars',
  },
  {
    id: '3', order: 3, type: 'delivery',
    address: '78, MG Road, Kukatpally, Hyderabad 500072',
    customer: 'Priya Construction Co.',
    items: '20 bags M-sand, 5 bags wall putty',
  },
];

const ROUTE_STATS = [
  { label: 'Total Distance', value: '15.3 km',  icon: 'navigate-outline'  as const },
  { label: 'Est. Time',      value: '1h 45m',   icon: 'time-outline'      as const },
  { label: 'Earnings',       value: '₹550',     icon: 'wallet-outline'    as const },
];

export default function RouteOptimizationScreen() {
  const router = useRouter();
  const [optimized, setOptimized] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInDown.duration(280)}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Route Planner</Text>
        <View style={{ width: 42 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Map Placeholder */}
        <Animated.View style={styles.mapArea} entering={FadeInDown.delay(60).springify().damping(18)}>
          <View style={styles.routeVisualization}>
            <View style={[styles.routePoint, { backgroundColor: T.info }]}>
              <Ionicons name="navigate" size={14} color={T.white} />
            </View>
            {[1, 2].map((_, i) => (
              <View key={i} style={styles.dotRow}>
                {[...Array(6)].map((__, j) => (
                  <View key={j} style={styles.dot} />
                ))}
                <View style={[styles.routePoint, { backgroundColor: T.navy, width: 26, height: 26, borderRadius: 13 }]}>
                  <Text style={styles.routePointText}>{i + 1}</Text>
                </View>
              </View>
            ))}
            <View style={styles.dotRow}>
              {[...Array(6)].map((_, j) => <View key={j} style={styles.dot} />)}
              <View style={[styles.routePoint, { backgroundColor: T.success }]}>
                <Ionicons name="location" size={14} color={T.white} />
              </View>
            </View>
          </View>
          <Text style={styles.mapLabel}>
            {optimized ? '✅ Route Optimized — Shortest path' : 'Route Overview'}
          </Text>
        </Animated.View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {ROUTE_STATS.map((stat, i) => (
            <Animated.View
              key={i}
              style={styles.statCard}
              entering={ZoomIn.delay(120 + i * 70).springify().damping(14)}
            >
              <Ionicons name={stat.icon} size={18} color={T.amber} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Stops */}
        <Animated.Text style={styles.sectionLabel} entering={FadeInDown.delay(280)}>
          DELIVERY STOPS ({STOPS.length})
        </Animated.Text>

        {STOPS.map((stop, i) => (
          <Animated.View
            key={stop.id}
            style={styles.stopCard}
            entering={FadeInLeft.delay(300 + i * 80).springify().damping(18).stiffness(180)}
          >
            <View style={styles.stopLeft}>
              <View style={styles.stopNumber}>
                <Text style={styles.stopNumberText}>{stop.order}</Text>
              </View>
            </View>
            <View style={styles.stopContent}>
              <View style={styles.stopTypeRow}>
                <View style={[
                  styles.stopTypeDot,
                  { backgroundColor: stop.type === 'pickup' ? T.info : T.success },
                ]} />
                <Text style={styles.stopTypeText}>
                  {stop.type === 'pickup' ? 'PICKUP' : 'DELIVER'}
                </Text>
              </View>
              <Text style={styles.stopCustomer}>{stop.customer}</Text>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={13} color={T.textMuted} />
                <Text style={styles.stopAddress}>{stop.address}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="cube-outline" size={13} color={T.textSecondary} />
                <Text style={styles.stopItems}>{stop.items}</Text>
              </View>
            </View>
          </Animated.View>
        ))}

        {/* Optimize Button */}
        <Animated.View entering={FadeInDown.delay(580).springify()}>
          <Pressable
            style={({ pressed }) => [
              styles.optimizeBtn,
              optimized && styles.optimizeBtnDone,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => setOptimized(!optimized)}
          >
            <Ionicons name={optimized ? 'checkmark-circle' : 'analytics-outline'} size={20} color={T.white} />
            <Text style={styles.optimizeBtnText}>
              {optimized ? 'Route Optimized ✓' : 'Optimize Route'}
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="navigate" size={20} color={T.white} />
          <Text style={styles.navBtnText}>Start Navigation</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: T.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: T.text },
  scroll: { padding: 16, paddingBottom: 32 },
  mapArea: {
    height: 180, backgroundColor: T.surface, borderRadius: 16,
    borderWidth: 1, borderColor: T.border, marginBottom: 12,
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  routeVisualization: { flexDirection: 'row', alignItems: 'center' },
  routePoint: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  routePointText: { fontSize: 12, fontWeight: '700', color: T.white },
  dotRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginHorizontal: 2 },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: T.textMuted },
  mapLabel: { fontSize: 13, color: T.textMuted, fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: T.surface, borderRadius: 12, padding: 12,
    alignItems: 'center', borderWidth: 1, borderColor: T.border, gap: 4,
  },
  statValue: { fontSize: 16, fontWeight: '700', color: T.text },
  statLabel: { fontSize: 10, color: T.textMuted, textAlign: 'center' },
  sectionLabel: {
    fontSize: 12, fontWeight: '700', color: T.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 2,
  },
  stopCard: {
    flexDirection: 'row', backgroundColor: T.surface,
    borderRadius: 14, padding: 14, borderWidth: 1, borderColor: T.border, marginBottom: 10,
  },
  stopLeft: { alignItems: 'center', marginRight: 14 },
  stopNumber: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: T.navy,
    alignItems: 'center', justifyContent: 'center',
  },
  stopNumberText: { fontSize: 13, fontWeight: '700', color: T.white },
  stopContent: { flex: 1 },
  stopTypeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  stopTypeDot: { width: 8, height: 8, borderRadius: 4 },
  stopTypeText: {
    fontSize: 11, fontWeight: '700', color: T.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  stopCustomer: { fontSize: 15, fontWeight: '700', color: T.text, marginBottom: 5 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginBottom: 3 },
  stopAddress: { flex: 1, fontSize: 12, color: T.textSecondary, lineHeight: 17 },
  stopItems: { flex: 1, fontSize: 12, color: T.textMuted },
  optimizeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.amber, borderRadius: 14, paddingVertical: 14,
    marginTop: 4, gap: 8,
    shadowColor: T.amber, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
  },
  optimizeBtnDone: { backgroundColor: T.success },
  optimizeBtnText: { fontSize: 15, fontWeight: '700', color: T.white },
  bottomBar: {
    padding: 16, backgroundColor: T.surface,
    borderTopWidth: 1, borderTopColor: T.border,
  },
  navBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.navy, borderRadius: 14, paddingVertical: 16, gap: 8,
    shadowColor: T.navy, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
  },
  navBtnText: { fontSize: 16, fontWeight: '700', color: T.white },
});
