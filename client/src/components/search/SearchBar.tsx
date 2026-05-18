import React, { useEffect, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '../../hooks';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by name or email...',
  isLoading = false,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 500);

  // Sync local input with store/parent value (e.g. on reset or URL query sync)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Propagate debounced changes to parent
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, value, onChange]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const isSearching = localValue !== debouncedValue || isLoading;

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        {isSearching ? (
          <Loader2 className="h-4.5 w-4.5 animate-spin text-brand-500" />
        ) : (
          <Search className="h-4.5 w-4.5 text-dark-400" />
        )}
      </div>
      <input
        type="text"
        className="w-full rounded-xl border border-white/10 bg-dark-900/60 py-2.5 pl-10 pr-10 text-sm text-white placeholder-dark-400 outline-none transition-all duration-200 focus:border-brand-500/80 focus:bg-dark-900/85 focus:ring-2 focus:ring-brand-500/20"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-dark-400 hover:text-white transition-colors duration-150"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
