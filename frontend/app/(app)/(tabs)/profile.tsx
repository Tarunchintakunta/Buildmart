import { View, Text, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInLeft,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useAuth } from '../../../src/hooks/useAuth';
import { LightTheme as T, Colors } from '../../../src/theme/colors';

const SPRING_SNAPPY = { damping: 18, stiffness: 280, mass: 0.8 };

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  route?: string;
  color?: string;
  badge?: string;
};

const CUSTOMER_MENU: MenuItem[] = [
  { icon: 'receipt-outline', label: 'My Orders', subtitle: 'Track and manage orders', route: '/(app)/(tabs)/orders' },
  { icon: 'heart-outline', label: 'Wishlist', subtitle: 'Saved items', badge: '8', route: '/(app)/wishlist' },
  { icon: 'location-outline', label: 'Saved Addresses', subtitle: 'Manage delivery locations', route: '/(app)/addresses' },
  { icon: 'wallet-outline', label: 'Wallet', subtitle: 'Balance & transactions', route: '/(app)/(tabs)/wallet' },
  { icon: 'card-outline', label: 'Payment Methods', subtitle: 'Cards & UPI', route: '/(app)/payment-methods' },
  { icon: 'notifications-outline', label: 'Notifications', subtitle: 'Preferences & alerts', route: '/(app)/notifications' },
  { icon: 'help-circle-outline', label: 'Help & Support', subtitle: 'FAQs and contact us', route: '/(app)/help-support' },
  { icon: 'document-text-outline', label: 'Terms & Privacy', subtitle: 'Legal documents' },
];

const CONTRACTOR_MENU: MenuItem[] = [
  { icon: 'document-text-outline', label: 'Agreements', subtitle: 'Manage contracts', route: '/(app)/(tabs)/agreements' },
  { icon: 'people-outline', label: 'Workers', subtitle: 'Hire and manage', route: '/(app)/(tabs)/workers' },
  { icon: 'business-outline', label: 'Site Management', subtitle: 'Track projects', route: '/(app)/site-management' },
  { icon: 'bar-chart-outline', label: 'Analytics', subtitle: 'Spending & reports', route: '/(app)/contractor-analytics' },
  { icon: 'megaphone-outline', label: 'Tenders', subtitle: 'Bids & proposals', route: '/(app)/tenders' },
  { icon: 'wallet-outline', label: 'Wallet', subtitle: 'Balance & transactions', route: '/(app)/(tabs)/wallet' },
  { icon: 'notifications-outline', label: 'Notifications', subtitle: 'Preferences & alerts', route: '/(app)/notifications' },
  { icon: 'help-circle-outline', label: 'Help & Support', subtitle: 'FAQs and contact us', route: '/(app)/help-support' },
];

const WORKER_MENU: MenuItem[] = [
  { icon: 'briefcase-outline', label: 'Jobs', subtitle: 'Requests & active work', route: '/(app)/(tabs)/jobs' },
  { icon: 'construct-outline', label: 'Skills', subtitle: 'Manage your skills', route: '/(app)/skill-management' },
  { icon: 'calendar-outline', label: 'Availability', subtitle: 'Set your schedule', route: '/(app)/availability' },
  { icon: 'time-outline', label: 'Job History', subtitle: 'Past work & ratings', route: '/(app)/job-history' },
  { icon: 'ribbon-outline', label: 'Certifications', subtitle: 'Badges & certificates', route: '/(app)/certifications' },
  { icon: 'wallet-outline', label: 'Wallet', subtitle: 'Earnings & withdrawals', route: '/(app)/(tabs)/wallet' },
  { icon: 'notifications-outline', label: 'Notifications', subtitle: 'Preferences & alerts', route: '/(app)/notifications' },
  { icon: 'help-circle-outline', label: 'Help & Support', subtitle: 'FAQs and contact us', route: '/(app)/help-support' },
];

const SHOPKEEPER_MENU: MenuItem[] = [
  { icon: 'cube-outline', label: 'Inventory', subtitle: 'Manage stock', route: '/(app)/(tabs)/inventory' },
  { icon: 'receipt-outline', label: 'Orders', subtitle: 'Track orders', route: '/(app)/(tabs)/orders' },
  { icon: 'settings-outline', label: 'Shop Settings', subtitle: 'Profile & hours', route: '/(app)/shop-settings' },
  { icon: 'add-circle-outline', label: 'Add Product', subtitle: 'List new items', route: '/(app)/add-product' },
  { icon: 'pricetags-outline', label: 'Pricing & Offers', subtitle: 'Discounts & deals', route: '/(app)/pricing-offers' },
  { icon: 'bar-chart-outline', label: 'Analytics', subtitle: 'Sales & insights', route: '/(app)/shop-analytics' },
  { icon: 'wallet-outline', label: 'Wallet', subtitle: 'Balance & payouts', route: '/(app)/(tabs)/wallet' },
  { icon: 'help-circle-outline', label: 'Help & Support', subtitle: 'FAQs and contact us', route: '/(app)/help-support' },
];

const DRIVER_MENU: MenuItem[] = [
  { icon: 'bicycle-outline', label: 'Deliveries', subtitle: 'Active & completed', route: '/(app)/(tabs)/deliveries' },
  { icon: 'map-outline', label: 'Route Planner', subtitle: 'Optimize routes', route: '/(app)/route-optimization' },
  { icon: 'camera-outline', label: 'Delivery Proof', subtitle: 'Photos & signatures', route: '/(app)/delivery-proof' },
  { icon: 'cash-outline', label: 'Earnings', subtitle: 'History & payouts', route: '/(app)/earnings-history' },
  { icon: 'car-outline', label: 'Vehicle', subtitle: 'Manage vehicle info', route: '/(app)/vehicle-management' },
  { icon: 'wallet-outline', label: 'Wallet', subtitle: 'Balance & withdrawals', route: '/(app)/(tabs)/wallet' },
  { icon: 'help-circle-outline', label: 'Help & Support', subtitle: 'FAQs and contact us', route: '/(app)/help-support' },
];

const ADMIN_MENU: MenuItem[] = [
  { icon: 'shield-checkmark-outline', label: 'Verifications', subtitle: 'Review requests', route: '/(app)/(tabs)/verifications' },
  { icon: 'people-outline', label: 'Users', subtitle: 'Manage all users', route: '/(app)/(tabs)/users' },
  { icon: 'analytics-outline', label: 'Analytics', subtitle: 'Platform insights', route: '/(app)/admin-analytics' },
  { icon: 'receipt-outline', label: 'Orders', subtitle: 'Order management', route: '/(app)/order-management' },
  { icon: 'storefront-outline', label: 'Shops', subtitle: 'Shop management', route: '/(app)/shop-management' },
  { icon: 'warning-outline', label: 'Disputes', subtitle: 'Resolve issues', route: '/(app)/disputes' },
  { icon: 'notifications-outline', label: 'Notifications', subtitle: 'System alerts', route: '/(app)/notifications' },
  { icon: 'help-circle-outline', label: 'Help & Support', subtitle: 'FAQs and contact us', route: '/(app)/help-support' },
];

const ROLE_MENUS: Record<string, MenuItem[]> = {
  customer: CUSTOMER_MENU,
  contractor: CONTRACTOR_MENU,
  worker: WORKER_MENU,
  shopkeeper: SHOPKEEPER_MENU,
  driver: DRIVER_MENU,
  admin: ADMIN_MENU,
};

function AnimatedMenuItem({ item, index, onPress }: { item: MenuItem; index: number; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInLeft.delay(index * 50 + 200).springify().damping(18)}
      style={animStyle}
    >
      <Pressable
        style={styles.menuItem}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.98, SPRING_SNAPPY); }}
        onPressOut={() => { scale.value = withSpring(1, SPRING_SNAPPY); }}
      >
        <View style={styles.menuIcon}>
          <Ionicons name={item.icon} size={20} color={T.navy} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.menuLabel}>{item.label}</Text>
          {item.subtitle && <Text style={styles.menuSub}>{item.subtitle}</Text>}
        </View>
        {item.badge && (
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>{item.badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color={T.textMuted} />
      </Pressable>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const logoutScale = useSharedValue(1);
  const logoutAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoutScale.value }],
  }));

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)');
        },
      },
    ]);
  };

  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '';
  const initials = user?.full_name
    ? user.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';
  const menuItems = ROLE_MENUS[user?.role || 'customer'] || CUSTOMER_MENU;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable style={styles.settingsBtn} onPress={() => router.push('/(app)/settings' as any)}>
            <Ionicons name="settings-outline" size={22} color={T.text} />
          </Pressable>
        </View>

        {/* Avatar + Info */}
        <View style={styles.profileCard}>
          <Animated.View entering={ZoomIn.delay(0).springify().damping(14)} style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(60).springify()} style={styles.profileInfo}>
            <Text style={styles.name}>{user?.full_name || 'BuildMart User'}</Text>
            <Text style={styles.phone}>+91 {user?.phone}</Text>
            <View style={styles.roleBadge}>
              <Ionicons name="shield-checkmark" size={12} color={T.amber} />
              <Text style={styles.roleText}>{roleLabel}</Text>
            </View>
          </Animated.View>
          <Pressable style={styles.editBtn} onPress={() => router.push('/(app)/edit-profile' as any)}>
            <Ionicons name="create-outline" size={18} color={T.navy} />
          </Pressable>
        </View>

        {/* Stats Row */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Agreements</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.ratingInline}>
              <Text style={styles.statValue}>4.7</Text>
              <Ionicons name="star" size={14} color={T.amber} style={{ marginTop: 2 }} />
            </View>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </Animated.View>

        {/* Wallet Summary */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <Pressable style={styles.walletCard} onPress={() => router.push('/(app)/(tabs)/wallet' as any)}>
            <View style={styles.walletIcon}>
              <Ionicons name="wallet" size={22} color={T.white} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={styles.walletAmount}>₹25,000</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={T.textMuted} />
          </Pressable>
        </Animated.View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, i) => (
            <AnimatedMenuItem
              key={i}
              item={item}
              index={i}
              onPress={() => item.route && router.push(item.route as any)}
            />
          ))}
        </View>

        {/* Logout */}
        <Animated.View style={logoutAnimStyle}>
          <Pressable
            style={styles.logoutBtn}
            onPress={handleLogout}
            onPressIn={() => { logoutScale.value = withSpring(0.97, SPRING_SNAPPY); }}
            onPressOut={() => { logoutScale.value = withSpring(1, SPRING_SNAPPY); }}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </Animated.View>

        <Text style={styles.version}>BuildMart v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: T.bg,
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
    paddingBottom: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: T.text,
  },
  settingsBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: T.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: T.navy,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: T.white,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: T.text,
  },
  phone: {
    fontSize: 13,
    color: T.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.amberBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: T.text,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: T.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: T.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: T.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: T.text,
  },
  statLabel: {
    fontSize: 12,
    color: T.textSecondary,
    fontWeight: '500',
  },
  ratingInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
  },
  walletIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: T.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletLabel: {
    fontSize: 12,
    color: T.textSecondary,
  },
  walletAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: T.text,
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: T.surface,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: T.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: T.text,
  },
  menuSub: {
    fontSize: 12,
    color: T.textMuted,
    marginTop: 1,
  },
  menuBadge: {
    backgroundColor: T.amber,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  menuBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: T.white,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.error,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: T.textMuted,
    marginTop: 16,
    marginBottom: 32,
  },
});
