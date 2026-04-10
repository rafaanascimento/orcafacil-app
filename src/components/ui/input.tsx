import { clsx } from 'clsx';
import type { InputHTMLAttributes } from 'react';

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={clsx(
      'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-gray-400 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-blue-100 sm:px-4 sm:py-3',
      className,
    )}
    {...props}
  />
);
