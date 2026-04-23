import { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Animated as RNAnimated, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn, SlideInUp } from 'react-native-reanimated';

const C = {
  navy: '#1A1D2E',
  navyLight: '#252838',
  amber: '#F2960D',
  amberBg: '#FEF3C7',
  bg: '#F5F6FA',
  surface: '#FFFFFF',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  border: '#E5E7EB',
  text: '#1A1D2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  white: '#FFFFFF',
};

const TIMELINE_STEPS = [
  { key: 'placed', label: 'Order Placed', time: '23 Apr · 09:15 AM', icon: 'receipt-outline' as const },
  { key: 'confirmed', label: 'Confirmed', time: '23 Apr · 09:22 AM', icon: 'checkmark-circle-outline' as const },
  { key: 'processing', label: 'Processing', time: '23 Apr · 10:00 AM', icon: 'construct-outline' as const },
  { key: 'out', label: 'Out for Delivery', time: 'Expected by 2:00 PM', icon: 'bicycle-outline' as const },
  { key: 'delivered', label: 'Delivered', time: 'Pending', icon: 'home-outline' as const },
];

const CURRENT_STEP = 3; // 0-indexed, "Out for Delivery"

const DRIVER = {
  name: 'Ramesh Yadav',
  phone: '+91 98765 43210',
  vehicle: 'Tata Ace · TS 09 HH 4821',
  rating: 4.8,
  avatar: 'R',
  eta: '~22 min away',
};

// Map pin component (pure View-based)
function MapPin({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 3,
          borderColor: C.white,
          shadowColor: color,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.5,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <View
          style={{
            width: size * 0.35,
            height: size * 0.35,
            borderRadius: size * 0.175,
            backgroundColor: C.white,
          }}
        />
      </View>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 5,
          borderRightWidth: 5,
          borderTopWidth: 8,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          marginTop: -1,
        }}
      />
    </View>
  );
}

// Animated Map Placeholder
function MapPlaceholder() {
  const pulseAnim = useRef(new RNAnimated.Value(0.6)).current;
  const driverAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        RNAnimated.timing(pulseAnim, { toValue: 0.6, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(driverAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
        RNAnimated.timing(driverAnim, { toValue: 0, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const driverX = driverAnim.interpolate({ inputRange: [0, 1], outputRange: [80, 160] });
  const driverY = driverAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 60] });

  return (
    <View style={styles.mapPlaceholder}>
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={`h${i}`} style={[styles.gridLineH, { top: i * 44 }]} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <View key={`v${i}`} style={[styles.gridLineV, { left: i * 60 }]} />
      ))}

      {/* Route path (dashed line) */}
      <View style={styles.routePath} />

      {/* Pickup pin */}
      <View style={[styles.mapPinWrapper, { top: 80, left: 60 }]}>
        <MapPin color={C.amber} size={28} />
        <View style={styles.pinLabel}>
          <Text style={styles.pinLabelText}>Pickup</Text>
        </View>
      </View>

      {/* Drop pin */}
      <View style={[styles.mapPinWrapper, { top: 40, right: 50 }]}>
        <MapPin color={C.success} size={28} />
        <View style={styles.pinLabel}>
          <Text style={styles.pinLabelText}>You</Text>
        </View>
      </View>

      {/* Animated driver dot */}
      <RNAnimated.View
        style={[
          styles.driverDot,
          { transform: [{ translateX: driverX }, { translateY: driverY }] },
        ]}
      >
        <RNAnimated.View style={[styles.driverPulse, { opacity: pulseAnim }]} />
        <Ionicons name="bicycle" size={18} color={C.white} />
      </RNAnimated.View>

      {/* Map label */}
      <View style={styles.mapBadge}>
        <Ionicons name="navigate" size={12} color={C.white} />
        <Text style={styles.mapBadgeText}>Live Tracking</Text>
      </View>
    </View>
  );
}

// Animated progress line
function ProgressLine({ step }: { step: number }) {
  const progAnim = useRef(new RNAnimated.Value(0)).current;
  const totalSteps = TIMELINE_STEPS.length - 1;
  const progress = step / totalSteps;

  useEffect(() => {
    RNAnimated.timing(progAnim, {
      toValue: progress,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [step]);

  return (
    <View style={styles.progressBarTrack}>
      <RNAnimated.View
        style={[
          styles.progressBarFill,
          {
            width: progAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const orderNumber = orderId || 'ORD-2024-0041';

  function callDriver() {
    Linking.openURL(`tel:${DRIVER.phone.replace(/\s/g, '')}`);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(350)} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Track Order</Text>
        <Pressable style={styles.backBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color={C.text} />
        </Pressable>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Order Number */}
        <Animated.View entering={FadeInDown.delay(60).duration(350)} style={styles.orderBadgeRow}>
          <Ionicons name="cube-outline" size={15} color={C.navy} />
          <Text style={styles.orderNumberText}>{orderNumber}</Text>
          <View style={styles.liveChip}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </Animated.View>

        {/* Map Placeholder */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.mapWrapper}>
          <MapPlaceholder />
        </Animated.View>

        {/* ETA Banner */}
        <Animated.View entering={FadeInDown.delay(160).duration(350)} style={styles.etaBanner}>
          <View style={styles.etaIconBox}>
            <Ionicons name="time" size={20} color={C.amber} />
          </View>
          <View style={styles.etaTextCol}>
            <Text style={styles.etaTitle}>Estimated Delivery</Text>
            <Text style={styles.etaTime}>Today by 2:00 PM · {DRIVER.eta}</Text>
          </View>
          <View style={styles.etaStepBadge}>
            <Text style={styles.etaStepText}>{CURRENT_STEP + 1}/{TIMELINE_STEPS.length}</Text>
          </View>
        </Animated.View>

        {/* Progress Line */}
        <Animated.View entering={FadeInDown.delay(200).duration(350)} style={styles.progressSection}>
          <ProgressLine step={CURRENT_STEP} />
        </Animated.View>

        {/* Timeline */}
        <Animated.View entering={FadeInDown.delay(240).duration(380)} style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          {TIMELINE_STEPS.map((step, i) => {
            const isDone = i < CURRENT_STEP;
            const isActive = i === CURRENT_STEP;
            const isPending = i > CURRENT_STEP;

            return (
              <View key={step.key} style={styles.timelineRow}>
                {/* Line */}
                <View style={styles.timelineLineCol}>
                  <View
                    style={[
                      styles.timelineDot,
                      isDone && styles.timelineDotDone,
                      isActive && styles.timelineDotActive,
                      isPending && styles.timelineDotPending,
                    ]}
                  >
                    {isDone && <Ionicons name="checkmark" size={12} color={C.white} />}
                    {isActive && <View style={styles.timelineDotInner} />}
                  </View>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <View style={[styles.timelineConnector, isDone && styles.timelineConnectorDone]} />
                  )}
                </View>
                {/* Content */}
                <View style={styles.timelineContent}>
                  <View style={styles.timelineIconBox}>
                    <Ionicons
                      name={step.icon}
                      size={16}
                      color={isPending ? C.textMuted : isActive ? C.amber : C.success}
                    />
                  </View>
                  <View style={styles.timelineTextCol}>
                    <Text
                      style={[
                        styles.timelineLabel,
                        isPending && styles.timelineLabelPending,
                        isActive && styles.timelineLabelActive,
                      ]}
                    >
                      {step.label}
                    </Text>
                    <Text style={[styles.timelineTime, isPending && styles.timelineTimePending]}>
                      {step.time}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </Animated.View>

        {/* Driver Card */}
        <Animated.View entering={FadeInDown.delay(310).duration(380)} style={styles.driverCard}>
          <Text style={styles.sectionTitle}>Your Driver</Text>
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverAvatarText}>{DRIVER.avatar}</Text>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{DRIVER.name}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={13} color={C.amber} />
                <Text style={styles.ratingText}>{DRIVER.rating}</Text>
              </View>
              <Text style={styles.vehicleText}>{DRIVER.vehicle}</Text>
            </View>
            <View style={styles.driverActions}>
              <Pressable
                style={({ pressed }) => [styles.driverActionBtn, pressed && styles.btnPressed]}
                onPress={callDriver}
              >
                <Ionicons name="call" size={18} color={C.white} />
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.driverActionBtnOutline, pressed && styles.btnPressed]}
                onPress={() => router.push('/chat')}
              >
                <Ionicons name="chatbubble-ellipses" size={18} color={C.navy} />
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(380).duration(350)} style={styles.actionRow}>
          <Pressable
            style={({ pressed }) => [styles.callBtn, pressed && styles.btnPressed]}
            onPress={callDriver}
          >
            <Ionicons name="call-outline" size={18} color={C.white} />
            <Text style={styles.callBtnText}>Call Driver</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.chatBtn, pressed && styles.btnPressed]}
            onPress={() => router.push('/chat')}
          >
            <Ionicons name="chatbubble-outline" size={18} color={C.navy} />
            <Text style={styles.chatBtnText}>Chat with Driver</Text>
          </Pressable>
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
  orderBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },
  orderNumberText: { fontSize: 14, fontWeight: '700', color: C.navy, flex: 1 },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.error + '18',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.error },
  liveText: { fontSize: 10, fontWeight: '800', color: C.error, letterSpacing: 0.5 },
  mapWrapper: { marginHorizontal: 20, marginVertical: 10, borderRadius: 16, overflow: 'hidden' },
  mapPlaceholder: {
    height: 220,
    backgroundColor: C.navy,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  routePath: {
    position: 'absolute',
    top: 95,
    left: 80,
    right: 80,
    height: 2,
    backgroundColor: C.amber + '80',
    borderRadius: 1,
  },
  mapPinWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinLabel: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  pinLabelText: { fontSize: 10, color: C.white, fontWeight: '600' },
  driverDot: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.amber,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: C.white,
  },
  driverPulse: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: C.amber + '40',
  },
  mapBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  mapBadgeText: { fontSize: 11, color: C.white, fontWeight: '600' },
  etaBanner: {
    marginHorizontal: 20,
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  etaIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: C.amberBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaTextCol: { flex: 1 },
  etaTitle: { fontSize: 12, color: C.textSecondary, fontWeight: '500' },
  etaTime: { fontSize: 15, fontWeight: '700', color: C.text, marginTop: 2 },
  etaStepBadge: {
    backgroundColor: C.navy + '12',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  etaStepText: { fontSize: 12, fontWeight: '700', color: C.navy },
  progressSection: { marginHorizontal: 20, marginTop: 14 },
  progressBarTrack: {
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: C.amber,
    borderRadius: 2,
  },
  timelineCard: {
    marginHorizontal: 20,
    marginTop: 14,
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 16 },
  timelineRow: { flexDirection: 'row', marginBottom: 4 },
  timelineLineCol: { alignItems: 'center', width: 24, marginRight: 12 },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotDone: { backgroundColor: C.success },
  timelineDotActive: { backgroundColor: C.amber, borderWidth: 2, borderColor: C.amberBg },
  timelineDotPending: { backgroundColor: C.border },
  timelineDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.white },
  timelineConnector: {
    flex: 1,
    width: 2,
    backgroundColor: C.border,
    minHeight: 20,
    marginVertical: 2,
  },
  timelineConnectorDone: { backgroundColor: C.success },
  timelineContent: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingBottom: 14 },
  timelineIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineTextCol: { flex: 1 },
  timelineLabel: { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 2 },
  timelineLabelActive: { color: C.amber, fontWeight: '700' },
  timelineLabelPending: { color: C.textMuted },
  timelineTime: { fontSize: 12, color: C.textSecondary },
  timelineTimePending: { color: C.textMuted },
  driverCard: {
    marginHorizontal: 20,
    marginTop: 14,
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  driverAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarText: { fontSize: 20, fontWeight: '800', color: C.white },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 3 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 3 },
  ratingText: { fontSize: 13, fontWeight: '600', color: C.text },
  vehicleText: { fontSize: 12, color: C.textSecondary },
  driverActions: { flexDirection: 'row', gap: 8 },
  driverActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverActionBtnOutline: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 16,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.success,
    paddingVertical: 14,
    borderRadius: 12,
  },
  callBtnText: { fontSize: 15, fontWeight: '700', color: C.white },
  chatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.surface,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.navy,
  },
  chatBtnText: { fontSize: 15, fontWeight: '700', color: C.navy },
  btnPressed: { opacity: 0.75 },
});
