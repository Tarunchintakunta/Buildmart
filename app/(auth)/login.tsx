import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

export default function LoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const { sendOTP, login } = useAuth();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDevLogin, setShowDevLogin] = useState(false);

  const formatPhone = (text: string) => {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
  };

  const rawPhone = phone.replace(/\s/g, '');

  const handleGetOTP = async () => {
    if (rawPhone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    try {
      const result = await sendOTP(rawPhone);
      if (result.success) {
        router.push({
          pathname: '/(auth)/verify',
          params: { phone: rawPhone, role: role ?? 'customer' },
        });
      } else {
        Alert.alert('Error', result.error ?? 'Failed to send OTP');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (phoneNumber: string) => {
    setIsLoading(true);
    try {
      const result = await login(phoneNumber);
      if (!result.success) {
        Alert.alert('Login Failed', result.error ?? 'Unknown error');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.surface }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <Ionicons name="cart" size={16} color={T.white} />
              </View>
              <Text style={styles.logoText}>BuildMart</Text>
            </View>
            <TouchableOpacity style={styles.helpButton}>
              <Ionicons name="help-circle-outline" size={24} color={T.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Construction Image Placeholder */}
          <View style={styles.imageContainer}>
            <View style={styles.imagePlaceholder}>
              <Ionicons name="business" size={40} color="#94A3B8" />
              <View style={styles.imageOverlay}>
                <Ionicons name="construct-outline" size={18} color="#CBD5E1" />
              </View>
            </View>
          </View>

          {/* Welcome Section */}
          <View style={styles.content}>
            <Text style={styles.welcomeTitle}>Welcome back</Text>
            <Text style={styles.welcomeSubtitle}>
              Enter your phone number to access your account and manage your
              construction projects.
            </Text>

            {/* Phone Input */}
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.countryCode}>
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.codeText}>+91</Text>
              </View>
              <View style={styles.phoneDivider} />
              <TextInput
                style={styles.phoneInput}
                placeholder="00000 00000"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={formatPhone(phone)}
                onChangeText={(text) => setPhone(text.replace(/\s/g, ''))}
                maxLength={11}
              />
              <TouchableOpacity style={styles.contactIcon}>
                <Ionicons name="person-outline" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Get OTP Button */}
            <TouchableOpacity
              style={[
                styles.otpButton,
                rawPhone.length < 10 && styles.otpButtonDisabled,
              ]}
              onPress={handleGetOTP}
              disabled={rawPhone.length < 10 || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={T.white} />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.otpButtonText}>Get OTP</Text>
                  <Ionicons name="arrow-forward" size={18} color={T.white} />
                </View>
              )}
            </TouchableOpacity>

            {/* Partner With Us Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>PARTNER WITH US</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Feature Badges */}
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <View style={styles.badgeIcon}>
                  <Ionicons name="rocket" size={18} color={T.amber} />
                </View>
                <Text style={styles.badgeText}>FAST DELIVERY</Text>
              </View>
              <View style={styles.badge}>
                <View style={styles.badgeIcon}>
                  <Ionicons name="shield-checkmark" size={18} color={T.amber} />
                </View>
                <Text style={styles.badgeText}>QUALITY ASSURED</Text>
              </View>
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
              By continuing, you agree to BuildMart's{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {'\n'}and <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

            {/* Footer */}
            <View style={styles.footerRow}>
              <Ionicons name="star" size={12} color={T.amber} />
              <Text style={styles.footerText}>
                OFFICIAL BUILDMART SUPPLIER NETWORK
              </Text>
            </View>

            {/* Dev Quick Login (collapsible) */}
            <TouchableOpacity
              onPress={() => setShowDevLogin(!showDevLogin)}
              style={styles.devToggle}
            >
              <Ionicons
                name={showDevLogin ? 'chevron-up' : 'chevron-down'}
                size={14}
                color="#D1D5DB"
              />
              <Text style={styles.devToggleText}>Quick Login (Dev)</Text>
            </TouchableOpacity>

            {showDevLogin && (
              <View style={styles.devSection}>
                {[
                  { label: 'Customer', phone: '9876543101', icon: 'person' as const, color: '#3B82F6' },
                  { label: 'Contractor', phone: '9876543201', icon: 'business' as const, color: '#8B5CF6' },
                  { label: 'Worker', phone: '9876543301', icon: 'hammer' as const, color: '#F59E0B' },
                  { label: 'Shopkeeper', phone: '9876543401', icon: 'storefront' as const, color: '#10B981' },
                  { label: 'Driver', phone: '9876543501', icon: 'car' as const, color: '#EF4444' },
                  { label: 'Admin', phone: '9876543601', icon: 'shield-checkmark' as const, color: '#6366F1' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.phone}
                    style={styles.devButton}
                    onPress={() => quickLogin(item.phone)}
                  >
                    <Ionicons name={item.icon} size={16} color={item.color} />
                    <Text style={styles.devButtonText}>{item.label}</Text>
                    <Text style={styles.devButtonPhone}>{item.phone}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  logoRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: T.amber,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: T.text,
  },
  helpButton: {
    padding: 4,
  },
  imageContainer: {
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 20,
  },
  imagePlaceholder: {
    height: 170,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  imageOverlay: {
    position: 'absolute' as const,
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  content: {
    paddingHorizontal: 24,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: T.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: T.textSecondary,
    lineHeight: 21,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.text,
    marginBottom: 8,
  },
  phoneInputRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: T.border,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 16,
  },
  countryCode: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  flag: {
    fontSize: 18,
  },
  codeText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: T.text,
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: T.border,
    marginHorizontal: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: T.text,
    fontWeight: '500' as const,
  },
  contactIcon: {
    padding: 4,
  },
  otpButton: {
    backgroundColor: T.navy,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginBottom: 24,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  otpButtonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  otpButtonText: {
    color: T.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  divider: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: T.border,
  },
  dividerText: {
    fontSize: 11,
    color: T.textMuted,
    fontWeight: '600' as const,
    letterSpacing: 1.5,
    marginHorizontal: 14,
  },
  badgeRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 16,
    marginBottom: 24,
  },
  badge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  badgeIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: T.amberBg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    color: T.text,
  },
  termsText: {
    fontSize: 12,
    color: T.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 18,
    marginBottom: 20,
  },
  termsLink: {
    fontWeight: '700' as const,
    color: T.text,
    textDecorationLine: 'underline' as const,
  },
  footerRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: '600' as const,
    letterSpacing: 1.5,
  },
  devToggle: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 4,
    paddingVertical: 8,
    marginTop: 8,
  },
  devToggleText: {
    fontSize: 11,
    color: '#D1D5DB',
  },
  devSection: {
    gap: 6,
    marginTop: 4,
  },
  devButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    gap: 10,
  },
  devButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.text,
    flex: 1,
  },
  devButtonPhone: {
    fontSize: 12,
    color: T.textMuted,
  },
};
