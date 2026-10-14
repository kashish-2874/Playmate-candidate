import { CUSTOMER_NAMES } from '../data/games';
import type { Booking, Sport, Venue } from '../types';
import { isPrebooked, seededRandom, slotKey, venueHours } from './slots';

export interface OwnerBookingEntry {
  hour: number;
  customer: string;
  sport: Sport;
  amount: number;
  source: 'app-user' | 'customer';
}

export interface VenueDayReport {
  venue: Venue;
  entries: OwnerBookingEntry[];
  revenue: number;
  bookedHours: number;
  totalHours: number;
  blockedHours: number;
  occupancy: number;
}

/** Everything sold for a venue on a date, including past hours (unlike the player-facing slot status). */
export function getVenueDayReport(
  venue: Venue,
  date: string,
  bookings: Booking[],
  blockedSlots: string[],
  currentUserName: string,
): VenueDayReport {
  const hours = venueHours(venue);
  const entries: OwnerBookingEntry[] = [];

  for (const hour of hours) {
    const own = bookings.find(
      (b) => b.status === 'confirmed' && b.venueId === venue.id && b.date === date && b.hours.includes(hour),
    );
    if (own) {
      entries.push({ hour, customer: currentUserName, sport: own.sport, amount: venue.pricePerHour, source: 'app-user' });
      continue;
    }
    if (!venue.isCustom && isPrebooked(venue.id, date, hour)) {
      const key = slotKey(venue.id, date, hour);
      entries.push({
        hour,
        customer: CUSTOMER_NAMES[Math.floor(seededRandom(`${key}|name`) * CUSTOMER_NAMES.length)],
        sport: venue.sports[Math.floor(seededRandom(`${key}|sport`) * venue.sports.length)],
        amount: venue.pricePerHour,
        source: 'customer',
      });
    }
  }

  const blockedHours = hours.filter((h) => blockedSlots.includes(slotKey(venue.id, date, h))).length;
  return {
    venue,
    entries,
    revenue: entries.reduce((sum, e) => sum + e.amount, 0),
    bookedHours: entries.length,
    totalHours: hours.length,
    blockedHours,
    occupancy: hours.length ? entries.length / hours.length : 0,
  };
}
