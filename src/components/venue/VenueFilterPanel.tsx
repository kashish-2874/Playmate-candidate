import { Heart, RotateCcw } from 'lucide-react';
import { SPORT_META, SPORTS } from '../../data/sports';
import { DISTANCE_MAX, PRICE_MAX, type VenueFilterState } from '../../hooks/useVenueFilters';
import type { Sport } from '../../types';
import { formatINR } from '../../utils/format';
import { RangeSlider } from '../ui/RangeSlider';
import { SportIcon } from '../ui/SportBadge';
import { Switch } from '../ui/Switch';
import { ToggleChip } from '../ui/ToggleChip';

interface VenueFilterPanelProps {
  filters: VenueFilterState;
  activeCount: number;
  savedCount: number;
  onToggleSport: (sport: Sport) => void;
  onChange: <K extends keyof VenueFilterState>(key: K, value: VenueFilterState[K]) => void;
  onReset: () => void;
}

export function VenueFilterPanel({ filters, activeCount, savedCount, onToggleSport, onChange, onReset }: VenueFilterPanelProps) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Sport</legend>
        <div className="flex flex-wrap gap-2">
          {SPORTS.map((sport) => (
            <ToggleChip
              key={sport}
              selected={filters.sports.includes(sport)}
              onToggle={() => onToggleSport(sport)}
              icon={<SportIcon sport={sport} className="h-3.5 w-3.5" />}
            >
              {SPORT_META[sport].label}
            </ToggleChip>
          ))}
        </div>
      </fieldset>

      <RangeSlider
        label="Max distance"
        min={1}
        max={DISTANCE_MAX}
        step={1}
        value={filters.maxDistance}
        onChange={(v) => onChange('maxDistance', v)}
        formatValue={(v) => (v === DISTANCE_MAX ? 'Any' : `${v} km`)}
      />

      <RangeSlider
        label="Max price / hour"
        min={300}
        max={PRICE_MAX}
        step={100}
        value={filters.maxPrice}
        onChange={(v) => onChange('maxPrice', v)}
        formatValue={(v) => (v === PRICE_MAX ? 'Any' : formatINR(v))}
      />

      <div className="flex items-center gap-2">
        <Switch
          checked={filters.savedOnly}
          onChange={(v) => onChange('savedOnly', v)}
          label="Saved venues only"
          description={`${savedCount} saved`}
        />
        <Heart className="ml-auto h-4 w-4 fill-rose-500 text-rose-500" aria-hidden />
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={activeCount === 0}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline dark:text-brand-400 dark:disabled:text-slate-600"
      >
        <RotateCcw className="h-4 w-4" aria-hidden />
        Reset filters{activeCount > 0 && ` (${activeCount})`}
      </button>
    </div>
  );
}
