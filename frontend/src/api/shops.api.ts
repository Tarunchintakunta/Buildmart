import apiClient from './client';
import { Shop, PaginatedResponse } from '../types';

export interface CreateShopDto {
  name: string;
  description?: string;
  address: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  opening_time?: string;
  closing_time?: string;
  delivery_radius_km?: number;
}

export const shopsApi = {
  // Spec-aligned methods
  list: (params?: { search?: string; city?: string; page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Shop>>('/shops', { params }),

  get: (id: string) => apiClient.get<{ shop: Shop }>(`/shops/${id}`),

  my: () => apiClient.get<{ shop: Shop }>('/shops/my'),

  create: (data: CreateShopDto) => apiClient.post<{ shop: Shop }>('/shops', data),

  update: (id: string, data: Partial<CreateShopDto>) =>
    apiClient.patch<{ shop: Shop }>(`/shops/${id}`, data),

  // Extended helpers
  getShops: async (params?: { city?: string; search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Shop>> => {
    const response = await apiClient.get<PaginatedResponse<Shop>>('/shops', { params });
    return response.data;
  },

  getShopById: async (shopId: string): Promise<Shop> => {
    const response = await apiClient.get<{ shop: Shop }>(`/shops/${shopId}`);
    return response.data.shop;
  },

  getMyShop: async (): Promise<Shop> => {
    const response = await apiClient.get<{ shop: Shop }>('/shops/my');
    return response.data.shop;
  },

  createShop: async (data: CreateShopDto): Promise<Shop> => {
    const response = await apiClient.post<{ shop: Shop }>('/shops', data);
    return response.data.shop;
  },

  updateShop: async (shopId: string, data: Partial<CreateShopDto>): Promise<Shop> => {
    const response = await apiClient.patch<{ shop: Shop }>(`/shops/${shopId}`, data);
    return response.data.shop;
  },

  getNearbyShops: async (lat: number, lng: number, radius?: number): Promise<Shop[]> => {
    const response = await apiClient.get<{ shops: Shop[] }>('/shops/nearby', {
      params: { lat, lng, radius: radius || 10 },
    });
    return response.data.shops;
  },
};
