import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

const TABS = ['All', 'Active', 'Completed', 'Cancelled'];

const MOCK_ORDERS = [
  { id: '1', number: 'BM-98234', shop: 'BuildMart Main Store', items: 'Premium Portland Cement x5, TMT Steel Bars x10', total: 24839, status: 'delivered', date: 'Oct 28, 2023', deliveryTime: 'Delivered on Oct 28' },
  { id: '2', number: 'BM-98230', shop: 'Anand Hardware', items: 'Red Clay Bricks x500, Sand 2 tonnes', total: 8750, status: 'out_for_delivery', date: 'Oct 30, 2023', deliveryTime: 'Expected today by 5:00 PM' },
  { id: '3', number: 'BM-98228', shop: 'Sri Lakshmi Traders', items: 'Asian Paints Apex 20L x3', total: 9600, status: 'processing', date: 'Oct 31, 2023', deliveryTime: 'Estimated Nov 2' },
  { id: '4', number: 'BM-98220', shop: 'BuildMart Main Store', items: 'CPVC Pipes x20, Fittings', total: 7800, status: 'cancelled', date: 'Oct 15, 2023', deliveryTime: 'Cancelled on Oct 16' },
  { id: '5', number: 'BM-98215', shop: 'Balaji Construction', items: 'Cement x20, Bricks x1000', total: 18500, status: 'delivered', date: 'Oct 10, 2023', deliveryTime: 'Delivered on Oct 12' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  delivered: { label: 'Delivered', color: '#10B981', icon: 'checkmark-circle' },
  out_for_delivery: { label: 'In Transit', color: '#3B82F6', icon: 'car' },
  processing: { label: 'Processing', color: '#F59E0B', icon: 'time' },
  pending: { label: 'Pending', color: '#8B5CF6', icon: 'hourglass' },
  cancelled: { label: 'Cancelled', color: '#EF4444', icon: 'close-circle' },
};

export default function OrdersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All');

  const filtered = MOCK_ORDERS.filter((o) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return ['processing', 'out_for_delivery', 'pending'].includes(o.status);
    if (activeTab === 'Completed') return o.status === 'delivered';
    if (activeTab === 'Cancelled') return o.status === 'cancelled';
    return true;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>My Orders</Text>
        <TouchableOpacity style={s.searchBtn}>
          <Ionicons name="search" size={20} color={T.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={s.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.tab, activeTab === tab && s.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="receipt-outline" size={48} color={T.textMuted} />
            <Text style={s.emptyTitle}>No orders found</Text>
            <Text style={s.emptyDesc}>Your {activeTab.toLowerCase()} orders will appear here</Text>
          </View>
        ) : (
          filtered.map((order) => {
            const config = STATUS_CONFIG[order.status];
            return (
              <TouchableOpacity
                key={order.id}
                style={s.orderCard}
                onPress={() => router.push(`/(app)/order/${order.id}` as any)}
                activeOpacity={0.7}
              >
                <View style={s.orderTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.orderNumber}>Order #{order.number}</Text>
                    <Text style={s.orderDate}>{order.date}</Text>
                  </View>
                  <View style={[s.statusBadge, { backgroundColor: `${config.color}15` }]}>
                    <Ionicons name={config.icon} size={14} color={config.color} />
                    <Text style={[s.statusText, { color: config.color }]}>{config.label}</Text>
                  </View>
                </View>

                <View style={s.divider} />

                <View style={s.orderMid}>
                  <Ionicons name="storefront-outline" size={16} color={T.textMuted} />
                  <Text style={s.shopName}>{order.shop}</Text>
                </View>
                <Text style={s.orderItems} numberOfLines={2}>{order.items}</Text>

                <View style={s.divider} />

                <View style={s.orderBottom}>
                  <View>
                    <Text style={s.deliveryLabel}>{order.deliveryTime}</Text>
                  </View>
                  <Text style={s.orderTotal}>Rs.{order.total.toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  headerTitle: { fontSize: 22, fontWeight: '800' as const, color: T.text },
  searchBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: T.bg, justifyContent: 'center' as const, alignItems: 'center' as const },
  tabRow: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: T.surface,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: T.bg,
  },
  tabActive: { backgroundColor: T.navy },
  tabText: { fontSize: 13, fontWeight: '600' as const, color: T.textSecondary },
  tabTextActive: { color: T.white },
  orderCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  orderTop: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
  },
  orderNumber: { fontSize: 15, fontWeight: '700' as const, color: T.text },
  orderDate: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  statusText: { fontSize: 12, fontWeight: '700' as const },
  divider: { height: 1, backgroundColor: T.border, marginVertical: 12 },
  orderMid: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6, marginBottom: 6 },
  shopName: { fontSize: 13, fontWeight: '600' as const, color: T.textSecondary },
  orderItems: { fontSize: 13, color: T.textSecondary, lineHeight: 19 },
  orderBottom: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  deliveryLabel: { fontSize: 12, color: T.textMuted },
  orderTotal: { fontSize: 17, fontWeight: '800' as const, color: T.text },
  empty: { alignItems: 'center' as const, paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700' as const, color: T.text },
  emptyDesc: { fontSize: 14, color: T.textSecondary },
};
