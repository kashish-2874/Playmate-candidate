import { Store, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';

/** Switches between the player app and the venue-owner dashboard. */
export function ModeToggle({ compact = false }: { compact?: boolean }) {
  const mode = useAppStore((s) => s.mode);
  const setMode = useAppStore((s) => s.setMode);
  const navigate = useNavigate();
  const isOwner = mode === 'owner';

  const onClick = () => {
    const next = isOwner ? 'player' : 'owner';
    setMode(next);
    navigate(next === 'owner' ? '/owner' : '/');
    toast.success(next === 'owner' ? 'Switched to Venue Owner mode' : 'Switched to Player mode');
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOwner}
      onClick={onClick}
      aria-label="Venue owner mode"
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-xl border text-sm font-semibold transition-colors',
        compact ? 'px-2.5' : 'px-3',
        isOwner
          ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300'
          : 'border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
      )}
    >
      {isOwner ? <Store className="h-4 w-4" aria-hidden /> : <UserRound className="h-4 w-4" aria-hidden />}
      <span>{isOwner ? 'Owner' : 'Player'}</span>
      <span
        className={cn(
          'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
          isOwner ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600',
        )}
        aria-hidden
      >
        <span
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
            isOwner ? 'translate-x-[18px]' : 'translate-x-0.5',
          )}
        />
      </span>
    </button>
  );
}
