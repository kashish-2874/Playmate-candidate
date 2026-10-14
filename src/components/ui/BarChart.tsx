import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface BarDatum {
  key: string;
  label: string;
  value: number;
  icon?: ReactNode;
}

interface ChartProps {
  title: string;
  data: BarDatum[];
  unit: string;
}

/**
 * Lightweight CSS charts (no chart library, keeps the bundle small).
 * Single series -> single brand hue; values and labels use text ink, not the bar colour.
 * Each chart ships a screen-reader table with the same numbers.
 */
function DataTable({ title, data, unit }: ChartProps) {
  return (
    <table className="sr-only">
      <caption>{title}</caption>
      <thead>
        <tr>
          <th scope="col">Category</th>
          <th scope="col">{unit}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={d.key}>
            <th scope="row">{d.label}</th>
            <td>{d.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Tooltip({ children }: { children: ReactNode }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-white dark:text-slate-900"
    >
      {children}
    </span>
  );
}

export function HorizontalBarChart({ title, data, unit }: ChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <figure>
      <ul className="space-y-3" aria-hidden>
        {data.map((d) => (
          <li key={d.key} className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 truncate font-medium">
              {d.icon}
              {d.label}
            </span>
            <span className="group relative h-5 rounded bg-slate-100 dark:bg-slate-800">
              <span
                className="absolute inset-y-0 left-0 rounded bg-brand-500 transition-[width] duration-700 dark:bg-brand-400"
                style={{ width: `${(d.value / max) * 100}%`, minWidth: d.value ? 6 : 0 }}
              />
              <Tooltip>
                {d.label}: {d.value} {unit.toLowerCase()}
              </Tooltip>
            </span>
            <span className="text-right font-semibold tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
      <DataTable title={title} data={data} unit={unit} />
    </figure>
  );
}

export function ColumnChart({ title, data, unit }: ChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <figure>
      <div className="flex gap-2 sm:gap-4" aria-hidden>
        {data.map((d, i) => (
          <div key={d.key} className="group relative flex flex-1 flex-col items-center">
            <span className={cn('mb-1 text-xs font-semibold tabular-nums', d.value === 0 && 'muted')}>{d.value}</span>
            {/* Plot area: recessive baseline; bars anchored to it. */}
            <div className="flex h-32 w-full items-end justify-center border-b border-slate-200 dark:border-slate-700">
              <div
                className={cn(
                  'w-full max-w-10 rounded-t transition-[height] duration-700',
                  i === data.length - 1 ? 'bg-brand-600 dark:bg-brand-400' : 'bg-brand-300 dark:bg-brand-700',
                )}
                style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value ? 4 : 0 }}
              />
            </div>
            <span className="muted mt-2 text-xs">{d.label}</span>
            <Tooltip>
              {d.label}: {d.value} {unit.toLowerCase()}
            </Tooltip>
          </div>
        ))}
      </div>
      <DataTable title={title} data={data} unit={unit} />
    </figure>
  );
}
