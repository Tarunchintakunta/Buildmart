import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

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
    id: '1',
    order: 1,
    type: 'pickup',
    address: '12, Industrial Area, Phase 2, Whitefield',
    customer: 'Sri Lakshmi Cement Depot',
    items: '50 bags cement, 20 bags sand',
  },
  {
    id: '2',
    order: 2,
    type: 'delivery',
    address: '45/A, 3rd Cross, JP Nagar, Bangalore',
    customer: 'Rajesh Kumar',
    items: '30 bags cement, 10 TMT bars',
  },
  {
    id: '3',
    order: 3,
    type: 'delivery',
    address: '78, MG Road, Indiranagar, Bangalore',
    customer: 'Priya Construction',
    items: '20 bags sand, 5 bags putty',
  },
];

const ROUTE_STATS = [
  { label: 'Total Distance', value: '15.3 km', icon: 'navigate-outline' as const },
  { label: 'Est. Time', value: '1h 45m', icon: 'time-outline' as const },
  { label: 'Total Earnings', value: 'Rs.550', icon: 'wallet-outline' as const },
];

export default function RouteOptimizationScreen() {
  const router = useRouter();
  const [optimized, setOptimized] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Route Planner</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Map Placeholder */}
        <View style={s.mapArea}>
          <View style={s.mapContent}>
            {/* Dotted route visualization */}
            <View style={s.routeVisualization}>
              {/* Start point */}
              <View style={s.routePointStart}>
                <Ionicons name="navigate" size={14} color={T.white} />
              </View>
              {/* Dotted line segment 1 */}
              <View style={s.dottedLineContainer}>
                {[...Array(8)].map((_, i) => (
                  <View key={`d1-${i}`} style={s.dot} />
                ))}
              </View>
              {/* Stop 1 */}
              <View style={s.routePointMid}>
                <Text style={s.routePointText}>1</Text>
              </View>
              {/* Dotted line segment 2 */}
              <View style={s.dottedLineContainer}>
                {[...Array(8)].map((_, i) => (
                  <View key={`d2-${i}`} style={s.dot} />
                ))}
              </View>
              {/* Stop 2 */}
              <View style={s.routePointMid}>
                <Text style={s.routePointText}>2</Text>
              </View>
              {/* Dotted line segment 3 */}
              <View style={s.dottedLineContainer}>
                {[...Array(8)].map((_, i) => (
                  <View key={`d3-${i}`} style={s.dot} />
                ))}
              </View>
              {/* End point */}
              <View style={[s.routePointStart, { backgroundColor: T.success }]}>
                <Ionicons name="location" size={14} color={T.white} />
              </View>
            </View>
            <Text style={s.mapLabel}>Route Overview</Text>
          </View>
        </View>

        {/* Route Stats */}
        <View style={s.statsRow}>
          {ROUTE_STATS.map((stat, i) => (
            <View key={i} style={s.statCard}>
              <Ionicons name={stat.icon} size={18} color={T.amber} />
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Active Deliveries */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Active Deliveries</Text>
          <Text style={s.sectionSub}>{STOPS.length} stops</Text>
        </View>

        {STOPS.map((stop) => (
          <View key={stop.id} style={s.stopCard}>
            <View style={s.stopLeft}>
              {/* Drag handle */}
              <View style={s.dragHandle}>
                <Ionicons name="reorder-three" size={20} color={T.textMuted} />
              </View>
              {/* Stop number */}
              <View style={s.stopNumber}>
                <Text style={s.stopNumberText}>{stop.order}</Text>
              </View>
            </View>
            <View style={s.stopContent}>
              <View style={s.stopTypeRow}>
                <View style={[
                  s.stopTypeDot,
                  { backgroundColor: stop.type === 'pickup' ? T.info : T.success },
                ]} />
                <Text style={s.stopTypeText}>
                  {stop.type === 'pickup' ? 'Pickup' : 'Deliver'}
                </Text>
              </View>
              <Text style={s.stopCustomer}>{stop.customer}</Text>
              <View style={s.stopAddressRow}>
                <Ionicons name="location-outline" size={14} color={T.textMuted} />
                <Text style={s.stopAddress}>{stop.address}</Text>
              </View>
              <View style={s.stopItemsRow}>
                <Ionicons name="cube-outline" size={14} color={T.textSecondary} />
                <Text style={s.stopItems}>{stop.items}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Optimize Route Button */}
        <TouchableOpacity
          style={s.optimizeBtn}
          onPress={() => setOptimized(!optimized)}
        >
          <Ionicons name="analytics-outline" size={20} color={T.white} />
          <Text style={s.optimizeBtnText}>
            {optimized ? 'Route Optimized' : 'Optimize Route'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Start Navigation Button */}
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.navBtn}>
          <Ionicons name="navigate" size={20} color={T.white} />
          <Text style={s.navBtnText}>Start Navigation</Text>
        </TouchableOpacity>
      </View>
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
  mapArea: {
    height: 200,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  mapContent: {
    alignItems: 'center' as const,
    gap: 12,
  },
  routeVisualization: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
  },
  routePointStart: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: T.info,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  routePointMid: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: T.navy,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  routePointText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: T.white,
  },
  dottedLineContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    marginHorizontal: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.textMuted,
  },
  mapLabel: {
    fontSize: 13,
    color: T.textMuted,
    fontWeight: '500' as const,
  },
  statsRow: {
    flexDirection: 'row' as const,
    marginHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: T.border,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: T.textMuted,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
  },
  sectionSub: {
    fontSize: 13,
    color: T.textMuted,
  },
  stopCard: {
    flexDirection: 'row' as const,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: T.border,
  },
  stopLeft: {
    alignItems: 'center' as const,
    marginRight: 12,
    gap: 8,
  },
  dragHandle: {
    opacity: 0.5,
  },
  stopNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.navy,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  stopNumberText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.white,
  },
  stopContent: {
    flex: 1,
  },
  stopTypeRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginBottom: 4,
  },
  stopTypeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stopTypeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  stopCustomer: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 4,
  },
  stopAddressRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 4,
    marginBottom: 4,
  },
  stopAddress: {
    flex: 1,
    fontSize: 13,
    color: T.textSecondary,
    lineHeight: 18,
  },
  stopItemsRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  stopItems: {
    flex: 1,
    fontSize: 12,
    color: T.textMuted,
  },
  optimizeBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: T.amber,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  optimizeBtnText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.white,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: T.surface,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  navBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: T.navy,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  navBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.white,
  },
};
