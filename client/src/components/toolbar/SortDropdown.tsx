import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { LEAD_SORTS } from '../../constants';
import { LeadSort } from '../../types';

interface SortDropdownProps {
  sort: LeadSort;
  onChange: (sort: LeadSort) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ sort, onChange }) => {
  return (
    <div className="relative min-w-[140px] flex-1 sm:flex-initial">
      <select
        value={sort}
        onChange={(e) => onChange(e.target.value as LeadSort)}
        className="w-full appearance-none rounded-xl border border-white/10 bg-dark-900/60 py-2.5 pl-4 pr-10 text-sm font-medium text-white outline-none transition-all duration-200 focus:border-brand-500/80 focus:ring-2 focus:ring-brand-500/20"
      >
        {LEAD_SORTS.map((s) => (
          <option key={s} value={s}>
            Sort: {s === 'latest' ? 'Latest' : 'Oldest'}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <ArrowUpDown className="h-3.5 w-3.5 text-dark-400" />
      </div>
    </div>
  );
};
