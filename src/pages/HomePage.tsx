import { useState } from 'react';
import { ArrowUpDown, Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { VenueCard, VenueCardSkeleton } from '../components/venue/VenueCard';
import { VenueFilterPanel } from '../components/venue/VenueFilterPanel';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useVenueFilters } from '../hooks/useVenueFilters';
import { useVenues, useVenuesLoading } from '../hooks/useVenues';
import { useAppStore } from '../store/useAppStore';
import type { SortOption } from '../types';
import { pluralize } from '../utils/format';

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'distance', label: 'Nearest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

export default function HomePage() {
  useDocumentTitle('Explore venues');
  const venues = useVenues();
  const loading = useVenuesLoading();
  const favorites = useAppStore((s) => s.favorites);
  const userName = useAppStore((s) => s.user.name);
  const { filters, update, toggleSport, reset, results, activeCount } = useVenueFilters(venues, favorites);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const onReset = () => {
    reset();
    toast('Filters cleared', { icon: '🧹' });
  };

  const panel = (
    <VenueFilterPanel
      filters={filters}
      activeCount={activeCount}
      savedCount={favorites.length}
      onToggleSport={toggleSport}
      onChange={update}
      onReset={onReset}
    />
  );

  return (
    <div className="container-page">
      <section className="mb-6">
        <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">Hey {userName.split(' ')[0]} 👋</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-4xl">Find a venue and get playing</h1>
        <p className="muted mt-2 max-w-xl">
          Turfs, courts and nets across Bengaluru. Real-time slots, instant confirmation.
        </p>
      </section>

      <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-slate-200/70 bg-slate-50/90 px-4 py-3 backdrop-blur-lg sm:mx-0 sm:rounded-2xl sm:border sm:px-3 dark:border-slate-800 dark:bg-slate-950/90">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <label htmlFor="venue-search" className="sr-only">
              Search venues by name or location
            </label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              id="venue-search"
              type="search"
              value={filters.query}
              onChange={(e) => update('query', e.target.value)}
              placeholder="Search venue or area"
              className="input pl-10 pr-10"
              autoComplete="off"
            />
            {filters.query && (
              <button
                type="button"
                onClick={() => update('query', '')}
                className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
          <div className="relative hidden sm:block">
            <label htmlFor="venue-sort" className="sr-only">
              Sort venues
            </label>
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <select
              id="venue-sort"
              value={filters.sort}
              onChange={(e) => update('sort', e.target.value as SortOption)}
              className="input w-52 pl-9"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="outline"
            className="relative lg:hidden"
            onClick={() => setFiltersOpen(true)}
            icon={<SlidersHorizontal className="h-4 w-4" aria-hidden />}
            aria-label={`Filters${activeCount ? `, ${activeCount} active` : ''}`}
          >
            <span className="hidden sm:inline">Filters</span>
            {activeCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] text-white">
                {activeCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="card sticky top-40 p-5">{panel}</div>
        </aside>

        <section aria-label="Venues">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="muted text-sm" aria-live="polite">
              {loading ? 'Loading venues…' : `${pluralize(results.length, 'venue')} found`}
            </p>
            <div className="sm:hidden">
              <label htmlFor="venue-sort-mobile" className="sr-only">
                Sort venues
              </label>
              <select
                id="venue-sort-mobile"
                value={filters.sort}
                onChange={(e) => update('sort', e.target.value as SortOption)}
                className="input h-9 py-1.5 text-xs"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading venues">
              {Array.from({ length: 6 }, (_, i) => (
                <VenueCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              icon={<SearchX className="h-7 w-7" aria-hidden />}
              title={filters.savedOnly && favorites.length === 0 ? 'No saved venues yet' : 'No venues match your filters'}
              description={
                filters.savedOnly && favorites.length === 0
                  ? 'Tap the heart on any venue to save it here for quick access.'
                  : 'Try widening the distance or price range, or picking a different sport.'
              }
              action={<Button onClick={onReset}>Reset filters</Button>}
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((venue, i) => (
                <VenueCard key={venue.id} venue={venue} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        footer={
          <Button className="w-full sm:w-auto" onClick={() => setFiltersOpen(false)}>
            Show {pluralize(results.length, 'venue')}
          </Button>
        }
      >
        {panel}
      </Modal>
    </div>
  );
}
