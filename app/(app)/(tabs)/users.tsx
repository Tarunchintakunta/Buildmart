import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { UserRole } from '../../../src/types/database';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

const USER_TABS: (UserRole | 'all')[] = ['all', 'customer', 'contractor', 'worker', 'shopkeeper', 'driver'];

const MOCK_USERS = [
  { id: 'u1', name: 'Rahul Sharma', phone: '9876543101', role: 'customer', isActive: true, joinedAt: '2024-01-10' },
  { id: 'u2', name: 'Priya Patel', phone: '9876543102', role: 'customer', isActive: true, joinedAt: '2024-01-12' },
  { id: 'u3', name: 'Rajesh Constructions', phone: '9876543201', role: 'contractor', isActive: true, joinedAt: '2024-01-05' },
  { id: 'u4', name: 'BuildRight Pvt Ltd', phone: '9876543202', role: 'contractor', isActive: true, joinedAt: '2024-01-08' },
  { id: 'u5', name: 'Ramu Yadav', phone: '9876543301', role: 'worker', isActive: true, isVerified: true, joinedAt: '2024-01-15' },
  { id: 'u6', name: 'Suresh Kumar', phone: '9876543302', role: 'worker', isActive: true, isVerified: true, joinedAt: '2024-01-18' },
  { id: 'u7', name: 'Ganesh Babu', phone: '9876543304', role: 'worker', isActive: true, isVerified: false, joinedAt: '2024-02-01' },
  { id: 'u8', name: 'Anand Hardware', phone: '9876543401', role: 'shopkeeper', isActive: true, joinedAt: '2024-01-02' },
  { id: 'u9', name: 'Sri Lakshmi Traders', phone: '9876543402', role: 'shopkeeper', isActive: true, joinedAt: '2024-01-03' },
  { id: 'u10', name: 'Krishna Driver', phone: '9876543501', role: 'driver', isActive: true, joinedAt: '2024-01-20' },
  { id: 'u11', name: 'Naveen Transport', phone: '9876543503', role: 'driver', isActive: false, joinedAt: '2024-01-22' },
];

const getRoleStyle = (role: string) => {
  switch (role) {
    case 'customer':
      return { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', icon: 'person' };
    case 'contractor':
      return { bg: 'rgba(139,92,246,0.15)', color: '#8B5CF6', icon: 'business' };
    case 'worker':
      return { bg: 'rgba(16,185,129,0.15)', color: '#10B981', icon: 'hammer' };
    case 'shopkeeper':
      return { bg: 'rgba(242,150,13,0.15)', color: '#F2960D', icon: 'storefront' };
    case 'driver':
      return { bg: 'rgba(6,182,212,0.15)', color: '#06B6D4', icon: 'car' };
    default:
      return { bg: 'rgba(107,114,128,0.15)', color: '#6B7280', icon: 'person' };
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'customer': return 'Customer';
    case 'contractor': return 'Contractor';
    case 'worker': return 'Worker';
    case 'shopkeeper': return 'Shopkeeper';
    case 'driver': return 'Driver';
    case 'admin': return 'Admin';
    default: return role;
  }
};

export default function UsersScreen() {
  const [selectedTab, setSelectedTab] = useState<UserRole | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesRole = selectedTab === 'all' || user.role === selectedTab;
    return matchesSearch && matchesRole;
  });

  const getUserCounts = (): Record<UserRole | 'all', number> => {
    return {
      all: MOCK_USERS.length,
      customer: MOCK_USERS.filter((u) => u.role === 'customer').length,
      contractor: MOCK_USERS.filter((u) => u.role === 'contractor').length,
      worker: MOCK_USERS.filter((u) => u.role === 'worker').length,
      shopkeeper: MOCK_USERS.filter((u) => u.role === 'shopkeeper').length,
      driver: MOCK_USERS.filter((u) => u.role === 'driver').length,
      admin: MOCK_USERS.filter((u) => u.role === 'admin').length,
    };
  };

  const counts = getUserCounts();

  const renderUser = ({ item: user }: { item: typeof MOCK_USERS[0] }) => {
    const roleStyle = getRoleStyle(user.role);
    const isWorker = user.role === 'worker';

    return (
      <View style={s.userCard}>
        <View style={s.userRow}>
          <View style={s.avatar}>
            <Ionicons name={roleStyle.icon as any} size={28} color={T.textMuted} />
          </View>

          <View style={s.userInfo}>
            <View style={s.nameRow}>
              <Text style={s.userName}>{user.name}</Text>
              {!user.isActive && (
                <View style={s.inactiveBadge}>
                  <Text style={s.inactiveText}>Inactive</Text>
                </View>
              )}
            </View>
            <Text style={s.userPhone}>{user.phone}</Text>
            <View style={s.badgeRow}>
              <View style={{ backgroundColor: roleStyle.bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: '500', color: roleStyle.color }}>
                  {getRoleLabel(user.role)}
                </Text>
              </View>
              {isWorker && (
                <View style={{
                  marginLeft: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                  backgroundColor: (user as any).isVerified ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: (user as any).isVerified ? '#10B981' : '#F59E0B',
                  }}>
                    {(user as any).isVerified ? 'Verified' : 'Unverified'}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={s.joinedCol}>
            <Text style={s.joinedLabel}>Joined</Text>
            <Text style={s.joinedDate}>{user.joinedAt}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={s.actionsRow}>
          <TouchableOpacity style={s.actionBtnView}>
            <Ionicons name="eye" size={16} color={T.textMuted} />
            <Text style={s.actionTextView}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.actionBtnEdit}>
            <Ionicons name="create" size={16} color={T.amber} />
            <Text style={s.actionTextEdit}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[
            s.actionBtnToggle,
            { backgroundColor: user.isActive ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)' },
          ]}>
            <Ionicons
              name={user.isActive ? 'ban' : 'checkmark-circle'}
              size={16}
              color={user.isActive ? '#EF4444' : '#22C55E'}
            />
            <Text style={{ marginLeft: 8, fontSize: 14, color: user.isActive ? '#EF4444' : '#22C55E' }}>
              {user.isActive ? 'Disable' : 'Enable'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>User Management</Text>

        {/* Search */}
        <View style={s.searchBar}>
          <Ionicons name="search" size={20} color={T.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search by name or phone..."
            placeholderTextColor={T.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={T.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Role Filters */}
      <View style={s.filtersWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={USER_TABS}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          keyExtractor={(item) => item}
          renderItem={({ item: tab }) => (
            <TouchableOpacity
              style={[
                s.filterPill,
                selectedTab === tab ? s.filterPillActive : s.filterPillInactive,
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={selectedTab === tab ? s.filterTextActive : s.filterTextInactive}>
                {tab === 'all' ? 'All' : getRoleLabel(tab)} ({counts[tab]})
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Stats Summary */}
      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={s.statValueDefault}>{MOCK_USERS.length}</Text>
          <Text style={s.statLabel}>Total Users</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statValueGreen}>
            {MOCK_USERS.filter((u) => u.isActive).length}
          </Text>
          <Text style={s.statLabel}>Active</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statValueRed}>
            {MOCK_USERS.filter((u) => !u.isActive).length}
          </Text>
          <Text style={s.statLabel}>Inactive</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statValueYellow}>
            {MOCK_USERS.filter((u) => u.role === 'worker' && !(u as any).isVerified).length}
          </Text>
          <Text style={s.statLabel}>Unverified</Text>
        </View>
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Ionicons name="people" size={48} color={T.textMuted} />
            <Text style={s.emptyText}>No users found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = {
  container: {
    flex: 1,
    backgroundColor: T.bg,
  } as const,

  // Header
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  } as const,
  headerTitle: {
    color: T.text,
    fontSize: 24,
    fontWeight: '700' as const,
  },

  // Search
  searchBar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: T.border,
  },
  searchInput: {
    flex: 1,
    color: T.text,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 15,
  },

  // Role Filters
  filtersWrapper: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  } as const,
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    marginRight: 8,
  } as const,
  filterPillActive: {
    backgroundColor: T.navy,
  },
  filterPillInactive: {
    backgroundColor: T.bg,
  },
  filterTextActive: {
    fontWeight: '500' as const,
    color: T.white,
  },
  filterTextInactive: {
    fontWeight: '500' as const,
    color: T.textSecondary,
  },

  // Stats
  statsRow: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: T.border,
  },
  statValueDefault: {
    color: T.text,
    fontWeight: '700' as const,
    fontSize: 20,
  },
  statValueGreen: {
    color: '#10B981',
    fontWeight: '700' as const,
    fontSize: 20,
  },
  statValueRed: {
    color: '#EF4444',
    fontWeight: '700' as const,
    fontSize: 20,
  },
  statValueYellow: {
    color: '#F59E0B',
    fontWeight: '700' as const,
    fontSize: 20,
  },
  statLabel: {
    color: T.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  // User Card
  userCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: T.border,
  } as const,
  userRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  avatar: {
    width: 56,
    height: 56,
    backgroundColor: T.bg,
    borderRadius: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  } as const,
  nameRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  userName: {
    color: T.text,
    fontWeight: '600' as const,
    fontSize: 17,
  },
  inactiveBadge: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  } as const,
  inactiveText: {
    color: '#EF4444',
    fontSize: 12,
  },
  userPhone: {
    color: T.textSecondary,
    fontSize: 14,
  },
  badgeRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 4,
  },
  joinedCol: {
    alignItems: 'flex-end' as const,
  },
  joinedLabel: {
    color: T.textMuted,
    fontSize: 12,
  },
  joinedDate: {
    color: T.textSecondary,
    fontSize: 14,
  },

  // Actions
  actionsRow: {
    flexDirection: 'row' as const,
    gap: 8,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  actionBtnView: {
    flex: 1,
    backgroundColor: T.bg,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  actionTextView: {
    color: T.textSecondary,
    marginLeft: 8,
    fontSize: 14,
  },
  actionBtnEdit: {
    flex: 1,
    backgroundColor: T.bg,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  actionTextEdit: {
    color: T.amber,
    marginLeft: 8,
    fontSize: 14,
  },
  actionBtnToggle: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  // Empty State
  emptyState: {
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
