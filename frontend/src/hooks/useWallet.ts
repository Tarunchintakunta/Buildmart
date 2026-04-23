import { useState, useEffect, useCallback } from 'react';
import { walletApi } from '../api/wallet.api';
import { Wallet, Transaction, PaginatedResponse } from '../types';

interface UseWalletReturn {
  wallet: Wallet | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  deposit: (amount: number, description?: string) => Promise<void>;
  addMoney: (amount: number) => Promise<void>;
}

export const useWallet = (): UseWalletReturn => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [walletRes, txRes] = await Promise.all([
        walletApi.get(),
        walletApi.transactions(),
      ]);

      // Handle both { wallet: Wallet } and Wallet shapes
      const walletPayload = walletRes.data as { wallet?: Wallet } | Wallet;
      if (walletPayload && typeof walletPayload === 'object' && 'wallet' in walletPayload && walletPayload.wallet) {
        setWallet(walletPayload.wallet);
      } else {
        setWallet(walletPayload as Wallet);
      }

      const txPayload = txRes.data as PaginatedResponse<Transaction> | Transaction[];
      if (Array.isArray(txPayload)) {
        setTransactions(txPayload);
      } else if (txPayload && 'data' in txPayload) {
        setTransactions((txPayload as PaginatedResponse<Transaction>).data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load wallet';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deposit = useCallback(
    async (amount: number, description?: string) => {
      setError(null);
      try {
        await walletApi.deposit(amount, description);
        await refetch();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Deposit failed';
        setError(message);
        throw err;
      }
    },
    [refetch]
  );

  // Legacy alias kept for backward compatibility
  const addMoney = useCallback(
    async (amount: number) => {
      await deposit(amount);
    },
    [deposit]
  );

  return {
    wallet,
    transactions,
    isLoading,
    error,
    refetch,
    refresh: refetch,
    deposit,
    addMoney,
  };
};
