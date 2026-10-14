import { useMemo } from 'react';
import { SPORTS } from '../data/sports';
import { useAppStore } from '../store/useAppStore';
import type { Sport } from '../types';
import { monthKey, monthLabel, recentMonthKeys } from '../utils/date';
import { isBookingUpcoming } from '../utils/slots';

/** Derives profile stats from historical games + completed bookings. */
export function usePlayerStats() {
  const user = useAppStore((s) => s.user);
  const bookings = useAppStore((s) => s.bookings);
  const games = useAppStore((s) => s.games);

  return useMemo(() => {
    const completed = bookings.filter((b) => b.status === 'confirmed' && !isBookingUpcoming(b));
    const played: Array<{ sport: Sport; date: string; hours: number }> = [
      ...user.history.map((g) => ({ ...g, hours: 1 })),
      ...completed.map((b) => ({ sport: b.sport, date: b.date, hours: b.hours.length })),
    ];

    const perSport = SPORTS.map((sport) => ({ sport, count: played.filter((g) => g.sport === sport).length })).sort(
      (a, b) => b.count - a.count,
    );

    const perMonth = recentMonthKeys(6).map((key) => ({
      key,
      label: monthLabel(key),
      count: played.filter((g) => monthKey(g.date) === key).length,
    }));

    return {
      gamesPlayed: played.length,
      hoursPlayed: played.reduce((sum, g) => sum + g.hours, 0),
      totalSpent: bookings.filter((b) => b.status === 'confirmed').reduce((sum, b) => sum + b.total, 0),
      gamesHosted: games.filter((g) => g.isMine).length,
      favouriteSport: perSport[0]?.count ? perSport[0].sport : undefined,
      perSport,
      perMonth,
    };
  }, [user.history, bookings, games]);
}
