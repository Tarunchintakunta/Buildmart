import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useCartStore } from '../../src/store/cart.store';
import { LightTheme as T, Colors } from '../../src/theme/colors';
import { MOCK_PRODUCTS } from '../../src/constants/mockData';

const SPRING_SNAPPY = { damping: 18, stiffness: 280, mass: 0.8 };
const SPRING_BOUNCY = { damping: 12, stiffness: 200, mass: 0.9 };

const INITIAL_WISHLIST = MOCK_PRODUCTS.slice(0, 6).map((p) => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  price: p.price,
  unit: p.unit,
  image: p.image,
  category: p.category,
  inStock: p.inStock,
  rating: p.rating,
}));

function WishlistCard({
  item,
  index,
  onRemove,
  onAddToCart,
}: {
  item: typeof INITIAL_WISHLIST[0];
  index: number;
  onRemove: () => void;
  onAddToCart: () => void;
}) {
  const cardScale = useSharedValue(1);
  const cartScale = useSharedValue(1);
  const removeScale = useSharedValue(1);
  const heartScale = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: cardScale.value }] }));
  const cartStyle = useAnimatedStyle(() => ({ transform: [{ scale: cartScale.value }] }));
  const removeStyle = useAnimatedStyle(() => ({ transform: [{ scale: removeScale.value }] }));
  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heartScale.value }] }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70).springify().damping(16)}
      style={[styles.card, cardStyle]}
    >
      {/* Remove X button */}
      <Animated.View style={[styles.removeBtn, removeStyle]}>
        <Pressable
          style={styles.removeBtnInner}
          onPress={() => {
            removeScale.value = withSpring(1.2, SPRING_BOUNCY, () => {
              removeScale.value = withSpring(1, SPRING_BOUNCY);
            });
            onRemove();
          }}
          onPressIn={() => { removeScale.value = withSpring(0.85, SPRING_SNAPPY); }}
          onPressOut={() => { removeScale.value = withSpring(1, SPRING_SNAPPY); }}
        >
          <Ionicons name="close" size={14} color={T.white} />
        </Pressable>
      </Animated.View>

      {/* Image */}
      <View style={styles.imageBox}>
        <Image
          source={{ uri: item.image as string }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      {/* Heart */}
      <Animated.View style={[styles.heartBtn, heartStyle]}>
        <Pressable
          onPress={() => {
            heartScale.value = withSpring(1.3, SPRING_BOUNCY, () => {
              heartScale.value = withSpring(1, SPRING_BOUNCY);
            });
          }}
        >
          <Ionicons name="heart" size={18} color={T.amber} />
        </Pressable>
      </Animated.View>

      {/* Info */}
      <View style={styles.cardBody}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.unit}>{item.unit}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price.toLocaleString('en-IN')}</Text>
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={10} color="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        {!item.inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      {/* Add to Cart */}
      <Animated.View style={cartStyle}>
        <Pressable
          style={[styles.cartBtn, !item.inStock && styles.cartBtnDisabled]}
          disabled={!item.inStock}
          onPress={() => {
            cartScale.value = withSpring(0.9, SPRING_BOUNCY, () => {
              cartScale.value = withSpring(1, SPRING_BOUNCY);
            });
            onAddToCart();
          }}
          onPressIn={() => { if (item.inStock) cartScale.value = withSpring(0.95, SPRING_SNAPPY); }}
          onPressOut={() => { cartScale.value = withSpring(1, SPRING_SNAPPY); }}
        >
          <Ionicons
            name="cart-outline"
            size={15}
            color={item.inStock ? T.white : T.textMuted}
          />
          <Text style={[styles.cartBtnText, !item.inStock && styles.cartBtnTextDisabled]}>
            {item.inStock ? 'Add to Cart' : 'Unavailable'}
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

export default function WishlistScreen() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [items, setItems] = useState(INITIAL_WISHLIST);

  const totalValue = items.reduce((sum, i) => sum + i.price, 0);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addToCart = (item: typeof INITIAL_WISHLIST[0]) => {
    addItem({
      inventory_id: item.id,
      product: { id: item.id, name: item.name, description: item.brand, unit: item.unit } as any,
      shop: { id: 'shop-1', name: 'BuildMart Store' } as any,
      quantity: 1,
      price: item.price,
    });
    removeItem(item.id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Wishlist</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{items.length}</Text>
          </View>
        </View>
        <View style={{ width: 42 }} />
      </Animated.View>

      {items.length === 0 ? (
        /* Empty State */
        <Animated.View entering={ZoomIn.delay(60).springify()} style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="heart-outline" size={44} color={T.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptyDesc}>Save items you love and revisit them anytime</Text>
          <Pressable style={styles.browseBtn} onPress={() => router.push('/(app)/search' as any)}>
            <Ionicons name="search-outline" size={16} color={T.white} />
            <Text style={styles.browseBtnText}>Browse Products</Text>
          </Pressable>
        </Animated.View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Grid */}
            <View style={styles.grid}>
              {items.map((item, i) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  index={i}
                  onRemove={() => removeItem(item.id)}
                  onAddToCart={() => addToCart(item)}
                />
              ))}
            </View>

            {/* Spacer for bottom bar */}
            <View style={{ height: 16 }} />
          </ScrollView>

          {/* Total Value Row */}
          <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.bottomBar}>
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Total Value</Text>
                <Text style={styles.totalValue}>₹{totalValue.toLocaleString('en-IN')}</Text>
              </View>
              <Pressable
                style={styles.addAllBtn}
                onPress={() => {
                  items.filter((i) => i.inStock).forEach((i) => addToCart(i));
                }}
              >
                <Ionicons name="cart-outline" size={16} color={T.white} />
                <Text style={styles.addAllText}>Add All to Cart</Text>
              </Pressable>
            </View>
          </Animated.View>
        </>
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: T.text,
  },
  countBadge: {
    backgroundColor: T.amber,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: T.white,
  },
  scrollContent: {
    paddingTop: 14,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47.5%',
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
    padding: 0,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  removeBtnInner: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBox: {
    height: 130,
    backgroundColor: T.bg,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cardBody: {
    padding: 10,
  },
  brand: {
    fontSize: 10,
    fontWeight: '700',
    color: T.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: T.text,
    lineHeight: 18,
    marginBottom: 2,
  },
  unit: {
    fontSize: 11,
    color: T.textMuted,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: T.text,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFBEB',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  outOfStockBadge: {
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  outOfStockText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.error,
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: T.navy,
    paddingVertical: 10,
    margin: 10,
    marginTop: 0,
    borderRadius: 10,
  },
  cartBtnDisabled: {
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
  },
  cartBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: T.white,
  },
  cartBtnTextDisabled: {
    color: T.textMuted,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: T.text,
  },
  emptyDesc: {
    fontSize: 14,
    color: T.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: T.navy,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  browseBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: T.white,
  },
  bottomBar: {
    backgroundColor: T.surface,
    borderTopWidth: 1,
    borderTopColor: T.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 12,
    color: T.textSecondary,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: T.text,
    marginTop: 2,
  },
  addAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: T.navy,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  addAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: T.white,
  },
});
