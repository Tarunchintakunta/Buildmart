import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LightTheme as T } from '../../src/theme/colors';
import { SPRING_SNAPPY, SPRING_BOUNCY } from '../../src/utils/animations';

type TabKey = 'open' | 'mybids' | 'won';

const TABS: { key: TabKey; label: string; count: number }[] = [
  { key: 'open', label: 'Open', count: 3 },
  { key: 'mybids', label: 'My Bids', count: 2 },
  { key: 'won', label: 'Won', count: 1 },
];

type OpenTender = {
  id: string;
  title: string;
  budget: string;
  deadlineDays: number;
  bids: number;
  category: string;
  location: string;
  categoryColor: string;
  categoryIcon: keyof typeof Ionicons.glyphMap;
};

type MyBid = {
  id: string;
  title: string;
  bidAmount: string;
  submittedDate: string;
  status: 'Pending' | 'Under Review';
  budget: string;
};

type WonTender = {
  id: string;
  title: string;
  contractValue: string;
  awardedDate: string;
  location: string;
};

const OPEN_TENDERS: OpenTender[] = [
  {
    id: '1',
    title: '3BHK Residential Complex, Kondapur',
    budget: '₹45L',
    deadlineDays: 3,
    bids: 8,
    category: 'Construction',
    location: 'Kondapur, Hyderabad',
    categoryColor: '#8B5CF6',
    categoryIcon: 'business-outline',
  },
  {
    id: '2',
    title: 'Commercial Office Fit-out, HITEC City',
    budget: '₹18L',
    deadlineDays: 5,
    bids: 12,
    category: 'Interior',
    location: 'HITEC City, Hyderabad',
    categoryColor: '#3B82F6',
    categoryIcon: 'home-outline',
  },
  {
    id: '3',
    title: 'Road Resurfacing, Gachibowli',
    budget: '₹22L',
    deadlineDays: 7,
    bids: 5,
    category: 'Civil',
    location: 'Gachibowli, Hyderabad',
    categoryColor: '#10B981',
    categoryIcon: 'construct-outline',
  },
];

const MY_BIDS: MyBid[] = [
  {
    id: '1',
    title: 'School Renovation — Ameerpet',
    bidAmount: '₹8.5L',
    submittedDate: '20 Apr 2026',
    status: 'Under Review',
    budget: '₹10L',
  },
  {
    id: '2',
    title: 'Community Hall Construction — LB Nagar',
    bidAmount: '₹22L',
    submittedDate: '18 Apr 2026',
    status: 'Pending',
    budget: '₹25L',
  },
];

const WON_TENDERS: WonTender[] = [
  {
    id: '1',
    title: 'GHMC Park Infrastructure — Madhapur',
    contractValue: '₹32L',
    awardedDate: '10 Apr 2026',
    location: 'Madhapur, Hyderabad',
  },
];

function PressableCard({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={anim}>
      <Pressable
        style={style}
        onPressIn={() => { scale.value = withSpring(0.98, SPRING_SNAPPY); }}
        onPressOut={() => { scale.value = withSpring(1, SPRING_BOUNCY); }}
        onPress={onPress}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

function OpenTenderCard({ tender, index }: { tender: OpenTender; index: number }) {
  const isUrgent = tender.deadlineDays <= 3;
  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(18).stiffness(180)}>
      <PressableCard style={styles.tenderCard}>
        {/* Category + Deadline */}
        <View style={styles.tenderTopRow}>
          <View style={[styles.categoryChip, { backgroundColor: `${tender.categoryColor}18` }]}>
            <Ionicons name={tender.categoryIcon} size={12} color={tender.categoryColor} />
            <Text style={[styles.categoryText, { color: tender.categoryColor }]}>
              {tender.category}
            </Text>
          </View>
          <View style={[styles.deadlineChip, isUrgent && styles.deadlineUrgent]}>
            <Ionicons
              name="time-outline"
              size={12}
              color={isUrgent ? '#EF4444' : T.textSecondary}
            />
            <Text style={[styles.deadlineText, isUrgent && styles.deadlineTextUrgent]}>
              {tender.deadlineDays}d left
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.tenderTitle}>{tender.title}</Text>

        {/* Location */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={T.textMuted} />
          <Text style={styles.locationText}>{tender.location}</Text>
        </View>

        {/* Budget & Bids */}
        <View style={styles.tenderMetaRow}>
          <View style={styles.tenderMetaItem}>
            <Ionicons name="wallet-outline" size={14} color={T.amber} />
            <Text style={styles.budgetText}>{tender.budget}</Text>
          </View>
          <View style={styles.tenderMetaItem}>
            <Ionicons name="people-outline" size={14} color={T.textSecondary} />
            <Text style={styles.bidsText}>{tender.bids} bids placed</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Place Bid */}
        <Pressable
          style={styles.placeBidBtn}
          onPress={() =>
            Alert.alert(
              'Place Bid',
              `Submit your bid for "${tender.title}"?`,
              [{ text: 'Cancel', style: 'cancel' }, { text: 'Proceed' }]
            )
          }
        >
          <Ionicons name="send" size={15} color="#fff" />
          <Text style={styles.placeBidText}>Place Bid</Text>
        </Pressable>
      </PressableCard>
    </Animated.View>
  );
}

function MyBidCard({ bid, index }: { bid: MyBid; index: number }) {
  const statusColor = bid.status === 'Under Review' ? '#3B82F6' : T.amber;
  const statusBg = bid.status === 'Under Review' ? '#DBEAFE' : '#FEF3C7';
  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(18).stiffness(180)}>
      <PressableCard style={styles.tenderCard}>
        <View style={styles.tenderTopRow}>
          <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusPillText, { color: statusColor }]}>{bid.status}</Text>
          </View>
          <Text style={styles.submittedDate}>{bid.submittedDate}</Text>
        </View>
        <Text style={styles.tenderTitle}>{bid.title}</Text>
        <View style={styles.bidMetaRow}>
          <View style={styles.tenderMetaItem}>
            <Ionicons name="wallet-outline" size={14} color={T.amber} />
            <Text style={styles.budgetText}>Budget: {bid.budget}</Text>
          </View>
          <View style={[styles.myBidAmountBox]}>
            <Text style={styles.myBidLabel}>My Bid</Text>
            <Text style={styles.myBidAmount}>{bid.bidAmount}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <Pressable style={styles.viewBidBtn}>
          <Ionicons name="eye-outline" size={15} color={T.navy} />
          <Text style={styles.viewBidText}>View Bid Details</Text>
        </Pressable>
      </PressableCard>
    </Animated.View>
  );
}

function WonTenderCard({ tender, index }: { tender: WonTender; index: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(18).stiffness(180)}>
      <PressableCard style={[styles.tenderCard, styles.wonCard]}>
        {/* Won Banner */}
        <View style={styles.wonBanner}>
          <Ionicons name="trophy" size={16} color={T.amber} />
          <Text style={styles.wonBannerText}>Contract Awarded</Text>
        </View>
        <Text style={styles.tenderTitle}>{tender.title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={T.textMuted} />
          <Text style={styles.locationText}>{tender.location}</Text>
        </View>
        <View style={styles.wonMetaRow}>
          <View>
            <Text style={styles.wonMetaLabel}>Contract Value</Text>
            <Text style={styles.wonContractValue}>{tender.contractValue}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.wonMetaLabel}>Awarded On</Text>
            <Text style={styles.wonAwardDate}>{tender.awardedDate}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <Pressable
          style={styles.viewContractBtn}
          onPress={() =>
            Alert.alert('View Contract', 'Opening contract details...', [{ text: 'OK' }])
          }
        >
          <Ionicons name="document-text-outline" size={15} color="#fff" />
          <Text style={styles.viewContractText}>View Contract</Text>
        </Pressable>
      </PressableCard>
    </Animated.View>
  );
}

export default function TendersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('open');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Tenders & Bids</Text>
        <Pressable style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color={T.text} />
        </Pressable>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                  {tab.count}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Open Tenders */}
        {activeTab === 'open' && (
          <View style={styles.cardsList}>
            {OPEN_TENDERS.map((tender, i) => (
              <OpenTenderCard key={tender.id} tender={tender} index={i} />
            ))}
          </View>
        )}

        {/* My Bids */}
        {activeTab === 'mybids' && (
          <View style={styles.cardsList}>
            {MY_BIDS.map((bid, i) => (
              <MyBidCard key={bid.id} bid={bid} index={i} />
            ))}
          </View>
        )}

        {/* Won */}
        {activeTab === 'won' && (
          <View style={styles.cardsList}>
            {WON_TENDERS.map((tender, i) => (
              <WonTenderCard key={tender.id} tender={tender} index={i} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: T.bg,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: T.text },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: T.bg,
  },

  /* Tab Bar */
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
    gap: 6,
  },
  tabActive: {
    backgroundColor: T.navy,
    borderColor: T.navy,
  },
  tabLabel: { fontSize: 13, fontWeight: '600', color: T.textMuted },
  tabLabelActive: { color: '#fff' },
  tabBadge: {
    backgroundColor: T.border,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  tabBadgeActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  tabBadgeText: { fontSize: 11, fontWeight: '700', color: T.textMuted },
  tabBadgeTextActive: { color: '#fff' },

  scrollContent: { paddingBottom: 40 },
  cardsList: { padding: 16, gap: 14 },

  /* Tender Card */
  tenderCard: {
    backgroundColor: T.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  wonCard: {
    borderColor: `${T.amber}40`,
    borderWidth: 1.5,
  },

  /* Top Row */
  tenderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  categoryText: { fontSize: 11, fontWeight: '700' },
  deadlineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: T.bg,
  },
  deadlineUrgent: { backgroundColor: '#FEE2E2' },
  deadlineText: { fontSize: 11, fontWeight: '600', color: T.textSecondary },
  deadlineTextUrgent: { color: '#EF4444', fontWeight: '700' },

  /* Title */
  tenderTitle: { fontSize: 15, fontWeight: '700', color: T.text, marginBottom: 8, lineHeight: 22 },

  /* Location */
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  locationText: { fontSize: 12, color: T.textMuted },

  /* Meta */
  tenderMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  tenderMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  budgetText: { fontSize: 14, fontWeight: '700', color: T.amber },
  bidsText: { fontSize: 12, color: T.textSecondary, fontWeight: '500' },

  /* Divider */
  divider: { height: 1, backgroundColor: T.border, marginBottom: 14 },

  /* Place Bid */
  placeBidBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: T.amber,
  },
  placeBidText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  /* My Bids */
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  submittedDate: { fontSize: 12, color: T.textMuted, fontWeight: '500' },
  bidMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  myBidAmountBox: { alignItems: 'flex-end' },
  myBidLabel: { fontSize: 11, color: T.textMuted, fontWeight: '500', marginBottom: 2 },
  myBidAmount: { fontSize: 16, fontWeight: '800', color: T.navy },
  viewBidBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.navy,
  },
  viewBidText: { fontSize: 14, fontWeight: '700', color: T.navy },

  /* Won */
  wonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  wonBannerText: { fontSize: 13, fontWeight: '700', color: T.amber },
  wonMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  wonMetaLabel: { fontSize: 11, color: T.textMuted, fontWeight: '500', marginBottom: 3 },
  wonContractValue: { fontSize: 20, fontWeight: '800', color: '#10B981' },
  wonAwardDate: { fontSize: 13, fontWeight: '600', color: T.text },
  viewContractBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: T.navy,
  },
  viewContractText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
