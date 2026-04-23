import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { walletApi } from '../../api/wallet.api';
import { deliveriesApi } from '../../api/deliveries.api';
import { LightTheme as T } from '../../theme/colors';

export default function DriverDashboard() {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(true);
  const [balance, setBalance] = useState(0);
  const [availableCount, setAvailableCount] = useState(0);

  useEffect(() => {
    walletApi.getMyWallet().then((w) => setBalance(w.balance)).catch(() => {});
    deliveriesApi.getAvailableDeliveries().then((d) => setAvailableCount(d.length)).catch(() => {});
  }, []);

  const handleToggle = (val: boolean) => {
    setIsAvailable(val);
    deliveriesApi.toggleAvailability(val).catch(() => {});
  };

  return (
    <View style={{ padding: 16, gap: 16 }}>
      {/* Availability Toggle */}
      <View style={s.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={s.label}>Availability</Text>
            <Text style={[s.statusTitle, { color: isAvailable ? T.success : T.textSecondary }]}>
              {isAvailable ? 'Online - Ready for Deliveries' : 'Offline'}
            </Text>
          </View>
          <Switch value={isAvailable} onValueChange={handleToggle} trackColor={{ false: T.border, true: T.success }} thumbColor={T.white} />
        </View>
      </View>

      {/* Earnings */}
      <View style={s.navyCard}>
        <Text style={s.navyLabel}>Wallet Balance</Text>
        <Text style={s.navyAmount}>Rs.{balance.toLocaleString('en-IN')}</Text>
        <TouchableOpacity style={s.navyBtn} onPress={() => router.push('/(app)/(tabs)/wallet')}>
          <Ionicons name="wallet" size={16} color={T.white} />
          <Text style={s.navyBtnText}>View Earnings</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity style={[s.statCard, { flex: 1 }]} onPress={() => router.push('/(app)/(tabs)/deliveries')}>
          <Ionicons name="car" size={24} color="#3B82F6" />
          <Text style={s.statValue}>{availableCount}</Text>
          <Text style={s.statLabel}>Available Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.statCard, { flex: 1 }]} onPress={() => router.push('/(app)/(tabs)/deliveries')}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <Text style={s.statValue}>-</Text>
          <Text style={s.statLabel}>Today Delivered</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View>
        <Text style={s.sectionTitle}>Quick Actions</Text>
        {[
          { label: 'Available Orders', icon: 'car' as const, route: '/(app)/(tabs)/deliveries' },
          { label: 'My Deliveries', icon: 'list' as const, route: '/(app)/(tabs)/deliveries' },
          { label: 'Earnings Wallet', icon: 'wallet' as const, route: '/(app)/(tabs)/wallet' },
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
  card: { backgroundColor: T.surface, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: T.border },
  label: { fontSize: 13, color: T.textSecondary, marginBottom: 4 },
  statusTitle: { fontSize: 17, fontWeight: '700' as const },
  navyCard: { backgroundColor: T.navy, borderRadius: 16, padding: 20 },
  navyLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  navyAmount: { fontSize: 30, fontWeight: '800' as const, color: T.white, marginBottom: 16 },
  navyBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, gap: 6, alignSelf: 'flex-start' as const },
  navyBtnText: { fontSize: 13, fontWeight: '600' as const, color: T.white },
  statCard: { backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, alignItems: 'center' as const, gap: 6 },
  statValue: { fontSize: 22, fontWeight: '800' as const, color: T.text },
  statLabel: { fontSize: 12, color: T.textSecondary, textAlign: 'center' as const },
  sectionTitle: { fontSize: 18, fontWeight: '800' as const, color: T.text, marginBottom: 14 },
  actionRow: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, marginBottom: 10, gap: 14 },
  actionIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#FEF3C7', alignItems: 'center' as const, justifyContent: 'center' as const },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '600' as const, color: T.text },
};
