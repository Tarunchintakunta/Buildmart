import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { walletApi } from '../../api/wallet.api';
import { workersApi } from '../../api/workers.api';
import { LightTheme as T } from '../../theme/colors';

export default function ContractorDashboard() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [workerCount, setWorkerCount] = useState(0);

  useEffect(() => {
    walletApi.getMyWallet().then((w) => setBalance(w.balance)).catch(() => {});
    workersApi.getWorkers({ limit: 1 }).then((r) => setWorkerCount(r.total)).catch(() => {});
  }, []);

  return (
    <View style={{ padding: 16, gap: 16 }}>
      {/* Wallet Card */}
      <View style={s.navyCard}>
        <Text style={s.navyLabel}>Project Budget (Wallet)</Text>
        <Text style={s.navyAmount}>Rs.{balance.toLocaleString('en-IN')}</Text>
        <TouchableOpacity style={s.navyBtn} onPress={() => router.push('/(app)/(tabs)/wallet')}>
          <Ionicons name="wallet" size={16} color={T.white} />
          <Text style={s.navyBtnText}>Manage Funds</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity style={[s.statCard, { flex: 1 }]} onPress={() => router.push('/(app)/(tabs)/workers')}>
          <Ionicons name="people" size={24} color="#8B5CF6" />
          <Text style={s.statValue}>{workerCount}</Text>
          <Text style={s.statLabel}>Available Workers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.statCard, { flex: 1 }]} onPress={() => router.push('/(app)/(tabs)/agreements')}>
          <Ionicons name="document-text" size={24} color="#10B981" />
          <Text style={s.statValue}>-</Text>
          <Text style={s.statLabel}>Active Contracts</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View>
        <Text style={s.sectionTitle}>Quick Actions</Text>
        {[
          { label: 'Find Workers', icon: 'people' as const, route: '/(app)/(tabs)/workers' },
          { label: 'Order Materials', icon: 'cube' as const, route: '/(app)/(tabs)/shop' },
          { label: 'My Agreements', icon: 'document-text' as const, route: '/(app)/(tabs)/agreements' },
          { label: 'Create Agreement', icon: 'add-circle' as const, route: '/(app)/agreement/create' },
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
  statCard: { backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, alignItems: 'center' as const, gap: 6 },
  statValue: { fontSize: 22, fontWeight: '800' as const, color: T.text },
  statLabel: { fontSize: 12, color: T.textSecondary, textAlign: 'center' as const },
  sectionTitle: { fontSize: 18, fontWeight: '800' as const, color: T.text, marginBottom: 14 },
  actionRow: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, marginBottom: 10, gap: 14 },
  actionIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#FEF3C7', alignItems: 'center' as const, justifyContent: 'center' as const },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '600' as const, color: T.text },
};
