import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../src/store/useStore';
import { LightTheme } from '../../src/theme/designSystem';
import { getProductImage } from '../../src/constants/images';

const T = LightTheme;

const TABS = ['All Items', 'In Stock', 'Price Drops'];

const WISHLIST_ITEMS = [
  { id: '1', brand: 'UltraTech', name: 'Premium Portland Cement 50kg', price: 450, originalPrice: null, inStock: true, priceDrop: null },
  { id: '2', brand: 'Tata Tiscon', name: 'TMT Steel Bars 12mm Fe500D', price: 1240, originalPrice: null, inStock: true, priceDrop: null },
  { id: '3', brand: 'Kajaria', name: 'Ceramic Floor Tiles 2x2 ft', price: 850, originalPrice: 950, inStock: true, priceDrop: 100 },
  { id: '4', brand: 'Asian Paints', name: 'Apex Exterior Emulsion 20L', price: 3200, originalPrice: null, inStock: false, priceDrop: null },
  { id: '5', brand: 'Astral', name: 'CPVC Pipes 1 inch - 10ft', price: 380, originalPrice: 420, inStock: true, priceDrop: 40 },
  { id: '6', brand: 'Havells', name: 'Electrical Wire 2.5mm 90m', price: 2800, originalPrice: null, inStock: true, priceDrop: null },
  { id: '7', brand: 'ACC', name: 'Ready Mix Concrete M25', price: 5500, originalPrice: null, inStock: false, priceDrop: null },
  { id: '8', brand: 'Pidilite', name: 'Dr. Fixit Waterproofing 20kg', price: 1850, originalPrice: 2000, inStock: true, priceDrop: 150 },
];

export default function WishlistScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All Items');
  const [items, setItems] = useState(WISHLIST_ITEMS);
  const { addItem } = useCartStore();

  const filtered = items.filter((item) => {
    if (activeTab === 'In Stock') return item.inStock;
    if (activeTab === 'Price Drops') return item.priceDrop !== null;
    return true;
  });

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));

  const moveToCart = (item: typeof WISHLIST_ITEMS[0]) => {
    addItem({
      inventory_id: item.id,
      product: { id: item.id, name: `${item.brand} ${item.name}`, description: item.brand } as any,
      shop: { id: 'shop-1', name: 'BuildMart Store' } as any,
      quantity: 1,
      price: item.price,
    });
    removeItem(item.id);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Wishlist ({items.length})</Text>
        <View style={{ width: 42 }} />
      </View>

      {/* Filter Tabs */}
      <View style={s.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.tab, activeTab === tab && s.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="heart-outline" size={48} color={T.textMuted} />
            <Text style={s.emptyTitle}>No items found</Text>
            <Text style={s.emptyDesc}>Your {activeTab.toLowerCase()} wishlist items will appear here</Text>
          </View>
        ) : (
          filtered.map((item) => (
            <View key={item.id} style={s.itemCard}>
              <View style={s.itemTop}>
                <View style={s.itemImage}>
                  <Image source={getProductImage(item.name)} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="cover" />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={s.itemBrand}>{item.brand}</Text>
                  <Text style={s.itemName} numberOfLines={2}>{item.name}</Text>
                  <View style={s.priceRow}>
                    <Text style={s.itemPrice}>Rs.{item.price.toLocaleString()}</Text>
                    {item.originalPrice && (
                      <Text style={s.originalPrice}>Rs.{item.originalPrice.toLocaleString()}</Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)} style={s.heartBtn}>
                  <Ionicons name="heart" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              {/* Status Badge */}
              {!item.inStock && (
                <View style={s.outOfStockBadge}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={s.outOfStockText}>Out of Stock</Text>
                </View>
              )}
              {item.priceDrop && (
                <View style={s.priceDropBadge}>
                  <Ionicons name="trending-down" size={14} color={T.success} />
                  <Text style={s.priceDropText}>Price dropped Rs.{item.priceDrop}</Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={s.actionRow}>
                <TouchableOpacity
                  style={[s.cartBtn, !item.inStock && s.cartBtnDisabled]}
                  onPress={() => item.inStock && moveToCart(item)}
                  disabled={!item.inStock}
                >
                  <Ionicons name="cart-outline" size={16} color={item.inStock ? T.white : T.textMuted} />
                  <Text style={[s.cartBtnText, !item.inStock && s.cartBtnTextDisabled]}>
                    {item.inStock ? 'Move to Cart' : 'Unavailable'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.removeBtn} onPress={() => removeItem(item.id)}>
                  <Text style={s.removeBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  header: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center' as const, alignItems: 'center' as const },
  headerTitle: { fontSize: 18, fontWeight: '700' as const, color: T.text },
  tabRow: { flexDirection: 'row' as const, paddingHorizontal: 16, paddingVertical: 12, gap: 8, backgroundColor: T.surface },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: T.bg },
  tabActive: { backgroundColor: T.navy },
  tabText: { fontSize: 13, fontWeight: '600' as const, color: T.textSecondary },
  tabTextActive: { color: T.white },
  itemCard: { backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  itemTop: { flexDirection: 'row' as const },
  itemImage: { width: 72, height: 72, borderRadius: 12, backgroundColor: T.bg, justifyContent: 'center' as const, alignItems: 'center' as const, borderWidth: 1, borderColor: T.border, overflow: 'hidden' as const },
  itemBrand: { fontSize: 11, fontWeight: '600' as const, color: T.textMuted, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  itemName: { fontSize: 15, fontWeight: '700' as const, color: T.text, marginTop: 2, lineHeight: 20 },
  priceRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, marginTop: 6 },
  itemPrice: { fontSize: 17, fontWeight: '800' as const, color: T.text },
  originalPrice: { fontSize: 13, fontWeight: '500' as const, color: T.textMuted, textDecorationLine: 'line-through' as const },
  heartBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FEF2F2', justifyContent: 'center' as const, alignItems: 'center' as const },
  outOfStockBadge: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6, backgroundColor: '#FEF2F2', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginTop: 10, alignSelf: 'flex-start' as const },
  outOfStockText: { fontSize: 12, fontWeight: '600' as const, color: '#EF4444' },
  priceDropBadge: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6, backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginTop: 10, alignSelf: 'flex-start' as const },
  priceDropText: { fontSize: 12, fontWeight: '600' as const, color: T.success },
  actionRow: { flexDirection: 'row' as const, gap: 10, marginTop: 14 },
  cartBtn: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.navy, borderRadius: 10, paddingVertical: 12, gap: 6 },
  cartBtnDisabled: { backgroundColor: T.bg },
  cartBtnText: { fontSize: 13, fontWeight: '700' as const, color: T.white },
  cartBtnTextDisabled: { color: T.textMuted },
  removeBtn: { paddingHorizontal: 20, justifyContent: 'center' as const, alignItems: 'center' as const, borderRadius: 10, borderWidth: 1, borderColor: T.border },
  removeBtnText: { fontSize: 13, fontWeight: '600' as const, color: T.textSecondary },
  empty: { alignItems: 'center' as const, paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700' as const, color: T.text },
  emptyDesc: { fontSize: 14, color: T.textSecondary },
};
