import apiClient from './client';
import { Wallet, Transaction, PaginatedResponse } from '../types';

export const walletApi = {
  // Spec-aligned methods
  get: () => apiClient.get<{ wallet: Wallet }>('/wallet'),

  transactions: (params?: { type?: string; page?: number }) =>
    apiClient.get<PaginatedResponse<Transaction>>('/wallet/transactions', { params }),

  deposit: (amount: number, description?: string) =>
    apiClient.post<{ transaction: Transaction }>('/wallet/deposit', { amount, description }),

  // Extended helpers
  getMyWallet: async (): Promise<Wallet> => {
    const response = await apiClient.get<{ wallet: Wallet }>('/wallet');
    return response.data.wallet;
  },

  getTransactions: async (params?: {
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>(
      '/wallet/transactions',
      { params }
    );
    return response.data;
  },

  addMoney: async (amount: number, payment_method?: string): Promise<Transaction> => {
    const response = await apiClient.post<{ transaction: Transaction }>('/wallet/deposit', {
      amount,
      payment_method,
    });
    return response.data.transaction;
  },

  withdraw: async (amount: number, bank_account?: string): Promise<Transaction> => {
    // Withdraw uses deposit endpoint with negative — actual payout after funding
    // For now, logs a withdrawal transaction
    const response = await apiClient.post<{ transaction: Transaction }>('/wallet/withdraw', {
      amount,
      bank_account,
    });
    return response.data.transaction;
  },
};
