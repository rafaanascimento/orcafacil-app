import { clsx } from 'clsx';
import type { InputHTMLAttributes } from 'react';

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={clsx(
      'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-gray-400 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-blue-100',
      className,
    )}
    {...props}
  />
);
