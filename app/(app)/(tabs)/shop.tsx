import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../../src/store/useStore';
import { LightTheme } from '../../../src/theme/designSystem';
import { getProductImage } from '../../../src/constants/images';

const T = LightTheme;

const CATEGORIES = ['All', 'Cement', 'Bricks', 'Steel', 'Pipes', 'Paint', 'Electrical', 'Hardware'];

const PRODUCTS = [
  { id: '1', name: 'UltraTech Premium PPC', desc: 'Heavy-duty foundations', price: 450, unit: '50kg bag', rating: 4.8, reviews: 1200, badge: 'Best Seller', category: 'Cement', inStock: true },
  { id: '2', name: 'Ambuja Kawach', desc: 'Water Repellent Cement', price: 445, unit: '50kg bag', rating: 4.5, reviews: 842, badge: null, category: 'Cement', inStock: true },
  { id: '3', name: 'ACC Gold Water Shield', desc: 'Premium Quality Cement', price: 460, unit: '50kg bag', rating: 4.7, reviews: 1200, badge: null, category: 'Cement', inStock: true },
  { id: '4', name: 'JK Super Strong', desc: 'OPC 53 Grade Cement', price: 440, unit: '50kg bag', rating: 4.3, reviews: 650, badge: 'In Stock', category: 'Cement', inStock: true },
  { id: '5', name: 'Tata Tiscon TMT Bars', desc: 'Fe500D 12mm Steel Bars', price: 1240, unit: 'per rod', rating: 4.9, reviews: 980, badge: 'Best Seller', category: 'Steel', inStock: true },
  { id: '6', name: 'Red Clay Bricks', desc: 'Premium kiln-fired bricks', price: 8, unit: 'per brick', rating: 4.4, reviews: 560, badge: null, category: 'Bricks', inStock: true },
  { id: '7', name: 'CPVC Pipe 1 inch', desc: 'FlowGuard Plus, 3m length', price: 320, unit: 'per pipe', rating: 4.6, reviews: 340, badge: 'New Arrival', category: 'Pipes', inStock: true },
  { id: '8', name: 'Asian Paints Apex', desc: 'Exterior Emulsion 20L', price: 3200, unit: 'per bucket', rating: 4.7, reviews: 720, badge: null, category: 'Paint', inStock: true },
  { id: '9', name: 'Havells Wire 1.5mm', desc: 'Life Line Plus HRFR', price: 1850, unit: 'per coil', rating: 4.5, reviews: 450, badge: null, category: 'Electrical', inStock: true },
  { id: '10', name: 'Dalmia Infra Pro', desc: 'Rapid Set Cement', price: 455, unit: '50kg bag', rating: 4.6, reviews: 210, badge: 'New Arrival', category: 'Cement', inStock: false },
];

export default function ShopScreen() {
  const router = useRouter();
  const { items, addItem } = useCartStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const cartCount = useCartStore((s) => s.getItemCount());

  const filtered = PRODUCTS.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCartQty = (id: string) => items.find((i) => i.inventory_id === id)?.quantity ?? 0;

  const handleAdd = (p: typeof PRODUCTS[0]) => {
    addItem({
      inventory_id: p.id,
      product: { id: p.id, name: p.name, description: p.desc } as any,
      shop: { id: 'shop-1', name: 'BuildMart Main Store' } as any,
      quantity: 1,
      price: p.price,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={s.header}>
        <View>
          <Text style={s.title}>Shop</Text>
          <Text style={s.subtitle}>{filtered.length} Products Available</Text>
        </View>
        <TouchableOpacity style={s.cartBtn} onPress={() => router.push('/(app)/checkout')}>
          <Ionicons name="cart-outline" size={22} color={T.text} />
          {cartCount > 0 && (
            <View style={s.badge}><Text style={s.badgeText}>{cartCount}</Text></View>
          )}
        </TouchableOpacity>
      </View>

      <View style={s.searchRow}>
        <View style={s.searchBar}>
          <Ionicons name="search" size={18} color={T.textMuted} />
          <TextInput style={s.searchInput} placeholder="Search products..." placeholderTextColor={T.textMuted} value={search} onChangeText={setSearch} />
          {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={18} color={T.textMuted} /></TouchableOpacity>}
        </View>
        <TouchableOpacity style={s.filterBtn}><Ionicons name="options-outline" size={20} color={T.text} /></TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 44, marginBottom: 8 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c} style={[s.chip, activeCategory === c && s.chipActive]} onPress={() => setActiveCategory(c)}>
            <Text style={[s.chipText, activeCategory === c && s.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        <View style={s.grid}>
          {filtered.map((p) => {
            const qty = getCartQty(p.id);
            return (
              <TouchableOpacity key={p.id} style={s.card} activeOpacity={0.7}>
                <View style={s.cardImage}>
                  <Image source={getProductImage(p.name)} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  {p.badge && (
                    <View style={[s.cardBadge, p.badge === 'Best Seller' ? { backgroundColor: T.navy } : p.badge === 'New Arrival' ? { backgroundColor: '#8B5CF6' } : { backgroundColor: T.success }]}>
                      <Text style={s.cardBadgeText}>{p.badge}</Text>
                    </View>
                  )}
                  <TouchableOpacity style={s.heartBtn}><Ionicons name="heart-outline" size={18} color={T.textMuted} /></TouchableOpacity>
                  {!p.inStock && <View style={s.oos}><Text style={s.oosText}>OUT OF STOCK</Text></View>}
                </View>
                <View style={{ padding: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: T.text }}>{p.rating}</Text>
                    <Text style={{ fontSize: 11, color: T.textMuted }}>({p.reviews > 999 ? `${(p.reviews / 1000).toFixed(1)}k` : p.reviews})</Text>
                  </View>
                  <Text style={s.pName} numberOfLines={2}>{p.name}</Text>
                  <Text style={s.pDesc} numberOfLines={1}>{p.desc}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
                    <Text style={s.pPrice}>Rs.{p.price}</Text>
                    <Text style={s.pUnit}>/ {p.unit}</Text>
                  </View>
                  {p.inStock ? (
                    qty > 0 ? (
                      <View style={s.qtyRow}>
                        <TouchableOpacity style={s.qtyBtn} onPress={() => useCartStore.getState().updateQuantity(p.id, qty - 1)}><Ionicons name="remove" size={16} color={T.navy} /></TouchableOpacity>
                        <Text style={{ fontSize: 15, fontWeight: '700', color: T.text }}>{qty}</Text>
                        <TouchableOpacity style={s.qtyBtn} onPress={() => handleAdd(p)}><Ionicons name="add" size={16} color={T.navy} /></TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity style={s.addBtn} onPress={() => handleAdd(p)}>
                        <Ionicons name="cart-outline" size={14} color={T.white} />
                        <Text style={{ fontSize: 13, fontWeight: '700', color: T.white }}>Add to Cart</Text>
                      </TouchableOpacity>
                    )
                  ) : (
                    <View style={s.notifyBtn}><Text style={{ fontSize: 13, fontWeight: '600', color: T.textMuted }}>Notify Me</Text></View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  header: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12, backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border },
  title: { fontSize: 22, fontWeight: '800' as const, color: T.text },
  subtitle: { fontSize: 13, color: T.textSecondary, marginTop: 2 },
  cartBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: T.bg, justifyContent: 'center' as const, alignItems: 'center' as const },
  badge: { position: 'absolute' as const, top: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: T.amber, alignItems: 'center' as const, justifyContent: 'center' as const },
  badgeText: { color: T.white, fontSize: 10, fontWeight: '700' as const },
  searchRow: { flexDirection: 'row' as const, paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  searchBar: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.surface, borderRadius: 12, paddingHorizontal: 14, height: 44, borderWidth: 1, borderColor: T.border, gap: 10 },
  searchInput: { flex: 1, fontSize: 14, color: T.text },
  filterBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, justifyContent: 'center' as const, alignItems: 'center' as const },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: T.surface, borderWidth: 1, borderColor: T.border },
  chipActive: { backgroundColor: T.navy, borderColor: T.navy },
  chipText: { fontSize: 13, fontWeight: '600' as const, color: T.textSecondary },
  chipTextActive: { color: T.white },
  grid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 12 },
  card: { width: '47.5%' as const, backgroundColor: T.surface, borderRadius: 14, borderWidth: 1, borderColor: T.border, overflow: 'hidden' as const },
  cardImage: { height: 130, backgroundColor: T.bg, justifyContent: 'center' as const, alignItems: 'center' as const, overflow: 'hidden' as const },
  cardBadge: { position: 'absolute' as const, top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  cardBadgeText: { fontSize: 10, fontWeight: '700' as const, color: T.white, textTransform: 'uppercase' as const },
  heartBtn: { position: 'absolute' as const, top: 8, right: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center' as const, alignItems: 'center' as const },
  oos: { ...({ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as any), backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center' as const, alignItems: 'center' as const },
  oosText: { fontSize: 10, fontWeight: '700' as const, color: T.navy, letterSpacing: 1, backgroundColor: T.white, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, overflow: 'hidden' as const },
  pName: { fontSize: 14, fontWeight: '700' as const, color: T.text, marginBottom: 2, minHeight: 36 },
  pDesc: { fontSize: 12, color: T.textSecondary, marginBottom: 8 },
  pPrice: { fontSize: 16, fontWeight: '800' as const, color: T.text },
  pUnit: { fontSize: 12, color: T.textMuted },
  addBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.navy, borderRadius: 10, paddingVertical: 9, gap: 6 },
  qtyRow: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 16, backgroundColor: T.bg, borderRadius: 10, paddingVertical: 6 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, justifyContent: 'center' as const, alignItems: 'center' as const },
  notifyBtn: { alignItems: 'center' as const, backgroundColor: T.bg, borderRadius: 10, paddingVertical: 9 },
};
