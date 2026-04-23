import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useAuth } from '../../../src/hooks/useAuth';
import Colors from '../../../src/theme/colors';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MockOrder {
  id: string;
  number: string;
  shopName: string;
  shopIcon: keyof typeof Ionicons.glyphMap;
  itemSummary: string;
  itemCount: number;
  total: number;
  status: string;
  date: string;
  statusNote: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'ord-1',
    number: 'BM-98234',
    shopName: 'BuildMart Main Store',
    shopIcon: 'storefront-outline',
    itemSummary: 'UltraTech PPC Cement × 10 bags, SAIL TMT Bars × 50kg',
    itemCount: 2,
    total: 7450,
    status: 'delivered',
    date: '22 Apr 2026',
    statusNote: 'Delivered on 22 Apr, 3:45 PM',
  },
  {
    id: 'ord-2',
    number: 'BM-98230',
    shopName: 'Anand Hardware & Electricals',
    shopIcon: 'business-outline',
    itemSummary: 'Havells FR Wire 2.5mm × 3 coils, CPVC Pipes × 10',
    itemCount: 2,
    total: 9450,
    status: 'out_for_delivery',
    date: '23 Apr 2026',
    statusNote: 'Expected today by 5:00 PM',
  },
  {
    id: 'ord-3',
    number: 'BM-98228',
    shopName: 'Sri Lakshmi Paint House',
    shopIcon: 'color-palette-outline',
    itemSummary: 'Asian Paints Apex Ultima 20L × 2, Primer 4L × 4',
    itemCount: 2,
    total: 8600,
    status: 'processing',
    date: '23 Apr 2026',
    statusNote: 'Shopkeeper is packing your order',
  },
  {
    id: 'ord-4',
    number: 'BM-98220',
    shopName: 'Raj Building Materials',
    shopIcon: 'cube-outline',
    itemSummary: 'River Sand Grade 1 × 5 tons, M-Sand × 3 tons',
    itemCount: 2,
    total: 12600,
    status: 'accepted',
    date: '23 Apr 2026',
    statusNote: 'Order confirmed by shopkeeper',
  },
  {
    id: 'ord-5',
    number: 'BM-98215',
    shopName: 'Balaji Construction Supplies',
    shopIcon: 'construct-outline',
    itemSummary: 'ACC Gold Cement × 20 bags, Blue Metal Aggregate × 2 tons',
    itemCount: 2,
    total: 10800,
    status: 'cancelled',
    date: '15 Apr 2026',
    statusNote: 'Cancelled on 15 Apr — Out of stock',
  },
  {
    id: 'ord-6',
    number: 'BM-98210',
    shopName: 'BuildMart Main Store',
    shopIcon: 'storefront-outline',
    itemSummary: 'Sintex Water Tank 1000L × 1, CPVC Pipes × 20',
    itemCount: 2,
    total: 14000,
    status: 'pending',
    date: '23 Apr 2026',
    statusNote: 'Awaiting shopkeeper confirmation',
  },
];

const STATUS_CONFIG: Record<string, {
  label: string;
  color: string;
  bg: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = {
  pending: { label: 'Pending', color: '#8B5CF6', bg: '#F5F3FF', icon: 'hourglass-outline' },
  accepted: { label: 'Accepted', color: Colors.info, bg: '#EFF6FF', icon: 'checkmark-circle-outline' },
  processing: { label: 'Processing', color: Colors.accent, bg: Colors.amberBg, icon: 'time-outline' },
  out_for_delivery: { label: 'Out for Delivery', color: '#F97316', bg: '#FFF7ED', icon: 'bicycle-outline' },
  delivered: { label: 'Delivered', color: Colors.success, bg: '#F0FDF4', icon: 'checkmark-circle' },
  cancelled: { label: 'Cancelled', color: Colors.error, bg: '#FEF2F2', icon: 'close-circle' },
};

const TABS = ['All', 'Active', 'Completed', 'Cancelled'];

const ACTIVE_STATUSES = ['pending', 'accepted', 'processing', 'out_for_delivery'];

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order, index }: { order: MockOrder; index: number }) {
  const router = useRouter();
  const config = STATUS_CONFIG[order.status] ?? STATUS_CONFIG['pending'];
  const isActive = ACTIVE_STATUSES.includes(order.status);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70).springify().damping(18).stiffness(200)}
    >
      <Pressable
        style={styles.orderCard}
        onPress={() => router.push(`/(app)/order/${order.id}` as never)}
      >
        {/* Top Row */}
        <View style={styles.orderTop}>
          <View style={styles.orderTopLeft}>
            <Text style={styles.orderNumber}>#{order.number}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
            <Ionicons name={config.icon} size={12} color={config.color} />
            <Text style={[styles.statusLabel, { color: config.color }]}>{config.label}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Shop */}
        <View style={styles.shopRow}>
          <View style={styles.shopIconWrap}>
            <Ionicons name={order.shopIcon} size={16} color={Colors.primary} />
          </View>
          <Text style={styles.shopName} numberOfLines={1}>{order.shopName}</Text>
        </View>

        {/* Items */}
        <Text style={styles.itemSummary} numberOfLines={2}>{order.itemSummary}</Text>

        <View style={styles.divider} />

        {/* Bottom Row */}
        <View style={styles.orderBottom}>
          <View style={styles.orderBottomLeft}>
            <Ionicons
              name={isActive ? 'time-outline' : 'checkmark-done-outline'}
              size={13}
              color={isActive ? Colors.accent : Colors.textMuted}
            />
            <Text style={[styles.statusNote, isActive && { color: Colors.accent }]}>
              {order.statusNote}
            </Text>
          </View>
          <View style={styles.orderBottomRight}>
            <Text style={styles.orderTotal}>₹{order.total.toLocaleString('en-IN')}</Text>
            {isActive && (
              <View style={styles.trackBadge}>
                <Text style={styles.trackBadgeText}>Track</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: string }) {
  const router = useRouter();
  return (
    <Animated.View style={styles.emptyState} entering={FadeInDown.duration(400)}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="receipt-outline" size={40} color={Colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No {tab === 'All' ? '' : tab.toLowerCase()} orders</Text>
      <Text style={styles.emptySub}>
        {tab === 'Cancelled' ? 'No cancelled orders — great!' : 'Your orders will appear here once placed'}
      </Text>
      {tab === 'All' && (
        <Pressable
          style={styles.emptyShopBtn}
          onPress={() => router.push('/(app)/(tabs)/shop')}
        >
          <Text style={styles.emptyShopBtnText}>Browse Shop</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function OrdersScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filtered = MOCK_ORDERS.filter((o) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return ACTIVE_STATUSES.includes(o.status);
    if (activeTab === 'Completed') return o.status === 'delivered';
    if (activeTab === 'Cancelled') return o.status === 'cancelled';
    return true;
  });

  const activeCount = MOCK_ORDERS.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInUp.duration(400)}>
        <View>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSub}>
            {activeCount > 0 ? `${activeCount} active order${activeCount > 1 ? 's' : ''}` : 'All caught up!'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          {activeCount > 0 && (
            <View style={styles.activeDot} />
          )}
          <Pressable style={styles.iconBtn}>
            <Ionicons name="search-outline" size={20} color={Colors.primary} />
          </Pressable>
        </View>
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const count = tab === 'All' ? MOCK_ORDERS.length
            : tab === 'Active' ? MOCK_ORDERS.filter((o) => ACTIVE_STATUSES.includes(o.status)).length
            : tab === 'Completed' ? MOCK_ORDERS.filter((o) => o.status === 'delivered').length
            : MOCK_ORDERS.filter((o) => o.status === 'cancelled').length;

          return (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
              {count > 0 && (
                <View style={[styles.tabBadge, activeTab === tab && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, activeTab === tab && styles.tabBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Orders List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {filtered.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          filtered.map((order, index) => (
            <OrderCard key={order.id} order={order} index={index} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
  },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  tabBadgeTextActive: {
    color: Colors.white,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderTopLeft: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  shopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  shopIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    flex: 1,
  },
  itemSummary: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderBottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  statusNote: {
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
  },
  orderBottomRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  trackBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  trackBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    gap: 8,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textTransform: 'capitalize',
  },
  emptySub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyShopBtn: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  emptyShopBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});
