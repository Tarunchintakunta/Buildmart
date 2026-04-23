import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { LightTheme as T } from '../../theme/colors';

const KPI_CARDS = [
  {
    id: 'users',
    label: 'Total Users',
    value: '1,247',
    sub: '+12 today',
    icon: 'people' as const,
    color: '#3B82F6',
    trend: 'up',
  },
  {
    id: 'orders',
    label: 'Active Orders',
    value: '89',
    sub: '₹4.2L GMV',
    icon: 'cube' as const,
    color: '#10B981',
    trend: 'up',
  },
  {
    id: 'kyc',
    label: 'Pending KYC',
    value: '23',
    sub: 'Action needed',
    icon: 'shield-checkmark' as const,
    color: '#F59E0B',
    trend: 'warn',
  },
  {
    id: 'revenue',
    label: 'Platform Revenue',
    value: '₹1,24,500',
    sub: 'This month',
    icon: 'wallet' as const,
    color: '#8B5CF6',
    trend: 'up',
  },
];

const RECENT_ACTIVITY = [
  { id: 'a1', icon: 'person-add' as const, color: '#3B82F6', text: 'Suresh Kumar registered as Worker', time: '2m ago' },
  { id: 'a2', icon: 'shield-checkmark' as const, color: '#10B981', text: 'KYC approved for Raju Yadav', time: '15m ago' },
  { id: 'a3', icon: 'cube' as const, color: T.amber, text: 'Order #BM-5821 placed — ₹18,400', time: '32m ago' },
  { id: 'a4', icon: 'alert-circle' as const, color: '#EF4444', text: 'Dispute raised on Order #BM-5810', time: '1h ago' },
  { id: 'a5', icon: 'storefront' as const, color: '#8B5CF6', text: 'New shop: Krishna Steel Mart', time: '2h ago' },
];

const QUICK_ACTIONS = [
  { label: 'Verify Users', icon: 'shield-checkmark' as const, route: '/(app)/(tabs)/verifications', color: '#10B981' },
  { label: 'Disputes', icon: 'alert-circle' as const, route: '/(app)/disputes', color: '#EF4444' },
  { label: 'Analytics', icon: 'bar-chart' as const, route: '/(app)/admin-analytics', color: '#3B82F6' },
  { label: 'Users', icon: 'people' as const, route: '/(app)/(tabs)/users', color: '#8B5CF6' },
];

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <View style={s.container}>
      {/* GMV Counter Banner */}
      <Animated.View entering={FadeInDown.delay(0).duration(500)} style={s.gmvBanner}>
        <View style={s.gmvLeft}>
          <Text style={s.gmvLabel}>Platform GMV</Text>
          <Text style={s.gmvValue}>₹42,18,300</Text>
          <Text style={s.gmvSub}>All time • 1,892 orders</Text>
        </View>
        <View style={s.gmvIconWrap}>
          <Ionicons name="trending-up" size={32} color={T.amber} />
        </View>
      </Animated.View>

      {/* KPI 2×2 Grid */}
      <View style={s.kpiGrid}>
        {KPI_CARDS.map((card, i) => (
          <Animated.View
            key={card.id}
            entering={FadeInDown.delay(100 + i * 80).duration(500)}
            style={s.kpiCard}
          >
            <View style={s.kpiTop}>
              <View style={[s.kpiIconWrap, { backgroundColor: card.color + '18' }]}>
                <Ionicons name={card.icon} size={20} color={card.color} />
              </View>
              <View style={[s.trendBadge, {
                backgroundColor: card.trend === 'up' ? '#10B98118' : card.trend === 'warn' ? '#F59E0B18' : '#EF444418',
              }]}>
                <Ionicons
                  name={card.trend === 'up' ? 'arrow-up' : card.trend === 'warn' ? 'time' : 'arrow-down'}
                  size={11}
                  color={card.trend === 'up' ? '#10B981' : card.trend === 'warn' ? '#F59E0B' : '#EF4444'}
                />
              </View>
            </View>
            <Text style={s.kpiValue}>{card.value}</Text>
            <Text style={s.kpiLabel}>{card.label}</Text>
            <Text style={s.kpiSub}>{card.sub}</Text>
          </Animated.View>
        ))}
      </View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(450).duration(500)}>
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <View style={s.quickRow}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.label}
              style={s.quickBtn}
              onPress={() => router.push(action.route as any)}
            >
              <View style={[s.quickIcon, { backgroundColor: action.color + '18' }]}>
                <Ionicons name={action.icon} size={22} color={action.color} />
              </View>
              <Text style={s.quickLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {/* Recent Activity */}
      <Animated.View entering={FadeInDown.delay(550).duration(500)} style={s.activityCard}>
        <Text style={s.sectionTitle}>Recent Activity</Text>
        {RECENT_ACTIVITY.map((item, i) => (
          <View key={item.id} style={[s.activityRow, i < RECENT_ACTIVITY.length - 1 && s.activityBorder]}>
            <View style={[s.activityIcon, { backgroundColor: item.color + '18' }]}>
              <Ionicons name={item.icon} size={16} color={item.color} />
            </View>
            <Text style={s.activityText} numberOfLines={2}>{item.text}</Text>
            <Text style={s.activityTime}>{item.time}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16,
  },
  gmvBanner: {
    backgroundColor: T.navy,
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gmvLeft: {
    gap: 4,
  },
  gmvLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  gmvValue: {
    fontSize: 28,
    fontWeight: '800',
    color: T.white,
  },
  gmvSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  gmvIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    width: '47%',
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  kpiTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    color: T.text,
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: T.textSecondary,
    marginBottom: 2,
  },
  kpiSub: {
    fontSize: 11,
    color: T.textMuted,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
    marginBottom: 12,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.border,
    gap: 8,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: T.text,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityText: {
    flex: 1,
    fontSize: 13,
    color: T.text,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 11,
    color: T.textMuted,
  },
});
