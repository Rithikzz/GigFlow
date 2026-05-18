import React from 'react';
import { Badge } from '../ui';
import { Lead } from '../../types';

interface LeadDetailsCardProps {
  lead: Lead;
}

const statusVariant = (status: Lead['status']): 'info' | 'warning' | 'success' | 'danger' => {
  switch (status) {
    case 'NEW':
      return 'info';
    case 'CONTACTED':
      return 'warning';
    case 'QUALIFIED':
      return 'success';
    case 'LOST':
      return 'danger';
  }
};

export const LeadDetailsCard: React.FC<LeadDetailsCardProps> = ({ lead }) => (
  <div className="rounded-2xl border border-white/10 bg-dark-900/50 p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
      <Badge variant={statusVariant(lead.status)}>{lead.status}</Badge>
    </div>
    <div className="mt-5 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
      <div>
        <p className="text-dark-300">Email</p>
        <p className="text-white">{lead.email}</p>
      </div>
      <div>
        <p className="text-dark-300">Source</p>
        <p className="text-white">{lead.source}</p>
      </div>
      <div>
        <p className="text-dark-300">Assigned User</p>
        <p className="text-white">{lead.assignedTo?.name ?? 'Unassigned'}</p>
      </div>
      <div>
        <p className="text-dark-300">Created Date</p>
        <p className="text-white">{new Date(lead.createdAt).toLocaleString()}</p>
      </div>
    </div>
  </div>
);
