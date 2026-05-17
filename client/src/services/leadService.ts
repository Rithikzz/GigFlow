import apiClient from '../api/client';
import { Lead, LeadStatus } from '../types';

// Premium high-fidelity mock leads data
const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    title: 'Enterprise CRM Overhaul',
    clientName: 'Stripe, Inc.',
    clientEmail: 'procurement@stripe.com',
    clientPhone: '+1 (555) 019-2834',
    status: 'negotiating',
    value: 48000,
    source: 'Inbound referral',
    description: 'Looking to completely replace legacy Oracle CRM tools with a custom high-performance frontend dashboard.',
    notes: [
      {
        id: 'n-1',
        leadId: 'lead-1',
        authorName: 'Alex Mercer',
        content: 'Initial kickoff meeting finished. Client loves the speed of our dashboard engine.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'lead-2',
    title: 'Mobile Wallet UI/UX Design',
    clientName: 'Revolut Ltd',
    clientEmail: 'design-leads@revolut.com',
    clientPhone: '+44 20 7183 2839',
    status: 'won',
    value: 24500,
    source: 'Dribbble portfolio',
    description: 'Needs high-fidelity interactive Figma flows and premium React Native frontend shell.',
    notes: [],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'lead-3',
    title: 'E-Commerce Headless Dev',
    clientName: 'Zara Apparel',
    clientEmail: 'tech-buying@zara.es',
    clientPhone: '+34 91 827 3481',
    status: 'new',
    value: 65000,
    source: 'Cold outreach',
    description: 'Migration from legacy Salesforce Commerce Cloud to Next.js + Shopify Hydrogen.',
    notes: [],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'lead-4',
    title: 'AI Trading Copilot Integration',
    clientName: 'Jane Street',
    clientEmail: 'inbound-hft@janestreet.com',
    status: 'contacted',
    value: 120000,
    source: 'Website form',
    description: 'Adding a real-time LLM chat interface alongside their proprietary trading terminals.',
    notes: [
      {
        id: 'n-2',
        leadId: 'lead-4',
        authorName: 'Alex Mercer',
        content: 'First call done. Security review is the biggest hurdle. Sending SOC2 doc.',
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-5',
    title: 'Marketing Site & SEO Optimization',
    clientName: 'Acme Corp',
    clientEmail: 'marketing@acme.com',
    clientPhone: '+1 (555) 234-5678',
    status: 'lost',
    value: 8000,
    source: 'Google Search',
    description: 'Budget was too small for our modern stack setup.',
    notes: [],
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString()
  }
];

export const leadService = {
  async getAllLeads(): Promise<Lead[]> {
    try {
      const response = await apiClient.get<Lead[]>('/leads');
      return response.data;
    } catch (error) {
      console.log('Using fallback mock leads data...');
      return MOCK_LEADS;
    }
  },

  async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'notes'>): Promise<Lead> {
    try {
      const response = await apiClient.post<Lead>('/leads', leadData);
      return response.data;
    } catch (error) {
      const newLead: Lead = {
        ...leadData,
        id: `lead-${Date.now()}`,
        notes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newLead;
    }
  },

  async updateLeadStatus(leadId: string, status: LeadStatus): Promise<Lead> {
    try {
      const response = await apiClient.patch<Lead>(`/leads/${leadId}/status`, { status });
      return response.data;
    } catch (error) {
      const found = MOCK_LEADS.find(l => l.id === leadId);
      if (found) {
        return { ...found, status, updatedAt: new Date().toISOString() };
      }
      throw new Error('Lead not found');
    }
  },

  async updateLead(leadId: string, leadData: Partial<Lead>): Promise<Lead> {
    try {
      const response = await apiClient.put<Lead>(`/leads/${leadId}`, leadData);
      return response.data;
    } catch (error) {
      const found = MOCK_LEADS.find(l => l.id === leadId);
      if (found) {
        return { ...found, ...leadData, updatedAt: new Date().toISOString() } as Lead;
      }
      throw new Error('Lead not found');
    }
  },

  async deleteLead(leadId: string): Promise<void> {
    try {
      await apiClient.delete(`/leads/${leadId}`);
    } catch (error) {
      console.log(`Mock deleted lead: ${leadId}`);
    }
  },

  async addNote(leadId: string, content: string): Promise<Lead> {
    try {
      const response = await apiClient.post<Lead>(`/leads/${leadId}/notes`, { content });
      return response.data;
    } catch (error) {
      const found = MOCK_LEADS.find(l => l.id === leadId);
      if (found) {
        const newNote = {
          id: `n-${Date.now()}`,
          leadId,
          authorName: 'Alex Mercer',
          content,
          createdAt: new Date().toISOString()
        };
        const updated = {
          ...found,
          notes: [...(found.notes || []), newNote],
          updatedAt: new Date().toISOString()
        };
        return updated;
      }
      throw new Error('Lead not found');
    }
  }
};
