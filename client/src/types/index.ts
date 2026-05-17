export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'won' | 'lost';

export interface LeadNote {
  id: string;
  leadId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  status: LeadStatus;
  value: number;
  source: string;
  description?: string;
  notes?: LeadNote[];
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardStats {
  totalLeads: number;
  totalValue: number;
  wonValue: number;
  conversionRate: number;
  statusBreakdown: Record<LeadStatus, number>;
  recentLeads: Lead[];
}
