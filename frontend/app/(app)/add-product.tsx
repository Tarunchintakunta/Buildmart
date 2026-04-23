import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Colors from '../../src/theme/colors';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Cement', icon: 'layers-outline' },
  { label: 'Steel', icon: 'barbell-outline' },
  { label: 'Bricks', icon: 'apps-outline' },
  { label: 'Paint', icon: 'color-palette-outline' },
  { label: 'Pipes', icon: 'git-branch-outline' },
  { label: 'Hardware', icon: 'hammer-outline' },
  { label: 'Electric', icon: 'flash-outline' },
  { label: 'Sand', icon: 'hourglass-outline' },
  { label: 'Wood', icon: 'leaf-outline' },
];

const UNITS = [
  { label: 'Bag', value: 'bag' },
  { label: 'Kg', value: 'kg' },
  { label: 'Piece', value: 'piece' },
  { label: 'Ton', value: 'ton' },
  { label: 'Liter', value: 'liter' },
  { label: 'Coil', value: 'coil' },
  { label: 'Meter', value: 'meter' },
  { label: 'Brick', value: 'brick' },
];

// ─── Form Field ───────────────────────────────────────────────────────────────

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={styles.fieldRequired}> *</Text>}
      </Text>
      {children}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AddProductScreen() {
  const router = useRouter();

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [stock, setStock] = useState('');
  const [minOrderQty, setMinOrderQty] = useState('1');
  const [unit, setUnit] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const discount = mrp && price && parseFloat(mrp) > parseFloat(price)
    ? Math.round(((parseFloat(mrp) - parseFloat(price)) / parseFloat(mrp)) * 100)
    : 0;

  // Save button animation
  const saveScale = useSharedValue(1);
  const saveStyle = useAnimatedStyle(() => ({ transform: [{ scale: saveScale.value }] }));

  const validate = (): string | null => {
    if (!productName.trim()) return 'Product name is required.';
    if (!category) return 'Please select a category.';
    if (!price || parseFloat(price) <= 0) return 'Valid selling price is required.';
    if (!unit) return 'Please select a unit.';
    if (!stock || parseInt(stock, 10) < 0) return 'Valid stock quantity is required.';
    return null;
  };

  const handlePublish = () => {
    const error = validate();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }
    saveScale.value = withSpring(0.95, { damping: 10 }, () => {
      saveScale.value = withSpring(1);
    });
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', `"${productName}" has been added to your inventory!`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 1500);
  };

  const handleDraft = () => {
    Alert.alert('Saved as Draft', 'Product saved. You can publish it later from inventory.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInUp.duration(350)}>
        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Add Product</Text>
          <Text style={styles.headerSub}>List a new item in your inventory</Text>
        </View>
        <View style={styles.headerBtn} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Photo Upload */}
        <Animated.View
          style={styles.photoUpload}
          entering={FadeInDown.delay(60).springify().damping(18).stiffness(200)}
        >
          <View style={styles.photoUploadInner}>
            <Ionicons name="camera-outline" size={36} color={Colors.textMuted} />
            <Text style={styles.photoUploadTitle}>Add Product Photos</Text>
            <Text style={styles.photoUploadSub}>Upload up to 5 images (tap to add)</Text>
          </View>
        </Animated.View>

        {/* Basic Info Section */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(120).springify().damping(18).stiffness(200)}
        >
          <Text style={styles.sectionTitle}>BASIC INFORMATION</Text>

          <FormField label="Product Name" required>
            <TextInput
              style={styles.textInput}
              value={productName}
              onChangeText={setProductName}
              placeholder="e.g., UltraTech PPC Cement"
              placeholderTextColor={Colors.textMuted}
            />
          </FormField>

          <FormField label="Description">
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the product, specifications, brand..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </FormField>

          <FormField label="Category" required>
            <View style={styles.pillsWrap}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.label}
                  style={[styles.pill, category === cat.label && styles.pillActive]}
                  onPress={() => setCategory(cat.label)}
                >
                  <Ionicons
                    name={cat.icon as keyof typeof Ionicons.glyphMap}
                    size={13}
                    color={category === cat.label ? Colors.white : Colors.textSecondary}
                  />
                  <Text style={[styles.pillText, category === cat.label && styles.pillTextActive]}>
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </FormField>
        </Animated.View>

        {/* Pricing Section */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(180).springify().damping(18).stiffness(200)}
        >
          <Text style={styles.sectionTitle}>PRICING</Text>

          <View style={styles.rowFields}>
            <View style={styles.fieldHalf}>
              <FormField label="MRP (₹)">
                <TextInput
                  style={styles.textInput}
                  value={mrp}
                  onChangeText={setMrp}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                />
              </FormField>
            </View>
            <View style={styles.fieldHalf}>
              <FormField label="Selling Price (₹)" required>
                <TextInput
                  style={styles.textInput}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                />
              </FormField>
            </View>
          </View>

          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Ionicons name="pricetag" size={14} color={Colors.success} />
              <Text style={styles.discountText}>{discount}% discount applied for customers</Text>
            </View>
          )}
        </Animated.View>

        {/* Inventory Section */}
        <Animated.View
          style={styles.section}
          entering={FadeInDown.delay(240).springify().damping(18).stiffness(200)}
        >
          <Text style={styles.sectionTitle}>INVENTORY & UNIT</Text>

          <FormField label="Unit of Measure" required>
            <View style={styles.pillsWrap}>
              {UNITS.map((u) => (
                <Pressable
                  key={u.value}
                  style={[styles.pill, unit === u.value && styles.pillActive]}
                  onPress={() => setUnit(u.value)}
                >
                  <Text style={[styles.pillText, unit === u.value && styles.pillTextActive]}>
                    {u.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </FormField>

          <View style={styles.rowFields}>
            <View style={styles.fieldHalf}>
              <FormField label="Stock Quantity" required>
                <TextInput
                  style={styles.textInput}
                  value={stock}
                  onChangeText={setStock}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                />
              </FormField>
            </View>
            <View style={styles.fieldHalf}>
              <FormField label="Min Order Qty">
                <TextInput
                  style={styles.textInput}
                  value={minOrderQty}
                  onChangeText={setMinOrderQty}
                  placeholder="1"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                />
              </FormField>
            </View>
          </View>

          {/* Low stock alert info */}
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={14} color={Colors.primary} />
            <Text style={styles.infoText}>
              You'll be alerted when stock falls below 20% of current quantity
            </Text>
          </View>
        </Animated.View>

        {/* Preview */}
        {productName && price && unit && (
          <Animated.View
            style={styles.previewCard}
            entering={FadeInDown.delay(60).springify().damping(18).stiffness(200)}
          >
            <Text style={styles.previewLabel}>PREVIEW</Text>
            <View style={styles.previewContent}>
              <View style={styles.previewIconWrap}>
                <Ionicons name="cube-outline" size={32} color={Colors.primary} />
              </View>
              <View style={styles.previewInfo}>
                <Text style={styles.previewName} numberOfLines={1}>{productName}</Text>
                <Text style={styles.previewCategory}>{category || 'No category'}</Text>
                <Text style={styles.previewPrice}>
                  ₹{parseFloat(price || '0').toLocaleString('en-IN')} / {unit}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <Animated.View
          entering={FadeInDown.delay(300).springify().damping(18).stiffness(200)}
          style={styles.actionsWrap}
        >
          <Animated.View style={saveStyle}>
            <Pressable
              style={[styles.publishBtn, isLoading && styles.publishBtnLoading]}
              onPress={handlePublish}
              disabled={isLoading}
            >
              {isLoading ? (
                <Ionicons name="reload-outline" size={18} color={Colors.white} />
              ) : (
                <Ionicons name="checkmark-circle-outline" size={18} color={Colors.white} />
              )}
              <Text style={styles.publishBtnText}>
                {isLoading ? 'Publishing...' : 'Publish Product'}
              </Text>
            </Pressable>
          </Animated.View>

          <Pressable style={styles.draftBtn} onPress={handleDraft}>
            <Ionicons name="bookmark-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.draftBtnText}>Save as Draft</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  photoUpload: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  photoUploadInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  photoUploadTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  photoUploadSub: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  fieldRequired: {
    color: Colors.error,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.white,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldHalf: {
    flex: 1,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 12,
    marginTop: -4,
  },
  discountText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.success,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 12,
    marginTop: -4,
  },
  infoText: {
    fontSize: 12,
    color: Colors.primary,
    flex: 1,
    lineHeight: 17,
  },
  previewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  previewCategory: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 5,
  },
  previewPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  actionsWrap: {
    gap: 12,
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  publishBtnLoading: {
    opacity: 0.7,
  },
  publishBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  draftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  draftBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
});
