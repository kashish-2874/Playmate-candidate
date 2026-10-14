import { useState } from 'react';
import { CalendarClock, History } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { BookingCard } from '../components/booking/BookingCard';
import { ButtonLink } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { Tabs } from '../components/ui/Tabs';
import { useBookingGroups } from '../hooks/useBookings';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useVenues } from '../hooks/useVenues';
import { useAppStore } from '../store/useAppStore';
import type { Booking } from '../types';
import { formatLongDate, hoursToRanges } from '../utils/date';
import { formatINR } from '../utils/format';

type TabId = 'upcoming' | 'past';

export default function BookingsPage() {
  useDocumentTitle('My bookings');
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: TabId = searchParams.get('tab') === 'past' ? 'past' : 'upcoming';
  const { upcoming, past } = useBookingGroups();
  const venues = useVenues();
  const games = useAppStore((s) => s.games);
  const cancelBooking = useAppStore((s) => s.cancelBooking);
  const restoreBooking = useAppStore((s) => s.restoreBooking);
  const [toCancel, setToCancel] = useState<Booking | null>(null);

  const list = tab === 'upcoming' ? upcoming : past;
  const venueById = (id: string) => venues.find((v) => v.id === id);
  const linkedGame = toCancel ? games.find((g) => g.linkedBookingId === toCancel.id) : undefined;

  const onConfirmCancel = () => {
    if (!toCancel) return;
    const result = cancelBooking(toCancel.id);
    setToCancel(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('Booking cancelled — the slot is free for others again', {
      description: `Refund of ${formatINR(result.value.total)} initiated.`,
      action: {
        label: 'Undo',
        onClick: () => {
          const restored = restoreBooking(result.value.id);
          if (restored.ok) toast.success('Booking restored');
          else toast.error(restored.error);
        },
      },
    });
  };

  return (
    <div className="container-page max-w-4xl">
      <PageHeader title="My bookings" subtitle="Manage your upcoming games and revisit past ones." />

      <div className="mb-6">
        <Tabs
          label="Booking status"
          idPrefix="bookings"
          value={tab}
          onChange={(id) => setSearchParams(id === 'past' ? { tab: 'past' } : {}, { replace: true })}
          tabs={[
            { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
            { id: 'past', label: 'Past', count: past.length },
          ]}
        />
      </div>

      <div role="tabpanel" id={`bookings-panel-${tab}`} aria-labelledby={`bookings-tab-${tab}`} tabIndex={0} className="focus:outline-none">
        {list.length === 0 ? (
          tab === 'upcoming' ? (
            <EmptyState
              icon={<CalendarClock className="h-7 w-7" aria-hidden />}
              title="No upcoming bookings"
              description="Find a turf or court nearby and lock in your next game in under a minute."
              action={<ButtonLink to="/">Explore venues</ButtonLink>}
            />
          ) : (
            <EmptyState
              icon={<History className="h-7 w-7" aria-hidden />}
              title="No past bookings yet"
              description="Games you've played will show up here so you can book them again in one tap."
              action={<ButtonLink to="/" variant="outline">Explore venues</ButtonLink>}
            />
          )
        ) : (
          <ul className="space-y-4">
            {list.map((booking) => {
              const venue = venueById(booking.venueId);
              if (!venue) return null;
              return (
                <li key={booking.id}>
                  <BookingCard booking={booking} venue={venue} variant={tab} onCancel={setToCancel} />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={toCancel !== null}
        title="Cancel this booking?"
        description={
          toCancel
            ? `${venueById(toCancel.venueId)?.name} · ${formatLongDate(toCancel.date)}, ${hoursToRanges(toCancel.hours)}`
            : undefined
        }
        confirmLabel="Yes, cancel booking"
        cancelLabel="Keep booking"
        tone="danger"
        onConfirm={onConfirmCancel}
        onCancel={() => setToCancel(null)}
      >
        <p className="text-sm">
          You'll get a full refund of <strong>{toCancel && formatINR(toCancel.total)}</strong> and the slot will be released immediately.
        </p>
        {linkedGame && (
          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
            Your posted game for this slot will also be removed from Find Players.
          </p>
        )}
      </ConfirmDialog>
    </div>
  );
}
