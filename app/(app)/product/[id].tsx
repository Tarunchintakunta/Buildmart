import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../../src/store/useStore';
import { LightTheme } from '../../../src/theme/designSystem';
import { getProductImage } from '../../../src/constants/images';

const T = LightTheme;

const PRODUCT = {
  id: '1',
  name: 'Premium Heavy-Duty Portland Cement - 50kg',
  sku: 'BM-CEM-50KG',
  price: 18.50,
  priceINR: 450,
  unit: 'bag',
  inStock: true,
  fastDelivery: true,
  rating: 4.8,
  reviews: 1240,
  stars: [85, 10, 3, 1.5, 0.5],
  priceTiers: [
    { range: '1-9 Bags', price: 450, badge: null },
    { range: '10-49 Bags', price: 410, badge: 'BEST VALUE' },
    { range: '50+ Bags', price: 375, badge: null },
  ],
  specs: [
    { label: 'Compressive Strength', value: '42.5N / mm²' },
    { label: 'Setting Time', value: '90 - 120 mins' },
    { label: 'Material Base', value: 'Limestone/Shale' },
    { label: 'Usage', value: 'Structural & Mortar' },
  ],
};

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [qty, setQty] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      inventory_id: PRODUCT.id,
      product: { id: PRODUCT.id, name: PRODUCT.name, description: PRODUCT.sku } as any,
      shop: { id: 'shop-1', name: 'BuildMart Main Store' } as any,
      quantity: qty,
      price: PRODUCT.priceINR,
    });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Product Details</Text>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <TouchableOpacity style={s.headerBtn}>
            <Ionicons name="share-outline" size={20} color={T.text} />
          </TouchableOpacity>
          <TouchableOpacity style={s.headerBtn} onPress={() => setIsFav(!isFav)}>
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={isFav ? '#EF4444' : T.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Product Image */}
        <View style={s.imageArea}>
          <Image source={getProductImage(PRODUCT.name)} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>

        {/* Product Info */}
        <View style={s.infoSection}>
          <View style={s.skuBadge}>
            <Text style={s.skuText}>Premium Grade  SKU: {PRODUCT.sku}</Text>
          </View>
          <Text style={s.productName}>{PRODUCT.name}</Text>
          <Text style={s.price}>Rs.{PRODUCT.priceINR} <Text style={s.priceUnit}>/ {PRODUCT.unit}</Text></Text>

          {/* Status */}
          <View style={s.statusRow}>
            {PRODUCT.inStock && (
              <View style={s.statusItem}>
                <Ionicons name="checkmark-circle" size={16} color={T.success} />
                <Text style={s.statusText}>In Stock</Text>
              </View>
            )}
            {PRODUCT.fastDelivery && (
              <View style={s.statusItem}>
                <Ionicons name="car" size={16} color={T.info} />
                <Text style={s.statusText}>Fast Delivery</Text>
              </View>
            )}
          </View>
        </View>

        {/* Rating Card */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Ionicons name="star" size={18} color="#F59E0B" />
            <Text style={s.cardTitle}>Rating & Reviews</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={s.bigRating}>{PRODUCT.rating}</Text>
              <Text style={s.reviewCount}>{PRODUCT.reviews.toLocaleString()} reviews</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              {PRODUCT.stars.map((pct, i) => (
                <View key={i} style={s.starRow}>
                  <Text style={s.starLabel}>{5 - i}</Text>
                  <View style={s.starTrack}>
                    <View style={[s.starFill, { width: `${pct}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Pricing Tiers */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Ionicons name="pricetag" size={18} color={T.amber} />
            <Text style={s.cardTitle}>Bulk Pricing</Text>
          </View>
          {PRODUCT.priceTiers.map((tier, i) => (
            <View key={i} style={[s.tierRow, tier.badge ? s.tierRowHighlight : null]}>
              <Text style={s.tierRange}>{tier.range}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={s.tierPrice}>Rs.{tier.price}</Text>
                {tier.badge && (
                  <View style={s.tierBadge}><Text style={s.tierBadgeText}>{tier.badge}</Text></View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Specifications */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Ionicons name="settings-outline" size={18} color={T.textSecondary} />
            <Text style={s.cardTitle}>Specifications</Text>
          </View>
          <View style={s.specGrid}>
            {PRODUCT.specs.map((spec, i) => (
              <View key={i} style={s.specItem}>
                <Text style={s.specLabel}>{spec.label}</Text>
                <Text style={s.specValue}>{spec.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={s.bottomBar}>
        <View style={s.qtySelector}>
          <TouchableOpacity style={s.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
            <Ionicons name="remove" size={18} color={T.navy} />
          </TouchableOpacity>
          <Text style={s.qtyText}>{qty}</Text>
          <TouchableOpacity style={s.qtyBtn} onPress={() => setQty(qty + 1)}>
            <Ionicons name="add" size={18} color={T.navy} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={s.addCartBtn} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={18} color={T.white} />
          <Text style={s.addCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.buyBtn}>
          <Text style={s.buyText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = {
  header: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border },
  headerBtn: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center' as const, alignItems: 'center' as const },
  headerTitle: { fontSize: 18, fontWeight: '700' as const, color: T.text },
  imageArea: { height: 240, backgroundColor: T.bg, justifyContent: 'center' as const, alignItems: 'center' as const, overflow: 'hidden' as const },
  infoSection: { padding: 16 },
  skuBadge: { backgroundColor: '#F0F1F5', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' as const, marginBottom: 10 },
  skuText: { fontSize: 11, fontWeight: '600' as const, color: T.textSecondary, letterSpacing: 0.3 },
  productName: { fontSize: 22, fontWeight: '800' as const, color: T.text, lineHeight: 28, marginBottom: 8 },
  price: { fontSize: 24, fontWeight: '800' as const, color: T.text },
  priceUnit: { fontSize: 14, fontWeight: '500' as const, color: T.textMuted },
  statusRow: { flexDirection: 'row' as const, gap: 16, marginTop: 12 },
  statusItem: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6 },
  statusText: { fontSize: 13, fontWeight: '600' as const, color: T.textSecondary },
  card: { backgroundColor: T.surface, marginHorizontal: 16, marginBottom: 12, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  cardHeader: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700' as const, color: T.text },
  bigRating: { fontSize: 36, fontWeight: '800' as const, color: T.text },
  reviewCount: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  starRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6 },
  starLabel: { fontSize: 11, fontWeight: '600' as const, color: T.textMuted, width: 12, textAlign: 'right' as const },
  starTrack: { flex: 1, height: 6, backgroundColor: T.bg, borderRadius: 3, overflow: 'hidden' as const },
  starFill: { height: '100%' as const, backgroundColor: '#F59E0B', borderRadius: 3 },
  tierRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.border },
  tierRowHighlight: { backgroundColor: '#FFFBEB', marginHorizontal: -16, paddingHorizontal: 16, borderRadius: 8 },
  tierRange: { fontSize: 14, color: T.textSecondary },
  tierPrice: { fontSize: 15, fontWeight: '700' as const, color: T.text },
  tierBadge: { backgroundColor: T.amber, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tierBadgeText: { fontSize: 9, fontWeight: '700' as const, color: T.white, letterSpacing: 0.5 },
  specGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, marginTop: 12, gap: 12 },
  specItem: { width: '47%' as const, backgroundColor: T.bg, borderRadius: 10, padding: 12 },
  specLabel: { fontSize: 11, fontWeight: '600' as const, color: T.textMuted, marginBottom: 4 },
  specValue: { fontSize: 14, fontWeight: '700' as const, color: T.text },
  bottomBar: { flexDirection: 'row' as const, padding: 16, gap: 10, backgroundColor: T.surface, borderTopWidth: 1, borderTopColor: T.border },
  qtySelector: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, backgroundColor: T.bg, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 6 },
  qtyBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, justifyContent: 'center' as const, alignItems: 'center' as const },
  qtyText: { fontSize: 16, fontWeight: '700' as const, color: T.text, minWidth: 24, textAlign: 'center' as const },
  addCartBtn: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.navy, borderRadius: 12, paddingVertical: 14, gap: 6 },
  addCartText: { fontSize: 14, fontWeight: '700' as const, color: T.white },
  buyBtn: { paddingHorizontal: 20, justifyContent: 'center' as const, alignItems: 'center' as const, borderRadius: 12, borderWidth: 2, borderColor: T.navy },
  buyText: { fontSize: 14, fontWeight: '700' as const, color: T.navy },
};
