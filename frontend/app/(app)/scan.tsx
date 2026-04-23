import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Animated as RNAnimated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn, FadeIn } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const FRAME_SIZE = SCREEN_WIDTH * 0.65;

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

type ScanState = 'idle' | 'scanning' | 'success' | 'error';

const MOCK_SCANNED_ORDER = {
  orderNumber: 'ORD-2024-0041',
  customer: 'Rajesh Kumar',
  items: '5 bags cement, 2 TMT rods',
  payout: 200,
};

function CornerBracket({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const isTop = pos === 'tl' || pos === 'tr';
  const isLeft = pos === 'tl' || pos === 'bl';
  return (
    <View
      style={[
        styles.cornerBracket,
        isTop ? { top: 0 } : { bottom: 0 },
        isLeft ? { left: 0 } : { right: 0 },
        !isLeft && { transform: [{ scaleX: -1 }] },
        !isTop && { transform: [{ scaleY: -1 }] },
        !isLeft && !isTop && { transform: [{ scaleX: -1 }, { scaleY: -1 }] },
      ]}
    >
      <View style={[styles.cornerH, { backgroundColor: C.amber }]} />
      <View style={[styles.cornerV, { backgroundColor: C.amber }]} />
    </View>
  );
}

export default function ScanScreen() {
  const router = useRouter();
  const [scanState, setScanState] = useState<ScanState>('idle');
  const scanLineAnim = useRef(new RNAnimated.Value(0)).current;
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    if (scanState === 'scanning' || scanState === 'idle') {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(scanLineAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
          RNAnimated.timing(scanLineAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
        ])
      ).start();
    }

    if (scanState === 'scanning') {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
          RNAnimated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [scanState]);

  function handleSimulateScan() {
    setScanState('scanning');
    setTimeout(() => setScanState('success'), 2000);
  }

  function handleReset() {
    setScanState('idle');
    scanLineAnim.setValue(0);
  }

  const scanLineY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME_SIZE - 4],
  });

  const isSuccess = scanState === 'success';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={C.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <Pressable style={styles.backBtn}>
          <Ionicons name="flash-off-outline" size={20} color={C.white} />
        </Pressable>
      </View>

      {/* Dark camera area */}
      <View style={styles.cameraArea}>
        {/* Dark overlay top */}
        <View style={styles.overlayTop} />

        {/* Middle row: overlay left + frame + overlay right */}
        <View style={styles.middleRow}>
          <View style={styles.overlaySide} />

          {/* Scan Frame */}
          <RNAnimated.View
            style={[
              styles.scanFrame,
              { transform: [{ scale: scanState === 'scanning' ? pulseAnim : 1 }] },
              isSuccess && styles.scanFrameSuccess,
            ]}
          >
            <CornerBracket pos="tl" />
            <CornerBracket pos="tr" />
            <CornerBracket pos="bl" />
            <CornerBracket pos="br" />

            {/* Scan Line */}
            {!isSuccess && (
              <RNAnimated.View
                style={[
                  styles.scanLine,
                  { transform: [{ translateY: scanLineY }] },
                ]}
              />
            )}

            {/* Success overlay */}
            {isSuccess && (
              <Animated.View entering={ZoomIn.duration(400)} style={styles.successOverlay}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark" size={40} color={C.white} />
                </View>
              </Animated.View>
            )}

            {/* QR grid dots (decorative) */}
            {!isSuccess && (
              <View style={styles.qrDecoGrid}>
                {Array(5).fill(0).map((_, r) =>
                  Array(5).fill(0).map((__, c) => (
                    <View
                      key={`${r}-${c}`}
                      style={[
                        styles.qrDot,
                        {
                          opacity: Math.random() > 0.4 ? 0.15 : 0.05,
                        },
                      ]}
                    />
                  ))
                )}
              </View>
            )}
          </RNAnimated.View>

          <View style={styles.overlaySide} />
        </View>

        {/* Dark overlay bottom */}
        <View style={styles.overlayBottom}>
          {/* Instruction */}
          {!isSuccess && (
            <Animated.View entering={FadeIn.duration(500)} style={styles.instructionBox}>
              <Text style={styles.instructionText}>
                {scanState === 'scanning'
                  ? 'Scanning...'
                  : 'Position the QR code inside the frame'}
              </Text>
              {scanState === 'idle' && (
                <Text style={styles.instructionSub}>The QR code will be scanned automatically</Text>
              )}
            </Animated.View>
          )}

          {/* Success Result */}
          {isSuccess && (
            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.resultSuccessBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={C.success} />
                  <Text style={styles.resultSuccessText}>Scan Successful</Text>
                </View>
              </View>
              <Text style={styles.resultOrderNo}>{MOCK_SCANNED_ORDER.orderNumber}</Text>
              <Text style={styles.resultCustomer}>{MOCK_SCANNED_ORDER.customer}</Text>
              <Text style={styles.resultItems}>{MOCK_SCANNED_ORDER.items}</Text>
              <View style={styles.resultPayoutRow}>
                <Text style={styles.resultPayoutLabel}>Payout</Text>
                <Text style={styles.resultPayout}>₹{MOCK_SCANNED_ORDER.payout}</Text>
              </View>
              <View style={styles.resultActions}>
                <Pressable
                  style={({ pressed }) => [styles.resultBtnSecondary, pressed && styles.btnPressed]}
                  onPress={handleReset}
                >
                  <Text style={styles.resultBtnSecondaryText}>Rescan</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.resultBtnPrimary, pressed && styles.btnPressed]}
                  onPress={() => router.push('/delivery-proof')}
                >
                  <Text style={styles.resultBtnPrimaryText}>Continue to Delivery</Text>
                </Pressable>
              </View>
            </Animated.View>
          )}

          {/* Simulate Button */}
          {!isSuccess && (
            <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.simulateBtnWrapper}>
              <Pressable
                style={({ pressed }) => [
                  styles.simulateBtn,
                  scanState === 'scanning' && styles.simulateBtnDisabled,
                  pressed && styles.btnPressed,
                ]}
                onPress={handleSimulateScan}
                disabled={scanState === 'scanning'}
              >
                <Ionicons name="qr-code" size={18} color={C.navy} />
                <Text style={styles.simulateBtnText}>
                  {scanState === 'scanning' ? 'Scanning...' : 'Simulate Scan'}
                </Text>
              </Pressable>
              <Text style={styles.simulateNote}>
                Demo mode — tap to simulate a successful QR scan
              </Text>
            </Animated.View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  backBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: C.white },
  cameraArea: { flex: 1, backgroundColor: '#0A0A0A' },
  overlayTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  overlayBottom: {
    flex: 1.4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
    gap: 16,
  },
  middleRow: { flexDirection: 'row', height: FRAME_SIZE },
  overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  scanFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    position: 'relative',
    overflow: 'hidden',
  },
  scanFrameSuccess: {},
  cornerBracket: {
    position: 'absolute',
    width: 28,
    height: 28,
  },
  cornerH: { position: 'absolute', top: 0, left: 0, width: 28, height: 4, borderRadius: 2 },
  cornerV: { position: 'absolute', top: 0, left: 0, width: 4, height: 28, borderRadius: 2 },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: C.amber,
    shadowColor: C.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16,185,129,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  qrDecoGrid: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
    alignContent: 'center',
    justifyContent: 'center',
  },
  qrDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: C.white,
    margin: 10,
  },
  instructionBox: { alignItems: 'center', gap: 6 },
  instructionText: { fontSize: 16, fontWeight: '600', color: C.white, textAlign: 'center' },
  instructionSub: { fontSize: 13, color: 'rgba(255,255,255,0.55)', textAlign: 'center' },
  resultCard: {
    backgroundColor: C.surface,
    borderRadius: 20,
    padding: 18,
    width: '100%',
  },
  resultHeader: { marginBottom: 10 },
  resultSuccessBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resultSuccessText: { fontSize: 13, fontWeight: '700', color: C.success },
  resultOrderNo: { fontSize: 18, fontWeight: '800', color: C.text, marginBottom: 4 },
  resultCustomer: { fontSize: 14, color: C.textSecondary, marginBottom: 4 },
  resultItems: { fontSize: 13, color: C.textMuted, marginBottom: 12 },
  resultPayoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 10,
    marginBottom: 14,
  },
  resultPayoutLabel: { fontSize: 13, color: C.textSecondary, fontWeight: '500' },
  resultPayout: { fontSize: 20, fontWeight: '800', color: C.navy },
  resultActions: { flexDirection: 'row', gap: 10 },
  resultBtnSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  resultBtnSecondaryText: { fontSize: 14, fontWeight: '600', color: C.text },
  resultBtnPrimary: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: C.navy,
    alignItems: 'center',
  },
  resultBtnPrimaryText: { fontSize: 14, fontWeight: '700', color: C.white },
  simulateBtnWrapper: { alignItems: 'center', gap: 10, width: '100%' },
  simulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.amber,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    justifyContent: 'center',
  },
  simulateBtnDisabled: { opacity: 0.5 },
  simulateBtnText: { fontSize: 15, fontWeight: '700', color: C.navy },
  simulateNote: { fontSize: 12, color: 'rgba(255,255,255,0.45)', textAlign: 'center' },
  btnPressed: { opacity: 0.75 },
});
