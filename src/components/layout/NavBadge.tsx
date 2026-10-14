import { useUpcomingCount } from '../../hooks/useBookings';
import { cn } from '../../utils/cn';

/** Count of upcoming bookings, shown on the Bookings nav item. */
export function NavBadge({ className }: { className?: string }) {
  const count = useUpcomingCount();
  if (count === 0) return null;
  return (
    <span
      className={cn(
        'grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold leading-none text-white',
        className,
      )}
    >
      {count}
      <span className="sr-only"> upcoming</span>
    </span>
  );
}
