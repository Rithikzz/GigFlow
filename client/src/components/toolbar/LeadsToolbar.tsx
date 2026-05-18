import React from 'react';
import { SearchBar } from '../search/SearchBar';
import { FilterDropdowns } from '../filters/FilterDropdowns';
import { SortDropdown } from './SortDropdown';
import { CSVExportButton } from './CSVExportButton';
import { Lead, LeadSource, LeadStatus, LeadSort } from '../../types';

interface LeadsToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  status?: LeadStatus;
  onStatusChange: (status?: LeadStatus) => void;
  source?: LeadSource;
  onSourceChange: (source?: LeadSource) => void;
  sort: LeadSort;
  onSortChange: (sort: LeadSort) => void;
  onReset: () => void;
  leads: Lead[];
  isLoading?: boolean;
}

export const LeadsToolbar: React.FC<LeadsToolbarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  sort,
  onSortChange,
  onReset,
  leads,
  isLoading = false,
}) => {
  const hasActiveFilters = Boolean(search || status || source);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-dark-900/50 p-4 transition-all duration-200 hover:border-white/15">
      {/* Search and Filters row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="w-full lg:max-w-md">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            isLoading={isLoading}
          />
        </div>

        {/* Filters, Sorting & Export Container */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dropdown Filters */}
          <FilterDropdowns
            status={status}
            source={source}
            onStatusChange={onStatusChange}
            onSourceChange={onSourceChange}
            onReset={onReset}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Sort Dropdown */}
          <SortDropdown sort={sort} onChange={onSortChange} />

          {/* CSV Export */}
          <div className="ml-auto sm:ml-0">
            <CSVExportButton leads={leads} filenamePrefix="gigflow_leads" />
          </div>
        </div>
      </div>
    </div>
  );
};
