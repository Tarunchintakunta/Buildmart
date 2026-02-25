import { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type PermissionItem = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  defaultOn: boolean;
};

const PERMISSIONS: PermissionItem[] = [
  {
    id: 'location',
    title: 'Location',
    description:
      'Used for accurate delivery and finding nearby workers for your project.',
    icon: 'location',
    defaultOn: true,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description:
      'Stay updated on your order status, material arrivals, and project alerts.',
    icon: 'notifications',
    defaultOn: false,
  },
  {
    id: 'camera',
    title: 'Camera',
    description:
      'Required for scanning verification documents and documenting site progress.',
    icon: 'camera',
    defaultOn: false,
  },
];

export default function PermissionsScreen() {
  const router = useRouter();
  const { phone, role } = useLocalSearchParams<{ phone?: string; role?: string }>();
  const [permissions, setPermissions] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      PERMISSIONS.forEach((p) => { initial[p.id] = p.defaultOn; });
      return initial;
    },
  );

  const togglePermission = (id: string) => {
    setPermissions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleContinue = () => {
    // In production, request actual device permissions here
    router.replace({
      pathname: '/(auth)/profile-setup',
      params: { phone: phone ?? '', role: role ?? 'customer' },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.surface }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={T.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Enable Permissions</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.body}>
          {/* Shield Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={28} color={T.white} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Secure Your Experience</Text>
          <Text style={styles.subtitle}>
            To provide the best service, BuildMart needs access to these
            permissions. You can change these anytime in settings.
          </Text>

          {/* Permission Cards */}
          <View style={styles.permissionList}>
            {PERMISSIONS.map((perm) => (
              <View key={perm.id} style={styles.permCard}>
                <View style={styles.permLeft}>
                  <View style={styles.permIcon}>
                    <Ionicons name={perm.icon} size={20} color={T.white} />
                  </View>
                  <View style={styles.permTextGroup}>
                    <Text style={styles.permTitle}>{perm.title}</Text>
                    <Text style={styles.permDesc}>{perm.description}</Text>
                  </View>
                </View>
                <Switch
                  value={permissions[perm.id]}
                  onValueChange={() => togglePermission(perm.id)}
                  trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                  thumbColor={permissions[perm.id] ? T.success : '#F9FAFB'}
                  ios_backgroundColor="#D1D5DB"
                />
              </View>
            ))}
          </View>

          {/* Privacy Note */}
          <View style={styles.privacyNote}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={T.textMuted}
              style={{ marginTop: 1 }}
            />
            <Text style={styles.privacyText}>
              BuildMart respects your privacy. We only use these permissions to
              enhance your site management and delivery experience. Your data is
              encrypted and never shared with third parties.
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>Continue to Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleContinue}
          >
            <Text style={styles.skipText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: T.text,
  },
  body: {
    flex: 1,
    alignItems: 'center' as const,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0D9488',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 24,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: T.text,
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: 14,
    color: T.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 21,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  permissionList: {
    width: '100%' as const,
    gap: 12,
  },
  permCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  permLeft: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    flex: 1,
    marginRight: 12,
  },
  permIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.navy,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 14,
    marginTop: 2,
  },
  permTextGroup: {
    flex: 1,
  },
  permTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 4,
  },
  permDesc: {
    fontSize: 12,
    color: T.textSecondary,
    lineHeight: 17,
  },
  privacyNote: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginTop: 24,
    paddingHorizontal: 4,
    gap: 8,
  },
  privacyText: {
    flex: 1,
    fontSize: 11,
    color: T.textMuted,
    lineHeight: 16,
  },
  actionSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  continueButton: {
    backgroundColor: T.navy,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center' as const,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  continueText: {
    color: T.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  skipButton: {
    alignItems: 'center' as const,
    marginTop: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    color: T.textSecondary,
    fontWeight: '500' as const,
  },
};
