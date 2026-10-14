import type { Booking, SlotStatus, Venue } from '../types';
import { isPastSlot } from './date';

export function slotKey(venueId: string, date: string, hour: number): string {
  return `${venueId}|${date}|${hour}`;
}

/** FNV-1a hash -> [0, 1). Deterministic, so bookings by "other players" stay stable across reloads. */
export function seededRandom(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10000) / 10000;
}

/** Simulates slots already booked by other players (~25%, busier in the evening). */
export function isPrebooked(venueId: string, date: string, hour: number): boolean {
  const eveningBoost = hour >= 17 && hour <= 21 ? 0.15 : 0;
  return seededRandom(slotKey(venueId, date, hour)) < 0.25 + eveningBoost;
}

export function venueHours(venue: Venue): number[] {
  return Array.from({ length: venue.closeHour - venue.openHour }, (_, i) => venue.openHour + i);
}

export interface SlotContext {
  bookings: Booking[];
  blockedSlots: string[];
  now?: Date;
}

export function getSlotStatus(venue: Venue, date: string, hour: number, ctx: SlotContext): SlotStatus {
  const mine = ctx.bookings.some(
    (b) => b.status === 'confirmed' && b.venueId === venue.id && b.date === date && b.hours.includes(hour),
  );
  if (mine) return 'mine';
  if (isPastSlot(date, hour, ctx.now)) return 'past';
  if (ctx.blockedSlots.includes(slotKey(venue.id, date, hour))) return 'blocked';
  if (!venue.isCustom && isPrebooked(venue.id, date, hour)) return 'booked';
  return 'available';
}

export function isBookingUpcoming(booking: Booking, now = new Date()): boolean {
  if (booking.status !== 'confirmed') return false;
  const lastHour = Math.max(...booking.hours);
  return !isPastSlot(booking.date, lastHour + 1, now);
}
