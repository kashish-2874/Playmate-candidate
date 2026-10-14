import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { defaultImagesFor } from '../data/images';
import { api } from '../services/api';
import type { AppMode, Booking, Game, SkillLevel, Sport, Theme, UserProfile, Venue } from '../types';
import { uid } from '../utils/format';
import { getSlotStatus, slotKey } from '../utils/slots';

export interface NewBookingInput {
  venueId: string;
  date: string;
  hours: number[];
  sport: Sport;
}

export interface NewGameInput {
  sport: Sport;
  venueId: string;
  date: string;
  hour: number;
  skill: SkillLevel;
  beginnerFriendly: boolean;
  totalPlayers: number;
  playersJoined: number;
  notes?: string;
  linkedBookingId?: string;
}

export interface NewVenueInput {
  name: string;
  area: string;
  sports: Sport[];
  pricePerHour: number;
  openHour: number;
  closeHour: number;
  description: string;
}

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

interface AppState {
  theme: Theme;
  mode: AppMode;
  user: UserProfile;
  favorites: string[];
  bookings: Booking[];
  games: Game[];
  joinRequests: string[];
  blockedSlots: string[];
  customVenues: Venue[];
}

interface AppActions {
  toggleTheme: () => Theme;
  setMode: (mode: AppMode) => void;
  toggleFavorite: (venueId: string) => boolean;
  createBooking: (input: NewBookingInput) => Result<Booking>;
  cancelBooking: (bookingId: string) => Result<Booking>;
  restoreBooking: (bookingId: string) => Result<Booking>;
  requestToJoin: (gameId: string) => void;
  postGame: (input: NewGameInput) => Game;
  updateProfile: (patch: Partial<Pick<UserProfile, 'name' | 'city' | 'sports' | 'avatarColor'>>) => void;
  toggleBlockedSlot: (venueId: string, date: string, hour: number) => Result<'blocked' | 'unblocked'>;
  addVenue: (input: NewVenueInput) => Venue;
  resetDemo: () => void;
}

export type AppStore = AppState & AppActions;

function allVenues(state: AppState): Venue[] {
  return [...api.getSeedVenues(), ...state.customVenues];
}

function createInitialState(): AppState {
  const user = api.getSeedUser();
  const prefersDark =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return {
    theme: prefersDark ? 'dark' : 'light',
    mode: 'player',
    user,
    favorites: ['smash-point', 'kickoff-arena'],
    bookings: api.getSeedBookings(),
    games: api.getSeedGames(user.name),
    joinRequests: [],
    blockedSlots: [],
    customVenues: [],
  };
}

/** First requested hour that is no longer bookable (e.g. taken in another tab since it was picked). */
function findUnavailableHour(state: AppState, input: NewBookingInput): number | undefined {
  const venue = allVenues(state).find((v) => v.id === input.venueId);
  if (!venue) return input.hours[0];
  return input.hours.find(
    (hour) =>
      getSlotStatus(venue, input.date, hour, { bookings: state.bookings, blockedSlots: state.blockedSlots }) !==
      'available',
  );
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      toggleTheme: () => {
        const theme: Theme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme });
        return theme;
      },

      setMode: (mode) => set({ mode }),

      toggleFavorite: (venueId) => {
        const isFavorite = get().favorites.includes(venueId);
        set((s) => ({
          favorites: isFavorite ? s.favorites.filter((id) => id !== venueId) : [...s.favorites, venueId],
        }));
        return !isFavorite;
      },

      createBooking: (input) => {
        const state = get();
        const venue = allVenues(state).find((v) => v.id === input.venueId);
        if (!venue) return { ok: false, error: 'Venue not found.' };
        if (input.hours.length === 0) return { ok: false, error: 'Pick at least one slot.' };
        if (findUnavailableHour(state, input) !== undefined) {
          return { ok: false, error: 'One of your slots was just taken. Please pick another.' };
        }
        const booking: Booking = {
          id: uid('bk'),
          venueId: input.venueId,
          date: input.date,
          hours: [...input.hours].sort((a, b) => a - b),
          sport: input.sport,
          total: venue.pricePerHour * input.hours.length,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ bookings: [booking, ...s.bookings] }));
        return { ok: true, value: booking };
      },

      cancelBooking: (bookingId) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (!booking || booking.status !== 'confirmed') return { ok: false, error: 'Booking not found.' };
        const cancelled: Booking = { ...booking, status: 'cancelled' };
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === bookingId ? cancelled : b)),
          // A hosted game can't exist without its court.
          games: s.games.filter((g) => g.linkedBookingId !== bookingId),
        }));
        return { ok: true, value: cancelled };
      },

      restoreBooking: (bookingId) => {
        const state = get();
        const booking = state.bookings.find((b) => b.id === bookingId);
        if (!booking || booking.status !== 'cancelled') return { ok: false, error: 'Booking not found.' };
        if (findUnavailableHour(state, booking) !== undefined) {
          return { ok: false, error: 'Those slots have already been taken.' };
        }
        const restored: Booking = { ...booking, status: 'confirmed' };
        set((s) => ({ bookings: s.bookings.map((b) => (b.id === bookingId ? restored : b)) }));
        return { ok: true, value: restored };
      },

      requestToJoin: (gameId) =>
        set((s) => (s.joinRequests.includes(gameId) ? s : { joinRequests: [...s.joinRequests, gameId] })),

      postGame: (input) => {
        const { user, bookings } = get();
        const linked = input.linkedBookingId ? bookings.find((b) => b.id === input.linkedBookingId) : undefined;
        const game: Game = {
          id: uid('gm'),
          ...input,
          notes: input.notes?.trim() || undefined,
          totalCost: linked?.total,
          host: { name: user.name, avatarColor: user.avatarColor },
          isMine: true,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ games: [game, ...s.games] }));
        return game;
      },

      updateProfile: (patch) =>
        set((s) => {
          const user = { ...s.user, ...patch };
          // Keep the host card on the user's own games in sync with their profile.
          const games = s.games.map((g) =>
            g.isMine ? { ...g, host: { name: user.name, avatarColor: user.avatarColor } } : g,
          );
          return { user, games };
        }),

      toggleBlockedSlot: (venueId, date, hour) => {
        const state = get();
        const key = slotKey(venueId, date, hour);
        if (state.blockedSlots.includes(key)) {
          set({ blockedSlots: state.blockedSlots.filter((k) => k !== key) });
          return { ok: true, value: 'unblocked' };
        }
        const venue = allVenues(state).find((v) => v.id === venueId);
        if (!venue) return { ok: false, error: 'Venue not found.' };
        const status = getSlotStatus(venue, date, hour, state);
        if (status !== 'available') {
          return { ok: false, error: status === 'past' ? 'That slot is in the past.' : 'That slot is already booked.' };
        }
        set({ blockedSlots: [...state.blockedSlots, key] });
        return { ok: true, value: 'blocked' };
      },

      addVenue: (input) => {
        const venue: Venue = {
          id: uid('venue'),
          name: input.name.trim(),
          area: input.area.trim(),
          city: 'Bengaluru',
          address: `${input.area.trim()}, Bengaluru`,
          sports: input.sports,
          pricePerHour: input.pricePerHour,
          distanceKm: Math.round((2 + Math.random() * 10) * 10) / 10,
          rating: 0,
          reviewCount: 0,
          images: defaultImagesFor(input.sports),
          description: input.description.trim(),
          amenities: ['drinking-water', 'first-aid'],
          openHour: input.openHour,
          closeHour: input.closeHour,
          isCustom: true,
        };
        set((s) => ({ customVenues: [...s.customVenues, venue] }));
        return venue;
      },

      resetDemo: () => set({ ...createInitialState(), theme: get().theme }),
    }),
    {
      name: 'playmate-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state): AppState => ({
        theme: state.theme,
        mode: state.mode,
        user: state.user,
        favorites: state.favorites,
        bookings: state.bookings,
        games: state.games,
        joinRequests: state.joinRequests,
        blockedSlots: state.blockedSlots,
        customVenues: state.customVenues,
      }),
    },
  ),
);

/** Keeps multiple open tabs in sync, so a slot booked in one tab is unavailable in the other immediately. */
export function syncStoreAcrossTabs(): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === 'playmate-store') void useAppStore.persist.rehydrate();
  };
  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
}
