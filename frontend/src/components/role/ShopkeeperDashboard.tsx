import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { walletApi } from '../../api/wallet.api';
import { ordersApi } from '../../api/orders.api';
import { LightTheme as T } from '../../theme/colors';

export default function ShopkeeperDashboard() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    walletApi.getMyWallet().then((w) => setBalance(w.balance)).catch(() => {});
    ordersApi.getShopOrders({ status: 'pending', limit: 1 }).then((r) => setPendingOrders(r.total)).catch(() => {});
  }, []);

  const stats = [
    { label: "Today's Orders", value: '-', icon: 'receipt' as const, color: '#3B82F6', route: '/(app)/(tabs)/orders' },
    { label: 'Pending', value: String(pendingOrders), icon: 'time' as const, color: '#F59E0B', route: '/(app)/(tabs)/orders' },
    { label: 'Low Stock', value: '-', icon: 'warning' as const, color: '#EF4444', route: '/(app)/(tabs)/inventory' },
    { label: 'Products', value: '-', icon: 'cube' as const, color: '#10B981', route: '/(app)/(tabs)/inventory' },
  ];

  return (
    <View style={{ padding: 16, gap: 16 }}>
      {/* Revenue Card */}
      <View style={s.navyCard}>
        <Text style={s.navyLabel}>Available Balance</Text>
        <Text style={s.navyAmount}>Rs.{balance.toLocaleString('en-IN')}</Text>
        <TouchableOpacity style={s.navyBtn} onPress={() => router.push('/(app)/(tabs)/wallet')}>
          <Ionicons name="wallet" size={16} color={T.white} />
          <Text style={s.navyBtnText}>View Wallet</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={s.statsGrid}>
        {stats.map((stat) => (
          <TouchableOpacity key={stat.label} style={s.statCard} onPress={() => router.push(stat.route as any)}>
            <View style={[s.statIcon, { backgroundColor: `${stat.color}15` }]}>
              <Ionicons name={stat.icon} size={22} color={stat.color} />
            </View>
            <Text style={s.statValue}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View>
        <Text style={s.sectionTitle}>Quick Actions</Text>
        {[
          { label: 'Manage Inventory', icon: 'cube' as const, route: '/(app)/(tabs)/inventory' },
          { label: 'Pending Orders', icon: 'receipt' as const, route: '/(app)/(tabs)/orders' },
          { label: 'View Wallet', icon: 'wallet' as const, route: '/(app)/(tabs)/wallet' },
          { label: 'Add Product', icon: 'add-circle' as const, route: '/(app)/add-product' },
        ].map((a) => (
          <TouchableOpacity key={a.label} style={s.actionRow} onPress={() => router.push(a.route as any)}>
            <View style={s.actionIcon}>
              <Ionicons name={a.icon} size={20} color={T.amber} />
            </View>
            <Text style={s.actionLabel}>{a.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={T.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = {
  navyCard: { backgroundColor: T.navy, borderRadius: 16, padding: 20 },
  navyLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  navyAmount: { fontSize: 30, fontWeight: '800' as const, color: T.white, marginBottom: 16 },
  navyBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, gap: 6, alignSelf: 'flex-start' as const },
  navyBtnText: { fontSize: 13, fontWeight: '600' as const, color: T.white },
  statsGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 12 },
  statCard: { width: '47%' as const, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  statIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center' as const, justifyContent: 'center' as const, marginBottom: 12 },
  statValue: { fontSize: 22, fontWeight: '800' as const, color: T.text, marginBottom: 4 },
  statLabel: { fontSize: 12, color: T.textSecondary },
  sectionTitle: { fontSize: 18, fontWeight: '800' as const, color: T.text, marginBottom: 14 },
  actionRow: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, marginBottom: 10, gap: 14 },
  actionIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#FEF3C7', alignItems: 'center' as const, justifyContent: 'center' as const },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '600' as const, color: T.text },
};
