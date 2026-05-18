import apiClient from '../api/client';
import {
  ApiSuccessResponse,
  CreateLeadPayload,
  Lead,
  LeadListQuery,
  PaginationMeta,
  UpdateLeadPayload,
} from '../types';
import { cleanQueryParams } from '../utils';

export interface LeadListResponse {
  data: Lead[];
  pagination: PaginationMeta;
}

export const leadService = {
  async getLeads(query: LeadListQuery): Promise<LeadListResponse> {
    const cleanedParams = cleanQueryParams(query);
    const response = await apiClient.get<ApiSuccessResponse<Lead[]>>('/leads', { params: cleanedParams });
    return {
      data: response.data.data,
      pagination: response.data.pagination ?? {
        currentPage: 1,
        totalPages: 1,
        totalRecords: response.data.data.length,
        hasNextPage: false,
        hasPrevPage: false,
        perPage: response.data.data.length,
      },
    };
  },

  async getLeadById(leadId: string): Promise<Lead> {
    const response = await apiClient.get<ApiSuccessResponse<Lead>>(`/leads/${leadId}`);
    return response.data.data;
  },

  async createLead(payload: CreateLeadPayload): Promise<Lead> {
    const response = await apiClient.post<ApiSuccessResponse<Lead>>('/leads', payload);
    return response.data.data;
  },

  async updateLead(leadId: string, payload: UpdateLeadPayload): Promise<Lead> {
    const response = await apiClient.put<ApiSuccessResponse<Lead>>(`/leads/${leadId}`, payload);
    return response.data.data;
  },

  async deleteLead(leadId: string): Promise<string> {
    const response = await apiClient.delete<ApiSuccessResponse<null>>(`/leads/${leadId}`);
    return response.data.message;
  },
};
