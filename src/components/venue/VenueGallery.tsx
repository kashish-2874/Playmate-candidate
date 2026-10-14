import { useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { SafeImage } from '../ui/SafeImage';

interface VenueGalleryProps {
  images: string[];
  name: string;
}

/** Carousel with arrow buttons, keyboard support and thumbnail strip. */
export function VenueGallery({ images, name }: VenueGalleryProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') go(-1);
    if (event.key === 'ArrowRight') go(1);
  };

  return (
    <section aria-roledescription="carousel" aria-label={`${name} photos`} className="space-y-3">
      <div
        className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-200 outline-none dark:bg-slate-800"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {images.map((src, i) => (
          <div
            key={src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            className={cn('absolute inset-0 transition-opacity duration-500', i === index ? 'opacity-100' : 'opacity-0')}
          >
            <SafeImage src={src} alt={`${name} photo ${i + 1}`} className="h-full w-full" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow-md hover:bg-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow-md hover:bg-white"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-semibold text-white" aria-live="polite">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'h-16 w-24 overflow-hidden rounded-xl ring-2 transition-all',
                i === index ? 'ring-brand-500' : 'opacity-70 ring-transparent hover:opacity-100',
              )}
            >
              <SafeImage src={src.replace('w=1200', 'w=200')} alt="" className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
