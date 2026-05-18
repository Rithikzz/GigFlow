export type Role = 'ADMIN' | 'SALES';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';
export type LeadSource = 'WEBSITE' | 'INSTAGRAM' | 'REFERRAL';
export type LeadSort = 'latest' | 'oldest';

export interface AssignedUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo?: AssignedUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  assignedTo?: string;
}

export interface UpdateLeadPayload {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
  assignedTo?: string | null;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  perPage: number;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface AuthResponse {
  status: 'success';
  token: string;
  user: User;
}

export interface AuthMeResponse {
  status: 'success';
  user: User;
}

export interface LeadListQuery {
  page?: number;
  status?: LeadStatus;
  source?: LeadSource;
  sort?: LeadSort;
  search?: string;
}

export interface LeadToolbarState {
  search: string;
  status?: LeadStatus;
  source?: LeadSource;
  sort: LeadSort;
}
