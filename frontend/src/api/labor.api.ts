import apiClient from './client';
import { LaborRequest, PaginatedResponse, WorkerSkill } from '../types';

export interface CreateLaborDto {
  skill_required: WorkerSkill;
  description?: string;
  work_address: string;
  work_latitude?: number;
  work_longitude?: number;
  scheduled_date: string;
  scheduled_time: string;
  duration_hours: number;
  offered_rate: number;
}

export const laborApi = {
  // Spec-aligned methods
  create: (data: CreateLaborDto) =>
    apiClient.post<{ request: LaborRequest }>('/labor', data),

  list: (params?: { status?: string }) =>
    apiClient.get<PaginatedResponse<LaborRequest>>('/labor', { params }),

  get: (id: string) => apiClient.get<{ request: LaborRequest }>(`/labor/${id}`),

  accept: (id: string) => apiClient.patch<{ request: LaborRequest }>(`/labor/${id}/accept`),

  decline: (id: string) => apiClient.patch<{ request: LaborRequest }>(`/labor/${id}/decline`),

  start: (id: string) => apiClient.patch<{ request: LaborRequest }>(`/labor/${id}/start`),

  complete: (id: string) => apiClient.patch<{ request: LaborRequest }>(`/labor/${id}/complete`),

  rate: (id: string, data: { rating: number; comment?: string }) =>
    apiClient.post<{ request: LaborRequest }>(`/labor/${id}/rate`, data),

  // Extended helpers
  createRequest: async (data: CreateLaborDto): Promise<LaborRequest> => {
    const response = await apiClient.post<{ request: LaborRequest }>('/labor/requests', data);
    return response.data.request;
  },

  getMyRequests: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<LaborRequest>> => {
    const response = await apiClient.get<PaginatedResponse<LaborRequest>>(
      '/labor/requests/my',
      { params }
    );
    return response.data;
  },

  getAvailableJobs: async (params?: {
    skill?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<LaborRequest>> => {
    const response = await apiClient.get<PaginatedResponse<LaborRequest>>(
      '/labor/requests/available',
      { params }
    );
    return response.data;
  },

  acceptJob: async (requestId: string): Promise<LaborRequest> => {
    const response = await apiClient.post<{ request: LaborRequest }>(
      `/labor/requests/${requestId}/accept`
    );
    return response.data.request;
  },

  declineJob: async (requestId: string): Promise<LaborRequest> => {
    const response = await apiClient.post<{ request: LaborRequest }>(
      `/labor/requests/${requestId}/decline`
    );
    return response.data.request;
  },

  startJob: async (requestId: string): Promise<LaborRequest> => {
    const response = await apiClient.post<{ request: LaborRequest }>(
      `/labor/requests/${requestId}/start`
    );
    return response.data.request;
  },

  completeJob: async (requestId: string): Promise<LaborRequest> => {
    const response = await apiClient.post<{ request: LaborRequest }>(
      `/labor/requests/${requestId}/complete`
    );
    return response.data.request;
  },

  rateJob: async (
    requestId: string,
    rating: number,
    review?: string
  ): Promise<LaborRequest> => {
    const response = await apiClient.post<{ request: LaborRequest }>(
      `/labor/requests/${requestId}/rate`,
      { rating, review }
    );
    return response.data.request;
  },
};
