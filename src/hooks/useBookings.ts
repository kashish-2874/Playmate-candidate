import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Booking } from '../types';
import { slotStart } from '../utils/date';
import { isBookingUpcoming } from '../utils/slots';

function startTime(b: Booking): number {
  return slotStart(b.date, b.hours[0]).getTime();
}

/** Splits the user's bookings into upcoming (soonest first) and past (most recent first). */
export function useBookingGroups() {
  const bookings = useAppStore((s) => s.bookings);
  return useMemo(() => {
    const upcoming = bookings.filter((b) => isBookingUpcoming(b)).sort((a, b) => startTime(a) - startTime(b));
    const past = bookings.filter((b) => !isBookingUpcoming(b)).sort((a, b) => startTime(b) - startTime(a));
    return { upcoming, past };
  }, [bookings]);
}

export function useUpcomingCount(): number {
  return useBookingGroups().upcoming.length;
}
