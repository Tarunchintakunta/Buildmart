import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useDerivedValue,
  interpolate,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import { LightTheme as T } from '../../theme/colors';
import type { UserRole } from '../../types';
import { SPRING_BOUNCY, counterTiming } from '../../utils/animations';

export interface WalletCardProps {
  balance: number;
  heldBalance?: number;
  role?: UserRole;
  onAddMoney?: () => void;
  onWithdraw?: () => void;
  style?: ViewStyle;
}

function formatIndian(num: number): string {
  const parts = Math.abs(Math.round(num)).toString().split('').reverse();
  const groups: string[] = [];
  parts.forEach((d, i) => {
    if (i === 3 || (i > 3 && (i - 3) % 2 === 0)) groups.push(',');
    groups.push(d);
  });
  return '₹' + groups.reverse().join('');
}

function getBalanceLabel(role?: UserRole): string {
  if (role === 'worker' || role === 'driver') return 'Earnings';
  if (role === 'shopkeeper') return 'Revenue';
  return 'Available Balance';
}

/** Animated number display that counts up from 0 */
function AnimatedBalance({ value }: { value: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, counterTiming(900));
  }, [value]);

  const displayValue = useDerivedValue(() =>
    interpolate(progress.value, [0, 1], [0, value]),
  );

  const animStyle = useAnimatedStyle(() => ({})); // force re-render via worklet

  // We derive the text on JS side using a simpler approach
  const [displayText, setDisplayText] = React.useState('₹0');
  React.useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 900;
    const step = 16;
    const steps = duration / step;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setDisplayText(formatIndian(current));
    }, step);
    return () => clearInterval(timer);
  }, [value]);

  return <Text style={styles.amount}>{displayText}</Text>;
}

export default function WalletCard({
  balance,
  heldBalance = 0,
  role,
  onAddMoney,
  onWithdraw,
  style,
}: WalletCardProps) {
  const balanceLabel = getBalanceLabel(role);

  // Card slide-in
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, SPRING_BOUNCY);
    opacity.value = withTiming(1, { duration: 500 });
  }, []);

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.card, style, cardAnimStyle]}>
      <View style={styles.topRow}>
        <View style={styles.balanceSection}>
          <Text style={styles.label}>{balanceLabel}</Text>
          <AnimatedBalance value={balance} />
          {heldBalance > 0 && (
            <Animated.View
              style={styles.heldChip}
              entering={ZoomIn.springify().damping(14)}
            >
              <Text style={styles.heldText}>{formatIndian(heldBalance)} on hold</Text>
            </Animated.View>
          )}
        </View>
        <Animated.View
          style={styles.iconCircle}
          entering={ZoomIn.delay(200).springify().damping(14)}
        >
          <Ionicons name="wallet" size={24} color="#fff" />
        </Animated.View>
      </View>

      <View style={styles.actions}>
        {onAddMoney && (
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            onPress={onAddMoney}
            accessibilityRole="button"
            accessibilityLabel="Add money to wallet"
          >
            <Ionicons name="add-circle-outline" size={16} color="#fff" />
            <Text style={styles.actionText}>Add Money</Text>
          </Pressable>
        )}
        {onWithdraw && (
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            onPress={onWithdraw}
            accessibilityRole="button"
            accessibilityLabel="Withdraw from wallet"
          >
            <Ionicons name="arrow-down-circle-outline" size={16} color="#fff" />
            <Text style={styles.actionText}>Withdraw</Text>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.navy,
    borderRadius: 20,
    padding: 22,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  balanceSection: { flex: 1 },
  label: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  amount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  heldChip: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(242,150,13,0.25)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heldText: { fontSize: 12, color: '#F2960D', fontWeight: '600' },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  actionText: { fontSize: 13, fontWeight: '600', color: '#fff' },
});
