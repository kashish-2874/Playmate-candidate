import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';
import { NavBadge } from './NavBadge';
import { NAV_ITEMS } from './navItems';

export function BottomNav() {
  const mode = useAppStore((s) => s.mode);
  const items = NAV_ITEMS[mode];

  return (
    <nav
      aria-label="Main"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-lg md:hidden dark:border-slate-800 dark:bg-slate-950/95"
    >
      <ul className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map(({ to, label, icon: Icon, showUpcomingBadge }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors',
                  isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute top-0 h-0.5 w-10 rounded-full bg-brand-600 dark:bg-brand-400" />}
                  <span className="relative">
                    <Icon className="h-5 w-5" aria-hidden />
                    {showUpcomingBadge && <NavBadge className="absolute -right-3 -top-2 h-4 min-w-4 px-1 text-[10px]" />}
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
