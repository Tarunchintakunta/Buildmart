import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
  RefreshControl,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import Colors from '../../../src/theme/colors';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InventoryItem {
  id: string;
  product: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  unit: string;
  isAvailable: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', product: 'UltraTech PPC Cement', category: 'Cement', price: 385, stock: 120, minStock: 20, unit: 'bag', isAvailable: true, iconName: 'layers-outline', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  { id: 'i2', product: 'ACC Gold Cement', category: 'Cement', price: 390, stock: 7, minStock: 20, unit: 'bag', isAvailable: true, iconName: 'layers-outline', iconBg: '#F0FDF4', iconColor: Colors.success },
  { id: 'i3', product: 'SAIL TMT Bars Fe500D', category: 'Steel', price: 72, stock: 500, minStock: 50, unit: 'kg', isAvailable: true, iconName: 'barbell-outline', iconBg: '#F5F3FF', iconColor: '#8B5CF6' },
  { id: 'i4', product: 'CPVC Pipes 1 inch', category: 'Pipes', price: 285, stock: 0, minStock: 30, unit: 'pipe', isAvailable: false, iconName: 'git-branch-outline', iconBg: '#FFF7ED', iconColor: '#F97316' },
  { id: 'i5', product: 'Havells FR Wire 2.5mm', category: 'Electric', price: 2200, stock: 25, minStock: 10, unit: 'coil', isAvailable: true, iconName: 'flash-outline', iconBg: '#FFFBEB', iconColor: Colors.accent },
  { id: 'i6', product: 'Asian Paints Apex Ultima', category: 'Paint', price: 3400, stock: 8, minStock: 10, unit: 'bucket', isAvailable: true, iconName: 'color-palette-outline', iconBg: '#FFF0F3', iconColor: '#EC4899' },
  { id: 'i7', product: 'River Sand Grade 1', category: 'Sand', price: 1800, stock: 50, minStock: 10, unit: 'ton', isAvailable: true, iconName: 'hourglass-outline', iconBg: '#FFF7ED', iconColor: '#F97316' },
  { id: 'i8', product: '20mm Blue Metal Aggregate', category: 'Hardware', price: 1500, stock: 0, minStock: 5, unit: 'ton', isAvailable: false, iconName: 'diamond-outline', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  { id: 'i9', product: 'Sintex Water Tank 1000L', category: 'Hardware', price: 8200, stock: 4, minStock: 3, unit: 'tank', isAvailable: true, iconName: 'water-outline', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  { id: 'i10', product: 'Red Clay Bricks', category: 'Bricks', price: 7, stock: 5000, minStock: 500, unit: 'brick', isAvailable: true, iconName: 'apps-outline', iconBg: '#FFF7ED', iconColor: '#F97316' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStockStatus(stock: number, minStock: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (stock === 0) return { label: 'Out of Stock', color: Colors.error, bg: '#FEF2F2' };
  if (stock < minStock) return { label: 'Low Stock', color: Colors.accent, bg: Colors.amberBg };
  return { label: 'In Stock', color: Colors.success, bg: '#F0FDF4' };
}

const TABS = ['All', 'Low Stock', 'Out of Stock'];

// ─── Inventory Card ───────────────────────────────────────────────────────────

function InventoryCard({
  item,
  index,
  onEdit,
  onDelete,
  onToggle,
  onUpdateStock,
}: {
  item: InventoryItem;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (val: boolean) => void;
  onUpdateStock: () => void;
}) {
  const stockStatus = getStockStatus(item.stock, item.minStock);
  const isLow = item.stock > 0 && item.stock < item.minStock;
  const isOut = item.stock === 0;
  const progressPct = Math.min((item.stock / (item.minStock * 2)) * 100, 100);

  return (
    <Animated.View
      style={[styles.card, (isLow || isOut) && styles.cardWarning]}
      entering={FadeInDown.delay(index * 60).springify().damping(18).stiffness(200)}
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={[styles.cardIcon, { backgroundColor: item.iconBg }]}>
          <Ionicons name={item.iconName} size={22} color={item.iconColor} />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardProductName} numberOfLines={1}>{item.product}</Text>
          <View style={styles.cardMeta}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{item.category}</Text>
            </View>
            <Text style={styles.cardPrice}>₹{item.price.toLocaleString('en-IN')}/{item.unit}</Text>
          </View>
        </View>
        <View style={[styles.stockBadge, { backgroundColor: stockStatus.bg }]}>
          <Text style={[styles.stockBadgeText, { color: stockStatus.color }]}>
            {stockStatus.label}
          </Text>
        </View>
      </View>

      {/* Stock Info Row */}
      <View style={styles.stockInfoRow}>
        <View style={styles.stockInfoItem}>
          <Text style={styles.stockInfoLabel}>Current Stock</Text>
          <Text style={[styles.stockInfoValue, { color: stockStatus.color }]}>
            {item.stock.toLocaleString('en-IN')} {item.unit}{item.stock !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.stockInfoItem}>
          <Text style={styles.stockInfoLabel}>Min Threshold</Text>
          <Text style={styles.stockInfoMinValue}>
            {item.minStock} {item.unit}{item.minStock !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.stockInfoItem}>
          <Text style={styles.stockInfoLabel}>Available</Text>
          <Switch
            value={item.isAvailable}
            onValueChange={onToggle}
            trackColor={{ false: Colors.border, true: Colors.primary + '60' }}
            thumbColor={item.isAvailable ? Colors.primary : Colors.textMuted}
            style={styles.stockSwitch}
          />
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[
          styles.progressFill,
          { width: `${progressPct}%`, backgroundColor: stockStatus.color },
        ]} />
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <Pressable style={styles.actionBtn} onPress={onUpdateStock}>
          <Ionicons name="create-outline" size={16} color={Colors.primary} />
          <Text style={styles.actionBtnText}>Update Stock</Text>
        </Pressable>
        <Pressable style={styles.actionBtnSecondary} onPress={onEdit}>
          <Ionicons name="pencil-outline" size={16} color={Colors.textSecondary} />
        </Pressable>
        <Pressable style={styles.actionBtnDanger} onPress={onDelete}>
          <Ionicons name="trash-outline" size={16} color={Colors.error} />
        </Pressable>
      </View>

      {/* Low/Out Stock CTA */}
      {(isLow || isOut) && (
        <Pressable style={styles.restockBtn} onPress={onUpdateStock}>
          <Ionicons name="refresh-outline" size={15} color={Colors.white} />
          <Text style={styles.restockBtnText}>
            {isOut ? 'Restock Now' : 'Quick Restock — Running Low'}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function InventoryScreen() {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filtered = inventory.filter((item) => {
    const matchesSearch = item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'Low Stock') return item.stock > 0 && item.stock < item.minStock;
    if (activeTab === 'Out of Stock') return item.stock === 0;
    return true;
  });

  const totalProducts = inventory.length;
  const lowCount = inventory.filter((i) => i.stock > 0 && i.stock < i.minStock).length;
  const outCount = inventory.filter((i) => i.stock === 0).length;

  const handleToggle = (id: string, val: boolean) => {
    setInventory((prev) => prev.map((i) => i.id === id ? { ...i, isAvailable: val } : i));
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Product',
      `Remove "${name}" from your inventory?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setInventory((prev) => prev.filter((i) => i.id !== id)),
        },
      ]
    );
  };

  const handleUpdateStock = (id: string, name: string) => {
    Alert.prompt(
      'Update Stock',
      `Enter new stock quantity for "${name}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: (value: string | undefined) => {
            const qty = parseInt(value ?? '0', 10);
            if (!isNaN(qty) && qty >= 0) {
              setInventory((prev) => prev.map((i) => i.id === id ? { ...i, stock: qty } : i));
            }
          },
        },
      ],
      'plain-text',
      '',
      'number-pad'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInUp.duration(350)}>
        <View>
          <Text style={styles.headerTitle}>Inventory</Text>
          <Text style={styles.headerSub}>{totalProducts} products listed</Text>
        </View>
        <Pressable
          style={styles.addFab}
          onPress={() => router.push('/(app)/add-product')}
        >
          <Ionicons name="add" size={18} color={Colors.white} />
          <Text style={styles.addFabText}>Add Product</Text>
        </Pressable>
      </Animated.View>

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, categories..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {[
          { label: 'Products', value: totalProducts, color: Colors.primary, icon: 'cube-outline' as const, bg: '#EFF6FF' },
          { label: 'Low Stock', value: lowCount, color: Colors.accent, icon: 'warning-outline' as const, bg: Colors.amberBg },
          { label: 'Out of Stock', value: outCount, color: Colors.error, icon: 'close-circle-outline' as const, bg: '#FEF2F2' },
        ].map((stat) => (
          <Pressable
            key={stat.label}
            style={styles.statCard}
            onPress={() => setActiveTab(stat.label === 'Products' ? 'All' : stat.label)}
          >
            <View style={[styles.statIcon, { backgroundColor: stat.bg }]}>
              <Ionicons name={stat.icon} size={18} color={stat.color} />
            </View>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          <Animated.View style={styles.emptyState} entering={FadeInDown.delay(100).springify()}>
            <Ionicons name="cube-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySub}>
              {search ? `No results for "${search}"` : 'Add products to your inventory'}
            </Text>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <InventoryCard
            item={item}
            index={index}
            onEdit={() => Alert.alert('Edit', `Edit "${item.product}" — coming soon`)}
            onDelete={() => handleDelete(item.id, item.product)}
            onToggle={(val) => handleToggle(item.id, val)}
            onUpdateStock={() => handleUpdateStock(item.id, item.product)}
          />
        )}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addFab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  addFabText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
    backgroundColor: Colors.background,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardWarning: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardProductName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryPill: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  cardPrice: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stockInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 10,
  },
  stockInfoItem: {
    alignItems: 'center',
    gap: 4,
  },
  stockInfoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  stockInfoValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  stockInfoMinValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  stockSwitch: {
    transform: [{ scale: 0.85 }],
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.background,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  actionBtnSecondary: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionBtnDanger: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  restockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingVertical: 11,
    marginTop: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  restockBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  emptySub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
