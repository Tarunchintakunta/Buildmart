import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useAuthStore } from '../../store/auth.store';
import { walletApi } from '../../api/wallet.api';
import { ordersApi } from '../../api/orders.api';
import Colors from '../../theme/colors';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_ORDERS, BANNER_IMAGES } from '../../constants/mockData';
import { SPRING_BOUNCY, SPRING_SNAPPY } from '../../utils/animations';

const QUICK_ACTIONS = [
  { name: 'Order Materials', icon: 'cube-outline' as const, route: '/(app)/(tabs)/shop', color: '#3B82F6' },
  { name: 'Hire Worker', icon: 'person-add-outline' as const, route: '/(app)/(tabs)/workers', color: '#F59E0B' },
  { name: 'My Orders', icon: 'receipt-outline' as const, route: '/(app)/(tabs)/orders', color: '#10B981' },
  { name: 'Track Delivery', icon: 'location-outline' as const, route: '/(app)/order-tracking', color: '#EF4444' },
  { name: 'Agreements', icon: 'document-text-outline' as const, route: '/(app)/(tabs)/agreements', color: '#8B5CF6' },
  { name: 'My Wallet', icon: 'wallet-outline' as const, route: '/(app)/(tabs)/wallet', color: '#F97316' },
];

function formatIndian(n: number): string {
  const parts = Math.abs(Math.round(n)).toString().split('').reverse();
  const groups: string[] = [];
  parts.forEach((d, i) => {
    if (i === 3 || (i > 3 && (i - 3) % 2 === 0)) groups.push(',');
    groups.push(d);
  });
  return '₹' + groups.reverse().join('');
}

function QuickActionCard({ item, index }: { item: typeof QUICK_ACTIONS[0]; index: number }) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View
      style={[styles.quickCard, anim]}
      entering={ZoomIn.delay(index * 60).springify().damping(16)}
    >
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.94, SPRING_SNAPPY); }}
        onPressOut={() => { scale.value = withSpring(1, SPRING_BOUNCY); }}
        onPress={() => router.push(item.route as any)}
        style={styles.quickPressable}
      >
        <View style={[styles.quickIcon, { backgroundColor: `${item.color}18` }]}>
          <Ionicons name={item.icon} size={22} color={item.color} />
        </View>
        <Text style={styles.quickLabel}>{item.name}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function CustomerDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [balance, setBalance] = useState(12450);
  const [recentOrders, setRecentOrders] = useState(MOCK_ORDERS.slice(0, 3));
  const [search, setSearch] = useState('');
  const featuredProducts = MOCK_PRODUCTS.slice(0, 6);

  useEffect(() => {
    walletApi.getMyWallet().then((w) => setBalance(parseFloat(String(w.balance)))).catch(() => {});
    ordersApi.getMyOrders({ limit: 3 }).then((r) => {
      if (r.data?.length) setRecentOrders(r.data);
    }).catch(() => {});
  }, []);

  const handleSearch = useCallback(() => {
    if (search.trim()) router.push(`/(app)/search?q=${encodeURIComponent(search)}` as any);
    else router.push('/(app)/search' as any);
  }, [search, router]);

  const STATUS_COLORS: Record<string, string> = {
    pending: '#8B5CF6', accepted: '#3B82F6', processing: '#F59E0B',
    out_for_delivery: '#F97316', delivered: '#10B981', cancelled: '#EF4444',
  };
  const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending', accepted: 'Confirmed', processing: 'Processing',
    out_for_delivery: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled',
  };

  return (
    <View style={styles.root}>
      {/* Search */}
      <Animated.View style={styles.searchWrap} entering={FadeInDown.duration(400)}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={19} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cement, steel, paint..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      {/* Banner */}
      <Animated.View entering={FadeInDown.delay(80).springify().damping(18)}>
        <Pressable
          style={styles.banner}
          onPress={() => router.push('/(app)/(tabs)/shop')}
        >
          <Image
            source={{ uri: BANNER_IMAGES.constructionSite }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay} />
          <View style={styles.bannerContent}>
            <View style={styles.bannerBadge}>
              <Ionicons name="flash" size={11} color={Colors.primary} />
              <Text style={styles.bannerBadgeText}>FLASH SALE</Text>
            </View>
            <Text style={styles.bannerTitle}>Build Your Dream Home</Text>
            <Text style={styles.bannerSub}>Up to 30% off on bulk orders</Text>
            <View style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>Shop Now</Text>
              <Ionicons name="arrow-forward" size={13} color={Colors.primary} />
            </View>
          </View>
        </Pressable>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(160).springify().damping(18)}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((action, i) => (
            <QuickActionCard key={action.name} item={action} index={i} />
          ))}
        </View>
      </Animated.View>

      {/* Categories */}
      <Animated.View entering={FadeInDown.delay(220).springify().damping(18)}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Pressable onPress={() => router.push('/(app)/(tabs)/shop')}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {MOCK_CATEGORIES.map((cat, i) => (
            <Animated.View
              key={cat.id}
              entering={FadeInRight.delay(i * 50).springify().damping(16)}
            >
              <Pressable
                style={styles.catItem}
                onPress={() => router.push(`/(app)/category/${cat.id}` as any)}
              >
                <View style={[styles.catIcon, { backgroundColor: `${cat.color}18` }]}>
                  <Ionicons name={cat.icon} size={26} color={cat.color} />
                </View>
                <Text style={styles.catLabel}>{cat.name}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Featured Products */}
      <Animated.View entering={FadeInDown.delay(280).springify().damping(18)}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <Pressable onPress={() => router.push('/(app)/(tabs)/shop')}>
            <Text style={styles.viewAll}>See All</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
          {featuredProducts.map((product, i) => (
            <Animated.View
              key={product.id}
              style={styles.productCard}
              entering={FadeInRight.delay(i * 70).springify().damping(18)}
            >
              <Pressable onPress={() => router.push(`/(app)/product/${product.id}` as any)}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                {product.badge && (
                  <View style={styles.productBadge}>
                    <Text style={styles.productBadgeText}>{product.badge}</Text>
                  </View>
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                  <Text style={styles.productPrice}>{formatIndian(product.price)}/{product.unit}</Text>
                  <View style={styles.productRating}>
                    <Ionicons name="star" size={11} color={Colors.accent} />
                    <Text style={styles.productRatingText}>{product.rating} ({product.reviews})</Text>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Wallet Card */}
      <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
        <Pressable
          style={styles.walletCard}
          onPress={() => router.push('/(app)/(tabs)/wallet')}
        >
          <View style={styles.walletLeft}>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Text style={styles.walletAmount}>{formatIndian(balance)}</Text>
          </View>
          <View style={styles.walletActions}>
            <Pressable
              style={styles.walletBtn}
              onPress={() => router.push('/(app)/(tabs)/wallet')}
            >
              <Ionicons name="add" size={14} color="#fff" />
              <Text style={styles.walletBtnText}>Add</Text>
            </Pressable>
            <Pressable
              style={styles.walletBtn}
              onPress={() => router.push('/(app)/(tabs)/wallet')}
            >
              <Ionicons name="time" size={14} color="#fff" />
              <Text style={styles.walletBtnText}>History</Text>
            </Pressable>
          </View>
        </Pressable>
      </Animated.View>

      {/* Recent Orders */}
      <Animated.View
        style={styles.ordersSection}
        entering={FadeInDown.delay(400).springify().damping(18)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <Pressable onPress={() => router.push('/(app)/(tabs)/orders')}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>
        {recentOrders.length === 0 ? (
          <View style={styles.emptyOrders}>
            <Ionicons name="receipt-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No orders yet</Text>
            <Pressable
              style={styles.shopNowBtn}
              onPress={() => router.push('/(app)/(tabs)/shop')}
            >
              <Text style={styles.shopNowText}>Start Shopping</Text>
            </Pressable>
          </View>
        ) : (
          recentOrders.map((order: any, i: number) => {
            const status = order.status || 'pending';
            const statusColor = STATUS_COLORS[status] || '#8B5CF6';
            return (
              <Animated.View
                key={order.id || i}
                entering={FadeInDown.delay(400 + i * 60).springify()}
              >
                <Pressable
                  style={styles.orderCard}
                  onPress={() => router.push(`/(app)/order/${order.id}` as any)}
                >
                  <View style={[styles.orderIconBox, { backgroundColor: `${statusColor}18` }]}>
                    <Ionicons name="receipt-outline" size={22} color={statusColor} />
                  </View>
                  <View style={styles.orderMid}>
                    <Text style={styles.orderNumber}>
                      #{order.order_number || `BM-${order.id?.slice(0, 6)}`}
                    </Text>
                    <Text style={styles.orderShop}>
                      {order.shop?.name || 'BuildMart Store'}
                    </Text>
                  </View>
                  <View style={styles.orderRight}>
                    <View style={[styles.statusPill, { backgroundColor: `${statusColor}18` }]}>
                      <Text style={[styles.statusPillText, { color: statusColor }]}>
                        {STATUS_LABELS[status] || status}
                      </Text>
                    </View>
                    <Text style={styles.orderAmount}>
                      {formatIndian(order.total_amount || 0)}
                    </Text>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingBottom: 24 },
  searchWrap: { paddingHorizontal: 16, paddingBottom: 14 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary, padding: 0 },
  banner: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 170,
    marginBottom: 20,
  },
  bannerImage: { width: '100%', height: '100%', position: 'absolute' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26,29,46,0.68)' },
  bannerContent: { padding: 18, flex: 1, justifyContent: 'flex-end' },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 8,
  },
  bannerBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.primary, letterSpacing: 0.5 },
  bannerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  bannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 12 },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignSelf: 'flex-start',
    gap: 5,
  },
  bannerBtnText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 16 },
  viewAll: { fontSize: 13, fontWeight: '600', color: Colors.accent },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16, marginBottom: 20 },
  quickCard: { width: '30.5%', backgroundColor: Colors.surface, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  quickPressable: { padding: 14, alignItems: 'center' },
  quickIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickLabel: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center', lineHeight: 16 },
  categoryScroll: { paddingLeft: 16, marginBottom: 20 },
  catItem: { alignItems: 'center', marginRight: 18, width: 68 },
  catIcon: { width: 58, height: 58, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 7 },
  catLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  productsScroll: { paddingLeft: 16, marginBottom: 20 },
  productCard: {
    width: 155,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productImage: { width: '100%', height: 120 },
  productBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.accent,
    borderRadius: 99,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  productBadgeText: { fontSize: 9, fontWeight: '700', color: Colors.primary },
  productInfo: { padding: 10, gap: 4 },
  productName: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary, lineHeight: 17 },
  productPrice: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  productRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  productRatingText: { fontSize: 10, color: Colors.textMuted },
  walletCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  walletLeft: { gap: 4 },
  walletLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  walletAmount: { fontSize: 26, fontWeight: '800', color: '#fff' },
  walletActions: { flexDirection: 'row', gap: 8 },
  walletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  walletBtnText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  ordersSection: { paddingHorizontal: 16 },
  emptyOrders: { alignItems: 'center', paddingVertical: 28, backgroundColor: Colors.surface, borderRadius: 14, borderWidth: 1, borderColor: Colors.border },
  emptyText: { fontSize: 15, color: Colors.textMuted, marginTop: 8, marginBottom: 12 },
  shopNowBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  shopNowText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  orderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 10, gap: 12 },
  orderIconBox: { width: 46, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  orderMid: { flex: 1 },
  orderNumber: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  orderShop: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  orderRight: { alignItems: 'flex-end', gap: 6 },
  statusPill: { borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3 },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  orderAmount: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
});
