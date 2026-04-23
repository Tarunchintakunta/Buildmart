import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn, FadeInUp } from 'react-native-reanimated';

const C = {
  navy: '#1A1D2E',
  navyLight: '#252838',
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

type DeliveryStatus = 'available' | 'accepted' | 'picked_up' | 'completed';
type TabKey = 'available' | 'active' | 'completed';

interface Delivery {
  id: string;
  orderNumber: string;
  status: DeliveryStatus;
  pickupName: string;
  pickupAddress: string;
  dropName: string;
  dropAddress: string;
  distance: string;
  eta: string;
  items: string;
  payout: number;
  assignedAt: string;
  completedAt?: string;
}

const MOCK_DELIVERIES: Delivery[] = [
  {
    id: 'd1',
    orderNumber: 'ORD-2024-0044',
    status: 'available',
    pickupName: 'Sri Lakshmi Traders',
    pickupAddress: 'Dilsukhnagar, Hyderabad',
    dropName: 'Rajesh Constructions',
    dropAddress: 'LB Nagar, Hyderabad',
    distance: '5.2 km',
    eta: '18 min',
    items: '5 bags cement, 2 TMT rods',
    payout: 150,
    assignedAt: '',
  },
  {
    id: 'd2',
    orderNumber: 'ORD-2024-0043',
    status: 'available',
    pickupName: 'Anand Hardware',
    pickupAddress: 'Ameerpet, Hyderabad',
    dropName: 'Priya Sharma',
    dropAddress: 'Banjara Hills, Hyderabad',
    distance: '4.8 km',
    eta: '15 min',
    items: '10 tiles boxes, 2 kg adhesive',
    payout: 130,
    assignedAt: '',
  },
  {
    id: 'd3',
    orderNumber: 'ORD-2024-0041',
    status: 'accepted',
    pickupName: 'Balaji Construction Store',
    pickupAddress: 'KPHB, Hyderabad',
    dropName: 'Suresh Reddy',
    dropAddress: 'Kondapur, Hyderabad',
    distance: '7.1 km',
    eta: '24 min',
    items: '3 paint buckets (20L each)',
    payout: 200,
    assignedAt: '10:30 AM',
  },
  {
    id: 'd4',
    orderNumber: 'ORD-2024-0039',
    status: 'picked_up',
    pickupName: 'Ravi Cement Depot',
    pickupAddress: 'Secunderabad',
    dropName: 'Anil Kumar',
    dropAddress: 'Begumpet, Hyderabad',
    distance: '3.5 km',
    eta: '12 min',
    items: '8 bags sand, 4 bags cement',
    payout: 170,
    assignedAt: '09:45 AM',
  },
  {
    id: 'd5',
    orderNumber: 'ORD-2024-0035',
    status: 'completed',
    pickupName: 'Metro Hardware',
    pickupAddress: 'Gachibowli, Hyderabad',
    dropName: 'Deepa Menon',
    dropAddress: 'Madhapur, Hyderabad',
    distance: '2.9 km',
    eta: '—',
    items: '1 set aluminium windows',
    payout: 120,
    assignedAt: '08:00 AM',
    completedAt: '08:30 AM',
  },
];

const TABS: { key: TabKey; label: string }[] = [
  { key: 'available', label: 'Available Pickups' },
  { key: 'active', label: 'My Active' },
  { key: 'completed', label: 'Completed' },
];

function filterByTab(tab: TabKey, deliveries: Delivery[]): Delivery[] {
  if (tab === 'available') return deliveries.filter((d) => d.status === 'available');
  if (tab === 'active') return deliveries.filter((d) => d.status === 'accepted' || d.status === 'picked_up');
  return deliveries.filter((d) => d.status === 'completed');
}

function todayEarnings(deliveries: Delivery[]): number {
  return deliveries.filter((d) => d.status === 'completed').reduce((s, d) => s + d.payout, 0);
}

export default function DeliveriesScreen() {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('available');
  const [deliveries, setDeliveries] = useState<Delivery[]>(MOCK_DELIVERIES);

  const visible = filterByTab(activeTab, deliveries);
  const earnings = todayEarnings(deliveries);

  function handleAccept(id: string) {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'accepted', assignedAt: 'Just now' } : d))
    );
    setActiveTab('active');
  }

  function handlePickedUp(id: string) {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'picked_up' } : d))
    );
  }

  function handleDeliver(id: string) {
    router.push('/delivery-proof');
  }

  function handleNavigate(id: string) {
    router.push('/order-tracking');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(350)} style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Deliveries</Text>
          <Text style={styles.headerSub}>
            {earnings > 0 ? `Today's earnings: ₹${earnings}` : 'No earnings yet today'}
          </Text>
        </View>
        <Pressable onPress={() => router.push('/scan')} style={styles.scanBtn}>
          <Ionicons name="qr-code-outline" size={22} color={C.white} />
        </Pressable>
      </Animated.View>

      {/* Availability Toggle */}
      <Animated.View entering={FadeInDown.delay(60).duration(350)} style={styles.availabilityBar}>
        <View style={styles.availabilityInfo}>
          <View style={[styles.availabilityDot, { backgroundColor: isAvailable ? C.success : C.error }]} />
          <View>
            <Text style={styles.availabilityStatus}>{isAvailable ? 'Available for Deliveries' : 'Not Available'}</Text>
            <Text style={styles.availabilityHint}>
              {isAvailable ? 'You will receive new delivery requests' : 'Toggle to start receiving requests'}
            </Text>
          </View>
        </View>
        <Switch
          value={isAvailable}
          onValueChange={setIsAvailable}
          trackColor={{ false: C.border, true: C.success + '55' }}
          thumbColor={isAvailable ? C.success : C.textMuted}
        />
      </Animated.View>

      {/* Tabs */}
      <Animated.View entering={FadeInDown.delay(100).duration(350)} style={styles.tabBar}>
        {TABS.map((tab) => {
          const count = filterByTab(tab.key, deliveries).length;
          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View style={[styles.tabBadge, activeTab === tab.key && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, activeTab === tab.key && styles.tabBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {visible.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.emptyState}>
            <Ionicons
              name={activeTab === 'available' ? 'bicycle-outline' : activeTab === 'active' ? 'navigate-outline' : 'checkmark-done-circle-outline'}
              size={56}
              color={C.textMuted}
            />
            <Text style={styles.emptyTitle}>
              {activeTab === 'available'
                ? 'No pickups available'
                : activeTab === 'active'
                ? 'No active deliveries'
                : 'No completed deliveries'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'available'
                ? isAvailable
                  ? 'Check back soon for new requests'
                  : 'Toggle to Available to see requests'
                : ''}
            </Text>
          </Animated.View>
        ) : (
          visible.map((delivery, i) => (
            <Animated.View
              key={delivery.id}
              entering={FadeInDown.delay(i * 70).duration(380)}
              style={styles.deliveryCard}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.orderBadge}>
                  <Ionicons name="cube-outline" size={13} color={C.navy} />
                  <Text style={styles.orderNumber}>{delivery.orderNumber}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(delivery.status) + '18' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(delivery.status) }]}>
                    {getStatusLabel(delivery.status)}
                  </Text>
                </View>
              </View>

              {/* Route */}
              <View style={styles.routeSection}>
                <View style={styles.routePoint}>
                  <View style={[styles.routeDot, { backgroundColor: C.amber }]} />
                  <View style={styles.routeTextCol}>
                    <Text style={styles.routePointName}>{delivery.pickupName}</Text>
                    <Text style={styles.routePointAddr}>{delivery.pickupAddress}</Text>
                  </View>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routePoint}>
                  <View style={[styles.routeDot, { backgroundColor: C.success }]} />
                  <View style={styles.routeTextCol}>
                    <Text style={styles.routePointName}>{delivery.dropName}</Text>
                    <Text style={styles.routePointAddr}>{delivery.dropAddress}</Text>
                  </View>
                </View>
              </View>

              {/* Meta Row */}
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={14} color={C.textMuted} />
                  <Text style={styles.metaText}>{delivery.distance}</Text>
                </View>
                {delivery.status !== 'completed' && (
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={C.textMuted} />
                    <Text style={styles.metaText}>{delivery.eta}</Text>
                  </View>
                )}
                <View style={styles.metaItem}>
                  <Ionicons name="layers-outline" size={14} color={C.textMuted} />
                  <Text style={styles.metaText} numberOfLines={1}>{delivery.items}</Text>
                </View>
              </View>

              {/* Payout + Actions */}
              <View style={styles.cardFooter}>
                <View style={styles.payoutBox}>
                  <Text style={styles.payoutLabel}>Payout</Text>
                  <Text style={styles.payoutAmount}>₹{delivery.payout}</Text>
                </View>
                <View style={styles.actionBtns}>
                  {delivery.status === 'available' && (
                    <Pressable
                      style={({ pressed }) => [styles.acceptBtn, pressed && styles.btnPressed]}
                      onPress={() => handleAccept(delivery.id)}
                    >
                      <Ionicons name="checkmark-circle" size={18} color={C.white} />
                      <Text style={styles.acceptBtnText}>Accept</Text>
                    </Pressable>
                  )}
                  {delivery.status === 'accepted' && (
                    <>
                      <Pressable
                        style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
                        onPress={() => handleNavigate(delivery.id)}
                      >
                        <Ionicons name="navigate-outline" size={15} color={C.navy} />
                        <Text style={styles.secondaryBtnText}>Navigate</Text>
                      </Pressable>
                      <Pressable
                        style={({ pressed }) => [styles.primarySmallBtn, pressed && styles.btnPressed]}
                        onPress={() => handlePickedUp(delivery.id)}
                      >
                        <Text style={styles.primarySmallBtnText}>Picked Up</Text>
                      </Pressable>
                    </>
                  )}
                  {delivery.status === 'picked_up' && (
                    <>
                      <Pressable
                        style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
                        onPress={() => handleNavigate(delivery.id)}
                      >
                        <Ionicons name="navigate-outline" size={15} color={C.navy} />
                        <Text style={styles.secondaryBtnText}>Navigate</Text>
                      </Pressable>
                      <Pressable
                        style={({ pressed }) => [styles.deliverBtn, pressed && styles.btnPressed]}
                        onPress={() => handleDeliver(delivery.id)}
                      >
                        <Ionicons name="checkmark-done-circle" size={16} color={C.white} />
                        <Text style={styles.deliverBtnText}>Deliver</Text>
                      </Pressable>
                    </>
                  )}
                  {delivery.status === 'completed' && (
                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color={C.success} />
                      <Text style={styles.completedText}>Done · {delivery.completedAt}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusColor(status: DeliveryStatus): string {
  switch (status) {
    case 'available': return '#3B82F6';
    case 'accepted': return '#F59E0B';
    case 'picked_up': return '#8B5CF6';
    case 'completed': return '#10B981';
  }
}

function getStatusLabel(status: DeliveryStatus): string {
  switch (status) {
    case 'available': return 'Available';
    case 'accepted': return 'Accepted';
    case 'picked_up': return 'Picked Up';
    case 'completed': return 'Completed';
  }
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: C.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: C.success, fontWeight: '600', marginTop: 2 },
  scanBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availabilityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.surface,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  availabilityInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  availabilityDot: { width: 10, height: 10, borderRadius: 5 },
  availabilityStatus: { fontSize: 14, fontWeight: '600', color: C.text },
  availabilityHint: { fontSize: 11, color: C.textSecondary, marginTop: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: C.navy },
  tabText: { fontSize: 12, fontWeight: '600', color: C.textSecondary },
  tabTextActive: { color: C.navy },
  tabBadge: {
    backgroundColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  tabBadgeActive: { backgroundColor: C.navy },
  tabBadgeText: { fontSize: 10, fontWeight: '700', color: C.textSecondary },
  tabBadgeTextActive: { color: C.white },
  listContent: { padding: 16, gap: 12, paddingBottom: 40 },
  emptyState: { alignItems: 'center', paddingVertical: 80, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: C.textSecondary },
  emptySubtitle: { fontSize: 13, color: C.textMuted, textAlign: 'center' },
  deliveryCard: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  orderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.navy + '10',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  orderNumber: { fontSize: 12, fontWeight: '700', color: C.navy },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  routeSection: { marginBottom: 12 },
  routePoint: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 4 },
  routeDot: { width: 10, height: 10, borderRadius: 5, marginTop: 3 },
  routeTextCol: { flex: 1 },
  routePointName: { fontSize: 13, fontWeight: '700', color: C.text },
  routePointAddr: { fontSize: 11, color: C.textSecondary, marginTop: 1 },
  routeLine: { width: 1, height: 14, backgroundColor: C.border, marginLeft: 4, marginVertical: 2 },
  metaRow: { flexDirection: 'row', gap: 12, marginBottom: 14, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: C.textSecondary, fontWeight: '500', maxWidth: 120 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: C.border, paddingTop: 12 },
  payoutBox: {},
  payoutLabel: { fontSize: 11, color: C.textSecondary, fontWeight: '500' },
  payoutAmount: { fontSize: 18, fontWeight: '800', color: C.navy },
  actionBtns: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.success,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  acceptBtnText: { fontSize: 14, fontWeight: '700', color: C.white },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.bg,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  secondaryBtnText: { fontSize: 13, fontWeight: '600', color: C.navy },
  primarySmallBtn: {
    backgroundColor: C.navy,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  primarySmallBtnText: { fontSize: 13, fontWeight: '700', color: C.white },
  deliverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.amber,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  deliverBtnText: { fontSize: 13, fontWeight: '700', color: C.white },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  completedText: { fontSize: 13, fontWeight: '600', color: C.success },
  btnPressed: { opacity: 0.75 },
});
