import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Colors from '../../theme/colors';
import Button from './Button';

type ConfirmVariant = 'danger' | 'primary';

export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 18,
          stiffness: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.92,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onCancel} accessibilityLabel="Dismiss dialog">
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.dialog,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <Text style={styles.title} numberOfLines={2}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={onCancel}
                  style={styles.cancelBtn}
                  accessibilityRole="button"
                  accessibilityLabel={cancelLabel}
                >
                  <Text style={styles.cancelText}>{cancelLabel}</Text>
                </TouchableOpacity>
                <View style={styles.confirmBtnWrap}>
                  <Button
                    title={confirmLabel}
                    onPress={onConfirm}
                    variant={confirmVariant}
                    size="md"
                    fullWidth
                  />
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dialog: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  confirmBtnWrap: {
    flex: 1,
  },
});

export default ConfirmModal;
