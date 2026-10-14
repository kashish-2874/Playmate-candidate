import { Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';

export function ThemeToggle() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  const onClick = () => {
    const next = toggleTheme();
    toast(next === 'dark' ? 'Dark mode on' : 'Light mode on', { icon: next === 'dark' ? '🌙' : '☀️' });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
    </button>
  );
}
