import { SKILL_LEVELS, SKILL_META, SPORT_META, SPORTS } from '../../data/sports';
import type { SkillLevel, Sport } from '../../types';
import { SportIcon } from '../ui/SportBadge';
import { Switch } from '../ui/Switch';
import { ToggleChip } from '../ui/ToggleChip';

export interface GameFilters {
  sport: Sport | 'all';
  skill: SkillLevel | 'all';
  beginnerOnly: boolean;
}

export const DEFAULT_GAME_FILTERS: GameFilters = { sport: 'all', skill: 'all', beginnerOnly: false };

interface GameFilterBarProps {
  filters: GameFilters;
  onChange: (filters: GameFilters) => void;
}

export function GameFilterBar({ filters, onChange }: GameFilterBarProps) {
  return (
    <div className="space-y-4">
      <div role="group" aria-label="Filter by sport" className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <ToggleChip selected={filters.sport === 'all'} onToggle={() => onChange({ ...filters, sport: 'all' })}>
          All sports
        </ToggleChip>
        {SPORTS.map((sport) => (
          <ToggleChip
            key={sport}
            selected={filters.sport === sport}
            onToggle={() => onChange({ ...filters, sport: filters.sport === sport ? 'all' : sport })}
            icon={<SportIcon sport={sport} className="h-3.5 w-3.5" />}
          >
            {SPORT_META[sport].label}
          </ToggleChip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          <label htmlFor="skill-filter" className="text-sm font-medium">
            Skill level
          </label>
          <select
            id="skill-filter"
            className="input h-9 w-auto py-1.5"
            value={filters.skill}
            onChange={(e) => onChange({ ...filters, skill: e.target.value as GameFilters['skill'] })}
          >
            <option value="all">Any level</option>
            {SKILL_LEVELS.map((s) => (
              <option key={s} value={s}>
                {SKILL_META[s].label}
              </option>
            ))}
          </select>
        </div>
        <Switch
          checked={filters.beginnerOnly}
          onChange={(v) => onChange({ ...filters, beginnerOnly: v })}
          label="Beginner friendly only"
        />
      </div>
    </div>
  );
}
