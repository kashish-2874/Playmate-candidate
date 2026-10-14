import type { Booking } from '../types';
import { relativeISO } from '../utils/date';

/** Bookings the demo user already has. Dates are relative so the demo always looks fresh. */
export function createSeedBookings(): Booking[] {
  const createdAt = new Date().toISOString();
  return [
    {
      id: 'bk-seed-1',
      venueId: 'kickoff-arena',
      date: relativeISO(1),
      hours: [19, 20],
      sport: 'football',
      total: 2800,
      status: 'confirmed',
      createdAt,
    },
    {
      id: 'bk-seed-2',
      venueId: 'smash-point',
      date: relativeISO(3),
      hours: [7],
      sport: 'badminton',
      total: 500,
      status: 'confirmed',
      createdAt,
    },
    {
      id: 'bk-seed-3',
      venueId: 'turf-republic',
      date: relativeISO(-4),
      hours: [20],
      sport: 'cricket',
      total: 1800,
      status: 'confirmed',
      createdAt,
    },
    {
      id: 'bk-seed-4',
      venueId: 'shuttle-zone',
      date: relativeISO(-9),
      hours: [18, 19],
      sport: 'badminton',
      total: 800,
      status: 'confirmed',
      createdAt,
    },
    {
      id: 'bk-seed-5',
      venueId: 'kickoff-arena',
      date: relativeISO(-16),
      hours: [21],
      sport: 'football',
      total: 1400,
      status: 'cancelled',
      createdAt,
    },
  ];
}
