import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

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

const MOCK_OFFERS: Offer[] = [
  {
    id: '1',
    name: 'Bulk Discount 10%',
    discountType: 'percentage',
    discountValue: 10,
    products: 'Cement, Steel, Sand',
    validFrom: '01 Feb 2026',
    validTo: '28 Feb 2026',
    isActive: true,
  },
  {
    id: '2',
    name: 'Festival Sale',
    discountType: 'percentage',
    discountValue: 15,
    products: 'Paint, Hardware, Electrical',
    validFrom: '10 Mar 2026',
    validTo: '20 Mar 2026',
    isActive: true,
  },
  {
    id: '3',
    name: 'Buy 2 Get 1',
    discountType: 'flat',
    discountValue: 500,
    products: 'Pipes, Fittings',
    validFrom: '01 Feb 2026',
    validTo: '15 Mar 2026',
    isActive: false,
  },
];

const DISCOUNT_TYPES = ['Percentage', 'Flat'];

const APPLICABLE_CATEGORIES = [
  'Cement',
  'Steel',
  'Paint',
  'Pipes',
  'Hardware',
  'Electrical',
  'Wood',
];

export default function PricingOffersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'create'>('active');

  const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS);

  // Create new offer form state
  const [offerName, setOfferName] = useState('');
  const [discountType, setDiscountType] = useState<'Percentage' | 'Flat'>('Percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleOffer = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o))
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleCreateOffer = () => {
    if (!offerName.trim()) {
      Alert.alert('Error', 'Offer name is required.');
      return;
    }
    if (!discountValue) {
      Alert.alert('Error', 'Discount value is required.');
      return;
    }
    Alert.alert('Success', 'Offer has been created successfully.', [
      {
        text: 'OK',
        onPress: () => {
          setOfferName('');
          setDiscountValue('');
          setMinOrder('');
          setValidFrom('');
          setValidTo('');
          setSelectedCategories([]);
          setActiveTab('active');
        },
      },
    ]);
  };

  const renderActiveOffers = () => (
    <View style={s.tabContent}>
      {offers.map((offer) => (
        <View key={offer.id} style={s.offerCard}>
          <View style={s.offerCardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={s.offerName}>{offer.name}</Text>
              <View style={s.offerBadge}>
                <Ionicons name="pricetag" size={12} color={T.amber} />
                <Text style={s.offerBadgeText}>
                  {offer.discountType === 'percentage'
                    ? `${offer.discountValue}% OFF`
                    : `Rs.${offer.discountValue} OFF`}
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

          <View style={s.offerDetail}>
            <Ionicons name="cube-outline" size={14} color={T.textMuted} />
            <Text style={s.offerDetailText}>{offer.products}</Text>
          </View>

          <View style={s.offerDetail}>
            <Ionicons name="calendar-outline" size={14} color={T.textMuted} />
            <Text style={s.offerDetailText}>
              {offer.validFrom} - {offer.validTo}
            </Text>
          </View>

          <View style={s.offerActions}>
            <TouchableOpacity style={s.offerActionBtn} activeOpacity={0.7}>
              <Ionicons name="create-outline" size={16} color={T.info} />
              <Text style={[s.offerActionText, { color: T.info }]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.offerActionBtn} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
              <Text style={[s.offerActionText, { color: '#EF4444' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderCreateNew = () => (
    <View style={s.tabContent}>
      <View style={s.fieldGroup}>
        <Text style={s.label}>Offer Name</Text>
        <TextInput
          style={s.input}
          value={offerName}
          onChangeText={setOfferName}
          placeholder="e.g. Summer Sale 20%"
          placeholderTextColor={T.textMuted}
        />
      </View>

      <View style={s.fieldGroup}>
        <Text style={s.label}>Discount Type</Text>
        <View style={s.pillsContainer}>
          {DISCOUNT_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                s.pill,
                discountType === type && s.pillActive,
              ]}
              onPress={() => setDiscountType(type as 'Percentage' | 'Flat')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  s.pillText,
                  discountType === type && s.pillTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={s.fieldGroup}>
        <Text style={s.label}>
          Discount Value {discountType === 'Percentage' ? '(%)' : '(Rs.)'}
        </Text>
        <TextInput
          style={s.input}
          value={discountValue}
          onChangeText={setDiscountValue}
          placeholder="0"
          placeholderTextColor={T.textMuted}
          keyboardType="number-pad"
        />
      </View>

      <View style={s.fieldGroup}>
        <Text style={s.label}>Minimum Order (Rs.)</Text>
        <TextInput
          style={s.input}
          value={minOrder}
          onChangeText={setMinOrder}
          placeholder="e.g. 1000"
          placeholderTextColor={T.textMuted}
          keyboardType="number-pad"
        />
      </View>

      <View style={s.row}>
        <View style={[s.fieldGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={s.label}>Valid From</Text>
          <TextInput
            style={s.input}
            value={validFrom}
            onChangeText={setValidFrom}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={T.textMuted}
          />
        </View>
        <View style={[s.fieldGroup, { flex: 1, marginLeft: 10 }]}>
          <Text style={s.label}>Valid To</Text>
          <TextInput
            style={s.input}
            value={validTo}
            onChangeText={setValidTo}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={T.textMuted}
          />
        </View>
      </View>

      <View style={s.fieldGroup}>
        <Text style={s.label}>Applicable Categories</Text>
        <View style={s.pillsContainer}>
          {APPLICABLE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                s.pill,
                selectedCategories.includes(cat) && s.pillActive,
              ]}
              onPress={() => toggleCategory(cat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  s.pillText,
                  selectedCategories.includes(cat) && s.pillTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={s.createBtn}
        onPress={handleCreateOffer}
        activeOpacity={0.8}
      >
        <Text style={s.createBtnText}>Create Offer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Pricing & Offers</Text>
        <View style={{ width: 42 }} />
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        <TouchableOpacity
          style={[s.tab, activeTab === 'active' && s.tabActive]}
          onPress={() => setActiveTab('active')}
          activeOpacity={0.7}
        >
          <Text
            style={[s.tabText, activeTab === 'active' && s.tabTextActive]}
          >
            Active Offers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tab, activeTab === 'create' && s.tabActive]}
          onPress={() => setActiveTab('create')}
          activeOpacity={0.7}
        >
          <Text
            style={[s.tabText, activeTab === 'create' && s.tabTextActive]}
          >
            Create New
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {activeTab === 'active' ? renderActiveOffers() : renderCreateNew()}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.text,
  },
  tabs: {
    flexDirection: 'row' as const,
    backgroundColor: T.surface,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center' as const,
    backgroundColor: T.bg,
  },
  tabActive: {
    backgroundColor: T.navy,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: T.textSecondary,
  },
  tabTextActive: {
    color: T.white,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  offerCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 14,
  },
  offerCardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  offerName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 4,
  },
  offerBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.amberBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start' as const,
    gap: 4,
  },
  offerBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: T.amber,
  },
  offerDetail: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 6,
    gap: 8,
  },
  offerDetailText: {
    fontSize: 13,
    color: T.textSecondary,
  },
  offerActions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: T.border,
    gap: 16,
  },
  offerActionBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  offerActionText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: T.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: T.text,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
  },
  pillsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
  },
  pillActive: {
    backgroundColor: T.navy,
    borderColor: T.navy,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.textSecondary,
  },
  pillTextActive: {
    color: T.white,
  },
  createBtn: {
    backgroundColor: T.amber,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  createBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.white,
  },
};
