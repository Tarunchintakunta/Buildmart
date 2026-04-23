import React from 'react';
import { Text, StyleSheet, TextStyle, ViewStyle, View } from 'react-native';
import Colors from '../../theme/colors';

type AmountSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AmountDisplayProps {
  amount: number;
  size?: AmountSize;
  prefix?: string;
  color?: string;
  strikethrough?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// Indian number format: 1,24,500
function formatIndianAmount(num: number): string {
  const fixed = Math.abs(num).toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const digits = intPart.replace(/,/g, '');
  let result = '';

  if (digits.length <= 3) {
    result = digits;
  } else {
    const last3 = digits.slice(-3);
    const rest = digits.slice(0, -3);
    const groups: string[] = [];
    let i = rest.length;
    while (i > 0) {
      groups.unshift(rest.slice(Math.max(0, i - 2), i));
      i -= 2;
    }
    result = groups.join(',') + ',' + last3;
  }

  // Remove trailing .00
  if (decPart === '00') {
    return result;
  }
  return `${result}.${decPart}`;
}

const fontSizeMap: Record<AmountSize, number> = {
  sm: 13,
  md: 16,
  lg: 20,
  xl: 28,
};

export const AmountDisplay: React.FC<AmountDisplayProps> = ({
  amount,
  size = 'md',
  prefix = '₹',
  color = Colors.textPrimary,
  strikethrough = false,
  style,
  textStyle,
}) => {
  const fontSize = fontSizeMap[size];
  const formatted = `${prefix}${formatIndianAmount(amount)}`;

  return (
    <View style={[styles.container, style]}>
      <Text
        style={[
          styles.text,
          {
            fontSize,
            color,
            textDecorationLine: strikethrough ? 'line-through' : 'none',
            fontWeight: size === 'xl' ? '800' : size === 'lg' ? '700' : '600',
          },
          textStyle,
        ]}
        numberOfLines={1}
        accessibilityLabel={formatted}
      >
        {formatted}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  text: {
    letterSpacing: 0.2,
  },
});

export default AmountDisplay;
