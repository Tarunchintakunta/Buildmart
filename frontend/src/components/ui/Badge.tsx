import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'muted' | 'primary';
type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: keyof typeof Ionicons.glyphMap;
  dot?: boolean;
  style?: ViewStyle;
}

interface VariantStyle {
  bg: string;
  text: string;
  dot: string;
}

const variantMap: Record<BadgeVariant, VariantStyle> = {
  success: { bg: '#D1FAE5', text: '#065F46', dot: Colors.success },
  warning: { bg: '#FEF3C7', text: '#92400E', dot: Colors.warning },
  error: { bg: '#FEE2E2', text: '#991B1B', dot: Colors.error },
  info: { bg: '#DBEAFE', text: '#1E40AF', dot: Colors.info },
  muted: { bg: '#F3F4F6', text: Colors.textSecondary, dot: Colors.textMuted },
  primary: { bg: '#E0E7FF', text: '#3730A3', dot: Colors.primary },
};

const sizeMap: Record<BadgeSize, { fontSize: number; paddingH: number; paddingV: number; dotSize: number; iconSize: number }> = {
  sm: { fontSize: 11, paddingH: 7, paddingV: 3, dotSize: 6, iconSize: 11 },
  md: { fontSize: 12, paddingH: 10, paddingV: 4, dotSize: 7, iconSize: 13 },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'muted',
  size = 'md',
  icon,
  dot = false,
  style,
}) => {
  const v = variantMap[variant];
  const s = sizeMap[size];

  if (dot) {
    return (
      <View style={[styles.dotContainer, style]}>
        <View style={[styles.dotCircle, { backgroundColor: v.dot, width: s.dotSize, height: s.dotSize, borderRadius: s.dotSize / 2 }]} />
        <Text style={[styles.dotLabel, { fontSize: s.fontSize, color: v.text }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: v.bg,
          paddingHorizontal: s.paddingH,
          paddingVertical: s.paddingV,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={s.iconSize}
          color={v.text}
          style={styles.icon}
        />
      )}
      <Text style={[styles.label, { fontSize: s.fontSize, color: v.text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  icon: {
    marginRight: 3,
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dotCircle: {},
  dotLabel: {
    fontWeight: '500',
  },
});

export default Badge;
