import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      'rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.28)] transition duration-200',
      className,
    )}
    {...props}
  />
);
