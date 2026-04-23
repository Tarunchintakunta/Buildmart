import apiClient from './client';
import { User, Verification, PaginatedResponse } from '../types';

export interface AdminDashboardData {
  total_users: number;
  total_orders: number;
  total_revenue: number;
  pending_verifications: number;
  active_workers: number;
  active_shops: number;
}

export const adminApi = {
  // Spec-aligned methods
  dashboard: () => apiClient.get<AdminDashboardData>('/admin/dashboard'),

  users: (params?: { role?: string; page?: number }) =>
    apiClient.get<PaginatedResponse<User>>('/admin/users', { params }),

  updateUserStatus: (id: string, isActive: boolean) =>
    apiClient.patch<{ user: User }>(`/admin/users/${id}/status`, { is_active: isActive }),

  verifications: (params?: { status?: string }) =>
    apiClient.get<PaginatedResponse<Verification & { worker?: User }>>(
      '/admin/verifications',
      { params }
    ),

  approveVerification: (id: string) =>
    apiClient.patch<{ verification: Verification }>(`/admin/verifications/${id}/approve`),

  rejectVerification: (id: string, reason: string) =>
    apiClient.patch<{ verification: Verification }>(`/admin/verifications/${id}/reject`, {
      reason,
    }),

  orders: (params?: { status?: string; page?: number }) =>
    apiClient.get('/admin/orders', { params }),

  analytics: (range?: string) => apiClient.get('/admin/analytics', { params: { range } }),

  broadcast: (data: { title: string; message: string; role?: string }) =>
    apiClient.post('/admin/notifications/broadcast', data),

  // Extended helpers
  getPendingVerifications: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Verification & { worker?: User }>> => {
    const response = await apiClient.get<PaginatedResponse<Verification & { worker?: User }>>(
      '/admin/verifications/pending',
      { params }
    );
    return response.data;
  },

  approveVerificationById: async (
    verificationId: string,
    notes?: string
  ): Promise<Verification> => {
    const response = await apiClient.patch<{ verification: Verification }>(
      `/admin/verifications/${verificationId}/approve`,
      { notes }
    );
    return response.data.verification;
  },

  rejectVerificationById: async (
    verificationId: string,
    reason: string
  ): Promise<Verification> => {
    const response = await apiClient.patch<{ verification: Verification }>(
      `/admin/verifications/${verificationId}/reject`,
      { reason }
    );
    return response.data.verification;
  },

  getAllUsers: async (params?: {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/admin/users', { params });
    return response.data;
  },

  deactivateUser: async (userId: string): Promise<User> => {
    const response = await apiClient.patch<{ user: User }>(
      `/admin/users/${userId}/deactivate`
    );
    return response.data.user;
  },

  activateUser: async (userId: string): Promise<User> => {
    const response = await apiClient.patch<{ user: User }>(`/admin/users/${userId}/activate`);
    return response.data.user;
  },

  getAnalytics: async (): Promise<AdminDashboardData> => {
    const response = await apiClient.get<AdminDashboardData>('/admin/analytics');
    return response.data;
  },
};
