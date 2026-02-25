import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;
const OTP_LENGTH = 6;

export default function VerifyScreen() {
  const router = useRouter();
  const { phone, role } = useLocalSearchParams<{ phone: string; role: string }>();
  const { sendOTP } = useAuth();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(54);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formattedPhone = phone
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
    : '+91 XXXXX XXXXX';

  const handleChange = useCallback(
    (text: string, index: number) => {
      // Only accept digits
      const digit = text.replace(/\D/g, '').slice(-1);

      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      // Auto-advance to next input
      if (digit && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when complete
      if (digit && index === OTP_LENGTH - 1) {
        const code = newOtp.join('');
        if (code.length === OTP_LENGTH) {
          Keyboard.dismiss();
          handleVerify(code);
        }
      }
    },
    [otp],
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === 'Backspace' && !otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handleVerify = async (code?: string) => {
    const otpCode = code ?? otp.join('');
    if (otpCode.length < OTP_LENGTH) {
      Alert.alert('Incomplete Code', 'Please enter the full 6-digit code');
      return;
    }
    setIsVerifying(true);

    // Simulate verification delay — actual auth happens on permissions screen
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (otpCode === '123456') {
      router.replace({
        pathname: '/(auth)/permissions',
        params: { phone: phone ?? '', role: role ?? 'customer' },
      });
    } else {
      Alert.alert('Verification Failed', 'Invalid OTP. Use 123456 for demo.');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }

    setIsVerifying(false);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await sendOTP(phone ?? '');
      setResendTimer(60);
      Alert.alert('OTP Sent', 'A new verification code has been sent.');
    } catch {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.surface }}>
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

      <View style={styles.body}>
        {/* Phone Icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="phone-portrait" size={28} color={T.white} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Verify Phone Number</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit verification code to
        </Text>
        <Text style={styles.phoneNumber}>{formattedPhone}</Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[
                styles.otpBox,
                digit ? styles.otpBoxFilled : null,
                index === otp.findIndex((d) => !d) ? styles.otpBoxActive : null,
              ]}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              textContentType="oneTimeCode"
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            otp.join('').length < OTP_LENGTH && styles.verifyButtonDisabled,
          ]}
          onPress={() => handleVerify()}
          disabled={isVerifying || otp.join('').length < OTP_LENGTH}
        >
          {isVerifying ? (
            <ActivityIndicator size="small" color={T.white} />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.verifyButtonText}>Verify & Continue</Text>
              <Ionicons name="arrow-forward" size={18} color={T.white} />
            </View>
          )}
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendSection}>
          <Text style={styles.resendLabel}>
            Didn't receive the code?{' '}
            <Text
              style={[
                styles.resendLink,
                resendTimer > 0 && styles.resendLinkDisabled,
              ]}
              onPress={handleResend}
            >
              Resend OTP
            </Text>
          </Text>
          {resendTimer > 0 && (
            <Text style={styles.timerText}>
              Resend available in {formatTime(resendTimer)}
            </Text>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to BuildMart's{' '}
          <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </Text>
      </View>
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
  body: {
    flex: 1,
    alignItems: 'center' as const,
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: T.navy,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 24,
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
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: 14,
    color: T.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 20,
  },
  phoneNumber: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
    marginTop: 4,
    marginBottom: 32,
  },
  otpRow: {
    flexDirection: 'row' as const,
    gap: 10,
    marginBottom: 32,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: T.surface,
    textAlign: 'center' as const,
    fontSize: 22,
    fontWeight: '700' as const,
    color: T.text,
  },
  otpBoxFilled: {
    borderColor: T.navy,
    backgroundColor: '#F8F9FB',
  },
  otpBoxActive: {
    borderColor: T.amber,
    shadowColor: T.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  verifyButton: {
    backgroundColor: T.navy,
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%' as const,
    alignItems: 'center' as const,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  verifyButtonText: {
    color: T.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  resendSection: {
    alignItems: 'center' as const,
    marginTop: 24,
    gap: 6,
  },
  resendLabel: {
    fontSize: 13,
    color: T.textSecondary,
  },
  resendLink: {
    fontWeight: '700' as const,
    color: T.text,
  },
  resendLinkDisabled: {
    color: T.textMuted,
  },
  timerText: {
    fontSize: 12,
    color: T.textMuted,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 24,
    alignItems: 'center' as const,
  },
  footerText: {
    fontSize: 11,
    color: T.textMuted,
    textAlign: 'center' as const,
    lineHeight: 16,
  },
  footerLink: {
    color: T.info,
    textDecorationLine: 'underline' as const,
  },
};
