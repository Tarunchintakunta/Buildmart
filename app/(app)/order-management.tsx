import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type OrderStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
type TabFilter = 'All' | OrderStatus;

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: T.amber,
  Processing: '#3B82F6',
  Delivered: '#10B981',
  Cancelled: '#EF4444',
};

const TABS: TabFilter[] = ['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'];

const STATS = [
  { label: 'Total', value: '456', color: T.navy },
  { label: 'Pending', value: '23', color: T.amber },
  { label: 'Processing', value: '15', color: '#3B82F6' },
  { label: 'Delivered', value: '400', color: '#10B981' },
  { label: 'Cancelled', value: '18', color: '#EF4444' },
];

type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  shop: string;
  amount: string;
  date: string;
  status: OrderStatus;
};

const ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'BM-2847',
    customer: 'Rajesh Kumar',
    shop: 'Sharma Building Materials',
    amount: 'Rs.24,500',
    date: '25 Feb 2026',
    status: 'Pending',
  },
  {
    id: '2',
    orderNumber: 'BM-2846',
    customer: 'Anita Desai',
    shop: 'Krishna Cement House',
    amount: 'Rs.18,200',
    date: '25 Feb 2026',
    status: 'Processing',
  },
  {
    id: '3',
    orderNumber: 'BM-2845',
    customer: 'Suresh Patel',
    shop: 'Gupta Hardware & Tools',
    amount: 'Rs.12,800',
    date: '24 Feb 2026',
    status: 'Delivered',
  },
  {
    id: '4',
    orderNumber: 'BM-2844',
    customer: 'Priya Sharma',
    shop: 'Patel Steel Traders',
    amount: 'Rs.45,000',
    date: '24 Feb 2026',
    status: 'Delivered',
  },
  {
    id: '5',
    orderNumber: 'BM-2843',
    customer: 'Vikram Singh',
    shop: 'Singh Sand & Gravel',
    amount: 'Rs.8,500',
    date: '23 Feb 2026',
    status: 'Cancelled',
  },
];

export default function OrderManagementScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = ORDERS.filter((order) => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const matchesSearch =
      searchQuery === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shop.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const renderOrderCard = (order: Order) => {
    const statusColor = STATUS_COLORS[order.status];
    return (
      <View key={order.id} style={[s.orderCard, { borderLeftWidth: 4, borderLeftColor: statusColor }]}>
        {/* Order Header */}
        <View style={s.orderHeader}>
          <View style={{ flex: 1 }}>
            <Text style={s.orderNumber}>#{order.orderNumber}</Text>
            <Text style={s.orderDate}>{order.date}</Text>
          </View>
          <View style={[s.statusBadge, { backgroundColor: statusColor + '26' }]}>
            <Text style={[s.statusText, { color: statusColor }]}>{order.status}</Text>
          </View>
        </View>

        {/* Order Details */}
        <View style={s.orderDetails}>
          <View style={s.detailRow}>
            <Ionicons name="person-outline" size={14} color={T.textMuted} />
            <Text style={s.detailLabel}>Customer:</Text>
            <Text style={s.detailValue}>{order.customer}</Text>
          </View>
          <View style={s.detailRow}>
            <Ionicons name="storefront-outline" size={14} color={T.textMuted} />
            <Text style={s.detailLabel}>Shop:</Text>
            <Text style={s.detailValue}>{order.shop}</Text>
          </View>
          <View style={s.detailRow}>
            <Ionicons name="wallet-outline" size={14} color={T.textMuted} />
            <Text style={s.detailLabel}>Amount:</Text>
            <Text style={s.detailAmount}>{order.amount}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={s.actionRow}>
          <TouchableOpacity style={s.actionBtnOutline}>
            <Ionicons name="eye-outline" size={15} color={T.navy} />
            <Text style={s.actionBtnOutlineText}>View Details</Text>
          </TouchableOpacity>
          {order.status === 'Pending' && (
            <TouchableOpacity style={s.actionBtnFilled}>
              <Ionicons name="car-outline" size={15} color={T.white} />
              <Text style={s.actionBtnFilledText}>Assign Driver</Text>
            </TouchableOpacity>
          )}
          {(order.status === 'Processing' || order.status === 'Cancelled') && (
            <TouchableOpacity style={[s.actionBtnOutline, { borderColor: '#EF4444' }]}>
              <Ionicons name="alert-circle-outline" size={15} color="#EF4444" />
              <Text style={[s.actionBtnOutlineText, { color: '#EF4444' }]}>Resolve Issue</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Order Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={s.searchContainer}>
          <View style={s.searchBar}>
            <Ionicons name="search-outline" size={18} color={T.textMuted} />
            <TextInput
              style={s.searchInput}
              placeholder="Search orders, customers, shops..."
              placeholderTextColor={T.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={T.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Stats Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
        >
          {STATS.map((stat) => (
            <View key={stat.label} style={s.statCard}>
              <Text style={[s.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginTop: 16 }}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[s.tab, activeTab === tab && s.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Order Cards */}
        <View style={s.orderList}>
          {filteredOrders.length === 0 ? (
            <View style={s.empty}>
              <View style={s.emptyIcon}>
                <Ionicons name="cube-outline" size={48} color={T.textMuted} />
              </View>
              <Text style={s.emptyTitle}>No orders found</Text>
              <Text style={s.emptyDesc}>
                {searchQuery ? 'Try a different search term.' : 'No orders match this filter.'}
              </Text>
            </View>
          ) : (
            filteredOrders.map(renderOrderCard)
          )}
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: T.text,
  },

  /* Search */
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  searchBar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: T.text,
    fontWeight: '400' as const,
  },

  /* Stats */
  statCard: {
    backgroundColor: T.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center' as const,
    minWidth: 80,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800' as const,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: T.textMuted,
    fontWeight: '500' as const,
  },

  /* Tabs */
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
  },
  tabActive: {
    backgroundColor: T.navy,
    borderColor: T.navy,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.textMuted,
  },
  tabTextActive: {
    color: T.white,
  },

  /* Order List */
  orderList: {
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 14,
  },

  /* Order Card */
  orderCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 14,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
  },
  orderDate: {
    fontSize: 12,
    color: T.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },

  /* Order Details */
  orderDetails: {
    gap: 8,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: T.textMuted,
    fontWeight: '500' as const,
  },
  detailValue: {
    fontSize: 13,
    color: T.text,
    fontWeight: '600' as const,
    flex: 1,
  },
  detailAmount: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.amber,
  },

  /* Actions */
  actionRow: {
    flexDirection: 'row' as const,
    gap: 10,
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.navy,
  },
  actionBtnOutlineText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.navy,
  },
  actionBtnFilled: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: T.navy,
  },
  actionBtnFilledText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.white,
  },

  /* Empty */
  empty: {
    alignItems: 'center' as const,
    paddingTop: 60,
    gap: 10,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.text,
  },
  emptyDesc: {
    fontSize: 14,
    color: T.textSecondary,
    textAlign: 'center' as const,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
};
