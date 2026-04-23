import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        { width: width as any, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

export function CardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={48} height={48} borderRadius={12} style={{ marginBottom: 12 }} />
      <Skeleton width="70%" height={14} style={{ marginBottom: 8 }} />
      <Skeleton width="50%" height={12} />
    </View>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.card, { flexDirection: 'row', gap: 12 }]}>
          <Skeleton width={52} height={52} borderRadius={14} />
          <View style={{ flex: 1, gap: 8 }}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="80%" height={12} />
            <Skeleton width="40%" height={11} />
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: '#E5E7EB' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
});

export default Skeleton;
