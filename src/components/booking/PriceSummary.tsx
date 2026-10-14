import { CalendarDays, Clock, X } from 'lucide-react';
import type { Venue } from '../../types';
import { formatLongDate, hoursToRanges } from '../../utils/date';
import { formatINR, pluralize } from '../../utils/format';
import { Button } from '../ui/Button';

interface PriceSummaryProps {
  venue: Venue;
  date: string;
  hours: number[];
  onClear: () => void;
  onContinue: () => void;
}

export function PriceSummary({ venue, date, hours, onClear, onContinue }: PriceSummaryProps) {
  const total = venue.pricePerHour * hours.length;
  const empty = hours.length === 0;

  return (
    <div className="card p-5">
      <h2 className="text-base font-bold">Booking summary</h2>
      {empty ? (
        <p className="muted mt-3 text-sm">Select one or more time slots to see the price.</p>
      ) : (
        <div className="mt-3 space-y-2 text-sm" aria-live="polite">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-brand-600" aria-hidden />
            {formatLongDate(date)}
          </p>
          <p className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
            {hoursToRanges(hours)}
          </p>
          <div className="flex justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
            <span className="muted">
              {formatINR(venue.pricePerHour)} × {pluralize(hours.length, 'hour')}
            </span>
            <span>{formatINR(total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="muted">Convenience fee</span>
            <span className="font-medium text-brand-600 dark:text-brand-400">Free</span>
          </div>
        </div>
      )}
      <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="muted text-sm">Total</span>
        <span className="text-2xl font-extrabold" aria-live="polite">
          {formatINR(total)}
        </span>
      </div>
      <Button size="lg" className="mt-4 w-full" disabled={empty} onClick={onContinue}>
        {empty ? 'Select a slot' : `Book ${pluralize(hours.length, 'slot')}`}
      </Button>
      {!empty && (
        <button
          type="button"
          onClick={onClear}
          className="muted mx-auto mt-3 flex items-center gap-1 text-xs font-medium hover:text-slate-900 dark:hover:text-white"
        >
          <X className="h-3.5 w-3.5" aria-hidden /> Clear selection
        </button>
      )}
    </div>
  );
}
