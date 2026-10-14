import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Clock, ExternalLink, MapPin, MapPinOff, Share2 } from 'lucide-react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { BookingSuccessModal } from '../components/booking/BookingSuccessModal';
import { ConfirmBookingModal } from '../components/booking/ConfirmBookingModal';
import { DateStrip } from '../components/booking/DateStrip';
import { PriceSummary } from '../components/booking/PriceSummary';
import { SlotGrid } from '../components/booking/SlotGrid';
import { Button, ButtonLink } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Rating } from '../components/ui/Rating';
import { SportBadge, SportIcon } from '../components/ui/SportBadge';
import { ToggleChip } from '../components/ui/ToggleChip';
import { AmenityList } from '../components/venue/AmenityList';
import { FavoriteButton } from '../components/venue/FavoriteButton';
import { VenueGallery } from '../components/venue/VenueGallery';
import { SPORT_META } from '../data/sports';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useNow, useSlotStatuses } from '../hooks/useSlotStatuses';
import { useVenue } from '../hooks/useVenues';
import { useAppStore } from '../store/useAppStore';
import type { Booking, Sport, SlotStatus } from '../types';
import { hourLabel, nextDays } from '../utils/date';
import { copyToClipboard } from '../utils/ics';
import { formatDistance, formatINR, pluralize } from '../utils/format';
import { getSlotStatus, venueHours } from '../utils/slots';

const BOOKABLE_DAYS = 7;

export default function VenueDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { hash } = useLocation();
  const venue = useVenue(id);
  useDocumentTitle(venue?.name ?? 'Venue not found');

  const bookings = useAppStore((s) => s.bookings);
  const blockedSlots = useAppStore((s) => s.blockedSlots);
  const createBooking = useAppStore((s) => s.createBooking);
  const mode = useAppStore((s) => s.mode);
  const now = useNow();

  const dates = useMemo(() => nextDays(BOOKABLE_DAYS), []);
  const requestedSport = searchParams.get('sport') as Sport | null;
  const [sport, setSport] = useState<Sport | undefined>(
    venue && requestedSport && venue.sports.includes(requestedSport) ? requestedSport : venue?.sports[0],
  );
  const [date, setDate] = useState(dates[0]);
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const slots = useSlotStatuses(venue, date);

  // "Book again" deep-links to #book: jump straight to the slot picker.
  useEffect(() => {
    if (hash !== '#book') return;
    const timer = window.setTimeout(() => {
      document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      toast('Pick a date and slot to book again', { icon: '🔁' });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [hash]);

  // If a selected slot stops being available (e.g. booked in another tab or blocked by the owner), drop it.
  useEffect(() => {
    const statusOf = (h: number) => slots.find((s) => s.hour === h)?.status;
    const stillAvailable = selected.filter((h) => statusOf(h) === 'available');
    if (stillAvailable.length === selected.length) return;
    setSelected(stillAvailable);
    // Slots that became "mine" were just booked by this user, so no warning for those.
    if (selected.some((h) => statusOf(h) !== 'available' && statusOf(h) !== 'mine')) {
      toast.warning('A slot you picked was just taken and has been removed from your selection.');
    }
  }, [slots, selected]);

  const freeCountByDate = useMemo(() => {
    if (!venue) return {};
    return Object.fromEntries(
      dates.map((d) => [
        d,
        venueHours(venue).filter((h) => getSlotStatus(venue, d, h, { bookings, blockedSlots, now }) === 'available').length,
      ]),
    );
  }, [venue, dates, bookings, blockedSlots, now]);

  if (!venue || !sport) {
    return (
      <div className="container-page">
        <EmptyState
          icon={<MapPinOff className="h-7 w-7" aria-hidden />}
          title="Venue not found"
          description="This venue may have been removed or the link is incorrect."
          action={<ButtonLink to="/">Browse venues</ButtonLink>}
        />
      </div>
    );
  }

  const onDateChange = (next: string) => {
    setDate(next);
    if (selected.length) {
      setSelected([]);
      toast('Selection cleared for the new date');
    }
  };

  const onSlotClick = (hour: number, status: SlotStatus) => {
    if (status !== 'available') return;
    setSelected((prev) => (prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour].sort((a, b) => a - b)));
  };

  const onConfirm = () => {
    setSubmitting(true);
    // Short delay mimics a payment round-trip; the booking itself is validated again in the store.
    window.setTimeout(() => {
      const result = createBooking({ venueId: venue.id, date, hours: selected, sport });
      setSubmitting(false);
      setConfirmOpen(false);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setSelected([]);
      setConfirmed(result.value);
      toast.success(`Booked ${venue.name}!`, { description: 'Saved to My Bookings.' });
    }, 600);
  };

  const onShareVenue = async () => {
    const ok = await copyToClipboard(window.location.href);
    if (ok) toast.success('Venue link copied');
    else toast.error('Could not access the clipboard.');
  };

  const total = venue.pricePerHour * selected.length;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.name}, ${venue.address}`)}`;

  return (
    <div className="container-page">
      <Link
        to="/"
        className="muted mb-4 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> All venues
      </Link>

      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {venue.sports.map((s) => (
              <SportBadge key={s} sport={s} />
            ))}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{venue.name}</h1>
          <p className="muted mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <Rating value={venue.rating} reviewCount={venue.reviewCount} className="text-slate-900 dark:text-slate-100" />
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden /> {venue.area} · {formatDistance(venue.distanceKm)} away
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden /> {hourLabel(venue.openHour)} – {hourLabel(venue.closeHour)}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onShareVenue} icon={<Share2 className="h-4 w-4" aria-hidden />}>
            Share
          </Button>
          <FavoriteButton venueId={venue.id} venueName={venue.name} variant="plain" />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-8">
          <VenueGallery images={venue.images} name={venue.name} />

          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="mb-2 text-lg font-bold">
              About
            </h2>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">{venue.description}</p>
          </section>

          <section aria-labelledby="amenities-heading">
            <h2 id="amenities-heading" className="mb-3 text-lg font-bold">
              Amenities
            </h2>
            <AmenityList amenities={venue.amenities} />
          </section>

          <section aria-labelledby="location-heading">
            <h2 id="location-heading" className="mb-3 text-lg font-bold">
              Location
            </h2>
            <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                {venue.address}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-400"
              >
                Open in Maps <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </section>

          <section aria-labelledby="book-heading" id="book" className="scroll-mt-24">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="book-heading" className="text-lg font-bold">
                Book a slot
              </h2>
              <p className="muted text-sm">{formatINR(venue.pricePerHour)} per hour · 1-hour slots</p>
            </div>

            {mode === 'owner' && (
              <p className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                You're viewing this as a venue owner. Customers see exactly this booking flow.{' '}
                <Link to="/owner" className="font-semibold underline">
                  Manage slots in the dashboard
                </Link>
              </p>
            )}

            {venue.sports.length > 1 && (
              <fieldset className="mb-4">
                <legend className="mb-2 text-sm font-semibold">Sport</legend>
                <div className="flex flex-wrap gap-2">
                  {venue.sports.map((s) => (
                    <ToggleChip key={s} selected={sport === s} onToggle={() => setSport(s)} icon={<SportIcon sport={s} className="h-3.5 w-3.5" />}>
                      {SPORT_META[s].label}
                    </ToggleChip>
                  ))}
                </div>
              </fieldset>
            )}

            <DateStrip
              dates={dates}
              value={date}
              onChange={onDateChange}
              getNote={(d) => (freeCountByDate[d] ? `${freeCountByDate[d]} free` : 'Full')}
            />
            <div className="mt-4">
              <SlotGrid slots={slots} mode="player" selected={selected} onSlotClick={onSlotClick} />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Booking summary">
          <PriceSummary
            venue={venue}
            date={date}
            hours={selected}
            onClear={() => {
              setSelected([]);
              toast('Selection cleared');
            }}
            onContinue={() => setConfirmOpen(true)}
          />
        </aside>
      </div>

      {/* Mobile quick-checkout bar, sits above the bottom navigation. */}
      {selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-16 z-30 md:bottom-0 animate-slide-up border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-lg lg:hidden dark:border-slate-800 dark:bg-slate-900/95">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 md:px-4">
            <div>
              <p className="text-lg font-extrabold leading-tight">{formatINR(total)}</p>
              <p className="muted text-xs">{pluralize(selected.length, 'slot')} selected</p>
            </div>
            <Button size="lg" onClick={() => setConfirmOpen(true)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      <ConfirmBookingModal
        open={confirmOpen}
        venue={venue}
        sport={sport}
        date={date}
        hours={selected}
        submitting={submitting}
        onConfirm={onConfirm}
        onClose={() => setConfirmOpen(false)}
      />
      <BookingSuccessModal booking={confirmed} venue={venue} onClose={() => setConfirmed(null)} />
    </div>
  );
}
