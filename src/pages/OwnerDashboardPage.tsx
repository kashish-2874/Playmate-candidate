import { useMemo, useState } from 'react';
import { Ban, CalendarCheck, ExternalLink, IndianRupee, Percent, Plus, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DateStrip } from '../components/booking/DateStrip';
import { SlotGrid } from '../components/booking/SlotGrid';
import { AddVenueModal } from '../components/owner/AddVenueModal';
import { DayBookingsList } from '../components/owner/DayBookingsList';
import { VenuePerformanceList } from '../components/owner/VenuePerformanceList';
import { Button, ButtonLink } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSlotStatuses } from '../hooks/useSlotStatuses';
import { useVenues } from '../hooks/useVenues';
import { useAppStore } from '../store/useAppStore';
import type { SlotStatus } from '../types';
import { formatLongDate, hourLabel, nextDays, todayISO } from '../utils/date';
import { formatINR } from '../utils/format';
import { getVenueDayReport } from '../utils/owner';

export default function OwnerDashboardPage() {
  useDocumentTitle('Owner dashboard');
  const mode = useAppStore((s) => s.mode);
  const setMode = useAppStore((s) => s.setMode);
  const bookings = useAppStore((s) => s.bookings);
  const blockedSlots = useAppStore((s) => s.blockedSlots);
  const userName = useAppStore((s) => s.user.name);
  const toggleBlockedSlot = useAppStore((s) => s.toggleBlockedSlot);
  const venues = useVenues();
  const navigate = useNavigate();

  const dates = useMemo(() => nextDays(7), []);
  const [venueId, setVenueId] = useState(venues[0]?.id ?? '');
  const [date, setDate] = useState(dates[0]);
  const [addOpen, setAddOpen] = useState(false);

  const venue = venues.find((v) => v.id === venueId) ?? venues[0];
  const slots = useSlotStatuses(venue, date);

  const today = todayISO();
  const todayReports = useMemo(
    () => venues.map((v) => getVenueDayReport(v, today, bookings, blockedSlots, userName)),
    [venues, today, bookings, blockedSlots, userName],
  );
  const selectedReport = useMemo(
    () => (venue ? getVenueDayReport(venue, date, bookings, blockedSlots, userName) : undefined),
    [venue, date, bookings, blockedSlots, userName],
  );

  const totals = todayReports.reduce(
    (acc, r) => ({
      bookings: acc.bookings + r.bookedHours,
      revenue: acc.revenue + r.revenue,
      booked: acc.booked + r.bookedHours,
      capacity: acc.capacity + r.totalHours,
    }),
    { bookings: 0, revenue: 0, booked: 0, capacity: 0 },
  );
  const occupancyPct = totals.capacity ? Math.round((totals.booked / totals.capacity) * 100) : 0;
  const upcomingBlocked = blockedSlots.filter((key) => key.split('|')[1] >= today).length;

  if (mode !== 'owner') {
    return (
      <div className="container-page max-w-2xl">
        <EmptyState
          icon={<Store className="h-7 w-7" aria-hidden />}
          title="Venue owner dashboard"
          description="Switch to owner mode to see today's bookings, revenue and occupancy, and manage your slots."
          action={
            <Button
              onClick={() => {
                setMode('owner');
                toast.success('Switched to Venue Owner mode');
              }}
            >
              Switch to owner mode
            </Button>
          }
        />
      </div>
    );
  }

  const onSlotClick = (hour: number, status: SlotStatus) => {
    if (!venue || (status !== 'available' && status !== 'blocked')) return;
    const result = toggleBlockedSlot(venue.id, date, hour);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(
      result.value === 'blocked'
        ? `Blocked ${hourLabel(hour)} on ${formatLongDate(date)} — players can't book it`
        : `Unblocked ${hourLabel(hour)} — it's bookable again`,
    );
  };

  return (
    <div className="container-page">
      <PageHeader
        title="Owner dashboard"
        subtitle={`Today, ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} · ${venues.length} venues`}
        actions={
          <Button onClick={() => setAddOpen(true)} icon={<Plus className="h-4 w-4" aria-hidden />}>
            Add venue
          </Button>
        }
      />

      <section aria-label="Today at a glance" className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Slots booked today" value={totals.bookings} icon={<CalendarCheck className="h-5 w-5" aria-hidden />} hint="Across all venues" />
        <StatCard label="Revenue today" value={formatINR(totals.revenue)} icon={<IndianRupee className="h-5 w-5" aria-hidden />} />
        <StatCard
          label="Occupancy today"
          value={`${occupancyPct}%`}
          icon={<Percent className="h-5 w-5" aria-hidden />}
          hint={`${totals.booked} of ${totals.capacity} slot-hours`}
        />
        <StatCard label="Blocked slots" value={upcomingBlocked} icon={<Ban className="h-5 w-5" aria-hidden />} hint="Today onwards" />
      </section>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <section className="card p-4 lg:self-start" aria-labelledby="venues-heading">
          <h2 id="venues-heading" className="mb-1 px-3 font-bold">
            Occupancy today
          </h2>
          <p className="muted mb-3 px-3 text-xs">Select a venue to manage its slots.</p>
          <VenuePerformanceList
            reports={todayReports}
            selectedId={venue?.id ?? ''}
            onSelect={(id) => {
              setVenueId(id);
              document.getElementById('slot-manager')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          />
        </section>

        {venue && selectedReport && (
          <div className="min-w-0 space-y-6">
            <section id="slot-manager" className="card scroll-mt-24 p-5" aria-labelledby="slot-manager-heading">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 id="slot-manager-heading" className="font-bold">
                    Manage slots
                  </h2>
                  <label htmlFor="owner-venue" className="sr-only">
                    Venue
                  </label>
                  <select id="owner-venue" className="input mt-2 sm:max-w-sm" value={venue.id} onChange={(e) => setVenueId(e.target.value)}>
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} — {v.area}
                      </option>
                    ))}
                  </select>
                </div>
                <ButtonLink to={`/venue/${venue.id}`} variant="outline" size="sm" icon={<ExternalLink className="h-4 w-4" aria-hidden />}>
                  View listing
                </ButtonLink>
              </div>

              <DateStrip dates={dates} value={date} onChange={setDate} />

              <div className="my-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <p className="text-lg font-extrabold">{selectedReport.bookedHours}</p>
                  <p className="muted text-xs">Booked</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <p className="text-lg font-extrabold">{formatINR(selectedReport.revenue)}</p>
                  <p className="muted text-xs">Revenue</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <p className="text-lg font-extrabold">{Math.round(selectedReport.occupancy * 100)}%</p>
                  <p className="muted text-xs">Occupancy</p>
                </div>
              </div>

              <SlotGrid slots={slots} mode="owner" onSlotClick={onSlotClick} />
            </section>

            <section className="card p-5" aria-labelledby="day-bookings-heading">
              <h2 id="day-bookings-heading" className="font-bold">
                Bookings · {formatLongDate(date)}
              </h2>
              <p className="muted mb-2 text-xs">{venue.name}</p>
              <DayBookingsList entries={selectedReport.entries} />
            </section>
          </div>
        )}
      </div>

      <AddVenueModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={(created) => {
          setVenueId(created.id);
          toast.success(`${created.name} is live!`, {
            description: 'Players can find and book it now.',
            action: { label: 'View', onClick: () => navigate(`/venue/${created.id}`) },
          });
        }}
      />
    </div>
  );
}
