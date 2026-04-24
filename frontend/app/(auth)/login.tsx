import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInUp,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useAuthStore } from '../../src/store/auth.store';
import { Colors, LightTheme as T } from '../../src/theme/colors';

const SPRING_SNAPPY = { damping: 18, stiffness: 280, mass: 0.8 };

interface SeedUser {
  label: string;
  phone: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const SEED_USERS: SeedUser[] = [
  { label: 'Customer', phone: '9000000001', icon: 'person-outline', color: Colors.roles.customer },
  { label: 'Worker', phone: '9000000002', icon: 'construct-outline', color: Colors.roles.worker },
  { label: 'Shopkeeper', phone: '9000000003', icon: 'storefront-outline', color: Colors.roles.shopkeeper },
  { label: 'Contractor', phone: '9000000004', icon: 'briefcase-outline', color: Colors.roles.contractor },
  { label: 'Driver', phone: '9000000005', icon: 'car-outline', color: Colors.roles.driver },
  { label: 'Admin', phone: '9000000006', icon: 'shield-checkmark-outline', color: Colors.roles.admin },
];

const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
};

function SeedCard({
  item,
  index,
  isLoading,
  loadingPhone,
  onPress,
}: {
  item: SeedUser;
  index: number;
  isLoading: boolean;
  loadingPhone: string | null;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const isBusy = isLoading && loadingPhone === item.phone;

  return (
    <Animated.View
      entering={FadeInLeft.delay(440 + index * 60).springify().damping(18).stiffness(180)}
      style={animStyle}
    >
      <Pressable
        style={[
          styles.seedCard,
          { borderLeftColor: item.color, borderLeftWidth: 3 },
          isLoading && styles.seedCardDisabled,
        ]}
        onPress={onPress}
        disabled={isLoading}
        onPressIn={() => { scale.value = withSpring(0.96, SPRING_SNAPPY); }}
        onPressOut={() => { scale.value = withSpring(1, SPRING_SNAPPY); }}
      >
        {isBusy ? (
          <ActivityIndicator size="small" color={item.color} />
        ) : (
          <Ionicons name={item.icon} size={20} color={item.color} />
        )}
        <View style={styles.seedCardInfo}>
          <Text style={styles.seedCardLabel}>{item.label}</Text>
          <Text style={styles.seedCardPhone}>
            +91 {item.phone.slice(0, 5)} {item.phone.slice(5)}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color={T.textMuted} />
      </Pressable>
    </Animated.View>
  );
}

function ContinueButton({
  isValid,
  isLoading,
  loadingPhone,
  rawDigits,
  onPress,
}: {
  isValid: boolean;
  isLoading: boolean;
  loadingPhone: string | null;
  rawDigits: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(320).springify()}
      style={animStyle}
    >
      <Pressable
        style={[styles.continueBtn, (!isValid || isLoading) && styles.continueBtnDisabled]}
        onPress={onPress}
        disabled={!isValid || isLoading}
        onPressIn={() => { if (isValid && !isLoading) scale.value = withSpring(0.97, SPRING_SNAPPY); }}
        onPressOut={() => { scale.value = withSpring(1, SPRING_SNAPPY); }}
      >
        {isLoading && loadingPhone === rawDigits ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <View style={styles.continueBtnInner}>
            <Text style={styles.continueBtnText}>Continue</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [phone, setPhone] = useState('');
  const [loadingPhone, setLoadingPhone] = useState<string | null>(null);

  const rawDigits = phone.replace(/\D/g, '');
  const isValid = rawDigits.length === 10;

  const handlePhoneChange = (text: string) => {
    setPhone(formatPhone(text));
  };

  const doLogin = useCallback(
    async (phoneNumber: string) => {
      setLoadingPhone(phoneNumber);
      try {
        await login(phoneNumber);
        router.replace('/(app)/');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Login failed. Please try again.';
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: message,
          visibilityTime: 4000,
        });
      } finally {
        setLoadingPhone(null);
      }
    },
    [login, router]
  );

  const handleContinue = () => {
    if (!isValid) return;
    doLogin(rawDigits);
  };

  const handleSeedLogin = (seedPhone: string) => {
    if (isLoading) return;
    doLogin(seedPhone);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={T.surface} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header: Logo + Name */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Animated.View
                entering={ZoomIn.delay(0).springify().damping(14)}
                style={styles.logoCircle}
              >
                <Ionicons name="hammer" size={20} color={Colors.accent} />
              </Animated.View>
              <Animated.Text
                entering={FadeInDown.delay(120).springify()}
                style={styles.logoText}
              >
                BuildMart
              </Animated.Text>
            </View>
          </View>

          {/* Hero banner */}
          <Animated.View
            entering={FadeInDown.delay(80).springify().damping(18)}
            style={styles.heroBanner}
          >
            <Ionicons name="business" size={60} color="rgba(255,255,255,0.25)" />
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroHeadline}>Build Smarter.</Text>
              <Text style={styles.heroSubline}>Hyderabad's #1 construction marketplace</Text>
            </View>
            <View style={styles.heroLocationBadge}>
              <Ionicons name="location" size={13} color={Colors.accent} />
              <Text style={styles.heroLocationText}>Hyderabad, Telangana</Text>
            </View>
          </Animated.View>

          {/* Main content */}
          <View style={styles.content}>
            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <Text style={styles.welcomeTitle}>Welcome to BuildMart</Text>
              <Text style={styles.welcomeSubtitle}>
                Hyderabad's construction marketplace — materials, labor, and more.
              </Text>
            </Animated.View>

            {/* Phone Input */}
            <Animated.View entering={FadeInDown.delay(260).springify()}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.phoneRow}>
                <View style={styles.countryCode}>
                  <Text style={styles.flag}>🇮🇳</Text>
                  <Text style={styles.codeText}>+91</Text>
                </View>
                <View style={styles.phoneDivider} />
                <TextInput
                  style={styles.phoneInput}
                  placeholder="98765 43210"
                  placeholderTextColor={T.textMuted}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={handlePhoneChange}
                  maxLength={11}
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                  editable={!isLoading}
                />
              </View>
            </Animated.View>

            {/* Continue Button */}
            <ContinueButton
              isValid={isValid}
              isLoading={isLoading}
              loadingPhone={loadingPhone}
              rawDigits={rawDigits}
              onPress={handleContinue}
            />

            {/* Divider */}
            <Animated.View entering={FadeInDown.delay(380)}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>QUICK DEV LOGIN</Text>
                <View style={styles.dividerLine} />
              </View>
              <Text style={styles.devSubtitle}>Tap to sign in instantly as any role</Text>
            </Animated.View>

            {/* Seed Role Grid */}
            <View style={styles.seedGrid}>
              {SEED_USERS.map((item, index) => (
                <SeedCard
                  key={item.phone}
                  item={item}
                  index={index}
                  isLoading={isLoading}
                  loadingPhone={loadingPhone}
                  onPress={() => handleSeedLogin(item.phone)}
                />
              ))}
            </View>

            {/* Terms */}
            <Text style={styles.terms}>
              By continuing, you agree to BuildMart's{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: T.surface,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  heroBanner: {
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    padding: 24,
    marginBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
    overflow: 'hidden',
  },
  heroTextBlock: {
    position: 'absolute',
    left: 24,
    top: 24,
  },
  heroHeadline: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.3,
  },
  heroSubline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
    fontWeight: '500',
  },
  heroLocationBadge: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(242,150,13,0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  heroLocationText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent,
  },
  content: {
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 16,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flag: { fontSize: 20 },
  codeText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 17,
    color: Colors.textPrimary,
    fontWeight: '500',
    letterSpacing: 1,
  },
  continueBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    minHeight: 54,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  continueBtnDisabled: { opacity: 0.45 },
  continueBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  continueBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginHorizontal: 12,
  },
  devSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
  seedGrid: {
    gap: 8,
    marginBottom: 28,
  },
  seedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  seedCardDisabled: {
    opacity: 0.6,
  },
  seedCardInfo: {
    flex: 1,
  },
  seedCardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  seedCardPhone: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  terms: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  termsLink: {
    fontWeight: '700',
    color: Colors.textPrimary,
    textDecorationLine: 'underline',
  },
});
