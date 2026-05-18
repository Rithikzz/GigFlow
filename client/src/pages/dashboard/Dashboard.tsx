import React, { useEffect, useMemo, useState } from 'react';
import { MessageSquare, OctagonX, Users, UserRoundCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { StatCard } from '../../components/dashboard/StatCard';
import { EmptyState, Loader } from '../../components/ui';
import { leadService } from '../../services/leadService';
import { Lead } from '../../types';

export const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadService.getLeads({ page: 1, sort: 'latest' });
      setLeads(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard stats';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    leadService
      .getLeads({ page: 1, sort: 'latest' })
      .then((response) => {
        if (!active) return;
        setLeads(response.data);
      })
      .catch((err) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : 'Failed to fetch dashboard stats';
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      qualified: leads.filter((lead) => lead.status === 'QUALIFIED').length,
      contacted: leads.filter((lead) => lead.status === 'CONTACTED').length,
      lost: leads.filter((lead) => lead.status === 'LOST').length,
    };
  }, [leads]);

  if (loading) {
    return <Loader label="Loading dashboard..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load dashboard"
        description={error}
        actionLabel="Retry"
        onAction={() => {
          void fetchStats();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-dark-300">Overview of your lead pipeline.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Leads" value={stats.total} icon={Users} />
        <StatCard title="Qualified Leads" value={stats.qualified} icon={UserRoundCheck} />
        <StatCard title="Contacted Leads" value={stats.contacted} icon={MessageSquare} />
        <StatCard title="Lost Leads" value={stats.lost} icon={OctagonX} />
      </div>
    </div>
  );
};
