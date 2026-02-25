import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useWorkerStore, useWalletStore } from '../../store/useStore';
import { LightTheme } from '../../theme/designSystem';

const T = LightTheme;

export default function WorkerDashboard() {
  const router = useRouter();
  const { status, toggleStatus } = useWorkerStore();
  const wallet = useWalletStore((state) => state.wallet);
  const [isAvailable, setIsAvailable] = useState(status === 'waiting');

  const walletBalance = wallet?.balance ?? 12000;
  const totalEarned = wallet?.total_earned ?? 72000;

  const workerProfile = {
    skills: ['Coolie', 'Helper'],
    rating: 4.5,
    totalJobs: 120,
    isVerified: true,
    dailyRate: 600,
  };

  const handleToggle = () => {
    setIsAvailable(!isAvailable);
    toggleStatus();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 20 }}>
        {/* Status Toggle Card */}
        <View style={s.statusCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.statusLabel}>Your Status</Text>
              <Text style={[s.statusTitle, { color: isAvailable ? T.success : T.amber }]}>
                {isAvailable ? 'Available for Work' : 'Currently Working'}
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Switch
                value={isAvailable}
                onValueChange={handleToggle}
                trackColor={{ false: T.amber, true: T.success }}
                thumbColor={T.white}
              />
              <Text style={s.switchLabel}>{isAvailable ? 'Waiting' : 'Working'}</Text>
            </View>
          </View>
          {workerProfile.isVerified && (
            <View style={s.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={16} color={T.success} />
              <Text style={s.verifiedText}>Verified Worker</Text>
            </View>
          )}
        </View>

        {/* Earnings Card */}
        <View style={s.earningsCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
            <View>
              <Text style={s.earningsLabel}>Wallet Balance</Text>
              <Text style={s.earningsAmount}>Rs.{walletBalance.toLocaleString()}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.earningsLabel}>Total Earned</Text>
              <Text style={s.totalEarned}>Rs.{totalEarned.toLocaleString()}</Text>
            </View>
          </View>
          <TouchableOpacity style={s.withdrawBtn} onPress={() => router.push('/(app)/(tabs)/wallet')}>
            <Ionicons name="arrow-down" size={18} color={T.white} />
            <Text style={s.withdrawText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={s.miniStat}>
            <Text style={s.miniStatValue}>{workerProfile.totalJobs}</Text>
            <Text style={s.miniStatLabel}>Jobs Done</Text>
          </View>
          <View style={s.miniStat}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={s.miniStatValue}>{workerProfile.rating}</Text>
              <Ionicons name="star" size={18} color="#F59E0B" />
            </View>
            <Text style={s.miniStatLabel}>Rating</Text>
          </View>
          <View style={s.miniStat}>
            <Text style={s.miniStatValue}>Rs.{workerProfile.dailyRate}</Text>
            <Text style={s.miniStatLabel}>Daily Rate</Text>
          </View>
        </View>

        {/* Skills */}
        <View>
          <Text style={s.sectionTitle}>Your Skills</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {workerProfile.skills.map((skill) => (
              <View key={skill} style={s.skillBadge}>
                <Text style={s.skillText}>{skill}</Text>
              </View>
            ))}
            <TouchableOpacity style={s.addSkillBtn}>
              <Ionicons name="add" size={16} color={T.textMuted} />
              <Text style={s.addSkillText}>Add Skill</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Job Requests */}
        <View>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Job Requests</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/jobs')}>
              <Text style={s.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={s.jobCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <View style={s.newBadge}><Text style={s.newBadgeText}>NEW</Text></View>
                  <Text style={s.jobDuration}>2 hours work</Text>
                </View>
                <Text style={s.jobTitle}>Unload cement bags</Text>
                <Text style={s.jobLocation}>Koramangala, 2.3 km away</Text>
                <Text style={s.jobRate}>Rs.200/hour</Text>
              </View>
              <View style={{ gap: 8, marginLeft: 12 }}>
                <TouchableOpacity style={s.acceptBtn}>
                  <Text style={s.acceptText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.declineBtn}>
                  <Text style={s.declineText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Active Contracts */}
        <View style={{ marginBottom: 16 }}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Active Contracts</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/agreements')}>
              <Text style={s.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={s.contractCard} onPress={() => router.push('/(app)/(tabs)/agreements')}>
            <View style={{ flex: 1 }}>
              <Text style={s.contractTitle}>Site Labor - Brigade Project</Text>
              <Text style={s.contractSub}>Rajesh Constructions</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <Text style={s.contractRate}>Rs.600/day</Text>
                <Text style={s.dot}> · </Text>
                <Text style={s.contractEnd}>Ends Mar 15</Text>
              </View>
            </View>
            <View style={s.activeBadge}>
              <Text style={s.activeBadgeText}>Active</Text>
            </View>
          </TouchableOpacity>
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
  verifiedBadge: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: '#D1FAE5', borderRadius: 10, padding: 10, gap: 8 },
  verifiedText: { fontSize: 13, fontWeight: '700' as const, color: T.success },
  earningsCard: { backgroundColor: T.navy, borderRadius: 16, padding: 20, shadowColor: T.navy, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },
  earningsLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '500' as const, marginBottom: 4 },
  earningsAmount: { fontSize: 28, fontWeight: '800' as const, color: T.white },
  totalEarned: { fontSize: 20, fontWeight: '800' as const, color: T.amber },
  withdrawBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 12, gap: 6 },
  withdrawText: { fontSize: 14, fontWeight: '700' as const, color: T.white },
  miniStat: { flex: 1, backgroundColor: T.surface, borderRadius: 14, padding: 16, alignItems: 'center' as const, borderWidth: 1, borderColor: T.border },
  miniStatValue: { fontSize: 22, fontWeight: '800' as const, color: T.text, marginBottom: 4 },
  miniStatLabel: { fontSize: 12, fontWeight: '600' as const, color: T.textSecondary },
  sectionTitle: { fontSize: 18, fontWeight: '800' as const, color: T.text, marginBottom: 14 },
  sectionHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 14 },
  viewAll: { fontSize: 13, fontWeight: '600' as const, color: T.amber },
  skillBadge: { backgroundColor: T.amberBg, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  skillText: { fontSize: 13, fontWeight: '700' as const, color: T.amber },
  addSkillBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.surface, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: T.border, gap: 4 },
  addSkillText: { fontSize: 13, fontWeight: '600' as const, color: T.textMuted },
  jobCard: { backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, borderLeftWidth: 4, borderLeftColor: T.amber },
  newBadge: { backgroundColor: T.amberBg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  newBadgeText: { fontSize: 10, fontWeight: '700' as const, color: T.amber, letterSpacing: 0.5 },
  jobDuration: { fontSize: 12, color: T.textMuted },
  jobTitle: { fontSize: 15, fontWeight: '700' as const, color: T.text, marginBottom: 4 },
  jobLocation: { fontSize: 13, color: T.textSecondary, marginBottom: 6 },
  jobRate: { fontSize: 17, fontWeight: '800' as const, color: T.amber },
  acceptBtn: { backgroundColor: T.success, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  acceptText: { fontSize: 13, fontWeight: '700' as const, color: T.white },
  declineBtn: { backgroundColor: T.bg, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  declineText: { fontSize: 13, fontWeight: '700' as const, color: T.textSecondary },
  contractCard: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  contractTitle: { fontSize: 15, fontWeight: '700' as const, color: T.text },
  contractSub: { fontSize: 13, color: T.textSecondary, marginTop: 2 },
  contractRate: { fontSize: 14, fontWeight: '700' as const, color: T.amber },
  dot: { fontSize: 12, color: T.textMuted },
  contractEnd: { fontSize: 12, color: T.textMuted },
  activeBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  activeBadgeText: { fontSize: 11, fontWeight: '700' as const, color: '#10B981' },
};
