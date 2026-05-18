import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { LeadModalForm } from '../../components/leads/LeadModalForm';
import { LeadTable } from '../../components/leads/LeadTable';
import { Button, Modal } from '../../components/ui';
import { LeadsToolbar } from '../../components/toolbar';
import { Pagination } from '../../components/pagination';
import { leadService } from '../../services/leadService';
import { useAuthStore } from '../../store/useAuthStore';
import { useLeadStore } from '../../store/useLeadStore';
import { CreateLeadPayload, Lead, UpdateLeadPayload, LeadStatus, LeadSource, LeadSort } from '../../types';

export const Leads: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    leads,
    query,
    pagination,
    isLoading,
    error,
    setLeads,
    upsertLead,
    removeLead,
    setQuery,
    resetQuery,
    setPagination,
    setLoading,
    setError,
  } = useLeadStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>();
  const [deleteCandidate, setDeleteCandidate] = useState<Lead | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const isAdmin = useMemo(() => user?.role === 'ADMIN', [user?.role]);

  // 1. Initialize store query state from URL search parameters on mount
  useEffect(() => {
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const status = (searchParams.get('status') as LeadStatus) || undefined;
    const source = (searchParams.get('source') as LeadSource) || undefined;
    const sort = (searchParams.get('sort') as LeadSort) || 'latest';
    const search = searchParams.get('search') || '';

    setQuery({
      page,
      status,
      source,
      sort,
      search: search || undefined,
    });
    setIsInitialized(true);
  }, []);

  // 2. Synchronize store query state back to the URL search parameters
  useEffect(() => {
    if (!isInitialized) return;

    const params: Record<string, string> = {};
    if (query.page && query.page > 1) {
      params.page = String(query.page);
    }
    if (query.status) {
      params.status = query.status;
    }
    if (query.source) {
      params.source = query.source;
    }
    if (query.sort && query.sort !== 'latest') {
      params.sort = query.sort;
    }
    if (query.search) {
      params.search = query.search;
    }

    setSearchParams(params, { replace: true });
  }, [query, isInitialized, setSearchParams]);

  // 3. Fetch leads from backend
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadService.getLeads(query);
      setLeads(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load leads';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [query, setError, setLeads, setLoading, setPagination]);

  // Fetch leads when query state changes, only after store is initialized from URL
  useEffect(() => {
    if (!isInitialized) return;
    void fetchLeads();
  }, [fetchLeads, isInitialized]);

  const openCreate = () => {
    setEditingLead(undefined);
    setIsModalOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleSubmit = async (payload: CreateLeadPayload | UpdateLeadPayload) => {
    setSubmitting(true);
    try {
      if (editingLead) {
        const updated = await leadService.updateLead(editingLead._id, payload);
        upsertLead(updated);
        toast.success('Lead updated successfully');
      } else {
        const created = await leadService.createLead(payload as CreateLeadPayload);
        upsertLead(created);
        toast.success('Lead created successfully');
      }
      setIsModalOpen(false);
      setEditingLead(undefined);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save lead';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (lead: Lead) => {
    if (!isAdmin) return;
    setDeleteCandidate(lead);
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const snapshot = [...leads];
    removeLead(deleteCandidate._id);
    setDeleteCandidate(null);
    try {
      await leadService.deleteLead(deleteCandidate._id);
      toast.success('Lead deleted successfully');
    } catch (err) {
      setLeads(snapshot);
      const message = err instanceof Error ? err.message : 'Failed to delete lead';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Leads</h1>
          <p className="text-sm text-dark-300">Manage lead records, status, and assignments.</p>
        </div>
        <Button onClick={openCreate} className="shadow-lg shadow-brand-500/20 active:scale-95">
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Advanced Toolbar containing debounced search, status, source, sort, and export */}
      <LeadsToolbar
        search={query.search ?? ''}
        onSearchChange={(searchVal) => setQuery({ search: searchVal || undefined, page: 1 })}
        status={query.status}
        onStatusChange={(statusVal) => setQuery({ status: statusVal, page: 1 })}
        source={query.source}
        onSourceChange={(sourceVal) => setQuery({ source: sourceVal, page: 1 })}
        sort={query.sort ?? 'latest'}
        onSortChange={(sortVal) => setQuery({ sort: sortVal })}
        onReset={() => resetQuery()}
        leads={leads}
        isLoading={isLoading}
      />

      {/* Leads Table listing */}
      <LeadTable
        leads={leads}
        isLoading={isLoading}
        error={error}
        isAdmin={Boolean(isAdmin)}
        onRetry={() => {
          void fetchLeads();
        }}
        onView={(lead) => navigate(`/leads/${lead._id}`)}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {/* Reusable customized Pagination component */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalRecords={pagination.totalRecords}
        hasNextPage={pagination.hasNextPage}
        hasPrevPage={pagination.hasPrevPage}
        onPageChange={(pageVal) => setQuery({ page: pageVal })}
        isLoading={isLoading}
      />

      <LeadModalForm
        open={isModalOpen}
        lead={editingLead}
        submitting={submitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <Modal
        open={Boolean(deleteCandidate)}
        title="Delete Lead"
        onClose={() => setDeleteCandidate(null)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteCandidate(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => void confirmDelete()}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-dark-200">
          Are you sure you want to delete <span className="font-semibold text-white">{deleteCandidate?.name}</span>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};
