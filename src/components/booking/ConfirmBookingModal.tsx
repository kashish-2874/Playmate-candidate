import { CalendarDays, Clock, MapPin } from 'lucide-react';
import type { Sport, Venue } from '../../types';
import { formatLongDate, hoursToRanges } from '../../utils/date';
import { formatINR, pluralize } from '../../utils/format';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { SportBadge } from '../ui/SportBadge';

interface ConfirmBookingModalProps {
  open: boolean;
  venue: Venue;
  sport: Sport;
  date: string;
  hours: number[];
  submitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmBookingModal({ open, venue, sport, date, hours, submitting, onConfirm, onClose }: ConfirmBookingModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      dismissible={!submitting}
      title="Confirm your booking"
      description="Please review the details before confirming."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Go back
          </Button>
          <Button onClick={onConfirm} loading={submitting} data-autofocus>
            Confirm & pay {formatINR(venue.pricePerHour * hours.length)}
          </Button>
        </>
      }
    >
      <dl className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
          <div>
            <dt className="sr-only">Venue</dt>
            <dd className="font-semibold">{venue.name}</dd>
            <dd className="muted">{venue.address}</dd>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-brand-600" aria-hidden />
          <dt className="sr-only">Date</dt>
          <dd>{formatLongDate(date)}</dd>
          <SportBadge sport={sport} className="ml-auto" />
        </div>
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
          <dt className="sr-only">Time</dt>
          <dd>
            {hoursToRanges(hours)} <span className="muted">({pluralize(hours.length, 'hour')})</span>
          </dd>
        </div>
      </dl>
      <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800/60">
        <div className="flex justify-between">
          <span className="muted">
            {formatINR(venue.pricePerHour)} × {pluralize(hours.length, 'hour')}
          </span>
          <span>{formatINR(venue.pricePerHour * hours.length)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-base font-bold dark:border-slate-700">
          <span>Total payable</span>
          <span>{formatINR(venue.pricePerHour * hours.length)}</span>
        </div>
      </div>
      <p className="muted mt-3 text-xs">Free cancellation up to the start time. This is a demo — no payment is taken.</p>
    </Modal>
  );
}
