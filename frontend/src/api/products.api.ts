import apiClient from './client';
import { Product, Category, Inventory, InventoryWithProduct, PaginatedResponse } from '../types';

export interface AddInventoryDto {
  product_id: string;
  price: number;
  stock_quantity: number;
  min_order_quantity?: number;
  max_order_quantity?: number;
  is_available?: boolean;
}

export const productsApi = {
  // Spec-aligned methods
  list: (params?: { category_id?: string; search?: string }) =>
    apiClient.get<PaginatedResponse<Product>>('/products', { params }),

  get: (id: string) => apiClient.get<{ product: Product }>(`/products/${id}`),

  inventory: (params?: { shop_id?: string; category_id?: string; search?: string }) =>
    apiClient.get<{ inventory: InventoryWithProduct[] }>('/inventory', { params }),

  addInventory: (data: AddInventoryDto) =>
    apiClient.post<{ inventory: Inventory }>('/inventory', data),

  updateInventory: (id: string, data: Partial<AddInventoryDto>) =>
    apiClient.patch<{ inventory: Inventory }>(`/inventory/${id}`, data),

  deleteInventory: (id: string) => apiClient.delete(`/inventory/${id}`),

  // Extended helpers
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<{ categories: Category[] }>('/products/categories');
    return response.data.categories;
  },

  getProducts: async (params?: {
    category_id?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  getProductById: async (productId: string): Promise<Product> => {
    const response = await apiClient.get<{ product: Product }>(`/products/${productId}`);
    return response.data.product;
  },

  getShopInventory: async (
    shopId: string,
    params?: { search?: string; category_id?: string }
  ): Promise<InventoryWithProduct[]> => {
    // Backend serves inventory via /inventory?shop_id=...
    const response = await apiClient.get<{ inventory: InventoryWithProduct[] }>('/inventory', {
      params: { shop_id: shopId, ...params },
    });
    return response.data.inventory ?? [];
  },

  getMyInventory: async (): Promise<InventoryWithProduct[]> => {
    // Shopkeeper's inventory — backend fetches by JWT shop owner
    const response = await apiClient.get<{ inventory: InventoryWithProduct[] }>('/inventory');
    return response.data.inventory ?? [];
  },

  createInventoryItem: async (data: AddInventoryDto): Promise<Inventory> => {
    const response = await apiClient.post<{ inventory: Inventory }>('/inventory', data);
    return response.data.inventory;
  },

  updateInventoryItem: async (
    inventoryId: string,
    data: Partial<AddInventoryDto>
  ): Promise<Inventory> => {
    const response = await apiClient.patch<{ inventory: Inventory }>(
      `/inventory/${inventoryId}`,
      data
    );
    return response.data.inventory;
  },

  deleteInventoryItem: async (inventoryId: string): Promise<void> => {
    await apiClient.delete(`/inventory/${inventoryId}`);
  },
};
