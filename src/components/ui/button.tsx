import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  leftIcon?: ReactNode;
  isLoading?: boolean;
}

export const Button = ({
  className,
  variant = 'primary',
  leftIcon,
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={clsx(
      'inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:py-3',
      {
        'bg-action text-white shadow-[0_10px_22px_-14px_rgba(249,115,22,0.85)] hover:bg-orange-500 focus-visible:ring-orange-400':
          variant === 'primary',
        'bg-primary text-white shadow-[0_10px_20px_-14px_rgba(30,58,138,0.9)] hover:bg-blue-800 focus-visible:ring-blue-300':
          variant === 'secondary',
        'bg-transparent text-primary hover:bg-blue-50 focus-visible:ring-blue-300': variant === 'ghost',
        'border border-blue-100 bg-white text-primary hover:bg-blue-50 focus-visible:ring-blue-200': variant === 'outline',
        'bg-red-500 text-white shadow-[0_8px_18px_-14px_rgba(239,68,68,0.95)] hover:bg-red-600 focus-visible:ring-red-300':
          variant === 'danger',
      },
      className,
    )}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : leftIcon}
    <span>{children}</span>
  </button>
);
