import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWalletStore } from '../../store/useStore';
import { LightTheme } from '../../theme/designSystem';

const T = LightTheme;

const STATS = [
  { label: "Today's Orders", value: '12', icon: 'receipt' as const, color: '#3B82F6', trend: '+3' },
  { label: 'Pending', value: '5', icon: 'time' as const, color: '#F59E0B', trend: null },
  { label: "Today's Revenue", value: 'Rs.45K', icon: 'cash' as const, color: '#10B981', trend: '+12%' },
  { label: 'Low Stock', value: '8', icon: 'warning' as const, color: '#EF4444', trend: null },
];

export default function ShopkeeperDashboard() {
  const router = useRouter();
  const wallet = useWalletStore((state) => state.wallet);
  const walletBalance = wallet?.balance ?? 150000;
  const totalEarned = wallet?.total_earned ?? 500000;

  const shop = { name: 'Anand Hardware & Building Materials', rating: 4.5, totalOrders: 1250, isOpen: true };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 20 }}>
        {/* Shop Status Card */}
        <View style={s.shopCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={s.shopName}>{shop.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={s.shopRating}>{shop.rating}</Text>
                <Text style={s.dot}> · </Text>
                <Text style={s.shopOrders}>{shop.totalOrders} orders</Text>
              </View>
            </View>
            <View style={[s.openBadge, { backgroundColor: shop.isOpen ? '#D1FAE5' : '#FEF2F2' }]}>
              <View style={[s.openDot, { backgroundColor: shop.isOpen ? T.success : '#EF4444' }]} />
              <Text style={[s.openText, { color: shop.isOpen ? T.success : '#EF4444' }]}>
                {shop.isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>
          <View style={s.revenueDivider} />
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={s.revLabel}>Available Balance</Text>
              <Text style={s.revAmount}>Rs.{walletBalance.toLocaleString()}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' as const }}>
              <Text style={s.revLabel}>Total Earned</Text>
              <Text style={[s.revAmount, { color: T.success }]}>Rs.{totalEarned.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={s.statsGrid}>
          {STATS.map((stat, i) => (
            <View key={i} style={s.statCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <View style={[s.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  <Ionicons name={stat.icon} size={22} color={stat.color} />
                </View>
                {stat.trend && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Ionicons name="trending-up" size={14} color={T.success} />
                    <Text style={s.trendText}>{stat.trend}</Text>
                  </View>
                )}
              </View>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={s.primaryAction} onPress={() => router.push('/(app)/(tabs)/inventory')}>
            <Ionicons name="add-circle" size={20} color={T.white} />
            <Text style={s.primaryActionText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.secondaryAction} onPress={() => router.push('/(app)/(tabs)/orders')}>
            <Ionicons name="receipt" size={20} color={T.navy} />
            <Text style={s.secondaryActionText}>View Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Pending Orders */}
        <View>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Pending Orders</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/orders')}>
              <Text style={s.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {[
            { id: 'ORD-2024-0002', customer: 'Rajesh Constructions', items: '50x Cement, 20x TMT Bars', total: 'Rs.30,000', time: '10 mins ago' },
            { id: 'ORD-2024-0003', customer: 'Priya Patel', items: '1x UPVC Window, 2x Door Hinges', total: 'Rs.10,230', time: '25 mins ago' },
          ].map((order, i) => (
            <View key={i} style={s.orderCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Text style={s.orderId}>{order.id}</Text>
                    <Text style={s.orderTime}>{order.time}</Text>
                  </View>
                  <Text style={s.orderCustomer}>{order.customer}</Text>
                  <Text style={s.orderItems} numberOfLines={1}>{order.items}</Text>
                  <Text style={s.orderTotal}>{order.total}</Text>
                </View>
                <View style={{ gap: 8, marginLeft: 12 }}>
                  <TouchableOpacity style={s.acceptBtn}><Text style={s.acceptText}>Accept</Text></TouchableOpacity>
                  <TouchableOpacity style={s.declineBtn}><Text style={s.declineText}>Decline</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Low Stock Alert */}
        <View>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Low Stock Alert</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/inventory')}>
              <Text style={s.viewAll}>Manage</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12, paddingRight: 16 }}>
              {[
                { name: 'UltraTech Cement 50kg', stock: 5, minStock: 20 },
                { name: 'TMT Bar 12mm', stock: 8, minStock: 25 },
                { name: 'PVC Pipe 4 inch', stock: 12, minStock: 30 },
              ].map((item, i) => (
                <View key={i} style={s.stockCard}>
                  <Ionicons name="warning" size={22} color="#EF4444" />
                  <Text style={s.stockName} numberOfLines={2}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 }}>
                    <Text style={s.stockCount}>{item.stock}</Text>
                    <Text style={s.stockMin}> / {item.minStock} min</Text>
                  </View>
                  <TouchableOpacity style={s.restockBtn}>
                    <Text style={s.restockText}>Restock</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Assigned Drivers */}
        <View style={{ marginBottom: 16 }}>
          <Text style={s.sectionTitle}>Your Drivers</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[
              { name: 'Krishna', status: 'delivering', orders: 2 },
              { name: 'Ramesh', status: 'available', orders: 0 },
            ].map((driver, i) => (
              <View key={i} style={s.driverCard}>
                <View style={s.driverAvatar}>
                  <Ionicons name="person" size={18} color={T.textMuted} />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={s.driverName}>{driver.name}</Text>
                  <Text style={[s.driverStatus, { color: driver.status === 'available' ? T.success : T.info }]}>
                    {driver.status === 'available' ? 'Available' : `${driver.orders} deliveries`}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const s = {
  shopCard: { backgroundColor: T.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border },
  shopName: { fontSize: 17, fontWeight: '800' as const, color: T.text },
  shopRating: { fontSize: 14, fontWeight: '700' as const, color: T.text, marginLeft: 4 },
  dot: { fontSize: 12, color: T.textMuted },
  shopOrders: { fontSize: 13, color: T.textSecondary },
  openBadge: { flexDirection: 'row' as const, alignItems: 'center' as const, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  openDot: { width: 8, height: 8, borderRadius: 4 },
  openText: { fontSize: 13, fontWeight: '700' as const },
  revenueDivider: { height: 1, backgroundColor: T.border, marginVertical: 14 },
  revLabel: { fontSize: 12, color: T.textMuted, marginBottom: 4 },
  revAmount: { fontSize: 22, fontWeight: '800' as const, color: T.text },
  statsGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 12 },
  statCard: { width: '47%' as any, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  statIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center' as const, alignItems: 'center' as const },
  statValue: { fontSize: 24, fontWeight: '800' as const, color: T.text, marginBottom: 2 },
  statLabel: { fontSize: 13, fontWeight: '600' as const, color: T.textSecondary },
  trendText: { fontSize: 11, fontWeight: '700' as const, color: T.success },
  sectionTitle: { fontSize: 18, fontWeight: '800' as const, color: T.text, marginBottom: 14 },
  sectionHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 14 },
  viewAll: { fontSize: 13, fontWeight: '600' as const, color: T.amber },
  primaryAction: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.navy, borderRadius: 14, paddingVertical: 14, gap: 8 },
  primaryActionText: { fontSize: 14, fontWeight: '700' as const, color: T.white },
  secondaryAction: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.surface, borderRadius: 14, paddingVertical: 14, gap: 8, borderWidth: 1, borderColor: T.border },
  secondaryActionText: { fontSize: 14, fontWeight: '700' as const, color: T.navy },
  orderCard: { backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, borderLeftWidth: 4, borderLeftColor: T.amber, marginBottom: 10 },
  orderId: { fontSize: 14, fontWeight: '700' as const, color: T.text },
  orderTime: { fontSize: 11, color: T.textMuted },
  orderCustomer: { fontSize: 13, color: T.textSecondary, marginBottom: 2 },
  orderItems: { fontSize: 12, color: T.textMuted, marginBottom: 6 },
  orderTotal: { fontSize: 17, fontWeight: '800' as const, color: T.amber },
  acceptBtn: { backgroundColor: T.success, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  acceptText: { fontSize: 13, fontWeight: '700' as const, color: T.white },
  declineBtn: { backgroundColor: T.bg, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  declineText: { fontSize: 13, fontWeight: '700' as const, color: T.textSecondary },
  stockCard: { width: 170, backgroundColor: '#FEF2F2', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#FECACA' },
  stockName: { fontSize: 14, fontWeight: '700' as const, color: T.text, marginTop: 10, marginBottom: 8, minHeight: 36 },
  stockCount: { fontSize: 22, fontWeight: '800' as const, color: '#EF4444' },
  stockMin: { fontSize: 12, color: T.textMuted },
  restockBtn: { backgroundColor: '#EF4444', borderRadius: 10, paddingVertical: 10, alignItems: 'center' as const },
  restockText: { fontSize: 13, fontWeight: '700' as const, color: T.white },
  driverCard: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: T.border },
  driverAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: T.bg, justifyContent: 'center' as const, alignItems: 'center' as const },
  driverName: { fontSize: 14, fontWeight: '700' as const, color: T.text },
  driverStatus: { fontSize: 12, fontWeight: '600' as const, marginTop: 2 },
};
