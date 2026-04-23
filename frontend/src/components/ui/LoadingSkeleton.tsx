import React, { useEffect } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Colors from '../../theme/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/** Single animated skeleton block — smooth Reanimated pulse */
export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 700, easing: Easing.inOut(Easing.sine) }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.sine) }),
      ),
      -1,
      false,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: Colors.border,
        },
        style,
        animStyle,
      ]}
    />
  );
}

/** Card-shaped skeleton */
export function CardSkeleton({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.cardSkeleton, style]}>
      <Skeleton height={140} borderRadius={0} />
      <View style={styles.cardBody}>
        <Skeleton height={14} width="80%" />
        <Skeleton height={12} width="55%" />
        <Skeleton height={32} borderRadius={8} />
      </View>
    </View>
  );
}

/** Row-shaped skeleton for list items */
export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={styles.listRow}>
          <Skeleton width={44} height={44} borderRadius={12} />
          <View style={styles.listRowContent}>
            <Skeleton height={14} width="70%" />
            <Skeleton height={12} width="45%" />
          </View>
        </View>
      ))}
    </View>
  );
}

/** Horizontal row of CardSkeletons */
export function HorizontalCardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.horizontalRow}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} style={styles.horizontalCard} />
      ))}
    </View>
  );
}

/** Wallet screen skeleton */
export function WalletSkeleton() {
  return (
    <View style={styles.walletSkeleton}>
      <Skeleton height={180} borderRadius={20} />
      <View style={styles.walletBody}>
        <Skeleton height={14} width="40%" />
        <ListSkeleton rows={5} />
      </View>
    </View>
  );
}

// Legacy aliases
export const SkeletonCard = CardSkeleton;
export const SkeletonList = ListSkeleton;

const styles = StyleSheet.create({
  cardSkeleton: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    width: 164,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardBody: { padding: 10, gap: 8 },
  listContainer: { gap: 14 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  listRowContent: { flex: 1, gap: 8 },
  horizontalRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16 },
  horizontalCard: { width: 164 },
  walletSkeleton: { padding: 16, gap: 20 },
  walletBody: { gap: 16 },
});

export default Skeleton;
