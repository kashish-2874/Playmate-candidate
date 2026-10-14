import { CalendarDays, Compass, LayoutDashboard, UserRound, Users, type LucideIcon } from 'lucide-react';
import type { AppMode } from '../../types';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Shows the upcoming-bookings badge. */
  showUpcomingBadge?: boolean;
}

export const NAV_ITEMS: Record<AppMode, NavItem[]> = {
  player: [
    { to: '/', label: 'Explore', icon: Compass },
    { to: '/players', label: 'Find Players', icon: Users },
    { to: '/bookings', label: 'Bookings', icon: CalendarDays, showUpcomingBadge: true },
    { to: '/profile', label: 'Profile', icon: UserRound },
  ],
  owner: [
    { to: '/owner', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/', label: 'Listings', icon: Compass },
    { to: '/profile', label: 'Profile', icon: UserRound },
  ],
};
