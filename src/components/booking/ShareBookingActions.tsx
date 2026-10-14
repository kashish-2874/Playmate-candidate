import { CalendarPlus, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Booking, Venue } from '../../types';
import { formatLongDate, hoursToRanges } from '../../utils/date';
import { buildICS, copyToClipboard, downloadFile } from '../../utils/ics';
import { SPORT_META } from '../../data/sports';
import { Button } from '../ui/Button';

interface ShareBookingActionsProps {
  booking: Booking;
  venue: Venue;
}

export function ShareBookingActions({ booking, venue }: ShareBookingActionsProps) {
  const sportLabel = SPORT_META[booking.sport].label;

  const onCopy = async () => {
    const url = `${window.location.origin}/venue/${venue.id}`;
    const text = `${sportLabel} at ${venue.name} — ${formatLongDate(booking.date)}, ${hoursToRanges(booking.hours)}. Join me! ${url}`;
    const copied = await copyToClipboard(text);
    if (copied) toast.success('Booking link copied — paste it in your group chat');
    else toast.error('Could not access the clipboard. Please copy the link from the address bar.');
  };

  const onCalendar = () => {
    const ics = buildICS({
      uid: booking.id,
      title: `${sportLabel} at ${venue.name}`,
      description: `PlayMate booking ${booking.id}\n${hoursToRanges(booking.hours)}`,
      location: venue.address,
      date: booking.date,
      startHour: booking.hours[0],
      endHour: booking.hours[booking.hours.length - 1] + 1,
    });
    downloadFile(`playmate-${venue.id}-${booking.date}.ics`, ics);
    toast.success('Calendar event downloaded', { description: 'Open the .ics file to add it to your calendar.' });
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" onClick={onCopy} icon={<Link2 className="h-4 w-4" aria-hidden />}>
        Copy link
      </Button>
      <Button variant="outline" onClick={onCalendar} icon={<CalendarPlus className="h-4 w-4" aria-hidden />}>
        Add to calendar
      </Button>
    </div>
  );
}
