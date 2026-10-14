/** All dates in the app are local-time ISO dates (YYYY-MM-DD). */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** ISO date `offset` days from today (negative for the past). */
export function relativeISO(offset: number): string {
  return toISODate(addDays(new Date(), offset));
}

export function nextDays(count: number): string[] {
  return Array.from({ length: count }, (_, i) => relativeISO(i));
}

export function formatDayShort(iso: string): { weekday: string; day: string; month: string } {
  const date = parseISODate(iso);
  return {
    weekday: iso === todayISO() ? 'Today' : date.toLocaleDateString('en-IN', { weekday: 'short' }),
    day: String(date.getDate()),
    month: date.toLocaleDateString('en-IN', { month: 'short' }),
  };
}

export function formatLongDate(iso: string): string {
  if (iso === todayISO()) return 'Today';
  if (iso === relativeISO(1)) return 'Tomorrow';
  return parseISODate(iso).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function hourLabel(hour: number): string {
  const h = hour % 24;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${suffix}`;
}

/** Groups hours into readable ranges, e.g. [6,7,9] -> "6:00 AM – 8:00 AM, 9:00 AM – 10:00 AM". */
export function hoursToRanges(hours: number[]): string {
  if (hours.length === 0) return '';
  const sorted = [...hours].sort((a, b) => a - b);
  const ranges: Array<[number, number]> = [];
  for (const h of sorted) {
    const last = ranges[ranges.length - 1];
    if (last && last[1] === h) last[1] = h + 1;
    else ranges.push([h, h + 1]);
  }
  return ranges.map(([s, e]) => `${hourLabel(s)} – ${hourLabel(e)}`).join(', ');
}

export function slotStart(iso: string, hour: number): Date {
  const date = parseISODate(iso);
  date.setHours(hour, 0, 0, 0);
  return date;
}

/** A slot is "past" once its start time has passed. */
export function isPastSlot(iso: string, hour: number, now = new Date()): boolean {
  return slotStart(iso, hour).getTime() <= now.getTime();
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'short' });
}

/** Last `count` month keys ending with the current month, oldest first. */
export function recentMonthKeys(count: number): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) =>
    monthKey(toISODate(new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1))),
  );
}
