import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { LightTheme as T } from '../../theme/colors';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ total_users: 0, total_orders: 0, pending_verifications: 0, active_workers: 0 });

  useEffect(() => {
    adminApi.getAnalytics().then((s) => setStats(s as any)).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Total Users', value: String(stats.total_users || '-'), icon: 'people' as const, color: '#3B82F6' },
    { label: 'Total Orders', value: String(stats.total_orders || '-'), icon: 'receipt' as const, color: '#10B981' },
    { label: 'Pending KYC', value: String(stats.pending_verifications || '-'), icon: 'shield-checkmark' as const, color: '#F59E0B' },
    { label: 'Active Workers', value: String(stats.active_workers || '-'), icon: 'hammer' as const, color: '#8B5CF6' },
  ];

  return (
    <View style={{ padding: 16, gap: 16 }}>
      {/* Stats Grid */}
      <Text style={s.sectionTitle}>Platform Overview</Text>
      <View style={s.statsGrid}>
        {statCards.map((stat) => (
          <View key={stat.label} style={s.statCard}>
            <View style={[s.statIcon, { backgroundColor: `${stat.color}15` }]}>
              <Ionicons name={stat.icon} size={22} color={stat.color} />
            </View>
            <Text style={s.statValue}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View>
        <Text style={s.sectionTitle}>Admin Actions</Text>
        {[
          { label: 'KYC Verifications', icon: 'shield-checkmark' as const, route: '/(app)/(tabs)/verifications', badge: stats.pending_verifications },
          { label: 'Manage Users', icon: 'people' as const, route: '/(app)/(tabs)/users' },
          { label: 'Analytics', icon: 'bar-chart' as const, route: '/(app)/admin-analytics' },
          { label: 'All Orders', icon: 'receipt' as const, route: '/(app)/(tabs)/verifications' },
        ].map((a) => (
          <TouchableOpacity key={a.label} style={s.actionRow} onPress={() => router.push(a.route as any)}>
            <View style={s.actionIcon}>
              <Ionicons name={a.icon} size={20} color={T.amber} />
            </View>
            <Text style={s.actionLabel}>{a.label}</Text>
            {a.badge ? (
              <View style={s.badge}>
                <Text style={s.badgeText}>{a.badge}</Text>
              </View>
            ) : (
              <Ionicons name="chevron-forward" size={18} color={T.textMuted} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = {
  statsGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 12 },
  statCard: { width: '47%' as const, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  statIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center' as const, justifyContent: 'center' as const, marginBottom: 12 },
  statValue: { fontSize: 22, fontWeight: '800' as const, color: T.text, marginBottom: 4 },
  statLabel: { fontSize: 12, color: T.textSecondary },
  sectionTitle: { fontSize: 18, fontWeight: '800' as const, color: T.text, marginBottom: 14 },
  actionRow: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, marginBottom: 10, gap: 14 },
  actionIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#FEF3C7', alignItems: 'center' as const, justifyContent: 'center' as const },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '600' as const, color: T.text },
  badge: { backgroundColor: T.amber, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 12, fontWeight: '700' as const, color: T.white },
};
