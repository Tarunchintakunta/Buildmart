import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Modal,
  TextInput,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LightTheme as T } from '../../../src/theme/colors';

type VerifStatus = 'Pending' | 'Approved' | 'Rejected';
type DocRole = 'Shopkeeper' | 'Worker' | 'Driver';

type Verification = {
  id: string;
  name: string;
  phone: string;
  role: DocRole;
  initials: string;
  aadhaar: boolean;
  pan: boolean;
  businessLicense: boolean;
  submittedAt: string;
  status: VerifStatus;
  rejectedReason?: string;
};

const ROLE_COLORS: Record<DocRole, string> = {
  Shopkeeper: '#10B981',
  Worker: '#F59E0B',
  Driver: '#3B82F6',
};

const INITIAL_DATA: Verification[] = [
  { id: 'v1', name: 'Ganesh Reddy', phone: '9876543301', role: 'Worker', initials: 'GR', aadhaar: true, pan: true, businessLicense: false, submittedAt: '23 Apr 2026', status: 'Pending' },
  { id: 'v2', name: 'Srinivas Rao', phone: '9876543302', role: 'Driver', initials: 'SR', aadhaar: true, pan: false, businessLicense: false, submittedAt: '22 Apr 2026', status: 'Pending' },
  { id: 'v3', name: 'Rajan Murthy', phone: '9876543303', role: 'Shopkeeper', initials: 'RM', aadhaar: true, pan: true, businessLicense: true, submittedAt: '22 Apr 2026', status: 'Pending' },
  { id: 'v4', name: 'Pradeep Kumar', phone: '9876543304', role: 'Worker', initials: 'PK', aadhaar: true, pan: true, businessLicense: false, submittedAt: '21 Apr 2026', status: 'Pending' },
  { id: 'v5', name: 'Venkat Naidu', phone: '9876543305', role: 'Driver', initials: 'VN', aadhaar: true, pan: true, businessLicense: false, submittedAt: '21 Apr 2026', status: 'Pending' },
  { id: 'v6', name: 'Lakshmi Traders', phone: '9876543306', role: 'Shopkeeper', initials: 'LT', aadhaar: true, pan: true, businessLicense: true, submittedAt: '20 Apr 2026', status: 'Pending' },
  { id: 'v7', name: 'Arun Chandra', phone: '9876543307', role: 'Worker', initials: 'AC', aadhaar: true, pan: false, businessLicense: false, submittedAt: '20 Apr 2026', status: 'Pending' },
  { id: 'v8', name: 'Mohan Das', phone: '9876543308', role: 'Shopkeeper', initials: 'MD', aadhaar: true, pan: true, businessLicense: true, submittedAt: '19 Apr 2026', status: 'Pending' },
  { id: 'v9', name: 'Suresh Pillai', phone: '9876543309', role: 'Worker', initials: 'SP', aadhaar: true, pan: true, businessLicense: false, submittedAt: '18 Apr 2026', status: 'Approved' },
  { id: 'v10', name: 'Ravi Shankar', phone: '9876543310', role: 'Driver', initials: 'RS', aadhaar: true, pan: true, businessLicense: false, submittedAt: '17 Apr 2026', status: 'Approved' },
  { id: 'v11', name: 'Kumar Electricals', phone: '9876543311', role: 'Shopkeeper', initials: 'KE', aadhaar: true, pan: true, businessLicense: false, submittedAt: '15 Apr 2026', status: 'Rejected', rejectedReason: 'Blurry documents submitted' },
];

function showToast(msg: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert('', msg);
  }
}

const TABS: VerifStatus[] = ['Pending', 'Approved', 'Rejected'];

export default function VerificationsScreen() {
  const [activeTab, setActiveTab] = useState<VerifStatus>('Pending');
  const [data, setData] = useState<Verification[]>(INITIAL_DATA);
  const [rejectModal, setRejectModal] = useState<Verification | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = data.filter((v) => v.status === activeTab);
  const pendingCount = data.filter((v) => v.status === 'Pending').length;

  const approveItem = (item: Verification) => {
    Alert.alert(
      'Approve Verification',
      `Approve KYC for ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            setData((prev) => prev.map((v) => v.id === item.id ? { ...v, status: 'Approved' } : v));
            showToast(`${item.name} approved!`);
          },
        },
      ]
    );
  };

  const openReject = (item: Verification) => {
    setRejectReason('');
    setRejectModal(item);
  };

  const confirmReject = () => {
    if (!rejectModal) return;
    if (!rejectReason.trim()) {
      Alert.alert('Required', 'Please enter a reason for rejection.');
      return;
    }
    setData((prev) =>
      prev.map((v) =>
        v.id === rejectModal.id ? { ...v, status: 'Rejected', rejectedReason: rejectReason.trim() } : v
      )
    );
    showToast(`${rejectModal.name} rejected.`);
    setRejectModal(null);
  };

  const renderDoc = (label: string, present: boolean) => (
    <View style={s.docRow} key={label}>
      <Ionicons
        name={present ? 'checkmark-circle' : 'close-circle-outline'}
        size={15}
        color={present ? T.success : T.textMuted}
      />
      <Text style={[s.docLabel, !present && s.docLabelMissing]}>{label}</Text>
    </View>
  );

  const renderCard = ({ item, index }: { item: Verification; index: number }) => {
    const roleColor = ROLE_COLORS[item.role];
    return (
      <Animated.View entering={FadeInDown.delay(index * 60).duration(400)} style={s.card}>
        {/* Card Header */}
        <View style={s.cardHeader}>
          <View style={[s.avatar, { backgroundColor: roleColor + '22' }]}>
            <Text style={[s.avatarText, { color: roleColor }]}>{item.initials}</Text>
          </View>
          <View style={s.cardInfo}>
            <Text style={s.name}>{item.name}</Text>
            <Text style={s.phone}>{item.phone}</Text>
            <View style={[s.roleBadge, { backgroundColor: roleColor + '18' }]}>
              <Text style={[s.roleText, { color: roleColor }]}>{item.role}</Text>
            </View>
          </View>
          <View style={s.dateCol}>
            <Text style={s.dateLabel}>Submitted</Text>
            <Text style={s.dateValue}>{item.submittedAt}</Text>
          </View>
        </View>

        {/* Documents */}
        <View style={s.docsSection}>
          <Text style={s.docsTitle}>Documents</Text>
          <View style={s.docsGrid}>
            {renderDoc('Aadhaar Card', item.aadhaar)}
            {renderDoc('PAN Card', item.pan)}
            {renderDoc('Business License', item.businessLicense)}
          </View>
        </View>

        {/* Rejection reason */}
        {item.status === 'Rejected' && item.rejectedReason && (
          <View style={s.rejectionBox}>
            <Ionicons name="close-circle" size={14} color={T.error} />
            <Text style={s.rejectionText}>{item.rejectedReason}</Text>
          </View>
        )}

        {/* Approved badge */}
        {item.status === 'Approved' && (
          <View style={s.approvedBox}>
            <Ionicons name="checkmark-circle" size={14} color={T.success} />
            <Text style={s.approvedText}>Verified & Approved</Text>
          </View>
        )}

        {/* Actions */}
        {item.status === 'Pending' && (
          <View style={s.actions}>
            <Pressable style={s.approveBtn} onPress={() => approveItem(item)}>
              <Ionicons name="checkmark" size={16} color={T.white} />
              <Text style={s.actionBtnText}>Approve</Text>
            </Pressable>
            <Pressable style={s.rejectBtn} onPress={() => openReject(item)}>
              <Ionicons name="close" size={16} color={T.white} />
              <Text style={s.actionBtnText}>Reject</Text>
            </Pressable>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Pending Verifications</Text>
        {pendingCount > 0 && (
          <View style={s.countBadge}>
            <Text style={s.countBadgeText}>{pendingCount}</Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={s.tabBar}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[s.tab, activeTab === tab && s.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
              {tab} ({data.filter((v) => v.status === tab).length})
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="shield-checkmark-outline" size={48} color={T.textMuted} />
            <Text style={s.emptyText}>No {activeTab.toLowerCase()} verifications</Text>
          </View>
        }
      />

      {/* Reject Modal */}
      <Modal
        visible={!!rejectModal}
        transparent
        animationType="slide"
        onRequestClose={() => setRejectModal(null)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>Reject Verification</Text>
            {rejectModal && (
              <Text style={s.modalSub}>
                Rejecting KYC for <Text style={{ fontWeight: '700' }}>{rejectModal.name}</Text>
              </Text>
            )}
            <Text style={s.modalLabel}>Reason for rejection *</Text>
            <TextInput
              style={s.modalInput}
              placeholder="e.g. Documents are blurry or invalid..."
              placeholderTextColor={T.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={rejectReason}
              onChangeText={setRejectReason}
            />
            <View style={s.modalActions}>
              <Pressable style={s.modalCancel} onPress={() => setRejectModal(null)}>
                <Text style={s.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={s.modalConfirm} onPress={confirmReject}>
                <Text style={s.modalConfirmText}>Confirm Reject</Text>
              </Pressable>
            </View>
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
    paddingVertical: 16,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: T.text },
  countBadge: {
    backgroundColor: T.amber,
    borderRadius: 14,
    minWidth: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  countBadgeText: { fontSize: 13, fontWeight: '800', color: T.white },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: T.bg,
  },
  tabActive: { backgroundColor: T.navy },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '800' },
  cardInfo: { flex: 1, marginLeft: 12, gap: 3 },
  name: { fontSize: 16, fontWeight: '700', color: T.text },
  phone: { fontSize: 13, color: T.textSecondary },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 2,
  },
  roleText: { fontSize: 11, fontWeight: '700' },
  dateCol: { alignItems: 'flex-end' },
  dateLabel: { fontSize: 11, color: T.textMuted },
  dateValue: { fontSize: 12, fontWeight: '600', color: T.textSecondary },
  docsSection: {
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  docsTitle: { fontSize: 12, fontWeight: '600', color: T.textMuted, marginBottom: 8 },
  docsGrid: { gap: 6 },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  docLabel: { fontSize: 13, color: T.text, fontWeight: '500' },
  docLabelMissing: { color: T.textMuted },
  rejectionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EF444410',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EF444428',
  },
  rejectionText: { fontSize: 13, color: T.error, flex: 1 },
  approvedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10B98110',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#10B98128',
  },
  approvedText: { fontSize: 13, color: T.success, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: T.border },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: T.success,
    borderRadius: 12,
    paddingVertical: 12,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: T.error,
    borderRadius: 12,
    paddingVertical: 12,
  },
  actionBtnText: { fontSize: 14, fontWeight: '700', color: T.white },
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
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: T.text, marginBottom: 6 },
  modalSub: { fontSize: 14, color: T.textSecondary, marginBottom: 20 },
  modalLabel: { fontSize: 13, fontWeight: '600', color: T.text, marginBottom: 8 },
  modalInput: {
    backgroundColor: T.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    fontSize: 15,
    color: T.text,
    minHeight: 90,
    marginBottom: 20,
  },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: T.bg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.border,
  },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: T.textSecondary },
  modalConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: T.error,
    alignItems: 'center',
  },
  modalConfirmText: { fontSize: 15, fontWeight: '700', color: T.white },
});
