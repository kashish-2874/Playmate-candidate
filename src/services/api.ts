/**
 * Service layer. Every read of seed data goes through here so a real HTTP API
 * can replace these functions without touching components or the store.
 */
import { createSeedBookings } from '../data/bookings';
import { createSeedGames } from '../data/games';
import { createSeedUser } from '../data/user';
import { VENUES } from '../data/venues';
import type { Booking, Game, UserProfile, Venue } from '../types';

const NETWORK_LATENCY_MS = 650;

function delay<T>(value: T, ms = NETWORK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const api = {
  /** Async, to mimic a network request (drives the loading skeletons). */
  fetchVenues(): Promise<Venue[]> {
    return delay(VENUES);
  },

  getSeedVenues(): Venue[] {
    return VENUES;
  },

  getSeedUser(): UserProfile {
    return createSeedUser();
  },

  getSeedBookings(): Booking[] {
    return createSeedBookings();
  },

  getSeedGames(userName: string): Game[] {
    return createSeedGames(userName);
  },
};
