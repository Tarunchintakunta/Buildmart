import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LightTheme as T } from '../../../src/theme/colors';

type UserRole = 'customer' | 'shopkeeper' | 'worker' | 'driver' | 'contractor';

type AppUser = {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  initials: string;
  registeredAt: string;
  lastActive: string;
  active: boolean;
};

const MOCK_USERS: AppUser[] = [
  { id: 'u1', name: 'Rajesh Kumar', phone: '9876541001', role: 'customer', initials: 'RK', registeredAt: '10 Jan 2026', lastActive: '2h ago', active: true },
  { id: 'u2', name: 'Priya Sharma', phone: '9876541002', role: 'customer', initials: 'PS', registeredAt: '12 Jan 2026', lastActive: '5h ago', active: true },
  { id: 'u3', name: 'Anita Devi', phone: '9876541003', role: 'customer', initials: 'AD', registeredAt: '15 Jan 2026', lastActive: '1d ago', active: true },
  { id: 'u4', name: 'Vijay Nair', phone: '9876541004', role: 'customer', initials: 'VN', registeredAt: '20 Jan 2026', lastActive: '3d ago', active: false },
  { id: 'u5', name: 'Anand Hardware', phone: '9876542001', role: 'shopkeeper', initials: 'AH', registeredAt: '02 Jan 2026', lastActive: '30m ago', active: true },
  { id: 'u6', name: 'Sri Lakshmi Traders', phone: '9876542002', role: 'shopkeeper', initials: 'SL', registeredAt: '03 Jan 2026', lastActive: '1h ago', active: true },
  { id: 'u7', name: 'Krishna Cement House', phone: '9876542003', role: 'shopkeeper', initials: 'KC', registeredAt: '05 Jan 2026', lastActive: '4h ago', active: true },
  { id: 'u8', name: 'Sharma Steels', phone: '9876542004', role: 'shopkeeper', initials: 'SS', registeredAt: '08 Jan 2026', lastActive: '2d ago', active: false },
  { id: 'u9', name: 'Ramu Yadav', phone: '9876543001', role: 'worker', initials: 'RY', registeredAt: '15 Jan 2026', lastActive: '6h ago', active: true },
  { id: 'u10', name: 'Suresh Kumar', phone: '9876543002', role: 'worker', initials: 'SK', registeredAt: '18 Jan 2026', lastActive: '1h ago', active: true },
  { id: 'u11', name: 'Ganesh Babu', phone: '9876543003', role: 'worker', initials: 'GB', registeredAt: '01 Feb 2026', lastActive: 'Yesterday', active: true },
  { id: 'u12', name: 'Arun Das', phone: '9876543004', role: 'worker', initials: 'AR', registeredAt: '10 Feb 2026', lastActive: '5d ago', active: false },
  { id: 'u13', name: 'Krishna Driver', phone: '9876544001', role: 'driver', initials: 'KD', registeredAt: '20 Jan 2026', lastActive: '45m ago', active: true },
  { id: 'u14', name: 'Naveen Transport', phone: '9876544002', role: 'driver', initials: 'NT', registeredAt: '22 Jan 2026', lastActive: '3h ago', active: true },
  { id: 'u15', name: 'Ravi Logistics', phone: '9876544003', role: 'driver', initials: 'RL', registeredAt: '25 Jan 2026', lastActive: '2d ago', active: false },
  { id: 'u16', name: 'Rajesh Constructions', phone: '9876545001', role: 'contractor', initials: 'RC', registeredAt: '05 Jan 2026', lastActive: '1h ago', active: true },
  { id: 'u17', name: 'BuildRight Pvt Ltd', phone: '9876545002', role: 'contractor', initials: 'BR', registeredAt: '08 Jan 2026', lastActive: '3h ago', active: true },
  { id: 'u18', name: 'Patel Constructions', phone: '9876545003', role: 'contractor', initials: 'PC', registeredAt: '12 Jan 2026', lastActive: 'Yesterday', active: true },
  { id: 'u19', name: 'Singh Infra', phone: '9876545004', role: 'contractor', initials: 'SI', registeredAt: '18 Jan 2026', lastActive: '4d ago', active: false },
  { id: 'u20', name: 'Mahesh Builders', phone: '9876545005', role: 'contractor', initials: 'MB', registeredAt: '25 Jan 2026', lastActive: '1d ago', active: true },
];

const ROLE_STYLES: Record<UserRole, { bg: string; color: string; icon: string; label: string }> = {
  customer: { bg: '#3B82F618', color: '#3B82F6', icon: 'person', label: 'Customer' },
  shopkeeper: { bg: '#10B98118', color: '#10B981', icon: 'storefront', label: 'Shopkeeper' },
  worker: { bg: '#F59E0B18', color: '#F59E0B', icon: 'hammer', label: 'Worker' },
  driver: { bg: '#EF444418', color: '#EF4444', icon: 'car', label: 'Driver' },
  contractor: { bg: '#8B5CF618', color: '#8B5CF6', icon: 'business', label: 'Contractor' },
};

type FilterTab = 'all' | UserRole;
const FILTER_TABS: FilterTab[] = ['all', 'customer', 'shopkeeper', 'worker', 'driver', 'contractor'];

export default function UsersScreen() {
  const [tab, setTab] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<AppUser[]>(MOCK_USERS);
  const [visibleCount, setVisibleCount] = useState(10);

  const filtered = users.filter((u) => {
    const matchTab = tab === 'all' || u.role === tab;
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    return matchTab && matchSearch;
  });

  const visible = filtered.slice(0, visibleCount);

  const toggleStatus = (user: AppUser) => {
    const action = user.active ? 'Suspend' : 'Activate';
    Alert.alert(
      `${action} User`,
      `${action} ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action,
          style: user.active ? 'destructive' : 'default',
          onPress: () =>
            setUsers((prev) =>
              prev.map((u) => (u.id === user.id ? { ...u, active: !u.active } : u))
            ),
        },
      ]
    );
  };

  const renderCard = ({ item, index }: { item: AppUser; index: number }) => {
    const rs = ROLE_STYLES[item.role];
    return (
      <Animated.View entering={FadeInDown.delay(index * 40).duration(350)} style={s.card}>
        <View style={s.cardRow}>
          {/* Avatar */}
          <View style={[s.avatar, { backgroundColor: rs.bg }]}>
            <Text style={[s.avatarText, { color: rs.color }]}>{item.initials}</Text>
          </View>
          {/* Info */}
          <View style={s.info}>
            <View style={s.nameRow}>
              <Text style={s.name}>{item.name}</Text>
              <View style={[s.statusDot, { backgroundColor: item.active ? T.success : T.error }]} />
            </View>
            <Text style={s.phone}>{item.phone}</Text>
            <View style={s.badgeRow}>
              <View style={[s.roleBadge, { backgroundColor: rs.bg }]}>
                <Text style={[s.roleText, { color: rs.color }]}>{rs.label}</Text>
              </View>
              <Text style={s.lastActive}>{item.lastActive}</Text>
            </View>
          </View>
          {/* Date */}
          <View style={s.dateCol}>
            <Text style={s.dateLabel}>Joined</Text>
            <Text style={s.dateValue}>{item.registeredAt}</Text>
          </View>
        </View>
        {/* Actions */}
        <View style={s.cardActions}>
          <Pressable style={s.actionView}>
            <Ionicons name="eye-outline" size={14} color={T.textSecondary} />
            <Text style={s.actionViewText}>View</Text>
          </Pressable>
          <Pressable
            style={[s.actionToggle, { backgroundColor: item.active ? '#EF444412' : '#10B98112' }]}
            onPress={() => toggleStatus(item)}
          >
            <Ionicons
              name={item.active ? 'ban-outline' : 'checkmark-circle-outline'}
              size={14}
              color={item.active ? T.error : T.success}
            />
            <Text style={[s.actionToggleText, { color: item.active ? T.error : T.success }]}>
              {item.active ? 'Suspend' : 'Activate'}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Users</Text>
        <View style={s.searchBar}>
          <Ionicons name="search" size={18} color={T.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search name or phone..."
            placeholderTextColor={T.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={T.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Stats Row */}
      <View style={s.statsRow}>
        {[
          { label: 'Total', value: users.length, color: T.text },
          { label: 'Active', value: users.filter((u) => u.active).length, color: T.success },
          { label: 'Suspended', value: users.filter((u) => !u.active).length, color: T.error },
        ].map((stat) => (
          <View key={stat.label} style={s.statCard}>
            <Text style={[s.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Filter Tabs */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={FILTER_TABS}
        keyExtractor={(item) => item}
        contentContainerStyle={s.filterList}
        renderItem={({ item: t }) => (
          <Pressable
            style={[s.filterPill, tab === t && s.filterPillActive]}
            onPress={() => { setTab(t); setVisibleCount(10); }}
          >
            <Text style={[s.filterText, tab === t && s.filterTextActive]}>
              {t === 'all' ? 'All' : ROLE_STYLES[t].label}
              {' '}({t === 'all' ? users.length : users.filter((u) => u.role === t).length})
            </Text>
          </Pressable>
        )}
      />

      {/* List */}
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="people-outline" size={48} color={T.textMuted} />
            <Text style={s.emptyText}>No users found</Text>
          </View>
        }
        ListFooterComponent={
          visibleCount < filtered.length ? (
            <Pressable style={s.loadMore} onPress={() => setVisibleCount((v) => v + 10)}>
              <Text style={s.loadMoreText}>Load more ({filtered.length - visibleCount} remaining)</Text>
            </Pressable>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    gap: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: T.text },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.bg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: T.border,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: T.text },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.border,
  },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  filterList: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
  },
  filterPillActive: { backgroundColor: T.navy, borderColor: T.navy },
  filterText: { fontSize: 13, fontWeight: '600', color: T.textSecondary },
  filterTextActive: { color: T.white },
  list: { padding: 16, gap: 10, paddingBottom: 40 },
  card: {
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800' },
  info: { flex: 1, marginLeft: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 15, fontWeight: '700', color: T.text },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  phone: { fontSize: 13, color: T.textSecondary, marginTop: 1 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  roleText: { fontSize: 11, fontWeight: '700' },
  lastActive: { fontSize: 11, color: T.textMuted },
  dateCol: { alignItems: 'flex-end' },
  dateLabel: { fontSize: 10, color: T.textMuted },
  dateValue: { fontSize: 12, fontWeight: '600', color: T.textSecondary },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  actionView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: T.bg,
    borderRadius: 10,
  },
  actionViewText: { fontSize: 13, color: T.textSecondary, fontWeight: '500' },
  actionToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionToggleText: { fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16, color: T.textSecondary },
  loadMore: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
    backgroundColor: T.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
  },
  loadMoreText: { fontSize: 14, fontWeight: '600', color: T.navy },
});
