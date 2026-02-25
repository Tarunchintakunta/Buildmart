import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useWalletStore } from '../../store/useStore';
import { LightTheme } from '../../theme/designSystem';

const T = LightTheme;

export default function DriverDashboard() {
  const router = useRouter();
  const wallet = useWalletStore((state) => state.wallet);
  const [isOnline, setIsOnline] = useState(true);

  const walletBalance = wallet?.balance ?? 8000;
  const totalEarned = wallet?.total_earned ?? 50000;

  const driverProfile = {
    type: 'shop_driver',
    shopName: 'Anand Hardware',
    vehicleType: 'Mini Truck',
    vehicleNumber: 'KA01AB1234',
    rating: 4.6,
    totalDeliveries: 500,
    todayDeliveries: 8,
    todayEarnings: 1200,
  };

  const isFreelance = driverProfile.type === 'freelance';

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 20 }}>
        {/* Online Status Card */}
        <View style={s.statusCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.statusLabel}>Driver Status</Text>
              <Text style={[s.statusTitle, { color: isOnline ? T.success : '#EF4444' }]}>
                {isOnline ? 'Online - Ready' : 'Offline'}
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Switch value={isOnline} onValueChange={setIsOnline} trackColor={{ false: '#EF4444', true: T.success }} thumbColor={T.white} />
              <Text style={s.switchLabel}>{isOnline ? 'Go Offline' : 'Go Online'}</Text>
            </View>
          </View>
          <View style={[s.typeBadge, { backgroundColor: isFreelance ? '#EDE9FE' : '#EFF6FF' }]}>
            <Text style={[s.typeText, { color: isFreelance ? '#8B5CF6' : T.info }]}>
              {isFreelance ? 'Freelance Driver' : `Shop Driver - ${driverProfile.shopName}`}
            </Text>
          </View>
          <View style={s.vehicleRow}>
            <Ionicons name="car" size={24} color={T.amber} />
            <View style={{ marginLeft: 12 }}>
              <Text style={s.vehicleType}>{driverProfile.vehicleType}</Text>
              <Text style={s.vehicleNumber}>{driverProfile.vehicleNumber}</Text>
            </View>
          </View>
        </View>

        {/* Today's Stats */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={[s.todayCard, { backgroundColor: T.navy }]}>
            <Ionicons name="bicycle" size={24} color={T.white} />
            <Text style={s.todayValue}>{driverProfile.todayDeliveries}</Text>
            <Text style={s.todayLabel}>Today's Deliveries</Text>
          </View>
          <View style={[s.todayCard, { backgroundColor: T.success }]}>
            <Ionicons name="cash" size={24} color={T.white} />
            <Text style={s.todayValue}>Rs.{driverProfile.todayEarnings}</Text>
            <Text style={s.todayLabel}>Today's Earnings</Text>
          </View>
        </View>

        {/* Wallet Summary */}
        <View style={s.walletCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={s.walletLabel}>Wallet Balance</Text>
              <Text style={s.walletAmount}>Rs.{walletBalance.toLocaleString()}</Text>
            </View>
            <TouchableOpacity style={s.withdrawBtn} onPress={() => router.push('/(app)/(tabs)/wallet')}>
              <Text style={s.withdrawText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
          <View style={s.walletDivider} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="trending-up" size={16} color={T.success} />
            <Text style={s.totalEarnedText}>Total Earned: Rs.{totalEarned.toLocaleString()}</Text>
          </View>
        </View>

        {/* Active Deliveries */}
        <View>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Active Deliveries</Text>
            <View style={s.activeBadge}><Text style={s.activeBadgeText}>2 Active</Text></View>
          </View>
          {[
            { id: 'ORD-2024-0002', customer: 'Rajesh Constructions', address: '100 Industrial Area, Bangalore', items: '50x Cement bags', distance: '5.2 km', earnings: 'Rs.200', status: 'pickup' },
            { id: 'ORD-2024-0005', customer: 'Amit Kumar', address: '78 Brigade Road, Bangalore', items: '2x Wooden Doors', distance: '3.8 km', earnings: 'Rs.150', status: 'delivering' },
          ].map((d, i) => (
            <View key={i} style={s.deliveryCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.deliveryId}>{d.id}</Text>
                  <Text style={s.deliveryCustomer}>{d.customer}</Text>
                </View>
                <View style={[s.deliveryBadge, { backgroundColor: d.status === 'pickup' ? '#EFF6FF' : '#D1FAE5' }]}>
                  <Text style={[s.deliveryBadgeText, { color: d.status === 'pickup' ? T.info : T.success }]}>
                    {d.status === 'pickup' ? 'Pickup' : 'Delivering'}
                  </Text>
                </View>
              </View>
              <View style={s.deliveryInfoRow}>
                <Ionicons name="location" size={16} color={T.textMuted} />
                <Text style={s.deliveryInfo} numberOfLines={1}>{d.address}</Text>
              </View>
              <View style={s.deliveryInfoRow}>
                <Ionicons name="cube" size={16} color={T.textMuted} />
                <Text style={s.deliveryInfo}>{d.items}</Text>
              </View>
              <View style={s.deliveryFooter}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="navigate" size={16} color={T.amber} />
                  <Text style={s.deliveryDistance}>{d.distance}</Text>
                </View>
                <Text style={s.deliveryEarnings}>{d.earnings}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={s.navBtn}>
                  <Ionicons name="navigate" size={16} color={T.white} />
                  <Text style={s.navBtnText}>Navigate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.completeBtn}>
                  <Ionicons name="checkmark-circle" size={16} color={T.white} />
                  <Text style={s.completeBtnText}>{d.status === 'pickup' ? 'Picked Up' : 'Delivered'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Scan QR */}
        <TouchableOpacity style={s.scanBtn} onPress={() => router.push('/(app)/scan?mode=delivery')}>
          <Ionicons name="scan" size={24} color={T.white} />
          <Text style={s.scanText}>Scan QR Code</Text>
        </TouchableOpacity>

        {/* Performance Stats */}
        <View style={{ marginBottom: 16 }}>
          <Text style={s.sectionTitle}>Your Performance</Text>
          <View style={s.perfCard}>
            <View style={s.perfItem}>
              <Text style={s.perfValue}>{driverProfile.totalDeliveries}</Text>
              <Text style={s.perfLabel}>Total Deliveries</Text>
            </View>
            <View style={s.perfDivider} />
            <View style={s.perfItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={s.perfValue}>{driverProfile.rating}</Text>
                <Ionicons name="star" size={16} color="#F59E0B" />
              </View>
              <Text style={s.perfLabel}>Rating</Text>
            </View>
            <View style={s.perfDivider} />
            <View style={s.perfItem}>
              <Text style={[s.perfValue, { color: T.success }]}>98%</Text>
              <Text style={s.perfLabel}>On Time</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = {
  statusCard: { backgroundColor: T.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border },
  statusLabel: { fontSize: 13, color: T.textMuted, fontWeight: '500' as const, marginBottom: 4 },
  statusTitle: { fontSize: 20, fontWeight: '800' as const },
  switchLabel: { fontSize: 11, color: T.textMuted, marginTop: 4 },
  typeBadge: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, marginBottom: 12, alignSelf: 'flex-start' as const },
  typeText: { fontSize: 13, fontWeight: '700' as const },
  vehicleRow: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.bg, borderRadius: 12, padding: 14 },
  vehicleType: { fontSize: 15, fontWeight: '700' as const, color: T.text },
  vehicleNumber: { fontSize: 13, color: T.textSecondary, marginTop: 2 },
  todayCard: { flex: 1, borderRadius: 16, padding: 18, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  todayValue: { fontSize: 26, fontWeight: '800' as const, color: T.white, marginTop: 10, marginBottom: 2 },
  todayLabel: { fontSize: 12, fontWeight: '600' as const, color: 'rgba(255,255,255,0.7)' },
  walletCard: { backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  walletLabel: { fontSize: 12, color: T.textMuted, marginBottom: 4 },
  walletAmount: { fontSize: 24, fontWeight: '800' as const, color: T.text },
  withdrawBtn: { backgroundColor: T.amber, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  withdrawText: { fontSize: 13, fontWeight: '700' as const, color: T.white },
  walletDivider: { height: 1, backgroundColor: T.border, marginVertical: 12 },
  totalEarnedText: { fontSize: 13, fontWeight: '600' as const, color: T.success },
  sectionTitle: { fontSize: 18, fontWeight: '800' as const, color: T.text, marginBottom: 14 },
  sectionHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 14 },
  activeBadge: { backgroundColor: T.amberBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  activeBadgeText: { fontSize: 12, fontWeight: '700' as const, color: T.amber },
  deliveryCard: { backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, borderLeftWidth: 4, borderLeftColor: T.amber, marginBottom: 12 },
  deliveryId: { fontSize: 14, fontWeight: '700' as const, color: T.text },
  deliveryCustomer: { fontSize: 13, color: T.textSecondary, marginTop: 2 },
  deliveryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  deliveryBadgeText: { fontSize: 12, fontWeight: '700' as const },
  deliveryInfoRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, marginBottom: 6 },
  deliveryInfo: { flex: 1, fontSize: 13, color: T.textSecondary },
  deliveryFooter: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, paddingTop: 12, marginTop: 6, marginBottom: 12, borderTopWidth: 1, borderTopColor: T.border },
  deliveryDistance: { fontSize: 13, fontWeight: '600' as const, color: T.textSecondary },
  deliveryEarnings: { fontSize: 17, fontWeight: '800' as const, color: T.success },
  navBtn: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.info, borderRadius: 10, paddingVertical: 12, gap: 6 },
  navBtnText: { fontSize: 13, fontWeight: '700' as const, color: T.white },
  completeBtn: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.success, borderRadius: 10, paddingVertical: 12, gap: 6 },
  completeBtnText: { fontSize: 13, fontWeight: '700' as const, color: T.white },
  scanBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.navy, borderRadius: 14, paddingVertical: 16, gap: 10, shadowColor: T.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },
  scanText: { fontSize: 16, fontWeight: '700' as const, color: T.white },
  perfCard: { flexDirection: 'row' as const, backgroundColor: T.surface, borderRadius: 14, padding: 20, borderWidth: 1, borderColor: T.border },
  perfItem: { flex: 1, alignItems: 'center' as const },
  perfValue: { fontSize: 24, fontWeight: '800' as const, color: T.text, marginBottom: 4 },
  perfLabel: { fontSize: 12, fontWeight: '600' as const, color: T.textSecondary },
  perfDivider: { width: 1, backgroundColor: T.border },
};
