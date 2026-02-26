import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

const CATEGORIES = [
  'Cement',
  'Steel',
  'Paint',
  'Pipes',
  'Hardware',
  'Electrical',
  'Wood',
];

const UNITS = ['per bag', 'per kg', 'per piece', 'per meter'];

export default function AddProductScreen() {
  const router = useRouter();

  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('per bag');
  const [mrp, setMrp] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [minStockAlert, setMinStockAlert] = useState('');
  const [description, setDescription] = useState('');

  const discountPercent =
    mrp && sellingPrice && parseFloat(mrp) > 0
      ? Math.round(
          ((parseFloat(mrp) - parseFloat(sellingPrice)) / parseFloat(mrp)) * 100
        )
      : 0;

  const handlePublish = () => {
    if (!productName.trim()) {
      Alert.alert('Error', 'Product name is required.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category.');
      return;
    }
    if (!sellingPrice) {
      Alert.alert('Error', 'Selling price is required.');
      return;
    }
    Alert.alert('Success', 'Product has been published successfully.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleDraft = () => {
    Alert.alert('Saved', 'Product has been saved as draft.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Add Product</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Image Upload Area */}
        <View style={s.formContainer}>
          <TouchableOpacity style={s.imageUpload} activeOpacity={0.7}>
            <View style={s.imageUploadInner}>
              <Ionicons name="camera-outline" size={36} color={T.textMuted} />
              <Text style={s.imageUploadText}>Add Photos</Text>
              <Text style={s.imageUploadHint}>Upload up to 5 product images</Text>
            </View>
          </TouchableOpacity>

          {/* Product Name */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Product Name</Text>
            <TextInput
              style={s.input}
              value={productName}
              onChangeText={setProductName}
              placeholder="Enter product name"
              placeholderTextColor={T.textMuted}
            />
          </View>

          {/* Category */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Category</Text>
            <View style={s.pillsContainer}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    s.pill,
                    selectedCategory === cat && s.pillActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      s.pillText,
                      selectedCategory === cat && s.pillTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pricing Section */}
          <Text style={s.sectionTitle}>PRICING</Text>

          <View style={s.row}>
            <View style={[s.fieldGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={s.label}>MRP (Rs.)</Text>
              <TextInput
                style={s.input}
                value={mrp}
                onChangeText={setMrp}
                placeholder="0"
                placeholderTextColor={T.textMuted}
                keyboardType="number-pad"
              />
            </View>
            <View style={[s.fieldGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={s.label}>Selling Price (Rs.)</Text>
              <TextInput
                style={s.input}
                value={sellingPrice}
                onChangeText={setSellingPrice}
                placeholder="0"
                placeholderTextColor={T.textMuted}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {discountPercent > 0 && (
            <View style={s.discountBadge}>
              <Ionicons name="pricetag" size={14} color={T.success} />
              <Text style={s.discountText}>
                {discountPercent}% discount applied
              </Text>
            </View>
          )}

          {/* Unit */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Unit</Text>
            <View style={s.pillsContainer}>
              {UNITS.map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    s.pill,
                    selectedUnit === unit && s.pillActive,
                  ]}
                  onPress={() => setSelectedUnit(unit)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      s.pillText,
                      selectedUnit === unit && s.pillTextActive,
                    ]}
                  >
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stock Section */}
          <Text style={s.sectionTitle}>STOCK</Text>

          <View style={s.row}>
            <View style={[s.fieldGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={s.label}>Stock Quantity</Text>
              <TextInput
                style={s.input}
                value={stockQty}
                onChangeText={setStockQty}
                placeholder="0"
                placeholderTextColor={T.textMuted}
                keyboardType="number-pad"
              />
            </View>
            <View style={[s.fieldGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={s.label}>Min Stock Alert</Text>
              <TextInput
                style={s.input}
                value={minStockAlert}
                onChangeText={setMinStockAlert}
                placeholder="0"
                placeholderTextColor={T.textMuted}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Description */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Description</Text>
            <TextInput
              style={[s.input, s.inputMultiline]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your product..."
              placeholderTextColor={T.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={s.publishBtn}
            onPress={handlePublish}
            activeOpacity={0.8}
          >
            <Text style={s.publishBtnText}>Publish Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.draftBtn}
            onPress={handleDraft}
            activeOpacity={0.7}
          >
            <Text style={s.draftBtnText}>Save as Draft</Text>
          </TouchableOpacity>
        </View>
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
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  imageUpload: {
    borderWidth: 2,
    borderColor: T.border,
    borderStyle: 'dashed' as const,
    borderRadius: 14,
    marginBottom: 24,
    overflow: 'hidden' as const,
  },
  imageUploadInner: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 36,
  },
  imageUploadText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: T.textSecondary,
    marginTop: 8,
  },
  imageUploadHint: {
    fontSize: 12,
    color: T.textMuted,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
    marginLeft: 4,
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
  inputMultiline: {
    minHeight: 100,
    paddingTop: 14,
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
  discountBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 18,
    gap: 6,
  },
  discountText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.success,
  },
  publishBtn: {
    backgroundColor: T.amber,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  publishBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.white,
  },
  draftBtn: {
    backgroundColor: T.bg,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 10,
    borderWidth: 1,
    borderColor: T.border,
  },
  draftBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.textSecondary,
  },
};
