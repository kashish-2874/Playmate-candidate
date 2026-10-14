import type { PlayedGame, Sport, UserProfile } from '../types';
import { relativeISO } from '../utils/date';

const HISTORY_PLAN: Array<[Sport, number]> = [
  ['football', -12],
  ['badminton', -19],
  ['football', -26],
  ['football', -33],
  ['badminton', -41],
  ['cricket', -48],
  ['football', -55],
  ['badminton', -63],
  ['football', -78],
  ['tennis', -90],
  ['football', -104],
  ['badminton', -118],
  ['cricket', -132],
  ['football', -150],
];

export function createSeedUser(): UserProfile {
  const history: PlayedGame[] = HISTORY_PLAN.map(([sport, offset]) => ({ sport, date: relativeISO(offset) }));
  return {
    name: 'Arjun Mehta',
    city: 'Bengaluru',
    avatarColor: 'bg-emerald-500',
    sports: ['football', 'badminton', 'cricket'],
    memberSince: relativeISO(-210),
    history,
  };
}
