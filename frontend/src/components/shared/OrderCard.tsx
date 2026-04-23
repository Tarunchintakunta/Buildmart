import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';
import type { Order, OrderWithDetails } from '../../types';
import StatusBadge from './StatusBadge';

export interface OrderCardProps {
  order: Order | OrderWithDetails;
  onPress?: () => void;
  onTrack?: () => void;
  style?: ViewStyle;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

function formatIndian(num: number): string {
  const parts = Math.abs(num).toFixed(0).split('').reverse();
  const groups: string[] = [];
  parts.forEach((d, i) => {
    if (i === 3 || (i > 3 && (i - 3) % 2 === 0)) groups.push(',');
    groups.push(d);
  });
  return '₹' + groups.reverse().join('');
}

const TRACKABLE_STATUSES = ['accepted', 'processing', 'out_for_delivery'];

export default function OrderCard({ order, onPress, onTrack, style }: OrderCardProps) {
  const withDetails = order as OrderWithDetails;
  const shopName = withDetails.shop?.name ?? 'Shop';
  const itemCount = withDetails.items?.length ?? 0;

  const itemSummary = withDetails.items
    ? withDetails.items
        .slice(0, 2)
        .map((i) => i.product?.name ?? 'Item')
        .join(', ')
    : '';

  const canTrack = TRACKABLE_STATUSES.includes(order.status);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.95}
      accessibilityRole="button"
      accessibilityLabel={`Order ${order.order_number}`}
    >
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber} numberOfLines={1}>
            #{order.order_number}
          </Text>
          <Text style={styles.date}>{formatDate(order.created_at)}</Text>
        </View>
        <StatusBadge status={order.status} type="order" size="sm" />
      </View>

      <View style={styles.divider} />

      {/* Shop + items */}
      <View style={styles.bodyRow}>
        <View style={styles.shopIcon}>
          <Ionicons name="storefront-outline" size={20} color={Colors.textSecondary} />
        </View>
        <View style={styles.bodyContent}>
          <Text style={styles.shopName} numberOfLines={1}>
            {shopName}
          </Text>
          {itemCount > 0 ? (
            <Text style={styles.items} numberOfLines={1}>
              {itemCount} item{itemCount !== 1 ? 's' : ''}
              {itemSummary ? ` · ${itemSummary}` : ''}
              {itemCount > 2 ? '...' : ''}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footerRow}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatIndian(order.total_amount)}</Text>
        </View>
        {canTrack && onTrack ? (
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={onTrack}
            accessibilityRole="button"
            accessibilityLabel="Track order"
          >
            <Ionicons name="location-outline" size={14} color={Colors.primary} />
            <Text style={styles.trackText}>Track</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderInfo: { flex: 1, marginRight: 8 },
  orderNumber: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  date: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 12 },
  bodyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  shopIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bodyContent: { flex: 1 },
  shopName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  items: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  totalAmount: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trackText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
});
