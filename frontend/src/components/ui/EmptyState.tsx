import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import Colors from '../../theme/colors';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon = 'file-tray-outline', title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={48} color={Colors.textMuted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="primary" size="md" style={styles.btn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconWrap: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  btn: { alignSelf: 'center' },
});
