import React from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 hover:bg-brand-500 text-white',
  secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/10',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white',
  ghost: 'bg-transparent hover:bg-white/10 text-dark-200',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variantClass[variant],
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
};
