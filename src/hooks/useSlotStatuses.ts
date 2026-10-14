import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { SlotStatus, Venue } from '../types';
import { getSlotStatus, venueHours } from '../utils/slots';

export interface SlotInfo {
  hour: number;
  status: SlotStatus;
}

/** Current time, refreshed every minute so slots flip to "past" without a reload. */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** Live availability for every slot of a venue on a date. Re-derives whenever bookings or blocks change. */
export function useSlotStatuses(venue: Venue | undefined, date: string): SlotInfo[] {
  const bookings = useAppStore((s) => s.bookings);
  const blockedSlots = useAppStore((s) => s.blockedSlots);
  const now = useNow();

  return useMemo(() => {
    if (!venue) return [];
    return venueHours(venue).map((hour) => ({
      hour,
      status: getSlotStatus(venue, date, hour, { bookings, blockedSlots, now }),
    }));
  }, [venue, date, bookings, blockedSlots, now]);
}
