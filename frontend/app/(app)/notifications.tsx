import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

const C = {
  navy: '#1A1D2E',
  amber: '#F2960D',
  amberBg: '#FEF3C7',
  bg: '#F5F6FA',
  surface: '#FFFFFF',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  purple: '#8B5CF6',
  border: '#E5E7EB',
  text: '#1A1D2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  white: '#FFFFFF',
};

type NotifType = 'order' | 'payment' | 'agreement' | 'worker' | 'system';
type NotifGroup = 'Today' | 'Yesterday' | 'Earlier';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  group: NotifGroup;
  read: boolean;
  route?: string;
}

const TYPE_CONFIG: Record<NotifType, { icon: keyof typeof Ionicons.glyphMap; color: string; bgColor: string }> = {
  order: { icon: 'receipt-outline', color: C.info, bgColor: '#EFF6FF' },
  payment: { icon: 'wallet-outline', color: C.success, bgColor: '#ECFDF5' },
  agreement: { icon: 'document-text-outline', color: C.purple, bgColor: '#F5F3FF' },
  worker: { icon: 'person-circle-outline', color: C.amber, bgColor: '#FFFBEB' },
  system: { icon: 'settings-outline', color: C.textSecondary, bgColor: C.bg },
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'order',
    title: 'Order Out for Delivery',
    message: 'Your order ORD-2024-0041 is on the way. Driver Ramesh Yadav is 22 min away.',
    time: '10 min ago',
    group: 'Today',
    read: false,
    route: '/order-tracking',
  },
  {
    id: 'n2',
    type: 'payment',
    title: 'Payment Received',
    message: '₹3,200 credited to your wallet for order ORD-2024-0039. Escrow released.',
    time: '1 hr ago',
    group: 'Today',
    read: false,
    route: '/wallet',
  },
  {
    id: 'n3',
    type: 'worker',
    title: 'Worker Hired',
    message: 'Suresh Kumar (Mason) has accepted your hire request for Site 3, Kondapur.',
    time: '3 hr ago',
    group: 'Today',
    read: false,
    route: '/hire',
  },
  {
    id: 'n4',
    type: 'agreement',
    title: 'Agreement Signed',
    message: 'Rajesh Constructions has signed the labour agreement AGR-2024-012. ₹15,000 escrowed.',
    time: '5 hr ago',
    group: 'Today',
    read: true,
    route: '/agreement',
  },
  {
    id: 'n5',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Sri Lakshmi Traders confirmed your order ORD-2024-0040. Preparing for dispatch.',
    time: 'Yesterday, 4:30 PM',
    group: 'Yesterday',
    read: true,
    route: '/order-tracking',
  },
  {
    id: 'n6',
    type: 'payment',
    title: 'Wallet Top-Up',
    message: '₹20,000 successfully added to your BuildMart wallet via UPI.',
    time: 'Yesterday, 2:00 PM',
    group: 'Yesterday',
    read: true,
    route: '/wallet',
  },
  {
    id: 'n7',
    type: 'system',
    title: 'Profile Verified',
    message: 'Your contractor profile has been verified by the BuildMart team. You can now post tenders.',
    time: 'Yesterday, 10:00 AM',
    group: 'Yesterday',
    read: true,
  },
  {
    id: 'n8',
    type: 'worker',
    title: 'New Job Request',
    message: 'Priya Sharma needs an electrician for 3 days at Banjara Hills. Payout: ₹3,600.',
    time: '21 Apr, 6:00 PM',
    group: 'Earlier',
    read: true,
    route: '/jobs',
  },
  {
    id: 'n9',
    type: 'agreement',
    title: 'Milestone Released',
    message: 'Milestone 2 payment of ₹12,000 released for AGR-2024-009. Rajesh approved delivery.',
    time: '20 Apr, 3:30 PM',
    group: 'Earlier',
    read: true,
    route: '/earnings-history',
  },
  {
    id: 'n10',
    type: 'order',
    title: 'Order Delivered',
    message: 'Order ORD-2024-0035 was delivered to Deepa Menon. Rate your experience!',
    time: '19 Apr, 9:00 AM',
    group: 'Earlier',
    read: true,
  },
];

const GROUPS: NotifGroup[] = ['Today', 'Yesterday', 'Earlier'];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function handleTap(notif: Notification) {
    markRead(notif.id);
    if (notif.route) {
      router.push(notif.route as any);
    }
  }

  const groupedNotifs = GROUPS.reduce<Record<NotifGroup, Notification[]>>(
    (acc, g) => ({ ...acc, [g]: notifications.filter((n) => n.group === g) }),
    { Today: [], Yesterday: [], Earlier: [] }
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(350)} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <Pressable onPress={markAllRead} style={styles.markAllBtn}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </Pressable>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {GROUPS.map((group) => {
          const items = groupedNotifs[group];
          if (items.length === 0) return null;

          return (
            <Animated.View key={group} entering={FadeInDown.delay(80).duration(350)}>
              <Text style={styles.groupLabel}>{group}</Text>
              {items.map((notif, i) => {
                const cfg = TYPE_CONFIG[notif.type];
                return (
                  <Animated.View
                    key={notif.id}
                    entering={FadeInDown.delay(100 + i * 50).duration(350)}
                  >
                    <Pressable
                      style={({ pressed }) => [
                        styles.notifCard,
                        !notif.read && styles.notifCardUnread,
                        pressed && styles.notifCardPressed,
                      ]}
                      onPress={() => handleTap(notif)}
                    >
                      {!notif.read && <View style={styles.unreadBar} />}

                      <View style={[styles.notifIconBox, { backgroundColor: cfg.bgColor }]}>
                        <Ionicons name={cfg.icon} size={22} color={cfg.color} />
                      </View>

                      <View style={styles.notifContent}>
                        <View style={styles.notifTopRow}>
                          <Text style={[styles.notifTitle, !notif.read && styles.notifTitleUnread]} numberOfLines={1}>
                            {notif.title}
                          </Text>
                          <Text style={styles.notifTime}>{notif.time}</Text>
                        </View>
                        <Text style={styles.notifMessage} numberOfLines={2}>
                          {notif.message}
                        </Text>
                        {notif.route && (
                          <View style={styles.tapHint}>
                            <Text style={styles.tapHintText}>Tap to view</Text>
                            <Ionicons name="chevron-forward" size={12} color={cfg.color} />
                          </View>
                        )}
                      </View>

                      {!notif.read && <View style={styles.unreadDot} />}
                    </Pressable>
                  </Animated.View>
                );
              })}
            </Animated.View>
          );
        })}

        {notifications.length === 0 && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={56} color={C.textMuted} />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>No new notifications right now.</Text>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: C.text },
  unreadBadge: {
    backgroundColor: C.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadBadgeText: { fontSize: 11, fontWeight: '800', color: C.white },
  markAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  markAllText: { fontSize: 13, fontWeight: '600', color: C.navy },
  groupLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: C.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    paddingLeft: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  notifCardUnread: {
    backgroundColor: C.surface,
    shadowOpacity: 0.06,
  },
  notifCardPressed: { opacity: 0.85 },
  unreadBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: C.amber,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  notifIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  notifContent: { flex: 1 },
  notifTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  notifTitle: { fontSize: 14, fontWeight: '600', color: C.text, flex: 1 },
  notifTitleUnread: { fontWeight: '700' },
  notifTime: { fontSize: 11, color: C.textMuted, fontWeight: '400', flexShrink: 0 },
  notifMessage: { fontSize: 13, color: C.textSecondary, lineHeight: 18, marginBottom: 4 },
  tapHint: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  tapHintText: { fontSize: 11, color: C.info, fontWeight: '600' },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.amber,
    marginTop: 4,
    marginLeft: 8,
    flexShrink: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    gap: 10,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: C.textSecondary },
  emptySubtitle: { fontSize: 14, color: C.textMuted },
});
