import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import Colors from '../../theme/colors';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  iconColor?: string;
}

export default function EmptyState({
  icon = 'file-tray-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
  iconColor = Colors.accent,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Animated.View style={styles.iconWrap} entering={ZoomIn.springify().damping(14).stiffness(180)}>
        <Ionicons name={icon} size={48} color={iconColor} />
      </Animated.View>
      <Animated.Text style={styles.title} entering={FadeInDown.delay(150).springify()}>
        {title}
      </Animated.Text>
      {subtitle && (
        <Animated.Text style={styles.subtitle} entering={FadeInDown.delay(220).springify()}>
          {subtitle}
        </Animated.Text>
      )}
      {actionLabel && onAction && (
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Pressable
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            onPress={onAction}
          >
            <Text style={styles.btnText}>{actionLabel}</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 220,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#F2960D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  btn: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  btnPressed: { opacity: 0.82 },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
