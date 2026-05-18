import React, { useMemo } from 'react';
import { CSVLink } from 'react-csv';
import { Download } from 'lucide-react';
import { Lead } from '../../types';

interface CSVExportButtonProps {
  leads: Lead[];
  filenamePrefix?: string;
}

export const CSVExportButton: React.FC<CSVExportButtonProps> = ({
  leads,
  filenamePrefix = 'leads_export',
}) => {
  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Status', key: 'status' },
    { label: 'Source', key: 'source' },
    { label: 'Assigned To Name', key: 'assignedName' },
    { label: 'Assigned To Email', key: 'assignedEmail' },
    { label: 'Created At', key: 'createdAt' },
  ];

  const data = useMemo(() => {
    return leads.map((lead) => ({
      id: lead._id,
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      assignedName: lead.assignedTo?.name || 'Unassigned',
      assignedEmail: lead.assignedTo?.email || 'N/A',
      createdAt: new Date(lead.createdAt).toLocaleString(),
    }));
  }, [leads]);

  const filename = useMemo(() => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${filenamePrefix}_${timestamp}.csv`;
  }, [filenamePrefix]);

  if (leads.length === 0) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm font-semibold text-dark-400 cursor-not-allowed"
      >
        <Download className="h-4 w-4" />
        Export CSV
      </button>
    );
  }

  return (
    <CSVLink
      data={data}
      headers={headers}
      filename={filename}
      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand-500/20 bg-brand-500/10 px-4 py-2.5 text-sm font-semibold text-brand-400 transition hover:bg-brand-500/20 active:scale-[0.98] cursor-pointer"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </CSVLink>
  );
};
