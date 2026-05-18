import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, loading = false }) => (
  <div className="rounded-2xl border border-white/10 bg-dark-900/50 p-5">
    <div className="mb-3 inline-flex rounded-xl bg-brand-600/20 p-2">
      <Icon className="h-4 w-4 text-brand-300" />
    </div>
    <p className="text-xs uppercase tracking-wider text-dark-300">{title}</p>
    <p className="mt-1 text-2xl font-bold text-white">{loading ? '...' : value}</p>
  </div>
);
