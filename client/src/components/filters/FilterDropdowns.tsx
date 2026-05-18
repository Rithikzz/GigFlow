import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { LEAD_SOURCES, LEAD_STATUSES } from '../../constants';
import { LeadSource, LeadStatus } from '../../types';

interface FilterDropdownsProps {
  status?: LeadStatus;
  source?: LeadSource;
  onStatusChange: (status?: LeadStatus) => void;
  onSourceChange: (source?: LeadSource) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export const FilterDropdowns: React.FC<FilterDropdownsProps> = ({
  status,
  source,
  onStatusChange,
  onSourceChange,
  onReset,
  hasActiveFilters,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Status Filter */}
      <div className="relative min-w-[140px] flex-1 sm:flex-initial">
        <select
          value={status ?? ''}
          onChange={(e) => onStatusChange((e.target.value as LeadStatus) || undefined)}
          className="w-full appearance-none rounded-xl border border-white/10 bg-dark-900/60 py-2.5 pl-4 pr-10 text-sm font-medium text-white outline-none transition-all duration-200 focus:border-brand-500/80 focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="">All Statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Filter className="h-3.5 w-3.5 text-dark-400" />
        </div>
      </div>

      {/* Source Filter */}
      <div className="relative min-w-[140px] flex-1 sm:flex-initial">
        <select
          value={source ?? ''}
          onChange={(e) => onSourceChange((e.target.value as LeadSource) || undefined)}
          className="w-full appearance-none rounded-xl border border-white/10 bg-dark-900/60 py-2.5 pl-4 pr-10 text-sm font-medium text-white outline-none transition-all duration-200 focus:border-brand-500/80 focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="">All Sources</option>
          {LEAD_SOURCES.map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Filter className="h-3.5 w-3.5 text-dark-400" />
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/20 active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Filters
        </button>
      )}
    </div>
  );
};
