import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type TenderStatus = 'open' | 'submitted' | 'won' | 'lost';

type Tender = {
  id: string;
  title: string;
  postedBy: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  daysLeft: number;
  location: string;
  materials: string[];
  status: TenderStatus;
};

const TABS: { key: TenderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Open' },
  { key: 'submitted', label: 'My Bids' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
];

const TENDERS: Tender[] = [
  {
    id: '1',
    title: 'Residential Complex — Phase 2 Foundation',
    postedBy: 'Prestige Developers',
    budgetMin: 8,
    budgetMax: 12,
    deadline: '05 Mar 2026',
    daysLeft: 7,
    location: 'Whitefield, Bengaluru',
    materials: ['Cement', 'TMT Steel', 'River Sand', 'Aggregates'],
    status: 'open',
  },
  {
    id: '2',
    title: 'Office Interior — Electrical & Plumbing',
    postedBy: 'Brigade Group',
    budgetMin: 3,
    budgetMax: 5,
    deadline: '10 Mar 2026',
    daysLeft: 12,
    location: 'Koramangala, Bengaluru',
    materials: ['Wiring', 'PVC Pipes', 'Switches', 'Fixtures'],
    status: 'open',
  },
  {
    id: '3',
    title: 'Warehouse Roofing — 20,000 sqft',
    postedBy: 'Godrej Properties',
    budgetMin: 15,
    budgetMax: 20,
    deadline: '28 Feb 2026',
    daysLeft: 2,
    location: 'Electronic City, Bengaluru',
    materials: ['Steel Sheets', 'Purlins', 'Bolts', 'Sealant'],
    status: 'open',
  },
  {
    id: '4',
    title: 'Villa Compound Wall & Landscaping',
    postedBy: 'Sobha Developers',
    budgetMin: 4,
    budgetMax: 6,
    deadline: '15 Mar 2026',
    daysLeft: 17,
    location: 'Hebbal, Bengaluru',
    materials: ['Bricks', 'Cement', 'Sand', 'Plants'],
    status: 'open',
  },
  {
    id: '5',
    title: 'School Building — Ground Floor Masonry',
    postedBy: 'Delhi Public School Trust',
    budgetMin: 10,
    budgetMax: 14,
    deadline: '20 Feb 2026',
    daysLeft: 0,
    location: 'Sarjapur Road, Bengaluru',
    materials: ['AAC Blocks', 'Cement', 'Steel', 'Sand'],
    status: 'submitted',
  },
  {
    id: '6',
    title: 'Community Hall — Complete Construction',
    postedBy: 'BBMP Ward Office',
    budgetMin: 25,
    budgetMax: 30,
    deadline: '01 Feb 2026',
    daysLeft: 0,
    location: 'Jayanagar, Bengaluru',
    materials: ['Cement', 'Steel', 'Bricks', 'Timber', 'Paint'],
    status: 'won',
  },
  {
    id: '7',
    title: 'Apartment Painting — 3 Towers',
    postedBy: 'Puravankara Ltd',
    budgetMin: 6,
    budgetMax: 8,
    deadline: '10 Jan 2026',
    daysLeft: 0,
    location: 'Marathahalli, Bengaluru',
    materials: ['Exterior Paint', 'Primer', 'Putty'],
    status: 'lost',
  },
];

const STATUS_ACCENT: Record<TenderStatus, string> = {
  open: T.amber,
  submitted: T.info,
  won: T.success,
  lost: T.textMuted,
};

export default function TendersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TenderStatus | 'all'>('all');

  const filteredTenders = TENDERS.filter((t) => {
    if (activeTab === 'all') return t.status === 'open';
    return t.status === activeTab;
  });

  const renderTenderCard = (tender: Tender) => {
    const accent = STATUS_ACCENT[tender.status];
    const isUrgent = tender.status === 'open' && tender.daysLeft <= 3;
    const isLost = tender.status === 'lost';

    return (
      <View
        key={tender.id}
        style={[s.tenderCard, { borderLeftColor: accent, borderLeftWidth: 4 }, isLost && { opacity: 0.65 }]}
      >
        {/* Title & Posted By */}
        <Text style={s.tenderTitle}>{tender.title}</Text>
        <View style={s.postedByRow}>
          <Ionicons name="business-outline" size={13} color={T.textMuted} />
          <Text style={s.postedByText}>{tender.postedBy}</Text>
        </View>

        {/* Budget & Deadline */}
        <View style={s.metaRow}>
          <View style={s.metaItem}>
            <Ionicons name="wallet-outline" size={14} color={T.amber} />
            <Text style={s.budgetText}>Rs.{tender.budgetMin}L — Rs.{tender.budgetMax}L</Text>
          </View>
          <View style={s.metaItem}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={isUrgent ? '#EF4444' : T.textMuted}
            />
            <Text style={[s.deadlineText, isUrgent && { color: '#EF4444', fontWeight: '700' as const }]}>
              {tender.deadline}
              {isUrgent ? ` (${tender.daysLeft}d left!)` : ''}
            </Text>
          </View>
        </View>

        {/* Location */}
        <View style={s.locationRow}>
          <Ionicons name="location-outline" size={14} color={T.textMuted} />
          <Text style={s.locationText}>{tender.location}</Text>
        </View>

        {/* Materials */}
        <View style={s.materialsRow}>
          {tender.materials.map((mat) => (
            <View key={mat} style={s.materialChip}>
              <Text style={s.materialText}>{mat}</Text>
            </View>
          ))}
        </View>

        {/* Action Button */}
        {tender.status === 'open' && (
          <TouchableOpacity style={s.placeBidBtn}>
            <Ionicons name="send" size={14} color={T.white} />
            <Text style={s.placeBidText}>Place Bid</Text>
          </TouchableOpacity>
        )}
        {tender.status === 'submitted' && (
          <TouchableOpacity style={s.viewBidBtn}>
            <Ionicons name="eye-outline" size={14} color={T.info} />
            <Text style={s.viewBidText}>View Bid</Text>
          </TouchableOpacity>
        )}
        {tender.status === 'won' && (
          <View style={s.wonBadge}>
            <Ionicons name="checkmark-circle" size={16} color={T.success} />
            <Text style={s.wonBadgeText}>Contract Awarded</Text>
          </View>
        )}
        {tender.status === 'lost' && (
          <View style={s.lostBadge}>
            <Ionicons name="close-circle" size={16} color={T.textMuted} />
            <Text style={s.lostBadgeText}>Not Selected</Text>
          </View>
        )}
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
        <Text style={s.headerTitle}>Tenders & Bids</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={s.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[s.tab, activeTab === tab.key && s.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[s.tabText, activeTab === tab.key && s.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={s.tenderList}>
          {filteredTenders.length > 0 ? (
            filteredTenders.map(renderTenderCard)
          ) : (
            <View style={s.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={T.textMuted} />
              <Text style={s.emptyText}>No tenders in this category</Text>
            </View>
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

  /* Tabs */
  tabRow: {
    flexDirection: 'row' as const,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
  },
  tabActive: {
    backgroundColor: T.navy,
    borderColor: T.navy,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.textMuted,
  },
  tabTextActive: {
    color: T.white,
  },

  /* Tender List */
  tenderList: {
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 14,
  },

  /* Tender Card */
  tenderCard: {
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
  tenderTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 6,
  },
  postedByRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 5,
    marginBottom: 12,
  },
  postedByText: {
    fontSize: 12,
    color: T.textMuted,
    fontWeight: '500' as const,
  },

  /* Meta */
  metaRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 5,
  },
  budgetText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.amber,
  },
  deadlineText: {
    fontSize: 12,
    color: T.textMuted,
    fontWeight: '500' as const,
  },

  /* Location */
  locationRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 5,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: T.textSecondary,
  },

  /* Materials */
  materialsRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 6,
    marginBottom: 14,
  },
  materialChip: {
    backgroundColor: T.bg,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: T.border,
  },
  materialText: {
    fontSize: 11,
    color: T.textSecondary,
    fontWeight: '500' as const,
  },

  /* Action Buttons */
  placeBidBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: T.amber,
  },
  placeBidText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.white,
  },
  viewBidBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.info,
  },
  viewBidText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.info,
  },
  wonBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: T.success + '14',
  },
  wonBadgeText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.success,
  },
  lostBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: T.bg,
  },
  lostBadgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.textMuted,
  },

  /* Empty */
  emptyState: {
    alignItems: 'center' as const,
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: T.textMuted,
    fontWeight: '500' as const,
  },
};
