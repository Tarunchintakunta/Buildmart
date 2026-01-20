// =============================================
// WALLET BUSINESS LOGIC HOOK
// Handles wallet operations with escrow system
// =============================================

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useWalletStore } from '../store/useStore';
import { walletOperations } from '../services/mockData';
import { Transaction } from '../types/database';

interface UseWalletLogicReturn {
  isProcessing: boolean;
  holdFundsForOrder: (orderId: string, amount: number) => Promise<boolean>;
  holdFundsForAgreement: (agreementId: string, amount: number) => Promise<boolean>;
  releaseFunds: (transactionId: string, toUserId: string) => Promise<boolean>;
  refundFunds: (transactionId: string) => Promise<boolean>;
  checkBalance: (amount: number) => boolean;
}

export const useWalletLogic = (): UseWalletLogicReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { wallet, holdFunds: storeHoldFunds, releaseFunds: storeReleaseFunds, updateBalance } = useWalletStore();

  /**
   * Check if wallet has sufficient balance
   */
  const checkBalance = useCallback(
    (amount: number): boolean => {
      if (!wallet) return false;
      return wallet.balance >= amount;
    },
    [wallet]
  );

  /**
   * Hold funds for an order (escrow)
   */
  const holdFundsForOrder = useCallback(
    async (orderId: string, amount: number): Promise<boolean> => {
      if (!wallet) {
        Alert.alert('Error', 'Wallet not initialized');
        return false;
      }

      if (!checkBalance(amount)) {
        Alert.alert(
          'Insufficient Balance',
          `You need ₹${amount.toLocaleString()} but have ₹${wallet.balance.toLocaleString()} in your wallet.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Add Funds', onPress: () => {} },
          ]
        );
        return false;
      }

      setIsProcessing(true);
      try {
        const transaction = await walletOperations.holdFunds(wallet.id, amount, 'order', orderId);
        storeHoldFunds(amount);
        console.log('Funds held for order:', transaction);
        return true;
      } catch (error) {
        console.error('Failed to hold funds:', error);
        Alert.alert('Error', 'Failed to process payment. Please try again.');
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [wallet, checkBalance, storeHoldFunds]
  );

  /**
   * Hold funds for an agreement (escrow)
   * For long-term agreements, typically hold first week/month payment
   */
  const holdFundsForAgreement = useCallback(
    async (agreementId: string, amount: number): Promise<boolean> => {
      if (!wallet) {
        Alert.alert('Error', 'Wallet not initialized');
        return false;
      }

      if (!checkBalance(amount)) {
        Alert.alert(
          'Insufficient Balance',
          `You need ₹${amount.toLocaleString()} for this agreement. Your balance is ₹${wallet.balance.toLocaleString()}.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Add Funds', onPress: () => {} },
          ]
        );
        return false;
      }

      setIsProcessing(true);
      try {
        const transaction = await walletOperations.holdFunds(wallet.id, amount, 'agreement', agreementId);
        storeHoldFunds(amount);
        console.log('Funds held for agreement:', transaction);
        return true;
      } catch (error) {
        console.error('Failed to hold funds for agreement:', error);
        Alert.alert('Error', 'Failed to process escrow. Please try again.');
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [wallet, checkBalance, storeHoldFunds]
  );

  /**
   * Release held funds to recipient (on completion)
   */
  const releaseFunds = useCallback(
    async (transactionId: string, toUserId: string): Promise<boolean> => {
      setIsProcessing(true);
      try {
        const transaction = await walletOperations.releaseFunds(transactionId);
        storeReleaseFunds(transaction.amount);
        console.log('Funds released:', transaction);
        return true;
      } catch (error) {
        console.error('Failed to release funds:', error);
        Alert.alert('Error', 'Failed to release funds. Please contact support.');
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [storeReleaseFunds]
  );

  /**
   * Refund held funds back to sender (on cancellation)
   */
  const refundFunds = useCallback(
    async (transactionId: string): Promise<boolean> => {
      if (!wallet) return false;

      setIsProcessing(true);
      try {
        const transaction = await walletOperations.releaseFunds(transactionId);
        // Refund to balance
        storeReleaseFunds(transaction.amount);
        updateBalance(transaction.amount);
        console.log('Funds refunded:', transaction);
        return true;
      } catch (error) {
        console.error('Failed to refund:', error);
        Alert.alert('Error', 'Failed to process refund. Please contact support.');
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [wallet, storeReleaseFunds, updateBalance]
  );

  return {
    isProcessing,
    holdFundsForOrder,
    holdFundsForAgreement,
    releaseFunds,
    refundFunds,
    checkBalance,
  };
};

// =============================================
// WORKER STATUS TOGGLE LOGIC
// =============================================

export const useWorkerStatusLogic = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleStatus = useCallback(async (currentStatus: 'working' | 'waiting'): Promise<'working' | 'waiting'> => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newStatus = currentStatus === 'working' ? 'waiting' : 'working';
      return newStatus;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return { isUpdating, toggleStatus };
};

// =============================================
// CONCIERGE (HYBRID FULFILLMENT) LOGIC
// =============================================

export const useConciergeLogic = () => {
  const [isChecking, setIsChecking] = useState(false);

  /**
   * Check if item is available and find alternatives if not
   */
  const checkAndFindAlternative = useCallback(
    async (
      shopId: string,
      productId: string,
      quantity: number
    ): Promise<{
      available: boolean;
      alternateShop?: { shopId: string; shopName: string; price: number };
    }> => {
      setIsChecking(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock: 30% chance item is out of stock
        const available = Math.random() > 0.3;

        if (!available) {
          // Find alternate shop
          return {
            available: false,
            alternateShop: {
              shopId: 'alt-shop-1',
              shopName: 'Sri Lakshmi Traders',
              price: 375,
            },
          };
        }

        return { available: true };
      } finally {
        setIsChecking(false);
      }
    },
    []
  );

  return { isChecking, checkAndFindAlternative };
};
