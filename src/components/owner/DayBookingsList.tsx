import { CalendarX } from 'lucide-react';
import { SPORT_META } from '../../data/sports';
import type { OwnerBookingEntry } from '../../utils/owner';
import { hourLabel } from '../../utils/date';
import { formatINR } from '../../utils/format';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

export function DayBookingsList({ entries }: { entries: OwnerBookingEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <CalendarX className="h-8 w-8 text-slate-400" aria-hidden />
        <p className="mt-2 text-sm font-semibold">No bookings for this day yet</p>
        <p className="muted text-xs">New bookings appear here instantly.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
      {entries.map((entry) => (
        <li key={entry.hour} className="flex items-center gap-3 py-3">
          <span className="w-16 shrink-0 text-sm font-bold tabular-nums">{hourLabel(entry.hour)}</span>
          <Avatar name={entry.customer} colorClass={entry.source === 'app-user' ? 'bg-sky-500' : 'bg-slate-400 dark:bg-slate-600'} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{entry.customer}</p>
            <p className="muted text-xs">{SPORT_META[entry.sport].label}</p>
          </div>
          {entry.source === 'app-user' && <Badge tone="info">Demo user</Badge>}
          <span className="text-sm font-semibold tabular-nums">{formatINR(entry.amount)}</span>
        </li>
      ))}
    </ul>
  );
}
