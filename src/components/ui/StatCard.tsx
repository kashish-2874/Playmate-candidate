import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  hint?: ReactNode;
}

export function StatCard({ label, value, icon, hint }: StatCardProps) {
  return (
    <div className="card flex items-start gap-3 p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="muted text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="mt-0.5 truncate text-xl font-extrabold">{value}</p>
        {hint && <p className="muted mt-0.5 text-xs">{hint}</p>}
      </div>
    </div>
  );
}
