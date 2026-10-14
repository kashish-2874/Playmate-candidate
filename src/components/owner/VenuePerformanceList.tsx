import type { VenueDayReport } from '../../utils/owner';
import { cn } from '../../utils/cn';
import { formatINR } from '../../utils/format';

interface VenuePerformanceListProps {
  reports: VenueDayReport[];
  selectedId: string;
  onSelect: (venueId: string) => void;
}

/** Today's occupancy per venue; clicking a row opens it in the slot manager. */
export function VenuePerformanceList({ reports, selectedId, onSelect }: VenuePerformanceListProps) {
  return (
    <ul className="space-y-1">
      {reports.map(({ venue, occupancy, revenue }) => {
        const pct = Math.round(occupancy * 100);
        return (
          <li key={venue.id}>
            <button
              type="button"
              onClick={() => onSelect(venue.id)}
              aria-current={venue.id === selectedId}
              className={cn(
                'w-full rounded-xl px-3 py-2.5 text-left transition-colors',
                venue.id === selectedId ? 'bg-brand-50 dark:bg-brand-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60',
              )}
            >
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="truncate font-semibold">{venue.name}</span>
                <span className="muted shrink-0 text-xs tabular-nums">
                  {formatINR(revenue)} · <span className="font-semibold text-slate-900 dark:text-white">{pct}%</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden>
                <div className="h-full rounded-full bg-brand-500 transition-[width] duration-700" style={{ width: `${pct}%` }} />
              </div>
              <span className="sr-only">
                {pct}% occupancy, {formatINR(revenue)} revenue today
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
