import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ToggleChipProps {
  selected: boolean;
  onToggle: () => void;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export function ToggleChip({ selected, onToggle, children, icon, disabled }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-all active:scale-95',
        'disabled:cursor-not-allowed disabled:opacity-60',
        selected
          ? 'border-brand-600 bg-brand-600 text-white shadow-sm shadow-brand-600/20'
          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600',
      )}
    >
      {selected ? <Check className="h-3.5 w-3.5" aria-hidden /> : icon}
      {children}
    </button>
  );
}
