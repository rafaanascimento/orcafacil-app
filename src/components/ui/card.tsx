import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      'rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-200',
      className,
    )}
    {...props}
  />
);
