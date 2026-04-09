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
      'inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70',
      {
        'bg-action text-white shadow-sm hover:bg-orange-500 focus-visible:ring-orange-400': variant === 'primary',
        'bg-primary text-white hover:bg-blue-800 focus-visible:ring-blue-300': variant === 'secondary',
        'bg-transparent text-primary hover:bg-blue-50 focus-visible:ring-blue-300': variant === 'ghost',
        'border border-blue-100 bg-white text-primary hover:bg-blue-50 focus-visible:ring-blue-200': variant === 'outline',
        'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-300': variant === 'danger',
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
