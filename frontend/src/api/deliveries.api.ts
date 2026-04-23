import apiClient from './client';
import { DriverProfile, OrderWithDetails, PaginatedResponse } from '../types';

export const deliveriesApi = {
  // Spec-aligned methods
  list: (params?: { status?: string }) =>
    apiClient.get<PaginatedResponse<OrderWithDetails>>('/deliveries', { params }),

  accept: (orderId: string) =>
    apiClient.patch<{ order: OrderWithDetails }>(`/deliveries/${orderId}/accept`),

  pickup: (orderId: string, qrCode: string) =>
    apiClient.patch<{ order: OrderWithDetails }>(`/deliveries/${orderId}/pickup`, {
      qr_code: qrCode,
    }),

  deliver: (orderId: string, proofPhotoUrl: string) =>
    apiClient.patch<{ order: OrderWithDetails }>(`/deliveries/${orderId}/deliver`, {
      proof_photo_url: proofPhotoUrl,
    }),

  updateLocation: (latitude: number, longitude: number) =>
    apiClient.patch('/deliveries/location', { latitude, longitude }),

  // Extended helpers — all use correct backend endpoints
  getMyDeliveries: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<OrderWithDetails>> => {
    // Backend filters by driver JWT automatically — no /my suffix
    const response = await apiClient.get<PaginatedResponse<OrderWithDetails>>('/deliveries', { params });
    return response.data;
  },

  getAvailableDeliveries: async (): Promise<OrderWithDetails[]> => {
    const response = await apiClient.get<PaginatedResponse<OrderWithDetails>>('/deliveries', {
      params: { status: 'pending' },
    });
    return response.data.data ?? [];
  },

  acceptDelivery: async (orderId: string): Promise<OrderWithDetails> => {
    const response = await apiClient.patch<{ order: OrderWithDetails }>(`/deliveries/${orderId}/accept`);
    return response.data.order;
  },

  markPickedUp: async (orderId: string): Promise<OrderWithDetails> => {
    const response = await apiClient.patch<{ order: OrderWithDetails }>(`/deliveries/${orderId}/pickup`, {
      qr_code: 'manual',
    });
    return response.data.order;
  },

  markDelivered: async (orderId: string, proof_url?: string): Promise<OrderWithDetails> => {
    const response = await apiClient.patch<{ order: OrderWithDetails }>(`/deliveries/${orderId}/deliver`, {
      proof_photo_url: proof_url ?? '',
    });
    return response.data.order;
  },

  updateDriverLocation: async (lat: number, lng: number): Promise<void> => {
    // Backend uses /deliveries/location (no /my/)
    await apiClient.patch('/deliveries/location', { latitude: lat, longitude: lng });
  },

  getDriverProfile: async (): Promise<DriverProfile> => {
    // Get user profile via users route
    const response = await apiClient.get<{ user: DriverProfile }>('/auth/me');
    return response.data.user as unknown as DriverProfile;
  },

  toggleAvailability: async (isAvailable: boolean): Promise<DriverProfile> => {
    const response = await apiClient.patch<{ profile: DriverProfile }>('/deliveries/availability', {
      is_available: isAvailable,
    });
    return response.data.profile;
  },
};
