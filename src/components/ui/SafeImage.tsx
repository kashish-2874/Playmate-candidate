import { useState, type ImgHTMLAttributes } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../../utils/cn';

/** Image with a fade-in on load and a graceful fallback if the CDN fails. */
export function SafeImage({ className, alt, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  if (status === 'error') {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn('grid place-items-center bg-gradient-to-br from-brand-100 to-slate-200 dark:from-brand-900/40 dark:to-slate-800', className)}
      >
        <ImageOff className="h-8 w-8 text-slate-400" aria-hidden />
      </div>
    );
  }

  return (
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('error')}
      className={cn(
        'bg-slate-200 object-cover transition-opacity duration-500 dark:bg-slate-800',
        status === 'loaded' ? 'opacity-100' : 'opacity-0',
        className,
      )}
      {...rest}
    />
  );
}
