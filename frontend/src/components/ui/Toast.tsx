import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../theme/colors';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide?: () => void;
  duration?: number;
}

const CONFIG: Record<ToastType, { bg: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string; text: string }> = {
  success: { bg: '#D1FAE5', icon: 'checkmark-circle', iconColor: Colors.success, text: '#065F46' },
  error: { bg: '#FEE2E2', icon: 'close-circle', iconColor: Colors.error, text: '#991B1B' },
  info: { bg: '#DBEAFE', icon: 'information-circle', iconColor: Colors.info, text: '#1E40AF' },
  warning: { bg: '#FEF3C7', icon: 'warning', iconColor: Colors.warning, text: '#92400E' },
};

export default function Toast({ message, type = 'info', visible, onHide, duration = 3000 }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-80)).current;
  const c = CONFIG[type] ?? CONFIG.info;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, damping: 18, stiffness: 200, useNativeDriver: true }),
      ]).start();
      const t = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -80, duration: 250, useNativeDriver: true }),
        ]).start(() => onHide?.());
      }, duration);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [visible, duration, opacity, translateY, onHide]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { backgroundColor: c.bg, opacity, transform: [{ translateY }] }]}>
      <Ionicons name={c.icon} size={20} color={c.iconColor} />
      <Text style={[styles.text, { color: c.text }]} numberOfLines={3}>{message}</Text>
      <TouchableOpacity onPress={onHide} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} accessibilityLabel="Dismiss">
        <Ionicons name="close" size={16} color={c.text} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Singleton / Imperative API ───────────────────────────────────────────────

let _showToast: ((opts: ToastOptions) => void) | null = null;

export const toast = {
  show: (opts: ToastOptions) => { if (_showToast) _showToast(opts); },
  success: (message: string, duration?: number) => toast.show({ message, type: 'success', duration }),
  error: (message: string, duration?: number) => toast.show({ message, type: 'error', duration }),
  warning: (message: string, duration?: number) => toast.show({ message, type: 'warning', duration }),
  info: (message: string, duration?: number) => toast.show({ message, type: 'info', duration }),
};

interface ProviderState {
  visible: boolean;
  message: string;
  type: ToastType;
  duration: number;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [state, setState] = React.useState<ProviderState>({
    visible: false, message: '', type: 'info', duration: 3000,
  });

  const show = useCallback(({ message, type = 'info', duration = 3000 }: ToastOptions) => {
    setState({ visible: true, message, type, duration });
  }, []);

  useEffect(() => {
    _showToast = show;
    return () => { _showToast = null; };
  }, [show]);

  return (
    <>
      {children}
      <View
        pointerEvents="box-none"
        style={[styles.providerWrap, { top: insets.top + (Platform.OS === 'android' ? 8 : 12) }]}
      >
        <Toast
          message={state.message}
          type={state.type}
          visible={state.visible}
          duration={state.duration}
          onHide={() => setState((s) => ({ ...s, visible: false }))}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 10,
  },
  text: {
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  providerWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },
});
