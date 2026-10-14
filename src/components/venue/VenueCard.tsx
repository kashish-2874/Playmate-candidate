import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Venue } from '../../types';
import { formatDistance, formatINR } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { Rating } from '../ui/Rating';
import { SafeImage } from '../ui/SafeImage';
import { SportBadge } from '../ui/SportBadge';
import { FavoriteButton } from './FavoriteButton';

interface VenueCardProps {
  venue: Venue;
  index?: number;
}

export function VenueCard({ venue, index = 0 }: VenueCardProps) {
  return (
    <article
      className="card group relative flex animate-slide-up flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-brand-500"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SafeImage
          src={venue.images[0]}
          alt={`${venue.name} in ${venue.area}`}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {venue.isCustom && <Badge tone="brand">New</Badge>}
        </div>
        <FavoriteButton venueId={venue.id} venueName={venue.name} className="absolute right-3 top-3 z-10" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold">
              {/* Stretched link: the whole card is clickable, the heart stays a separate control. */}
              <Link to={`/venue/${venue.id}`} className="after:absolute after:inset-0 focus:outline-none">
                {venue.name}
              </Link>
            </h3>
            <p className="muted mt-0.5 flex items-center gap-1 text-sm">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">
                {venue.area} · {formatDistance(venue.distanceKm)}
              </span>
            </p>
          </div>
          <Rating value={venue.rating} className="shrink-0" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {venue.sports.map((sport) => (
            <SportBadge key={sport} sport={sport} />
          ))}
        </div>

        <div className="mt-auto flex items-baseline justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <p>
            <span className="text-lg font-extrabold">{formatINR(venue.pricePerHour)}</span>
            <span className="muted text-sm"> / hour</span>
          </p>
          <span className="text-sm font-semibold text-brand-600 group-hover:underline dark:text-brand-400" aria-hidden>
            Book now →
          </span>
        </div>
      </div>
    </article>
  );
}

export function VenueCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden>
      <div className="aspect-[16/10] animate-pulse bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-3 p-4">
        <div className="flex justify-between">
          <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-10 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="flex gap-2">
          <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
