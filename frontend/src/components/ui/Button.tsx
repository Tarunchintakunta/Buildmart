import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle; spinnerColor: string }> = {
  primary: {
    container: {
      backgroundColor: Colors.primary,
      borderWidth: 0,
    },
    text: {
      color: Colors.white,
    },
    spinnerColor: Colors.white,
  },
  secondary: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: Colors.primary,
    },
    text: {
      color: Colors.primary,
    },
    spinnerColor: Colors.primary,
  },
  danger: {
    container: {
      backgroundColor: Colors.error,
      borderWidth: 0,
    },
    text: {
      color: Colors.white,
    },
    spinnerColor: Colors.white,
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    text: {
      color: Colors.primary,
    },
    spinnerColor: Colors.primary,
  },
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle; iconSize: number }> = {
  sm: {
    container: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 8,
    },
    text: {
      fontSize: 13,
      fontWeight: '600',
    },
    iconSize: 15,
  },
  md: {
    container: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    text: {
      fontSize: 15,
      fontWeight: '600',
    },
    iconSize: 18,
  },
  lg: {
    container: {
      paddingVertical: 16,
      paddingHorizontal: 28,
      borderRadius: 12,
    },
    text: {
      fontSize: 17,
      fontWeight: '700',
    },
    iconSize: 20,
  },
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const isDisabled = disabled || loading;
  const vStyle = variantStyles[variant];
  const sStyle = sizeStyles[size];
  const spinnerColor = vStyle.spinnerColor;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.base,
        vStyle.container,
        sStyle.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <View style={styles.inner}>
          {icon && (
            <Ionicons
              name={icon}
              size={sStyle.iconSize}
              color={vStyle.text.color as string}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, vStyle.text, sStyle.text]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.4,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    letterSpacing: 0.2,
  },
});

export default Button;
