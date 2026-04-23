import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme as T } from '../../theme/colors';
import type { UserRole } from '../../types';

export interface WalletCardProps {
  balance: number;
  heldBalance?: number;
  role?: UserRole;
  onAddMoney?: () => void;
  onWithdraw?: () => void;
  style?: ViewStyle;
}

function formatIndian(num: number): string {
  const parts = Math.abs(num).toFixed(0).split('').reverse();
  const groups: string[] = [];
  parts.forEach((d, i) => {
    if (i === 3 || (i > 3 && (i - 3) % 2 === 0)) groups.push(',');
    groups.push(d);
  });
  return '₹' + groups.reverse().join('');
}

function getBalanceLabel(role?: UserRole): string {
  if (role === 'worker' || role === 'driver') return 'Earnings';
  if (role === 'shopkeeper') return 'Revenue';
  return 'Available Balance';
}

export default function WalletCard({
  balance,
  heldBalance = 0,
  role,
  onAddMoney,
  onWithdraw,
  style,
}: WalletCardProps) {
  const balanceLabel = getBalanceLabel(role);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={styles.balanceSection}>
          <Text style={styles.label}>{balanceLabel}</Text>
          <Text style={styles.amount}>{formatIndian(balance)}</Text>
          {heldBalance > 0 ? (
            <View style={styles.heldChip}>
              <Text style={styles.heldText}>{formatIndian(heldBalance)} on hold</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.iconCircle}>
          <Ionicons name="wallet" size={24} color="#fff" />
        </View>
      </View>

      <View style={styles.actions}>
        {onAddMoney ? (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onAddMoney}
            accessibilityRole="button"
            accessibilityLabel="Add money to wallet"
          >
            <Ionicons name="add-circle-outline" size={16} color="#fff" />
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
        ) : null}
        {onWithdraw ? (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onWithdraw}
            accessibilityRole="button"
            accessibilityLabel="Withdraw from wallet"
          >
            <Ionicons name="arrow-down-circle-outline" size={16} color="#fff" />
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.navy,
    borderRadius: 16,
    padding: 20,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  balanceSection: { flex: 1 },
  label: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginBottom: 4 },
  amount: { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  heldChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(242,150,13,0.25)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heldText: { fontSize: 12, color: '#F2960D', fontWeight: '600' },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionText: { fontSize: 13, fontWeight: '600', color: '#fff' },
});
