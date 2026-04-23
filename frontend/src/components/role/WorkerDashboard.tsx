import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { walletApi } from '../../api/wallet.api';
import { laborApi } from '../../api/labor.api';
import { LightTheme as T } from '../../theme/colors';

export default function WorkerDashboard() {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(true);
  const [balance, setBalance] = useState(0);
  const [pendingJobs, setPendingJobs] = useState(0);

  useEffect(() => {
    walletApi.getMyWallet().then((w) => setBalance(w.balance)).catch(() => {});
    laborApi.getAvailableJobs({ limit: 1 }).then((r) => setPendingJobs(r.total)).catch(() => {});
  }, []);

  return (
    <View style={{ padding: 16, gap: 16 }}>
      {/* Status Toggle */}
      <View style={s.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={s.label}>Your Status</Text>
            <Text style={[s.statusTitle, { color: isAvailable ? T.success : T.amber }]}>
              {isAvailable ? 'Available for Work' : 'Currently Working'}
            </Text>
          </View>
          <Switch value={isAvailable} onValueChange={setIsAvailable} trackColor={{ false: T.amber, true: T.success }} thumbColor={T.white} />
        </View>
      </View>

      {/* Earnings Card */}
      <View style={s.navyCard}>
        <Text style={s.navyLabel}>Wallet Balance</Text>
        <Text style={s.navyAmount}>Rs.{balance.toLocaleString('en-IN')}</Text>
        <TouchableOpacity style={s.navyBtn} onPress={() => router.push('/(app)/(tabs)/wallet')}>
          <Ionicons name="arrow-down" size={18} color={T.white} />
          <Text style={s.navyBtnText}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity style={[s.statCard, { flex: 1 }]} onPress={() => router.push('/(app)/(tabs)/jobs')}>
          <Ionicons name="briefcase" size={24} color="#3B82F6" />
          <Text style={s.statValue}>{pendingJobs}</Text>
          <Text style={s.statLabel}>Available Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.statCard, { flex: 1 }]} onPress={() => router.push('/(app)/(tabs)/agreements')}>
          <Ionicons name="document-text" size={24} color="#8B5CF6" />
          <Text style={s.statValue}>-</Text>
          <Text style={s.statLabel}>Active Contracts</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View>
        <Text style={s.sectionTitle}>Quick Actions</Text>
        {[
          { label: 'Browse Job Requests', icon: 'search' as const, route: '/(app)/(tabs)/jobs' },
          { label: 'My Agreements', icon: 'document-text' as const, route: '/(app)/(tabs)/agreements' },
          { label: 'View Wallet', icon: 'wallet' as const, route: '/(app)/(tabs)/wallet' },
          { label: 'Job History', icon: 'time' as const, route: '/(app)/job-history' },
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
