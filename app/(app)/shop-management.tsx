import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type ShopStatus = 'Active' | 'Pending' | 'Suspended';
type TabFilter = ShopStatus;

const STATUS_COLORS: Record<ShopStatus, string> = {
  Active: '#10B981',
  Pending: T.amber,
  Suspended: '#EF4444',
};

const TABS: TabFilter[] = ['Active', 'Pending', 'Suspended'];

const STATS = [
  { label: 'Total Shops', value: '45', icon: 'storefront' as const, color: '#3B82F6' },
  { label: 'Active', value: '40', icon: 'checkmark-circle' as const, color: '#10B981' },
  { label: 'Suspended', value: '3', icon: 'ban' as const, color: '#EF4444' },
  { label: 'Pending', value: '2', icon: 'time' as const, color: T.amber },
];

type Shop = {
  id: string;
  name: string;
  owner: string;
  phone: string;
  rating: number;
  totalOrders: number;
  revenue: string;
  joinedDate: string;
  status: ShopStatus;
  avatarColor: string;
};

const SHOPS: Shop[] = [
  {
    id: '1',
    name: 'Sharma Building Materials',
    owner: 'Ramesh Sharma',
    phone: '+91 98765 43210',
    rating: 4.8,
    totalOrders: 342,
    revenue: 'Rs.8.5L',
    joinedDate: '15 Mar 2025',
    status: 'Active',
    avatarColor: '#3B82F6',
  },
  {
    id: '2',
    name: 'Krishna Cement House',
    owner: 'Sunil Krishna',
    phone: '+91 98765 43211',
    rating: 4.5,
    totalOrders: 278,
    revenue: 'Rs.6.2L',
    joinedDate: '22 Apr 2025',
    status: 'Active',
    avatarColor: '#10B981',
  },
  {
    id: '3',
    name: 'New Age Hardware Store',
    owner: 'Mohit Jain',
    phone: '+91 98765 43212',
    rating: 0,
    totalOrders: 0,
    revenue: 'Rs.0',
    joinedDate: '24 Feb 2026',
    status: 'Pending',
    avatarColor: '#8B5CF6',
  },
  {
    id: '4',
    name: 'Budget Tiles & Sanitary',
    owner: 'Deepak Verma',
    phone: '+91 98765 43213',
    rating: 3.2,
    totalOrders: 45,
    revenue: 'Rs.1.1L',
    joinedDate: '10 Aug 2025',
    status: 'Suspended',
    avatarColor: '#EF4444',
  },
];

export default function ShopManagementScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabFilter>('Active');

  const filteredShops = SHOPS.filter((shop) => shop.status === activeTab);

  const renderShopCard = (shop: Shop) => {
    const statusColor = STATUS_COLORS[shop.status];
    return (
      <View key={shop.id} style={s.shopCard}>
        {/* Shop Header */}
        <View style={s.shopHeader}>
          <View style={[s.shopAvatar, { backgroundColor: shop.avatarColor + '18' }]}>
            <Ionicons name="storefront" size={22} color={shop.avatarColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.shopName}>{shop.name}</Text>
            <Text style={s.shopOwner}>{shop.owner}</Text>
          </View>
          <View style={[s.statusBadge, { backgroundColor: statusColor + '26' }]}>
            <Text style={[s.statusText, { color: statusColor }]}>{shop.status}</Text>
          </View>
        </View>

        {/* Shop Info */}
        <View style={s.infoGrid}>
          <View style={s.infoItem}>
            <Ionicons name="call-outline" size={14} color={T.textMuted} />
            <Text style={s.infoText}>{shop.phone}</Text>
          </View>
          <View style={s.infoItem}>
            <Ionicons name="calendar-outline" size={14} color={T.textMuted} />
            <Text style={s.infoText}>Joined {shop.joinedDate}</Text>
          </View>
        </View>

        {/* Stats Row */}
        {shop.status !== 'Pending' && (
          <View style={s.shopStatsRow}>
            <View style={s.shopStat}>
              <View style={s.ratingRow}>
                <Ionicons name="star" size={14} color={T.amber} />
                <Text style={s.shopStatValue}>{shop.rating}</Text>
              </View>
              <Text style={s.shopStatLabel}>Rating</Text>
            </View>
            <View style={s.shopStatDivider} />
            <View style={s.shopStat}>
              <Text style={s.shopStatValue}>{shop.totalOrders}</Text>
              <Text style={s.shopStatLabel}>Orders</Text>
            </View>
            <View style={s.shopStatDivider} />
            <View style={s.shopStat}>
              <Text style={[s.shopStatValue, { color: T.amber }]}>{shop.revenue}</Text>
              <Text style={s.shopStatLabel}>Revenue</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={s.actionRow}>
          {shop.status === 'Pending' ? (
            <>
              <TouchableOpacity style={s.approveBtn}>
                <Ionicons name="checkmark-circle-outline" size={16} color={T.white} />
                <Text style={s.approveBtnText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.rejectBtn}>
                <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
                <Text style={s.rejectBtnText}>Reject</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={s.viewBtn}>
                <Ionicons name="eye-outline" size={16} color={T.navy} />
                <Text style={s.viewBtnText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  s.toggleBtn,
                  {
                    backgroundColor: shop.status === 'Active' ? '#EF444418' : '#10B98118',
                    borderColor: shop.status === 'Active' ? '#EF4444' : '#10B981',
                  },
                ]}
              >
                <Ionicons
                  name={shop.status === 'Active' ? 'ban-outline' : 'checkmark-circle-outline'}
                  size={16}
                  color={shop.status === 'Active' ? '#EF4444' : '#10B981'}
                />
                <Text
                  style={[
                    s.toggleBtnText,
                    { color: shop.status === 'Active' ? '#EF4444' : '#10B981' },
                  ]}
                >
                  {shop.status === 'Active' ? 'Suspend' : 'Activate'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.contactBtn}>
                <Ionicons name="call-outline" size={16} color={T.navy} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Shop Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Stats Summary */}
        <View style={s.statsRow}>
          {STATS.map((stat) => (
            <View key={stat.label} style={s.statCard}>
              <View style={[s.statIcon, { backgroundColor: stat.color + '18' }]}>
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
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

        {/* Shop Cards */}
        <View style={s.shopList}>
          {filteredShops.length === 0 ? (
            <View style={s.empty}>
              <View style={s.emptyIcon}>
                <Ionicons name="storefront-outline" size={48} color={T.textMuted} />
              </View>
              <Text style={s.emptyTitle}>No shops</Text>
              <Text style={s.emptyDesc}>No {activeTab.toLowerCase()} shops to display.</Text>
            </View>
          ) : (
            filteredShops.map(renderShopCard)
          )}
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: T.text,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row' as const,
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    paddingVertical: 14,
    alignItems: 'center' as const,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: T.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: '500' as const,
  },

  /* Tabs */
  tabRow: {
    flexDirection: 'row' as const,
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center' as const,
  },
  tabActive: {
    backgroundColor: T.navy,
    borderColor: T.navy,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: T.textMuted,
  },
  tabTextActive: {
    color: T.white,
  },

  /* Shop List */
  shopList: {
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 14,
  },

  /* Shop Card */
  shopCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  shopHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginBottom: 14,
  },
  shopAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  shopName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
  },
  shopOwner: {
    fontSize: 13,
    color: T.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },

  /* Info Grid */
  infoGrid: {
    gap: 8,
    marginBottom: 14,
  },
  infoItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: T.textSecondary,
  },

  /* Shop Stats */
  shopStatsRow: {
    flexDirection: 'row' as const,
    backgroundColor: T.bg,
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 14,
  },
  shopStat: {
    flex: 1,
    alignItems: 'center' as const,
    gap: 4,
  },
  shopStatDivider: {
    width: 1,
    backgroundColor: T.border,
  },
  ratingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  shopStatValue: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
  },
  shopStatLabel: {
    fontSize: 11,
    color: T.textMuted,
    fontWeight: '500' as const,
  },

  /* Actions */
  actionRow: {
    flexDirection: 'row' as const,
    gap: 10,
  },
  viewBtn: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.navy,
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.navy,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  contactBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.navy,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#10B981',
  },
  approveBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.white,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: '#EF444418',
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#EF4444',
  },

  /* Empty */
  empty: {
    alignItems: 'center' as const,
    paddingTop: 60,
    gap: 10,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.text,
  },
  emptyDesc: {
    fontSize: 14,
    color: T.textSecondary,
    textAlign: 'center' as const,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
};
