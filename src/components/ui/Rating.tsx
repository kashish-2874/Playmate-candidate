import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RatingProps {
  value: number;
  reviewCount?: number;
  className?: string;
}

export function Rating({ value, reviewCount, className }: RatingProps) {
  if (value === 0) {
    return <span className={cn('text-xs font-semibold text-brand-600 dark:text-brand-400', className)}>New</span>;
  }
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm font-semibold', className)}>
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
      <span>
        <span className="sr-only">Rated </span>
        {value.toFixed(1)}
        <span className="sr-only"> out of 5</span>
      </span>
      {reviewCount !== undefined && <span className="muted font-normal">({reviewCount})</span>}
    </span>
  );
}
