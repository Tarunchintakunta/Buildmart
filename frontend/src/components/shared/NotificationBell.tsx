import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';

export interface NotificationBellProps {
  count?: number;
  onPress?: () => void;
}

export default function NotificationBell({ count = 0, onPress }: NotificationBellProps) {
  const displayCount = count > 99 ? '99+' : count > 0 ? String(count) : null;

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={count > 0 ? `${count} unread notifications` : 'Notifications'}
    >
      <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
      {displayCount ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{displayCount}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  badgeText: { color: Colors.primary, fontSize: 9, fontWeight: '800' },
});
