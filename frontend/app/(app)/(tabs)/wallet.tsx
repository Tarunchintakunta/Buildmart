import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  SlideInDown,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Colors
const C = {
  navy: '#1A1D2E',
  navyLight: '#252838',
  amber: '#F2960D',
  amberBg: '#FEF3C7',
  bg: '#F5F6FA',
  surface: '#FFFFFF',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  border: '#E5E7EB',
  text: '#1A1D2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  white: '#FFFFFF',
};

const TRANSACTION_TABS = ['All', 'Credits', 'Debits', 'On Hold'] as const;
type TransactionTab = typeof TRANSACTION_TABS[number];

type TxType = 'deposit' | 'payment' | 'hold' | 'release' | 'withdrawal';

interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  description: string;
  date: string;
  status: string;
  isCredit: boolean;
  isHeld: boolean;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    type: 'deposit',
    amount: 20000,
    description: 'Wallet top-up via UPI',
    date: 'Today, 10:30 AM',
    status: 'completed',
    isCredit: true,
    isHeld: false,
  },
  {
    id: 't2',
    type: 'hold',
    amount: 3000,
    description: 'Escrow held for ORD-2024-0041',
    date: 'Today, 09:15 AM',
    status: 'held',
    isCredit: false,
    isHeld: true,
  },
  {
    id: 't3',
    type: 'payment',
    amount: 2450,
    description: 'Payment to Sri Lakshmi Traders',
    date: 'Yesterday, 3:45 PM',
    status: 'completed',
    isCredit: false,
    isHeld: false,
  },
  {
    id: 't4',
    type: 'release',
    amount: 5000,
    description: 'Escrow released – ORD-2024-0039',
    date: 'Yesterday, 11:00 AM',
    status: 'completed',
    isCredit: true,
    isHeld: false,
  },
  {
    id: 't5',
    type: 'withdrawal',
    amount: 10000,
    description: 'Withdrawal to HDFC Bank ••4821',
    date: '22 Apr, 6:00 PM',
    status: 'completed',
    isCredit: false,
    isHeld: false,
  },
  {
    id: 't6',
    type: 'deposit',
    amount: 15000,
    description: 'Wallet top-up via Net Banking',
    date: '21 Apr, 2:30 PM',
    status: 'completed',
    isCredit: true,
    isHeld: false,
  },
  {
    id: 't7',
    type: 'payment',
    amount: 8760,
    description: 'Rajesh Constructions – Cement order',
    date: '20 Apr, 1:15 PM',
    status: 'completed',
    isCredit: false,
    isHeld: false,
  },
  {
    id: 't8',
    type: 'hold',
    amount: 1200,
    description: 'Escrow held for delivery DEL-0021',
    date: '19 Apr, 9:00 AM',
    status: 'held',
    isCredit: false,
    isHeld: true,
  },
  {
    id: 't9',
    type: 'release',
    amount: 3500,
    description: 'Agreement milestone released',
    date: '18 Apr, 4:45 PM',
    status: 'completed',
    isCredit: true,
    isHeld: false,
  },
  {
    id: 't10',
    type: 'deposit',
    amount: 5000,
    description: 'Referral bonus credited',
    date: '17 Apr, 12:00 PM',
    status: 'completed',
    isCredit: true,
    isHeld: false,
  },
];

const ADD_PRESETS = [500, 1000, 2000, 5000];

const BALANCE = 12450;
const HELD = 3000;

function formatINR(amount: number): string {
  return amount.toLocaleString('en-IN');
}

function getTxIcon(type: TxType): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'deposit': return 'arrow-down-circle';
    case 'payment': return 'arrow-up-circle';
    case 'hold': return 'lock-closed';
    case 'release': return 'checkmark-circle';
    case 'withdrawal': return 'exit-outline';
  }
}

function getTxColor(tx: Transaction): string {
  if (tx.isHeld) return C.warning;
  if (tx.isCredit) return C.success;
  return C.error;
}

function useAnimatedBalance(target: number, duration = 900) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf: ReturnType<typeof setInterval>;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    raf = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.floor(eased * target));
      if (step >= steps) {
        clearInterval(raf);
        setDisplayed(target);
      }
    }, interval);

    return () => clearInterval(raf);
  }, [target, duration]);

  return displayed;
}

export default function WalletScreen() {
  const [activeTab, setActiveTab] = useState<TransactionTab>('All');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const animatedBalance = useAnimatedBalance(BALANCE);

  const modalScale = useSharedValue(0.8);
  const modalOpacity = useSharedValue(0);

  const openModal = useCallback(() => {
    setShowAddMoney(true);
    modalScale.value = withSpring(1, { damping: 15 });
    modalOpacity.value = withTiming(1, { duration: 250 });
  }, []);

  const closeModal = useCallback(() => {
    modalScale.value = withTiming(0.8, { duration: 200 });
    modalOpacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => setShowAddMoney(false), 210);
  }, []);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
    opacity: modalOpacity.value,
  }));

  const filteredTx = MOCK_TRANSACTIONS.filter((tx) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Credits') return tx.isCredit && !tx.isHeld;
    if (activeTab === 'Debits') return !tx.isCredit && !tx.isHeld;
    if (activeTab === 'On Hold') return tx.isHeld;
    return true;
  });

  const amountToAdd = showCustom
    ? parseInt(customAmount || '0', 10)
    : selectedPreset ?? 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)} style={styles.headerRow}>
          <Text style={styles.headerTitle}>My Wallet</Text>
          <Pressable style={styles.headerIconBtn}>
            <Ionicons name="help-circle-outline" size={22} color={C.textSecondary} />
          </Pressable>
        </Animated.View>

        {/* Wallet Card */}
        <Animated.View entering={FadeInDown.delay(80).springify().damping(14)} style={styles.walletCard}>
          {/* Background decorative circles */}
          <View style={styles.cardCircle1} />
          <View style={styles.cardCircle2} />

          <View style={styles.cardTopRow}>
            <View>
              <Text style={styles.cardLabel}>Available Balance</Text>
              <Text style={styles.cardBalance}>₹{formatINR(animatedBalance)}</Text>
              {HELD > 0 && (
                <Animated.View entering={ZoomIn.delay(950).duration(300)} style={styles.heldChip}>
                  <Ionicons name="lock-closed" size={11} color={C.navy} />
                  <Text style={styles.heldChipText}>₹{formatINR(HELD)} On Hold</Text>
                </Animated.View>
              )}
            </View>
            <View style={styles.walletIconCircle}>
              <Ionicons name="wallet" size={28} color={C.amber} />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.cardActions}>
            <Pressable
              style={({ pressed }) => [styles.cardBtn, styles.cardBtnPrimary, pressed && styles.cardBtnPressed]}
              onPress={openModal}
            >
              <Ionicons name="add-circle-outline" size={18} color={C.navy} />
              <Text style={styles.cardBtnPrimaryText}>Add Money</Text>
            </Pressable>
            <View style={styles.cardBtnDivider} />
            <Pressable
              style={({ pressed }) => [styles.cardBtn, pressed && styles.cardBtnPressed]}
            >
              <Ionicons name="arrow-up-circle-outline" size={18} color={C.white} />
              <Text style={styles.cardBtnSecondaryText}>Withdraw</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.delay(180).duration(400)} style={styles.statsRow}>
          {[
            { label: 'Total Spent', value: '₹24,210', icon: 'trending-up-outline' as keyof typeof Ionicons.glyphMap, color: C.error },
            { label: 'Total Earned', value: '₹40,000', icon: 'trending-down-outline' as keyof typeof Ionicons.glyphMap, color: C.success },
            { label: 'This Month', value: '10 Txns', icon: 'receipt-outline' as keyof typeof Ionicons.glyphMap, color: C.navy },
          ].map((stat, i) => (
            <Animated.View key={stat.label} entering={ZoomIn.delay(220 + i * 60).duration(350)} style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: stat.color + '18' }]}>
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Transaction Filter Tabs */}
        <Animated.View entering={FadeInDown.delay(260).duration(400)} style={styles.tabRow}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
            {TRANSACTION_TABS.map((tab) => (
              <Pressable
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Transaction List */}
        {filteredTx.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={C.textMuted} />
            <Text style={styles.emptyTitle}>No transactions</Text>
            <Text style={styles.emptySubtitle}>Nothing to show in this category.</Text>
          </Animated.View>
        ) : (
          filteredTx.map((tx, i) => {
            const iconColor = getTxColor(tx);
            const icon = getTxIcon(tx.type);
            const amountStr = tx.isHeld
              ? `₹${formatINR(tx.amount)}`
              : tx.isCredit
              ? `+₹${formatINR(tx.amount)}`
              : `-₹${formatINR(tx.amount)}`;

            return (
              <Animated.View
                key={tx.id}
                entering={FadeInDown.delay(300 + i * 50).duration(350)}
                style={styles.txCard}
              >
                <View style={[styles.txIconBox, { backgroundColor: iconColor + '18' }]}>
                  <Ionicons name={icon} size={22} color={iconColor} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txDescription} numberOfLines={1}>{tx.description}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <View style={styles.txRight}>
                  <Text style={[styles.txAmount, { color: iconColor }]}>{amountStr}</Text>
                  <View style={[styles.txBadge, { backgroundColor: iconColor + '18' }]}>
                    <Text style={[styles.txBadgeText, { color: iconColor }]}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            );
          })
        )}
      </ScrollView>

      {/* Add Money Modal */}
      <Modal visible={showAddMoney} transparent animationType="none" onRequestClose={closeModal}>
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Animated.View
            entering={SlideInDown.springify().damping(16)}
            style={styles.modalSheet}
          >
            <Pressable onPress={() => {}} style={styles.modalSheetInner}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Add Money to Wallet</Text>
              <Text style={styles.modalSubtitle}>Choose amount or enter custom</Text>

              <View style={styles.presetsGrid}>
                {ADD_PRESETS.map((preset) => (
                  <Pressable
                    key={preset}
                    style={({ pressed }) => [
                      styles.presetBtn,
                      selectedPreset === preset && !showCustom && styles.presetBtnActive,
                      pressed && styles.presetBtnPressed,
                    ]}
                    onPress={() => {
                      setSelectedPreset(preset);
                      setShowCustom(false);
                      setCustomAmount('');
                    }}
                  >
                    <Text style={[styles.presetText, selectedPreset === preset && !showCustom && styles.presetTextActive]}>
                      ₹{formatINR(preset)}
                    </Text>
                  </Pressable>
                ))}
                <Pressable
                  style={({ pressed }) => [
                    styles.presetBtn,
                    showCustom && styles.presetBtnActive,
                    pressed && styles.presetBtnPressed,
                  ]}
                  onPress={() => {
                    setShowCustom(true);
                    setSelectedPreset(null);
                  }}
                >
                  <Text style={[styles.presetText, showCustom && styles.presetTextActive]}>Custom</Text>
                </Pressable>
              </View>

              {showCustom && (
                <Animated.View entering={FadeInDown.duration(250)} style={styles.customInputWrapper}>
                  <Text style={styles.rupeePrefix}>₹</Text>
                  <TextInput
                    style={styles.customInput}
                    placeholder="Enter amount"
                    keyboardType="numeric"
                    value={customAmount}
                    onChangeText={setCustomAmount}
                    autoFocus
                    placeholderTextColor={C.textMuted}
                  />
                </Animated.View>
              )}

              {amountToAdd > 0 && (
                <Animated.View entering={FadeInDown.duration(200)} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>You are adding</Text>
                  <Text style={styles.summaryAmount}>₹{formatINR(amountToAdd)}</Text>
                </Animated.View>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.creditBtn,
                  amountToAdd <= 0 && styles.creditBtnDisabled,
                  pressed && styles.creditBtnPressed,
                ]}
                disabled={amountToAdd <= 0}
                onPress={closeModal}
              >
                <Ionicons name="wallet-outline" size={18} color={C.white} />
                <Text style={styles.creditBtnText}>Credit to Wallet</Text>
              </Pressable>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: C.text,
    letterSpacing: -0.5,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletCard: {
    marginHorizontal: 20,
    height: 200,
    backgroundColor: C.navy,
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
    justifyContent: 'space-between',
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  cardCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -60,
    right: -40,
  },
  cardCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(242,150,13,0.12)',
    bottom: -30,
    left: 20,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  cardBalance: {
    fontSize: 36,
    fontWeight: '800',
    color: C.white,
    letterSpacing: -1,
  },
  heldChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.amber,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  heldChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.navy,
  },
  walletIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cardActions: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  cardBtnPrimary: {
    backgroundColor: C.amber,
  },
  cardBtnPressed: {
    opacity: 0.75,
  },
  cardBtnDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  cardBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.navy,
  },
  cardBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.white,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: C.text,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: C.textSecondary,
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  tabRow: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
    marginBottom: 12,
  },
  tabScrollContent: {
    gap: 8,
    paddingBottom: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  tabActive: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
  },
  tabTextActive: {
    color: C.white,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  txIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
    marginRight: 8,
  },
  txDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
    marginBottom: 3,
  },
  txDate: {
    fontSize: 12,
    color: C.textSecondary,
    fontWeight: '400',
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  txBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  txBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: C.textSecondary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: C.textMuted,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalSheetInner: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: C.text,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: C.textSecondary,
    marginBottom: 20,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  presetBtn: {
    width: (SCREEN_WIDTH - 48 - 30) / 3,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: C.bg,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
  },
  presetBtnActive: {
    borderColor: C.navy,
    backgroundColor: C.navy,
  },
  presetBtnPressed: {
    opacity: 0.7,
  },
  presetText: {
    fontSize: 15,
    fontWeight: '600',
    color: C.text,
  },
  presetTextActive: {
    color: C.white,
  },
  customInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.navy,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: C.bg,
  },
  rupeePrefix: {
    fontSize: 20,
    fontWeight: '700',
    color: C.text,
    marginRight: 6,
  },
  customInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: C.text,
    paddingVertical: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.bg,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 13,
    color: C.textSecondary,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: C.success,
  },
  creditBtn: {
    backgroundColor: C.navy,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  creditBtnDisabled: {
    opacity: 0.4,
  },
  creditBtnPressed: {
    opacity: 0.85,
  },
  creditBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.white,
  },
});
