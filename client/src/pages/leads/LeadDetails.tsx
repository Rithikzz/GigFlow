import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { LeadDetailsCard } from '../../components/leads/LeadDetailsCard';
import { Button, EmptyState, Loader } from '../../components/ui';
import { leadService } from '../../services/leadService';
import { Lead } from '../../types';

export const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLead = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await leadService.getLeadById(id);
      setLead(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load lead';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    let active = true;

    leadService
      .getLeadById(id)
      .then((data) => {
        if (!active) return;
        setLead(data);
      })
      .catch((err) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : 'Failed to load lead';
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
  }, [id]);

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/leads')}>
        <ArrowLeft className="h-4 w-4" />
        Back to Leads
      </Button>

      {loading ? <Loader label="Loading lead details..." /> : null}
      {!loading && error ? (
        <EmptyState
          title="Failed to load lead"
          description={error}
          actionLabel="Retry"
          onAction={() => {
            void fetchLead();
          }}
        />
      ) : null}
      {!loading && !error && lead ? <LeadDetailsCard lead={lead} /> : null}
    </div>
  );
};
