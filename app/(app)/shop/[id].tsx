import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

const SHOP = {
  id: '1',
  name: 'Sharma Building Supplies',
  address: '42, MG Road, Sector 18, Noida',
  distance: '3.2 km',
  rating: 4.5,
  orders: 1250,
  isOpen: true,
  productCount: 156,
  avgDelivery: '45 min',
};

const CATEGORIES = ['All', 'Cement', 'Steel', 'Paint', 'Pipes', 'Hardware'];

const PRODUCTS = [
  { id: '1', name: 'UltraTech Cement 50kg', price: 450, rating: 4.8 },
  { id: '2', name: 'TMT Steel Bars 12mm', price: 3200, rating: 4.6 },
  { id: '3', name: 'Asian Paints Ace 10L', price: 1850, rating: 4.7 },
  { id: '4', name: 'CPVC Pipes 1 inch', price: 320, rating: 4.3 },
  { id: '5', name: 'Birla White Cement 5kg', price: 180, rating: 4.5 },
  { id: '6', name: 'Heavy Duty Hinges Set', price: 540, rating: 4.4 },
];

export default function ShopDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');

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
        <TouchableOpacity style={s.addToCartBtn}>
          <Ionicons name="cart-outline" size={14} color={T.white} />
          <Text style={s.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View>
      {/* Shop Hero Banner */}
      <View style={s.heroBanner}>
        <Ionicons name="storefront" size={40} color={T.textMuted} />
      </View>

      {/* Shop Avatar Overlay */}
      <View style={s.avatarContainer}>
        <View style={s.avatar}>
          <Ionicons name="storefront" size={28} color={T.white} />
        </View>
      </View>

      {/* Shop Info */}
      <View style={s.shopInfo}>
        <Text style={s.shopName}>{SHOP.name}</Text>
        <View style={s.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= Math.floor(SHOP.rating) ? 'star' : star - 0.5 <= SHOP.rating ? 'star-half' : 'star-outline'}
              size={16}
              color="#F59E0B"
            />
          ))}
          <Text style={s.ratingText}>{SHOP.rating}</Text>
          <Text style={s.ordersText}>{SHOP.orders.toLocaleString()} orders</Text>
        </View>
        <View style={s.statusBadgeRow}>
          <View style={[s.statusBadge, SHOP.isOpen ? s.statusOpen : s.statusClosed]}>
            <View style={[s.statusDot, { backgroundColor: SHOP.isOpen ? T.success : '#EF4444' }]} />
            <Text style={[s.statusLabel, { color: SHOP.isOpen ? T.success : '#EF4444' }]}>
              {SHOP.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>
      </View>

      {/* Location Row */}
      <View style={s.locationRow}>
        <View style={s.locationLeft}>
          <Ionicons name="location-outline" size={18} color={T.textSecondary} />
          <Text style={s.locationText} numberOfLines={1}>{SHOP.address}</Text>
        </View>
        <Text style={s.distanceText}>{SHOP.distance}</Text>
      </View>

      {/* Stats Row */}
      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={s.statValue}>{SHOP.productCount}</Text>
          <Text style={s.statLabel}>Products</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statValue}>{SHOP.avgDelivery}</Text>
          <Text style={s.statLabel}>Avg Delivery</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statValue}>{SHOP.rating}</Text>
          <Text style={s.statLabel}>Rating</Text>
        </View>
      </View>

      {/* Category Filter Pills */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.categoryPill, activeCategory === item ? s.categoryPillActive : s.categoryPillInactive]}
            onPress={() => setActiveCategory(item)}
          >
            <Text style={[s.categoryText, activeCategory === item ? s.categoryTextActive : s.categoryTextInactive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Products Section Title */}
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Products</Text>
        <Text style={s.sectionCount}>{PRODUCTS.length} items</Text>
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
        <Text style={s.headerTitle} numberOfLines={1}>{SHOP.name}</Text>
        <TouchableOpacity style={s.headerBtn}>
          <Ionicons name="share-outline" size={20} color={T.text} />
        </TouchableOpacity>
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
  heroBanner: {
    height: 180,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  avatarContainer: {
    alignItems: 'center' as const,
    marginTop: -36,
    marginBottom: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: T.navy,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 3,
    borderColor: T.surface,
  },
  shopInfo: {
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  shopName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  ratingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.text,
    marginLeft: 4,
  },
  ordersText: {
    fontSize: 13,
    color: T.textSecondary,
    marginLeft: 8,
  },
  statusBadgeRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  statusBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  statusOpen: {
    backgroundColor: '#ECFDF5',
  },
  statusClosed: {
    backgroundColor: '#FEF2F2',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  locationRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    backgroundColor: T.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 12,
  },
  locationLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    flex: 1,
    marginRight: 12,
  },
  locationText: {
    fontSize: 13,
    color: T.textSecondary,
    flex: 1,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.amber,
  },
  statsRow: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: T.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: T.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: T.textSecondary,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
  },
  categoryPillActive: {
    backgroundColor: T.navy,
  },
  categoryPillInactive: {
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  categoryTextActive: {
    color: T.white,
  },
  categoryTextInactive: {
    color: T.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: T.text,
  },
  sectionCount: {
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
