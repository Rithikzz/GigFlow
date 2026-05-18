import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, onAction }) => (
  <div className="rounded-xl border border-dashed border-white/15 bg-dark-900/40 p-8 text-center">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm text-dark-300">{description}</p>
    {actionLabel && onAction ? (
      <div className="mt-4">
        <Button onClick={onAction}>{actionLabel}</Button>
      </div>
    ) : null}
  </div>
);
