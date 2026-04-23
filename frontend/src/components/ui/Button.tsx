import React, { useCallback } from 'react';
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import Colors from '../../theme/colors';
import { SPRING_SNAPPY, SPRING_BOUNCY, TIMING_FAST } from '../../utils/animations';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

const variantStyles: Record<
  ButtonVariant,
  { container: ViewStyle; text: TextStyle; spinnerColor: string }
> = {
  primary: {
    container: { backgroundColor: Colors.primary, borderWidth: 0 },
    text: { color: Colors.white },
    spinnerColor: Colors.white,
  },
  secondary: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: Colors.primary,
    },
    text: { color: Colors.primary },
    spinnerColor: Colors.primary,
  },
  danger: {
    container: { backgroundColor: Colors.error, borderWidth: 0 },
    text: { color: Colors.white },
    spinnerColor: Colors.white,
  },
  ghost: {
    container: { backgroundColor: 'transparent', borderWidth: 0 },
    text: { color: Colors.primary },
    spinnerColor: Colors.primary,
  },
};

const sizeStyles: Record<
  ButtonSize,
  { container: ViewStyle; text: TextStyle; iconSize: number }
> = {
  sm: {
    container: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
    text: { fontSize: 13, fontWeight: '600' },
    iconSize: 15,
  },
  md: {
    container: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
    text: { fontSize: 15, fontWeight: '600' },
    iconSize: 18,
  },
  lg: {
    container: { paddingVertical: 16, paddingHorizontal: 28, borderRadius: 12 },
    text: { fontSize: 17, fontWeight: '700' },
    iconSize: 20,
  },
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}) => {
  const isDisabled = disabled || loading;
  const vStyle = variantStyles[variant];
  const sStyle = sizeStyles[size];

  // Reanimated press scale
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, SPRING_SNAPPY);
    opacity.value = withTiming(0.85, TIMING_FAST);
  }, [scale, opacity]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BOUNCY);
    opacity.value = withTiming(1, TIMING_FAST);
  }, [scale, opacity]);

  const iconEl = icon ? (
    <Ionicons
      name={icon}
      size={sStyle.iconSize}
      color={vStyle.text.color as string}
      style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
    />
  ) : null;

  return (
    <Animated.View
      style={[
        styles.base,
        vStyle.container,
        sStyle.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
        animStyle,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        accessibilityLabel={title}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={styles.pressable}
      >
        {loading ? (
          <ActivityIndicator color={vStyle.spinnerColor} size="small" />
        ) : (
          <View style={styles.inner}>
            {iconPosition === 'left' && iconEl}
            <Text style={[styles.text, vStyle.text, sStyle.text]} numberOfLines={1}>
              {title}
            </Text>
            {iconPosition === 'right' && iconEl}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.4,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
  text: {
    letterSpacing: 0.2,
  },
});

export default Button;
