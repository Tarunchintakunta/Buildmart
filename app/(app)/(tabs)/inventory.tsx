import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

const INVENTORY_TABS = ['All', 'Low Stock', 'Out of Stock'];

const MOCK_INVENTORY = [
  {
    id: 'i1',
    product: 'UltraTech Cement 50kg',
    category: 'Cement',
    price: 380,
    stock: 100,
    minStock: 20,
    unit: 'bag',
    isAvailable: true,
  },
  {
    id: 'i2',
    product: 'ACC Cement 50kg',
    category: 'Cement',
    price: 370,
    stock: 5,
    minStock: 20,
    unit: 'bag',
    isAvailable: true,
  },
  {
    id: 'i3',
    product: 'Wooden Door - Teak',
    category: 'Doors',
    price: 15000,
    stock: 10,
    minStock: 5,
    unit: 'piece',
    isAvailable: true,
  },
  {
    id: 'i4',
    product: 'PVC Pipe 4 inch',
    category: 'Pipes',
    price: 250,
    stock: 0,
    minStock: 30,
    unit: '10ft',
    isAvailable: false,
  },
  {
    id: 'i5',
    product: 'Cement Nails 3 inch',
    category: 'Hardware',
    price: 120,
    stock: 500,
    minStock: 100,
    unit: 'kg',
    isAvailable: true,
  },
  {
    id: 'i6',
    product: 'TMT Bar 12mm',
    category: 'Steel',
    price: 650,
    stock: 8,
    minStock: 25,
    unit: 'piece',
    isAvailable: true,
  },
  {
    id: 'i7',
    product: 'Copper Wire 2.5mm',
    category: 'Electrical',
    price: 4500,
    stock: 50,
    minStock: 15,
    unit: 'coil',
    isAvailable: true,
  },
  {
    id: 'i8',
    product: 'Asian Paints Primer',
    category: 'Paint',
    price: 2200,
    stock: 0,
    minStock: 10,
    unit: '20L',
    isAvailable: false,
  },
];

const getStockStatus = (stock: number, minStock: number) => {
  if (stock === 0) return { label: 'Out of Stock', color: 'text-red-500', bg: 'bg-red-500/20' };
  if (stock <= minStock) return { label: 'Low Stock', color: 'text-yellow-500', bg: 'bg-yellow-500/20' };
  return { label: 'In Stock', color: 'text-green-500', bg: 'bg-green-500/20' };
};

export default function InventoryScreen() {
  const [selectedTab, setSelectedTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const filteredInventory = MOCK_INVENTORY.filter((item) => {
    const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedTab === 'Low Stock') return item.stock > 0 && item.stock <= item.minStock;
    if (selectedTab === 'Out of Stock') return item.stock === 0;
    return true;
  });

  const lowStockCount = MOCK_INVENTORY.filter((i) => i.stock > 0 && i.stock <= i.minStock).length;
  const outOfStockCount = MOCK_INVENTORY.filter((i) => i.stock === 0).length;

  const handleUpdateStock = (itemId: string, newStock: number) => {
    Alert.alert('Stock Updated', `Stock updated to ${newStock} units`);
    setEditingItem(null);
  };

  const handleToggleAvailability = (itemId: string, currentStatus: boolean) => {
    Alert.alert(
      currentStatus ? 'Mark as Unavailable?' : 'Mark as Available?',
      currentStatus
        ? 'This product will be hidden from customers'
        : 'This product will be visible to customers',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // Update logic here
          },
        },
      ]
    );
  };

  const getStockStatusValue = (stock: number, minStock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.2)' };
    if (stock <= minStock) return { label: 'Low Stock', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' };
    return { label: 'In Stock', color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' };
  };

  const renderInventoryItem = ({ item }: { item: typeof MOCK_INVENTORY[0] }) => {
    const stockStatus = getStockStatusValue(item.stock, item.minStock);
    const isLowOrOut = item.stock <= item.minStock;

    return (
      <View
        style={[
          s.card,
          isLowOrOut && { borderLeftWidth: 4, borderLeftColor: T.amber },
        ]}
      >
        <View style={s.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={s.productName}>{item.product}</Text>
            <View style={s.categoryRow}>
              <View style={s.categoryBadge}>
                <Text style={s.categoryText}>{item.category}</Text>
              </View>
              <Text style={{ color: T.textMuted, marginHorizontal: 8 }}>•</Text>
              <Text style={s.priceText}>₹{item.price}/{item.unit}</Text>
            </View>
          </View>
          <View style={[s.statusBadge, { backgroundColor: stockStatus.bg }]}>
            <Text style={{ color: stockStatus.color, fontSize: 12, fontWeight: '700' }}>
              {stockStatus.label}
            </Text>
          </View>
        </View>

        {/* Stock Info */}
        <View style={s.stockInfoRow}>
          <View>
            <Text style={s.stockLabel}>Current Stock</Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: item.stock === 0 ? '#EF4444' : item.stock <= item.minStock ? '#F59E0B' : T.text,
              }}
            >
              {item.stock} {item.unit}s
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.stockLabel}>Minimum Stock</Text>
            <Text style={s.minStockValue}>{item.minStock} {item.unit}s</Text>
          </View>
        </View>

        {/* Stock Progress Bar */}
        <View style={s.progressTrack}>
          <View
            style={{
              height: '100%',
              borderRadius: 9999,
              width: `${Math.min((item.stock / (item.minStock * 2)) * 100, 100)}%`,
              backgroundColor: item.stock === 0 ? '#EF4444' : item.stock <= item.minStock ? '#F59E0B' : '#10B981',
            }}
          />
        </View>

        {/* Actions */}
        <View style={s.actionsRow}>
          <TouchableOpacity
            style={s.updateStockBtn}
            onPress={() => setEditingItem(item.id)}
          >
            <Ionicons name="create" size={20} color={T.amber} />
            <Text style={s.updateStockText}>Update Stock</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              s.toggleBtn,
              {
                backgroundColor: item.isAvailable ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              },
            ]}
            onPress={() => handleToggleAvailability(item.id, item.isAvailable)}
          >
            <Ionicons
              name={item.isAvailable ? 'eye-off' : 'eye'}
              size={20}
              color={item.isAvailable ? '#EF4444' : '#10B981'}
            />
            <Text
              style={{
                fontWeight: '700',
                marginLeft: 8,
                color: item.isAvailable ? '#EF4444' : '#10B981',
              }}
            >
              {item.isAvailable ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Restock for low/out of stock */}
        {isLowOrOut && (
          <TouchableOpacity style={s.quickRestockBtn}>
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
            <Text style={s.quickRestockText}>Quick Restock</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safeArea}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerRow}>
          <Text style={s.headerTitle}>Inventory</Text>
          <TouchableOpacity style={s.addBtn}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={s.addBtnText}>Add Product</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={s.searchBar}>
          <Ionicons name="search" size={22} color={T.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search products..."
            placeholderTextColor={T.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        <View style={s.statCard}>
          <View style={[s.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
            <Ionicons name="cube" size={24} color="#3B82F6" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={s.statValue}>{MOCK_INVENTORY.length}</Text>
            <Text style={s.statLabel}>Products</Text>
          </View>
        </View>
        <View style={s.statCard}>
          <View style={[s.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Ionicons name="warning" size={24} color="#F59E0B" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={[s.statValue, { color: '#F59E0B' }]}>{lowStockCount}</Text>
            <Text style={s.statLabel}>Low Stock</Text>
          </View>
        </View>
        <View style={s.statCard}>
          <View style={[s.statIcon, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
            <Ionicons name="close-circle" size={24} color="#EF4444" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={[s.statValue, { color: '#EF4444' }]}>{outOfStockCount}</Text>
            <Text style={s.statLabel}>Out</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabsRow}>
        {INVENTORY_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              s.tab,
              selectedTab === tab ? s.tabActive : s.tabInactive,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                s.tabText,
                selectedTab === tab ? s.tabTextActive : s.tabTextInactive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inventory List */}
      <FlatList
        data={filteredInventory}
        renderItem={renderInventoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyContainer}>
            <Ionicons name="cube" size={48} color={T.textMuted} />
            <Text style={s.emptyText}>No products found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = {
  safeArea: {
    flex: 1,
    backgroundColor: T.bg,
  } as const,

  /* ── Header ── */
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  } as const,
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  } as const,
  headerTitle: {
    color: T.text,
    fontSize: 28,
    fontWeight: '700',
  } as const,
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.amber,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  } as const,
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
  } as const,

  /* ── Search ── */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: T.border,
  } as const,
  searchInput: {
    flex: 1,
    color: T.text,
    paddingVertical: 14,
    marginLeft: 12,
    fontSize: 16,
  } as const,

  /* ── Stats ── */
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  } as const,
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  } as const,
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  } as const,
  statValue: {
    color: T.text,
    fontWeight: '700',
    fontSize: 20,
  } as const,
  statLabel: {
    color: T.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  } as const,

  /* ── Tabs ── */
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  } as const,
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9999,
    alignItems: 'center',
  } as const,
  tabActive: {
    backgroundColor: T.navy,
  } as const,
  tabInactive: {
    backgroundColor: T.bg,
  } as const,
  tabText: {
    fontWeight: '600',
    fontSize: 14,
  } as const,
  tabTextActive: {
    color: '#FFFFFF',
  } as const,
  tabTextInactive: {
    color: T.textSecondary,
  } as const,

  /* ── Inventory Card ── */
  card: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  } as const,
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  } as const,
  productName: {
    color: T.text,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
  } as const,
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  } as const,
  categoryBadge: {
    backgroundColor: T.bg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  } as const,
  categoryText: {
    color: T.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  } as const,
  priceText: {
    color: T.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  } as const,
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  } as const,

  /* ── Stock Info ── */
  stockInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: T.border,
  } as const,
  stockLabel: {
    color: T.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  } as const,
  minStockValue: {
    color: T.textSecondary,
    fontWeight: '600',
  } as const,

  /* ── Progress Bar ── */
  progressTrack: {
    height: 8,
    borderRadius: 9999,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: T.bg,
  } as const,

  /* ── Actions ── */
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: T.border,
  } as const,
  updateStockBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: T.bg,
  } as const,
  updateStockText: {
    color: T.amber,
    fontWeight: '700',
    marginLeft: 8,
  } as const,
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  } as const,

  /* ── Quick Restock ── */
  quickRestockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 16,
    backgroundColor: T.amber,
    shadowColor: T.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  } as const,
  quickRestockText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
  } as const,

  /* ── Empty State ── */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  } as const,
  emptyText: {
    color: T.textSecondary,
    marginTop: 16,
  } as const,
};
