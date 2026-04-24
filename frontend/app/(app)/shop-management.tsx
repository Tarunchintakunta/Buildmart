import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { LightTheme as T } from '../../src/theme/colors';

const SPRING_SNAPPY = { damping: 18, stiffness: 280, mass: 0.8 };
const SPRING_BOUNCY = { damping: 12, stiffness: 200, mass: 0.9 };

const QUICK_ACTIONS = [
  { label: 'Add Product', icon: 'add-circle-outline' as const, color: '#3B82F6', bg: '#DBEAFE', route: '/(app)/add-product' },
  { label: 'Manage Inventory', icon: 'list-outline' as const, color: '#8B5CF6', bg: '#EDE9FE', route: '/(app)/inventory' },
  { label: 'View Orders', icon: 'bag-outline' as const, color: T.success, bg: '#D1FAE5', route: '/(app)/orders' },
  { label: 'Promotions', icon: 'pricetag-outline' as const, color: T.amber, bg: T.amberBg, route: '/(app)/promotions' },
];

const PENDING_ACTIONS = [
  { id: 'p1', message: '3 orders need approval', icon: 'time-outline' as const, color: '#F97316', count: 3 },
  { id: 'p2', message: '5 products low on stock', icon: 'warning-outline' as const, color: T.error, count: 5 },
  { id: 'p3', message: '2 customer queries pending', icon: 'chatbubble-outline' as const, color: '#3B82F6', count: 2 },
];

const RECENT_ACTIVITY = [
  {
    id: 'a1',
    icon: 'bag-check-outline' as const,
    iconColor: T.success,
    iconBg: '#D1FAE5',
    title: 'New order placed',
    sub: 'Order #ORD-8821 — ₹2,310',
    time: '12 min ago',
  },
  {
    id: 'a2',
    icon: 'star-outline' as const,
    iconColor: '#F59E0B',
    iconBg: T.amberBg,
    title: 'Product reviewed',
    sub: 'UltraTech Cement got ★4.8',
    time: '1h ago',
  },
  {
    id: 'a3',
    icon: 'alert-circle-outline' as const,
    iconColor: T.error,
    iconBg: '#FEE2E2',
    title: 'Stock alert',
    sub: 'Birla White Cement — 3 bags left',
    time: '2h ago',
  },
  {
    id: 'a4',
    icon: 'person-outline' as const,
    iconColor: '#3B82F6',
    iconBg: '#DBEAFE',
    title: 'New customer query',
    sub: 'Ravi Kumar asked about TMT prices',
    time: '4h ago',
  },
  {
    id: 'a5',
    icon: 'checkmark-circle-outline' as const,
    iconColor: T.success,
    iconBg: '#D1FAE5',
    title: 'Order delivered',
    sub: 'Order #ORD-8819 marked complete',
    time: '6h ago',
  },
];

export default function ShopManagementScreen() {
  const router = useRouter();
  const [shopOnline, setShopOnline] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={s.headerTitle}>Shop Management</Text>
        <Pressable style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}>
          <Ionicons name="notifications-outline" size={22} color={T.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

        {/* Shop Status Card */}
        <Animated.View entering={FadeInDown.delay(60).springify()} style={s.statusCard}>
          <View style={s.statusCardLeft}>
            <View style={s.shopAvatarCircle}>
              <Text style={s.shopAvatarLetter}>H</Text>
            </View>
            <View style={s.shopInfoBlock}>
              <Text style={s.shopNameText}>Hyderabad Building Supplies</Text>
              <View style={s.ratingRow}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={s.ratingText}>4.6</Text>
                <Text style={s.ratingOrders}>· 1,200+ orders</Text>
              </View>
            </View>
          </View>
          <View style={s.statusToggleBlock}>
            <Text style={[s.statusToggleLabel, { color: shopOnline ? T.success : T.error }]}>
              {shopOnline ? 'Online' : 'Offline'}
            </Text>
            <Switch
              value={shopOnline}
              onValueChange={setShopOnline}
              trackColor={{ false: T.error, true: T.success }}
              thumbColor={T.white}
            />
          </View>
        </Animated.View>

        {/* Today's Performance */}
        <Animated.View entering={FadeInDown.delay(130).springify()} style={s.section}>
          <Text style={s.sectionTitle}>TODAY'S PERFORMANCE</Text>
          <View style={s.perfCard}>
            {[
              { label: "Today's Revenue", value: '₹8,450', icon: 'cash-outline' as const, color: T.amber },
              { label: 'Orders Today', value: '6', icon: 'bag-outline' as const, color: '#3B82F6' },
              { label: 'Avg Rating', value: '4.6', icon: 'star' as const, color: '#F59E0B' },
            ].map((item, i) => (
              <View key={item.label} style={[s.perfItem, i < 2 && s.perfItemBorder]}>
                <Ionicons name={item.icon} size={18} color={item.color} style={{ marginBottom: 6 }} />
                <Text style={s.perfValue}>{item.value}</Text>
                <Text style={s.perfLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Quick Actions 2×2 */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={s.section}>
          <Text style={s.sectionTitle}>QUICK ACTIONS</Text>
          <View style={s.quickActionsGrid}>
            {QUICK_ACTIONS.map((action, i) => (
              <Animated.View
                key={action.label}
                entering={ZoomIn.delay(220 + i * 60).springify().damping(SPRING_BOUNCY.damping).stiffness(SPRING_BOUNCY.stiffness)}
                style={s.quickActionCell}
              >
                <Pressable
                  style={({ pressed }) => [s.quickActionCard, pressed && { opacity: 0.82 }]}
                  onPress={() => router.push(action.route as any)}
                >
                  <View style={[s.quickActionIconCircle, { backgroundColor: action.bg }]}>
                    <Ionicons name={action.icon} size={24} color={action.color} />
                  </View>
                  <Text style={s.quickActionLabel}>{action.label}</Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Pending Actions */}
        <Animated.View entering={FadeInDown.delay(380).springify()} style={s.section}>
          <Text style={s.sectionTitle}>PENDING ACTIONS</Text>
          <View style={s.listCard}>
            {PENDING_ACTIONS.map((item, index) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  s.pendingRow,
                  index < PENDING_ACTIONS.length - 1 && s.rowBorder,
                  pressed && { backgroundColor: T.bg },
                ]}
              >
                <View style={[s.pendingIconCircle, { backgroundColor: item.color + '1A' }]}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={s.pendingMessage}>{item.message}</Text>
                <View style={[s.pendingCountBadge, { backgroundColor: item.color }]}>
                  <Text style={s.pendingCount}>{item.count}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={T.textMuted} style={{ marginLeft: 6 }} />
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.delay(460).springify()} style={s.section}>
          <Text style={s.sectionTitle}>RECENT ACTIVITY</Text>
          <View style={s.listCard}>
            {RECENT_ACTIVITY.map((item, index) => (
              <View
                key={item.id}
                style={[s.activityRow, index < RECENT_ACTIVITY.length - 1 && s.rowBorder]}
              >
                <View style={[s.activityIconCircle, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={18} color={item.iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.activityTitle}>{item.title}</Text>
                  <Text style={s.activitySub}>{item.sub}</Text>
                </View>
                <Text style={s.activityTime}>{item.time}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: T.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: T.text,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: T.surface,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    gap: 12,
  },
  statusCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shopAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: T.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopAvatarLetter: {
    fontSize: 20,
    fontWeight: '800',
    color: T.white,
  },
  shopInfoBlock: {
    flex: 1,
    gap: 4,
  },
  shopNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: T.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: T.text,
  },
  ratingOrders: {
    fontSize: 12,
    color: T.textMuted,
  },
  statusToggleBlock: {
    alignItems: 'center',
    gap: 4,
  },
  statusToggleLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: T.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
    marginLeft: 2,
  },
  perfCard: {
    flexDirection: 'row',
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
  },
  perfItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 8,
  },
  perfItemBorder: {
    borderRightWidth: 1,
    borderRightColor: T.border,
  },
  perfValue: {
    fontSize: 18,
    fontWeight: '800',
    color: T.text,
    marginBottom: 3,
  },
  perfLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: T.textSecondary,
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCell: {
    width: '47%',
  },
  quickActionCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 18,
    alignItems: 'center',
    gap: 10,
  },
  quickActionIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: T.text,
    textAlign: 'center',
  },
  listCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  pendingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingMessage: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: T.text,
  },
  pendingCountBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  pendingCount: {
    fontSize: 11,
    fontWeight: '800',
    color: T.white,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  activityIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: T.text,
    marginBottom: 2,
  },
  activitySub: {
    fontSize: 12,
    color: T.textSecondary,
  },
  activityTime: {
    fontSize: 11,
    color: T.textMuted,
    minWidth: 52,
    textAlign: 'right',
  },
});
