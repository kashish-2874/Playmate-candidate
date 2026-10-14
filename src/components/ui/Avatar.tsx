import { cn } from '../../utils/cn';
import { initials } from '../../utils/format';

const SIZES = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-20 w-20 text-2xl', xl: 'h-24 w-24 text-3xl' };

interface AvatarProps {
  name: string;
  colorClass: string;
  size?: keyof typeof SIZES;
  className?: string;
}

export function Avatar({ name, colorClass, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn('inline-grid shrink-0 place-items-center rounded-full font-bold text-white', colorClass, SIZES[size], className)}
      aria-hidden
    >
      {initials(name) || '?'}
    </span>
  );
}
