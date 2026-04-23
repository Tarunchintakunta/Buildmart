import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import Colors from '../../theme/colors';
import { SPRING_SNAPPY, SPRING_BOUNCY } from '../../utils/animations';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type CardShadow = 'none' | 'sm' | 'md';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: CardPadding;
  shadow?: CardShadow;
  /** Animate entry with FadeInDown (good for list items) */
  animate?: boolean;
  animationDelay?: number;
}

const paddingMap: Record<CardPadding, number> = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
};

const shadowMap: Record<CardShadow, ViewStyle> = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  padding = 'md',
  shadow = 'md',
  animate = false,
  animationDelay = 0,
}) => {
  const scale = useSharedValue(1);

  const pressAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (onPress) scale.value = withSpring(0.97, SPRING_SNAPPY);
  }, [onPress, scale]);

  const handlePressOut = useCallback(() => {
    if (onPress) scale.value = withSpring(1, SPRING_BOUNCY);
  }, [onPress, scale]);

  const baseStyle: ViewStyle[] = [
    styles.base,
    { padding: paddingMap[padding] },
    shadowMap[shadow],
    style as ViewStyle,
  ];

  if (onPress) {
    return (
      <Animated.View
        style={[pressAnimStyle, baseStyle]}
        entering={
          animate
            ? FadeInDown.delay(animationDelay).springify().damping(18).stiffness(200)
            : undefined
        }
      >
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          style={styles.pressable}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={baseStyle}
      entering={
        animate
          ? FadeInDown.delay(animationDelay).springify().damping(18).stiffness(200)
          : undefined
      }
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pressable: {
    flex: 1,
  },
});

export default Card;
