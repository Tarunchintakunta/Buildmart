import apiClient from './client';
import { LoginResponse, User } from '../types';

export const authApi = {
  login: async (phone: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', { phone });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data.user;
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data.user;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<{ user: User }>('/auth/profile', data);
    return response.data.user;
  },
};
