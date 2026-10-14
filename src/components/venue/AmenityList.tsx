import {
  BriefcaseMedical,
  CircleParking,
  Coffee,
  Droplets,
  Lightbulb,
  Package,
  Shirt,
  ShowerHead,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { AMENITY_LABELS } from '../../data/sports';
import type { Amenity } from '../../types';

const AMENITY_ICONS: Record<Amenity, LucideIcon> = {
  parking: CircleParking,
  floodlights: Lightbulb,
  'changing-room': Shirt,
  showers: ShowerHead,
  'drinking-water': Droplets,
  cafeteria: Coffee,
  'equipment-rental': Package,
  'first-aid': BriefcaseMedical,
  wifi: Wifi,
};

export function AmenityList({ amenities }: { amenities: Amenity[] }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {amenities.map((amenity) => {
        const Icon = AMENITY_ICONS[amenity];
        return (
          <li
            key={amenity}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-medium dark:bg-slate-800/70"
          >
            <Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden />
            {AMENITY_LABELS[amenity]}
          </li>
        );
      })}
    </ul>
  );
}
