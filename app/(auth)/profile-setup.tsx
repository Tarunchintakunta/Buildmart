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

const STEPS = ['Basic Information', 'Address Details', 'Preferences'];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { phone, role } = useLocalSearchParams<{ phone?: string; role?: string }>();
  const { login } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const currentStep = 0;

  const isValid = fullName.trim().length >= 2 && email.includes('@');

  const handleContinue = async () => {
    if (!isValid) {
      Alert.alert('Incomplete', 'Please fill in your name and a valid email.');
      return;
    }

    setIsLoading(true);
    try {
      if (phone) {
        const result = await login(phone);
        if (!result.success) {
          Alert.alert('Login Failed', result.error ?? 'Unknown error');
          return;
        }
      }
      // Auth redirect in root layout handles navigation to (app)
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
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
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={T.text} />
            </TouchableOpacity>
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <Ionicons name="cart" size={14} color={T.white} />
              </View>
              <Text style={styles.logoText}>BuildMart</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          {/* Step Indicator */}
          <View style={styles.stepSection}>
            <Text style={styles.stepLabel}>
              Step {currentStep + 1} of {STEPS.length}
            </Text>
            <View style={styles.stepBar}>
              {STEPS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.stepDot,
                    i <= currentStep ? styles.stepDotActive : null,
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.body}>
            {/* Icon */}
            <View style={styles.iconCircle}>
              <Ionicons name="person" size={28} color={T.white} />
            </View>

            {/* Title */}
            <Text style={styles.title}>Basic Information</Text>
            <Text style={styles.subtitle}>
              Let's set up your profile so contractors and suppliers can identify you.
            </Text>

            {/* Photo Upload */}
            <TouchableOpacity style={styles.photoUpload} activeOpacity={0.7}>
              <View style={styles.photoCircle}>
                <Ionicons name="camera" size={28} color={T.textMuted} />
              </View>
              <Text style={styles.photoLabel}>Upload Photo</Text>
              <Text style={styles.photoHint}>PNG or JPG, up to 10MB</Text>
            </TouchableOpacity>

            {/* Full Name */}
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputIcon}>
                <Ionicons name="person-outline" size={18} color={T.textMuted} />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputIcon}>
                <Ionicons name="mail-outline" size={18} color={T.textMuted} />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Role Badge */}
            {role && (
              <View style={styles.roleBadge}>
                <Ionicons name="shield-checkmark" size={14} color={T.amber} />
                <Text style={styles.roleBadgeText}>
                  Registering as{' '}
                  <Text style={styles.roleBadgeBold}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.continueButton, !isValid && styles.continueButtonDisabled]}
              onPress={handleContinue}
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={T.white} />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.continueText}>Continue to Dashboard</Text>
                  <Ionicons name="arrow-forward" size={18} color={T.white} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handleContinue}>
              <Text style={styles.skipText}>Skip for Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  logoRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: T.amber,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  logoText: {
    fontSize: 17,
    fontWeight: '800' as const,
    color: T.text,
  },
  stepSection: {
    alignItems: 'center' as const,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.textMuted,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  stepBar: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  stepDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    maxWidth: 80,
  },
  stepDotActive: {
    backgroundColor: T.amber,
  },
  body: {
    flex: 1,
    alignItems: 'center' as const,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: T.navy,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: T.text,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: 14,
    color: T.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 21,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  photoUpload: {
    alignItems: 'center' as const,
    marginBottom: 28,
  },
  photoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 10,
  },
  photoLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.text,
    marginBottom: 2,
  },
  photoHint: {
    fontSize: 11,
    color: T.textMuted,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.text,
    alignSelf: 'flex-start' as const,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: T.border,
    paddingHorizontal: 14,
    height: 52,
    width: '100%' as const,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: T.text,
    fontWeight: '500' as const,
  },
  roleBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.amberBg,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
    marginTop: 4,
  },
  roleBadgeText: {
    fontSize: 12,
    color: T.text,
  },
  roleBadgeBold: {
    fontWeight: '700' as const,
  },
  actionSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
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
  continueButtonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  continueText: {
    color: T.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  skipButton: {
    alignItems: 'center' as const,
    marginTop: 14,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    color: T.textSecondary,
    fontWeight: '500' as const,
  },
};
