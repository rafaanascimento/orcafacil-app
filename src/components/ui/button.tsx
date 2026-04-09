import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = ({ className, variant = 'primary', ...props }: ButtonProps) => (
  <button
    className={clsx(
      'inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70',
      {
        'bg-action text-white hover:bg-orange-500 focus-visible:ring-orange-400': variant === 'primary',
        'bg-primary text-white hover:bg-blue-800 focus-visible:ring-blue-300': variant === 'secondary',
        'bg-transparent text-primary hover:bg-blue-50 focus-visible:ring-blue-300': variant === 'ghost',
      },
      className,
    )}
    {...props}
  />
);
