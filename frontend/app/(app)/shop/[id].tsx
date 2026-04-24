import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  ZoomIn,
} from 'react-native-reanimated';
import { LightTheme as T } from '../../../src/theme/colors';
import { MOCK_PRODUCTS } from '../../../src/constants/mockData';
import { useCartStore } from '../../../src/store/cart.store';

const SPRING_SNAPPY = { damping: 18, stiffness: 280, mass: 0.8 };

const SHOPS = [
  {
    id: '1',
    name: 'Hyderabad Building Supplies',
    area: 'Kukatpally',
    address: 'Plot 45, KPHB Colony Phase 1, Kukatpally, Hyderabad – 500072',
    rating: 4.6,
    hours: 'Open 9AM – 8PM',
    distance: '1.2km away',
    productCount: 240,
    orders: '1200+',
    established: '2018',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    bannerImage: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?w=800&q=80',
    isOpen: true,
  },
];

const DEFAULT_SHOP = SHOPS[0];

export default function ShopDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const shop = SHOPS.find((s) => s.id === id) ?? DEFAULT_SHOP;
  const addItem = useCartStore((s) => s.addItem);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const shopProducts = MOCK_PRODUCTS.slice(0, 6);

  const handleAddToCart = (product: (typeof MOCK_PRODUCTS)[0]) => {
    addItem({
      inventoryId: product.id,
      inventory_id: product.id,
      productId: product.id,
      productName: product.name,
      unit: product.unit,
      shopId: shop.id,
      shopName: shop.name,
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

  const ListHeader = () => (
    <View>
      {/* Hero Banner */}
      <Animated.View entering={FadeInDown.duration(400)}>
        <Image
          source={{ uri: shop.bannerImage }}
          style={s.heroBanner}
          resizeMode="cover"
        />
        <View style={s.heroBannerOverlay} />
      </Animated.View>

      {/* Shop Avatar Overlay */}
      <Animated.View entering={ZoomIn.delay(200).springify()} style={s.avatarContainer}>
        <View style={s.avatar}>
          <Text style={s.avatarLetter}>
            {shop.name.charAt(0)}
          </Text>
        </View>
      </Animated.View>

      {/* Shop Info */}
      <Animated.View entering={FadeInDown.delay(150).springify()} style={s.shopInfo}>
        <Text style={s.shopName}>{shop.name}</Text>
        <View style={s.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= Math.floor(shop.rating) ? 'star' : 'star-half'}
              size={16}
              color="#F59E0B"
            />
          ))}
          <Text style={s.ratingText}>{shop.rating}</Text>
          <Text style={s.ordersText}>{shop.orders} orders</Text>
        </View>
        <View style={s.statusRow}>
          <View style={[s.statusBadge, shop.isOpen ? s.statusOpen : s.statusClosed]}>
            <View style={[s.statusDot, { backgroundColor: shop.isOpen ? T.success : T.error }]} />
            <Text style={[s.statusLabel, { color: shop.isOpen ? T.success : T.error }]}>
              {shop.isOpen ? shop.hours : 'Closed'}
            </Text>
          </View>
          <View style={s.distanceBadge}>
            <Ionicons name="location-outline" size={13} color={T.amber} />
            <Text style={s.distanceText}>{shop.distance}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View entering={FadeInDown.delay(220).springify()} style={s.actionRow}>
        <Pressable
          style={({ pressed }) => [s.actionBtn, s.actionBtnAmber, pressed && { opacity: 0.85 }]}
          onPress={() => Linking.openURL(`tel:${shop.phone}`)}
        >
          <Ionicons name="call" size={18} color={T.white} />
          <Text style={s.actionBtnText}>Call Shop</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [s.actionBtn, s.actionBtnNavy, pressed && { opacity: 0.85 }]}
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`
            )
          }
        >
          <Ionicons name="navigate" size={18} color={T.white} />
          <Text style={s.actionBtnText}>Get Directions</Text>
        </Pressable>
      </Animated.View>

      {/* Stats Row */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={s.statsRow}>
        {[
          { label: 'Products', value: String(shop.productCount) },
          { label: 'Rating', value: String(shop.rating) },
          { label: 'Orders', value: shop.orders },
          { label: 'Est.', value: shop.established },
        ].map((stat, i) => (
          <View key={stat.label} style={[s.statCard, i < 3 && s.statCardBorder]}>
            <Text style={s.statValue}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Contact Info */}
      <Animated.View entering={FadeInLeft.delay(350).springify()} style={s.contactCard}>
        <Text style={s.contactTitle}>Contact & Location</Text>
        <View style={s.contactRow}>
          <View style={s.contactIconCircle}>
            <Ionicons name="location" size={16} color={T.amber} />
          </View>
          <Text style={s.contactText} numberOfLines={2}>{shop.address}</Text>
        </View>
        <View style={s.contactRow}>
          <View style={s.contactIconCircle}>
            <Ionicons name="call" size={16} color={T.amber} />
          </View>
          <Text style={s.contactText}>{shop.phone}</Text>
        </View>
        <View style={s.contactRow}>
          <View style={s.contactIconCircle}>
            <Ionicons name="logo-whatsapp" size={16} color={T.success} />
          </View>
          <Text style={s.contactText}>{shop.whatsapp}</Text>
        </View>
        <View style={s.contactRow}>
          <View style={s.contactIconCircle}>
            <Ionicons name="time" size={16} color={T.navy} />
          </View>
          <Text style={s.contactText}>{shop.hours} · Mon – Sat</Text>
        </View>
      </Animated.View>

      {/* Products Section Header */}
      <Animated.View entering={FadeInDown.delay(400).springify()} style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Products from this Shop</Text>
        <Text style={s.sectionCount}>{shopProducts.length} items</Text>
      </Animated.View>
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
        <Text style={s.headerTitle} numberOfLines={1}>{shop.name}</Text>
        <Pressable style={({ pressed }) => [s.headerBtn, pressed && { opacity: 0.7 }]}>
          <Ionicons name="share-outline" size={20} color={T.text} />
        </Pressable>
      </View>

      <FlatList
        data={shopProducts}
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
  heroBanner: {
    height: 200,
    width: '100%',
  },
  heroBannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -36,
    marginBottom: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: T.navy,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: T.surface,
  },
  avatarLetter: {
    fontSize: 28,
    fontWeight: '800',
    color: T.white,
  },
  shopInfo: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  shopName: {
    fontSize: 20,
    fontWeight: '800',
    color: T.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: T.text,
    marginLeft: 4,
  },
  ordersText: {
    fontSize: 13,
    color: T.textSecondary,
    marginLeft: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: T.amberBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: T.amber,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  actionBtnAmber: {
    backgroundColor: T.amber,
  },
  actionBtnNavy: {
    backgroundColor: T.navy,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: T.white,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
  },
  statCard: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statCardBorder: {
    borderRightWidth: 1,
    borderRightColor: T.border,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: T.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: T.textSecondary,
  },
  contactCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    gap: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: T.text,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  contactIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: T.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    flex: 1,
    fontSize: 13,
    color: T.textSecondary,
    lineHeight: 19,
    paddingTop: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
  },
  sectionCount: {
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
});
