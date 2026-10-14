import type { Sport } from '../types';

/** Builds a hotlink-safe Unsplash CDN URL with sensible defaults. */
export function unsplash(id: string, width = 1200): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=70`;
}

/** Verified photo IDs grouped by sport. */
export const SPORT_IMAGES: Record<Sport, string[]> = {
  football: [
    '1574629810360-7efbbe195018',
    '1529900748604-07564a03e7a6',
    '1431324155629-1a6deb1dec8d',
    '1459865264687-595d652de67e',
    '1551958219-acbc608c6377',
    '1579952363873-27f3bade9f55',
    '1575361204480-aadea25e6e68',
    '1531861218190-f90c89febf69',
  ],
  cricket: ['1531415074968-036ba1b575da', '1540747913346-19e32dc3e97e', '1624526267942-ab0ff8a3e972'],
  badminton: ['1626224583764-f87db24ac4ea', '1599474924187-334a4ae5bd3c'],
  tennis: [
    '1554068865-24cecd4e34b8',
    '1595435934249-5df7ed86e1c0',
    '1622279457486-62dcc4a431d6',
    '1587280501635-68a0e82cd5ff',
    '1530915534664-4ac6423816b7',
    '1560012057-4372e14c5085',
    '1558365849-6ebd8b0454b2',
  ],
  basketball: [
    '1546519638-68e109498ffc',
    '1504450758481-7338eba7524a',
    '1519861531473-9200262188bf',
    '1521412644187-c49fa049e84d',
  ],
};

export function defaultImagesFor(sports: Sport[]): string[] {
  const ids = sports.flatMap((sport) => SPORT_IMAGES[sport].slice(0, 2));
  return ids.slice(0, 3).map((id) => unsplash(id));
}
