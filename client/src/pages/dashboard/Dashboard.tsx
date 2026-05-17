import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeadStore } from '../../store/useLeadStore';
import { useAuthStore } from '../../store/useAuthStore';
import { leadService } from '../../services/leadService';
import { 
  TrendingUp, 
  DollarSign, 
  Layers, 
  Award, 
  Percent, 
  Plus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { LeadStatus } from '../../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { leads, setLeads, setLoading, isLoading } = useLeadStore();

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const data = await leadService.getAllLeads();
        setLeads(data);
      } catch (err: unknown) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [setLeads, setLoading]);

  // Real-time statistics aggregation
  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const wonLeads = leads.filter(l => l.status === 'won');
  const wonValue = wonLeads.reduce((sum, lead) => sum + lead.value, 0);

  const lostCount = leads.filter(l => l.status === 'lost').length;
  const wonCount = wonLeads.length;
  const conversionRate = (wonCount + lostCount) > 0 
    ? Math.round((wonCount / (wonCount + lostCount)) * 100) 
    : 0;

  const statusBreakdown = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<LeadStatus, number>);

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'contacted': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'negotiating': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'won': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'lost': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Greeting Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Live Revenue Engine
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight m-0 leading-tight">
            Hey, {user?.name || 'Partner'}!
          </h1>
          <p className="text-dark-400 text-sm mt-1">
            Here is your sales performance snapshot and smart leads workflow for today.
          </p>
        </div>
        <button
          onClick={() => navigate('/leads')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Lead
        </button>
      </div>

      {/* Main Aggregation Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-600/5 rounded-bl-full group-hover:scale-110 transition-transform" />
          <div className="w-10 h-10 rounded-xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center mb-4">
            <Layers className="w-5 h-5 text-brand-400" />
          </div>
          <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-1">Active Deals</p>
          <h3 className="text-2xl font-heading font-extrabold text-white">{isLoading ? '...' : totalLeads}</h3>
          <p className="text-xs text-dark-500 mt-2">Leads in current sales cycle</p>
        </div>

        {/* Card 2 */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-1">Pipeline Value</p>
          <h3 className="text-2xl font-heading font-extrabold text-white">{isLoading ? '...' : formatCurrency(totalValue)}</h3>
          <p className="text-xs text-dark-500 mt-2">Total gross deal valuations</p>
        </div>

        {/* Card 3 */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-1">Closed Revenue</p>
          <h3 className="text-2xl font-heading font-extrabold text-white">{isLoading ? '...' : formatCurrency(wonValue)}</h3>
          <p className="text-xs text-emerald-400/80 mt-2">Valuation from 'Won' leads</p>
        </div>

        {/* Card 4 */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
            <Percent className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-1">Win Rate</p>
          <h3 className="text-2xl font-heading font-extrabold text-white">{isLoading ? '...' : `${conversionRate}%`}</h3>
          <p className="text-xs text-dark-500 mt-2">Closed Won vs Closed Lost ratio</p>
        </div>
      </div>

      {/* Grid: Stat Visualization Charts & Recent High-Value Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Stage Breakdown */}
        <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-md font-heading font-bold text-white mb-6">Pipeline Stages</h3>
            <div className="space-y-4">
              {(['new', 'contacted', 'negotiating', 'won', 'lost'] as LeadStatus[]).map((stage) => {
                const count = statusBreakdown[stage] || 0;
                const percent = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                
                return (
                  <div key={stage} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize font-semibold text-dark-300">{stage}</span>
                      <span className="font-semibold text-white">{count} ({Math.round(percent)}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          stage === 'new' ? 'bg-sky-500' :
                          stage === 'contacted' ? 'bg-amber-500' :
                          stage === 'negotiating' ? 'bg-indigo-500' :
                          stage === 'won' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6">
            <div className="flex items-center justify-between text-xs text-dark-400">
              <span>Overall completion velocity</span>
              <span className="text-emerald-400 font-bold">Good progress</span>
            </div>
          </div>
        </div>

        {/* High-Value Recent Leads list */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-md font-heading font-bold text-white m-0">Recent Sales Lead Activity</h3>
              <button 
                onClick={() => navigate('/leads')}
                className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-semibold transition-colors"
              >
                Manage Pipeline
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : recentLeads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-dark-400">No leads found in this pipeline.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    onClick={() => navigate('/leads')}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`px-2.5 py-1 rounded-lg border text-xxs font-bold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors m-0 leading-tight">
                          {lead.title}
                        </h4>
                        <p className="text-xs text-dark-400 mt-1">
                          Client: <span className="font-semibold text-dark-300">{lead.clientName}</span> • Source: {lead.source}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white leading-tight">
                        {formatCurrency(lead.value)}
                      </p>
                      <p className="text-xxs text-dark-500 mt-1">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between text-xs text-dark-400">
            <span>Aggregating active pipeline metrics in real-time</span>
            <span>Refreshed just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};
