import React from 'react';
import { Badge, Button, EmptyState, Loader, Table, TableColumn } from '../ui';
import { Lead } from '../../types';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  onRetry: () => void;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
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

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  error,
  isAdmin,
  onRetry,
  onView,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-dark-900/50">
        <table className="min-w-full text-left animate-pulse">
          <thead className="bg-white/5">
            <tr>
              {['Name', 'Email', 'Status', 'Source', 'Assigned User', 'Created Date', 'Actions'].map((h, i) => (
                <th key={i} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dark-300">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t border-white/5">
                <td className="px-4 py-4"><div className="h-4 w-28 rounded bg-white/10" /></td>
                <td className="px-4 py-4"><div className="h-4 w-40 rounded bg-white/10" /></td>
                <td className="px-4 py-4"><div className="h-6 w-16 rounded-full bg-white/10" /></td>
                <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-white/10" /></td>
                <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-white/10" /></td>
                <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-white/10" /></td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-12 rounded-lg bg-white/10 animate-pulse" />
                    <div className="h-8 w-12 rounded-lg bg-white/10 animate-pulse" />
                    {isAdmin ? <div className="h-8 w-14 rounded-lg bg-white/10 animate-pulse" /> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Could not load leads"
        description={error}
        actionLabel="Retry"
        onAction={onRetry}
      />
    );
  }

  if (!leads.length) {
    return (
      <EmptyState
        title="No leads found"
        description="Create your first lead to start managing your pipeline."
      />
    );
  }

  const columns: TableColumn<Lead>[] = [
    { key: 'name', title: 'Name', render: (lead) => lead.name },
    { key: 'email', title: 'Email', render: (lead) => lead.email },
    {
      key: 'status',
      title: 'Status',
      render: (lead) => <Badge variant={statusVariant(lead.status)}>{lead.status}</Badge>,
    },
    { key: 'source', title: 'Source', render: (lead) => lead.source },
    {
      key: 'assignedTo',
      title: 'Assigned User',
      render: (lead) => lead.assignedTo?.name ?? 'Unassigned',
    },
    {
      key: 'createdAt',
      title: 'Created Date',
      render: (lead) => new Date(lead.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (lead) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => onView(lead)}>
            View
          </Button>
          <Button variant="secondary" onClick={() => onEdit(lead)}>
            Edit
          </Button>
          {isAdmin ? (
            <Button variant="danger" onClick={() => onDelete(lead)}>
              Delete
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={leads} />;
};
