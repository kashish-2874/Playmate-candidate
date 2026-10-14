import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { SPORT_META, SPORTS } from '../../data/sports';
import { useAppStore } from '../../store/useAppStore';
import type { Sport, Venue } from '../../types';
import { hourLabel } from '../../utils/date';
import { Button } from '../ui/Button';
import { FormField } from '../ui/FormField';
import { Modal } from '../ui/Modal';
import { SportIcon } from '../ui/SportBadge';
import { ToggleChip } from '../ui/ToggleChip';

interface AddVenueModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (venue: Venue) => void;
}

const INITIAL = { name: '', area: '', price: '800', openHour: 6, closeHour: 22, description: '' };
type Errors = Partial<Record<'name' | 'area' | 'price' | 'closeHour' | 'description' | 'sports', string>>;

const HOURS = Array.from({ length: 25 }, (_, i) => i);

export function AddVenueModal({ open, onClose, onCreated }: AddVenueModalProps) {
  const addVenue = useAppStore((s) => s.addVenue);
  const [form, setForm] = useState(INITIAL);
  const [sports, setSports] = useState<Sport[]>([]);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!open) return;
    setForm(INITIAL);
    setSports([]);
    setErrors({});
  }, [open]);

  const set = <K extends keyof typeof INITIAL>(key: K, value: (typeof INITIAL)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: Errors = {};
    const price = Number(form.price);
    if (form.name.trim().length < 3) next.name = 'Enter a venue name (3+ characters).';
    if (form.area.trim().length < 2) next.area = 'Enter the area or locality.';
    if (!Number.isFinite(price) || price < 100 || price > 10000) next.price = 'Price must be between ₹100 and ₹10,000.';
    if (form.closeHour - form.openHour < 2) next.closeHour = 'Closing time must be at least 2 hours after opening.';
    if (sports.length === 0) next.sports = 'Pick at least one sport.';
    if (form.description.trim().length < 20) next.description = 'Add a short description (20+ characters).';
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    const venue = addVenue({
      name: form.name,
      area: form.area,
      sports,
      pricePerHour: Math.round(price),
      openHour: form.openHour,
      closeHour: form.closeHour,
      description: form.description,
    });
    onCreated(venue);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a venue"
      description="List a new turf or court. It goes live for players immediately."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="add-venue-form">
            Publish venue
          </Button>
        </>
      }
    >
      <form id="add-venue-form" noValidate onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Venue name" required error={errors.name}>
          <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Goal Rush Arena" data-autofocus />
        </FormField>
        <FormField label="Area" required error={errors.area}>
          <input className="input" value={form.area} onChange={(e) => set('area', e.target.value)} placeholder="e.g. Bellandur" />
        </FormField>

        <fieldset className="sm:col-span-2">
          <legend className="label">
            Sports<span className="ml-0.5 text-rose-500" aria-hidden>*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {SPORTS.map((sport) => (
              <ToggleChip
                key={sport}
                selected={sports.includes(sport)}
                onToggle={() => {
                  setSports((prev) => (prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]));
                  setErrors((e) => ({ ...e, sports: undefined }));
                }}
                icon={<SportIcon sport={sport} className="h-3.5 w-3.5" />}
              >
                {SPORT_META[sport].label}
              </ToggleChip>
            ))}
          </div>
          {errors.sports && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
              {errors.sports}
            </p>
          )}
        </fieldset>

        <FormField label="Price per hour (₹)" required error={errors.price}>
          <input className="input" type="number" inputMode="numeric" min={100} step={50} value={form.price} onChange={(e) => set('price', e.target.value)} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Opens" required>
            <select className="input" value={form.openHour} onChange={(e) => set('openHour', Number(e.target.value))}>
              {HOURS.slice(0, 23).map((h) => (
                <option key={h} value={h}>
                  {hourLabel(h)}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Closes" required error={errors.closeHour}>
            <select className="input" value={form.closeHour} onChange={(e) => set('closeHour', Number(e.target.value))}>
              {HOURS.slice(1).map((h) => (
                <option key={h} value={h}>
                  {h === 24 ? 'Midnight' : hourLabel(h)}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField label="Description" required error={errors.description} hint="Surface, format, what makes it special.">
            <textarea className="input min-h-24 resize-y" value={form.description} onChange={(e) => set('description', e.target.value)} />
          </FormField>
        </div>
      </form>
    </Modal>
  );
}
