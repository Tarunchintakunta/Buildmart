import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../theme/designSystem';

const T = LightTheme;

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: T.amber,
          shadowColor: T.amber,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        };
      case 'secondary':
        return {
          backgroundColor: T.bg,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: T.border,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14 };
      case 'md':
        return { paddingVertical: 14, paddingHorizontal: 20, fontSize: 16 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 24, fontSize: 18 };
      default:
        return {};
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={{
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...getVariantStyles(),
        opacity: disabled || loading ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        ...style,
      }}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={sizeStyles.fontSize} color="white" style={{ marginRight: 8 }} />
          )}
          <Text
            style={{
              fontWeight: '700' as const,
              color: variant === 'secondary' ? T.navy : variant === 'outline' ? T.text : T.white,
              fontSize: sizeStyles.fontSize,
              ...textStyle,
            }}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={sizeStyles.fontSize} color="white" style={{ marginLeft: 8 }} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
