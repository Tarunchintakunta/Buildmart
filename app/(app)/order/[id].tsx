import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import Colors from '../../../src/theme/colors';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  name: string;
  spec: string;
  unitPrice: number;
  qty: number;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}

interface MockOrderDetail {
  id: string;
  number: string;
  date: string;
  status: string;
  address: { name: string; line1: string; line2: string; city: string; pin: string };
  shopName: string;
  shopPhone: string;
  items: OrderItem[];
  deliveryFee: number;
  deliveryTime: string;
}

// ─── Mock Orders by ID ────────────────────────────────────────────────────────

const MOCK_ORDERS: Record<string, MockOrderDetail> = {
  'ord-1': {
    id: 'ord-1', number: 'BM-98234',
    date: '22 Apr 2026, 3:45 PM', status: 'delivered',
    address: { name: 'Site A — Main Building', line1: '45-B, HITEC City Phase 2', line2: 'Near Mindspace Junction', city: 'Hyderabad', pin: '500081' },
    shopName: 'BuildMart Main Store', shopPhone: '+91 98765 43210',
    items: [
      { name: 'UltraTech PPC Cement', spec: '50kg Bag', unitPrice: 385, qty: 10, iconName: 'layers-outline', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
      { name: 'SAIL TMT Bars Fe500D', spec: 'per kg', unitPrice: 72, qty: 50, iconName: 'barbell-outline', iconBg: '#F5F3FF', iconColor: '#8B5CF6' },
    ],
    deliveryFee: 0, deliveryTime: 'Delivered in 2 hours',
  },
  'ord-2': {
    id: 'ord-2', number: 'BM-98230',
    date: '23 Apr 2026, 11:30 AM', status: 'out_for_delivery',
    address: { name: 'Residential Project', line1: '12, Green Valley Layout', line2: 'Kompally', city: 'Hyderabad', pin: '500014' },
    shopName: 'Anand Hardware & Electricals', shopPhone: '+91 90000 12345',
    items: [
      { name: 'Havells FR Wire 2.5mm', spec: '90m coil', unitPrice: 2200, qty: 3, iconName: 'flash-outline', iconBg: '#FFFBEB', iconColor: Colors.accent },
      { name: 'CPVC Pipes 1 inch', spec: '3m pipe', unitPrice: 285, qty: 10, iconName: 'git-branch-outline', iconBg: '#F0FDF4', iconColor: Colors.success },
    ],
    deliveryFee: 50, deliveryTime: 'Expected by 5:00 PM today',
  },
  'ord-3': {
    id: 'ord-3', number: 'BM-98228',
    date: '23 Apr 2026, 9:00 AM', status: 'processing',
    address: { name: 'Office Building', line1: 'Survey No 42, Gachibowli', line2: 'Financial District', city: 'Hyderabad', pin: '500032' },
    shopName: 'Sri Lakshmi Paint House', shopPhone: '+91 95555 67890',
    items: [
      { name: 'Asian Paints Apex Ultima', spec: '20L bucket', unitPrice: 3400, qty: 2, iconName: 'color-palette-outline', iconBg: '#FFF0F3', iconColor: '#EC4899' },
    ],
    deliveryFee: 0, deliveryTime: 'Packing in progress',
  },
  'ord-4': {
    id: 'ord-4', number: 'BM-98220',
    date: '23 Apr 2026, 8:00 AM', status: 'accepted',
    address: { name: 'Villa Project', line1: 'Plot 99, Narsingi', line2: 'Near Outer Ring Road', city: 'Hyderabad', pin: '500075' },
    shopName: 'Raj Building Materials', shopPhone: '+91 87654 32100',
    items: [
      { name: 'River Sand Grade 1', spec: 'per ton', unitPrice: 1800, qty: 5, iconName: 'hourglass-outline', iconBg: '#FFF7ED', iconColor: '#F97316' },
      { name: 'M-Sand Manufactured', spec: 'per ton', unitPrice: 1200, qty: 3, iconName: 'leaf-outline', iconBg: '#F0FDF4', iconColor: Colors.success },
    ],
    deliveryFee: 500, deliveryTime: 'Confirmed — dispatch within 4 hours',
  },
  'ord-5': {
    id: 'ord-5', number: 'BM-98215',
    date: '15 Apr 2026, 2:00 PM', status: 'cancelled',
    address: { name: 'Commercial Complex', line1: 'Survey 71, LB Nagar', line2: 'East Hyderabad', city: 'Hyderabad', pin: '500074' },
    shopName: 'Balaji Construction Supplies', shopPhone: '+91 94444 55566',
    items: [
      { name: 'ACC Gold Cement', spec: '50kg bag', unitPrice: 390, qty: 20, iconName: 'layers-outline', iconBg: '#F0FDF4', iconColor: Colors.success },
      { name: '20mm Blue Metal Aggregate', spec: 'per ton', unitPrice: 1500, qty: 2, iconName: 'diamond-outline', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
    ],
    deliveryFee: 0, deliveryTime: 'Cancelled — item out of stock',
  },
  'ord-6': {
    id: 'ord-6', number: 'BM-98210',
    date: '23 Apr 2026, 10:15 AM', status: 'pending',
    address: { name: 'New Home Construction', line1: '78, Kondapur', line2: 'Serilingampally', city: 'Hyderabad', pin: '500084' },
    shopName: 'BuildMart Main Store', shopPhone: '+91 98765 43210',
    items: [
      { name: 'Sintex Water Tank 1000L', spec: 'per tank', unitPrice: 8200, qty: 1, iconName: 'water-outline', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
      { name: 'CPVC Pipes 1 inch', spec: '3m pipe', unitPrice: 285, qty: 20, iconName: 'git-branch-outline', iconBg: '#F0FDF4', iconColor: Colors.success },
    ],
    deliveryFee: 0, deliveryTime: 'Awaiting confirmation',
  },
};

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  pending: { label: 'Pending Confirmation', color: '#8B5CF6', bg: '#F5F3FF', icon: 'hourglass-outline' },
  accepted: { label: 'Order Accepted', color: Colors.info, bg: '#EFF6FF', icon: 'checkmark-circle-outline' },
  processing: { label: 'Packing & Processing', color: Colors.accent, bg: Colors.amberBg, icon: 'time-outline' },
  out_for_delivery: { label: 'Out for Delivery', color: '#F97316', bg: '#FFF7ED', icon: 'bicycle-outline' },
  delivered: { label: 'Order Delivered', color: Colors.success, bg: '#F0FDF4', icon: 'checkmark-circle' },
  cancelled: { label: 'Order Cancelled', color: Colors.error, bg: '#FEF2F2', icon: 'close-circle' },
};

// ─── Timeline Steps ───────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { key: 'pending', label: 'Ordered', icon: 'receipt-outline' as keyof typeof Ionicons.glyphMap },
  { key: 'accepted', label: 'Confirmed', icon: 'checkmark-circle-outline' as keyof typeof Ionicons.glyphMap },
  { key: 'processing', label: 'Processing', icon: 'cube-outline' as keyof typeof Ionicons.glyphMap },
  { key: 'out_for_delivery', label: 'On the Way', icon: 'bicycle-outline' as keyof typeof Ionicons.glyphMap },
  { key: 'delivered', label: 'Delivered', icon: 'checkmark-done-circle-outline' as keyof typeof Ionicons.glyphMap },
];

const STATUS_PROGRESS: Record<string, number> = {
  pending: 0,
  accepted: 1,
  processing: 2,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: -1,
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const order = MOCK_ORDERS[id ?? ''] ?? MOCK_ORDERS['ord-1'];
  const config = STATUS_CONFIG[order.status] ?? STATUS_CONFIG['pending'];
  const progress = STATUS_PROGRESS[order.status] ?? 0;
  const isCancelled = order.status === 'cancelled';
  const isPending = order.status === 'pending';
  const isDelivered = order.status === 'delivered';

  const subtotal = order.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + order.deliveryFee + gst;

  const handleCancel = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'Keep Order', style: 'cancel' },
        { text: 'Cancel Order', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const handleContactShop = () => {
    Linking.openURL(`tel:${order.shopPhone}`).catch(() => {
      Alert.alert('Call', `Call ${order.shopName} at ${order.shopPhone}`);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInUp.duration(350)}>
        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Order Details</Text>
          <Text style={styles.headerSub}>#{order.number}</Text>
        </View>
        <Pressable style={styles.headerBtn}>
          <Ionicons name="share-outline" size={20} color={Colors.primary} />
        </Pressable>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Status Banner */}
        <Animated.View
          style={[styles.statusBanner, { backgroundColor: config.bg }]}
          entering={FadeInDown.delay(60).springify().damping(18).stiffness(200)}
        >
          <View style={[styles.statusIconWrap, { backgroundColor: config.color }]}>
            <Ionicons name={config.icon} size={22} color={Colors.white} />
          </View>
          <View style={styles.statusTextWrap}>
            <Text style={[styles.statusTitle, { color: config.color }]}>{config.label}</Text>
            <Text style={styles.statusDate}>{order.date}</Text>
          </View>
        </Animated.View>

        {/* Timeline (only for non-cancelled) */}
        {!isCancelled && (
          <Animated.View
            style={styles.section}
            entering={FadeInDown.delay(120).springify().damping(18).stiffness(200)}
          >
            <Text style={styles.sectionLabel}>ORDER PROGRESS</Text>
            <View style={styles.timeline}>
              {TIMELINE_STEPS.map((step, i) => {
                const done = i <= progress;
                const current = i === progress;
                return (
                  <View key={step.key} style={styles.timelineStep}>
                    <View style={styles.timelineLeft}>
                      <View style={[
                        styles.timelineCircle,
                        done && styles.timelineCircleDone,
                        current && styles.timelineCircleCurrent,
                      ]}>
                        <Ionicons
                          name={done ? 'checkmark' : step.icon}
                          size={13}
                          color={done ? Colors.white : Colors.textMuted}
                        />
                      </View>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <View style={[styles.timelineLine, done && styles.timelineLineDone]} />
                      )}
                    </View>
                    <Text style={[styles.timelineLabel, done && styles.timelineLabelDone]}>
                      {step.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Delivery Address */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(180).springify().damping(18).stiffness(200)}
        >
          <Text style={styles.sectionLabel}>DELIVERY ADDRESS</Text>
          <View style={styles.addressCard}>
            <View style={styles.addressIconWrap}>
              <Ionicons name="location" size={18} color={Colors.primary} />
            </View>
            <View style={styles.addressTextWrap}>
              <Text style={styles.addressName}>{order.address.name}</Text>
              <Text style={styles.addressLine}>{order.address.line1}</Text>
              <Text style={styles.addressLine}>{order.address.line2}</Text>
              <Text style={styles.addressLine}>{order.address.city} — {order.address.pin}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Items */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(240).springify().damping(18).stiffness(200)}
        >
          <Text style={styles.sectionLabel}>ITEMS ({order.items.length})</Text>
          {order.items.map((item, i) => (
            <View key={i} style={[styles.itemRow, i > 0 && styles.itemRowBorder]}>
              <View style={[styles.itemIcon, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.iconName} size={24} color={item.iconColor} />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSpec}>{item.spec} × {item.qty}</Text>
              </View>
              <Text style={styles.itemTotal}>
                ₹{(item.unitPrice * item.qty).toLocaleString('en-IN')}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Price Breakdown */}
        <Animated.View
          style={styles.pricingCard}
          entering={FadeInDown.delay(300).springify().damping(18).stiffness(200)}
        >
          <Text style={styles.sectionLabel}>PRICE BREAKDOWN</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Fee</Text>
            <Text style={[styles.priceValue, order.deliveryFee === 0 && { color: Colors.success }]}>
              {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>GST (5%)</Text>
            <Text style={styles.priceValue}>₹{gst.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceTotalLabel}>Total Paid</Text>
            <Text style={styles.priceTotalValue}>₹{total.toLocaleString('en-IN')}</Text>
          </View>
        </Animated.View>

        {/* Shopkeeper Card */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(360).springify().damping(18).stiffness(200)}
        >
          <Text style={styles.sectionLabel}>SELLER</Text>
          <View style={styles.shopCard}>
            <View style={styles.shopIconWrap}>
              <Ionicons name="storefront" size={20} color={Colors.white} />
            </View>
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>{order.shopName}</Text>
              <Text style={styles.shopPhone}>{order.shopPhone}</Text>
            </View>
            <Pressable style={styles.callBtn} onPress={handleContactShop}>
              <Ionicons name="call" size={16} color={Colors.white} />
              <Text style={styles.callBtnText}>Call</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={styles.actionsSection}
          entering={FadeInDown.delay(420).springify().damping(18).stiffness(200)}
        >
          {isPending && (
            <Pressable style={styles.cancelBtn} onPress={handleCancel}>
              <Ionicons name="close-circle-outline" size={18} color={Colors.error} />
              <Text style={styles.cancelBtnText}>Cancel Order</Text>
            </Pressable>
          )}
          {isDelivered && (
            <Pressable
              style={styles.reorderBtn}
              onPress={() => router.push('/(app)/(tabs)/shop')}
            >
              <Ionicons name="refresh-outline" size={18} color={Colors.white} />
              <Text style={styles.reorderBtnText}>Reorder</Text>
            </Pressable>
          )}
        </Animated.View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.contactBtn} onPress={handleContactShop}>
          <Ionicons name="headset-outline" size={18} color={Colors.primary} />
          <Text style={styles.contactBtnText}>Contact Shop</Text>
        </Pressable>
        <Pressable
          style={styles.downloadBtn}
          onPress={() => Alert.alert('Invoice', 'Invoice download coming soon!')}
        >
          <Ionicons name="download-outline" size={18} color={Colors.white} />
          <Text style={styles.downloadBtnText}>Invoice</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    margin: 16,
    padding: 16,
    borderRadius: 14,
  },
  statusIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTextWrap: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 3,
  },
  section: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  timeline: {
    paddingLeft: 4,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 28,
  },
  timelineCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineCircleDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timelineCircleCurrent: {
    borderColor: Colors.accent,
    backgroundColor: Colors.amberBg,
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.border,
    marginTop: 2,
  },
  timelineLineDone: {
    backgroundColor: Colors.primary,
  },
  timelineLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
    paddingTop: 6,
    paddingBottom: 20,
  },
  timelineLabelDone: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  addressCard: {
    flexDirection: 'row',
    gap: 12,
  },
  addressIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  addressTextWrap: {
    flex: 1,
  },
  addressName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  itemRowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  itemSpec: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 3,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  pricingCard: {
    backgroundColor: '#F0F2F8',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  priceDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  priceTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  priceTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  shopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shopIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  shopPhone: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.success,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  callBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  actionsSection: {
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.error,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.success,
    borderRadius: 14,
    paddingVertical: 14,
  },
  reorderBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  contactBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  downloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  downloadBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
});
