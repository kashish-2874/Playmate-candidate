import { useCallback, useMemo, useState } from 'react';
import type { SortOption, Sport, Venue } from '../types';
import { useDebouncedValue } from './useDebouncedValue';

export const DISTANCE_MAX = 20;
export const PRICE_MAX = 2000;

export interface VenueFilterState {
  query: string;
  sports: Sport[];
  maxDistance: number;
  maxPrice: number;
  sort: SortOption;
  savedOnly: boolean;
}

export const DEFAULT_FILTERS: VenueFilterState = {
  query: '',
  sports: [],
  maxDistance: DISTANCE_MAX,
  maxPrice: PRICE_MAX,
  sort: 'recommended',
  savedOnly: false,
};

const SORTERS: Record<SortOption, (a: Venue, b: Venue) => number> = {
  recommended: (a, b) => b.rating * Math.log(b.reviewCount + 2) - a.rating * Math.log(a.reviewCount + 2),
  'price-asc': (a, b) => a.pricePerHour - b.pricePerHour,
  'price-desc': (a, b) => b.pricePerHour - a.pricePerHour,
  distance: (a, b) => a.distanceKm - b.distanceKm,
  rating: (a, b) => b.rating - a.rating,
};

export function applyVenueFilters(venues: Venue[], filters: VenueFilterState, favorites: string[]): Venue[] {
  const query = filters.query.trim().toLowerCase();
  return venues
    .filter((v) => {
      if (query && !`${v.name} ${v.area} ${v.city} ${v.address}`.toLowerCase().includes(query)) return false;
      if (filters.sports.length && !filters.sports.some((s) => v.sports.includes(s))) return false;
      if (v.distanceKm > filters.maxDistance) return false;
      if (v.pricePerHour > filters.maxPrice) return false;
      if (filters.savedOnly && !favorites.includes(v.id)) return false;
      return true;
    })
    .sort(SORTERS[filters.sort]);
}

export function useVenueFilters(venues: Venue[], favorites: string[]) {
  const [filters, setFilters] = useState<VenueFilterState>(DEFAULT_FILTERS);
  const debouncedQuery = useDebouncedValue(filters.query, 150);

  const update = useCallback(<K extends keyof VenueFilterState>(key: K, value: VenueFilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleSport = useCallback((sport: Sport) => {
    setFilters((prev) => ({
      ...prev,
      sports: prev.sports.includes(sport) ? prev.sports.filter((s) => s !== sport) : [...prev.sports, sport],
    }));
  }, []);

  const reset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const results = useMemo(
    () => applyVenueFilters(venues, { ...filters, query: debouncedQuery }, favorites),
    [venues, filters, debouncedQuery, favorites],
  );

  // Sort isn't a filter, so it doesn't count towards "active filters".
  const activeCount =
    (filters.query.trim() ? 1 : 0) +
    filters.sports.length +
    (filters.maxDistance < DISTANCE_MAX ? 1 : 0) +
    (filters.maxPrice < PRICE_MAX ? 1 : 0) +
    (filters.savedOnly ? 1 : 0);

  return { filters, update, toggleSport, reset, results, activeCount };
}
