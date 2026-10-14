import { useRef, type KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';
import { formatDayShort, formatLongDate } from '../../utils/date';

interface DateStripProps {
  dates: string[];
  value: string;
  onChange: (date: string) => void;
  /** Optional per-date note such as "6 free". */
  getNote?: (date: string) => string | undefined;
}

/** Horizontal date picker; behaves as a radio group (arrow keys move selection). */
export function DateStrip({ dates, value, onChange, getNote }: DateStripProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + dates.length) % dates.length;
    refs.current[next]?.focus();
    onChange(dates[next]);
  };

  return (
    <div role="radiogroup" aria-label="Choose a date" className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
      {dates.map((date, index) => {
        const { weekday, day, month } = formatDayShort(date);
        const selected = date === value;
        const note = getNote?.(date);
        return (
          <button
            key={date}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${formatLongDate(date)}${note ? `, ${note}` : ''}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(date)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={cn(
              'flex min-w-[4.25rem] shrink-0 flex-col items-center rounded-2xl border px-3 py-2.5 transition-all',
              selected
                ? 'border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-600/25'
                : 'border-slate-200 bg-white hover:border-brand-400 dark:border-slate-700 dark:bg-slate-900',
            )}
          >
            <span className={cn('text-xs font-medium', selected ? 'text-brand-100' : 'muted')}>{weekday}</span>
            <span className="text-xl font-extrabold leading-tight">{day}</span>
            <span className={cn('text-[11px] font-medium', selected ? 'text-brand-100' : 'muted')}>{note ?? month}</span>
          </button>
        );
      })}
    </div>
  );
}
