import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

const SORT_OPTIONS = [
  { label: 'Price: Low-High', value: 'price_asc' },
  { label: 'Price: High-Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Newest', value: 'newest' },
];

const PRODUCTS = [
  { id: '1', name: 'UltraTech Cement 50kg', price: 450, rating: 4.8, shop: 'Sharma Supplies' },
  { id: '2', name: 'ACC Cement PPC 50kg', price: 420, rating: 4.6, shop: 'Krishna Traders' },
  { id: '3', name: 'Ambuja Cement 50kg', price: 440, rating: 4.7, shop: 'Patel Hardware' },
  { id: '4', name: 'Birla White Cement 5kg', price: 180, rating: 4.5, shop: 'Sharma Supplies' },
  { id: '5', name: 'Dalmia Cement OPC 50kg', price: 410, rating: 4.3, shop: 'Gupta Materials' },
  { id: '6', name: 'Shree Cement PPC 50kg', price: 395, rating: 4.4, shop: 'Krishna Traders' },
  { id: '7', name: 'JK Super Cement 50kg', price: 430, rating: 4.6, shop: 'Mega Build Store' },
  { id: '8', name: 'Ramco Supergrade 50kg', price: 460, rating: 4.7, shop: 'Patel Hardware' },
];

export default function CategoryBrowseScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const [activeSort, setActiveSort] = useState('price_asc');
  const [showSort, setShowSort] = useState(false);

  const categoryName = name ?? 'Category';
  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === activeSort)?.label ?? 'Sort';

  const renderProduct = ({ item, index }: { item: typeof PRODUCTS[0]; index: number }) => (
    <View style={[s.productCard, index % 2 === 0 ? { marginRight: 6 } : { marginLeft: 6 }]}>
      <View style={s.productImage}>
        <Ionicons name="cube-outline" size={32} color={T.textMuted} />
      </View>
      <View style={s.productInfo}>
        <Text style={s.productName} numberOfLines={2}>{item.name}</Text>
        <View style={s.productRatingRow}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={s.productRating}>{item.rating}</Text>
        </View>
        <Text style={s.productPrice}>Rs.{item.price}</Text>
        <Text style={s.shopName} numberOfLines={1}>{item.shop}</Text>
        <TouchableOpacity style={s.addToCartBtn}>
          <Ionicons name="cart-outline" size={14} color={T.white} />
          <Text style={s.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View>
      {/* Sort / Filter Bar */}
      <View style={s.sortFilterBar}>
        <TouchableOpacity style={s.sortBtn} onPress={() => setShowSort(!showSort)}>
          <Ionicons name="swap-vertical" size={16} color={T.text} />
          <Text style={s.sortBtnText}>{activeSortLabel}</Text>
          <Ionicons name={showSort ? 'chevron-up' : 'chevron-down'} size={14} color={T.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={s.filterBtn}>
          <Ionicons name="options-outline" size={16} color={T.text} />
          <Text style={s.filterBtnText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Dropdown */}
      {showSort && (
        <View style={s.sortDropdown}>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[s.sortOption, activeSort === option.value && s.sortOptionActive]}
              onPress={() => { setActiveSort(option.value); setShowSort(false); }}
            >
              <Text style={[s.sortOptionText, activeSort === option.value && s.sortOptionTextActive]}>
                {option.label}
              </Text>
              {activeSort === option.value && (
                <Ionicons name="checkmark" size={16} color={T.navy} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Results Count */}
      <View style={s.resultsRow}>
        <Text style={s.resultsText}>{PRODUCTS.length} products found</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>{categoryName}</Text>
        <View style={s.headerBtn} />
      </View>

      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderProduct}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={s.listContent}
        columnWrapperStyle={s.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const s = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
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
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.text,
    textAlign: 'center' as const,
    marginHorizontal: 8,
  },
  sortFilterBar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  sortBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
  },
  sortBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.text,
  },
  filterBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.text,
  },
  sortDropdown: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: T.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden' as const,
  },
  sortOption: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  sortOptionActive: {
    backgroundColor: '#F0F1F5',
  },
  sortOptionText: {
    fontSize: 14,
    color: T.textSecondary,
  },
  sortOptionTextActive: {
    fontWeight: '600' as const,
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
    paddingBottom: 24,
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
    overflow: 'hidden' as const,
  },
  productImage: {
    height: 120,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.text,
    lineHeight: 18,
    marginBottom: 6,
  },
  productRatingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    marginBottom: 6,
  },
  productRating: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.textSecondary,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: T.amber,
    marginBottom: 4,
  },
  shopName: {
    fontSize: 11,
    color: T.textMuted,
    marginBottom: 10,
  },
  addToCartBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: T.navy,
    borderRadius: 10,
    paddingVertical: 9,
    gap: 6,
  },
  addToCartText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: T.white,
  },
};
