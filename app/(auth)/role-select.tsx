import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type Role = {
  id: string;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
};

const ROLES: Role[] = [
  {
    id: 'customer',
    label: 'Customer',
    description: 'Browse and purchase quality building materials',
    icon: 'cart',
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
  },
  {
    id: 'contractor',
    label: 'Contractor',
    description: 'Manage construction projects and site teams',
    icon: 'people',
    iconBg: '#F0F4FF',
    iconColor: '#6B7280',
  },
  {
    id: 'worker',
    label: 'Worker',
    description: 'Find labor work and track your daily tasks',
    icon: 'construct',
    iconBg: '#F5F5F5',
    iconColor: '#6B7280',
  },
  {
    id: 'shopkeeper',
    label: 'Shopkeeper',
    description: 'Manage inventory and sales for your store',
    icon: 'storefront',
    iconBg: '#F5F5F5',
    iconColor: '#6B7280',
  },
  {
    id: 'driver',
    label: 'Driver',
    description: 'Fulfill deliveries and earn as a logistics partner',
    icon: 'car',
    iconBg: '#F5F5F5',
    iconColor: '#6B7280',
  },
  {
    id: 'admin',
    label: 'Admin',
    description: 'Full platform oversight and analytics',
    icon: 'shield-checkmark',
    iconBg: '#F5F5F5',
    iconColor: '#6B7280',
  },
];

export default function RoleSelectScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('customer');

  const handleContinue = () => {
    router.push({ pathname: '/(auth)/login', params: { role: selectedRole } });
  };

  const selectedLabel = ROLES.find((r) => r.id === selectedRole)?.label ?? 'Customer';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color={T.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>BUILDMART</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Choose Your Role</Text>
          <Text style={styles.mainSubtitle}>
            Select how you'd like to use the platform today.
          </Text>
        </View>

        {/* Role Grid */}
        <View style={styles.grid}>
          {ROLES.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleCard,
                  isSelected && styles.roleCardSelected,
                ]}
                onPress={() => setSelectedRole(role.id)}
                activeOpacity={0.7}
              >
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark-circle" size={22} color={T.success} />
                  </View>
                )}

                <View
                  style={[
                    styles.roleIcon,
                    {
                      backgroundColor: isSelected ? '#EEF2FF' : role.iconBg,
                    },
                  ]}
                >
                  <Ionicons
                    name={role.icon}
                    size={24}
                    color={isSelected ? '#4F46E5' : role.iconColor}
                  />
                </View>

                <Text style={styles.roleLabel}>{role.label}</Text>
                <Text style={styles.roleDesc}>{role.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>Continue as {selectedLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>
              Already have an account?{' '}
              <Text style={styles.loginLinkBold}>Log in</Text>
            </Text>
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
    paddingBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    letterSpacing: 2,
    color: T.text,
  },
  titleSection: {
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: T.text,
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 15,
    color: T.textSecondary,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    paddingHorizontal: 20,
    gap: 12,
  },
  roleCard: {
    width: '47.5%' as const,
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: T.border,
    minHeight: 140,
  },
  roleCardSelected: {
    borderColor: T.borderSelected,
    borderWidth: 2,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  checkBadge: {
    position: 'absolute' as const,
    top: 10,
    right: 10,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 12,
    color: T.textSecondary,
    lineHeight: 17,
  },
  actionSection: {
    paddingHorizontal: 24,
    marginTop: 28,
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
  loginLink: {
    alignItems: 'center' as const,
    marginTop: 18,
    paddingVertical: 4,
  },
  loginLinkText: {
    fontSize: 14,
    color: T.textSecondary,
  },
  loginLinkBold: {
    fontWeight: '700' as const,
    color: T.text,
    textDecorationLine: 'underline' as const,
  },
};
