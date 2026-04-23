import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Colors from '../../theme/colors';

export interface DividerProps {
  spacing?: number;
  color?: string;
  label?: string;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  spacing = 16,
  color = Colors.border,
  label,
  style,
}) => {
  if (label) {
    return (
      <View style={[styles.row, { marginVertical: spacing }, style]}>
        <View style={[styles.line, { backgroundColor: color }]} />
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.line, { backgroundColor: color }]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.simple,
        { marginVertical: spacing, backgroundColor: color },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  simple: {
    height: 1,
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: 1,
  },
  label: {
    fontSize: 12,
    color: Colors.textMuted,
    marginHorizontal: 12,
    fontWeight: '500',
  },
});

export default Divider;
