import apiClient from './client';
import { Notification, PaginatedResponse } from '../types';

export const notificationsApi = {
  // Spec-aligned methods
  list: () => apiClient.get<PaginatedResponse<Notification>>('/notifications'),

  markRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),

  markAllRead: () => apiClient.patch('/notifications/read-all'),

  // Extended helpers
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Notification>> => {
    const response = await apiClient.get<PaginatedResponse<Notification>>('/notifications', {
      params,
    });
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return response.data.count;
  },
};
