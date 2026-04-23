import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useAuth } from '../../../src/hooks/useAuth';
import Colors from '../../../src/theme/colors';

// ─── Types ────────────────────────────────────────────────────────────────────

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  route?: string;
  badge?: string;
  badgeColor?: string;
  isDestructive?: boolean;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

// ─── Role-based Menus ─────────────────────────────────────────────────────────

const CUSTOMER_SECTIONS: MenuSection[] = [
  {
    title: 'My Account',
    items: [
      { icon: 'person-outline', label: 'Edit Profile', subtitle: 'Name, email, preferences', route: '/(app)/edit-profile' },
      { icon: 'location-outline', label: 'Addresses', subtitle: 'Saved delivery locations', route: '/(app)/addresses' },
      { icon: 'card-outline', label: 'Payment Methods', subtitle: 'Cards & UPI', route: '/(app)/payment-methods' },
      { icon: 'wallet-outline', label: 'Wallet', subtitle: 'Balance & transactions', route: '/(app)/(tabs)/wallet' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'notifications-outline', label: 'Notifications', subtitle: 'Alerts & reminders', route: '/(app)/notifications' },
      { icon: 'language-outline', label: 'Language', subtitle: 'EN / HI / TE', badge: 'EN' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle-outline', label: 'Help & Support', subtitle: 'FAQs and contact', route: '/(app)/help-support' },
      { icon: 'document-text-outline', label: 'About BuildMart', subtitle: 'Terms, privacy & licences' },
    ],
  },
];

const SHOPKEEPER_SECTIONS: MenuSection[] = [
  {
    title: 'My Shop',
    items: [
      { icon: 'storefront-outline', label: 'Shop Settings', subtitle: 'Hours, location, KYC', route: '/(app)/shop-settings' },
      { icon: 'cube-outline', label: 'Inventory', subtitle: 'Manage stock', route: '/(app)/(tabs)/inventory' },
      { icon: 'add-circle-outline', label: 'Add Product', subtitle: 'List new item', route: '/(app)/add-product' },
      { icon: 'pricetags-outline', label: 'Pricing & Offers', subtitle: 'Discounts & deals', route: '/(app)/pricing-offers' },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { icon: 'bar-chart-outline', label: 'Sales Analytics', subtitle: 'Revenue & insights', route: '/(app)/shop-analytics' },
      { icon: 'wallet-outline', label: 'Wallet & Payouts', subtitle: 'Earnings & withdrawals', route: '/(app)/(tabs)/wallet' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'notifications-outline', label: 'Notifications', route: '/(app)/notifications' },
      { icon: 'help-circle-outline', label: 'Help & Support', route: '/(app)/help-support' },
      { icon: 'language-outline', label: 'Language', badge: 'EN' },
    ],
  },
];

const WORKER_SECTIONS: MenuSection[] = [
  {
    title: 'Work Profile',
    items: [
      { icon: 'person-outline', label: 'Edit Profile', route: '/(app)/edit-profile' },
      { icon: 'construct-outline', label: 'Skills', subtitle: 'Manage your skills', route: '/(app)/skill-management' },
      { icon: 'ribbon-outline', label: 'Certifications', subtitle: 'Badges & certificates', route: '/(app)/certifications', badge: 'KYC ✓', badgeColor: Colors.success },
      { icon: 'calendar-outline', label: 'Availability', subtitle: 'Set your schedule', route: '/(app)/availability' },
    ],
  },
  {
    title: 'Earnings',
    items: [
      { icon: 'wallet-outline', label: 'Wallet', subtitle: 'Earnings & withdrawals', route: '/(app)/(tabs)/wallet' },
      { icon: 'time-outline', label: 'Job History', subtitle: 'Past work & ratings', route: '/(app)/job-history' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'notifications-outline', label: 'Notifications', route: '/(app)/notifications' },
      { icon: 'help-circle-outline', label: 'Help & Support', route: '/(app)/help-support' },
      { icon: 'language-outline', label: 'Language', badge: 'EN' },
    ],
  },
];

const CONTRACTOR_SECTIONS: MenuSection[] = [
  {
    title: 'My Account',
    items: [
      { icon: 'person-outline', label: 'Edit Profile', route: '/(app)/edit-profile' },
      { icon: 'business-outline', label: 'Site Management', route: '/(app)/site-management' },
      { icon: 'megaphone-outline', label: 'Tenders', subtitle: 'Bids & proposals', route: '/(app)/tenders' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { icon: 'wallet-outline', label: 'Wallet', route: '/(app)/(tabs)/wallet' },
      { icon: 'bar-chart-outline', label: 'Analytics', route: '/(app)/contractor-analytics' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'notifications-outline', label: 'Notifications', route: '/(app)/notifications' },
      { icon: 'help-circle-outline', label: 'Help & Support', route: '/(app)/help-support' },
      { icon: 'language-outline', label: 'Language', badge: 'EN' },
    ],
  },
];

const DRIVER_SECTIONS: MenuSection[] = [
  {
    title: 'My Account',
    items: [
      { icon: 'person-outline', label: 'Edit Profile', route: '/(app)/edit-profile' },
      { icon: 'car-outline', label: 'Vehicle', subtitle: 'Manage vehicle info', route: '/(app)/vehicle-management' },
    ],
  },
  {
    title: 'Earnings',
    items: [
      { icon: 'wallet-outline', label: 'Wallet', route: '/(app)/(tabs)/wallet' },
      { icon: 'cash-outline', label: 'Earnings History', route: '/(app)/earnings-history' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'notifications-outline', label: 'Notifications', route: '/(app)/notifications' },
      { icon: 'help-circle-outline', label: 'Help & Support', route: '/(app)/help-support' },
      { icon: 'language-outline', label: 'Language', badge: 'EN' },
    ],
  },
];

const ADMIN_SECTIONS: MenuSection[] = [
  {
    title: 'Platform',
    items: [
      { icon: 'people-outline', label: 'Users', subtitle: 'Manage all users', route: '/(app)/(tabs)/users' },
      { icon: 'shield-checkmark-outline', label: 'Verifications', subtitle: 'Review KYC requests', route: '/(app)/(tabs)/verifications', badge: '3', badgeColor: Colors.error },
      { icon: 'storefront-outline', label: 'Shops', subtitle: 'Shop management', route: '/(app)/shop-management' },
      { icon: 'warning-outline', label: 'Disputes', subtitle: 'Resolve issues', route: '/(app)/disputes' },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { icon: 'analytics-outline', label: 'Platform Analytics', route: '/(app)/admin-analytics' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'notifications-outline', label: 'Notifications', route: '/(app)/notifications' },
      { icon: 'help-circle-outline', label: 'Help & Support', route: '/(app)/help-support' },
    ],
  },
];

const ROLE_SECTIONS: Record<string, MenuSection[]> = {
  customer: CUSTOMER_SECTIONS,
  shopkeeper: SHOPKEEPER_SECTIONS,
  worker: WORKER_SECTIONS,
  contractor: CONTRACTOR_SECTIONS,
  driver: DRIVER_SECTIONS,
  admin: ADMIN_SECTIONS,
};

// ─── Role Stats ───────────────────────────────────────────────────────────────

const ROLE_STATS: Record<string, Array<{ label: string; value: string; icon: keyof typeof Ionicons.glyphMap; color: string }>> = {
  customer: [
    { label: 'Orders', value: '12', icon: 'receipt-outline', color: Colors.primary },
    { label: 'Wishlist', value: '5', icon: 'heart-outline', color: Colors.error },
    { label: 'Wallet', value: '₹25K', icon: 'wallet-outline', color: Colors.success },
  ],
  shopkeeper: [
    { label: 'Products', value: '42', icon: 'cube-outline', color: Colors.primary },
    { label: 'Orders', value: '128', icon: 'receipt-outline', color: Colors.accent },
    { label: 'Revenue', value: '₹2.4L', icon: 'trending-up-outline', color: Colors.success },
  ],
  worker: [
    { label: 'Jobs Done', value: '87', icon: 'briefcase-outline', color: Colors.primary },
    { label: 'Rating', value: '4.8★', icon: 'star-outline', color: Colors.accent },
    { label: 'Earned', value: '₹48K', icon: 'wallet-outline', color: Colors.success },
  ],
  contractor: [
    { label: 'Projects', value: '6', icon: 'business-outline', color: Colors.primary },
    { label: 'Workers', value: '24', icon: 'people-outline', color: '#8B5CF6' },
    { label: 'Budget', value: '₹12L', icon: 'wallet-outline', color: Colors.success },
  ],
  driver: [
    { label: 'Deliveries', value: '340', icon: 'bicycle-outline', color: Colors.primary },
    { label: 'Rating', value: '4.9★', icon: 'star-outline', color: Colors.accent },
    { label: 'Earned', value: '₹62K', icon: 'wallet-outline', color: Colors.success },
  ],
  admin: [
    { label: 'Users', value: '1.2K', icon: 'people-outline', color: Colors.primary },
    { label: 'Orders', value: '893', icon: 'receipt-outline', color: Colors.accent },
    { label: 'Revenue', value: '₹8.4L', icon: 'trending-up-outline', color: Colors.success },
  ],
};

const ROLE_COLORS: Record<string, string> = {
  customer: Colors.info,
  shopkeeper: Colors.success,
  worker: Colors.accent,
  contractor: '#8B5CF6',
  driver: Colors.error,
  admin: '#6366F1',
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const role = user?.role ?? 'customer';
  const roleColor = ROLE_COLORS[role] ?? Colors.primary;
  const sections = ROLE_SECTIONS[role] ?? CUSTOMER_SECTIONS;
  const stats = ROLE_STATS[role] ?? ROLE_STATS['customer'];

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animated.View style={styles.header} entering={FadeInUp.duration(350)}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable style={styles.settingsBtn} onPress={() => router.push('/(app)/settings' as never)}>
            <Ionicons name="settings-outline" size={22} color={Colors.primary} />
          </Pressable>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View
          style={styles.profileCard}
          entering={FadeInDown.delay(60).springify().damping(18).stiffness(200)}
        >
          <View style={styles.profileTop}>
            <View style={[styles.avatar, { backgroundColor: roleColor }]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.full_name ?? 'User'}</Text>
              <Text style={styles.profilePhone}>+91 {user?.phone ?? '98765 43210'}</Text>
              <View style={styles.profileMetaRow}>
                <View style={[styles.roleBadge, { backgroundColor: roleColor + '15' }]}>
                  <Ionicons name="shield-checkmark" size={11} color={roleColor} />
                  <Text style={[styles.roleText, { color: roleColor }]}>{roleLabel}</Text>
                </View>
                <View style={styles.cityBadge}>
                  <Ionicons name="location-outline" size={11} color={Colors.textMuted} />
                  <Text style={styles.cityText}>{user?.city ?? 'Hyderabad'}</Text>
                </View>
              </View>
            </View>
            <Pressable
              style={styles.editBtn}
              onPress={() => router.push('/(app)/edit-profile' as never)}
            >
              <Ionicons name="create-outline" size={18} color={Colors.primary} />
            </Pressable>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            {stats.map((stat, i) => (
              <View key={stat.label} style={[styles.statItem, i < stats.length - 1 && styles.statItemBorder]}>
                <Ionicons name={stat.icon} size={16} color={stat.color} />
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Wallet Quick Access */}
        <Animated.View
          entering={FadeInDown.delay(120).springify().damping(18).stiffness(200)}
        >
          <Pressable
            style={styles.walletCard}
            onPress={() => router.push('/(app)/(tabs)/wallet' as never)}
          >
            <View style={styles.walletIconWrap}>
              <Ionicons name="wallet" size={20} color={Colors.white} />
            </View>
            <View style={styles.walletTextWrap}>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={styles.walletAmount}>₹25,000</Text>
            </View>
            <View style={styles.walletRight}>
              <Text style={styles.walletTopUp}>Top Up</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </View>
          </Pressable>
        </Animated.View>

        {/* Menu Sections */}
        {sections.map((section, si) => (
          <Animated.View
            key={section.title}
            entering={FadeInDown.delay((si + 2) * 80).springify().damping(18).stiffness(200)}
          >
            <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
            <View style={styles.menuSection}>
              {section.items.map((item, ii) => (
                <Pressable
                  key={item.label}
                  style={[
                    styles.menuItem,
                    ii === section.items.length - 1 && styles.menuItemLast,
                  ]}
                  onPress={() => item.route && router.push(item.route as never)}
                >
                  <View style={[styles.menuIconWrap, item.isDestructive && styles.menuIconWrapDestructive]}>
                    <Ionicons
                      name={item.icon}
                      size={19}
                      color={item.isDestructive ? Colors.error : Colors.primary}
                    />
                  </View>
                  <View style={styles.menuTextWrap}>
                    <Text style={[styles.menuLabel, item.isDestructive && styles.menuLabelDestructive]}>
                      {item.label}
                    </Text>
                    {item.subtitle && (
                      <Text style={styles.menuSub}>{item.subtitle}</Text>
                    )}
                  </View>
                  {item.badge && (
                    <View style={[styles.menuBadge, { backgroundColor: (item.badgeColor ?? Colors.accent) + '20' }]}>
                      <Text style={[styles.menuBadgeText, { color: item.badgeColor ?? Colors.accent }]}>
                        {item.badge}
                      </Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </Pressable>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* KYC Status */}
        <Animated.View
          style={styles.kycCard}
          entering={FadeInDown.delay(500).springify().damping(18).stiffness(200)}
        >
          <View style={styles.kycIconWrap}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
          </View>
          <View style={styles.kycTextWrap}>
            <Text style={styles.kycTitle}>KYC Verified</Text>
            <Text style={styles.kycSub}>Your account is fully verified and trusted</Text>
          </View>
          <View style={styles.kycBadge}>
            <Text style={styles.kycBadgeText}>ACTIVE</Text>
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View
          entering={FadeInDown.delay(560).springify().damping(18).stiffness(200)}
        >
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </Animated.View>

        <Text style={styles.versionText}>BuildMart v1.0.0 • Hyderabad Launch</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  settingsBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: Colors.surface,
    margin: 16,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  profilePhone: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 7,
  },
  profileMetaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  cityText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 14,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  statItemBorder: {
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  walletIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletTextWrap: {
    flex: 1,
  },
  walletLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  walletAmount: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  walletRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  walletTopUp: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 4,
  },
  menuSection: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconWrapDestructive: {
    backgroundColor: '#FEF2F2',
  },
  menuTextWrap: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  menuLabelDestructive: {
    color: Colors.error,
  },
  menuSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  menuBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 4,
  },
  menuBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  kycCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 12,
  },
  kycIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kycTextWrap: {
    flex: 1,
  },
  kycTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.success,
  },
  kycSub: {
    fontSize: 11,
    color: Colors.success,
    opacity: 0.8,
    marginTop: 2,
  },
  kycBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  kycBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.success,
    letterSpacing: 0.5,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 8,
    marginBottom: 16,
  },
});
