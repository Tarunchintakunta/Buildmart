import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../theme/colors';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
  // Legacy props kept for backward compat
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  rightLabel?: string;
  noBorder?: boolean;
}

export default function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  style,
  rightIcon,
  onRightPress,
  rightLabel,
  noBorder = false,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  // Build rightAction from legacy props if rightAction not provided
  const resolvedRightAction = rightAction ?? (
    (rightIcon || rightLabel) ? (
      <TouchableOpacity style={styles.rightBtn} onPress={onRightPress} accessibilityRole="button" accessibilityLabel={rightLabel ?? 'Action'}>
        {rightIcon ? <Ionicons name={rightIcon} size={22} color={Colors.primary} /> : null}
        {rightLabel ? <Text style={styles.rightLabel}>{rightLabel}</Text> : null}
      </TouchableOpacity>
    ) : null
  );

  return (
    <View
      style={[
        styles.header,
        { paddingTop: insets.top + 8 },
        !noBorder && styles.border,
        style,
      ]}
    >
      {showBack ? (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 42 }} />
      )}
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      <View style={styles.rightSlot}>
        {resolvedRightAction ?? <View style={{ width: 42 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  rightSlot: { width: 42, alignItems: 'flex-end', justifyContent: 'center' },
  rightBtn: { alignItems: 'flex-end', justifyContent: 'center' },
  rightLabel: { fontSize: 14, fontWeight: '600', color: Colors.accent },
});
