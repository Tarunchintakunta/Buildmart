import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LightTheme as T } from '../../src/theme/colors';

type DisputeStatus = 'Open' | 'Investigating' | 'Resolved';
type Priority = 'High' | 'Medium' | 'Low';
type IssueType = 'Wrong items' | 'Damaged goods' | 'Late delivery' | 'Payment issue' | 'Worker dispute' | 'Fraud';

type Dispute = {
  id: string;
  orderId: string;
  customer: string;
  shop: string;
  issueType: IssueType;
  status: DisputeStatus;
  priority: Priority;
  date: string;
  amount: string;
  description: string;
};

const MOCK_DISPUTES: Dispute[] = [
  { id: 'd1', orderId: 'BM-5821', customer: 'Rajesh Kumar', shop: 'Sharma Building Materials', issueType: 'Damaged goods', status: 'Open', priority: 'High', date: '23 Apr 2026', amount: '₹18,400', description: '5 bags of cement received damaged. Material completely unusable. Requesting full replacement or refund.' },
  { id: 'd2', orderId: 'BM-5812', customer: 'Priya Sharma', shop: 'Krishna Cement House', issueType: 'Wrong items', status: 'Open', priority: 'High', date: '22 Apr 2026', amount: '₹9,600', description: 'Ordered 10mm TMT bars, received 8mm. Cannot use for the current project foundation.' },
  { id: 'd3', orderId: 'BM-5798', customer: 'Anil Verma', shop: 'Gupta Hardware', issueType: 'Late delivery', status: 'Open', priority: 'Medium', date: '21 Apr 2026', amount: '₹5,200', description: 'Delivery promised within 24 hours, arrived 4 days late. Labor costs incurred due to delay.' },
  { id: 'd4', orderId: 'BM-5780', customer: 'Sunita Reddy', shop: 'Patel Steel Traders', issueType: 'Payment issue', status: 'Investigating', priority: 'High', date: '20 Apr 2026', amount: '₹32,000', description: 'Payment deducted from wallet but order shows as failed. No refund received yet.' },
  { id: 'd5', orderId: 'BM-5765', customer: 'Mohan Das', shop: 'Singh Sand & Gravel', issueType: 'Worker dispute', status: 'Investigating', priority: 'Medium', date: '19 Apr 2026', amount: '₹12,500', description: 'Worker left the site midway through the project after receiving advance payment.' },
  { id: 'd6', orderId: 'BM-5741', customer: 'Kavitha Nair', shop: 'Anand Hardware', issueType: 'Wrong items', status: 'Resolved', priority: 'Low', date: '17 Apr 2026', amount: '₹3,800', description: 'Wrong paint shade delivered. Issue resolved with replacement order on Apr 19.' },
  { id: 'd7', orderId: 'BM-5730', customer: 'Ravi Shankar', shop: 'Lakshmi Traders', issueType: 'Damaged goods', status: 'Resolved', priority: 'Medium', date: '15 Apr 2026', amount: '₹7,600', description: 'Tiles cracked on delivery. Full refund processed on Apr 17.' },
];

const STATUS_TABS: DisputeStatus[] = ['Open', 'Investigating', 'Resolved'];

const PRIORITY_COLORS: Record<Priority, string> = {
  High: '#EF4444',
  Medium: '#F59E0B',
  Low: '#3B82F6',
};

const STATUS_COLORS: Record<DisputeStatus, string> = {
  Open: '#EF4444',
  Investigating: '#F59E0B',
  Resolved: '#10B981',
};

const ISSUE_ICONS: Record<IssueType, keyof typeof Ionicons.glyphMap> = {
  'Wrong items': 'swap-horizontal-outline',
  'Damaged goods': 'alert-circle-outline',
  'Late delivery': 'time-outline',
  'Payment issue': 'wallet-outline',
  'Worker dispute': 'hammer-outline',
  'Fraud': 'shield-outline',
};

export default function DisputesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DisputeStatus>('Open');
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const filtered = disputes.filter((d) => d.status === activeTab);

  const resolveDispute = (id: string, action: string) => {
    Alert.alert(
      'Confirm Action',
      `Confirm: "${action}" for dispute ${disputes.find((d) => d.id === id)?.orderId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setDisputes((prev) =>
              prev.map((d) =>
                d.id === id ? { ...d, status: 'Resolved' as DisputeStatus } : d
              )
            );
            setSelectedDispute(null);
          },
        },
      ]
    );
  };

  const investigateDispute = (id: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: 'Investigating' as DisputeStatus } : d
      )
    );
    setSelectedDispute(null);
  };

  const renderCard = (dispute: Dispute, index: number) => {
    const priorityColor = PRIORITY_COLORS[dispute.priority];
    const statusColor = STATUS_COLORS[dispute.status];

    return (
      <Animated.View
        key={dispute.id}
        entering={FadeInDown.delay(index * 70).duration(400)}
        style={[s.card, { borderLeftColor: priorityColor, borderLeftWidth: 3 }]}
      >
        {/* Header */}
        <View style={s.cardHeader}>
          <View style={s.headerLeft}>
            <View style={s.orderRow}>
              <Text style={s.orderId}>#{dispute.orderId}</Text>
              <View style={[s.priorityBadge, { backgroundColor: priorityColor + '18' }]}>
                <Text style={[s.priorityText, { color: priorityColor }]}>{dispute.priority}</Text>
              </View>
            </View>
            <Text style={s.dateText}>{dispute.date}</Text>
          </View>
          <View style={[s.issueIcon, { backgroundColor: statusColor + '14' }]}>
            <Ionicons name={ISSUE_ICONS[dispute.issueType]} size={18} color={statusColor} />
          </View>
        </View>

        {/* Issue Type */}
        <View style={s.issueRow}>
          <Text style={s.issueType}>{dispute.issueType}</Text>
          <Text style={s.amount}>{dispute.amount}</Text>
        </View>

        {/* Parties */}
        <View style={s.partiesBox}>
          <View style={s.partyRow}>
            <Ionicons name="person-outline" size={13} color={T.textMuted} />
            <Text style={s.partyLabel}>Customer:</Text>
            <Text style={s.partyValue}>{dispute.customer}</Text>
          </View>
          <View style={s.partyRow}>
            <Ionicons name="storefront-outline" size={13} color={T.textMuted} />
            <Text style={s.partyLabel}>Shop:</Text>
            <Text style={s.partyValue}>{dispute.shop}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={s.description} numberOfLines={2}>{dispute.description}</Text>

        {/* Actions */}
        {dispute.status !== 'Resolved' && (
          <View style={s.cardActions}>
            <Pressable style={s.investigateBtn} onPress={() => setSelectedDispute(dispute)}>
              <Ionicons name="search-outline" size={15} color={T.navy} />
              <Text style={s.investigateBtnText}>Investigate</Text>
            </Pressable>
          </View>
        )}

        {dispute.status === 'Resolved' && (
          <View style={s.resolvedBox}>
            <Ionicons name="checkmark-circle" size={14} color={T.success} />
            <Text style={s.resolvedText}>Dispute resolved</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={s.headerTitle}>Disputes</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats */}
      <Animated.View entering={FadeInDown.delay(0).duration(400)} style={s.statsRow}>
        {STATUS_TABS.map((status) => {
          const count = disputes.filter((d) => d.status === status).length;
          const color = STATUS_COLORS[status];
          return (
            <View key={status} style={s.statCard}>
              <View style={[s.statIcon, { backgroundColor: color + '18' }]}>
                <Ionicons
                  name={status === 'Open' ? 'alert-circle' : status === 'Investigating' ? 'hourglass' : 'checkmark-circle'}
                  size={18}
                  color={color}
                />
              </View>
              <Text style={[s.statValue, { color }]}>{count}</Text>
              <Text style={s.statLabel}>{status}</Text>
            </View>
          );
        })}
      </Animated.View>

      {/* Tabs */}
      <View style={s.tabRow}>
        {STATUS_TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[s.tab, activeTab === tab && s.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      {/* Dispute List */}
      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="shield-checkmark-outline" size={48} color={T.textMuted} />
            <Text style={s.emptyText}>No {activeTab.toLowerCase()} disputes</Text>
          </View>
        ) : (
          filtered.map((d, i) => renderCard(d, i))
        )}
      </ScrollView>

      {/* Investigation Modal */}
      <Modal
        visible={!!selectedDispute}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDispute(null)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Dispute Details</Text>
              <Pressable onPress={() => setSelectedDispute(null)}>
                <Ionicons name="close" size={22} color={T.text} />
              </Pressable>
            </View>

            {selectedDispute && (
              <>
                <View style={s.modalInfoRow}>
                  <Text style={s.modalOrderId}>#{selectedDispute.orderId}</Text>
                  <Text style={s.modalAmount}>{selectedDispute.amount}</Text>
                </View>

                <View style={s.modalParties}>
                  <Text style={s.modalPartyRow}>
                    <Text style={s.modalPartyLabel}>Customer: </Text>
                    {selectedDispute.customer}
                  </Text>
                  <Text style={s.modalPartyRow}>
                    <Text style={s.modalPartyLabel}>Shop: </Text>
                    {selectedDispute.shop}
                  </Text>
                  <Text style={s.modalPartyRow}>
                    <Text style={s.modalPartyLabel}>Issue: </Text>
                    {selectedDispute.issueType}
                  </Text>
                </View>

                <View style={s.modalDesc}>
                  <Text style={s.modalDescText}>{selectedDispute.description}</Text>
                </View>

                <Text style={s.modalActionsTitle}>Resolution Options</Text>
                <View style={s.modalActions}>
                  <Pressable
                    style={s.modalActionRefund}
                    onPress={() => resolveDispute(selectedDispute.id, 'Issue full refund')}
                  >
                    <Ionicons name="wallet-outline" size={18} color={T.white} />
                    <Text style={s.modalActionText}>Issue Refund</Text>
                  </Pressable>
                  <Pressable
                    style={s.modalActionClose}
                    onPress={() => resolveDispute(selectedDispute.id, 'Close dispute')}
                  >
                    <Ionicons name="checkmark-circle-outline" size={18} color={T.white} />
                    <Text style={s.modalActionText}>Close Dispute</Text>
                  </Pressable>
                </View>
                {selectedDispute.status === 'Open' && (
                  <Pressable
                    style={s.modalInvestigate}
                    onPress={() => investigateDispute(selectedDispute.id)}
                  >
                    <Ionicons name="search-outline" size={18} color={T.navy} />
                    <Text style={s.modalInvestigateText}>Move to Investigating</Text>
                  </Pressable>
                )}
                <Pressable
                  style={s.modalSuspend}
                  onPress={() => {
                    Alert.alert('Suspend User', 'This will temporarily suspend the shop account.', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Suspend', style: 'destructive', onPress: () => setSelectedDispute(null) },
                    ]);
                  }}
                >
                  <Ionicons name="ban-outline" size={16} color={T.error} />
                  <Text style={s.modalSuspendText}>Suspend Shop Account</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: T.text },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.border,
    gap: 6,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, color: T.textMuted },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: T.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.border,
  },
  tabActive: { backgroundColor: T.navy, borderColor: T.navy },
  tabText: { fontSize: 13, fontWeight: '600', color: T.textSecondary },
  tabTextActive: { color: T.white },
  list: { padding: 16, gap: 12, paddingBottom: 40 },
  card: {
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeft: { gap: 4 },
  orderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orderId: { fontSize: 16, fontWeight: '700', color: T.text },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  priorityText: { fontSize: 11, fontWeight: '700' },
  dateText: { fontSize: 12, color: T.textMuted },
  issueIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  issueType: { fontSize: 14, fontWeight: '600', color: T.text },
  amount: { fontSize: 15, fontWeight: '800', color: T.amber },
  partiesBox: {
    backgroundColor: T.bg,
    borderRadius: 10,
    padding: 10,
    gap: 6,
    marginBottom: 10,
  },
  partyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  partyLabel: { fontSize: 12, color: T.textMuted, fontWeight: '500' },
  partyValue: { fontSize: 13, color: T.text, fontWeight: '600', flex: 1 },
  description: { fontSize: 13, color: T.textSecondary, lineHeight: 18, marginBottom: 12 },
  cardActions: { borderTopWidth: 1, borderTopColor: T.border, paddingTop: 12 },
  investigateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.navy,
  },
  investigateBtnText: { fontSize: 14, fontWeight: '600', color: T.navy },
  resolvedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10B98110',
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#10B98128',
  },
  resolvedText: { fontSize: 13, color: T.success, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16, color: T.textSecondary },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: T.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: T.text },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalOrderId: { fontSize: 18, fontWeight: '700', color: T.text },
  modalAmount: { fontSize: 18, fontWeight: '800', color: T.amber },
  modalParties: {
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 12,
    gap: 6,
    marginBottom: 14,
  },
  modalPartyRow: { fontSize: 14, color: T.text },
  modalPartyLabel: { fontWeight: '600', color: T.textSecondary },
  modalDesc: {
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  modalDescText: { fontSize: 13, color: T.textSecondary, lineHeight: 19 },
  modalActionsTitle: { fontSize: 14, fontWeight: '600', color: T.text, marginBottom: 10 },
  modalActions: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  modalActionRefund: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
  },
  modalActionClose: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: T.success,
  },
  modalActionText: { fontSize: 14, fontWeight: '700', color: T.white },
  modalInvestigate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.navy,
    marginBottom: 10,
  },
  modalInvestigateText: { fontSize: 14, fontWeight: '600', color: T.navy },
  modalSuspend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  modalSuspendText: { fontSize: 13, fontWeight: '600', color: T.error },
});
