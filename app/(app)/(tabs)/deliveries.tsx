import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

const DELIVERY_TABS = ['Active', 'Available', 'Completed'];

const MOCK_DELIVERIES = [
  {
    id: 'd1',
    orderNumber: 'ORD-2024-0002',
    type: 'order',
    customer: 'Rajesh Constructions',
    shop: 'Sri Lakshmi Traders',
    pickupAddress: '25 Chickpet, Bangalore',
    deliveryAddress: '100 Industrial Area, Bangalore',
    items: '50x Cement bags, 20x TMT Bars',
    distance: '5.2 km',
    earnings: 200,
    status: 'pickup',
    assignedAt: '10:30 AM',
  },
  {
    id: 'd2',
    orderNumber: 'ORD-2024-0005',
    type: 'order',
    customer: 'Amit Kumar',
    shop: 'Anand Hardware',
    pickupAddress: '10 KR Market, Bangalore',
    deliveryAddress: '78 Brigade Road, Bangalore',
    items: '2x Wooden Doors, 4x Door Hinges',
    distance: '3.8 km',
    earnings: 150,
    status: 'delivering',
    assignedAt: '09:45 AM',
  },
  {
    id: 'd3',
    orderNumber: 'ORD-2024-0010',
    type: 'order',
    customer: 'Priya Patel',
    shop: 'Balaji Construction',
    pickupAddress: '40 Yeshwanthpur, Bangalore',
    deliveryAddress: '45 Park Street, Bangalore',
    items: '5x Copper Wire coils',
    distance: '6.5 km',
    earnings: 180,
    status: 'available',
    assignedAt: null,
  },
  {
    id: 'd4',
    orderNumber: 'CON-2024-001',
    type: 'concierge',
    customer: 'Vikram Singh',
    shop: 'Sri Lakshmi Traders',
    originalShop: 'Anand Hardware',
    pickupAddress: '25 Chickpet, Bangalore',
    deliveryAddress: '90 Whitefield, Bangalore',
    items: '5x UltraTech Cement (from alternate shop)',
    distance: '12.3 km',
    earnings: 350,
    bonusEarnings: 100,
    status: 'available',
    assignedAt: null,
  },
  {
    id: 'd5',
    orderNumber: 'ORD-2024-0001',
    type: 'order',
    customer: 'Rahul Sharma',
    shop: 'Anand Hardware',
    pickupAddress: '10 KR Market, Bangalore',
    deliveryAddress: '123 MG Road, Koramangala',
    items: '10x Cement bags, 5kg Nails',
    distance: '4.1 km',
    earnings: 150,
    status: 'completed',
    completedAt: '11:30 AM',
  },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'pickup':
      return { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', label: 'Pickup' };
    case 'delivering':
      return { bg: 'rgba(16,185,129,0.15)', color: '#10B981', label: 'Delivering' };
    case 'available':
      return { bg: 'rgba(242,150,13,0.15)', color: '#F2960D', label: 'Available' };
    case 'completed':
      return { bg: 'rgba(156,163,175,0.15)', color: '#9CA3AF', label: 'Completed' };
    default:
      return { bg: 'rgba(156,163,175,0.15)', color: '#9CA3AF', label: status };
  }
};

export default function DeliveriesScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('Active');

  const filteredDeliveries = MOCK_DELIVERIES.filter((delivery) => {
    if (selectedTab === 'Active') return ['pickup', 'delivering'].includes(delivery.status);
    if (selectedTab === 'Available') return delivery.status === 'available';
    if (selectedTab === 'Completed') return delivery.status === 'completed';
    return true;
  });

  const activeCount = MOCK_DELIVERIES.filter((d) => ['pickup', 'delivering'].includes(d.status)).length;
  const availableCount = MOCK_DELIVERIES.filter((d) => d.status === 'available').length;

  const renderDelivery = ({ item: delivery }: { item: typeof MOCK_DELIVERIES[0] }) => {
    const statusStyle = getStatusStyle(delivery.status);
    const isConcierge = delivery.type === 'concierge';
    const isActive = ['pickup', 'delivering'].includes(delivery.status);
    const isAvailable = delivery.status === 'available';

    return (
      <View
        style={[
          s.card,
          isConcierge
            ? { borderLeftWidth: 4, borderLeftColor: '#A855F7' }
            : isActive
            ? { borderLeftWidth: 4, borderLeftColor: T.success }
            : null,
        ]}
      >
        {/* Header */}
        <View style={s.cardHeader}>
          <View style={{ flex: 1 }}>
            <View style={s.row}>
              {isConcierge && (
                <View style={s.conciergeBadge}>
                  <Ionicons name="flash" size={12} color="#A855F7" />
                  <Text style={s.conciergeBadgeText}>CONCIERGE</Text>
                </View>
              )}
              <Text style={s.orderNumber}>{delivery.orderNumber}</Text>
            </View>
            <Text style={s.customerName}>{delivery.customer}</Text>
          </View>
          <View style={[s.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[s.statusBadgeText, { color: statusStyle.color }]}>
              {statusStyle.label}
            </Text>
          </View>
        </View>

        {/* Pickup Location */}
        <View style={s.locationRow}>
          <View style={s.dotColumn}>
            <View style={s.pickupDot} />
            <View style={s.connectorLine} />
          </View>
          <View style={s.locationInfo}>
            <Text style={s.locationLabel}>PICKUP</Text>
            <Text style={s.locationPrimary}>{delivery.shop}</Text>
            <Text style={s.locationSecondary} numberOfLines={1}>
              {delivery.pickupAddress}
            </Text>
          </View>
        </View>

        {/* Delivery Location */}
        <View style={[s.locationRow, { marginBottom: 12 }]}>
          <View style={s.dotColumn}>
            <View style={s.deliveryDot} />
          </View>
          <View style={s.locationInfo}>
            <Text style={s.locationLabel}>DELIVER TO</Text>
            <Text style={s.locationPrimary}>{delivery.customer}</Text>
            <Text style={s.locationSecondary} numberOfLines={1}>
              {delivery.deliveryAddress}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View style={s.itemsRow}>
          <Ionicons name="cube" size={16} color={T.textMuted} />
          <Text style={s.itemsText} numberOfLines={1}>
            {delivery.items}
          </Text>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.row}>
            <Ionicons name="navigate" size={16} color={T.amber} />
            <Text style={s.distanceText}>{delivery.distance}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.earningsText}>₹{delivery.earnings}</Text>
            {isConcierge && (delivery as any).bonusEarnings && (
              <Text style={s.bonusText}>+₹{(delivery as any).bonusEarnings} bonus</Text>
            )}
          </View>
        </View>

        {/* Actions for Active */}
        {isActive && (
          <View style={s.actionsRow}>
            <TouchableOpacity style={[s.actionBtn, { backgroundColor: T.info }]}>
              <Ionicons name="navigate" size={18} color="#FFFFFF" />
              <Text style={s.actionBtnText}>Navigate</Text>
            </TouchableOpacity>
            <View style={{ width: 12 }} />
            <TouchableOpacity style={[s.actionBtn, { backgroundColor: T.success }]}>
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={s.actionBtnText}>
                {delivery.status === 'pickup' ? 'Picked Up' : 'Delivered'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Actions for Available */}
        {isAvailable && (
          <View style={s.actionsRowSingle}>
            <TouchableOpacity
              style={[
                s.actionBtnFull,
                { backgroundColor: isConcierge ? '#A855F7' : T.amber },
              ]}
            >
              <Ionicons name="hand-right" size={18} color="#FFFFFF" />
              <Text style={s.actionBtnText}>Accept Delivery</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Completed Info */}
        {delivery.status === 'completed' && (
          <View style={s.completedRow}>
            <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
            <Text style={s.completedText}>Completed at {(delivery as any).completedAt}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safeArea}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Deliveries</Text>
      </View>

      {/* Stats */}
      <View style={s.statsContainer}>
        <View style={s.statCardActive}>
          <View style={s.statCardInner}>
            <Text style={s.statNumberGreen}>{activeCount}</Text>
            <Ionicons name="car" size={24} color="#22C55E" />
          </View>
          <Text style={s.statLabel}>Active Now</Text>
        </View>
        <View style={{ width: 12 }} />
        <View style={s.statCardAvailable}>
          <View style={s.statCardInner}>
            <Text style={s.statNumberAmber}>{availableCount}</Text>
            <Ionicons name="list" size={24} color={T.amber} />
          </View>
          <Text style={s.statLabel}>Available</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabsContainer}>
        {DELIVERY_TABS.map((tab) => (
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

      {/* Deliveries List */}
      <FlatList
        data={filteredDeliveries}
        renderItem={renderDelivery}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyContainer}>
            <Ionicons name="car" size={48} color={T.textMuted} />
            <Text style={s.emptyText}>
              {selectedTab === 'Active'
                ? 'No active deliveries'
                : selectedTab === 'Available'
                ? 'No available deliveries'
                : 'No completed deliveries'}
            </Text>
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

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    backgroundColor: T.surface,
  } as const,

  headerTitle: {
    color: T.text,
    fontSize: 24,
    fontWeight: '700' as const,
  },

  statsContainer: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  statCardActive: {
    flex: 1,
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
  } as const,

  statCardAvailable: {
    flex: 1,
    backgroundColor: 'rgba(242,150,13,0.08)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(242,150,13,0.3)',
  } as const,

  statCardInner: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },

  statNumberGreen: {
    color: T.success,
    fontWeight: '700' as const,
    fontSize: 24,
  },

  statNumberAmber: {
    color: T.amber,
    fontWeight: '700' as const,
    fontSize: 24,
  },

  statLabel: {
    color: T.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },

  tabsContainer: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  } as const,

  tabActive: {
    backgroundColor: T.navy,
  },

  tabInactive: {
    backgroundColor: T.bg,
  },

  tabText: {
    textAlign: 'center' as const,
    fontWeight: '500' as const,
  },

  tabTextActive: {
    color: T.white,
  },

  tabTextInactive: {
    color: T.textSecondary,
  },

  card: {
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: T.border,
  } as const,

  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },

  conciergeBadge: {
    backgroundColor: 'rgba(168,85,247,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },

  conciergeBadgeText: {
    color: '#A855F7',
    fontSize: 12,
    fontWeight: '700' as const,
    marginLeft: 4,
  },

  orderNumber: {
    color: T.textSecondary,
    fontSize: 14,
  },

  customerName: {
    color: T.text,
    fontWeight: '600' as const,
    marginTop: 4,
    fontSize: 16,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  } as const,

  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },

  locationRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 8,
  },

  dotColumn: {
    width: 24,
    alignItems: 'center' as const,
  },

  pickupDot: {
    width: 12,
    height: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
  },

  connectorLine: {
    width: 2,
    height: 32,
    backgroundColor: T.border,
    marginVertical: 4,
  },

  deliveryDot: {
    width: 12,
    height: 12,
    backgroundColor: T.success,
    borderRadius: 6,
  },

  locationInfo: {
    flex: 1,
    marginLeft: 8,
  } as const,

  locationLabel: {
    color: T.textMuted,
    fontSize: 12,
  },

  locationPrimary: {
    color: T.text,
    fontSize: 15,
  },

  locationSecondary: {
    color: T.textSecondary,
    fontSize: 14,
  },

  itemsRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
    backgroundColor: T.bg,
    padding: 8,
    borderRadius: 10,
  },

  itemsText: {
    color: T.textSecondary,
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  } as const,

  statsRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },

  distanceText: {
    color: T.amber,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500' as const,
  },

  earningsText: {
    color: T.success,
    fontWeight: '700' as const,
    fontSize: 18,
  },

  bonusText: {
    color: '#A855F7',
    fontSize: 12,
  },

  actionsRow: {
    flexDirection: 'row' as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },

  actionsRowSingle: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  } as const,

  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  actionBtnFull: {
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
    marginLeft: 8,
    fontSize: 15,
  },

  completedRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },

  completedText: {
    color: T.textSecondary,
    marginLeft: 8,
    fontSize: 14,
  },

  emptyContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 48,
  },

  emptyText: {
    color: T.textSecondary,
    marginTop: 16,
    fontSize: 15,
  },
};
