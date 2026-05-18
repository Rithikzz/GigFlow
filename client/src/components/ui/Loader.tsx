import React from 'react';

export const Loader: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => (
  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-dark-900/50 px-4 py-3 text-sm text-dark-200">
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-dark-500 border-t-brand-500" />
    <span>{label}</span>
  </div>
);
