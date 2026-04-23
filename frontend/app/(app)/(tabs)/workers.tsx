import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../../src/hooks/useAuth';
import { LightTheme } from '../../../src/theme/colors';

const T = LightTheme;

const FILTER_CHIPS = [
  { id: 'all', label: 'All', color: T.navy },
  { id: 'mason', label: 'Mason', color: '#8B5CF6' },
  { id: 'electrician', label: 'Electrician', color: '#F59E0B' },
  { id: 'plumber', label: 'Plumber', color: '#3B82F6' },
  { id: 'carpenter', label: 'Carpenter', color: '#10B981' },
  { id: 'painter', label: 'Painter', color: '#EC4899' },
  { id: 'welder', label: 'Welder', color: '#EF4444' },
];

const ROLE_COLORS: Record<string, string> = {
  Mason: '#8B5CF6',
  Electrician: '#F59E0B',
  Plumber: '#3B82F6',
  Carpenter: '#10B981',
  Painter: '#EC4899',
  Welder: '#EF4444',
  Helper: '#6B7280',
};

const WORKERS = [
  {
    id: 'w1',
    name: 'Ramu Yadav',
    primaryRole: 'Mason',
    skills: ['Mason', 'Plastering', 'Tiling'],
    dailyRate: 800,
    rating: 4.8,
    totalJobs: 142,
    experience: 7,
    status: 'available' as const,
    isVerified: true,
    location: 'Kukatpally, Hyderabad',
  },
  {
    id: 'w2',
    name: 'Venkat Rao',
    primaryRole: 'Electrician',
    skills: ['Electrician', 'Wiring', 'Panel Work'],
    dailyRate: 1200,
    rating: 4.9,
    totalJobs: 218,
    experience: 10,
    status: 'working' as const,
    isVerified: true,
    location: 'Ameerpet, Hyderabad',
  },
  {
    id: 'w3',
    name: 'Suresh Kumar',
    primaryRole: 'Plumber',
    skills: ['Plumber', 'Pipe Fitting', 'Waterproofing'],
    dailyRate: 900,
    rating: 4.6,
    totalJobs: 95,
    experience: 5,
    status: 'available' as const,
    isVerified: true,
    location: 'Secunderabad, Hyderabad',
  },
  {
    id: 'w4',
    name: 'Mohammed Khader',
    primaryRole: 'Carpenter',
    skills: ['Carpenter', 'Furniture', 'Woodwork'],
    dailyRate: 1100,
    rating: 4.7,
    totalJobs: 176,
    experience: 9,
    status: 'available' as const,
    isVerified: true,
    location: 'Tolichowki, Hyderabad',
  },
  {
    id: 'w5',
    name: 'Balaiah Naidu',
    primaryRole: 'Painter',
    skills: ['Painter', 'Texture Work', 'Waterproofing'],
    dailyRate: 750,
    rating: 4.4,
    totalJobs: 63,
    experience: 4,
    status: 'working' as const,
    isVerified: false,
    location: 'LB Nagar, Hyderabad',
  },
  {
    id: 'w6',
    name: 'Srinivas Reddy',
    primaryRole: 'Welder',
    skills: ['Welder', 'Fabrication', 'Steel Work'],
    dailyRate: 1300,
    rating: 4.9,
    totalJobs: 201,
    experience: 12,
    status: 'available' as const,
    isVerified: true,
    location: 'Uppal, Hyderabad',
  },
  {
    id: 'w7',
    name: 'Ganesh Babu',
    primaryRole: 'Mason',
    skills: ['Mason', 'RCC Work', 'Brickwork'],
    dailyRate: 850,
    rating: 4.5,
    totalJobs: 88,
    experience: 6,
    status: 'available' as const,
    isVerified: true,
    location: 'Dilsukhnagar, Hyderabad',
  },
  {
    id: 'w8',
    name: 'Ramesh Goud',
    primaryRole: 'Plumber',
    skills: ['Plumber', 'Sanitary', 'Drainage'],
    dailyRate: 950,
    rating: 4.2,
    totalJobs: 54,
    experience: 3,
    status: 'available' as const,
    isVerified: false,
    location: 'Miyapur, Hyderabad',
  },
];

type Worker = typeof WORKERS[0];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function StarRow({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons
          key={i}
          name={i <= full ? 'star' : half && i === full + 1 ? 'star-half' : 'star-outline'}
          size={12}
          color="#F59E0B"
        />
      ))}
      <Text style={styles.ratingNum}>{rating.toFixed(1)}</Text>
    </View>
  );
}

function WorkerCard({ worker, index }: { worker: Worker; index: number }) {
  const router = useRouter();
  const roleColor = ROLE_COLORS[worker.primaryRole] || T.navy;
  const isAvailable = worker.status === 'available';

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => router.push(`/(app)/worker/${worker.id}`)}
      >
        {/* Top row: avatar + info */}
        <View style={styles.cardTop}>
          {/* Avatar */}
          <View style={[styles.avatar, { backgroundColor: roleColor + '20' }]}>
            <Text style={[styles.avatarText, { color: roleColor }]}>{getInitials(worker.name)}</Text>
            {worker.isVerified && (
              <View style={styles.verifiedDot}>
                <Ionicons name="checkmark" size={10} color="#fff" />
              </View>
            )}
          </View>

          {/* Info */}
          <View style={styles.cardInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.workerName} numberOfLines={1}>{worker.name}</Text>
              <View style={[styles.statusBadge, isAvailable ? styles.statusGreen : styles.statusAmber]}>
                <View style={[styles.statusDot, { backgroundColor: isAvailable ? T.success : T.warning }]} />
                <Text style={[styles.statusText, { color: isAvailable ? T.success : T.warning }]}>
                  {isAvailable ? 'Available' : 'Working'}
                </Text>
              </View>
            </View>

            <StarRow rating={worker.rating} />

            <View style={styles.metaRow}>
              <Ionicons name="briefcase-outline" size={12} color={T.textMuted} />
              <Text style={styles.metaText}>{worker.totalJobs} jobs</Text>
              <Text style={styles.dot}>·</Text>
              <Ionicons name="time-outline" size={12} color={T.textMuted} />
              <Text style={styles.metaText}>{worker.experience}y exp</Text>
            </View>

            {/* Skills chips */}
            <View style={styles.skillsRow}>
              {worker.skills.slice(0, 3).map(skill => (
                <View key={skill} style={[styles.skillChip, { backgroundColor: (ROLE_COLORS[skill] || T.navy) + '15' }]}>
                  <Text style={[styles.skillText, { color: ROLE_COLORS[skill] || T.navy }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Bottom row: rate + hire */}
        <View style={styles.cardBottom}>
          <View>
            <Text style={styles.rateLabel}>Daily Rate</Text>
            <Text style={styles.rateValue}>₹{worker.dailyRate}<Text style={styles.rateUnit}>/day</Text></Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.hireBtn,
              !isAvailable && styles.hireBtnDisabled,
              pressed && isAvailable && styles.hireBtnPressed,
            ]}
            onPress={() => isAvailable && router.push(`/(app)/hire?workerId=${worker.id}`)}
            disabled={!isAvailable}
          >
            <Ionicons name={isAvailable ? 'person-add' : 'time'} size={16} color={isAvailable ? '#fff' : T.textMuted} />
            <Text style={[styles.hireBtnText, !isAvailable && styles.hireBtnTextDisabled]}>
              {isAvailable ? 'Hire' : 'Busy'}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function WorkersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = WORKERS.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = activeFilter === 'all' ||
      w.primaryRole.toLowerCase() === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Find Workers</Text>
          <Pressable style={styles.filterIconBtn}>
            <Ionicons name="options-outline" size={22} color={T.navy} />
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={T.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or skill..."
            placeholderTextColor={T.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={T.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTER_CHIPS.map(chip => {
            const active = activeFilter === chip.id;
            return (
              <Pressable
                key={chip.id}
                style={[styles.chip, active ? { backgroundColor: chip.color } : styles.chipInactive]}
                onPress={() => setActiveFilter(chip.id)}
              >
                <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{filtered.length} workers found</Text>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <WorkerCard worker={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={56} color={T.textMuted} />
            <Text style={styles.emptyTitle}>No workers found</Text>
            <Text style={styles.emptySubtitle}>Try a different search or filter</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },

  header: {
    backgroundColor: T.surface,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: { fontSize: 26, fontWeight: '700', color: T.navy },
  filterIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: T.border,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.bg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: T.border,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, color: T.navy, paddingVertical: 0 },

  filterBar: {
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    paddingVertical: 10,
  },
  filterScroll: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  chipInactive: { backgroundColor: T.bg, borderWidth: 1, borderColor: T.border },
  chipText: { fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  chipTextInactive: { color: T.textSecondary },

  countRow: { paddingHorizontal: 20, paddingVertical: 10 },
  countText: { fontSize: 13, color: T.textSecondary },

  listContent: { paddingHorizontal: 16, paddingBottom: 24 },

  card: {
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 12,
  },
  cardPressed: { opacity: 0.93 },

  cardTop: { flexDirection: 'row', marginBottom: 14 },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '700' },
  verifiedDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: T.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: T.surface,
  },

  cardInfo: { flex: 1, marginLeft: 14 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  workerName: { fontSize: 16, fontWeight: '700', color: T.navy, flex: 1 },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
    marginLeft: 8,
  },
  statusGreen: { backgroundColor: '#ECFDF5' },
  statusAmber: { backgroundColor: '#FFFBEB' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '600' },

  starRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 5 },
  ratingNum: { fontSize: 12, color: T.textSecondary, marginLeft: 4, fontWeight: '600' },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  metaText: { fontSize: 12, color: T.textMuted },
  dot: { color: T.textMuted, fontSize: 12 },

  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  skillText: { fontSize: 11, fontWeight: '600' },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  rateLabel: { fontSize: 11, color: T.textMuted, marginBottom: 2 },
  rateValue: { fontSize: 20, fontWeight: '800', color: T.amber },
  rateUnit: { fontSize: 13, fontWeight: '500', color: T.textSecondary },

  hireBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.navy,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  hireBtnDisabled: { backgroundColor: T.bg, borderWidth: 1, borderColor: T.border },
  hireBtnPressed: { opacity: 0.8 },
  hireBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  hireBtnTextDisabled: { color: T.textMuted },

  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: T.navy, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: T.textSecondary, marginTop: 6 },
});
