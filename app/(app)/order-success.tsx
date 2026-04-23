import { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Colors from '../../src/theme/colors';

// ─── Sparkle Component ────────────────────────────────────────────────────────

function Sparkle({
  delay,
  x,
  y,
  icon,
  color,
  size,
}: {
  delay: number;
  x: number;
  y: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
}) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withSequence(withTiming(1, { duration: 400 }), withDelay(600, withTiming(0, { duration: 400 })))
    );
    scale.value = withDelay(
      delay,
      withSequence(withSpring(1, { damping: 8, stiffness: 200 }), withDelay(600, withTiming(0.5, { duration: 400 })))
    );
    translateY.value = withDelay(delay, withTiming(-40, { duration: 1000, easing: Easing.out(Easing.quad) }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.sparkle, { left: x, top: y }, animStyle]}>
      <Ionicons name={icon} size={size} color={color} />
    </Animated.View>
  );
}

// ─── Big Checkmark ────────────────────────────────────────────────────────────

function AnimatedCheckmark() {
  const scale = useSharedValue(0);
  const outerScale = useSharedValue(0);

  useEffect(() => {
    outerScale.value = withSpring(1, { damping: 14, stiffness: 180 });
    scale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 200 }));
  }, []);

  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: outerScale.value }],
  }));
  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.checkmarkWrap}>
      <Animated.View style={[styles.outerRing, outerStyle]}>
        <Animated.View style={[styles.innerRing, innerStyle]}>
          <Ionicons name="checkmark-circle" size={72} color={Colors.success} />
        </Animated.View>
      </Animated.View>
      {/* Sparkles */}
      <Sparkle delay={400} x={10} y={20} icon="star" color={Colors.accent} size={18} />
      <Sparkle delay={500} x={100} y={0} icon="sparkles" color={Colors.accent} size={14} />
      <Sparkle delay={600} x={-15} y={60} icon="flash" color="#8B5CF6" size={16} />
      <Sparkle delay={450} x={110} y={50} icon="star" color={Colors.success} size={12} />
      <Sparkle delay={550} x={55} y={-10} icon="star" color={Colors.accent} size={10} />
      <Sparkle delay={650} x={-10} y={30} icon="sparkles" color={Colors.accent} size={12} />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId, total } = useLocalSearchParams<{ orderId?: string; total?: string }>();

  const orderNumber = orderId ?? 'BM-99283';
  const orderTotal = total ?? '24,839';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInUp.duration(400)}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Order Placed!</Text>
        <Pressable
          style={styles.closeBtn}
          onPress={() => router.replace('/(app)/(tabs)/shop')}
        >
          <Ionicons name="close" size={20} color={Colors.textSecondary} />
        </Pressable>
      </Animated.View>

      <View style={styles.content}>
        {/* Animated Checkmark */}
        <AnimatedCheckmark />

        {/* Title */}
        <Animated.View
          style={styles.textWrap}
          entering={FadeInDown.delay(300).springify().damping(18).stiffness(200)}
        >
          <Text style={styles.title}>Order Successful!</Text>
          <Text style={styles.subtitle}>
            Your construction materials are being prepared.{'\n'}
            Expect delivery within 2–4 hours.
          </Text>
        </Animated.View>

        {/* Order Info Card */}
        <Animated.View
          style={styles.orderCard}
          entering={FadeInDown.delay(400).springify().damping(18).stiffness(200)}
        >
          <View style={styles.orderCardRow}>
            <View style={styles.orderCardItem}>
              <Ionicons name="receipt-outline" size={18} color={Colors.textMuted} />
              <View style={styles.orderCardTextWrap}>
                <Text style={styles.orderCardLabel}>Order ID</Text>
                <Text style={styles.orderCardValue}>#{orderNumber}</Text>
              </View>
            </View>
            <View style={styles.orderCardDivider} />
            <View style={styles.orderCardItem}>
              <Ionicons name="wallet-outline" size={18} color={Colors.primary} />
              <View style={styles.orderCardTextWrap}>
                <Text style={styles.orderCardLabel}>Total Paid</Text>
                <Text style={styles.orderCardValue}>₹{orderTotal}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Delivery Info */}
        <Animated.View
          style={styles.deliveryCard}
          entering={FadeInDown.delay(480).springify().damping(18).stiffness(200)}
        >
          <View style={styles.deliveryRow}>
            <View style={styles.deliveryIconWrap}>
              <Ionicons name="bicycle-outline" size={20} color={Colors.white} />
            </View>
            <View style={styles.deliveryTextWrap}>
              <Text style={styles.deliveryTitle}>Estimated Delivery</Text>
              <Text style={styles.deliveryTime}>Today, 2:00 PM – 5:00 PM</Text>
            </View>
          </View>
        </Animated.View>

        {/* Escrow Note */}
        <Animated.View
          style={styles.escrowNote}
          entering={FadeInDown.delay(540).springify().damping(18).stiffness(200)}
        >
          <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
          <Text style={styles.escrowText}>
            Payment held securely in escrow — released only after delivery confirmation
          </Text>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={styles.actions}
          entering={FadeInDown.delay(600).springify().damping(18).stiffness(200)}
        >
          <Pressable
            style={styles.trackBtn}
            onPress={() => router.replace(`/(app)/order/${orderNumber}` as never)}
          >
            <Ionicons name="navigate-outline" size={18} color={Colors.white} />
            <Text style={styles.trackBtnText}>Track Order</Text>
          </Pressable>

          <Pressable
            style={styles.shopBtn}
            onPress={() => router.replace('/(app)/(tabs)/shop')}
          >
            <Text style={styles.shopBtnText}>Continue Shopping</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerSpacer: {
    width: 42,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  checkmarkWrap: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  sparkle: {
    position: 'absolute',
  },
  outerRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  orderCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderCardItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderCardTextWrap: {
    flex: 1,
  },
  orderCardLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  orderCardValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  orderCardDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  deliveryCard: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deliveryIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryTextWrap: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  deliveryTime: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 2,
  },
  escrowNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: '100%',
    marginBottom: 24,
  },
  escrowText: {
    flex: 1,
    fontSize: 12,
    color: Colors.success,
    fontWeight: '500',
    lineHeight: 18,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  trackBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  shopBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  shopBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
});
