import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useCartStore } from '../../../src/store/cart.store';
import { LightTheme as T, Colors } from '../../../src/theme/colors';
import { MOCK_PRODUCTS } from '../../../src/constants/mockData';

const SPRING_SNAPPY = { damping: 18, stiffness: 280, mass: 0.8 };
const SPRING_BOUNCY = { damping: 12, stiffness: 200, mass: 0.9 };

const BULK_CATEGORIES = ['Cement', 'Steel'];

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const addItem = useCartStore((s) => s.addItem);

  const product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];

  const [qty, setQty] = useState(1);
  const [isFav, setIsFav] = useState(false);

  const cartScale = useSharedValue(1);
  const cartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cartScale.value }],
  }));

  const qtyMinusScale = useSharedValue(1);
  const qtyPlusScale = useSharedValue(1);
  const qtyMinusStyle = useAnimatedStyle(() => ({ transform: [{ scale: qtyMinusScale.value }] }));
  const qtyPlusStyle = useAnimatedStyle(() => ({ transform: [{ scale: qtyPlusScale.value }] }));

  const favScale = useSharedValue(1);
  const favAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: favScale.value }] }));

  const handleAddToCart = () => {
    cartScale.value = withSpring(0.93, SPRING_BOUNCY, () => {
      cartScale.value = withSpring(1, SPRING_BOUNCY);
    });
    addItem({
      inventory_id: product.id,
      product: { id: product.id, name: product.name, description: product.description, unit: product.unit } as any,
      shop: { id: 'shop-1', name: 'BuildMart Main Store' } as any,
      quantity: qty,
      price: product.price,
    });
    Alert.alert('Added to Cart!', `${qty}x ${product.name} added to your cart.`);
  };

  const showBulkPricing = BULK_CATEGORIES.includes(product.category);

  const bulkTiers = [
    { range: '1–9 units', price: product.price, badge: null },
    { range: '10–49 units', price: Math.round(product.price * 0.91), badge: 'BEST VALUE' },
    { range: '50+ units', price: Math.round(product.price * 0.83), badge: null },
  ];

  const specs = [
    { label: 'Category', value: product.category },
    { label: 'Brand', value: product.brand },
    { label: 'Rating', value: `${product.rating} / 5.0` },
    { label: 'Reviews', value: product.reviews.toLocaleString('en-IN') },
  ];

  const stars = [85, 10, 3, 1.5, 0.5];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>Product Details</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerBtn}>
            <Ionicons name="share-outline" size={20} color={T.text} />
          </Pressable>
          <Animated.View style={favAnimStyle}>
            <Pressable
              style={styles.headerBtn}
              onPress={() => {
                favScale.value = withSpring(1.3, SPRING_BOUNCY, () => {
                  favScale.value = withSpring(1, SPRING_BOUNCY);
                });
                setIsFav(!isFav);
              }}
            >
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={20}
                color={isFav ? Colors.error : T.text}
              />
            </Pressable>
          </Animated.View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Product Image */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.imageArea}>
          <Image
            source={{ uri: product.image as string }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {product.badge && (
            <View style={styles.badgeOverlay}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
        </Animated.View>

        {/* Product Info */}
        <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.infoSection}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{product.category}  ·  {product.brand}</Text>
          </View>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.price}>
            ₹{product.price.toLocaleString('en-IN')}
            <Text style={styles.priceUnit}> / {product.unit}</Text>
          </Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.statusRow}>
            {product.inStock && (
              <View style={styles.statusItem}>
                <Ionicons name="checkmark-circle" size={16} color={T.success} />
                <Text style={styles.statusText}>In Stock ({product.stock?.toLocaleString('en-IN')} units)</Text>
              </View>
            )}
            <View style={styles.statusItem}>
              <Ionicons name="car" size={16} color={T.info} />
              <Text style={styles.statusText}>Fast Delivery</Text>
            </View>
          </View>
        </Animated.View>

        {/* Rating Card */}
        <Animated.View entering={FadeInDown.delay(140).springify()} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="star" size={18} color="#F59E0B" />
            <Text style={styles.cardTitle}>Rating & Reviews</Text>
          </View>
          <View style={styles.ratingContent}>
            <View style={styles.ratingLeft}>
              <Text style={styles.bigRating}>{product.rating}</Text>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map((s) => (
                  <Ionicons
                    key={s}
                    name={s <= Math.floor(product.rating) ? 'star' : 'star-outline'}
                    size={14}
                    color="#F59E0B"
                  />
                ))}
              </View>
              <Text style={styles.reviewCount}>{product.reviews.toLocaleString('en-IN')} reviews</Text>
            </View>
            <View style={styles.ratingBars}>
              {stars.map((pct, i) => (
                <View key={i} style={styles.starRow}>
                  <Text style={styles.starLabel}>{5 - i}</Text>
                  <View style={styles.starTrack}>
                    <View style={[styles.starFill, { width: `${pct}%` as any }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Bulk Pricing */}
        {showBulkPricing && (
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="pricetag" size={18} color={T.amber} />
              <Text style={styles.cardTitle}>Bulk Pricing</Text>
            </View>
            {bulkTiers.map((tier, i) => (
              <View key={i} style={[styles.tierRow, tier.badge ? styles.tierHighlight : null]}>
                <Text style={styles.tierRange}>{tier.range}</Text>
                <View style={styles.tierRight}>
                  <Text style={styles.tierPrice}>₹{tier.price.toLocaleString('en-IN')}</Text>
                  {tier.badge && (
                    <View style={styles.tierBadge}>
                      <Text style={styles.tierBadgeText}>{tier.badge}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Specifications */}
        <Animated.View entering={FadeInDown.delay(260).springify()} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="settings-outline" size={18} color={T.textSecondary} />
            <Text style={styles.cardTitle}>Specifications</Text>
          </View>
          <View style={styles.specGrid}>
            {specs.map((spec, i) => (
              <Animated.View
                key={i}
                entering={ZoomIn.delay(300 + i * 40).springify()}
                style={styles.specItem}
              >
                <Text style={styles.specLabel}>{spec.label}</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.bottomBar}>
        {/* Qty Selector */}
        <View style={styles.qtySelector}>
          <Animated.View style={qtyMinusStyle}>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => setQty(Math.max(1, qty - 1))}
              onPressIn={() => { qtyMinusScale.value = withSpring(0.85, SPRING_BOUNCY); }}
              onPressOut={() => { qtyMinusScale.value = withSpring(1, SPRING_BOUNCY); }}
            >
              <Ionicons name="remove" size={18} color={T.navy} />
            </Pressable>
          </Animated.View>
          <Text style={styles.qtyText}>{qty}</Text>
          <Animated.View style={qtyPlusStyle}>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => setQty(qty + 1)}
              onPressIn={() => { qtyPlusScale.value = withSpring(0.85, SPRING_BOUNCY); }}
              onPressOut={() => { qtyPlusScale.value = withSpring(1, SPRING_BOUNCY); }}
            >
              <Ionicons name="add" size={18} color={T.navy} />
            </Pressable>
          </Animated.View>
        </View>

        {/* Add to Cart */}
        <Animated.View style={[styles.cartBtnWrapper, cartAnimStyle]}>
          <Pressable
            style={styles.addCartBtn}
            onPress={handleAddToCart}
            onPressIn={() => { cartScale.value = withSpring(0.96, SPRING_SNAPPY); }}
            onPressOut={() => { cartScale.value = withSpring(1, SPRING_SNAPPY); }}
          >
            <Ionicons name="cart-outline" size={18} color={T.white} />
            <Text style={styles.addCartText}>Add to Cart</Text>
          </Pressable>
        </Animated.View>

        {/* Buy Now */}
        <Pressable style={styles.buyBtn}>
          <Text style={styles.buyText}>Buy Now</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: T.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
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
    color: T.text,
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageArea: {
    height: 260,
    backgroundColor: T.bg,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: T.amber,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: T.white,
    letterSpacing: 0.5,
  },
  infoSection: {
    padding: 16,
    backgroundColor: T.surface,
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#F0F1F5',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: T.textSecondary,
    letterSpacing: 0.3,
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    color: T.text,
    lineHeight: 28,
    marginBottom: 8,
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: T.text,
    marginBottom: 10,
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: T.textMuted,
  },
  description: {
    fontSize: 14,
    color: T.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textSecondary,
  },
  card: {
    backgroundColor: T.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  ratingLeft: {
    alignItems: 'center',
  },
  bigRating: {
    fontSize: 40,
    fontWeight: '800',
    color: T.text,
    lineHeight: 44,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: T.textMuted,
  },
  ratingBars: {
    flex: 1,
    gap: 5,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: T.textMuted,
    width: 12,
    textAlign: 'right',
  },
  starTrack: {
    flex: 1,
    height: 6,
    backgroundColor: T.bg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  starFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  tierHighlight: {
    backgroundColor: '#FFFBEB',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tierRange: {
    fontSize: 14,
    color: T.textSecondary,
  },
  tierRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: T.text,
  },
  tierBadge: {
    backgroundColor: T.amber,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tierBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: T.white,
    letterSpacing: 0.5,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  specItem: {
    width: '47%',
    backgroundColor: T.bg,
    borderRadius: 10,
    padding: 12,
  },
  specLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: T.textMuted,
    marginBottom: 4,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '700',
    color: T.text,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    backgroundColor: T.surface,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: T.bg,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
    minWidth: 28,
    textAlign: 'center',
  },
  cartBtnWrapper: {
    flex: 1,
  },
  addCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: T.navy,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 6,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  addCartText: {
    fontSize: 14,
    fontWeight: '700',
    color: T.white,
  },
  buyBtn: {
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: T.navy,
  },
  buyText: {
    fontSize: 14,
    fontWeight: '700',
    color: T.navy,
  },
});
