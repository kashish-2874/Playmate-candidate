import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link2, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { SKILL_LEVELS, SKILL_META, SPORT_META, SPORTS } from '../../data/sports';
import { useBookingGroups } from '../../hooks/useBookings';
import { useVenues } from '../../hooks/useVenues';
import { useAppStore } from '../../store/useAppStore';
import type { SkillLevel, Sport } from '../../types';
import { formatLongDate, hourLabel, hoursToRanges, isPastSlot, nextDays } from '../../utils/date';
import { formatINR } from '../../utils/format';
import { venueHours } from '../../utils/slots';
import { Button } from '../ui/Button';
import { FormField } from '../ui/FormField';
import { Modal } from '../ui/Modal';
import { Switch } from '../ui/Switch';

interface PostGameModalProps {
  open: boolean;
  onClose: () => void;
  /** Pre-links a booking (e.g. coming from the booking success screen). */
  initialBookingId?: string;
}

interface FormState {
  linkedBookingId: string;
  sport: Sport;
  venueId: string;
  date: string;
  hour: number;
  totalPlayers: string;
  playersJoined: string;
  skill: SkillLevel;
  beginnerFriendly: boolean;
  notes: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const NOTES_MAX = 200;

export function PostGameModal({ open, onClose, initialBookingId }: PostGameModalProps) {
  const venues = useVenues();
  const games = useAppStore((s) => s.games);
  const postGame = useAppStore((s) => s.postGame);
  const { upcoming } = useBookingGroups();
  const dates = useMemo(() => nextDays(7), []);

  // Only bookings that don't already have a game posted for them can be linked.
  const linkableBookings = useMemo(
    () => upcoming.filter((b) => !games.some((g) => g.linkedBookingId === b.id)),
    [upcoming, games],
  );

  const blankForm = (): FormState => ({
    linkedBookingId: '',
    sport: 'football',
    venueId: '',
    date: dates[0],
    hour: 18,
    totalPlayers: '10',
    playersJoined: '1',
    skill: 'intermediate',
    beginnerFriendly: false,
    notes: '',
  });

  const [form, setForm] = useState<FormState>(blankForm);
  const [errors, setErrors] = useState<Errors>({});

  const linkBooking = (bookingId: string, base: FormState): FormState => {
    const booking = linkableBookings.find((b) => b.id === bookingId);
    if (!booking) return { ...base, linkedBookingId: '' };
    return { ...base, linkedBookingId: booking.id, sport: booking.sport, venueId: booking.venueId, date: booking.date, hour: booking.hours[0] };
  };

  // Reset each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(initialBookingId ? linkBooking(initialBookingId, blankForm()) : blankForm());
    // Intentionally only on open: re-running when bookings change would wipe what the user typed.
  }, [open, initialBookingId]);

  const linked = linkableBookings.find((b) => b.id === form.linkedBookingId);
  const sportVenues = venues.filter((v) => v.sports.includes(form.sport));
  const venue = venues.find((v) => v.id === form.venueId);
  const hourOptions = venue ? venueHours(venue) : Array.from({ length: 17 }, (_, i) => i + 6);
  const totalPlayersNum = Number(form.totalPlayers);
  const costPerPlayer = linked && totalPlayersNum >= 2 ? linked.total / totalPlayersNum : undefined;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!form.venueId) next.venueId = 'Choose a venue.';
    if (!linked && isPastSlot(form.date, form.hour)) next.hour = 'Pick a time in the future.';
    const total = Number(form.totalPlayers);
    const joined = Number(form.playersJoined);
    if (!Number.isInteger(total) || total < 2 || total > 30) next.totalPlayers = 'Enter a number between 2 and 30.';
    if (!Number.isInteger(joined) || joined < 1) next.playersJoined = 'At least 1 (you).';
    else if (Number.isInteger(total) && joined >= total) next.playersJoined = 'Leave at least one spot open.';
    if (form.notes.length > NOTES_MAX) next.notes = `Keep it under ${NOTES_MAX} characters.`;
    return next;
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error('Please fix the highlighted fields.');
      const firstInvalid = document.querySelector<HTMLElement>('[data-post-game] [aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }
    postGame({
      sport: form.sport,
      venueId: form.venueId,
      date: form.date,
      hour: form.hour,
      skill: form.skill,
      beginnerFriendly: form.beginnerFriendly,
      totalPlayers: Number(form.totalPlayers),
      playersJoined: Number(form.playersJoined),
      notes: form.notes,
      linkedBookingId: linked?.id,
    });
    toast.success('Your game is live!', { description: 'Players can now request to join.' });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Post a game"
      description="Tell players what you're organising. It'll appear at the top of the list."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="post-game-form">
            Post game
          </Button>
        </>
      }
    >
      <form id="post-game-form" data-post-game noValidate onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField
            label="Link one of your bookings (optional)"
            hint={
              linkableBookings.length
                ? 'Linking fills in the venue and time, and splits the court cost between players.'
                : 'You have no upcoming bookings to link. Book a venue first to split its cost.'
            }
          >
            <select
              className="input"
              value={form.linkedBookingId}
              onChange={(e) => {
                const id = e.target.value;
                setForm((prev) => linkBooking(id, prev));
                setErrors({});
              }}
              disabled={linkableBookings.length === 0}
            >
              <option value="">Don't link a booking</option>
              {linkableBookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {venues.find((v) => v.id === b.venueId)?.name} · {formatLongDate(b.date)}, {hoursToRanges(b.hours)} ({formatINR(b.total)})
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {linked && (
          <p className="flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2.5 text-sm text-brand-900 sm:col-span-2 dark:bg-brand-500/10 dark:text-brand-200">
            <Link2 className="h-4 w-4 shrink-0" aria-hidden />
            Venue, date and time come from your booking.
          </p>
        )}

        <FormField label="Sport" required>
          <select
            className="input"
            value={form.sport}
            disabled={!!linked}
            onChange={(e) => {
              const sport = e.target.value as Sport;
              setForm((prev) => ({ ...prev, sport, venueId: venues.find((v) => v.id === prev.venueId)?.sports.includes(sport) ? prev.venueId : '' }));
            }}
          >
            {SPORTS.map((s) => (
              <option key={s} value={s}>
                {SPORT_META[s].label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Venue" required error={errors.venueId}>
          <select className="input" value={form.venueId} disabled={!!linked} onChange={(e) => set('venueId', e.target.value)}>
            <option value="">Select a venue</option>
            {sportVenues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — {v.area}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Date" required>
          <select className="input" value={form.date} disabled={!!linked} onChange={(e) => set('date', e.target.value)}>
            {(linked && !dates.includes(form.date) ? [form.date, ...dates] : dates).map((d) => (
              <option key={d} value={d}>
                {formatLongDate(d)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Start time" required error={errors.hour}>
          <select className="input" value={form.hour} disabled={!!linked} onChange={(e) => set('hour', Number(e.target.value))}>
            {hourOptions.map((h) => (
              <option key={h} value={h}>
                {hourLabel(h)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Total players needed" required error={errors.totalPlayers}>
          <input
            className="input"
            type="number"
            inputMode="numeric"
            min={2}
            max={30}
            value={form.totalPlayers}
            onChange={(e) => set('totalPlayers', e.target.value)}
          />
        </FormField>

        <FormField label="Players already in (incl. you)" required error={errors.playersJoined}>
          <input
            className="input"
            type="number"
            inputMode="numeric"
            min={1}
            value={form.playersJoined}
            onChange={(e) => set('playersJoined', e.target.value)}
          />
        </FormField>

        <FormField label="Skill level" required>
          <select className="input" value={form.skill} onChange={(e) => set('skill', e.target.value as SkillLevel)}>
            {SKILL_LEVELS.map((s) => (
              <option key={s} value={s}>
                {SKILL_META[s].label}
              </option>
            ))}
          </select>
        </FormField>

        <div className="flex items-end pb-1">
          <Switch
            checked={form.beginnerFriendly}
            onChange={(v) => set('beginnerFriendly', v)}
            label="Beginner friendly"
            description="New players are welcome"
          />
        </div>

        <div className="sm:col-span-2">
          <FormField label="Notes" error={errors.notes} hint={`${form.notes.length}/${NOTES_MAX} · e.g. format, what to bring`}>
            <textarea
              className="input min-h-20 resize-y"
              value={form.notes}
              maxLength={NOTES_MAX + 20}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="5-a-side, bring a light and a dark tee"
            />
          </FormField>
        </div>

        {costPerPlayer !== undefined && (
          <p className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm sm:col-span-2 dark:border-brand-500/30 dark:bg-brand-500/10">
            <Wallet className="h-4 w-4 text-brand-600" aria-hidden />
            Split the cost: <strong>{formatINR(costPerPlayer)} per player</strong>
            <span className="muted ml-auto text-xs">
              {formatINR(linked!.total)} ÷ {totalPlayersNum}
            </span>
          </p>
        )}
      </form>
    </Modal>
  );
}
