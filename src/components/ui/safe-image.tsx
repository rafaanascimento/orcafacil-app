'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackLabel?: string;
}

export const SafeImage = ({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackLabel = 'OrçaFácil',
}: SafeImageProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        aria-label={alt}
        className={clsx(
          'flex items-center justify-center rounded-xl bg-white/15 px-4 py-2 text-center text-sm font-semibold text-white/90',
          fallbackClassName,
        )}
      >
        {fallbackLabel}
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} />;
};
