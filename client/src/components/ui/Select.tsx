import React from 'react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, ...props }) => (
  <div className="space-y-1.5">
    {label ? <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300">{label}</label> : null}
    <select
      className={cn(
        'w-full rounded-xl border border-white/10 bg-dark-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500',
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error ? <p className="text-xs text-rose-400">{error}</p> : null}
  </div>
);
