import { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { LightTheme as T } from '../../../src/theme/colors';
import { MOCK_PRODUCTS } from '../../../src/constants/mockData';
import { useCartStore } from '../../../src/store/cart.store';

const SPRING_SNAPPY = { damping: 18, stiffness: 280, mass: 0.8 };

const SORT_OPTIONS = [
  { label: 'Popular', value: 'popular' },
  { label: 'Price: Low–High', value: 'price_asc' },
  { label: 'Price: High–Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
];

const SHOP_ID = 's1';
const SHOP_NAME = 'Sri Venkat Building Materials';

export default function CategoryBrowseScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const [activeSort, setActiveSort] = useState('popular');
  const [showSort, setShowSort] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const categoryName = name ?? 'Category';

  const filtered = useMemo(() => {
    let list = MOCK_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    );
    if (list.length === 0) {
      list = MOCK_PRODUCTS.filter((p) =>
        p.category.toLowerCase().includes(categoryName.toLowerCase()) ||
        categoryName.toLowerCase().includes(p.category.toLowerCase().split(' ')[0])
      );
    }
    switch (activeSort) {
      case 'price_asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price_desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return [...list].sort((a, b) => b.reviews - a.reviews);
    }
  }, [categoryName, activeSort]);

  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.value === activeSort)?.label ?? 'Popular';

  const handleAddToCart = (product: (typeof MOCK_PRODUCTS)[0]) => {
    addItem({
      inventoryId: product.id,
      inventory_id: product.id,
      productId: product.id,
      productName: product.name,
      unit: product.unit,
      shopId: SHOP_ID,
      shopName: SHOP_NAME,
      price: product.price,
      quantity: 1,
    });
    setAddedIds((prev) => new Set(prev).add(product.id));
  };

  const renderProduct = ({
    item,
    index,
  }: {
    item: (typeof MOCK_PRODUCTS)[0];
    index: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify().damping(SPRING_SNAPPY.damping).stiffness(SPRING_SNAPPY.stiffness)}
      style={[s.productCard, index % 2 === 0 ? { marginRight: 6 } : { marginLeft: 6 }]}
    >
      <Image source={{ uri: item.image }} style={s.productImage} resizeMode="cover" />
      {item.badge ? (
        <View style={s.badgeWrap}>
          <Text style={s.badgeText}>{item.badge}</Text>
        </View>
      ) : null}
      <View style={s.productInfo}>
        <Text style={s.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={s.productBrand}>{item.brand}</Text>
        <View style={s.productRatingRow}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={s.productRating}>{item.rating}</Text>
          <Text style={s.productReviews}>({item.reviews})</Text>
        </View>
        <View style={s.productPriceRow}>
          <Text style={s.productPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
          <Text style={s.productUnit}>/{item.unit}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            s.addBtn,
            addedIds.has(item.id) && s.addBtnActive,
            pressed && { opacity: 0.82 },
          ]}
          onPress={() => handleAddToCart(item)}
        >
          <Ionicons
            name={addedIds.has(item.id) ? 'checkmark' : 'add'}
            size={14}
            color={T.white}
          />
          <Text style={s.addBtnText}>
            {addedIds.has(item.id) ? 'Added' : 'Add'}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );

  const EmptyState = () => (
    <Animated.View entering={ZoomIn.delay(100).springify()} style={s.emptyContainer}>
      <View style={s.emptyIconCircle}>
        <Ionicons name="cube-outline" size={48} color={T.textMuted} />
      </View>
      <Text style={s.emptyTitle}>No Products Found</Text>
      <Text style={s.emptyDesc}>
        We don't have any products in "{categoryName}" yet. Check back soon!
      </Text>
    </Animated.View>
  );

  const ListHeader = () => (
    <View>
      {/* Sort / Filter Bar */}
      <View style={s.sortFilterBar}>
        <Pressable
          style={({ pressed }) => [s.sortChip, pressed && { opacity: 0.8 }]}
          onPress={() => setShowSort(!showSort)}
        >
          <Ionicons name="swap-vertical" size={14} color={T.text} />
          <Text style={s.sortChipText}>Sort: {activeSortLabel}</Text>
          <Ionicons
            name={showSort ? 'chevron-up' : 'chevron-down'}
            size={13}
            color={T.amber}
          />
        </Pressable>
        <Pressable style={({ pressed }) => [s.filterChip, pressed && { opacity: 0.8 }]}>
          <Ionicons name="options-outline" size={14} color={T.amber} />
          <Text style={s.filterChipText}>Filter</Text>
        </Pressable>
      </View>

      {/* Sort Dropdown */}
      {showSort && (
        <Animated.View entering={FadeInDown.duration(180)} style={s.sortDropdown}>
          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={({ pressed }) => [
                s.sortOption,
                activeSort === option.value && s.sortOptionActive,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => {
                setActiveSort(option.value);
                setShowSort(false);
              }}
            >
              <Text
                style={[
                  s.sortOptionText,
                  activeSort === option.value && s.sortOptionTextActive,
                ]}
              >
                {option.label}
              </Text>
              {activeSort === option.value && (
                <Ionicons name="checkmark" size={16} color={T.amber} />
              )}
            </Pressable>
          ))}
        </Animated.View>
      )}

      {/* Results Count */}
      <View style={s.resultsRow}>
        <Text style={s.resultsText}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [s.headerBtn, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={s.headerTitle} numberOfLines={1}>{categoryName}</Text>
        <View style={s.headerBtn} />
      </View>

      {filtered.length === 0 ? (
        <>
          <ListHeader />
          <EmptyState />
        </>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderProduct}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={s.listContent}
          columnWrapperStyle={s.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
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
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: T.text,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  sortFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: T.amberBg,
    borderWidth: 1,
    borderColor: T.amber,
  },
  sortChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.text,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: T.amberBg,
    borderWidth: 1,
    borderColor: T.amber,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.amber,
  },
  sortDropdown: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  sortOptionActive: {
    backgroundColor: T.amberBg,
  },
  sortOptionText: {
    fontSize: 14,
    color: T.textSecondary,
  },
  sortOptionTextActive: {
    fontWeight: '700',
    color: T.navy,
  },
  resultsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 13,
    color: T.textSecondary,
  },
  listContent: {
    paddingBottom: 32,
  },
  columnWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  productCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
  },
  productImage: {
    height: 120,
    width: '100%',
    backgroundColor: T.bg,
  },
  badgeWrap: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: T.amber,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: T.white,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: T.text,
    lineHeight: 17,
    marginBottom: 3,
  },
  productBrand: {
    fontSize: 11,
    color: T.textMuted,
    marginBottom: 5,
  },
  productRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 5,
  },
  productRating: {
    fontSize: 12,
    fontWeight: '600',
    color: T.textSecondary,
  },
  productReviews: {
    fontSize: 11,
    color: T.textMuted,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 9,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: T.amber,
  },
  productUnit: {
    fontSize: 10,
    color: T.textMuted,
    marginLeft: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: T.navy,
    borderRadius: 9,
    paddingVertical: 8,
    gap: 5,
  },
  addBtnActive: {
    backgroundColor: T.success,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: T.white,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: T.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: T.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: T.text,
  },
  emptyDesc: {
    fontSize: 14,
    color: T.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
});
