import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

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
  { icon: 'location-outline', label: 'Saved Addresses', subtitle: 'Manage delivery locations' },
  { icon: 'wallet-outline', label: 'Wallet', subtitle: 'Balance & transactions', route: '/(app)/(tabs)/wallet' },
  { icon: 'card-outline', label: 'Payment Methods', subtitle: 'Cards & UPI' },
  { icon: 'notifications-outline', label: 'Notifications', subtitle: 'Preferences & alerts' },
  { icon: 'help-circle-outline', label: 'Help & Support', subtitle: 'FAQs and contact us' },
  { icon: 'document-text-outline', label: 'Terms & Privacy', subtitle: 'Legal documents' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Profile</Text>
          <TouchableOpacity style={s.settingsBtn}>
            <Ionicons name="settings-outline" size={22} color={T.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>
              {user?.full_name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={s.name}>{user?.full_name}</Text>
            <Text style={s.phone}>+91 {user?.phone}</Text>
            <View style={s.roleBadge}>
              <Ionicons name="shield-checkmark" size={12} color={T.amber} />
              <Text style={s.roleText}>{roleLabel}</Text>
            </View>
          </View>
          <TouchableOpacity style={s.editBtn}>
            <Ionicons name="create-outline" size={18} color={T.navy} />
          </TouchableOpacity>
        </View>

        {/* Wallet Summary */}
        <TouchableOpacity style={s.walletCard} onPress={() => router.push('/(app)/(tabs)/wallet')}>
          <View style={s.walletIcon}>
            <Ionicons name="wallet" size={22} color={T.white} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.walletLabel}>Wallet Balance</Text>
            <Text style={s.walletAmount}>Rs.25,000</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={T.textMuted} />
        </TouchableOpacity>

        {/* Menu Items */}
        <View style={s.menuSection}>
          {CUSTOMER_MENU.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={s.menuItem}
              onPress={() => item.route && router.push(item.route as any)}
            >
              <View style={s.menuIcon}>
                <Ionicons name={item.icon} size={20} color={T.navy} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.menuLabel}>{item.label}</Text>
                {item.subtitle && <Text style={s.menuSub}>{item.subtitle}</Text>}
              </View>
              {item.badge && (
                <View style={s.menuBadge}>
                  <Text style={s.menuBadgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color={T.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={s.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={s.version}>BuildMart v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  headerTitle: { fontSize: 22, fontWeight: '800' as const, color: T.text },
  settingsBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: T.bg, justifyContent: 'center' as const, alignItems: 'center' as const },
  profileCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: T.navy,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  avatarText: { fontSize: 20, fontWeight: '800' as const, color: T.white },
  name: { fontSize: 17, fontWeight: '700' as const, color: T.text },
  phone: { fontSize: 13, color: T.textSecondary, marginTop: 2 },
  roleBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.amberBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start' as const,
    gap: 4,
    marginTop: 6,
  },
  roleText: { fontSize: 11, fontWeight: '700' as const, color: T.text },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  walletCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    marginHorizontal: 16,
    marginBottom: 16,
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
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  walletLabel: { fontSize: 12, color: T.textSecondary },
  walletAmount: { fontSize: 18, fontWeight: '800' as const, color: T.text, marginTop: 2 },
  menuSection: {
    backgroundColor: T.surface,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden' as const,
  },
  menuItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
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
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 14,
  },
  menuLabel: { fontSize: 15, fontWeight: '600' as const, color: T.text },
  menuSub: { fontSize: 12, color: T.textMuted, marginTop: 1 },
  menuBadge: {
    backgroundColor: T.amber,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  menuBadgeText: { fontSize: 11, fontWeight: '700' as const, color: T.white },
  logoutBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  logoutText: { fontSize: 15, fontWeight: '700' as const, color: '#EF4444' },
  version: {
    textAlign: 'center' as const,
    fontSize: 12,
    color: T.textMuted,
    marginTop: 16,
    marginBottom: 32,
  },
};
