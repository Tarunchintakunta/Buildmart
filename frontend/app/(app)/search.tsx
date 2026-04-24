import { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LightTheme as T, Colors } from '../../src/theme/colors';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../src/constants/mockData';

const SPRING_SNAPPY = { damping: 18, stiffness: 280, mass: 0.8 };

const RECENT_SEARCHES = ['Cement bags', 'TMT steel', 'Red bricks', 'Asian Paints'];

const CATEGORY_COLORS: Record<string, string> = {
  'Cement': '#EF4444',
  'Steel': '#8B5CF6',
  'Bricks': '#F59E0B',
  'Paint': '#10B981',
  'Pipes': '#3B82F6',
  'Electrical': '#F97316',
  'Sand & Aggregate': '#6366F1',
  'Hardware': '#EC4899',
};

function ProductCard({ product, index, onPress }: { product: typeof MOCK_PRODUCTS[0]; index: number; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify()}
      style={[styles.productCardWrapper, animStyle]}
    >
      <Pressable
        style={styles.productCard}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.96, SPRING_SNAPPY); }}
        onPressOut={() => { scale.value = withSpring(1, SPRING_SNAPPY); }}
      >
        <View style={styles.productImageBox}>
          <Image
            source={{ uri: product.image as string }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {product.badge && (
            <View style={styles.productBadge}>
              <Text style={styles.productBadgeText}>{product.badge}</Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productBrand}>{product.brand}</Text>
          <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.productUnit}>{product.unit}</Text>
          <View style={styles.productBottom}>
            <Text style={styles.productPrice}>₹{product.price.toLocaleString('en-IN')}</Text>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={11} color="#F59E0B" />
              <Text style={styles.ratingText}>{product.rating}</Text>
            </View>
          </View>
        </View>
        <Pressable style={styles.addBtn}>
          <Ionicons name="add" size={18} color={T.white} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return MOCK_PRODUCTS.filter((p) => {
      const matchesQuery = q === '' || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      const matchesCat = !selectedCategory || p.category === selectedCategory;
      return matchesQuery && matchesCat;
    });
  }, [query, selectedCategory]);

  const isEmpty = filtered.length === 0;
  const showRecent = query === '' && !selectedCategory;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Search Header */}
      <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={T.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search BuildMart..."
            placeholderTextColor={T.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={T.textMuted} />
            </Pressable>
          )}
        </View>
        <Pressable style={styles.micBtn}>
          <Ionicons name="mic-outline" size={20} color={T.text} />
        </Pressable>
      </Animated.View>

      {/* Category Filter Chips */}
      <Animated.View entering={FadeInDown.delay(80).springify()}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}
        >
          <Pressable
            style={[styles.chip, !selectedCategory && styles.chipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.chipText, !selectedCategory && styles.chipTextActive]}>All</Text>
          </Pressable>
          {MOCK_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={[styles.chip, selectedCategory === cat.name && styles.chipActive]}
              onPress={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
            >
              <Ionicons
                name={cat.icon as any}
                size={14}
                color={selectedCategory === cat.name ? T.white : (CATEGORY_COLORS[cat.name] || T.textSecondary)}
              />
              <Text style={[styles.chipText, selectedCategory === cat.name && styles.chipTextActive]}>
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Recent Searches — shown only when no query/category */}
        {showRecent && (
          <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.recentChips}>
              {RECENT_SEARCHES.map((item, i) => (
                <Animated.View key={item} entering={FadeInLeft.delay(140 + i * 40).springify()}>
                  <Pressable style={styles.recentChip} onPress={() => setQuery(item)}>
                    <Ionicons name="time-outline" size={14} color={T.textMuted} />
                    <Text style={styles.recentChipText}>{item}</Text>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Results count */}
        {!showRecent && (
          <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              {query ? ` for "${query}"` : ''}
              {selectedCategory ? ` in ${selectedCategory}` : ''}
            </Text>
          </Animated.View>
        )}

        {/* Products Grid */}
        {!isEmpty ? (
          <View style={styles.productsGrid}>
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onPress={() => router.push(`/(app)/product/${product.id}` as any)}
              />
            ))}
          </View>
        ) : (
          /* Empty State */
          <Animated.View entering={FadeInDown.delay(60).springify()} style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="search-outline" size={40} color={T.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyDesc}>
              Try searching with a different keyword or category
            </Text>
            <Pressable
              style={styles.emptyBtn}
              onPress={() => { setQuery(''); setSelectedCategory(null); }}
            >
              <Text style={styles.emptyBtnText}>Clear Search</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Promo Banner — shown in default state */}
        {showRecent && (
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.promoBanner}>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Build Smarter.</Text>
              <Text style={styles.promoDesc}>Up to 30% off on bulk structural orders this week</Text>
              <Pressable style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>Shop Now</Text>
                <Ionicons name="arrow-forward" size={14} color={T.white} />
              </Pressable>
            </View>
            <Ionicons name="business" size={72} color="rgba(255,255,255,0.12)" />
          </Animated.View>
        )}
      </ScrollView>
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    gap: 8,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.bg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: T.text,
    fontWeight: '500',
  },
  micBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipScroll: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
  },
  chipActive: {
    backgroundColor: T.navy,
    borderColor: T.navy,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textSecondary,
  },
  chipTextActive: {
    color: T.white,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
    marginBottom: 12,
  },
  recentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: T.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: T.border,
  },
  recentChipText: {
    fontSize: 13,
    color: T.textSecondary,
    fontWeight: '500',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  resultsCount: {
    fontSize: 13,
    color: T.textMuted,
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 10,
  },
  productCardWrapper: {
    width: '47.5%',
  },
  productCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
  },
  productImageBox: {
    height: 130,
    backgroundColor: T.bg,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: T.amber,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  productBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: T.white,
    letterSpacing: 0.3,
  },
  productInfo: {
    padding: 10,
    flex: 1,
  },
  productBrand: {
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
    marginBottom: 3,
  },
  productUnit: {
    fontSize: 11,
    color: T.textMuted,
    marginBottom: 6,
  },
  productBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
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
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  addBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: T.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: T.text,
  },
  emptyDesc: {
    fontSize: 14,
    color: T.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
  emptyBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: T.navy,
  },
  emptyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: T.white,
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.navy,
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 18,
    padding: 22,
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: T.white,
    marginBottom: 6,
  },
  promoDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 18,
    marginBottom: 14,
  },
  promoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.amber,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
    alignSelf: 'flex-start',
    gap: 6,
  },
  promoBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: T.white,
  },
});
