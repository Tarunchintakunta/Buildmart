import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { useWalletStore } from '../../../src/store/useStore';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

const TRANSACTION_TABS = ['All', 'Credits', 'Debits', 'Held'];

const MOCK_TRANSACTIONS = [
  {
    id: 't1',
    type: 'payment',
    amount: 5460,
    description: 'Payment for Order ORD-2024-0001',
    referenceType: 'order',
    status: 'completed',
    date: '2024-02-10',
    isCredit: false,
  },
  {
    id: 't2',
    type: 'hold',
    amount: 30000,
    description: 'Payment held for Order ORD-2024-0002',
    referenceType: 'order',
    status: 'held',
    date: '2024-02-15',
    isCredit: false,
  },
  {
    id: 't3',
    type: 'hold',
    amount: 50000,
    description: 'Escrow for Agreement AGR-2024-001',
    referenceType: 'agreement',
    status: 'held',
    date: '2024-01-15',
    isCredit: false,
  },
  {
    id: 't4',
    type: 'deposit',
    amount: 100000,
    description: 'Wallet top-up via UPI',
    referenceType: 'wallet',
    status: 'completed',
    date: '2024-02-01',
    isCredit: true,
  },
  {
    id: 't5',
    type: 'release',
    amount: 36000,
    description: 'Payment released for Agreement AGR-2024-002',
    referenceType: 'agreement',
    status: 'completed',
    date: '2024-02-05',
    isCredit: true,
  },
  {
    id: 't6',
    type: 'payment',
    amount: 15000,
    description: 'Payment for Order ORD-2024-0006',
    referenceType: 'order',
    status: 'completed',
    date: '2024-01-28',
    isCredit: false,
  },
];

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'deposit':
      return { icon: 'arrow-down-circle', color: '#22C55E' };
    case 'withdrawal':
      return { icon: 'arrow-up-circle', color: '#EF4444' };
    case 'payment':
      return { icon: 'cart', color: '#3B82F6' };
    case 'hold':
      return { icon: 'lock-closed', color: '#EAB308' };
    case 'release':
      return { icon: 'lock-open', color: '#22C55E' };
    case 'refund':
      return { icon: 'refresh', color: '#8B5CF6' };
    default:
      return { icon: 'help-circle', color: '#6B7280' };
  }
};

export default function WalletScreen() {
  const { user } = useAuth();
  const wallet = useWalletStore((state) => state.wallet);
  const [selectedTab, setSelectedTab] = useState('All');

  // Mock wallet data based on role
  const getMockWalletData = () => {
    switch (user?.role) {
      case 'customer':
        return { balance: 25000, held: 0, earned: 0, spent: 5000 };
      case 'contractor':
        return { balance: 500000, held: 50000, earned: 0, spent: 200000 };
      case 'worker':
        return { balance: 12000, held: 0, earned: 72000, spent: 0 };
      case 'shopkeeper':
        return { balance: 150000, held: 0, earned: 500000, spent: 350000 };
      case 'driver':
        return { balance: 8000, held: 0, earned: 50000, spent: 0 };
      default:
        return { balance: 0, held: 0, earned: 0, spent: 0 };
    }
  };

  const walletData = wallet || getMockWalletData();
  const balance = typeof walletData === 'object' && 'balance' in walletData
    ? walletData.balance
    : getMockWalletData().balance;
  const heldBalance = typeof walletData === 'object' && 'held_balance' in walletData
    ? walletData.held_balance
    : getMockWalletData().held;
  const totalEarned = typeof walletData === 'object' && 'total_earned' in walletData
    ? walletData.total_earned
    : getMockWalletData().earned;
  const totalSpent = typeof walletData === 'object' && 'total_spent' in walletData
    ? walletData.total_spent
    : getMockWalletData().spent;

  const isEarner = ['worker', 'shopkeeper', 'driver'].includes(user?.role || '');

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    if (selectedTab === 'All') return true;
    if (selectedTab === 'Credits') return tx.isCredit;
    if (selectedTab === 'Debits') return !tx.isCredit && tx.status !== 'held';
    if (selectedTab === 'Held') return tx.status === 'held';
    return true;
  });

  const renderTransaction = ({ item: tx }: { item: typeof MOCK_TRANSACTIONS[0] }) => {
    const iconInfo = getTransactionIcon(tx.type);
    const isLast = filteredTransactions[filteredTransactions.length - 1]?.id === tx.id;

    return (
      <View style={[s.txRow, !isLast && s.txRowBorder]}>
        <View
          style={[s.txIconWrap, { backgroundColor: `${iconInfo.color}20` }]}
        >
          <Ionicons name={iconInfo.icon as any} size={24} color={iconInfo.color} />
        </View>

        <View style={s.txContent}>
          <Text style={s.txDescription} numberOfLines={1}>
            {tx.description}
          </Text>
          <View style={s.txMeta}>
            <Text style={s.txDate}>{tx.date}</Text>
            {tx.status === 'held' && (
              <View style={s.heldBadge}>
                <Text style={s.heldBadgeText}>Held</Text>
              </View>
            )}
          </View>
        </View>

        <Text
          style={[
            s.txAmount,
            {
              color: tx.isCredit
                ? T.success
                : tx.status === 'held'
                  ? T.amber
                  : T.text,
            },
          ]}
        >
          {tx.isCredit ? '+' : '-'}₹{tx.amount.toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Wallet</Text>
        </View>

        {/* Balance Card */}
        <View style={s.sectionPad}>
          <View style={s.balanceCard}>
            <Text style={s.balanceLabel}>Available Balance</Text>
            <Text style={s.balanceAmount}>
              ₹{balance.toLocaleString()}
            </Text>

            {heldBalance > 0 && (
              <View style={s.escrowBadge}>
                <Ionicons name="lock-closed" size={16} color={T.amber} />
                <Text style={s.escrowText}>
                  ₹{heldBalance.toLocaleString()} held in escrow
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={s.actionRow}>
              <TouchableOpacity style={s.actionBtn}>
                <Ionicons name="add" size={22} color="#FFFFFF" />
                <Text style={s.actionBtnText}>Add Money</Text>
              </TouchableOpacity>
              {isEarner && (
                <TouchableOpacity style={[s.actionBtn, { marginLeft: 12 }]}>
                  <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
                  <Text style={s.actionBtnText}>Withdraw</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <View style={s.statHeader}>
              <Ionicons
                name={isEarner ? 'trending-up' : 'cart'}
                size={22}
                color={isEarner ? T.success : T.info}
              />
              <Text style={s.statLabel}>
                {isEarner ? 'Total Earned' : 'Total Spent'}
              </Text>
            </View>
            <Text
              style={[s.statValue, { color: isEarner ? T.success : T.text }]}
            >
              ₹{(isEarner ? totalEarned : totalSpent).toLocaleString()}
            </Text>
          </View>

          {heldBalance > 0 && (
            <View style={[s.statCard, { marginLeft: 12 }]}>
              <View style={s.statHeader}>
                <Ionicons name="lock-closed" size={22} color={T.amber} />
                <Text style={s.statLabel}>In Escrow</Text>
              </View>
              <Text style={[s.statValue, { color: T.amber }]}>
                ₹{heldBalance.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Transaction Tabs */}
        <View style={s.tabsRow}>
          {TRANSACTION_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                s.tab,
                {
                  backgroundColor: selectedTab === tab ? T.navy : T.bg,
                },
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  s.tabText,
                  {
                    color: selectedTab === tab ? '#FFFFFF' : T.textSecondary,
                  },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions List */}
        <View style={s.txSection}>
          <Text style={s.txSectionTitle}>Recent Transactions</Text>
          <View style={s.txListContainer}>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <View key={tx.id}>
                  {renderTransaction({ item: tx })}
                </View>
              ))
            ) : (
              <View style={s.emptyState}>
                <Ionicons name="receipt" size={48} color={T.textMuted} />
                <Text style={s.emptyText}>No transactions found</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  safeArea: {
    flex: 1,
    backgroundColor: T.bg,
  } as const,

  scroll: {
    flex: 1,
  } as const,

  /* Header */
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  } as const,

  headerTitle: {
    fontSize: 30,
    fontWeight: '700' as const,
    color: T.text,
  },

  /* Balance Card */
  sectionPad: {
    paddingHorizontal: 16,
    marginTop: 16,
  } as const,

  balanceCard: {
    borderRadius: 16,
    padding: 24,
    backgroundColor: T.navy,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  } as const,

  balanceLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },

  balanceAmount: {
    fontSize: 42,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },

  escrowBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 12,
    backgroundColor: 'rgba(242,150,13,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  escrowText: {
    color: T.amber,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500' as const,
  },

  actionRow: {
    flexDirection: 'row' as const,
    marginTop: 24,
  },

  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700' as const,
    marginLeft: 8,
    fontSize: 15,
  },

  /* Stats Cards */
  statsRow: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    marginTop: 16,
  },

  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
  } as const,

  statHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },

  statLabel: {
    color: T.textSecondary,
    marginLeft: 8,
    fontWeight: '500' as const,
    fontSize: 14,
  },

  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
  },

  /* Transaction Tabs */
  tabsRow: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  } as const,

  tabText: {
    textAlign: 'center' as const,
    fontWeight: '500' as const,
    fontSize: 14,
  },

  /* Transaction List */
  txSection: {
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 32,
  } as const,

  txSectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: T.text,
    marginBottom: 12,
  },

  txListContainer: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 16,
  } as const,

  txRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 16,
  },

  txRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  } as const,

  txIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  txContent: {
    flex: 1,
    marginLeft: 16,
  } as const,

  txDescription: {
    color: T.text,
    fontWeight: '500' as const,
    fontSize: 15,
  },

  txMeta: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 4,
  },

  txDate: {
    color: T.textMuted,
    fontSize: 13,
  },

  heldBadge: {
    marginLeft: 8,
    backgroundColor: 'rgba(242,150,13,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  heldBadgeText: {
    color: T.amber,
    fontSize: 11,
    fontWeight: '600' as const,
  },

  txAmount: {
    fontWeight: '700' as const,
    fontSize: 17,
  },

  /* Empty State */
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center' as const,
  },

  emptyText: {
    color: T.textSecondary,
    marginTop: 16,
    fontSize: 15,
  },
};
