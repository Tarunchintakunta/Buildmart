import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAdminStore } from '../../store/useStore';
import { LightTheme } from '../../theme/designSystem';

const T = LightTheme;

const STATS = [
  { label: 'Total Users', value: '1,250', icon: 'people' as const, color: '#3B82F6' },
  { label: 'Active Workers', value: '342', icon: 'hammer' as const, color: '#10B981' },
  { label: 'Pending Verify', value: '12', icon: 'shield' as const, color: '#F59E0B' },
  { label: "Today's Orders", value: '89', icon: 'receipt' as const, color: '#8B5CF6' },
];

const RECENT_ACTIVITIES = [
  { message: 'Ganesh Babu submitted ID for verification', time: '5 min ago', icon: 'shield-checkmark' as const, color: '#F59E0B' },
  { message: 'New bulk order worth Rs.30,000 placed', time: '12 min ago', icon: 'receipt' as const, color: '#3B82F6' },
  { message: 'New agreement signed between Rajesh Const. and Ramu', time: '25 min ago', icon: 'document-text' as const, color: '#10B981' },
  { message: 'New shopkeeper registered: Metro Hardware', time: '1 hour ago', icon: 'person-add' as const, color: '#8B5CF6' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const pendingVerifications = useAdminStore((state) => state.pendingVerifications);

  const mockPendingVerifications = [
    { id: 'v1', workerName: 'Ganesh Babu', phone: '9876543304', idType: 'Aadhar Card', submittedAt: '2 hours ago', skills: ['Plumber', 'Welder'] },
    { id: 'v2', workerName: 'Srinivas K', phone: '9876543306', idType: 'Driving License', submittedAt: '5 hours ago', skills: ['Mason'] },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 20 }}>
        {/* Admin Header */}
        <View style={s.headerCard}>
          <View style={s.headerIcon}>
            <Ionicons name="shield-checkmark" size={28} color={T.white} />
          </View>
          <View style={{ marginLeft: 14 }}>
            <Text style={s.headerTitle}>Admin Console</Text>
            <Text style={s.headerSub}>BuildMart Management</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={s.statsGrid}>
          {STATS.map((stat, i) => (
            <TouchableOpacity
              key={i}
              style={s.statCard}
              onPress={() => {
                if (stat.label === 'Pending Verify') router.push('/(app)/(tabs)/verifications');
                else if (stat.label === 'Total Users') router.push('/(app)/(tabs)/users');
              }}
            >
              <View style={[s.statIcon, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon} size={22} color={stat.color} />
              </View>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={s.primaryAction} onPress={() => router.push('/(app)/(tabs)/verifications')}>
            <Ionicons name="shield-checkmark" size={20} color={T.white} />
            <Text style={s.primaryActionText}>Verify Workers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.secondaryAction} onPress={() => router.push('/(app)/(tabs)/users')}>
            <Ionicons name="people" size={20} color={T.navy} />
            <Text style={s.secondaryActionText}>Manage Users</Text>
          </TouchableOpacity>
        </View>

        {/* Pending Verifications */}
        <View>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Pending Verifications</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/verifications')}>
              <Text style={s.viewAll}>View All ({mockPendingVerifications.length})</Text>
            </TouchableOpacity>
          </View>
          {mockPendingVerifications.map((v) => (
            <View key={v.id} style={s.verifyCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={s.verifyAvatar}>
                  <Ionicons name="person" size={22} color={T.textMuted} />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={s.verifyName}>{v.workerName}</Text>
                  <Text style={s.verifyPhone}>{v.phone}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 }}>
                <Ionicons name="card" size={16} color={T.textMuted} />
                <Text style={s.verifyMeta}>{v.idType}</Text>
                <Text style={s.dot}>·</Text>
                <Text style={s.verifyMeta}>{v.submittedAt}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
                {v.skills.map((skill) => (
                  <View key={skill} style={s.skillBadge}>
                    <Text style={s.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={s.viewIdBtn}>
                  <Ionicons name="eye" size={16} color={T.textSecondary} />
                  <Text style={s.viewIdText}>View ID</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.approveBtn}>
                  <Ionicons name="checkmark" size={16} color={T.white} />
                  <Text style={s.approveBtnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.rejectBtn}>
                  <Ionicons name="close" size={16} color={T.white} />
                  <Text style={s.rejectBtnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View>
          <Text style={s.sectionTitle}>Recent Activity</Text>
          <View style={s.activityCard}>
            {RECENT_ACTIVITIES.map((a, i) => (
              <View key={i} style={[s.activityItem, i < RECENT_ACTIVITIES.length - 1 && s.activityBorder]}>
                <View style={[s.activityIcon, { backgroundColor: `${a.color}15` }]}>
                  <Ionicons name={a.icon} size={18} color={a.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.activityMsg}>{a.message}</Text>
                  <Text style={s.activityTime}>{a.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* System Overview */}
        <View style={{ marginBottom: 16 }}>
          <Text style={s.sectionTitle}>System Overview</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={s.sysCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={s.sysLabel}>Orders Today</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Ionicons name="trending-up" size={14} color={T.success} />
                  <Text style={s.sysTrend}>+15%</Text>
                </View>
              </View>
              <Text style={s.sysValue}>89</Text>
              <View style={s.progressTrack}>
                <View style={[s.progressFill, { width: '75%', backgroundColor: T.success }]} />
              </View>
            </View>
            <View style={s.sysCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={s.sysLabel}>Active Drivers</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: T.success }} />
                  <Text style={s.sysTrend}>Online</Text>
                </View>
              </View>
              <Text style={s.sysValue}>24/30</Text>
              <View style={s.progressTrack}>
                <View style={[s.progressFill, { width: '80%', backgroundColor: T.amber }]} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = {
  headerCard: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border },
  headerIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: T.navy, justifyContent: 'center' as const, alignItems: 'center' as const },
  headerTitle: { fontSize: 20, fontWeight: '800' as const, color: T.text },
  headerSub: { fontSize: 13, color: T.textSecondary, marginTop: 2 },
  statsGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 12 },
  statCard: { width: '47%' as any, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  statIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center' as const, alignItems: 'center' as const, marginBottom: 10 },
  statValue: { fontSize: 24, fontWeight: '800' as const, color: T.text, marginBottom: 2 },
  statLabel: { fontSize: 13, fontWeight: '600' as const, color: T.textSecondary },
  sectionTitle: { fontSize: 18, fontWeight: '800' as const, color: T.text, marginBottom: 14 },
  sectionHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 14 },
  viewAll: { fontSize: 13, fontWeight: '600' as const, color: T.amber },
  primaryAction: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.navy, borderRadius: 14, paddingVertical: 14, gap: 8 },
  primaryActionText: { fontSize: 14, fontWeight: '700' as const, color: T.white },
  secondaryAction: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.surface, borderRadius: 14, paddingVertical: 14, gap: 8, borderWidth: 1, borderColor: T.border },
  secondaryActionText: { fontSize: 14, fontWeight: '700' as const, color: T.navy },
  verifyCard: { backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, borderLeftWidth: 4, borderLeftColor: '#F59E0B', marginBottom: 12 },
  verifyAvatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: T.bg, justifyContent: 'center' as const, alignItems: 'center' as const },
  verifyName: { fontSize: 15, fontWeight: '700' as const, color: T.text },
  verifyPhone: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  verifyMeta: { fontSize: 12, color: T.textMuted },
  dot: { fontSize: 12, color: T.textMuted },
  skillBadge: { backgroundColor: T.bg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  skillText: { fontSize: 11, fontWeight: '600' as const, color: T.textSecondary },
  viewIdBtn: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.bg, borderRadius: 10, paddingVertical: 10, gap: 6 },
  viewIdText: { fontSize: 13, fontWeight: '700' as const, color: T.textSecondary },
  approveBtn: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.success, borderRadius: 10, paddingVertical: 10, gap: 4 },
  approveBtnText: { fontSize: 13, fontWeight: '700' as const, color: T.white },
  rejectBtn: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: '#EF4444', borderRadius: 10, paddingVertical: 10, gap: 4 },
  rejectBtnText: { fontSize: 13, fontWeight: '700' as const, color: T.white },
  activityCard: { backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  activityItem: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, paddingVertical: 12 },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: T.border },
  activityIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center' as const, alignItems: 'center' as const },
  activityMsg: { fontSize: 13, color: T.textSecondary, lineHeight: 18 },
  activityTime: { fontSize: 11, color: T.textMuted, marginTop: 4 },
  sysCard: { flex: 1, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  sysLabel: { fontSize: 13, color: T.textSecondary },
  sysTrend: { fontSize: 11, fontWeight: '700' as const, color: T.success },
  sysValue: { fontSize: 26, fontWeight: '800' as const, color: T.text, marginBottom: 10 },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: T.bg },
  progressFill: { height: 6, borderRadius: 3 },
};
