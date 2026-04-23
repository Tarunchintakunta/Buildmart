import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Colors from '../../theme/colors';

export interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export default function SectionHeader({ title, actionLabel, onAction, style }: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {actionLabel && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  action: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
    marginLeft: 12,
  },
});
