import { CalendarDays, Clock, MapPin, RotateCcw, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Booking, Venue } from '../../types';
import { formatLongDate, hoursToRanges } from '../../utils/date';
import { formatINR } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { Button, ButtonLink } from '../ui/Button';
import { SafeImage } from '../ui/SafeImage';
import { SportBadge } from '../ui/SportBadge';
import { ShareBookingActions } from './ShareBookingActions';

interface BookingCardProps {
  booking: Booking;
  venue: Venue;
  variant: 'upcoming' | 'past';
  onCancel?: (booking: Booking) => void;
}

export function BookingCard({ booking, venue, variant, onCancel }: BookingCardProps) {
  const cancelled = booking.status === 'cancelled';

  return (
    <article className="card animate-slide-up overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-36 sm:h-auto sm:w-48 sm:shrink-0">
          <SafeImage src={venue.images[0]} alt={venue.name} className="absolute inset-0 h-full w-full" />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-bold">
                <Link to={`/venue/${venue.id}`} className="hover:underline">
                  {venue.name}
                </Link>
              </h3>
              <p className="muted flex items-center gap-1 text-sm">
                <MapPin className="h-3.5 w-3.5" aria-hidden /> {venue.area}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <SportBadge sport={booking.sport} />
              {variant === 'upcoming' && <Badge tone="brand">Confirmed</Badge>}
              {variant === 'past' && (cancelled ? <Badge tone="danger">Cancelled</Badge> : <Badge>Completed</Badge>)}
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-4">
            <div className="flex items-center gap-2">
              <dt className="sr-only">Date</dt>
              <CalendarDays className="h-4 w-4 text-brand-600" aria-hidden />
              <dd className="font-medium">{formatLongDate(booking.date)}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">Time</dt>
              <Clock className="h-4 w-4 text-brand-600" aria-hidden />
              <dd>{hoursToRanges(booking.hours)}</dd>
            </div>
            <div>
              <dt className="sr-only">Amount</dt>
              <dd className={cancelled ? 'muted font-bold line-through' : 'font-bold'}>{formatINR(booking.total)}</dd>
            </div>
          </dl>

          <div className="mt-auto flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <p className="muted font-mono text-xs">#{booking.id.toUpperCase()}</p>
            {variant === 'upcoming' ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <ShareBookingActions booking={booking} venue={venue} />
                <Button
                  variant="outline"
                  className="text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  onClick={() => onCancel?.(booking)}
                  icon={<XCircle className="h-4 w-4" aria-hidden />}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <ButtonLink
                to={`/venue/${venue.id}?sport=${booking.sport}#book`}
                variant="outline"
                icon={<RotateCcw className="h-4 w-4" aria-hidden />}
              >
                Book again
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
