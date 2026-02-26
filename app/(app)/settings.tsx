import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type SettingRow = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  type: 'nav' | 'switch' | 'value' | 'danger';
  value?: string;
  key?: string;
};

type Section = {
  title: string;
  rows: SettingRow[];
};

const SECTIONS: Section[] = [
  {
    title: 'Account',
    rows: [
      { icon: 'person-outline', label: 'Edit Profile', color: '#3B82F6', type: 'nav' },
      { icon: 'call-outline', label: 'Phone Number', color: '#10B981', type: 'nav' },
      { icon: 'location-outline', label: 'Addresses', color: '#F59E0B', type: 'nav' },
      { icon: 'card-outline', label: 'Payment Methods', color: '#8B5CF6', type: 'nav' },
    ],
  },
  {
    title: 'Notifications',
    rows: [
      { icon: 'notifications-outline', label: 'Push Notifications', color: '#3B82F6', type: 'switch', key: 'pushNotifications' },
      { icon: 'cube-outline', label: 'Order Updates', color: '#10B981', type: 'switch', key: 'orderUpdates' },
      { icon: 'megaphone-outline', label: 'Promotions', color: '#F59E0B', type: 'switch', key: 'promotions' },
    ],
  },
  {
    title: 'Preferences',
    rows: [
      { icon: 'language-outline', label: 'Language', color: '#3B82F6', type: 'value', value: 'English' },
      { icon: 'cash-outline', label: 'Currency', color: '#10B981', type: 'value', value: 'INR (\u20B9)' },
    ],
  },
  {
    title: 'Privacy & Security',
    rows: [
      { icon: 'key-outline', label: 'Change PIN', color: '#8B5CF6', type: 'nav' },
      { icon: 'finger-print-outline', label: 'Biometric Login', color: '#3B82F6', type: 'switch', key: 'biometric' },
      { icon: 'shield-checkmark-outline', label: 'Two-Factor Auth', color: '#10B981', type: 'nav' },
    ],
  },
  {
    title: 'Support',
    rows: [
      { icon: 'help-circle-outline', label: 'Help Center', color: '#3B82F6', type: 'nav' },
      { icon: 'bug-outline', label: 'Report a Problem', color: '#F59E0B', type: 'nav' },
      { icon: 'document-text-outline', label: 'Terms of Service', color: '#6B7280', type: 'nav' },
      { icon: 'lock-closed-outline', label: 'Privacy Policy', color: '#6B7280', type: 'nav' },
    ],
  },
  {
    title: 'About',
    rows: [
      { icon: 'information-circle-outline', label: 'App Version', color: '#3B82F6', type: 'value', value: '1.0.0' },
      { icon: 'star-outline', label: 'Rate Us', color: '#F59E0B', type: 'nav' },
      { icon: 'share-social-outline', label: 'Share App', color: '#10B981', type: 'nav' },
    ],
  },
  {
    title: 'Danger Zone',
    rows: [
      { icon: 'trash-outline', label: 'Delete Account', color: '#EF4444', type: 'danger' },
      { icon: 'log-out-outline', label: 'Logout', color: '#EF4444', type: 'danger' },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const [switches, setSwitches] = useState<Record<string, boolean>>({
    pushNotifications: true,
    orderUpdates: true,
    promotions: false,
    biometric: false,
  });

  const toggleSwitch = (key: string) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDangerPress = (label: string) => {
    if (label === 'Logout') {
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
    } else if (label === 'Delete Account') {
      Alert.alert(
        'Delete Account',
        'This action is permanent and cannot be undone. All your data will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              // Handle account deletion
            },
          },
        ]
      );
    }
  };

  const renderRow = (row: SettingRow, isLast: boolean) => {
    const iconBg = row.color + '26'; // 15% opacity hex

    return (
      <TouchableOpacity
        key={row.label}
        style={[s.row, !isLast && s.rowBorder]}
        activeOpacity={row.type === 'switch' ? 1 : 0.6}
        onPress={() => {
          if (row.type === 'danger') handleDangerPress(row.label);
        }}
      >
        <View style={[s.iconCircle, { backgroundColor: iconBg }]}>
          <Ionicons name={row.icon} size={18} color={row.color} />
        </View>
        <Text
          style={[
            s.rowLabel,
            row.type === 'danger' && { color: '#EF4444' },
          ]}
        >
          {row.label}
        </Text>
        <View style={s.rowRight}>
          {row.type === 'switch' && row.key && (
            <Switch
              value={switches[row.key]}
              onValueChange={() => toggleSwitch(row.key!)}
              trackColor={{ false: T.border, true: T.success }}
              thumbColor={T.white}
            />
          )}
          {row.type === 'value' && (
            <Text style={s.rowValue}>{row.value}</Text>
          )}
          {(row.type === 'nav' || row.type === 'value') && (
            <Ionicons name="chevron-forward" size={18} color={T.textMuted} />
          )}
          {row.type === 'danger' && (
            <Ionicons name="chevron-forward" size={18} color="#EF4444" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Settings</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {SECTIONS.map((section, sectionIndex) => (
          <View
            key={section.title}
            style={sectionIndex > 0 ? { marginTop: 24 } : undefined}
          >
            <Text style={s.sectionTitle}>{section.title}</Text>
            <View style={s.card}>
              {section.rows.map((row, rowIndex) =>
                renderRow(row, rowIndex === section.rows.length - 1)
              )}
            </View>
          </View>
        ))}
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden' as const,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 14,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600' as const,
    color: T.text,
  },
  rowRight: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: T.textSecondary,
  },
};
