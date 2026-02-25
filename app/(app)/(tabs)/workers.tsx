import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

const SKILLS = [
  { id: 'all', name: 'All', icon: 'people' },
  { id: 'coolie', name: 'Coolie', icon: 'fitness' },
  { id: 'mason', name: 'Mason', icon: 'construct' },
  { id: 'electrician', name: 'Electrician', icon: 'flash' },
  { id: 'plumber', name: 'Plumber', icon: 'water' },
  { id: 'carpenter', name: 'Carpenter', icon: 'hammer' },
  { id: 'painter', name: 'Painter', icon: 'color-palette' },
  { id: 'welder', name: 'Welder', icon: 'flame' },
];

const WORKERS = [
  {
    id: 'w1',
    name: 'Ramu Yadav',
    skills: ['Coolie', 'Helper'],
    dailyRate: 600,
    hourlyRate: 100,
    rating: 4.5,
    totalJobs: 120,
    status: 'waiting',
    isVerified: true,
    experience: 5,
    distance: '2.3 km',
  },
  {
    id: 'w2',
    name: 'Suresh Kumar',
    skills: ['Mason', 'Painter'],
    dailyRate: 800,
    hourlyRate: 120,
    rating: 4.8,
    totalJobs: 200,
    status: 'working',
    isVerified: true,
    experience: 8,
    distance: '3.1 km',
  },
  {
    id: 'w3',
    name: 'Mohammed Ali',
    skills: ['Electrician'],
    dailyRate: 900,
    hourlyRate: 150,
    rating: 4.6,
    totalJobs: 150,
    status: 'waiting',
    isVerified: true,
    experience: 6,
    distance: '1.8 km',
  },
  {
    id: 'w4',
    name: 'Ganesh Babu',
    skills: ['Plumber', 'Welder'],
    dailyRate: 850,
    hourlyRate: 130,
    rating: 4.7,
    totalJobs: 180,
    status: 'waiting',
    isVerified: false,
    experience: 10,
    distance: '4.2 km',
  },
  {
    id: 'w5',
    name: 'Venkat Rao',
    skills: ['Carpenter'],
    dailyRate: 1000,
    hourlyRate: 160,
    rating: 4.9,
    totalJobs: 250,
    status: 'working',
    isVerified: true,
    experience: 12,
    distance: '2.8 km',
  },
];

export default function WorkersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const isContractor = user?.role === 'contractor';

  const filteredWorkers = WORKERS.filter((worker) => {
    const matchesSearch = worker.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSkill =
      selectedSkill === 'all' ||
      worker.skills.some((s) => s.toLowerCase() === selectedSkill);
    const matchesAvailability = !showAvailableOnly || worker.status === 'waiting';
    return matchesSearch && matchesSkill && matchesAvailability;
  });

  const renderWorker = ({ item: worker }: { item: typeof WORKERS[0] }) => (
    <TouchableOpacity
      style={s.card}
      onPress={() => router.push(`/(app)/worker/${worker.id}`)}
    >
      <View style={s.cardRow}>
        {/* Avatar */}
        <View style={s.avatar}>
          <Ionicons name="person" size={32} color={T.textMuted} />
          {worker.isVerified && (
            <View style={s.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color={T.white} />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={s.cardInfo}>
          <View style={s.nameRow}>
            <Text style={s.workerName}>{worker.name}</Text>
            <View
              style={[
                s.statusBadge,
                worker.status === 'waiting'
                  ? s.statusAvailable
                  : s.statusWorking,
              ]}
            >
              <Text
                style={
                  worker.status === 'waiting'
                    ? s.statusAvailableText
                    : s.statusWorkingText
                }
              >
                {worker.status === 'waiting' ? 'Available' : 'Working'}
              </Text>
            </View>
          </View>

          {/* Skills */}
          <View style={s.skillsRow}>
            {worker.skills.map((skill, index) => (
              <View key={index} style={s.skillChip}>
                <Text style={s.skillChipText}>{skill}</Text>
              </View>
            ))}
          </View>

          {/* Stats */}
          <View style={s.statsRow}>
            <Ionicons name="star" size={14} color={T.amber} />
            <Text style={s.ratingText}>{worker.rating}</Text>
            <Text style={s.statDot}>•</Text>
            <Text style={s.statText}>{worker.totalJobs} jobs</Text>
            <Text style={s.statDot}>•</Text>
            <Text style={s.statText}>{worker.experience}y exp</Text>
          </View>

          {/* Rate & Distance */}
          <View style={s.rateDistanceRow}>
            <View>
              <Text style={s.dailyRate}>₹{worker.dailyRate}/day</Text>
              <Text style={s.hourlyRate}>₹{worker.hourlyRate}/hr</Text>
            </View>
            <View style={s.distanceRow}>
              <Ionicons name="location" size={14} color={T.textMuted} />
              <Text style={s.distanceText}>{worker.distance}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={s.actionRow}>
        <TouchableOpacity
          style={s.viewProfileBtn}
          onPress={() => router.push(`/(app)/worker/${worker.id}`)}
        >
          <Ionicons name="person" size={18} color={T.textSecondary} />
          <Text style={s.viewProfileText}>View Profile</Text>
        </TouchableOpacity>

        {worker.status === 'waiting' && worker.isVerified && (
          <>
            <TouchableOpacity
              style={s.hireBtn}
              onPress={() => router.push(`/(app)/hire?workerId=${worker.id}`)}
            >
              <Ionicons name="calendar" size={18} color={T.white} />
              <Text style={s.hireBtnText}>
                {isContractor ? 'Hire Long-term' : 'Book Now'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {!worker.isVerified && (
          <View style={s.notVerifiedBadge}>
            <Ionicons name="warning" size={18} color="#EAB308" />
            <Text style={s.notVerifiedText}>Not Verified</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.safeArea}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>
          {isContractor ? 'Hire Workers' : 'Find Workers'}
        </Text>

        {/* Search Bar */}
        <View style={s.searchBar}>
          <Ionicons name="search" size={22} color={T.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search workers..."
            placeholderTextColor={T.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginLeft: 8 }}>
              <Ionicons name="close-circle" size={22} color={T.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Skills Filter */}
      <View style={s.skillsFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {SKILLS.map((skill) => {
            const isActive = selectedSkill === skill.id;
            return (
              <TouchableOpacity
                key={skill.id}
                style={[
                  s.filterPill,
                  isActive ? s.filterPillActive : s.filterPillInactive,
                ]}
                onPress={() => setSelectedSkill(skill.id)}
              >
                <Ionicons
                  name={skill.icon as any}
                  size={18}
                  color={isActive ? T.white : T.textSecondary}
                />
                <Text
                  style={[
                    s.filterPillText,
                    isActive ? s.filterPillTextActive : s.filterPillTextInactive,
                  ]}
                >
                  {skill.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Available Filter */}
      <View style={s.availableFilterRow}>
        <Text style={s.workerCountText}>{filteredWorkers.length} workers found</Text>
        <TouchableOpacity
          style={s.checkboxRow}
          onPress={() => setShowAvailableOnly(!showAvailableOnly)}
        >
          <View
            style={[
              s.checkbox,
              showAvailableOnly ? s.checkboxActive : s.checkboxInactive,
            ]}
          >
            {showAvailableOnly && (
              <Ionicons name="checkmark" size={14} color={T.white} />
            )}
          </View>
          <Text style={s.checkboxLabel}>Available only</Text>
        </TouchableOpacity>
      </View>

      {/* Contractor Banner */}
      {isContractor && (
        <TouchableOpacity
          style={s.contractorBanner}
          onPress={() => router.push('/(app)/agreement/create')}
        >
          <Ionicons name="document-text" size={24} color={T.amber} />
          <View style={s.contractorBannerContent}>
            <Text style={s.contractorBannerTitle}>Create Long-term Agreement</Text>
            <Text style={s.contractorBannerSubtitle}>
              Hire workers for weeks or months with digital contracts
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={T.amber} />
        </TouchableOpacity>
      )}

      {/* Workers List */}
      <FlatList
        data={filteredWorkers}
        renderItem={renderWorker}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyContainer}>
            <Ionicons name="people" size={48} color={T.textMuted} />
            <Text style={s.emptyText}>No workers found</Text>
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

  /* ---- Header ---- */
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  } as const,
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 16,
  },

  /* ---- Search ---- */
  searchBar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  searchInput: {
    flex: 1,
    color: T.text,
    paddingVertical: 14,
    marginLeft: 12,
    fontSize: 16,
  },

  /* ---- Skills Filter ---- */
  skillsFilterContainer: {
    paddingVertical: 14,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  } as const,
  filterPill: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 50,
    marginRight: 10,
  },
  filterPillActive: {
    backgroundColor: T.navy,
  },
  filterPillInactive: {
    backgroundColor: T.bg,
  },
  filterPillText: {
    marginLeft: 8,
    fontWeight: '600' as const,
    fontSize: 14,
  },
  filterPillTextActive: {
    color: T.white,
  },
  filterPillTextInactive: {
    color: T.textSecondary,
  },

  /* ---- Available Filter Row ---- */
  availableFilterRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  workerCountText: {
    color: T.textSecondary,
    fontSize: 14,
  },
  checkboxRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    marginRight: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  checkboxActive: {
    backgroundColor: T.amber,
    borderColor: T.amber,
  },
  checkboxInactive: {
    borderColor: T.border,
    backgroundColor: 'transparent',
  },
  checkboxLabel: {
    color: T.textSecondary,
    fontSize: 14,
  },

  /* ---- Contractor Banner ---- */
  contractorBanner: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(242, 150, 13, 0.1)',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: 'rgba(242, 150, 13, 0.3)',
  },
  contractorBannerContent: {
    marginLeft: 12,
    flex: 1,
  },
  contractorBannerTitle: {
    color: T.amber,
    fontWeight: '600' as const,
    fontSize: 15,
  },
  contractorBannerSubtitle: {
    color: T.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },

  /* ---- Worker Card ---- */
  card: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row' as const,
  },

  /* Avatar */
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: T.bg,
    borderRadius: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  verifiedBadge: {
    position: 'absolute' as const,
    bottom: -2,
    right: -2,
    backgroundColor: '#10B981',
    borderRadius: 10,
    padding: 3,
  },

  /* Card Info */
  cardInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nameRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  workerName: {
    color: T.text,
    fontWeight: '600' as const,
    fontSize: 17,
  },

  /* Status Badge */
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusAvailable: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusWorking: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
  },
  statusAvailableText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '500' as const,
  },
  statusWorkingText: {
    color: '#F97316',
    fontSize: 13,
    fontWeight: '500' as const,
  },

  /* Skills Chips */
  skillsRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: 8,
  },
  skillChip: {
    backgroundColor: T.bg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  skillChipText: {
    color: T.textSecondary,
    fontSize: 12,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  ratingText: {
    color: T.text,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  statDot: {
    color: T.textMuted,
    marginHorizontal: 8,
  },
  statText: {
    color: T.textSecondary,
    fontSize: 14,
  },

  /* Rate & Distance */
  rateDistanceRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginTop: 12,
  },
  dailyRate: {
    color: T.amber,
    fontWeight: '700' as const,
    fontSize: 15,
  },
  hourlyRate: {
    color: T.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  distanceRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  distanceText: {
    color: T.textSecondary,
    marginLeft: 4,
    fontSize: 14,
  },

  /* Action Buttons */
  actionRow: {
    flexDirection: 'row' as const,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: T.border,
    gap: 10,
  },
  viewProfileBtn: {
    flex: 1,
    backgroundColor: T.bg,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  viewProfileText: {
    color: T.textSecondary,
    fontWeight: '500' as const,
    marginLeft: 8,
    fontSize: 14,
  },
  hireBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  hireBtnText: {
    color: T.white,
    fontWeight: '500' as const,
    marginLeft: 8,
    fontSize: 14,
  },
  notVerifiedBadge: {
    flex: 1,
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  notVerifiedText: {
    color: '#EAB308',
    fontWeight: '500' as const,
    marginLeft: 8,
    fontSize: 14,
  },

  /* Empty State */
  emptyContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 48,
  },
  emptyText: {
    color: T.textSecondary,
    marginTop: 16,
    fontSize: 16,
  },
};
