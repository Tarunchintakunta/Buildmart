import apiClient from './client';
import { Agreement, AgreementWithParties, PaginatedResponse, RateType } from '../types';

export interface CreateAgreementDto {
  worker_id: string;
  title: string;
  scope_of_work: string;
  start_date: string;
  end_date: string;
  rate_type: RateType;
  rate_amount: number;
  working_hours_per_day: number;
  work_location?: string;
  termination_notice_days?: number;
  additional_terms?: string;
}

export const agreementsApi = {
  // Spec-aligned methods
  create: (data: CreateAgreementDto) =>
    apiClient.post<{ agreement: Agreement }>('/agreements', data),

  list: (params?: { status?: string }) =>
    apiClient.get<PaginatedResponse<AgreementWithParties>>('/agreements', { params }),

  get: (id: string) =>
    apiClient.get<{ agreement: AgreementWithParties }>(`/agreements/${id}`),

  sign: (id: string) =>
    apiClient.patch<{ agreement: Agreement }>(`/agreements/${id}/sign`),

  decline: (id: string, reason: string) =>
    apiClient.patch<{ agreement: Agreement }>(`/agreements/${id}/decline`, { reason }),

  terminate: (id: string, reason: string) =>
    apiClient.patch<{ agreement: Agreement }>(`/agreements/${id}/terminate`, { reason }),

  // Extended helpers
  getMyAgreements: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<AgreementWithParties>> => {
    const response = await apiClient.get<PaginatedResponse<AgreementWithParties>>(
      '/agreements/my',
      { params }
    );
    return response.data;
  },

  getAgreementById: async (agreementId: string): Promise<AgreementWithParties> => {
    const response = await apiClient.get<{ agreement: AgreementWithParties }>(
      `/agreements/${agreementId}`
    );
    return response.data.agreement;
  },

  createAgreement: async (data: CreateAgreementDto): Promise<Agreement> => {
    const response = await apiClient.post<{ agreement: Agreement }>('/agreements', data);
    return response.data.agreement;
  },

  signAgreement: async (agreementId: string): Promise<Agreement> => {
    const response = await apiClient.patch<{ agreement: Agreement }>(
      `/agreements/${agreementId}/sign`
    );
    return response.data.agreement;
  },

  terminateAgreement: async (agreementId: string, reason: string): Promise<Agreement> => {
    const response = await apiClient.patch<{ agreement: Agreement }>(
      `/agreements/${agreementId}/terminate`,
      { reason }
    );
    return response.data.agreement;
  },
};
