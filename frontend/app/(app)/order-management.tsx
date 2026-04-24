import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInLeft, ZoomIn } from 'react-native-reanimated';
import { LightTheme as T } from '../../src/theme/colors';

type OrderStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
type TabFilter = 'All' | OrderStatus;

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending:    T.amber,
  Processing: '#3B82F6',
  Delivered:  '#10B981',
  Cancelled:  '#EF4444',
};

const STATUS_ICONS: Record<OrderStatus, keyof typeof Ionicons.glyphMap> = {
  Pending:    'time-outline',
  Processing: 'refresh-outline',
  Delivered:  'checkmark-circle-outline',
  Cancelled:  'close-circle-outline',
};

const TABS: TabFilter[] = ['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'];

const KPI = [
  { label: 'Total',      value: '456', color: T.navy   },
  { label: 'Pending',    value: '23',  color: T.amber  },
  { label: 'Processing', value: '15',  color: '#3B82F6' },
  { label: 'Delivered',  value: '400', color: '#10B981' },
  { label: 'Cancelled',  value: '18',  color: '#EF4444' },
];

type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  shop: string;
  amount: string;
  date: string;
  status: OrderStatus;
  items: number;
};

const ORDERS: Order[] = [
  { id: '1', orderNumber: 'BM-2847', customer: 'Rajesh Kumar',  shop: 'Sharma Building Materials', amount: '₹24,500', date: '25 Feb 2026', status: 'Pending',    items: 4 },
  { id: '2', orderNumber: 'BM-2846', customer: 'Anita Desai',   shop: 'Krishna Cement House',       amount: '₹18,200', date: '25 Feb 2026', status: 'Processing', items: 2 },
  { id: '3', orderNumber: 'BM-2845', customer: 'Suresh Patel',  shop: 'Gupta Hardware & Tools',     amount: '₹12,800', date: '24 Feb 2026', status: 'Delivered',  items: 6 },
  { id: '4', orderNumber: 'BM-2844', customer: 'Priya Sharma',  shop: 'Patel Steel Traders',        amount: '₹45,000', date: '24 Feb 2026', status: 'Delivered',  items: 1 },
  { id: '5', orderNumber: 'BM-2843', customer: 'Vikram Singh',  shop: 'Singh Sand & Gravel',        amount: '₹8,500',  date: '23 Feb 2026', status: 'Cancelled',  items: 3 },
  { id: '6', orderNumber: 'BM-2842', customer: 'Meena Reddy',   shop: 'Reddy Paint Centre',         amount: '₹6,300',  date: '23 Feb 2026', status: 'Pending',    items: 2 },
  { id: '7', orderNumber: 'BM-2841', customer: 'Arjun Nair',    shop: 'Nair Electrical Supplies',   amount: '₹9,750',  date: '22 Feb 2026', status: 'Delivered',  items: 5 },
];

export default function OrderManagementScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabFilter>('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    ORDERS.filter(o => {
      const matchesTab = activeTab === 'All' || o.status === activeTab;
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.shop.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    }),
  [activeTab, search]);

  const handleAction = (order: Order, action: 'accept' | 'dispatch' | 'cancel') => {
    const labels = { accept: 'Accept', dispatch: 'Mark Dispatched', cancel: 'Cancel' };
    Alert.alert(`${labels[action]} Order`, `${labels[action]} order #${order.orderNumber}?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => Alert.alert('✅ Done', `Order #${order.orderNumber} updated.`) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInDown.duration(280)}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Order Management</Text>
        <Pressable style={styles.exportBtn}>
          <Ionicons name="download-outline" size={20} color={T.navy} />
        </Pressable>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* KPI Strip */}
        <Animated.View style={styles.kpiStrip} entering={FadeInDown.delay(60).springify().damping(18)}>
          {KPI.map((k, i) => (
            <Animated.View key={k.label} style={styles.kpiItem} entering={ZoomIn.delay(80 + i * 50).springify().damping(14)}>
              <Text style={[styles.kpiValue, { color: k.color }]}>{k.value}</Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Search */}
        <Animated.View style={styles.searchRow} entering={FadeInDown.delay(140)}>
          <Ionicons name="search-outline" size={18} color={T.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by order, customer, shop..."
            placeholderTextColor={T.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={T.textMuted} />
            </Pressable>
          )}
        </Animated.View>

        {/* Tab Filter */}
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabScrollContent}
          entering={FadeInDown.delay(180)}
        >
          {TABS.map(tab => (
            <Pressable
              key={tab}
              style={[styles.tabChip, activeTab === tab && styles.tabChipActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabChipText, activeTab === tab && styles.tabChipTextActive]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </Animated.ScrollView>

        {/* Count */}
        <Animated.Text style={styles.resultCount} entering={FadeInDown.delay(220)}>
          {filtered.length} order{filtered.length !== 1 ? 's' : ''}
        </Animated.Text>

        {/* Orders */}
        {filtered.length === 0 ? (
          <Animated.View style={styles.emptyState} entering={ZoomIn.springify().damping(14)}>
            <Ionicons name="receipt-outline" size={44} color={T.textMuted} />
            <Text style={styles.emptyText}>No orders found</Text>
          </Animated.View>
        ) : (
          filtered.map((order, i) => {
            const statusColor = STATUS_COLORS[order.status];
            return (
              <Animated.View
                key={order.id}
                style={[styles.orderCard, { borderLeftColor: statusColor }]}
                entering={FadeInLeft.delay(240 + i * 70).springify().damping(18).stiffness(180)}
              >
                {/* Top Row */}
                <View style={styles.orderTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
                    <Ionicons name={STATUS_ICONS[order.status]} size={12} color={statusColor} />
                    <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
                  </View>
                </View>

                {/* Details */}
                <View style={styles.orderDetail}>
                  <Ionicons name="person-outline" size={14} color={T.textMuted} />
                  <Text style={styles.orderDetailText}>{order.customer}</Text>
                </View>
                <View style={styles.orderDetail}>
                  <Ionicons name="storefront-outline" size={14} color={T.textMuted} />
                  <Text style={styles.orderDetailText}>{order.shop}</Text>
                </View>

                {/* Footer */}
                <View style={styles.orderFooter}>
                  <Text style={styles.orderAmount}>{order.amount}</Text>
                  <Text style={styles.orderItems}>{order.items} item{order.items !== 1 ? 's' : ''}</Text>
                  {order.status === 'Pending' && (
                    <View style={styles.actionRow}>
                      <Pressable
                        style={[styles.actionBtn, { backgroundColor: '#DCFCE7', borderColor: '#10B981' }]}
                        onPress={() => handleAction(order, 'accept')}
                      >
                        <Text style={[styles.actionBtnText, { color: '#10B981' }]}>Accept</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.actionBtn, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}
                        onPress={() => handleAction(order, 'cancel')}
                      >
                        <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Cancel</Text>
                      </Pressable>
                    </View>
                  )}
                  {order.status === 'Processing' && (
                    <Pressable
                      style={[styles.actionBtn, { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }]}
                      onPress={() => handleAction(order, 'dispatch')}
                    >
                      <Text style={[styles.actionBtnText, { color: '#3B82F6' }]}>Dispatch</Text>
                    </Pressable>
                  )}
                </View>
              </Animated.View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border,
  },
  backBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: T.text },
  exportBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 16, paddingBottom: 48 },
  kpiStrip: {
    flexDirection: 'row', backgroundColor: T.surface,
    borderRadius: 14, borderWidth: 1, borderColor: T.border,
    paddingVertical: 14, marginBottom: 14,
  },
  kpiItem: { flex: 1, alignItems: 'center' },
  kpiValue: { fontSize: 18, fontWeight: '800' },
  kpiLabel: { fontSize: 10, color: T.textMuted, marginTop: 2, textAlign: 'center' },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: T.surface, borderRadius: 12,
    borderWidth: 1, borderColor: T.border,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: T.text },
  tabScroll: { marginBottom: 12 },
  tabScrollContent: { gap: 8, paddingRight: 4 },
  tabChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: T.surface, borderWidth: 1.5, borderColor: T.border,
  },
  tabChipActive: { backgroundColor: T.navy, borderColor: T.navy },
  tabChipText: { fontSize: 13, fontWeight: '600', color: T.textSecondary },
  tabChipTextActive: { color: T.white },
  resultCount: { fontSize: 13, color: T.textMuted, marginBottom: 12, marginLeft: 2 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 15, color: T.textMuted, fontWeight: '600' },
  orderCard: {
    backgroundColor: T.surface, borderRadius: 14,
    borderWidth: 1, borderColor: T.border, borderLeftWidth: 4,
    padding: 14, marginBottom: 12,
  },
  orderTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  orderNumber: { fontSize: 15, fontWeight: '700', color: T.text },
  orderDate: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  orderDetail: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  orderDetailText: { fontSize: 13, color: T.textSecondary },
  orderFooter: {
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',
    gap: 8, marginTop: 10, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: T.border,
  },
  orderAmount: { fontSize: 16, fontWeight: '800', color: T.text, flex: 1 },
  orderItems: { fontSize: 13, color: T.textMuted },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 8, borderWidth: 1.5,
  },
  actionBtnText: { fontSize: 12, fontWeight: '700' },
});
