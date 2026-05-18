import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => (
  <div className="space-y-1.5">
    {label ? <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300">{label}</label> : null}
    <input
      className={cn('w-full rounded-xl border border-white/10 bg-dark-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500', className)}
      {...props}
    />
    {error ? <p className="text-xs text-rose-400">{error}</p> : null}
  </div>
);
