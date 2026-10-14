import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';

interface FavoriteButtonProps {
  venueId: string;
  venueName: string;
  variant?: 'overlay' | 'plain';
  className?: string;
}

export function FavoriteButton({ venueId, venueName, variant = 'overlay', className }: FavoriteButtonProps) {
  const isFavorite = useAppStore((s) => s.favorites.includes(venueId));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const onClick = () => {
    const added = toggleFavorite(venueId);
    toast.success(added ? `Saved ${venueName}` : `Removed ${venueName} from saved`, {
      icon: added ? '❤️' : undefined,
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${venueName} from saved venues` : `Save ${venueName}`}
      className={cn(
        'grid h-10 w-10 place-items-center rounded-full transition-all active:scale-90',
        variant === 'overlay'
          ? 'bg-white/90 shadow-md backdrop-blur hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900'
          : 'border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800',
        className,
      )}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-colors',
          isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300',
        )}
        aria-hidden
      />
    </button>
  );
}
