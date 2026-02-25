import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';
import { getProductImage, BannerImages } from '../../src/constants/images';

const T = LightTheme;

const RECENT_SEARCHES = [
  'Grade 53 Cement',
  'Red Clay Bricks',
  '12mm TMT Steel',
  'Asian Paints Apex',
  'CPVC Pipes',
];

const TRENDING_CATEGORIES = [
  { icon: 'construct-outline' as const, label: 'Cement', color: '#F59E0B' },
  { icon: 'grid-outline' as const, label: 'Bricks', color: '#EF4444' },
  { icon: 'reorder-three-outline' as const, label: 'Steel', color: '#3B82F6' },
  { icon: 'color-palette-outline' as const, label: 'Paints', color: '#8B5CF6' },
  { icon: 'water-outline' as const, label: 'Plumbing', color: '#10B981' },
  { icon: 'flash-outline' as const, label: 'Electrical', color: '#F97316' },
];

const POPULAR_PRODUCTS = [
  { id: '1', name: 'UltraTech Cement 50kg', price: 450, rating: 4.8, shop: 'BuildMart Store' },
  { id: '2', name: 'Tata Tiscon TMT 12mm', price: 1240, rating: 4.7, shop: 'Anand Hardware' },
  { id: '3', name: 'Kajaria Floor Tiles', price: 850, rating: 4.5, shop: 'Sri Lakshmi Traders' },
];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);

  const clearRecent = () => setRecentSearches([]);
  const removeRecent = (item: string) => setRecentSearches(recentSearches.filter((s) => s !== item));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <View style={s.searchBar}>
          <Ionicons name="search" size={18} color={T.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search BuildMart"
            placeholderTextColor={T.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={T.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={s.micBtn}>
          <Ionicons name="mic-outline" size={20} color={T.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearRecent}>
                <Text style={s.clearText}>Clear all</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map((item) => (
              <TouchableOpacity key={item} style={s.recentItem}>
                <Ionicons name="time-outline" size={18} color={T.textMuted} />
                <Text style={s.recentText}>{item}</Text>
                <TouchableOpacity onPress={() => removeRecent(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={16} color={T.textMuted} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Trending Categories */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Trending Categories</Text>
          <View style={s.categoryGrid}>
            {TRENDING_CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.label} style={s.categoryItem}>
                <View style={[s.categoryIcon, { backgroundColor: `${cat.color}15` }]}>
                  <Ionicons name={cat.icon} size={22} color={cat.color} />
                </View>
                <Text style={s.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Promo Banner */}
        <View style={s.promoBanner}>
          <Image source={BannerImages.construction} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16, opacity: 0.25 }} resizeMode="cover" />
          <View style={{ flex: 1 }}>
            <Text style={s.promoTitle}>Build Your Dream Home</Text>
            <Text style={s.promoDesc}>Get up to 30% off on bulk structural orders this week</Text>
            <TouchableOpacity style={s.promoBtn}>
              <Text style={s.promoBtnText}>Shop Now</Text>
              <Ionicons name="arrow-forward" size={14} color={T.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Products */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Popular Right Now</Text>
          {POPULAR_PRODUCTS.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={s.productCard}
              onPress={() => router.push(`/(app)/product/${product.id}` as any)}
            >
              <View style={s.productImage}>
                <Image source={getProductImage(product.name)} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="cover" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.productName}>{product.name}</Text>
                <Text style={s.productShop}>{product.shop}</Text>
                <View style={s.productBottom}>
                  <Text style={s.productPrice}>Rs.{product.price}</Text>
                  <View style={s.ratingBadge}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={s.ratingText}>{product.rating}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={T.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  header: { flexDirection: 'row' as const, alignItems: 'center' as const, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border, gap: 8 },
  backBtn: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center' as const, alignItems: 'center' as const },
  searchBar: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.bg, borderRadius: 12, paddingHorizontal: 12, height: 44, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: T.text, fontWeight: '500' as const },
  micBtn: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center' as const, alignItems: 'center' as const },
  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700' as const, color: T.text },
  clearText: { fontSize: 13, fontWeight: '600' as const, color: T.info },
  recentItem: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.border },
  recentText: { flex: 1, fontSize: 14, color: T.textSecondary },
  categoryGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 12, marginTop: 12 },
  categoryItem: { width: '30%' as any, alignItems: 'center' as const, gap: 8, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  categoryIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center' as const, alignItems: 'center' as const },
  categoryLabel: { fontSize: 12, fontWeight: '600' as const, color: T.text },
  promoBanner: { flexDirection: 'row' as const, backgroundColor: T.navy, marginHorizontal: 16, marginTop: 20, borderRadius: 16, padding: 20, overflow: 'hidden' as const },
  promoTitle: { fontSize: 18, fontWeight: '800' as const, color: T.white, marginBottom: 6 },
  promoDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 18, marginBottom: 14 },
  promoBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.amber, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start' as const, gap: 6 },
  promoBtnText: { fontSize: 13, fontWeight: '700' as const, color: T.white },
  productCard: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: T.border, marginTop: 10 },
  productImage: { width: 56, height: 56, borderRadius: 12, backgroundColor: T.bg, justifyContent: 'center' as const, alignItems: 'center' as const, marginRight: 14, overflow: 'hidden' as const },
  productName: { fontSize: 15, fontWeight: '700' as const, color: T.text },
  productShop: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  productBottom: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, marginTop: 6 },
  productPrice: { fontSize: 16, fontWeight: '700' as const, color: T.text },
  ratingBadge: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 4, backgroundColor: '#FFFBEB', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  ratingText: { fontSize: 12, fontWeight: '700' as const, color: '#B45309' },
};
