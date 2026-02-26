import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type DisputeStatus = 'Open' | 'In Progress' | 'Resolved';
type Priority = 'High' | 'Medium' | 'Low';
type DisputeType = 'Order' | 'Payment' | 'Agreement';

const PRIORITY_COLORS: Record<Priority, string> = {
  High: '#EF4444',
  Medium: T.amber,
  Low: '#3B82F6',
};

const TABS: DisputeStatus[] = ['Open', 'In Progress', 'Resolved'];

const STATS = [
  { label: 'Open', value: '5', icon: 'alert-circle' as const, color: '#EF4444' },
  { label: 'In Progress', value: '3', icon: 'hourglass' as const, color: T.amber },
  { label: 'Resolved', value: '42', icon: 'checkmark-circle' as const, color: '#10B981' },
];

type Dispute = {
  id: string;
  disputeId: string;
  type: DisputeType;
  complainant: string;
  respondent: string;
  description: string;
  filedDate: string;
  priority: Priority;
  status: DisputeStatus;
  resolution?: string;
  refundAmount?: string;
};

const DISPUTES: Dispute[] = [
  {
    id: '1',
    disputeId: 'DSP-1024',
    type: 'Order',
    complainant: 'Rajesh Kumar',
    respondent: 'Sharma Building Materials',
    description: 'Received damaged cement bags. 5 out of 20 bags were torn and material was wasted.',
    filedDate: '25 Feb 2026',
    priority: 'High',
    status: 'Open',
  },
  {
    id: '2',
    disputeId: 'DSP-1023',
    type: 'Payment',
    complainant: 'Sunil Krishna',
    respondent: 'Anita Desai',
    description: 'Payment of Rs.18,200 not received for Order #BM-2830 despite delivery confirmation.',
    filedDate: '24 Feb 2026',
    priority: 'High',
    status: 'Open',
  },
  {
    id: '3',
    disputeId: 'DSP-1022',
    type: 'Agreement',
    complainant: 'Vikram Singh',
    respondent: 'Patel Constructions',
    description: 'Labour agreement terms violated. Workers were asked to work overtime without agreed compensation.',
    filedDate: '23 Feb 2026',
    priority: 'Medium',
    status: 'In Progress',
  },
  {
    id: '4',
    disputeId: 'DSP-1015',
    type: 'Order',
    complainant: 'Priya Sharma',
    respondent: 'Gupta Hardware & Tools',
    description: 'Wrong items delivered. Ordered 10mm TMT bars but received 8mm instead.',
    filedDate: '18 Feb 2026',
    priority: 'Low',
    status: 'Resolved',
    resolution: 'Replacement order dispatched. Customer received correct items on 20 Feb.',
    refundAmount: 'Rs.2,500',
  },
];

export default function DisputesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DisputeStatus>('Open');

  const filteredDisputes = DISPUTES.filter((d) => d.status === activeTab);

  const getTypeIcon = (type: DisputeType): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'Order':
        return 'cube-outline';
      case 'Payment':
        return 'wallet-outline';
      case 'Agreement':
        return 'document-text-outline';
    }
  };

  const renderDisputeCard = (dispute: Dispute) => {
    const priorityColor = PRIORITY_COLORS[dispute.priority];
    return (
      <View key={dispute.id} style={[s.disputeCard, { borderLeftWidth: 4, borderLeftColor: priorityColor }]}>
        {/* Dispute Header */}
        <View style={s.disputeHeader}>
          <View style={{ flex: 1 }}>
            <View style={s.idRow}>
              <Text style={s.disputeIdText}>{dispute.disputeId}</Text>
              <View style={[s.typeBadge, { backgroundColor: T.bg }]}>
                <Ionicons name={getTypeIcon(dispute.type)} size={12} color={T.textSecondary} />
                <Text style={s.typeText}>{dispute.type}</Text>
              </View>
            </View>
            <Text style={s.filedDate}>Filed {dispute.filedDate}</Text>
          </View>
          <View style={[s.priorityBadge, { backgroundColor: priorityColor + '26' }]}>
            <Text style={[s.priorityText, { color: priorityColor }]}>{dispute.priority}</Text>
          </View>
        </View>

        {/* Parties */}
        <View style={s.partiesSection}>
          <View style={s.partyRow}>
            <Ionicons name="person-outline" size={14} color={T.textMuted} />
            <Text style={s.partyLabel}>Complainant:</Text>
            <Text style={s.partyValue}>{dispute.complainant}</Text>
          </View>
          <View style={s.partyRow}>
            <Ionicons name="business-outline" size={14} color={T.textMuted} />
            <Text style={s.partyLabel}>Respondent:</Text>
            <Text style={s.partyValue}>{dispute.respondent}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={s.descriptionBox}>
          <Text style={s.descriptionText}>{dispute.description}</Text>
        </View>

        {/* Resolution (for Resolved) */}
        {dispute.status === 'Resolved' && dispute.resolution && (
          <View style={s.resolutionBox}>
            <View style={s.resolutionHeader}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={s.resolutionTitle}>Resolution</Text>
            </View>
            <Text style={s.resolutionText}>{dispute.resolution}</Text>
            {dispute.refundAmount && (
              <View style={s.refundRow}>
                <Ionicons name="wallet-outline" size={14} color={T.amber} />
                <Text style={s.refundLabel}>Refund:</Text>
                <Text style={s.refundAmount}>{dispute.refundAmount}</Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        {dispute.status !== 'Resolved' && (
          <View style={s.actionRow}>
            <TouchableOpacity style={s.actionBtnOutline}>
              <Ionicons name="eye-outline" size={15} color={T.navy} />
              <Text style={s.actionBtnOutlineText}>Details</Text>
            </TouchableOpacity>
            {dispute.status === 'Open' && (
              <TouchableOpacity style={s.actionBtnFilled}>
                <Ionicons name="hand-left-outline" size={15} color={T.white} />
                <Text style={s.actionBtnFilledText}>Assign to Me</Text>
              </TouchableOpacity>
            )}
            {dispute.status === 'In Progress' && (
              <>
                <TouchableOpacity style={[s.actionBtnOutline, { borderColor: '#EF4444' }]}>
                  <Ionicons name="arrow-up-outline" size={15} color="#EF4444" />
                  <Text style={[s.actionBtnOutlineText, { color: '#EF4444' }]}>Escalate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.resolveBtn}>
                  <Ionicons name="checkmark-circle-outline" size={15} color={T.white} />
                  <Text style={s.resolveBtnText}>Resolve</Text>
                </TouchableOpacity>
              </>
            )}
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
        <Text style={s.headerTitle}>Disputes</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Stats */}
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

        {/* Dispute Cards */}
        <View style={s.disputeList}>
          {filteredDisputes.length === 0 ? (
            <View style={s.empty}>
              <View style={s.emptyIcon}>
                <Ionicons name="shield-checkmark-outline" size={48} color={T.textMuted} />
              </View>
              <Text style={s.emptyTitle}>No disputes</Text>
              <Text style={s.emptyDesc}>
                No {activeTab.toLowerCase()} disputes to show.
              </Text>
            </View>
          ) : (
            filteredDisputes.map(renderDisputeCard)
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
    fontSize: 11,
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
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.textMuted,
  },
  tabTextActive: {
    color: T.white,
  },

  /* Dispute List */
  disputeList: {
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 14,
  },

  /* Dispute Card */
  disputeCard: {
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
  disputeHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 14,
  },
  idRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  disputeIdText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
  },
  typeBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: T.textSecondary,
  },
  filedDate: {
    fontSize: 12,
    color: T.textMuted,
    marginTop: 4,
  },
  priorityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },

  /* Parties */
  partiesSection: {
    gap: 8,
    marginBottom: 12,
  },
  partyRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  partyLabel: {
    fontSize: 13,
    color: T.textMuted,
    fontWeight: '500' as const,
  },
  partyValue: {
    fontSize: 13,
    color: T.text,
    fontWeight: '600' as const,
    flex: 1,
  },

  /* Description */
  descriptionBox: {
    backgroundColor: T.bg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  descriptionText: {
    fontSize: 13,
    color: T.textSecondary,
    lineHeight: 19,
  },

  /* Resolution */
  resolutionBox: {
    backgroundColor: '#10B98112',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#10B98130',
  },
  resolutionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginBottom: 8,
  },
  resolutionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#10B981',
  },
  resolutionText: {
    fontSize: 13,
    color: T.textSecondary,
    lineHeight: 19,
  },
  refundRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#10B98130',
  },
  refundLabel: {
    fontSize: 13,
    color: T.textMuted,
    fontWeight: '500' as const,
  },
  refundAmount: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.amber,
  },

  /* Actions */
  actionRow: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 5,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.navy,
  },
  actionBtnOutlineText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.navy,
  },
  actionBtnFilled: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 5,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: T.navy,
  },
  actionBtnFilledText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.white,
  },
  resolveBtn: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 5,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#10B981',
  },
  resolveBtnText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.white,
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
