import type { Amenity, SkillLevel, Sport } from '../types';

export const SPORTS: Sport[] = ['football', 'cricket', 'badminton', 'tennis', 'basketball'];

export const SPORT_META: Record<Sport, { label: string; badgeClass: string; barClass: string }> = {
  football: {
    label: 'Football',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
    barClass: 'bg-emerald-500',
  },
  cricket: {
    label: 'Cricket',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    barClass: 'bg-amber-500',
  },
  badminton: {
    label: 'Badminton',
    badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
    barClass: 'bg-sky-500',
  },
  tennis: {
    label: 'Tennis',
    badgeClass: 'bg-lime-100 text-lime-800 dark:bg-lime-500/15 dark:text-lime-300',
    barClass: 'bg-lime-500',
  },
  basketball: {
    label: 'Basketball',
    badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300',
    barClass: 'bg-orange-500',
  },
};

export const SKILL_META: Record<SkillLevel, { label: string; badgeClass: string }> = {
  beginner: {
    label: 'Beginner',
    badgeClass: 'bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300',
  },
  intermediate: {
    label: 'Intermediate',
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300',
  },
  advanced: {
    label: 'Advanced',
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
  },
};

export const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];

export const AMENITY_LABELS: Record<Amenity, string> = {
  parking: 'Parking',
  floodlights: 'Floodlights',
  'changing-room': 'Changing room',
  showers: 'Showers',
  'drinking-water': 'Drinking water',
  cafeteria: 'Cafeteria',
  'equipment-rental': 'Equipment rental',
  'first-aid': 'First aid',
  wifi: 'Wi-Fi',
};

export const AVATAR_COLORS = [
  'bg-emerald-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-fuchsia-500',
];
