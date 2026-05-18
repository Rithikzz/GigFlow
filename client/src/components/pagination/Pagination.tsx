import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  isLoading = false,
}) => {
  // Generate array of page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show page 1, current page -1, current page, current page +1, and last page
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      }
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  if (totalRecords === 0) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-white/10 bg-dark-900/40 px-4 py-3.5 sm:flex-row transition-all duration-200 hover:border-white/15">
      {/* Records Info */}
      <p className="text-sm text-dark-300 text-center sm:text-left">
        Showing page <span className="font-semibold text-white">{currentPage}</span> of{' '}
        <span className="font-semibold text-white">{totalPages}</span>{' '}
        <span className="text-dark-500">•</span>{' '}
        <span className="font-semibold text-white">{totalRecords}</span>{' '}
        {totalRecords === 1 ? 'record' : 'records'}
      </p>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1.5">
        {/* Prev Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage || isLoading}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-dark-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers[0] > 1 && (
            <>
              <button
                type="button"
                onClick={() => onPageChange(1)}
                disabled={isLoading}
                className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-xl px-2.5 text-sm font-semibold transition active:scale-95 ${
                  currentPage === 1
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                    : 'text-dark-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                1
              </button>
              {pageNumbers[0] > 2 && <span className="px-1 text-xs text-dark-500">...</span>}
            </>
          )}

          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-xl px-2.5 text-sm font-semibold transition active:scale-95 ${
                currentPage === page
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                  : 'text-dark-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-1 text-xs text-dark-500">...</span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                disabled={isLoading}
                className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-xl px-2.5 text-sm font-semibold transition active:scale-95 ${
                  currentPage === totalPages
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                    : 'text-dark-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || isLoading}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-dark-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
          aria-label="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
