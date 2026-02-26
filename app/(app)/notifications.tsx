import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type NotificationType = 'order_update' | 'job_request' | 'payment' | 'verification' | 'agreement' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  group: 'Today' | 'Yesterday' | 'Earlier';
  read: boolean;
}

const FILTER_TABS = ['All', 'Orders', 'Jobs', 'Payments', 'System'];

const TYPE_CONFIG: Record<NotificationType, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  order_update: { icon: 'cube-outline', color: '#3B82F6' },
  job_request: { icon: 'hammer-outline', color: '#8B5CF6' },
  payment: { icon: 'wallet-outline', color: '#10B981' },
  verification: { icon: 'shield-checkmark-outline', color: '#F59E0B' },
  agreement: { icon: 'document-text-outline', color: '#EC4899' },
  system: { icon: 'settings-outline', color: '#6B7280' },
};

const TAB_TYPE_MAP: Record<string, NotificationType[]> = {
  All: ['order_update', 'job_request', 'payment', 'verification', 'agreement', 'system'],
  Orders: ['order_update'],
  Jobs: ['job_request'],
  Payments: ['payment'],
  System: ['system', 'verification', 'agreement'],
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'order_update',
    title: 'Order #BM-2847 Shipped',
    message: 'Your UltraTech Cement order has been dispatched and is on its way to the delivery address.',
    time: '12 min ago',
    group: 'Today',
    read: false,
  },
  {
    id: '2',
    type: 'job_request',
    title: 'New Job Request',
    message: 'Rajesh Kumar has requested 3 masons for a residential project in Sector 45, Gurugram.',
    time: '45 min ago',
    group: 'Today',
    read: false,
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Received',
    message: 'Rs.24,500 has been credited to your wallet for Order #BM-2831.',
    time: '2 hrs ago',
    group: 'Today',
    read: false,
  },
  {
    id: '4',
    type: 'verification',
    title: 'KYC Verification Complete',
    message: 'Your Aadhaar and PAN verification has been approved. You can now accept high-value orders.',
    time: '5 hrs ago',
    group: 'Today',
    read: true,
  },
  {
    id: '5',
    type: 'order_update',
    title: 'Order #BM-2839 Delivered',
    message: 'TMT Steel Bars delivery has been confirmed. Please rate your experience.',
    time: 'Yesterday, 4:30 PM',
    group: 'Yesterday',
    read: true,
  },
  {
    id: '6',
    type: 'agreement',
    title: 'Agreement Signed',
    message: 'Labour agreement with Sharma Constructions has been signed by both parties.',
    time: 'Yesterday, 11:20 AM',
    group: 'Yesterday',
    read: true,
  },
  {
    id: '7',
    type: 'payment',
    title: 'Payment Pending',
    message: 'Invoice #INV-4521 of Rs.18,200 is pending. Due date: 28 Feb 2026.',
    time: 'Yesterday, 9:00 AM',
    group: 'Yesterday',
    read: false,
  },
  {
    id: '8',
    type: 'system',
    title: 'App Update Available',
    message: 'BuildMart v2.4.0 is available with improved order tracking and new payment options.',
    time: '2 days ago',
    group: 'Earlier',
    read: true,
  },
  {
    id: '9',
    type: 'job_request',
    title: 'Job Completed',
    message: 'Plumbing work at Green Valley Apartments has been marked complete by the contractor.',
    time: '3 days ago',
    group: 'Earlier',
    read: true,
  },
  {
    id: '10',
    type: 'system',
    title: 'Scheduled Maintenance',
    message: 'Payment services will be under maintenance on 1 March, 2-4 AM IST. Plan transactions accordingly.',
    time: '4 days ago',
    group: 'Earlier',
    read: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const filtered = notifications.filter((n) => TAB_TYPE_MAP[activeTab]?.includes(n.type));

  const groups: ('Today' | 'Yesterday' | 'Earlier')[] = ['Today', 'Yesterday', 'Earlier'];

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead} style={s.markAllBtn}>
            <Ionicons name="checkmark-done-outline" size={18} color={T.amber} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 42 }} />
        )}
      </View>

      {/* Filter Tabs */}
      <View style={s.tabRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[s.tab, activeTab === tab && s.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <View style={s.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={48} color={T.textMuted} />
            </View>
            <Text style={s.emptyTitle}>No notifications</Text>
            <Text style={s.emptyDesc}>
              {activeTab === 'All'
                ? 'You are all caught up! New notifications will appear here.'
                : `No ${activeTab.toLowerCase()} notifications to show.`}
            </Text>
          </View>
        ) : (
          groups.map((group) => {
            const groupItems = filtered.filter((n) => n.group === group);
            if (groupItems.length === 0) return null;
            return (
              <View key={group} style={s.section}>
                <Text style={s.sectionTitle}>{group}</Text>
                <View style={{ gap: 10 }}>
                  {groupItems.map((notification) => {
                    const config = TYPE_CONFIG[notification.type];
                    return (
                      <TouchableOpacity
                        key={notification.id}
                        style={[
                          s.card,
                          !notification.read && s.cardUnread,
                        ]}
                        onPress={() => markAsRead(notification.id)}
                        activeOpacity={0.7}
                      >
                        <View style={s.cardContent}>
                          {/* Icon */}
                          <View style={[s.iconCircle, { backgroundColor: config.color + '26' }]}>
                            <Ionicons name={config.icon} size={20} color={config.color} />
                          </View>

                          {/* Text Content */}
                          <View style={s.textContent}>
                            <View style={s.titleRow}>
                              <Text style={s.notifTitle} numberOfLines={1}>
                                {notification.title}
                              </Text>
                              {!notification.read && <View style={s.unreadDot} />}
                            </View>
                            <Text style={s.notifMessage} numberOfLines={2}>
                              {notification.message}
                            </Text>
                            <Text style={s.notifTime}>{notification.time}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
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
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.text,
  },
  markAllBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: T.bg,
  },
  tabRow: {
    paddingVertical: 12,
    backgroundColor: T.surface,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: T.bg,
  },
  tabActive: {
    backgroundColor: T.navy,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.textSecondary,
  },
  tabTextActive: {
    color: T.white,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    marginBottom: 10,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
  },
  cardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: T.amber,
  },
  cardContent: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
    flex: 1,
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: T.amber,
  },
  notifMessage: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: T.textSecondary,
    lineHeight: 19,
    marginTop: 4,
  },
  notifTime: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: T.textMuted,
    marginTop: 6,
  },
  empty: {
    alignItems: 'center' as const,
    paddingTop: 80,
    gap: 10,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.text,
  },
  emptyDesc: {
    fontSize: 14,
    color: T.textSecondary,
    textAlign: 'center' as const,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
};
