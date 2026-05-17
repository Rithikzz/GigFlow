import React, { useEffect, useState } from 'react';
import { useLeadStore } from '../../store/useLeadStore';
import { leadService } from '../../services/leadService';
import { LeadForm } from '../../components/forms/LeadForm';
import { Lead, LeadStatus } from '../../types';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  Mail, 
  Phone,
  Bookmark,
  Calendar,
  X,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Leads: React.FC = () => {
  const { 
    leads, 
    setLeads, 
    addLead, 
    updateLead, 
    deleteLead,
    filters,
    setFilters,
    resetFilters,
    isLoading,
    setLoading 
  } = useLeadStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');

  // Fetch leads on mount
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const data = await leadService.getAllLeads();
        setLeads(data);
      } catch (err: unknown) {
        toast.error('Failed to load leads');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [setLeads, setLoading]);

  // Handle Form submit (Create or Update)
  const handleFormSubmit = async (formData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'notes'>) => {
    try {
      if (editingLead) {
        const updated = await leadService.updateLead(editingLead.id, formData);
        updateLead(updated);
        toast.success('Lead updated successfully!');
      } else {
        const created = await leadService.createLead(formData);
        addLead(created);
        toast.success('New lead created successfully!');
      }
      setIsFormOpen(false);
      setEditingLead(undefined);
    } catch (err: unknown) {
      toast.error('Failed to save lead');
    }
  };

  // Handle Delete
  const handleDelete = async (e: React.MouseEvent, leadId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await leadService.deleteLead(leadId);
      deleteLead(leadId);
      if (selectedLead?.id === leadId) setSelectedLead(null);
      toast.success('Lead deleted successfully');
    } catch (err: unknown) {
      toast.error('Failed to delete lead');
    }
  };

  // Handle status quick update inside details modal
  const handleStatusChange = async (status: LeadStatus) => {
    if (!selectedLead) return;
    try {
      const updated = await leadService.updateLeadStatus(selectedLead.id, status);
      updateLead(updated);
      setSelectedLead(updated);
      toast.success(`Pipeline status updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Handle Note Submission
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteContent.trim()) return;
    try {
      const updated = await leadService.addNote(selectedLead.id, newNoteContent.trim());
      updateLead(updated);
      setSelectedLead(updated);
      setNewNoteContent('');
      toast.success('Note added');
    } catch (err) {
      toast.error('Failed to add note');
    }
  };

  // Apply search, filters, and sorting
  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch = 
        lead.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.clientEmail.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || lead.status === filters.status;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (filters.sortBy === 'value') {
        comparison = a.value - b.value;
      } else if (filters.sortBy === 'clientName') {
        comparison = a.clientName.localeCompare(b.clientName);
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'contacted': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'negotiating': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'won': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'lost': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8 relative">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight m-0 leading-tight">
            Sales Leads Pipeline
          </h1>
          <p className="text-dark-400 text-sm mt-1">
            Qualify opportunities, set deal valuations, track progress, and write collaboration notes.
          </p>
        </div>
        <button
          onClick={() => { setEditingLead(undefined); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Sales Lead
        </button>
      </div>

      {/* Interactive Controls Bar: Search, Status Badges, Sort */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="Search by title, client or email..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        {/* Status Filter select */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value as LeadStatus | 'all' })}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl glass-input text-sm appearance-none"
          >
            <option value="all" className="bg-dark-900 text-white">All Pipeline Stages</option>
            <option value="new" className="bg-dark-900 text-white">New</option>
            <option value="contacted" className="bg-dark-900 text-white">Contacted</option>
            <option value="negotiating" className="bg-dark-900 text-white">Negotiating</option>
            <option value="won" className="bg-dark-900 text-white">Won</option>
            <option value="lost" className="bg-dark-900 text-white">Lost</option>
          </select>
        </div>

        {/* Sort selector */}
        <div className="relative">
          <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-');
              setFilters({ sortBy: by as 'createdAt' | 'value' | 'clientName', sortOrder: order as 'asc' | 'desc' });
            }}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl glass-input text-sm appearance-none"
          >
            <option value="createdAt-desc" className="bg-dark-900 text-white">Date (Newest First)</option>
            <option value="createdAt-asc" className="bg-dark-900 text-white">Date (Oldest First)</option>
            <option value="value-desc" className="bg-dark-900 text-white">Deal Value (High to Low)</option>
            <option value="value-asc" className="bg-dark-900 text-white">Deal Value (Low to High)</option>
            <option value="clientName-asc" className="bg-dark-900 text-white">Client Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Leads List Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="glass-card rounded-2xl py-16 border border-white/5 text-center">
          <p className="text-dark-400 text-sm">No leads match the active search and filter presets.</p>
          <button 
            onClick={resetFilters}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 mt-2 hover:underline"
          >
            Reset filter variables
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between hover:border-white/10 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`px-2.5 py-1 rounded-lg border text-xxs font-bold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingLead(lead);
                        setIsFormOpen(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-dark-300 hover:text-brand-400 transition-colors"
                      title="Edit Deal"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, lead.id)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-dark-300 hover:text-rose-400 transition-colors"
                      title="Delete Deal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-heading font-extrabold text-white group-hover:text-brand-400 transition-colors m-0 leading-snug">
                  {lead.title}
                </h3>

                <p className="text-xs text-dark-400 mt-2 font-sans line-clamp-2">
                  {lead.description || 'No deal description entered.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-dark-400 font-semibold">{lead.clientName}</span>
                  <span className="text-brand-400 font-extrabold text-sm">{formatCurrency(lead.value)}</span>
                </div>

                <div className="flex items-center justify-between text-xxs text-dark-500">
                  <span className="flex items-center gap-1">
                    <Bookmark className="w-3.5 h-3.5" />
                    Source: {lead.source}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {lead.notes?.length || 0} notes
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Side Modal Drawer / Overlay Panel */}
      {selectedLead && (
        <div className="fixed inset-0 z-40 flex items-center justify-end p-4 bg-dark-950/70 backdrop-blur-md">
          <div className="w-full max-w-lg h-full max-h-[90vh] glass-card rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
              <div>
                <h3 className="text-md font-heading font-bold text-white m-0 truncate max-w-[280px]">
                  {selectedLead.title}
                </h3>
                <p className="text-xs text-dark-400 mt-1 m-0">
                  Client: <span className="font-semibold text-dark-300">{selectedLead.clientName}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-dark-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Quick Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xxs font-semibold text-dark-400 uppercase tracking-wider mb-1">Deal Valuation</p>
                  <p className="text-lg font-heading font-extrabold text-brand-400 leading-none">{formatCurrency(selectedLead.value)}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xxs font-semibold text-dark-400 uppercase tracking-wider mb-1">Deal Source</p>
                  <p className="text-sm font-semibold text-white leading-none capitalize">{selectedLead.source}</p>
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div>
                <p className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3">Update Stage</p>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'contacted', 'negotiating', 'won', 'lost'] as LeadStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`
                        px-3 py-1.5 rounded-xl text-xs font-bold border transition-all capitalize
                        ${selectedLead.status === status
                          ? getStatusColor(status) + ' ring-2 ring-brand-500/20 scale-105'
                          : 'bg-white/5 border-white/5 text-dark-400 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contacts */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-dark-300 uppercase tracking-wider">Contact Information</p>
                <div className="space-y-1.5">
                  <a href={`mailto:${selectedLead.clientEmail}`} className="flex items-center gap-2 text-xs text-dark-400 hover:text-brand-400 transition-colors">
                    <Mail className="w-4 h-4" />
                    {selectedLead.clientEmail}
                  </a>
                  {selectedLead.clientPhone && (
                    <a href={`tel:${selectedLead.clientPhone}`} className="flex items-center gap-2 text-xs text-dark-400 hover:text-brand-400 transition-colors">
                      <Phone className="w-4 h-4" />
                      {selectedLead.clientPhone}
                    </a>
                  )}
                  <p className="flex items-center gap-2 text-xs text-dark-400">
                    <Calendar className="w-4 h-4" />
                    Created: {new Date(selectedLead.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-dark-300 uppercase tracking-wider">Description</p>
                <p className="text-xs text-dark-400 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                  {selectedLead.description || 'No description provided.'}
                </p>
              </div>

              {/* Collaboration Notes */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-xs font-semibold text-dark-300 uppercase tracking-wider">Notes & Comments ({selectedLead.notes?.length || 0})</p>

                {/* Notes List */}
                <div className="space-y-3">
                  {selectedLead.notes && selectedLead.notes.length > 0 ? (
                    selectedLead.notes.map((note) => (
                      <div key={note.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                        <div className="flex items-center justify-between text-xxs">
                          <span className="font-bold text-white">{note.authorName}</span>
                          <span className="text-dark-500">{new Date(note.createdAt).toLocaleDateString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-dark-400 leading-relaxed font-sans">{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xxs text-dark-500 text-center py-2">No notes added. Type one below to collaborate.</p>
                  )}
                </div>

                {/* New Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Add collaborative note..."
                    className="flex-1 px-4 py-2 rounded-xl glass-input text-xs"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-lg transition-colors flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal (Create or Edit) */}
      {isFormOpen && (
        <LeadForm
          initialData={editingLead}
          onClose={() => { setIsFormOpen(false); setEditingLead(undefined); }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};
