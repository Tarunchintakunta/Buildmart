import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWalletStore } from '../../store/useStore';
import { LightTheme } from '../../theme/designSystem';

const T = LightTheme;

const STATS = [
  { label: 'Active Contracts', value: '4', icon: 'document-text' as const, color: '#3B82F6' },
  { label: 'Workers Hired', value: '12', icon: 'people' as const, color: '#10B981' },
  { label: 'Pending Orders', value: '3', icon: 'cube' as const, color: '#F59E0B' },
  { label: 'This Month', value: 'Rs.2.5L', icon: 'trending-up' as const, color: '#8B5CF6' },
];

const AGREEMENTS = [
  { id: 'AGR-2024-001', worker: 'Ramu Yadav', title: 'Site Labor', rate: 'Rs.600/day', endDate: 'Mar 15' },
  { id: 'AGR-2024-002', worker: 'Suresh Kumar', title: 'Mason Work', rate: 'Rs.5,600/week', endDate: 'Apr 30' },
];

const WORKERS = [
  { name: 'Ramu Y.', skill: 'Coolie', rate: 'Rs.600/day', rating: 4.5 },
  { name: 'Mohammed A.', skill: 'Electrician', rate: 'Rs.900/day', rating: 4.6 },
  { name: 'Venkat R.', skill: 'Carpenter', rate: 'Rs.1000/day', rating: 4.9 },
];

export default function ContractorDashboard() {
  const router = useRouter();
  const wallet = useWalletStore((state) => state.wallet);
  const walletBalance = wallet?.balance ?? 500000;
  const heldBalance = wallet?.held_balance ?? 50000;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 20 }}>
        {/* Wallet Card */}
        <View style={s.walletCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <View>
              <Text style={s.walletLabel}>Available Balance</Text>
              <Text style={s.walletAmount}>Rs.{walletBalance.toLocaleString()}</Text>
            </View>
            <TouchableOpacity style={s.addFundsBtn}>
              <Ionicons name="add" size={16} color={T.white} />
              <Text style={s.addFundsText}>Add Funds</Text>
            </TouchableOpacity>
          </View>
          <View style={s.escrowBadge}>
            <Ionicons name="lock-closed" size={16} color={T.amber} />
            <Text style={s.escrowText}>Rs.{heldBalance.toLocaleString()} held in escrow</Text>
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
                <Text style={s.statValue}>{stat.value}</Text>
              </View>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View>
          <Text style={s.sectionTitle}>Quick Actions</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={s.primaryAction} onPress={() => router.push('/(app)/agreement/create')}>
              <Ionicons name="add-circle" size={20} color={T.white} />
              <Text style={s.primaryActionText}>New Agreement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondaryAction} onPress={() => router.push('/(app)/(tabs)/shop')}>
              <Ionicons name="cart" size={20} color={T.navy} />
              <Text style={s.secondaryActionText}>Bulk Order</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Agreements */}
        <View>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Active Agreements</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/agreements')}>
              <Text style={s.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {AGREEMENTS.map((agr) => (
            <TouchableOpacity key={agr.id} style={s.agreementCard} onPress={() => router.push(`/(app)/agreement/${agr.id}`)}>
              <View style={{ flex: 1 }}>
                <Text style={s.agreementTitle}>{agr.title}</Text>
                <Text style={s.agreementWorker}>{agr.worker}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Text style={s.agreementRate}>{agr.rate}</Text>
                  <Text style={s.dot}> · </Text>
                  <Text style={s.agreementEnd}>Ends {agr.endDate}</Text>
                </View>
              </View>
              <View style={s.activeBadge}>
                <Text style={s.activeBadgeText}>Active</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Available Workers */}
        <View style={{ marginBottom: 16 }}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Available Workers</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/workers')}>
              <Text style={s.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12, paddingRight: 16 }}>
              {WORKERS.map((w, i) => (
                <TouchableOpacity key={i} style={s.workerCard} onPress={() => router.push('/(app)/(tabs)/workers')}>
                  <View style={s.workerAvatar}>
                    <Ionicons name="person" size={26} color={T.textMuted} />
                  </View>
                  <Text style={s.workerName}>{w.name}</Text>
                  <Text style={s.workerSkill}>{w.skill}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <Text style={s.workerRate}>{w.rate}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Ionicons name="star" size={13} color="#F59E0B" />
                      <Text style={s.workerRating}>{w.rating}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const s = {
  walletCard: { backgroundColor: T.navy, borderRadius: 16, padding: 20, shadowColor: T.navy, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },
  walletLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '500' as const, marginBottom: 4 },
  walletAmount: { fontSize: 32, fontWeight: '800' as const, color: T.white },
  addFundsBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.amber, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, gap: 4 },
  addFundsText: { fontSize: 13, fontWeight: '700' as const, color: T.white },
  escrowBadge: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: 'rgba(242,150,13,0.15)', borderRadius: 10, padding: 12, gap: 8 },
  escrowText: { fontSize: 13, fontWeight: '600' as const, color: T.amber },
  statsGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 12 },
  statCard: { width: '47%' as any, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  statIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center' as const, alignItems: 'center' as const },
  statValue: { fontSize: 22, fontWeight: '800' as const, color: T.text },
  statLabel: { fontSize: 13, fontWeight: '600' as const, color: T.textSecondary },
  sectionTitle: { fontSize: 18, fontWeight: '800' as const, color: T.text, marginBottom: 14 },
  sectionHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 14 },
  viewAll: { fontSize: 13, fontWeight: '600' as const, color: T.amber },
  primaryAction: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.navy, borderRadius: 14, paddingVertical: 14, gap: 8 },
  primaryActionText: { fontSize: 14, fontWeight: '700' as const, color: T.white },
  secondaryAction: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.surface, borderRadius: 14, paddingVertical: 14, gap: 8, borderWidth: 1, borderColor: T.border },
  secondaryActionText: { fontSize: 14, fontWeight: '700' as const, color: T.navy },
  agreementCard: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, marginBottom: 10 },
  agreementTitle: { fontSize: 15, fontWeight: '700' as const, color: T.text },
  agreementWorker: { fontSize: 13, color: T.textSecondary, marginTop: 2 },
  agreementRate: { fontSize: 14, fontWeight: '700' as const, color: T.amber },
  dot: { fontSize: 12, color: T.textMuted },
  agreementEnd: { fontSize: 12, color: T.textMuted },
  activeBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  activeBadgeText: { fontSize: 11, fontWeight: '700' as const, color: '#10B981' },
  workerCard: { backgroundColor: T.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: T.border, width: 160 },
  workerAvatar: { width: 52, height: 52, borderRadius: 14, backgroundColor: T.bg, justifyContent: 'center' as const, alignItems: 'center' as const, marginBottom: 10 },
  workerName: { fontSize: 14, fontWeight: '700' as const, color: T.text },
  workerSkill: { fontSize: 12, color: T.textSecondary, marginTop: 2 },
  workerRate: { fontSize: 13, fontWeight: '700' as const, color: T.amber },
  workerRating: { fontSize: 12, fontWeight: '600' as const, color: T.textSecondary },
};
