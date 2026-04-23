import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Colors from '../../theme/colors';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type CardShadow = 'none' | 'sm' | 'md';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: CardPadding;
  shadow?: CardShadow;
}

const paddingMap: Record<CardPadding, number> = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
};

const shadowMap: Record<CardShadow, ViewStyle> = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  padding = 'md',
  shadow = 'md',
}) => {
  const containerStyle: ViewStyle[] = [
    styles.base,
    { padding: paddingMap[padding] },
    shadowMap[shadow],
    style as ViewStyle,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.97}
        accessibilityRole="button"
        style={containerStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default Card;
