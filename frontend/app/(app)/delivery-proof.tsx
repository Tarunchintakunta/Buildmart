import { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn, FadeIn } from 'react-native-reanimated';

const C = {
  navy: '#1A1D2E',
  amber: '#F2960D',
  amberBg: '#FEF3C7',
  bg: '#F5F6FA',
  surface: '#FFFFFF',
  success: '#10B981',
  error: '#EF4444',
  border: '#E5E7EB',
  text: '#1A1D2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  white: '#FFFFFF',
};

const ORDER_INFO = {
  orderNumber: 'ORD-2024-0041',
  customer: 'Rajesh Kumar',
  phone: '+91 98765 12345',
  address: '45/A, 3rd Cross, Kondapur, Hyderabad - 500084',
  items: '5 bags cement, 2 TMT rods (12mm × 5)',
};

const OTP_LENGTH = 6;

const inputRefs: TextInput[] = [];

export default function DeliveryProofScreen() {
  const router = useRouter();
  const [photoTaken, setPhotoTaken] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const otpInputs = useRef<(TextInput | null)[]>([]);

  const isOtpComplete = otpDigits.every((d) => d.length === 1);
  const canSubmit = photoTaken && isOtpComplete;

  function handleOtpChange(text: string, idx: number) {
    const sanitized = text.replace(/[^0-9]/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[idx] = sanitized;
    setOtpDigits(updated);
    if (sanitized && idx < OTP_LENGTH - 1) {
      otpInputs.current[idx + 1]?.focus();
    }
  }

  function handleOtpKeyPress(key: string, idx: number) {
    if (key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      otpInputs.current[idx - 1]?.focus();
    }
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Animated.View entering={ZoomIn.duration(500)} style={styles.successScreen}>
          <View style={styles.successIconOuter}>
            <View style={styles.successIconInner}>
              <Ionicons name="checkmark-done" size={48} color={C.white} />
            </View>
          </View>
          <Text style={styles.successTitle}>Delivery Complete!</Text>
          <Text style={styles.successSubtitle}>
            Order {ORDER_INFO.orderNumber} has been successfully delivered to {ORDER_INFO.customer}.
          </Text>
          <View style={styles.successPayoutBox}>
            <Text style={styles.successPayoutLabel}>Payout Added to Wallet</Text>
            <Text style={styles.successPayoutAmount}>+₹200</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.successBtn, pressed && styles.btnPressed]}
            onPress={() => router.back()}
          >
            <Text style={styles.successBtnText}>Back to Deliveries</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(350)} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Delivery Proof</Text>
        <View style={styles.backBtn} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Order Summary */}
        <Animated.View entering={FadeInDown.delay(60).duration(350)} style={styles.orderCard}>
          <View style={styles.orderCardHeader}>
            <View style={styles.orderIconBox}>
              <Ionicons name="cube" size={20} color={C.navy} />
            </View>
            <View style={styles.orderCardInfo}>
              <Text style={styles.orderNumber}>{ORDER_INFO.orderNumber}</Text>
              <Text style={styles.orderCustomer}>{ORDER_INFO.customer}</Text>
            </View>
            <Pressable style={styles.callBtn}>
              <Ionicons name="call" size={16} color={C.success} />
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.orderDetailRow}>
            <Ionicons name="location-outline" size={15} color={C.textMuted} />
            <Text style={styles.orderDetailText}>{ORDER_INFO.address}</Text>
          </View>
          <View style={styles.orderDetailRow}>
            <Ionicons name="layers-outline" size={15} color={C.textMuted} />
            <Text style={styles.orderDetailText}>{ORDER_INFO.items}</Text>
          </View>
        </Animated.View>

        {/* Photo Upload */}
        <Animated.View entering={FadeInDown.delay(120).duration(370)} style={styles.section}>
          <Text style={styles.sectionTitle}>
            Delivery Photo <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.sectionSubtitle}>Take a clear photo showing the delivered items</Text>

          <Pressable
            style={({ pressed }) => [
              styles.photoArea,
              photoTaken && styles.photoAreaDone,
              pressed && styles.btnPressed,
            ]}
            onPress={() => setPhotoTaken(true)}
          >
            {photoTaken ? (
              <Animated.View entering={ZoomIn.duration(300)} style={styles.photoSuccess}>
                <View style={styles.photoSuccessIcon}>
                  <Ionicons name="checkmark-circle" size={40} color={C.success} />
                </View>
                <Text style={styles.photoSuccessText}>Photo Captured</Text>
                <Text style={styles.photoRetakeText}>Tap to retake</Text>
              </Animated.View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <View style={styles.cameraIconBox}>
                  <Ionicons name="camera" size={36} color={C.textSecondary} />
                </View>
                <Text style={styles.photoPlaceholderText}>Tap to take photo</Text>
                <Text style={styles.photoPlaceholderSub}>or upload from gallery</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>

        {/* OTP Verification */}
        <Animated.View entering={FadeInDown.delay(180).duration(370)} style={styles.section}>
          <Text style={styles.sectionTitle}>
            Customer OTP <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.sectionSubtitle}>
            Ask the customer for their 6-digit delivery OTP to confirm receipt
          </Text>

          <View style={styles.otpRow}>
            {otpDigits.map((digit, i) => (
              <TextInput
                key={i}
                ref={(el) => { otpInputs.current[i] = el; }}
                style={[styles.otpBox, digit.length === 1 && styles.otpBoxFilled]}
                value={digit}
                onChangeText={(t) => handleOtpChange(t, i)}
                onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, i)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </View>

          {isOtpComplete && (
            <Animated.View entering={FadeIn.duration(250)} style={styles.otpVerifiedRow}>
              <Ionicons name="checkmark-circle" size={16} color={C.success} />
              <Text style={styles.otpVerifiedText}>OTP Verified</Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Notes */}
        <Animated.View entering={FadeInDown.delay(240).duration(370)} style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Notes</Text>
          <Text style={styles.sectionSubtitle}>Optional — add any special remarks</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="e.g. Left with security, customer not available..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            placeholderTextColor={C.textMuted}
          />
        </Animated.View>

        {/* Requirements checklist */}
        <Animated.View entering={FadeInDown.delay(290).duration(350)} style={styles.checklistCard}>
          {[
            { label: 'Delivery photo taken', done: photoTaken },
            { label: 'Customer OTP entered (6 digits)', done: isOtpComplete },
          ].map((item) => (
            <View key={item.label} style={styles.checklistRow}>
              <Ionicons
                name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
                size={18}
                color={item.done ? C.success : C.textMuted}
              />
              <Text style={[styles.checklistText, item.done && styles.checklistTextDone]}>{item.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Submit Button */}
        <Animated.View entering={FadeInDown.delay(340).duration(350)} style={styles.submitWrapper}>
          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              !canSubmit && styles.submitBtnDisabled,
              pressed && canSubmit && styles.btnPressed,
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit || submitting}
          >
            {submitting ? (
              <Text style={styles.submitBtnText}>Processing...</Text>
            ) : (
              <>
                <Ionicons name="checkmark-done-circle" size={20} color={C.white} />
                <Text style={styles.submitBtnText}>Mark as Delivered</Text>
              </>
            )}
          </Pressable>
          {!canSubmit && (
            <Text style={styles.submitHint}>Complete the required fields above to continue</Text>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: C.text },
  orderCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  orderCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  orderIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.navy + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderCardInfo: { flex: 1 },
  orderNumber: { fontSize: 14, fontWeight: '700', color: C.text },
  orderCustomer: { fontSize: 12, color: C.textSecondary, marginTop: 2 },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.success + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: C.border, marginBottom: 12 },
  orderDetailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  orderDetailText: { fontSize: 13, color: C.textSecondary, flex: 1, lineHeight: 18 },
  section: { marginHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 4 },
  required: { color: C.error },
  sectionSubtitle: { fontSize: 12, color: C.textSecondary, marginBottom: 14 },
  photoArea: {
    height: 160,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: C.border,
    borderStyle: 'dashed',
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoAreaDone: { borderColor: C.success, borderStyle: 'solid', backgroundColor: C.success + '08' },
  photoPlaceholder: { alignItems: 'center', gap: 8 },
  cameraIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: { fontSize: 15, fontWeight: '600', color: C.textSecondary },
  photoPlaceholderSub: { fontSize: 12, color: C.textMuted },
  photoSuccess: { alignItems: 'center', gap: 6 },
  photoSuccessIcon: {},
  photoSuccessText: { fontSize: 16, fontWeight: '700', color: C.success },
  photoRetakeText: { fontSize: 12, color: C.textMuted },
  otpRow: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.surface,
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
    textAlign: 'center',
  },
  otpBoxFilled: { borderColor: C.navy, backgroundColor: C.navy + '08' },
  otpVerifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10, justifyContent: 'center' },
  otpVerifiedText: { fontSize: 13, fontWeight: '600', color: C.success },
  notesInput: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    padding: 14,
    fontSize: 14,
    color: C.text,
    minHeight: 90,
  },
  checklistCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  checklistRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checklistText: { fontSize: 14, color: C.textMuted, fontWeight: '500' },
  checklistTextDone: { color: C.text },
  submitWrapper: { marginHorizontal: 20, marginTop: 20 },
  submitBtn: {
    backgroundColor: C.success,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: C.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: { backgroundColor: C.textMuted, shadowOpacity: 0 },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: C.white },
  submitHint: { fontSize: 12, color: C.textMuted, textAlign: 'center', marginTop: 10 },
  btnPressed: { opacity: 0.8 },
  // Success screen
  successScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: C.bg,
  },
  successIconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: C.success + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: C.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: { fontSize: 26, fontWeight: '800', color: C.text, marginBottom: 10, letterSpacing: -0.5 },
  successSubtitle: { fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  successPayoutBox: {
    backgroundColor: C.success + '12',
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  successPayoutLabel: { fontSize: 12, color: C.textSecondary, fontWeight: '500' },
  successPayoutAmount: { fontSize: 28, fontWeight: '800', color: C.success, marginTop: 4 },
  successBtn: {
    backgroundColor: C.navy,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
  },
  successBtnText: { fontSize: 16, fontWeight: '700', color: C.white },
});
