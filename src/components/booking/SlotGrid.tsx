import { Ban, Check, Lock } from 'lucide-react';
import type { SlotInfo } from '../../hooks/useSlotStatuses';
import type { SlotStatus } from '../../types';
import { cn } from '../../utils/cn';
import { hourLabel } from '../../utils/date';

type GridMode = 'player' | 'owner';

interface SlotGridProps {
  slots: SlotInfo[];
  mode: GridMode;
  selected?: number[];
  onSlotClick: (hour: number, status: SlotStatus) => void;
}

const STATUS_TEXT: Record<SlotStatus, string> = {
  available: 'Available',
  booked: 'Booked',
  mine: 'Your booking',
  blocked: 'Unavailable',
  past: 'Past',
};

function isInteractive(status: SlotStatus, mode: GridMode): boolean {
  return mode === 'player' ? status === 'available' : status === 'available' || status === 'blocked';
}

export function SlotGrid({ slots, mode, selected = [], onSlotClick }: SlotGridProps) {
  return (
    <div>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5" aria-label="Time slots">
        {slots.map(({ hour, status }) => {
          const isSelected = selected.includes(hour);
          const interactive = isInteractive(status, mode);
          const ownerLabel = status === 'blocked' ? 'Blocked' : status === 'available' ? 'Open' : STATUS_TEXT[status];
          const label = mode === 'owner' ? ownerLabel : isSelected ? 'Selected' : STATUS_TEXT[status];
          return (
            <li key={hour}>
              <button
                type="button"
                disabled={!interactive}
                aria-pressed={interactive ? (mode === 'player' ? isSelected : status === 'blocked') : undefined}
                aria-label={`${hourLabel(hour)}, ${label}${mode === 'owner' && interactive ? `. Press to ${status === 'blocked' ? 'unblock' : 'block'}` : ''}`}
                onClick={() => onSlotClick(hour, status)}
                className={cn(
                  'flex w-full flex-col items-center rounded-xl border px-2 py-2.5 text-center transition-all',
                  interactive && 'active:scale-95',
                  isSelected && 'border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-600/25',
                  !isSelected && status === 'available' &&
                    'border-slate-200 bg-white hover:border-brand-500 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-brand-500/10',
                  status === 'booked' && 'cursor-not-allowed border-transparent bg-slate-100 text-slate-400 line-through dark:bg-slate-800/60 dark:text-slate-500',
                  status === 'past' && 'cursor-not-allowed border-transparent bg-slate-50 text-slate-300 dark:bg-slate-900/40 dark:text-slate-600',
                  status === 'mine' && 'cursor-default border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300',
                  status === 'blocked' && mode === 'player' && 'cursor-not-allowed border-transparent bg-slate-100 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500',
                  status === 'blocked' && mode === 'owner' &&
                    'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300',
                )}
              >
                <span className="text-sm font-bold">{hourLabel(hour)}</span>
                <span className="mt-0.5 flex items-center gap-1 text-[11px] font-medium opacity-80">
                  {isSelected && <Check className="h-3 w-3" aria-hidden />}
                  {status === 'blocked' && <Ban className="h-3 w-3" aria-hidden />}
                  {status === 'booked' && <Lock className="h-3 w-3" aria-hidden />}
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <SlotLegend mode={mode} />
    </div>
  );
}

function SlotLegend({ mode }: { mode: GridMode }) {
  const items =
    mode === 'player'
      ? [
          ['bg-white border border-slate-300 dark:bg-slate-900 dark:border-slate-600', 'Available'],
          ['bg-brand-600', 'Selected'],
          ['bg-sky-200 dark:bg-sky-500/40', 'Your booking'],
          ['bg-slate-200 dark:bg-slate-700', 'Booked / unavailable'],
        ]
      : [
          ['bg-white border border-slate-300 dark:bg-slate-900 dark:border-slate-600', 'Open (tap to block)'],
          ['bg-amber-200 dark:bg-amber-500/40', 'Blocked (tap to unblock)'],
          ['bg-sky-200 dark:bg-sky-500/40', 'Booked via PlayMate (you)'],
          ['bg-slate-200 dark:bg-slate-700', 'Booked by customer'],
        ];
  return (
    <ul className="muted mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
      {items.map(([swatch, text]) => (
        <li key={text} className="flex items-center gap-1.5">
          <span className={cn('h-3 w-3 rounded', swatch)} aria-hidden />
          {text}
        </li>
      ))}
    </ul>
  );
}
