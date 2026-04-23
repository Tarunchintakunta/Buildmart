import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  RefreshControl,
  FlatList,
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
import { useCartStore } from '../../../src/store/cart.store';
import Colors from '../../../src/theme/colors';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'grid-outline' },
  { id: 'cement', label: 'Cement', icon: 'layers-outline' },
  { id: 'steel', label: 'Steel', icon: 'barbell-outline' },
  { id: 'bricks', label: 'Bricks', icon: 'apps-outline' },
  { id: 'paint', label: 'Paint', icon: 'color-palette-outline' },
  { id: 'pipes', label: 'Pipes', icon: 'git-branch-outline' },
  { id: 'hardware', label: 'Hardware', icon: 'hammer-outline' },
  { id: 'electric', label: 'Electric', icon: 'flash-outline' },
  { id: 'sand', label: 'Sand', icon: 'hourglass-outline' },
];

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  unit: string;
  category: string;
  badge?: string;
  badgeColor?: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}

const PRODUCTS: Product[] = [
  { id: 'p1', name: 'UltraTech PPC Cement', brand: 'UltraTech', price: 385, unit: '50kg bag', category: 'cement', badge: 'Best Seller', badgeColor: Colors.primary, inStock: true, rating: 4.8, reviews: 2341, iconName: 'layers-outline', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  { id: 'p2', name: 'ACC Gold Cement', brand: 'ACC', price: 390, unit: '50kg bag', category: 'cement', badge: 'Top Rated', badgeColor: Colors.success, inStock: true, rating: 4.7, reviews: 1820, iconName: 'layers-outline', iconBg: '#F0FDF4', iconColor: Colors.success },
  { id: 'p3', name: 'SAIL TMT Bars Fe500D', brand: 'SAIL', price: 72, unit: 'per kg', category: 'steel', badge: 'Best Seller', badgeColor: Colors.primary, inStock: true, rating: 4.9, reviews: 3102, iconName: 'barbell-outline', iconBg: '#F5F3FF', iconColor: '#8B5CF6' },
  { id: 'p4', name: 'Red Clay Bricks', brand: 'Hyderabad Kilns', price: 7, unit: 'per brick', category: 'bricks', inStock: true, rating: 4.4, reviews: 956, iconName: 'apps-outline', iconBg: '#FFF7ED', iconColor: '#F97316' },
  { id: 'p5', name: 'Asian Paints Apex Ultima', brand: 'Asian Paints', price: 3400, unit: '20L bucket', category: 'paint', badge: 'Premium', badgeColor: '#8B5CF6', inStock: true, rating: 4.7, reviews: 1240, iconName: 'color-palette-outline', iconBg: '#FFF0F3', iconColor: '#EC4899' },
  { id: 'p6', name: 'Sintex Water Tank 1000L', brand: 'Sintex', price: 8200, unit: 'per tank', category: 'hardware', badge: 'New', badgeColor: Colors.accent, inStock: true, rating: 4.5, reviews: 678, iconName: 'water-outline', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  { id: 'p7', name: 'CPVC Pipes 1 inch', brand: 'Finolex', price: 285, unit: 'per pipe', category: 'pipes', inStock: true, rating: 4.6, reviews: 412, iconName: 'git-branch-outline', iconBg: '#F0FDF4', iconColor: Colors.success },
  { id: 'p8', name: 'Havells FR Wire 2.5mm', brand: 'Havells', price: 2200, unit: 'per coil', category: 'electric', badge: 'ISI Mark', badgeColor: Colors.success, inStock: true, rating: 4.8, reviews: 890, iconName: 'flash-outline', iconBg: '#FFFBEB', iconColor: Colors.accent },
  { id: 'p9', name: 'River Sand Grade 1', brand: 'Hyderabad Sand', price: 1800, unit: 'per ton', category: 'sand', inStock: true, rating: 4.3, reviews: 341, iconName: 'hourglass-outline', iconBg: '#FFF7ED', iconColor: '#F97316' },
  { id: 'p10', name: 'M-Sand Manufactured', brand: 'StoneCraft', price: 1200, unit: 'per ton', category: 'sand', badge: 'Eco-Friendly', badgeColor: Colors.success, inStock: true, rating: 4.5, reviews: 520, iconName: 'leaf-outline', iconBg: '#F0FDF4', iconColor: Colors.success },
  { id: 'p11', name: '20mm Blue Metal Aggregate', brand: 'RockMine', price: 1500, unit: 'per ton', category: 'hardware', inStock: true, rating: 4.2, reviews: 287, iconName: 'diamond-outline', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  { id: 'p12', name: 'Phenyl White 5L', brand: 'Lizol', price: 450, unit: 'per can', category: 'hardware', inStock: false, rating: 4.1, reviews: 198, iconName: 'flask-outline', iconBg: '#F0FDF4', iconColor: Colors.success },
];

const FEATURED = [
  { title: 'Monsoon Ready', subtitle: 'Waterproof cement & paints', color: '#1A1D2E', accent: Colors.accent },
  { title: 'Bulk Deals', subtitle: 'Save up to 15% on 10+ bags', color: '#8B5CF6', accent: '#DDD6FE' },
  { title: 'New Arrivals', subtitle: 'Fresh stock from top brands', color: Colors.success, accent: '#D1FAE5' },
];

// ─── Add Button with Bounce Animation ────────────────────────────────────────

function AddButton({ onPress, qty, onInc, onDec }: {
  onPress: () => void;
  qty: number;
  onInc: () => void;
  onDec: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.85, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    });
    onPress();
  };

  if (qty > 0) {
    return (
      <View style={styles.qtyRow}>
        <Pressable style={styles.qtyBtn} onPress={onDec}>
          <Ionicons name="remove" size={14} color={Colors.primary} />
        </Pressable>
        <Text style={styles.qtyText}>{qty}</Text>
        <Pressable style={styles.qtyBtn} onPress={onInc}>
          <Ionicons name="add" size={14} color={Colors.primary} />
        </Pressable>
      </View>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable style={styles.addBtn} onPress={handlePress}>
        <Ionicons name="add" size={14} color={Colors.white} />
        <Text style={styles.addBtnText}>Add</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, index, onAdd, qty, onInc, onDec }: {
  product: Product;
  index: number;
  onAdd: () => void;
  qty: number;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <Animated.View
      style={styles.card}
      entering={FadeInDown.delay(index * 60).springify().damping(18).stiffness(200)}
    >
      <View style={[styles.cardImage, { backgroundColor: product.iconBg }]}>
        <Ionicons name={product.iconName} size={48} color={product.iconColor} />
        {product.badge && (
          <View style={[styles.cardBadge, { backgroundColor: product.badgeColor }]}>
            <Text style={styles.cardBadgeText}>{product.badge}</Text>
          </View>
        )}
        {!product.inStock && (
          <View style={styles.oosOverlay}>
            <Text style={styles.oosText}>OUT OF STOCK</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.brandText}>{product.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color={Colors.accent} />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewText}>({product.reviews > 999 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews})</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>₹{product.price.toLocaleString('en-IN')}</Text>
          <Text style={styles.unitText}>/{product.unit}</Text>
        </View>
        {product.inStock ? (
          <AddButton onPress={onAdd} qty={qty} onInc={onInc} onDec={onDec} />
        ) : (
          <View style={styles.notifyBtn}>
            <Text style={styles.notifyText}>Notify Me</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ShopScreen() {
  const router = useRouter();
  const { items, addItem, updateQuantity, getItemCount } = useCartStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const cartCount = getItemCount();

  const getQty = (id: string) => items.find((i) => i.inventoryId === id)?.quantity ?? 0;

  const handleAdd = (p: Product) => {
    addItem({
      inventoryId: p.id,
      inventory_id: p.id,
      productId: p.id,
      productName: p.name,
      unit: p.unit,
      shopId: 'shop-buildmart-main',
      shopName: 'BuildMart Main Store',
      price: p.price,
      quantity: 1,
    });
  };

  const handleInc = (p: Product) => {
    const qty = getQty(p.id);
    if (qty === 0) {
      handleAdd(p);
    } else {
      updateQuantity(p.id, qty + 1);
    }
  };

  const handleDec = (p: Product) => {
    const qty = getQty(p.id);
    updateQuantity(p.id, qty - 1);
  };

  const filtered = PRODUCTS.filter((p) => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const featured = FEATURED[featuredIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInUp.duration(400)}>
        <View>
          <Text style={styles.headerTitle}>BuildMart Shop</Text>
          <Text style={styles.headerSub}>Hyderabad's #1 Construction Store</Text>
        </View>
        <Pressable
          style={styles.cartButton}
          onPress={() => router.push('/(app)/checkout')}
        >
          <Ionicons name="cart-outline" size={22} color={Colors.primary} />
          {cartCount > 0 && (
            <Animated.View
              style={styles.cartBadge}
              entering={FadeInDown.springify()}
            >
              <Text style={styles.cartBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
            </Animated.View>
          )}
        </Pressable>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        stickyHeaderIndices={[1]}
      >
        {/* Featured Banner */}
        <View style={styles.featuredSection}>
          <Pressable
            style={[styles.featuredBanner, { backgroundColor: featured.color }]}
            onPress={() => setFeaturedIndex((featuredIndex + 1) % FEATURED.length)}
          >
            <View style={styles.featuredContent}>
              <View style={[styles.featuredTag, { backgroundColor: featured.accent + '30' }]}>
                <Text style={[styles.featuredTagText, { color: featured.accent }]}>FEATURED</Text>
              </View>
              <Text style={styles.featuredTitle}>{featured.title}</Text>
              <Text style={styles.featuredSub}>{featured.subtitle}</Text>
              <View style={[styles.featuredCta, { borderColor: featured.accent }]}>
                <Text style={[styles.featuredCtaText, { color: featured.accent }]}>Shop Now</Text>
                <Ionicons name="arrow-forward" size={12} color={featured.accent} />
              </View>
            </View>
            <View style={[styles.featuredCircle, { backgroundColor: featured.accent + '20' }]} />
          </Pressable>
          <View style={styles.bannerDots}>
            {FEATURED.map((_, i) => (
              <View key={i} style={[styles.dot, i === featuredIndex && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Sticky Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cement, steel, bricks..."
              placeholderTextColor={Colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORIES.map((cat, i) => (
            <Animated.View
              key={cat.id}
              entering={FadeInDown.delay(i * 40).springify().damping(18).stiffness(200)}
            >
              <Pressable
                style={[styles.categoryPill, activeCategory === cat.id && styles.categoryPillActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Ionicons
                  name={cat.icon as keyof typeof Ionicons.glyphMap}
                  size={14}
                  color={activeCategory === cat.id ? Colors.white : Colors.textSecondary}
                />
                <Text style={[styles.categoryPillText, activeCategory === cat.id && styles.categoryPillTextActive]}>
                  {cat.label}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Results count */}
        <View style={styles.resultsRow}>
          <Text style={styles.resultsText}>{filtered.length} products</Text>
          {search.length > 0 && (
            <Text style={styles.resultsQuery}>for "{search}"</Text>
          )}
        </View>

        {/* Product Grid */}
        <View style={styles.grid}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptySubtitle}>Try a different search or category</Text>
            </View>
          ) : (
            <View style={styles.productGrid}>
              {filtered.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  qty={getQty(product.id)}
                  onAdd={() => handleAdd(product)}
                  onInc={() => handleInc(product)}
                  onDec={() => handleDec(product)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Cart CTA */}
      {cartCount > 0 && (
        <Animated.View style={styles.floatingCart} entering={FadeInDown.springify()}>
          <Pressable style={styles.floatingCartBtn} onPress={() => router.push('/(app)/checkout')}>
            <View style={styles.floatingCartLeft}>
              <View style={styles.floatingCartBadge}>
                <Text style={styles.floatingCartBadgeText}>{cartCount}</Text>
              </View>
              <Text style={styles.floatingCartText}>View Cart</Text>
            </View>
            <View style={styles.floatingCartRight}>
              <Text style={styles.floatingCartTotal}>
                ₹{useCartStore.getState().getTotal().toLocaleString('en-IN')}
              </Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.white} />
            </View>
          </Pressable>
        </Animated.View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  featuredSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  featuredBanner: {
    borderRadius: 16,
    padding: 20,
    height: 140,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredContent: {
    flex: 1,
    zIndex: 1,
  },
  featuredTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  featuredTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  featuredSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 12,
  },
  featuredCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  featuredCtaText: {
    fontSize: 12,
    fontWeight: '700',
  },
  featuredCircle: {
    position: 'absolute',
    right: -20,
    bottom: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.primary,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  categoryScroll: {
    backgroundColor: Colors.background,
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryPillTextActive: {
    color: Colors.white,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  resultsQuery: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardImage: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  oosOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  oosText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  cardBody: {
    padding: 11,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
    minHeight: 34,
    lineHeight: 17,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reviewText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  unitText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    gap: 4,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingVertical: 6,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 7,
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
    minWidth: 20,
    textAlign: 'center',
  },
  notifyBtn: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingVertical: 8,
  },
  notifyText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    width: '100%',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  floatingCart: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  floatingCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  floatingCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  floatingCartBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingCartBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.white,
  },
  floatingCartText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  floatingCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  floatingCartTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.accent,
  },
});
