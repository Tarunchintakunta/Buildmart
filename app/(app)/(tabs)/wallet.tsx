import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { useWalletStore } from '../../../src/store/useStore';

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

    return (
      <View className="flex-row items-center py-4 border-b border-gray-700">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: `${iconInfo.color}20` }}
        >
          <Ionicons name={iconInfo.icon as any} size={24} color={iconInfo.color} />
        </View>

        <View className="flex-1 ml-4">
          <Text className="text-white font-medium" numberOfLines={1}>
            {tx.description}
          </Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-gray-500 text-sm">{tx.date}</Text>
            {tx.status === 'held' && (
              <View className="ml-2 bg-yellow-500/20 px-2 py-0.5 rounded">
                <Text className="text-yellow-500 text-xs">Held</Text>
              </View>
            )}
          </View>
        </View>

        <Text
          className={`font-bold text-lg ${
            tx.isCredit ? 'text-green-500' : tx.status === 'held' ? 'text-yellow-500' : 'text-white'
          }`}
        >
          {tx.isCredit ? '+' : '-'}₹{tx.amount.toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-3 border-b border-gray-800">
          <Text className="text-white text-2xl font-bold">Wallet</Text>
        </View>

        {/* Balance Card */}
        <View className="px-4 mt-4">
          <View className="bg-orange-500 rounded-2xl p-6">
            <Text className="text-orange-100 text-sm">Available Balance</Text>
            <Text className="text-white text-4xl font-bold mt-2">
              ₹{balance.toLocaleString()}
            </Text>

            {heldBalance > 0 && (
              <View className="flex-row items-center mt-3 bg-white/10 px-3 py-2 rounded-lg">
                <Ionicons name="lock-closed" size={16} color="white" />
                <Text className="text-white/80 ml-2">
                  ₹{heldBalance.toLocaleString()} held in escrow
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row mt-6 space-x-3">
              <TouchableOpacity className="flex-1 bg-white/20 py-3 rounded-xl flex-row items-center justify-center">
                <Ionicons name="add" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Add Money</Text>
              </TouchableOpacity>
              {isEarner && (
                <TouchableOpacity className="flex-1 bg-white/20 py-3 rounded-xl flex-row items-center justify-center">
                  <Ionicons name="arrow-up" size={20} color="white" />
                  <Text className="text-white font-semibold ml-2">Withdraw</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row px-4 mt-4 space-x-3">
          <View className="flex-1 bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center">
              <Ionicons
                name={isEarner ? 'trending-up' : 'cart'}
                size={20}
                color={isEarner ? '#22C55E' : '#3B82F6'}
              />
              <Text className="text-gray-400 ml-2">
                {isEarner ? 'Total Earned' : 'Total Spent'}
              </Text>
            </View>
            <Text className={`text-xl font-bold mt-2 ${isEarner ? 'text-green-500' : 'text-white'}`}>
              ₹{(isEarner ? totalEarned : totalSpent).toLocaleString()}
            </Text>
          </View>

          {heldBalance > 0 && (
            <View className="flex-1 bg-gray-800 rounded-xl p-4">
              <View className="flex-row items-center">
                <Ionicons name="lock-closed" size={20} color="#EAB308" />
                <Text className="text-gray-400 ml-2">In Escrow</Text>
              </View>
              <Text className="text-yellow-500 text-xl font-bold mt-2">
                ₹{heldBalance.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Transaction Tabs */}
        <View className="flex-row px-4 mt-6">
          {TRANSACTION_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`flex-1 py-2 rounded-lg mr-2 ${
                selectedTab === tab ? 'bg-orange-500' : 'bg-gray-800'
              }`}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                className={`text-center font-medium ${
                  selectedTab === tab ? 'text-white' : 'text-gray-400'
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions List */}
        <View className="px-4 mt-4 mb-8">
          <Text className="text-white text-lg font-semibold mb-3">Recent Transactions</Text>
          <View className="bg-gray-800 rounded-xl px-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <View key={tx.id}>
                  {renderTransaction({ item: tx })}
                </View>
              ))
            ) : (
              <View className="py-12 items-center">
                <Ionicons name="receipt" size={48} color="#6B7280" />
                <Text className="text-gray-400 mt-4">No transactions found</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
