import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';
import { Logo } from './Logo';
import { ModeToggle } from './ModeToggle';
import { NavBadge } from './NavBadge';
import { NAV_ITEMS } from './navItems';
import { ThemeToggle } from './ThemeToggle';

export function TopNav() {
  const mode = useAppStore((s) => s.mode);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS[mode].map(({ to, label, icon: Icon, showUpcomingBadge }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
                    )
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                  {showUpcomingBadge && <NavBadge />}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1.5">
          <ModeToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
