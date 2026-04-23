import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useCartStore } from '../../src/store/cart.store';
import Colors from '../../src/theme/colors';

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const STEPS = ['Cart', 'Address', 'Confirm'];
  return (
    <View style={styles.stepBar}>
      {STEPS.map((label, i) => {
        const done = i < step - 1;
        const active = i === step - 1;
        return (
          <View key={label} style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              done && styles.stepCircleDone,
              active && styles.stepCircleActive,
            ]}>
              {done ? (
                <Ionicons name="checkmark" size={13} color={Colors.white} />
              ) : (
                <Text style={[styles.stepNum, (active || done) && styles.stepNumActive]}>
                  {i + 1}
                </Text>
              )}
            </View>
            <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
            {i < STEPS.length - 1 && (
              <View style={[styles.stepLine, i < step - 1 && styles.stepLineDone]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

// ─── Cart Item Row ────────────────────────────────────────────────────────────

function CartItemRow({ item, onInc, onDec, onRemove }: {
  item: ReturnType<typeof useCartStore.getState>['items'][0];
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
}) {
  const CATEGORY_ICONS: Record<string, { icon: keyof typeof Ionicons.glyphMap; bg: string; color: string }> = {
    default: { icon: 'cube-outline', bg: '#EFF6FF', color: '#3B82F6' },
  };
  const iconSet = CATEGORY_ICONS['default'];

  return (
    <View style={styles.cartItemRow}>
      <View style={[styles.cartItemIcon, { backgroundColor: iconSet.bg }]}>
        <Ionicons name="cube-outline" size={28} color={iconSet.color} />
      </View>
      <View style={styles.cartItemInfo}>
        <View style={styles.cartItemTopRow}>
          <Text style={styles.cartItemName} numberOfLines={2}>{item.productName}</Text>
          <Pressable onPress={onRemove} style={styles.removeBtn}>
            <Ionicons name="trash-outline" size={16} color={Colors.error} />
          </Pressable>
        </View>
        <Text style={styles.cartItemUnit}>{item.unit}</Text>
        <View style={styles.cartItemBottomRow}>
          <Text style={styles.cartItemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
          <View style={styles.qtyControl}>
            <Pressable style={styles.qtyBtn} onPress={onDec}>
              <Ionicons name="remove" size={14} color={Colors.primary} />
            </Pressable>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <Pressable style={styles.qtyBtn} onPress={onInc}>
              <Ionicons name="add" size={14} color={Colors.primary} />
            </Pressable>
          </View>
        </View>
        <Text style={styles.cartItemLineTotal}>
          Line total: ₹{(item.price * item.quantity).toLocaleString('en-IN')}
        </Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getTotal, updateQuantity, removeItem, clearCart, shopName } = useCartStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Address form state
  const [addressName, setAddressName] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [addressCity, setAddressCity] = useState('Hyderabad');
  const [addressPin, setAddressPin] = useState('');
  const [addressPhone, setAddressPhone] = useState('');

  const subtotal = getTotal();
  const deliveryFee = subtotal >= 2000 ? 0 : 50;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + gst;

  // CTA button scale animation
  const ctaScale = useSharedValue(1);
  const ctaStyle = useAnimatedStyle(() => ({ transform: [{ scale: ctaScale.value }] }));

  const handleCtaPress = () => {
    ctaScale.value = withSpring(0.95, { damping: 10 }, () => {
      ctaScale.value = withSpring(1);
    });

    if (step === 1) {
      if (items.length === 0) return;
      setStep(2);
    } else if (step === 2) {
      if (!addressName.trim() || !addressLine.trim() || !addressPin.trim()) {
        Alert.alert('Required', 'Please fill in all address fields.');
        return;
      }
      setStep(3);
    } else {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = () => {
    setIsLoading(true);
    setTimeout(() => {
      clearCart();
      const orderId = `BM-${Math.floor(10000 + Math.random() * 90000)}`;
      router.replace(`/(app)/order-success?orderId=${orderId}&total=${total.toLocaleString('en-IN')}` as never);
    }, 1500);
  };

  // Empty cart state
  if (items.length === 0 && step === 1) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={styles.header} entering={FadeInUp.duration(350)}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={styles.headerBtn} />
        </Animated.View>
        <Animated.View style={styles.emptyCart} entering={FadeInDown.delay(100).springify()}>
          <View style={styles.emptyCartIcon}>
            <Ionicons name="cart-outline" size={52} color={Colors.textMuted} />
          </View>
          <Text style={styles.emptyCartTitle}>Cart is empty</Text>
          <Text style={styles.emptyCartSub}>Add construction materials to get started</Text>
          <Pressable
            style={styles.emptyCartBtn}
            onPress={() => router.push('/(app)/(tabs)/shop')}
          >
            <Text style={styles.emptyCartBtnText}>Browse Shop</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    );
  }

  const ctaLabel = step === 1 ? 'Proceed to Address'
    : step === 2 ? 'Review Order'
    : isLoading ? 'Placing Order...'
    : 'Place Order';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInUp.duration(350)}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => step > 1 ? setStep(step - 1) : router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        {step === 1 && (
          <Pressable
            style={styles.headerBtn}
            onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: clearCart },
            ])}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.error} />
          </Pressable>
        )}
        {step > 1 && <View style={styles.headerBtn} />}
      </Animated.View>

      {/* Step Indicator */}
      <StepIndicator step={step} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Step 1: Cart */}
        {step === 1 && (
          <Animated.View entering={FadeInDown.delay(60).springify().damping(18).stiffness(200)}>
            {/* Shop Badge */}
            <View style={styles.shopBadge}>
              <Ionicons name="storefront-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.shopBadgeText}>{shopName ?? 'BuildMart Store'}</Text>
            </View>

            {/* Delivery Time */}
            <View style={styles.deliveryBanner}>
              <Ionicons name="time-outline" size={16} color={Colors.info} />
              <Text style={styles.deliveryBannerText}>Estimated delivery: 2–4 hours</Text>
            </View>

            {/* Cart Items */}
            {items.map((item, i) => (
              <Animated.View
                key={item.inventoryId}
                entering={FadeInDown.delay(i * 60).springify().damping(18).stiffness(200)}
              >
                <CartItemRow
                  item={item}
                  onInc={() => updateQuantity(item.inventoryId, item.quantity + 1)}
                  onDec={() => updateQuantity(item.inventoryId, item.quantity - 1)}
                  onRemove={() => removeItem(item.inventoryId)}
                />
              </Animated.View>
            ))}

            {/* Price Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>PRICE SUMMARY</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</Text>
                <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={[styles.summaryValue, deliveryFee === 0 && styles.freeText]}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </Text>
              </View>
              {deliveryFee === 0 && (
                <Text style={styles.freeDeliveryNote}>
                  Free delivery on orders above ₹2,000
                </Text>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>GST (5%)</Text>
                <Text style={styles.summaryValue}>₹{gst.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{total.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <Animated.View entering={FadeInDown.delay(60).springify().damping(18).stiffness(200)}>
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>DELIVERY ADDRESS</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Site / Location Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={addressName}
                  onChangeText={setAddressName}
                  placeholder="e.g., Construction Site A, My Home"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Street Address *</Text>
                <TextInput
                  style={styles.textInput}
                  value={addressLine}
                  onChangeText={setAddressLine}
                  placeholder="Plot no, Street, Colony"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View style={styles.fieldRow}>
                <View style={[styles.fieldGroup, styles.fieldHalf]}>
                  <Text style={styles.fieldLabel}>City</Text>
                  <TextInput
                    style={styles.textInput}
                    value={addressCity}
                    onChangeText={setAddressCity}
                    placeholder="City"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
                <View style={[styles.fieldGroup, styles.fieldHalf]}>
                  <Text style={styles.fieldLabel}>PIN Code *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={addressPin}
                    onChangeText={setAddressPin}
                    placeholder="500001"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Contact Phone</Text>
                <TextInput
                  style={styles.textInput}
                  value={addressPhone}
                  onChangeText={setAddressPhone}
                  placeholder="+91 98765 43210"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.saveAddressRow}>
                <Ionicons name="bookmark-outline" size={16} color={Colors.primary} />
                <Text style={styles.saveAddressText}>Save this address for future orders</Text>
              </View>
            </View>

            {/* Order Summary for context */}
            <View style={styles.miniSummary}>
              <View style={styles.miniSummaryRow}>
                <Text style={styles.miniSummaryLabel}>{items.length} items from {shopName ?? 'BuildMart'}</Text>
                <Text style={styles.miniSummaryTotal}>₹{total.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <Animated.View entering={FadeInDown.delay(60).springify().damping(18).stiffness(200)}>
            {/* Order Items Summary */}
            <View style={styles.confirmSection}>
              <Text style={styles.confirmSectionTitle}>ORDER ITEMS</Text>
              {items.map((item) => (
                <View key={item.inventoryId} style={styles.confirmItemRow}>
                  <Text style={styles.confirmItemName} numberOfLines={1}>{item.productName}</Text>
                  <Text style={styles.confirmItemQty}>× {item.quantity}</Text>
                  <Text style={styles.confirmItemTotal}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}
            </View>

            {/* Delivery Address */}
            <View style={styles.confirmSection}>
              <Text style={styles.confirmSectionTitle}>DELIVERY TO</Text>
              <View style={styles.confirmAddressRow}>
                <Ionicons name="location-outline" size={16} color={Colors.primary} />
                <View style={styles.confirmAddressText}>
                  <Text style={styles.confirmAddressName}>{addressName}</Text>
                  <Text style={styles.confirmAddressLine}>{addressLine}, {addressCity} — {addressPin}</Text>
                </View>
              </View>
            </View>

            {/* Payment */}
            <View style={styles.confirmSection}>
              <Text style={styles.confirmSectionTitle}>PAYMENT</Text>
              <View style={styles.paymentCard}>
                <View style={styles.paymentIconWrap}>
                  <Ionicons name="wallet" size={20} color={Colors.white} />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentTitle}>BuildMart Wallet Escrow</Text>
                  <Text style={styles.paymentSub}>Funds released on delivery confirmation</Text>
                </View>
                <View style={styles.paymentActive}>
                  <Text style={styles.paymentActiveText}>ACTIVE</Text>
                </View>
              </View>
            </View>

            {/* Final Price Breakdown */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>FINAL TOTAL</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={[styles.summaryValue, deliveryFee === 0 && styles.freeText]}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>GST (5%)</Text>
                <Text style={styles.summaryValue}>₹{gst.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Amount to Pay</Text>
                <Text style={styles.totalValue}>₹{total.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            {/* Trust Row */}
            <View style={styles.trustRow}>
              {[
                { icon: 'shield-checkmark-outline' as const, label: 'Secure Escrow' },
                { icon: 'checkmark-circle-outline' as const, label: 'Vetted Shops' },
                { icon: 'headset-outline' as const, label: '24/7 Support' },
              ].map((t) => (
                <View key={t.label} style={styles.trustItem}>
                  <Ionicons name={t.icon} size={18} color={Colors.success} />
                  <Text style={styles.trustLabel}>{t.label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarLeft}>
          <Text style={styles.bottomTotal}>₹{total.toLocaleString('en-IN')}</Text>
          <Text style={styles.bottomSubtotal}>incl. GST + delivery</Text>
        </View>
        <Animated.View style={ctaStyle}>
          <Pressable
            style={[styles.ctaBtn, isLoading && styles.ctaBtnLoading]}
            onPress={handleCtaPress}
            disabled={isLoading}
          >
            {isLoading ? (
              <Ionicons name="reload-outline" size={18} color={Colors.white} />
            ) : (
              <Ionicons
                name={step === 3 ? 'checkmark-circle-outline' : 'arrow-forward'}
                size={18}
                color={Colors.white}
              />
            )}
            <Text style={styles.ctaBtnText}>{ctaLabel}</Text>
          </Pressable>
        </Animated.View>
      </View>

      {step === 3 && (
        <Text style={styles.legalText}>
          By placing this order you agree to BuildMart's Terms of Purchase & Escrow Policy
        </Text>
      )}
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
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stepBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 0,
  },
  stepItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 0,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepCircleActive: {
    borderColor: Colors.primary,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  stepNumActive: {
    color: Colors.primary,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    marginLeft: 6,
  },
  stepLabelActive: {
    color: Colors.primary,
  },
  stepLine: {
    width: 36,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 6,
  },
  stepLineDone: {
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    paddingBottom: 120,
    padding: 16,
  },
  shopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  shopBadgeText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  deliveryBannerText: {
    fontSize: 13,
    color: Colors.info,
    fontWeight: '600',
  },
  cartItemRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
    gap: 12,
  },
  cartItemIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  removeBtn: {
    padding: 2,
  },
  cartItemUnit: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  cartItemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cartItemLineTotal: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    minWidth: 18,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#F0F2F8',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  freeText: {
    color: Colors.success,
  },
  freeDeliveryNote: {
    fontSize: 11,
    color: Colors.success,
    marginTop: -6,
    marginBottom: 10,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  formSection: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  formSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 7,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldHalf: {
    flex: 1,
  },
  saveAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
  },
  saveAddressText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  miniSummary: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  miniSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniSummaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  miniSummaryTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  confirmSection: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  confirmSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  confirmItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  confirmItemName: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  confirmItemQty: {
    fontSize: 13,
    color: Colors.textMuted,
    marginRight: 12,
  },
  confirmItemTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  confirmAddressRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  confirmAddressText: {
    flex: 1,
  },
  confirmAddressName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  confirmAddressLine: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  paymentSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  paymentActive: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paymentActiveText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.success,
    letterSpacing: 0.5,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  trustItem: {
    alignItems: 'center',
    gap: 6,
  },
  trustLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bottomBarLeft: {
    flex: 1,
  },
  bottomTotal: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  bottomSubtotal: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaBtnLoading: {
    opacity: 0.7,
  },
  ctaBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  legalText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 10,
  },
  emptyCartIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyCartTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptyCartSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
  emptyCartBtn: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  emptyCartBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});
