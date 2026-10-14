import { CheckCircle2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Booking, Venue } from '../../types';
import { formatLongDate, hoursToRanges } from '../../utils/date';
import { formatINR } from '../../utils/format';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ShareBookingActions } from './ShareBookingActions';

interface BookingSuccessModalProps {
  booking: Booking | null;
  venue: Venue;
  onClose: () => void;
}

export function BookingSuccessModal({ booking, venue, onClose }: BookingSuccessModalProps) {
  const navigate = useNavigate();
  if (!booking) return null;

  return (
    <Modal
      open
      onClose={onClose}
      title="Booking confirmed!"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
          <Button onClick={() => navigate('/bookings')} data-autofocus>
            View my bookings
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center">
        <div className="grid h-16 w-16 animate-scale-in place-items-center rounded-full bg-brand-100 dark:bg-brand-500/15">
          <CheckCircle2 className="h-9 w-9 text-brand-600 dark:text-brand-400" aria-hidden />
        </div>
        <p className="mt-4 font-semibold">{venue.name}</p>
        <p className="muted text-sm">
          {formatLongDate(booking.date)} · {hoursToRanges(booking.hours)}
        </p>
        <p className="mt-2 text-sm">
          Paid <span className="font-bold">{formatINR(booking.total)}</span> · Booking ID{' '}
          <span className="font-mono text-xs">{booking.id.toUpperCase()}</span>
        </p>
      </div>
      <div className="mt-5 space-y-2">
        <ShareBookingActions booking={booking} venue={venue} />
        <Button
          variant="ghost"
          className="w-full text-brand-700 dark:text-brand-400"
          icon={<Users className="h-4 w-4" aria-hidden />}
          onClick={() => navigate(`/players?post=${booking.id}`)}
        >
          Need players? Post a game & split the cost
        </Button>
      </div>
    </Modal>
  );
}
