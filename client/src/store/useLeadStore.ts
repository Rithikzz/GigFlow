import { create } from 'zustand';
import { Lead, LeadListQuery, PaginationMeta } from '../types';
import { PAGE_SIZE } from '../constants';

interface LeadState {
  leads: Lead[];
  query: LeadListQuery;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  selectedLead: Lead | null;
  setLeads: (leads: Lead[]) => void;
  upsertLead: (lead: Lead) => void;
  removeLead: (leadId: string) => void;
  setQuery: (query: Partial<LeadListQuery>) => void;
  resetQuery: () => void;
  setPagination: (pagination: PaginationMeta) => void;
  setSelectedLead: (lead: Lead | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialQuery: LeadListQuery = {
  page: 1,
  sort: 'latest',
};

export const useLeadStore = create<LeadState>((set) => ({
  leads: [],
  query: initialQuery,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
    hasPrevPage: false,
    perPage: PAGE_SIZE,
  },
  isLoading: false,
  error: null,
  selectedLead: null,

  setLeads: (leads) => set({ leads, error: null }),

  upsertLead: (updatedLead) =>
    set((state) => {
      const exists = state.leads.some((lead) => lead._id === updatedLead._id);
      if (!exists) {
        return { leads: [updatedLead, ...state.leads] };
      }
      return {
        leads: state.leads.map((lead) => (lead._id === updatedLead._id ? updatedLead : lead)),
      };
    }),

  removeLead: (leadId) => set((state) => ({
    leads: state.leads.filter((lead) => lead._id !== leadId)
  })),

  setQuery: (query) => set((state) => ({ query: { ...state.query, ...query } })),
  resetQuery: () => set({ query: initialQuery }),
  setPagination: (pagination) => set({ pagination }),
  setSelectedLead: (selectedLead) => set({ selectedLead }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
