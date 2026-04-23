import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardTypeOptions,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  hint?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  returnKeyType?: 'done' | 'next' | 'go' | 'search' | 'send';
  onSubmitEditing?: () => void;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  hint,
  secureTextEntry = false,
  keyboardType = 'default',
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  autoCapitalize = 'sentences',
  maxLength,
  style,
  inputStyle,
  onBlur,
  onFocus,
  returnKeyType,
  onSubmitEditing,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const borderColor = error
    ? Colors.error
    : isFocused
    ? Colors.primary
    : Colors.border;

  return (
    <View style={[styles.wrapper, style]}>
      {label ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          { borderColor },
          disabled && styles.disabledContainer,
          multiline && { alignItems: 'flex-start', minHeight: 20 * (numberOfLines || 1) + 28 },
        ]}
      >
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={18}
            color={isFocused ? Colors.primary : Colors.textMuted}
            style={styles.leftIcon}
          />
        ) : null}

        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeft : null,
            rightIcon ? styles.inputWithRight : null,
            multiline && styles.multilineInput,
            disabled && styles.disabledText,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          editable={!disabled}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          testID={testID}
          textAlignVertical={multiline ? 'top' : 'center'}
          accessibilityLabel={label ?? placeholder}
          accessibilityState={{ disabled }}
        />

        {rightIcon ? (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIconBtn}
            accessibilityLabel="input action"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={rightIcon}
              size={18}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <Text style={styles.errorText} numberOfLines={2}>
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hintText} numberOfLines={2}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 2,
    minHeight: 48,
  },
  disabledContainer: {
    backgroundColor: '#F9FAFB',
    opacity: 0.7,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIconBtn: {
    padding: 4,
    marginLeft: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 10,
  },
  inputWithLeft: {
    marginLeft: 0,
  },
  inputWithRight: {
    marginRight: 0,
  },
  multilineInput: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  disabledText: {
    color: Colors.textMuted,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 5,
    marginLeft: 2,
  },
  hintText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 5,
    marginLeft: 2,
  },
});

export default Input;
