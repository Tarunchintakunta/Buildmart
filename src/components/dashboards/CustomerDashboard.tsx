import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWalletStore } from '../../store/useStore';
import { LightTheme } from '../../theme/designSystem';
import { ShopImages, BannerImages } from '../../constants/images';

const T = LightTheme;

const CATEGORIES = [
  { id: '1', name: 'Cement', icon: 'cube' as const, color: '#EF4444' },
  { id: '2', name: 'Bricks', icon: 'grid' as const, color: '#F59E0B' },
  { id: '3', name: 'Steel', icon: 'hardware-chip' as const, color: '#8B5CF6' },
  { id: '4', name: 'Pipes', icon: 'water' as const, color: '#3B82F6' },
  { id: '5', name: 'Paint', icon: 'color-palette' as const, color: '#10B981' },
  { id: '6', name: 'Electric', icon: 'flash' as const, color: '#F97316' },
  { id: '7', name: 'Hardware', icon: 'construct' as const, color: '#6366F1' },
  { id: '8', name: 'Doors', icon: 'home' as const, color: '#EC4899' },
];

const QUICK_ACTIONS = [
  { id: '1', name: 'Order Materials', icon: 'cube' as const, route: '/(app)/(tabs)/shop' },
  { id: '2', name: 'Hire Worker', icon: 'person-add' as const, route: '/(app)/(tabs)/workers' },
  { id: '3', name: 'My Orders', icon: 'receipt' as const, route: '/(app)/(tabs)/orders' },
  { id: '4', name: 'Track Delivery', icon: 'location' as const, route: '/(app)/(tabs)/orders' },
];

const RECENT_ORDERS = [
  { id: '1', number: 'BM-98234', items: '10x Cement bags, 5kg Nails', total: 5460, status: 'Delivered', statusColor: '#10B981' },
  { id: '2', number: 'BM-98230', items: '20x Red Clay Bricks', total: 2400, status: 'In Transit', statusColor: '#3B82F6' },
];

export default function CustomerDashboard() {
  const router = useRouter();
  const wallet = useWalletStore((state) => state.wallet);
  const walletBalance = wallet?.balance ?? 25000;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 20 }}>
        {/* Search Bar */}
        <TouchableOpacity style={s.searchBar} activeOpacity={0.7} onPress={() => router.push('/(app)/search' as any)}>
          <Ionicons name="search" size={20} color={T.textMuted} />
          <Text style={s.searchPlaceholder}>Search BuildMart</Text>
          <Ionicons name="mic-outline" size={20} color={T.textMuted} />
        </TouchableOpacity>

        {/* Flash Sale Banner */}
        <TouchableOpacity style={s.banner} activeOpacity={0.85}>
          <Image source={BannerImages.building} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16, opacity: 0.2 }} resizeMode="cover" />
          <View style={{ flex: 1 }}>
            <View style={s.bannerBadge}>
              <Ionicons name="flash" size={12} color={T.white} />
              <Text style={s.bannerBadgeText}>FLASH SALE</Text>
            </View>
            <Text style={s.bannerTitle}>Build Your Dream Home</Text>
            <Text style={s.bannerSub}>Up to 30% off on bulk structural orders</Text>
            <TouchableOpacity style={s.bannerBtn}>
              <Text style={s.bannerBtnText}>Shop Now</Text>
              <Ionicons name="arrow-forward" size={14} color={T.navy} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View>
          <Text style={s.sectionTitle}>Quick Actions</Text>
          <View style={s.quickGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={s.quickCard}
                onPress={() => router.push(action.route as any)}
              >
                <View style={s.quickIcon}>
                  <Ionicons name={action.icon} size={22} color={T.amber} />
                </View>
                <Text style={s.quickLabel}>{action.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories */}
        <View>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/shop')}>
              <Text style={s.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 16, paddingRight: 16 }}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={s.catItem}
                  onPress={() => router.push('/(app)/(tabs)/shop')}
                >
                  <View style={[s.catIcon, { backgroundColor: `${cat.color}15` }]}>
                    <Ionicons name={cat.icon} size={26} color={cat.color} />
                  </View>
                  <Text style={s.catLabel}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Wallet Card */}
        <TouchableOpacity
          style={s.walletCard}
          onPress={() => router.push('/(app)/(tabs)/wallet')}
          activeOpacity={0.85}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={s.walletLabel}>Wallet Balance</Text>
              <Text style={s.walletAmount}>Rs.{walletBalance.toLocaleString()}</Text>
            </View>
            <View style={s.walletIcon}>
              <Ionicons name="wallet" size={24} color={T.white} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <TouchableOpacity style={s.walletBtn}>
              <Ionicons name="add" size={16} color={T.white} />
              <Text style={s.walletBtnText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.walletBtn}>
              <Ionicons name="time" size={16} color={T.white} />
              <Text style={s.walletBtnText}>History</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Recent Orders */}
        <View>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/orders')}>
              <Text style={s.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {RECENT_ORDERS.map((order) => (
            <TouchableOpacity key={order.id} style={s.orderCard}>
              <View style={[s.orderStatusDot, { backgroundColor: `${order.statusColor}20` }]}>
                <Ionicons
                  name={order.status === 'Delivered' ? 'checkmark-circle' : 'time'}
                  size={24}
                  color={order.statusColor}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={s.orderNumber}>#{order.number}</Text>
                <Text style={s.orderItems} numberOfLines={1}>{order.items}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.orderTotal}>Rs.{order.total.toLocaleString()}</Text>
                <View style={[s.statusBadge, { backgroundColor: `${order.statusColor}15` }]}>
                  <Text style={[s.statusText, { color: order.statusColor }]}>{order.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nearby Shops */}
        <View style={{ marginBottom: 16 }}>
          <Text style={s.sectionTitle}>Nearby Shops</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12, paddingRight: 16 }}>
              {[
                { name: 'Anand Hardware', rating: 4.5, distance: '2.3 km', products: '1.2k items', image: ShopImages['shop-1'] },
                { name: 'Sri Lakshmi Traders', rating: 4.3, distance: '3.1 km', products: '890 items', image: ShopImages['shop-2'] },
                { name: 'Balaji Construction', rating: 4.7, distance: '4.5 km', products: '2.1k items', image: ShopImages['shop-3'] },
              ].map((shop, i) => (
                <TouchableOpacity
                  key={i}
                  style={s.shopCard}
                  onPress={() => router.push('/(app)/(tabs)/shop')}
                >
                  <View style={s.shopImage}>
                    <Image source={shop.image} style={{ width: '100%', height: '100%', borderRadius: 10 }} resizeMode="cover" />
                  </View>
                  <Text style={s.shopName} numberOfLines={1}>{shop.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={s.shopMeta}>{shop.rating}</Text>
                    <Text style={s.shopDot}> . </Text>
                    <Text style={s.shopMeta}>{shop.distance}</Text>
                  </View>
                  <Text style={s.shopProducts}>{shop.products}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const s = {
  searchBar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: T.border,
    gap: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: T.textMuted,
  },
  banner: {
    flexDirection: 'row' as const,
    backgroundColor: T.navy,
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden' as const,
  },
  bannerBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.amber,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start' as const,
    gap: 4,
    marginBottom: 10,
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: T.white,
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: T.white,
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 14,
  },
  bannerBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#FBBF24',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start' as const,
    gap: 6,
  },
  bannerBtnText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.navy,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: T.text,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 14,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.amber,
  },
  quickGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  quickCard: {
    width: '47%' as const,
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 10,
  },
  quickLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.text,
  },
  catItem: {
    alignItems: 'center' as const,
    width: 72,
  },
  catIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  catLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.textSecondary,
  },
  walletCard: {
    backgroundColor: T.navy,
    borderRadius: 16,
    padding: 20,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  walletLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  walletAmount: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: T.white,
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  walletBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  walletBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.white,
  },
  orderCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 10,
  },
  orderStatusDot: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 2,
  },
  orderItems: {
    fontSize: 13,
    color: T.textSecondary,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  shopCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: T.border,
    width: 160,
  },
  shopImage: {
    height: 80,
    borderRadius: 10,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
    alignItems: 'center' as const,
    marginBottom: 10,
  },
  shopName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.text,
  },
  shopMeta: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.textSecondary,
  },
  shopDot: {
    fontSize: 12,
    color: T.textMuted,
  },
  shopProducts: {
    fontSize: 11,
    color: T.textMuted,
    marginTop: 2,
  },
};
