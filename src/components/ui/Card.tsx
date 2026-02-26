import { View, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { LightTheme } from '../../theme/designSystem';

const T = LightTheme;

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  padding = 16,
  style,
  onPress,
}: CardProps) {
  const getVariantStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: T.surface,
      borderRadius: 14,
      padding,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 8,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: T.border,
        };
      default:
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: T.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 4,
        };
    }
  };

  if (onPress) {
    const { TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity
        style={[getVariantStyles(), style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getVariantStyles(), style]}>
      {children}
    </View>
  );
}
