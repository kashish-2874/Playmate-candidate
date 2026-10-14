import { cn } from '../../utils/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Visually hide the label (it stays available to screen readers). */
  hideLabel?: boolean;
  description?: string;
}

export function Switch({ checked, onChange, label, hideLabel, description }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-3 text-left"
    >
      <span
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
          checked ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700',
        )}
      >
        <span
          className={cn(
            'inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </span>
      <span className={cn(hideLabel && 'sr-only')}>
        <span className="block text-sm font-medium">{label}</span>
        {description && <span className="muted block text-xs">{description}</span>}
      </span>
    </button>
  );
}
