import { useEffect, useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { AVATAR_COLORS, SPORT_META, SPORTS } from '../../data/sports';
import { useAppStore } from '../../store/useAppStore';
import type { Sport } from '../../types';
import { cn } from '../../utils/cn';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { FormField } from '../ui/FormField';
import { Modal } from '../ui/Modal';
import { SportIcon } from '../ui/SportBadge';
import { ToggleChip } from '../ui/ToggleChip';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const user = useAppStore((s) => s.user);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const [name, setName] = useState(user.name);
  const [city, setCity] = useState(user.city);
  const [sports, setSports] = useState<Sport[]>(user.sports);
  const [avatarColor, setAvatarColor] = useState(user.avatarColor);
  const [errors, setErrors] = useState<{ name?: string; sports?: string }>({});

  useEffect(() => {
    if (!open) return;
    setName(user.name);
    setCity(user.city);
    setSports(user.sports);
    setAvatarColor(user.avatarColor);
    setErrors({});
  }, [open, user]);

  const toggleSport = (sport: Sport) => {
    setSports((prev) => (prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]));
    setErrors((e) => ({ ...e, sports: undefined }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    const next: typeof errors = {};
    if (trimmed.length < 2) next.name = 'Name must be at least 2 characters.';
    else if (trimmed.length > 40) next.name = 'Name must be 40 characters or fewer.';
    if (sports.length === 0) next.sports = 'Pick at least one sport.';
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    updateProfile({ name: trimmed, city: city.trim() || 'Bengaluru', sports, avatarColor });
    toast.success('Profile updated');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit profile"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="edit-profile-form">
            Save changes
          </Button>
        </>
      }
    >
      <form id="edit-profile-form" noValidate onSubmit={onSubmit} className="space-y-5">
        <fieldset>
          <legend className="label">Avatar colour</legend>
          <div className="flex flex-wrap items-center gap-3">
            <Avatar name={name || user.name} colorClass={avatarColor} size="md" />
            {AVATAR_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setAvatarColor(color)}
                aria-label={`Avatar colour ${color.replace('bg-', '').replace('-500', '')}`}
                aria-pressed={avatarColor === color}
                className={cn('grid h-8 w-8 place-items-center rounded-full ring-offset-2 transition-transform hover:scale-110 dark:ring-offset-slate-900', color, avatarColor === color && 'ring-2 ring-slate-900 dark:ring-white')}
              >
                {avatarColor === color && <Check className="h-4 w-4 text-white" aria-hidden />}
              </button>
            ))}
          </div>
        </fieldset>

        <FormField label="Full name" required error={errors.name}>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" data-autofocus />
        </FormField>

        <FormField label="City">
          <input className="input" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" />
        </FormField>

        <fieldset aria-describedby={errors.sports ? 'sports-error' : undefined}>
          <legend className="label">
            Sports you play<span className="ml-0.5 text-rose-500" aria-hidden>*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {SPORTS.map((sport) => (
              <ToggleChip key={sport} selected={sports.includes(sport)} onToggle={() => toggleSport(sport)} icon={<SportIcon sport={sport} className="h-3.5 w-3.5" />}>
                {SPORT_META[sport].label}
              </ToggleChip>
            ))}
          </div>
          {errors.sports && (
            <p id="sports-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
              {errors.sports}
            </p>
          )}
        </fieldset>
      </form>
    </Modal>
  );
}
