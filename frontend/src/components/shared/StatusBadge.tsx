import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import type {
  OrderStatus,
  LaborRequestStatus,
  AgreementStatus,
  VerificationStatus,
} from '../../types';

type StatusType = 'order' | 'labor' | 'agreement' | 'verification';

// All possible statuses across all types
type AllStatus =
  | OrderStatus
  | LaborRequestStatus
  | AgreementStatus
  | VerificationStatus
  | 'working'
  | 'waiting';

interface StatusConfig {
  bg: string;
  text: string;
  label: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  // Order statuses
  pending:          { bg: '#FEF3C7', text: '#92400E', label: 'Pending' },
  accepted:         { bg: '#DBEAFE', text: '#1E40AF', label: 'Accepted' },
  processing:       { bg: '#EDE9FE', text: '#5B21B6', label: 'Processing' },
  out_for_delivery: { bg: '#FFEDD5', text: '#9A3412', label: 'Out for Delivery' },
  delivered:        { bg: '#D1FAE5', text: '#065F46', label: 'Delivered' },
  cancelled:        { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelled' },
  // Labor statuses
  in_progress:      { bg: '#EDE9FE', text: '#5B21B6', label: 'In Progress' },
  completed:        { bg: '#D1FAE5', text: '#065F46', label: 'Completed' },
  // Agreement statuses
  draft:            { bg: '#F3F4F6', text: '#4B5563', label: 'Draft' },
  pending_signature:{ bg: '#FEF3C7', text: '#92400E', label: 'Pending Signature' },
  active:           { bg: '#D1FAE5', text: '#065F46', label: 'Active' },
  terminated:       { bg: '#FEE2E2', text: '#991B1B', label: 'Terminated' },
  // Verification statuses
  approved:         { bg: '#D1FAE5', text: '#065F46', label: 'Approved' },
  rejected:         { bg: '#FEE2E2', text: '#991B1B', label: 'Rejected' },
  // Worker availability
  working:          { bg: '#FEF3C7', text: '#92400E', label: 'Working' },
  waiting:          { bg: '#D1FAE5', text: '#065F46', label: 'Available' },
};

export interface StatusBadgeProps {
  status: AllStatus | string;
  type?: StatusType;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export default function StatusBadge({ status, size = 'md', style }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? { bg: '#F3F4F6', text: '#6B7280', label: String(status) };
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: cfg.bg,
          paddingHorizontal: isSmall ? 7 : 10,
          paddingVertical: isSmall ? 3 : 5,
        },
        style,
      ]}
      accessibilityLabel={cfg.label}
    >
      <Text style={[styles.text, { color: cfg.text, fontSize: isSmall ? 11 : 12 }]}>
        {cfg.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 999, alignSelf: 'flex-start' },
  text: { fontWeight: '600' },
});
