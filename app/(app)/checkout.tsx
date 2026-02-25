import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../src/store/useStore';
import { LightTheme } from '../../src/theme/designSystem';
import { getProductImage } from '../../src/constants/images';

const T = LightTheme;

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getTotal, updateQuantity, removeItem, clearCart } = useCartStore();
  const [step, setStep] = useState(1); // 1=Cart, 2=Details, 3=Finish

  const subtotal = getTotal();
  const deliveryFee = subtotal >= 5000 ? 0 : 45;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = () => {
    clearCart();
    router.replace(`/(app)/order-success?orderId=BM-${Math.floor(10000 + Math.random() * 90000)}&total=${total.toLocaleString()}` as any);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={T.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Your Cart</Text>
          <View style={{ width: 42 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Ionicons name="cart-outline" size={64} color={T.textMuted} />
          <Text style={{ fontSize: 20, fontWeight: '700', color: T.text, marginTop: 16 }}>Cart is empty</Text>
          <Text style={{ fontSize: 14, color: T.textSecondary, textAlign: 'center', marginTop: 8 }}>Browse our shop to add materials</Text>
          <TouchableOpacity
            style={{ backgroundColor: T.navy, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14, marginTop: 24 }}
            onPress={() => router.push('/(app)/(tabs)/shop')}
          >
            <Text style={{ color: T.white, fontWeight: '700', fontSize: 15 }}>Browse Shop</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Checkout</Text>
        <TouchableOpacity onPress={() => clearCart()} style={s.backBtn}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Progress Steps */}
      <View style={s.steps}>
        {['Cart', 'Details', 'Finish'].map((label, i) => (
          <View key={label} style={s.stepItem}>
            <View style={[s.stepCircle, step > i && s.stepCircleDone, step === i + 1 && s.stepCircleActive]}>
              {step > i + 1 ? (
                <Ionicons name="checkmark" size={14} color={T.white} />
              ) : (
                <Text style={[s.stepNum, (step === i + 1 || step > i) && s.stepNumActive]}>{i + 1}</Text>
              )}
            </View>
            <Text style={[s.stepLabel, step === i + 1 && s.stepLabelActive]}>{label}</Text>
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Vendor Badge */}
        <View style={s.vendorBadge}>
          <Ionicons name="storefront-outline" size={16} color={T.textSecondary} />
          <Text style={s.vendorText}>Shopping from {items[0]?.shop?.name ?? 'BuildMart'}</Text>
        </View>

        {/* Delivery Estimate */}
        <View style={s.deliveryBadge}>
          <Ionicons name="car-outline" size={16} color={T.info} />
          <Text style={s.deliveryText}>Delivery: Today, 2:00 PM - 5:00 PM</Text>
        </View>

        {/* Cart Items */}
        {items.map((item) => (
          <View key={item.inventory_id} style={s.itemCard}>
            <View style={s.itemImage}>
              <Image source={getProductImage(item.product.name)} style={{ width: '100%', height: '100%', borderRadius: 10 }} resizeMode="cover" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={s.itemName} numberOfLines={1}>{item.product.name}</Text>
                <TouchableOpacity onPress={() => removeItem(item.inventory_id)}>
                  <Ionicons name="close" size={18} color={T.textMuted} />
                </TouchableOpacity>
              </View>
              <Text style={s.itemDesc} numberOfLines={1}>{item.product.description}</Text>
              <View style={s.itemBottom}>
                <Text style={s.itemPrice}>Rs.{item.price.toLocaleString()}</Text>
                <View style={s.qtyRow}>
                  <TouchableOpacity style={s.qtyBtn} onPress={() => updateQuantity(item.inventory_id, item.quantity - 1)}>
                    <Ionicons name="remove" size={14} color={T.navy} />
                  </TouchableOpacity>
                  <Text style={s.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity style={s.qtyBtn} onPress={() => updateQuantity(item.inventory_id, item.quantity + 1)}>
                    <Ionicons name="add" size={14} color={T.navy} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Delivery Address */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Ionicons name="location-outline" size={18} color={T.text} />
            <Text style={s.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity><Text style={s.changeLink}>Change</Text></TouchableOpacity>
          </View>
          <Text style={s.addressText}>Construction Site A, 452 Industrial Way, West Harbor</Text>
        </View>

        {/* Payment Method */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Ionicons name="wallet-outline" size={18} color={T.text} />
            <Text style={s.sectionTitle}>Payment Method</Text>
          </View>
          <View style={s.paymentCard}>
            <View>
              <Text style={s.paymentMethod}>Wallet Escrow</Text>
              <Text style={s.paymentSub}>BuildMart Secure Pay</Text>
            </View>
            <View style={s.activeBadge}>
              <Text style={s.activeText}>ACTIVE</Text>
            </View>
          </View>
          <Text style={s.escrowNote}>Funds held in escrow until delivery confirmation.</Text>
        </View>

        {/* Trust Indicators */}
        <View style={s.trustRow}>
          {[
            { icon: 'shield-checkmark-outline' as const, label: 'Secure Escrow' },
            { icon: 'checkmark-circle-outline' as const, label: 'Vetted Vendors' },
            { icon: 'headset-outline' as const, label: '24/7 Support' },
          ].map((t) => (
            <View key={t.label} style={s.trustItem}>
              <Ionicons name={t.icon} size={18} color={T.success} />
              <Text style={s.trustText}>{t.label}</Text>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={s.summaryCard}>
          <Text style={s.summaryTitle}>Order Summary</Text>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Subtotal ({items.length} items)</Text>
            <Text style={s.summaryValue}>Rs.{subtotal.toLocaleString()}</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Delivery Fee</Text>
            <Text style={[s.summaryValue, deliveryFee === 0 && { color: T.success }]}>
              {deliveryFee === 0 ? 'FREE' : `Rs.${deliveryFee}`}
            </Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Tax (8%)</Text>
            <Text style={s.summaryValue}>Rs.{tax.toLocaleString()}</Text>
          </View>
          <View style={s.summaryDivider} />
          <View style={s.summaryRow}>
            <Text style={s.totalLabel}>Total Amount</Text>
            <Text style={s.totalValue}>Rs.{total.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.placeOrderBtn} onPress={handlePlaceOrder}>
          <Text style={s.placeOrderText}>Pay & Place Order</Text>
          <Ionicons name="arrow-forward" size={18} color={T.white} />
        </TouchableOpacity>
        <Text style={s.legalText}>
          By clicking, you agree to BuildMart's Terms of Purchase & Escrow Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const s = {
  header: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center' as const, alignItems: 'center' as const },
  headerTitle: { fontSize: 18, fontWeight: '700' as const, color: T.text },
  steps: { flexDirection: 'row' as const, justifyContent: 'center' as const, paddingVertical: 16, backgroundColor: T.surface, gap: 32 },
  stepItem: { alignItems: 'center' as const, gap: 6 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: T.bg, borderWidth: 2, borderColor: T.border, justifyContent: 'center' as const, alignItems: 'center' as const },
  stepCircleDone: { backgroundColor: T.navy, borderColor: T.navy },
  stepCircleActive: { borderColor: T.navy },
  stepNum: { fontSize: 12, fontWeight: '700' as const, color: T.textMuted },
  stepNumActive: { color: T.navy },
  stepLabel: { fontSize: 11, fontWeight: '600' as const, color: T.textMuted },
  stepLabelActive: { color: T.navy },
  vendorBadge: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, backgroundColor: T.surface, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: T.border, marginBottom: 8 },
  vendorText: { fontSize: 13, color: T.textSecondary, fontWeight: '500' as const },
  deliveryBadge: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, backgroundColor: '#EFF6FF', borderRadius: 10, padding: 12, marginBottom: 16 },
  deliveryText: { fontSize: 13, color: T.info, fontWeight: '600' as const },
  itemCard: { flexDirection: 'row' as const, backgroundColor: T.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: T.border, marginBottom: 10 },
  itemImage: { width: 64, height: 64, borderRadius: 10, backgroundColor: T.bg, justifyContent: 'center' as const, alignItems: 'center' as const, overflow: 'hidden' as const },
  itemName: { fontSize: 15, fontWeight: '700' as const, color: T.text, flex: 1, marginRight: 8 },
  itemDesc: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  itemBottom: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginTop: 10 },
  itemPrice: { fontSize: 16, fontWeight: '700' as const, color: T.text },
  qtyRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12, backgroundColor: T.bg, borderRadius: 8, paddingHorizontal: 4, paddingVertical: 4 },
  qtyBtn: { width: 26, height: 26, borderRadius: 7, backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, justifyContent: 'center' as const, alignItems: 'center' as const },
  qtyText: { fontSize: 14, fontWeight: '700' as const, color: T.text, minWidth: 20, textAlign: 'center' as const },
  section: { backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700' as const, color: T.text, flex: 1 },
  changeLink: { fontSize: 13, fontWeight: '600' as const, color: T.info },
  addressText: { fontSize: 14, color: T.textSecondary, lineHeight: 20 },
  paymentCard: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 8 },
  paymentMethod: { fontSize: 15, fontWeight: '700' as const, color: T.text },
  paymentSub: { fontSize: 12, color: T.textSecondary, marginTop: 2 },
  activeBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  activeText: { fontSize: 10, fontWeight: '700' as const, color: T.success, letterSpacing: 0.5 },
  escrowNote: { fontSize: 12, color: T.textMuted, fontStyle: 'italic' as const },
  trustRow: { flexDirection: 'row' as const, justifyContent: 'space-around' as const, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, marginBottom: 12 },
  trustItem: { alignItems: 'center' as const, gap: 6 },
  trustText: { fontSize: 11, fontWeight: '600' as const, color: T.textSecondary },
  summaryCard: { backgroundColor: '#F0F1F5', borderRadius: 14, padding: 16, marginBottom: 16 },
  summaryTitle: { fontSize: 14, fontWeight: '700' as const, color: T.text, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 14 },
  summaryRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: T.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600' as const, color: T.text },
  summaryDivider: { height: 1, backgroundColor: T.border, marginVertical: 8 },
  totalLabel: { fontSize: 17, fontWeight: '800' as const, color: T.text },
  totalValue: { fontSize: 17, fontWeight: '800' as const, color: T.text },
  bottomBar: { backgroundColor: T.surface, borderTopWidth: 1, borderTopColor: T.border, padding: 16 },
  placeOrderBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.navy, borderRadius: 14, paddingVertical: 16, gap: 8, shadowColor: T.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },
  placeOrderText: { fontSize: 16, fontWeight: '700' as const, color: T.white },
  legalText: { fontSize: 11, color: T.textMuted, textAlign: 'center' as const, marginTop: 10 },
};
