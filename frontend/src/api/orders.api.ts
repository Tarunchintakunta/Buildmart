import apiClient from './client';
import { Order, OrderWithDetails, PaginatedResponse } from '../types';

export interface CreateOrderDto {
  shop_id: string;
  delivery_address: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  delivery_notes?: string;
  items: { inventory_id: string; quantity: number }[];
}

export const ordersApi = {
  // Spec-aligned methods
  create: (data: CreateOrderDto) =>
    apiClient.post<{ order: OrderWithDetails }>('/orders', data),

  list: (params?: { status?: string; page?: number }) =>
    apiClient.get<PaginatedResponse<OrderWithDetails>>('/orders', { params }),

  get: (id: string) => apiClient.get<{ order: OrderWithDetails }>(`/orders/${id}`),

  updateStatus: (id: string, status: string, reason?: string) =>
    apiClient.patch<{ order: Order }>(`/orders/${id}/status`, { status, reason }),

  getTracking: (id: string) => apiClient.get(`/orders/${id}/tracking`),

  // Extended helpers — all use correct backend endpoints
  getMyOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<OrderWithDetails>> => {
    // Backend filters by role automatically from JWT — no /my suffix needed
    const response = await apiClient.get<PaginatedResponse<OrderWithDetails>>('/orders', { params });
    return response.data;
  },

  getOrderById: async (orderId: string): Promise<OrderWithDetails> => {
    const response = await apiClient.get<{ order: OrderWithDetails }>(`/orders/${orderId}`);
    return response.data.order;
  },

  createOrder: async (data: CreateOrderDto): Promise<OrderWithDetails> => {
    const response = await apiClient.post<{ order: OrderWithDetails }>('/orders', data);
    return response.data.order;
  },

  cancelOrder: async (orderId: string, reason?: string): Promise<Order> => {
    // Use PATCH /orders/:id/status with cancelled status
    const response = await apiClient.patch<{ order: Order }>(`/orders/${orderId}/status`, {
      status: 'cancelled',
      reason,
    });
    return response.data.order;
  },

  acceptOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.patch<{ order: Order }>(`/orders/${orderId}/status`, {
      status: 'accepted',
    });
    return response.data.order;
  },

  getShopOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<OrderWithDetails>> => {
    // Backend filters by shopkeeper role from JWT automatically
    const response = await apiClient.get<PaginatedResponse<OrderWithDetails>>('/orders', { params });
    return response.data;
  },
};
