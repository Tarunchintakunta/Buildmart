import { useState } from 'react';
import { View, Text, ScrollView, TextInput, Switch, Alert, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInLeft, ZoomIn } from 'react-native-reanimated';
import { LightTheme as T } from '../../src/theme/colors';

type Offer = {
  id: string;
  name: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  products: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
};

const INITIAL_OFFERS: Offer[] = [
  { id: '1', name: 'Bulk Discount 10%',  discountType: 'percentage', discountValue: 10,  products: 'Cement, Steel, Sand',         validFrom: '01 Feb 2026', validTo: '28 Feb 2026', isActive: true  },
  { id: '2', name: 'Festival Sale 15%',  discountType: 'percentage', discountValue: 15,  products: 'Paint, Hardware, Electrical', validFrom: '10 Mar 2026', validTo: '20 Mar 2026', isActive: true  },
  { id: '3', name: 'Buy 2 Get ₹500 Off', discountType: 'flat',       discountValue: 500, products: 'Pipes, Fittings',             validFrom: '01 Feb 2026', validTo: '15 Mar 2026', isActive: false },
];

const CATEGORIES = ['Cement', 'Steel', 'Paint', 'Pipes', 'Hardware', 'Electrical', 'Sand', 'Bricks'];

export default function PricingOffersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'create'>('active');
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);

  // Form state
  const [offerName, setOfferName]         = useState('');
  const [discountType, setDiscountType]   = useState<'Percentage' | 'Flat'>('Percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrder, setMinOrder]           = useState('');
  const [selectedCats, setSelectedCats]   = useState<string[]>([]);

  const toggleOffer = (id: string) =>
    setOffers(prev => prev.map(o => o.id === id ? { ...o, isActive: !o.isActive } : o));

  const toggleCat = (cat: string) =>
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const handleCreate = () => {
    if (!offerName.trim()) { Alert.alert('Error', 'Offer name is required.'); return; }
    if (!discountValue)    { Alert.alert('Error', 'Discount value is required.'); return; }
    Alert.alert('✅ Offer Created', `"${offerName}" has been published successfully.`, [
      { text: 'OK', onPress: () => { setOfferName(''); setDiscountValue(''); setMinOrder(''); setSelectedCats([]); setActiveTab('active'); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInDown.duration(280)}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Pricing & Offers</Text>
        <View style={{ width: 42 }} />
      </Animated.View>

      {/* Tab Bar */}
      <Animated.View style={styles.tabBar} entering={FadeInDown.delay(60)}>
        {(['active', 'create'] as const).map(tab => (
          <Pressable
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
              {tab === 'active' ? `Active Offers (${offers.filter(o => o.isActive).length})` : '+ Create Offer'}
            </Text>
          </Pressable>
        ))}
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {activeTab === 'active' ? (
          <>
            {offers.map((offer, i) => (
              <Animated.View
                key={offer.id}
                style={[styles.offerCard, !offer.isActive && styles.offerCardInactive]}
                entering={FadeInLeft.delay(i * 80).springify().damping(18).stiffness(180)}
              >
                <View style={styles.offerTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.offerName}>{offer.name}</Text>
                    <View style={styles.discountBadge}>
                      <Ionicons name="pricetag" size={12} color={T.amber} />
                      <Text style={styles.discountBadgeText}>
                        {offer.discountType === 'percentage'
                          ? `${offer.discountValue}% OFF`
                          : `₹${offer.discountValue} OFF`}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={offer.isActive}
                    onValueChange={() => toggleOffer(offer.id)}
                    trackColor={{ false: T.border, true: T.success }}
                    thumbColor={T.white}
                  />
                </View>
                <View style={styles.offerMeta}>
                  <Ionicons name="cube-outline" size={13} color={T.textMuted} />
                  <Text style={styles.offerMetaText}>{offer.products}</Text>
                </View>
                <View style={styles.offerMeta}>
                  <Ionicons name="calendar-outline" size={13} color={T.textMuted} />
                  <Text style={styles.offerMetaText}>{offer.validFrom} — {offer.validTo}</Text>
                </View>
                {!offer.isActive && (
                  <View style={styles.inactiveBanner}>
                    <Text style={styles.inactiveBannerText}>Paused</Text>
                  </View>
                )}
              </Animated.View>
            ))}

            {/* Empty add button */}
            <Animated.View entering={FadeInDown.delay(320).springify()}>
              <Pressable
                style={({ pressed }) => [styles.createBtn, pressed && { opacity: 0.85 }]}
                onPress={() => setActiveTab('create')}
              >
                <Ionicons name="add-circle-outline" size={20} color={T.white} />
                <Text style={styles.createBtnText}>Create New Offer</Text>
              </Pressable>
            </Animated.View>
          </>
        ) : (
          <>
            {/* Create Offer Form */}
            <Animated.View style={styles.formCard} entering={FadeInDown.delay(80).springify().damping(18)}>
              <Text style={styles.formSectionTitle}>Offer Details</Text>

              <Text style={styles.fieldLabel}>Offer Name *</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. Bulk Cement Discount"
                placeholderTextColor={T.textMuted}
                value={offerName}
                onChangeText={setOfferName}
              />

              <Text style={styles.fieldLabel}>Discount Type</Text>
              <View style={styles.toggleRow}>
                {(['Percentage', 'Flat'] as const).map(type => (
                  <Pressable
                    key={type}
                    style={[styles.toggleOption, discountType === type && styles.toggleOptionActive]}
                    onPress={() => setDiscountType(type)}
                  >
                    <Text style={[styles.toggleOptionText, discountType === type && styles.toggleOptionTextActive]}>
                      {type === 'Percentage' ? '% Percentage' : '₹ Flat Amount'}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.fieldLabel}>
                Discount Value * ({discountType === 'Percentage' ? '%' : '₹'})
              </Text>
              <TextInput
                style={styles.fieldInput}
                placeholder={discountType === 'Percentage' ? '10' : '500'}
                placeholderTextColor={T.textMuted}
                keyboardType="numeric"
                value={discountValue}
                onChangeText={setDiscountValue}
              />

              <Text style={styles.fieldLabel}>Minimum Order Value (₹)</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="1000"
                placeholderTextColor={T.textMuted}
                keyboardType="numeric"
                value={minOrder}
                onChangeText={setMinOrder}
              />
            </Animated.View>

            <Animated.View style={styles.formCard} entering={FadeInDown.delay(160).springify().damping(18)}>
              <Text style={styles.formSectionTitle}>Applicable Categories</Text>
              <View style={styles.catsGrid}>
                {CATEGORIES.map((cat, i) => {
                  const selected = selectedCats.includes(cat);
                  return (
                    <Animated.View key={cat} entering={ZoomIn.delay(180 + i * 40).springify().damping(14)}>
                      <Pressable
                        style={[styles.catChip, selected && styles.catChipActive]}
                        onPress={() => toggleCat(cat)}
                      >
                        <Text style={[styles.catChipText, selected && styles.catChipTextActive]}>
                          {cat}
                        </Text>
                        {selected && <Ionicons name="checkmark-circle" size={14} color={T.white} />}
                      </Pressable>
                    </Animated.View>
                  );
                })}
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).springify()}>
              <Pressable
                style={({ pressed }) => [styles.createBtn, pressed && { opacity: 0.85 }]}
                onPress={handleCreate}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color={T.white} />
                <Text style={styles.createBtnText}>Publish Offer</Text>
              </Pressable>
            </Animated.View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border,
  },
  backBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: T.text },
  tabBar: {
    flexDirection: 'row', backgroundColor: T.surface,
    borderBottomWidth: 1, borderBottomColor: T.border,
  },
  tabBtn: { flex: 1, paddingVertical: 13, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: T.amber },
  tabBtnText: { fontSize: 14, fontWeight: '600', color: T.textMuted },
  tabBtnTextActive: { color: T.navy, fontWeight: '700' },
  scroll: { padding: 16, paddingBottom: 48 },
  offerCard: {
    backgroundColor: T.surface, borderRadius: 14,
    borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 12,
  },
  offerCardInactive: { opacity: 0.65 },
  offerTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  offerName: { fontSize: 16, fontWeight: '700', color: T.text, marginBottom: 6 },
  discountBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8, alignSelf: 'flex-start',
  },
  discountBadgeText: { fontSize: 12, fontWeight: '700', color: T.amber },
  offerMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  offerMetaText: { fontSize: 13, color: T.textSecondary },
  inactiveBanner: {
    backgroundColor: '#F3F4F6', borderRadius: 8, paddingVertical: 5,
    alignItems: 'center', marginTop: 10,
  },
  inactiveBannerText: { fontSize: 12, fontWeight: '600', color: T.textMuted },
  formCard: {
    backgroundColor: T.surface, borderRadius: 14,
    borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 12,
  },
  formSectionTitle: { fontSize: 15, fontWeight: '700', color: T.text, marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: T.textMuted, marginBottom: 6, marginTop: 4 },
  fieldInput: {
    backgroundColor: T.bg, borderRadius: 10, borderWidth: 1, borderColor: T.border,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: T.text, marginBottom: 4,
  },
  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  toggleOption: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: T.border, alignItems: 'center',
  },
  toggleOptionActive: { borderColor: T.amber, backgroundColor: '#FEF3C7' },
  toggleOptionText: { fontSize: 13, fontWeight: '600', color: T.textSecondary },
  toggleOptionTextActive: { color: T.amber },
  catsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: T.border, backgroundColor: T.bg,
  },
  catChipActive: { borderColor: T.amber, backgroundColor: T.amber },
  catChipText: { fontSize: 13, fontWeight: '600', color: T.textSecondary },
  catChipTextActive: { color: T.white },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.amber, borderRadius: 14, paddingVertical: 16, gap: 8,
    shadowColor: T.amber, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
  },
  createBtnText: { fontSize: 16, fontWeight: '700', color: T.white },
});
