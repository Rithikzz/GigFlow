import { create } from 'zustand';
import { Lead, LeadStatus } from '../types';

interface LeadFilters {
  status: LeadStatus | 'all';
  search: string;
  sortBy: 'createdAt' | 'value' | 'clientName';
  sortOrder: 'asc' | 'desc';
}

interface LeadState {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  filters: LeadFilters;
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (leadId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<LeadFilters>) => void;
  resetFilters: () => void;
}

const initialFilters: LeadFilters = {
  status: 'all',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useLeadStore = create<LeadState>((set) => ({
  leads: [],
  isLoading: false,
  error: null,
  filters: initialFilters,

  setLeads: (leads) => set({ leads, error: null }),
  
  addLead: (lead) => set((state) => ({ 
    leads: [lead, ...state.leads] 
  })),

  updateLead: (updatedLead) => set((state) => ({
    leads: state.leads.map((lead) => 
      lead.id === updatedLead.id ? updatedLead : lead
    )
  })),

  deleteLead: (leadId) => set((state) => ({
    leads: state.leads.filter((lead) => lead.id !== leadId)
  })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  resetFilters: () => set({ filters: initialFilters }),
}));
