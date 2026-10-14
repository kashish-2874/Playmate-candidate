import { CircleDot, Dribbble, Feather, Goal, Swords, type LucideIcon } from 'lucide-react';
import { SPORT_META } from '../../data/sports';
import type { Sport } from '../../types';
import { cn } from '../../utils/cn';

const SPORT_ICONS: Record<Sport, LucideIcon> = {
  football: Goal,
  cricket: Swords,
  badminton: Feather,
  tennis: CircleDot,
  basketball: Dribbble,
};

export function SportIcon({ sport, className }: { sport: Sport; className?: string }) {
  const Icon = SPORT_ICONS[sport];
  return <Icon className={cn('h-4 w-4', className)} aria-hidden />;
}

export function SportBadge({ sport, className }: { sport: Sport; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        SPORT_META[sport].badgeClass,
        className,
      )}
    >
      <SportIcon sport={sport} className="h-3.5 w-3.5" />
      {SPORT_META[sport].label}
    </span>
  );
}
