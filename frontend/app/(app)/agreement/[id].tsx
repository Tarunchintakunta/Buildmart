import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { useAuth } from '../../../src/hooks/useAuth';
import { LightTheme } from '../../../src/theme/colors';

const T = LightTheme;

type AgreementStatus = 'draft' | 'pending_signature' | 'active' | 'completed' | 'terminated';

const STATUS_CONFIG: Record<AgreementStatus, { label: string; color: string }> = {
  draft:             { label: 'Draft',         color: '#6B7280' },
  pending_signature: { label: 'Pending Sign',  color: '#F59E0B' },
  active:            { label: 'Active',        color: '#10B981' },
  completed:         { label: 'Completed',     color: '#3B82F6' },
  terminated:        { label: 'Terminated',    color: '#EF4444' },
};

const MOCK_AGREEMENTS: Record<string, {
  id: string; contractId: string; status: AgreementStatus;
  contractorName: string; contractorCompany: string;
  workerName: string; workerSkill: string;
  jobType: string; location: string; startDate: string; duration: number; dailyRate: number;
  description: string; scopeOfWork: string[];
  contractorSigned: boolean; contractorSignDate: string;
  workerSigned: boolean; workerSignDate: string;
  createdDate: string;
}> = {
  agr001: {
    id: 'agr001', contractId: 'BM-AGR-2026-001', status: 'active',
    contractorName: 'Rajesh Sharma', contractorCompany: 'Rajesh Constructions Pvt Ltd',
    workerName: 'Ramu Yadav', workerSkill: 'Mason',
    jobType: 'Masonry & Plastering', location: 'Gachibowli, Hyderabad',
    startDate: '01 May 2026', duration: 45, dailyRate: 800,
    description: 'Complete brickwork and plastering for G+2 residential building.',
    scopeOfWork: [
      'Brick masonry for all external and internal walls as per drawing',
      'Plastering — internal single coat, external double coat',
      'Tiling for bathrooms and kitchen as per client specification',
      'Grouting and finishing work for all tiled areas',
      'Supervision and quality check of sub-workers',
    ],
    contractorSigned: true, contractorSignDate: '20 Apr 2026',
    workerSigned: true, workerSignDate: '21 Apr 2026',
    createdDate: '20 Apr 2026',
  },
  agr002: {
    id: 'agr002', contractId: 'BM-AGR-2026-002', status: 'pending_signature',
    contractorName: 'Anil Kumar', contractorCompany: 'BuildRight Infrastructure',
    workerName: 'Venkat Rao', workerSkill: 'Electrician',
    jobType: 'Electrical Installation', location: 'HITEC City, Hyderabad',
    startDate: '10 May 2026', duration: 30, dailyRate: 1200,
    description: 'Full electrical wiring, panel installation, and safety testing for commercial complex.',
    scopeOfWork: [
      'Complete concealed wiring for all floors as per load schedule',
      'DB panel installation and cable termination',
      'Light fixtures, fans, and plug points installation',
      'UPS and earthing system setup',
      'Final testing, commissioning, and safety sign-off',
    ],
    contractorSigned: true, contractorSignDate: '22 Apr 2026',
    workerSigned: false, workerSignDate: '',
    createdDate: '22 Apr 2026',
  },
  agr003: {
    id: 'agr003', contractId: 'BM-AGR-2026-003', status: 'completed',
    contractorName: 'Sunil Sharma', contractorCompany: 'Sharma Builders',
    workerName: 'Mohammed Khader', workerSkill: 'Carpenter',
    jobType: 'Modular Kitchen & Carpentry', location: 'Banjara Hills, Hyderabad',
    startDate: '15 Mar 2026', duration: 20, dailyRate: 1100,
    description: 'Custom modular kitchen, wardrobe, and false ceiling installation.',
    scopeOfWork: [
      'Modular kitchen cabinet fabrication and installation',
      'Master bedroom wardrobe with sliding doors',
      'False ceiling with gypsum boards in living area',
      'TV unit and shoe rack in entrance lobby',
      'Touch-up and handover inspection',
    ],
    contractorSigned: true, contractorSignDate: '12 Mar 2026',
    workerSigned: true, workerSignDate: '13 Mar 2026',
    createdDate: '10 Mar 2026',
  },
  agr004: {
    id: 'agr004', contractId: 'BM-AGR-2026-004', status: 'terminated',
    contractorName: 'Venkata Rao Reddy', contractorCompany: 'Hyderabad Infra Projects',
    workerName: 'Srinivas Reddy', workerSkill: 'Welder',
    jobType: 'Steel Fabrication', location: 'Uppal, Hyderabad',
    startDate: '05 Feb 2026', duration: 15, dailyRate: 1300,
    description: 'Structural steel work and railing fabrication for industrial warehouse.',
    scopeOfWork: [
      'Structural steel column and beam fabrication',
      'Staircase railing and balustrade welding',
      'Gate and grill fabrication for entrance',
      'Surface preparation and primer coating',
      'Site cleanup and material reconciliation',
    ],
    contractorSigned: true, contractorSignDate: '02 Feb 2026',
    workerSigned: true, workerSignDate: '03 Feb 2026',
    createdDate: '01 Feb 2026',
  },
};

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon as any} size={16} color={T.navy} />
      </View>
      <View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function AgreementDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const agreement = MOCK_AGREEMENTS[id as string] || MOCK_AGREEMENTS['agr001'];
  const cfg = STATUS_CONFIG[agreement.status];
  const totalValue = agreement.dailyRate * agreement.duration;

  const [signed, setSigned] = useState(agreement.workerSigned);
  const [signing, setSigning] = useState(false);

  const isWorker = user?.role === 'worker';
  const canSign = isWorker && agreement.status === 'pending_signature' && !signed;

  function handleSign() {
    Alert.alert(
      'Sign Agreement',
      `By tapping Confirm, you digitally sign "${agreement.contractId}" and agree to all terms.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Sign',
          onPress: () => {
            setSigning(true);
            setTimeout(() => {
              setSigning(false);
              setSigned(true);
              Alert.alert('Signed!', 'Agreement signed. Work can now begin.');
            }, 1000);
          },
        },
      ],
    );
  }

  function handleDownload() {
    Alert.alert('Coming Soon', 'PDF download will be available in the next update.');
  }

  const timeline = [
    { label: 'Agreement Created', icon: 'document-text-outline', done: true },
    { label: 'Contractor Signed', icon: 'create-outline', done: agreement.contractorSigned },
    { label: 'Worker Signed', icon: 'create-outline', done: signed },
    { label: 'Work In Progress', icon: 'construct-outline', done: agreement.status === 'active' || agreement.status === 'completed' },
    { label: 'Completed & Paid', icon: 'checkmark-done-circle-outline', done: agreement.status === 'completed' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={T.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>Agreement</Text>
        <Pressable style={styles.dlBtn} onPress={handleDownload}>
          <Ionicons name="download-outline" size={20} color={T.navy} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Contract Title */}
        <Animated.View entering={FadeInDown.springify()} style={styles.contractHero}>
          <Text style={styles.contractHeading}>SERVICE AGREEMENT</Text>
          <Text style={styles.contractId}>{agreement.contractId}</Text>
          <Text style={styles.contractDate}>Dated: {agreement.createdDate}</Text>
          <View style={[styles.statusPill, { backgroundColor: cfg.color + '30' }]}>
            <Text style={[styles.statusPillText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </Animated.View>

        {/* Parties */}
        <Animated.View entering={FadeInLeft.delay(80).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>PARTIES</Text>
          <View style={styles.partiesRow}>
            <View style={[styles.partyCard, styles.partyCardA]}>
              <View style={styles.partyIconCircle}>
                <Ionicons name="business" size={18} color={T.navy} />
              </View>
              <Text style={styles.partyRoleLabel}>Party A — Contractor</Text>
              <Text style={styles.partyPersonName}>{agreement.contractorName}</Text>
              <Text style={styles.partyCompany}>{agreement.contractorCompany}</Text>
            </View>
            <View style={styles.partiesVs}>
              <Text style={styles.vsText}>↔</Text>
            </View>
            <View style={[styles.partyCard, styles.partyCardB]}>
              <View style={[styles.partyIconCircle, { backgroundColor: T.amber + '20' }]}>
                <Ionicons name="person" size={18} color={T.amber} />
              </View>
              <Text style={[styles.partyRoleLabel, { color: T.amber }]}>Party B — Worker</Text>
              <Text style={styles.partyPersonName}>{agreement.workerName}</Text>
              <Text style={styles.partyCompany}>{agreement.workerSkill}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Job Details */}
        <Animated.View entering={FadeInLeft.delay(120).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>JOB DETAILS</Text>
          <View style={styles.detailsList}>
            <DetailRow icon="briefcase-outline" label="Job Type" value={agreement.jobType} />
            <DetailRow icon="location-outline" label="Location" value={agreement.location} />
            <DetailRow icon="calendar-outline" label="Start Date" value={agreement.startDate} />
            <DetailRow icon="time-outline" label="Duration" value={`${agreement.duration} days`} />
          </View>
        </Animated.View>

        {/* Scope of Work */}
        <Animated.View entering={FadeInLeft.delay(160).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>SCOPE OF WORK</Text>
          {agreement.scopeOfWork.map((item, i) => (
            <View key={i} style={styles.scopeItem}>
              <Text style={styles.scopeNum}>{i + 1}.</Text>
              <Text style={styles.scopeText}>{item}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Payment Terms */}
        <Animated.View entering={FadeInLeft.delay(200).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>PAYMENT TERMS</Text>
          <View style={styles.paymentTable}>
            <View style={styles.payRow}>
              <Text style={styles.payRowLabel}>Daily Rate</Text>
              <Text style={styles.payRowVal}>₹{agreement.dailyRate.toLocaleString('en-IN')}/day</Text>
            </View>
            <View style={styles.payDivider} />
            <View style={styles.payRow}>
              <Text style={styles.payRowLabel}>Duration</Text>
              <Text style={styles.payRowVal}>{agreement.duration} days</Text>
            </View>
            <View style={styles.payDivider} />
            <View style={[styles.payRow, styles.payRowTotal]}>
              <Text style={styles.payTotalLabel}>Total Contract Value</Text>
              <Text style={styles.payTotalVal}>₹{totalValue.toLocaleString('en-IN')}</Text>
            </View>
          </View>
          <View style={styles.escrowBanner}>
            <Ionicons name="lock-closed-outline" size={16} color={T.navy} />
            <Text style={styles.escrowBannerText}>
              Payment held in escrow by BuildMart. Released on satisfactory work completion.
            </Text>
          </View>
        </Animated.View>

        {/* Dispute Resolution */}
        <Animated.View entering={FadeInLeft.delay(240).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>DISPUTE RESOLUTION</Text>
          <Text style={styles.clauseText}>
            Any dispute shall first be resolved via BuildMart's Dispute Resolution system. If unresolved within 14 days, either party may escalate to arbitration. BuildMart's decision on escrow release is final and binding.
          </Text>
        </Animated.View>

        {/* Signatures */}
        <Animated.View entering={FadeInLeft.delay(280).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>DIGITAL SIGNATURES</Text>
          <View style={styles.sigRow}>
            <View style={[styles.sigCard, agreement.contractorSigned ? styles.sigCardSigned : styles.sigCardPending]}>
              <View style={styles.sigCardHeader}>
                <Ionicons name="business-outline" size={15} color={T.navy} />
                <Text style={styles.sigCardRole}>Contractor</Text>
              </View>
              <Text style={styles.sigCardName}>{agreement.contractorName}</Text>
              {agreement.contractorSigned ? (
                <View style={styles.sigStatus}>
                  <Ionicons name="checkmark-circle" size={16} color={T.success} />
                  <Text style={styles.sigStatusSigned}>{agreement.contractorSignDate}</Text>
                </View>
              ) : (
                <Text style={styles.sigStatusPending}>Awaiting...</Text>
              )}
            </View>

            <View style={[styles.sigCard, signed ? styles.sigCardSigned : styles.sigCardPending]}>
              <View style={styles.sigCardHeader}>
                <Ionicons name="person-outline" size={15} color={T.amber} />
                <Text style={[styles.sigCardRole, { color: T.amber }]}>Worker</Text>
              </View>
              <Text style={styles.sigCardName}>{agreement.workerName}</Text>
              {signed ? (
                <View style={styles.sigStatus}>
                  <Ionicons name="checkmark-circle" size={16} color={T.success} />
                  <Text style={styles.sigStatusSigned}>{agreement.workerSignDate || 'Signed'}</Text>
                </View>
              ) : (
                <Text style={styles.sigStatusPending}>Awaiting...</Text>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Timeline */}
        <Animated.View entering={FadeInLeft.delay(320).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>STATUS TIMELINE</Text>
          {timeline.map((ev, i) => (
            <View key={i} style={styles.tlItem}>
              <View style={styles.tlLeft}>
                <View style={[styles.tlDot, ev.done ? styles.tlDotDone : styles.tlDotPending]}>
                  <Ionicons name={ev.icon as any} size={13} color={ev.done ? '#fff' : T.textMuted} />
                </View>
                {i < timeline.length - 1 && (
                  <View style={[styles.tlLine, ev.done ? styles.tlLineDone : {}]} />
                )}
              </View>
              <Text style={[styles.tlLabel, ev.done && styles.tlLabelDone]}>{ev.label}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom bar */}
      {canSign ? (
        <View style={styles.bottomBar}>
          <Pressable
            style={({ pressed }) => [styles.signBtn, pressed && { opacity: 0.85 }]}
            onPress={handleSign}
            disabled={signing}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.signBtnText}>{signing ? 'Signing...' : 'Sign Agreement'}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.bottomBar}>
          <Pressable
            style={({ pressed }) => [styles.dlBarBtn, pressed && { opacity: 0.8 }]}
            onPress={handleDownload}
          >
            <Ionicons name="download-outline" size={20} color={T.navy} />
            <Text style={styles.dlBarBtnText}>Download PDF</Text>
            <View style={styles.csTag}>
              <Text style={styles.csTagText}>Coming Soon</Text>
            </View>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: T.navy },
  dlBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  scroll: { paddingBottom: 24 },

  contractHero: {
    alignItems: 'center', backgroundColor: T.navy,
    paddingVertical: 28, paddingHorizontal: 24, marginBottom: 16,
  },
  contractHeading: { fontSize: 18, fontWeight: '900', color: '#fff', letterSpacing: 2.5, marginBottom: 8 },
  contractId: { fontSize: 14, color: T.amber, fontWeight: '700', marginBottom: 4 },
  contractDate: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 },
  statusPill: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  statusPillText: { fontSize: 13, fontWeight: '800' },

  section: {
    backgroundColor: T.surface, marginHorizontal: 16,
    borderRadius: 16, padding: 18, marginBottom: 14,
    borderWidth: 1, borderColor: T.border,
  },
  sectionTitle: { fontSize: 10, fontWeight: '800', color: T.textMuted, letterSpacing: 1.5, marginBottom: 14 },

  partiesRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  partyCard: { flex: 1, borderRadius: 12, padding: 12, borderWidth: 1 },
  partyCardA: { backgroundColor: T.bg, borderColor: T.border },
  partyCardB: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  partyIconCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center',
    marginBottom: 8, borderWidth: 1, borderColor: T.border,
  },
  partiesVs: { alignItems: 'center' },
  vsText: { fontSize: 22, color: T.textMuted },
  partyRoleLabel: { fontSize: 10, fontWeight: '700', color: T.navy, marginBottom: 3 },
  partyPersonName: { fontSize: 13, fontWeight: '800', color: T.navy, marginBottom: 2 },
  partyCompany: { fontSize: 11, color: T.textSecondary },

  detailsList: { gap: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: T.border,
  },
  detailLabel: { fontSize: 11, color: T.textMuted, marginBottom: 1 },
  detailValue: { fontSize: 14, fontWeight: '700', color: T.navy },

  scopeItem: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  scopeNum: { fontSize: 14, fontWeight: '800', color: T.amber, width: 20 },
  scopeText: { flex: 1, fontSize: 14, color: T.textSecondary, lineHeight: 20 },

  paymentTable: { borderWidth: 1, borderColor: T.border, borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  payDivider: { height: 1, backgroundColor: T.border },
  payRowTotal: { backgroundColor: T.navy },
  payRowLabel: { fontSize: 14, color: T.textSecondary },
  payRowVal: { fontSize: 14, fontWeight: '700', color: T.navy },
  payTotalLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  payTotalVal: { fontSize: 22, fontWeight: '900', color: T.amber },

  escrowBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#BFDBFE',
  },
  escrowBannerText: { flex: 1, fontSize: 12, color: '#1E40AF', lineHeight: 18 },

  clauseText: { fontSize: 13, color: T.textSecondary, lineHeight: 22 },

  sigRow: { flexDirection: 'row', gap: 10 },
  sigCard: { flex: 1, borderRadius: 14, padding: 14, borderWidth: 1.5, borderStyle: 'dashed' },
  sigCardSigned: { borderStyle: 'solid', borderColor: T.success, backgroundColor: '#F0FDF4' },
  sigCardPending: { borderColor: T.border },
  sigCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  sigCardRole: { fontSize: 11, fontWeight: '700', color: T.navy },
  sigCardName: { fontSize: 13, fontWeight: '800', color: T.navy, marginBottom: 8 },
  sigStatus: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sigStatusSigned: { fontSize: 11, color: T.success, fontWeight: '600' },
  sigStatusPending: { fontSize: 11, color: T.textMuted, fontStyle: 'italic' },

  tlItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 0 },
  tlLeft: { alignItems: 'center', width: 32 },
  tlDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tlDotDone: { backgroundColor: T.navy },
  tlDotPending: { backgroundColor: T.bg, borderWidth: 1, borderColor: T.border },
  tlLine: { width: 2, height: 28, backgroundColor: T.border, marginTop: 2 },
  tlLineDone: { backgroundColor: T.navy },
  tlLabel: { fontSize: 14, color: T.textMuted, paddingTop: 7, marginBottom: 20 },
  tlLabelDone: { color: T.navy, fontWeight: '600' },

  bottomBar: {
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: T.surface, borderTopWidth: 1, borderTopColor: T.border,
  },
  signBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.navy, paddingVertical: 16, borderRadius: 14, gap: 10,
  },
  signBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  dlBarBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.bg, paddingVertical: 16, borderRadius: 14, gap: 10,
    borderWidth: 1, borderColor: T.border,
  },
  dlBarBtnText: { fontSize: 15, fontWeight: '600', color: T.navy },
  csTag: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  csTagText: { fontSize: 10, fontWeight: '700', color: '#3B82F6' },
});
