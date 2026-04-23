import apiClient from './client';
import { WorkerWithProfile, WorkerProfile, PaginatedResponse, WorkerSkill } from '../types';

export interface WorkerProfileDto {
  skills?: WorkerSkill[];
  experience_years?: number;
  daily_rate?: number;
  hourly_rate?: number;
  bio?: string;
}

export const workersApi = {
  // Spec-aligned methods
  list: (params?: { skill?: string; available?: boolean; search?: string }) =>
    apiClient.get<PaginatedResponse<WorkerWithProfile>>('/workers', { params }),

  get: (id: string) => apiClient.get<{ worker: WorkerWithProfile }>(`/workers/${id}`),

  updateAvailability: (status: 'working' | 'waiting') =>
    apiClient.patch<{ profile: WorkerProfile }>('/workers/availability', { status }),

  updateProfile: (data: Partial<WorkerProfileDto>) =>
    apiClient.patch<{ profile: WorkerProfile }>('/workers/profile', data),

  // Extended helpers — all use correct backend endpoints
  getWorkers: async (params?: {
    skill?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<WorkerWithProfile>> => {
    const response = await apiClient.get<PaginatedResponse<WorkerWithProfile>>('/workers', { params });
    return response.data;
  },

  getWorkerById: async (workerId: string): Promise<WorkerWithProfile> => {
    const response = await apiClient.get<{ worker: WorkerWithProfile }>(`/workers/${workerId}`);
    return response.data.worker;
  },

  getMyWorkerProfile: async (): Promise<WorkerProfile> => {
    // Backend uses /workers/profile (JWT identifies the worker)
    const response = await apiClient.get<{ profile: WorkerProfile }>('/workers/profile');
    return response.data.profile;
  },

  updateWorkerProfile: async (data: Partial<WorkerProfileDto>): Promise<WorkerProfile> => {
    const response = await apiClient.patch<{ profile: WorkerProfile }>('/workers/profile', data);
    return response.data.profile;
  },

  updateWorkerStatus: async (status: 'working' | 'waiting'): Promise<WorkerProfile> => {
    // Backend uses /workers/availability
    const response = await apiClient.patch<{ profile: WorkerProfile }>('/workers/availability', { status });
    return response.data.profile;
  },

  submitVerification: async (data: {
    id_type: string;
    id_number: string;
    id_front_url: string;
    id_back_url?: string;
    selfie_url?: string;
  }): Promise<void> => {
    // Verifications submitted via users route
    await apiClient.post('/users/verification', data);
  },
};
