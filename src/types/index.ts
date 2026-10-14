export type Sport = 'football' | 'cricket' | 'badminton' | 'tennis' | 'basketball';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type Amenity =
  | 'parking'
  | 'floodlights'
  | 'changing-room'
  | 'showers'
  | 'drinking-water'
  | 'cafeteria'
  | 'equipment-rental'
  | 'first-aid'
  | 'wifi';

export interface Venue {
  id: string;
  name: string;
  area: string;
  city: string;
  address: string;
  sports: Sport[];
  pricePerHour: number;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  amenities: Amenity[];
  /** Opening hour (inclusive), 24h clock. */
  openHour: number;
  /** Closing hour (exclusive), 24h clock. */
  closeHour: number;
  /** True for venues created from the owner dashboard. */
  isCustom?: boolean;
}

export interface Booking {
  id: string;
  venueId: string;
  /** ISO date, YYYY-MM-DD (local time). */
  date: string;
  /** Start hours of each booked 1-hour slot, sorted ascending. */
  hours: number[];
  sport: Sport;
  total: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Host {
  name: string;
  avatarColor: string;
}

export interface Game {
  id: string;
  sport: Sport;
  venueId: string;
  date: string;
  hour: number;
  skill: SkillLevel;
  beginnerFriendly: boolean;
  totalPlayers: number;
  playersJoined: number;
  host: Host;
  notes?: string;
  /** Total court cost to be split across players (split-the-cost). */
  totalCost?: number;
  linkedBookingId?: string;
  isMine?: boolean;
  createdAt: string;
}

export interface PlayedGame {
  sport: Sport;
  date: string;
}

export interface UserProfile {
  name: string;
  city: string;
  avatarColor: string;
  sports: Sport[];
  memberSince: string;
  /** Historical games played before the bookings in this app. */
  history: PlayedGame[];
}

export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'distance' | 'rating';

export type AppMode = 'player' | 'owner';

export type Theme = 'light' | 'dark';

export type SlotStatus = 'available' | 'booked' | 'mine' | 'blocked' | 'past';
