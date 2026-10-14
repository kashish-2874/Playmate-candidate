import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import type { Venue } from '../types';

/** Seed venues plus any venues added from the owner dashboard. */
export function useVenues(): Venue[] {
  const customVenues = useAppStore((s) => s.customVenues);
  return useMemo(() => [...api.getSeedVenues(), ...customVenues], [customVenues]);
}

export function useVenue(id: string | undefined): Venue | undefined {
  const venues = useVenues();
  return venues.find((v) => v.id === id);
}

// Module-level flag: skeletons show on the first visit only, not on every navigation.
let venuesFetched = false;

/** Simulates the initial network fetch so the UI can show loading skeletons. */
export function useVenuesLoading(): boolean {
  const [loading, setLoading] = useState(!venuesFetched);

  useEffect(() => {
    if (venuesFetched) return;
    let active = true;
    api.fetchVenues().then(() => {
      venuesFetched = true;
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return loading;
}
